import React, { Component } from 'react';
import Signin from './components/signin';
import Board from './components/board';
import Loading from './components/loading';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import { firebase } from './constants';
import './css/app.css';

class App extends Component {
	constructor() {
		super();
		this.state = {
			user: null,
			isValidating: true,
			redirectToLogin: false
		};
	}

	componentDidMount() {
		firebase.auth().onAuthStateChanged((user) =>{
			if(user) {
				this.setState({ isValidating: false, user: user, redirectToLogin: false });
			} else {
				this.setState({ user: null, isValidating: false, redirectToLogin: true });
			}
		});
	}

	render() {
		return (
			<Router>
				<div className="app">
					<Route exact strict path="/signin" component={Signin} />
					<Route exact strict path="/board" render={() => <Board user={this.state.user} />} />
					{
						this.state.isValidating &&
						<Loading />
					}
					{
						this.state.redirectToLogin &&
						<Redirect to="/signin" />
					}
					{
						this.state.user &&
						<Redirect to="/board" />
					}
				</div>
			</Router>
			
		);
	}
}

export default App;
