import React, { Component } from 'react';
import firebaseui from 'firebaseui';
import { firebase, firestore } from '../constants';
import 'firebaseui/dist/firebaseui.css';
import '../css/signin.css';

class Signin extends Component {

	constructor() {
		super();
		const uiConfig = {
			callbacks: {
				signInSuccessWithAuthResult: function(authResult) {
					const userInfo = {
						name: authResult.user.displayName,
						userId: authResult.user.uid,
					};
					if (authResult.additionalUserInfo.isNewUser) {
						firestore.collection('users').doc(userInfo.userId).set({
							...userInfo
						});
					}
					return false;
				},
			},
			signInFlow: 'popup',
			signInOptions: [
				firebase.auth.EmailAuthProvider.PROVIDER_ID,
				firebase.auth.GoogleAuthProvider.PROVIDER_ID,
			],
		};
		let uiInstance = firebaseui.auth.AuthUI.getInstance();
		if (uiInstance) {
			uiInstance.reset();
		} else {
			uiInstance = new firebaseui.auth.AuthUI(firebase.auth());
		}
		uiInstance.start('#firebase-login', uiConfig);
	}

	render() {
		return (
			<div className="login-wrapper">
				<div id="firebase-login">
				</div>
			</div>
		);
	}
}

export default Signin;
