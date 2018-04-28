import React, { Component } from 'react';
import TaskList from './task-list';
import { firestore, listType, firebase } from '../constants';
import { Redirect } from 'react-router';
import PropTypes from 'prop-types';
import '../css/board.css';

class Board extends Component {

	constructor() {
		super();
		this.state = {
			toDoList: [],
			inProgressList: [],
			doneList: []
		};

		this.addItemToBoard = this.addItemToBoard.bind(this);
		this.signOutUser = this.signOutUser.bind(this);
	}

	componentDidMount() {
		if(this.props.user) {
			this.dataListnerunsubscribe = firestore.collection('bord-items')
				.where('userId', '==', this.props.user.uid)
				.onSnapshot((querySnapshot) => {
					const { toDoList, inProgressList, doneList } = this.state;
					querySnapshot.docChanges.forEach((change) => {
						if (change.type === 'added') {
							const data = change.doc.data();
							switch (data.type) {
							case listType.TO_DO: toDoList.push({ ...data, id: change.doc.id }); break;
							case listType.IN_PROGRESS: inProgressList.push({ ...data, id: change.doc.id }); break;
							case listType.DONE: doneList.push({ ...data, id: change.doc.id }); break;
							default: console.error('unknown type', data.type, data); // eslint-disable-line no-console
							}	
						}
					});
					this.setState({ toDoList, inProgressList, doneList });
				});
		}
	}

	signOutUser() {
		if (typeof this.dataListnerunsubscribe === 'function') {
			this.dataListnerunsubscribe();
		}
		firebase.auth().signOut();
	}

	addItemToBoard(type, content, position) {
		firestore.collection('bord-items').add({
			userId: this.props.user.uid,
			content,
			type,
			position
		});
	}

	render() {
		return this.props.user ? (
			<div className="task-board">
				<div className="board-header">
					{this.props.user.displayName}
					<button className="sign-out" onClick={this.signOutUser}>Sign out</button>
				</div>
				<div className="bord-lists">
					<TaskList listHeader="To Do" listItems={this.state.toDoList} listType={listType.TO_DO} addItemToBoard={this.addItemToBoard} />
					<TaskList listHeader="In Progress" listItems={this.state.inProgressList} listType={listType.IN_PROGRESS} addItemToBoard={this.addItemToBoard} />
					<TaskList listHeader="Done" listItems={this.state.doneList} listType={listType.DONE} addItemToBoard={this.addItemToBoard} />
				</div>
			</div>
		) : (
			<Redirect to="/" />
		);
		
	}
}

Board.propTypes = {
	user: PropTypes.shape({
		uid: PropTypes.string.isRequired,
		displayName: PropTypes.string.isRequired,
	})
};

export default Board;