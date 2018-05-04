import React, { Component } from 'react';
import TaskList from './task-list';
import { firestore, listType, firebase } from '../constants';
import { Redirect } from 'react-router';
import PropTypes from 'prop-types';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import uuidv4 from 'uuid/v4';
import '../css/board.css';

class Board extends Component {

	constructor() {
		super();
		this.state = {
			bordItems: [],
		};

		this.addItemToBoard = this.addItemToBoard.bind(this);
		this.signOutUser = this.signOutUser.bind(this);
		this.removeItem = this.removeItem.bind(this);
		this.moveCard = this.moveCard.bind(this);
	}

	componentDidMount() {
		if(this.props.user) {
			this.dataListnerunsubscribe = firestore.collection('bord-items')
				.where('userId', '==', this.props.user.uid)
				.onSnapshot((querySnapshot) => {
					const { bordItems } = this.state;
					querySnapshot.docChanges.forEach((change) => {
						const data = change.doc.data();
						if (change.type === 'added') {
							bordItems.push({ ...data });
						} else if (change.type === 'removed') {
							bordItems.splice(bordItems.findIndex(e => e.id === data.id), 1);
						} else if (change.type === 'modified') {
							bordItems.splice(bordItems.findIndex(e => e.id === data.id), 1, data);
						}
					});
					this.setState({ bordItems });
				});
		}
	}

	signOutUser() {
		if (typeof this.dataListnerunsubscribe === 'function') {
			this.dataListnerunsubscribe();
		}
		firebase.auth().signOut();
	}

	removeItem(item, listItems) {
		const batch = firestore.batch();
		batch.delete(firestore.collection('bord-items').doc(item.id));
		const itemsToUpdate = listItems.filter(e => e.position > item.position);
		itemsToUpdate.forEach(e => {
			batch.set(firestore.collection('bord-items').doc(e.id), {
				...e,
				position: e.position - 1,
			});
		});
		batch.commit();
	}

	addItemToBoard(type, content, position) {
		const id = uuidv4();
		return firestore.collection('bord-items').doc(id).set({
			userId: this.props.user.uid,
			content,
			type,
			position,
			id
		});
	}

	moveCard(id, sourcePosition, sourceType, destinationPosition, destinationType) {
		const sourceList = this.state.bordItems.filter(e => e.type === sourceType);
		const item = sourceList.find(e => e.id === id);
		const batch = firestore.batch();
		batch.set(firestore.collection('bord-items').doc(id), {...item, position: destinationPosition, type: destinationType});
		let itemsToMoveDown = [], itemsToMoveUp = [];
		if (sourceType === destinationType) {
			if (sourcePosition > destinationPosition) {
				itemsToMoveDown = sourceList.filter(e => (e.position < sourcePosition && e.position >= destinationPosition));
			} else if (sourcePosition < destinationPosition) {
				itemsToMoveUp = sourceList.filter(e => (e.position > sourcePosition && e.position <= destinationPosition));
			}
		} else {
			itemsToMoveUp = sourceList.filter(e => e.position > sourcePosition);
			const destinationList = this.state.bordItems.filter(e => e.type === destinationType);
			itemsToMoveDown = destinationList.filter(e => e.position >= destinationPosition);
		}
		itemsToMoveUp.forEach(e => {
			batch.set(firestore.collection('bord-items').doc(e.id), {
				...e,
				position: e.position - 1,
			});
		});
		
		itemsToMoveDown.forEach(e => {
			batch.set(firestore.collection('bord-items').doc(e.id), {
				...e,
				position: e.position + 1,
			});
		});
		batch.commit();
	}

	render() {
		const { bordItems } = this.state;
		const toDoList = bordItems.filter(e => e.type === listType.TO_DO);
		const inProgressList = bordItems.filter(e => e.type === listType.IN_PROGRESS);
		const doneList = bordItems.filter(e => e.type === listType.DONE);
		return this.props.user ? (
			<div className="task-board">
				<div className="board-header">
					{this.props.user.displayName}
					<button className="sign-out" onClick={this.signOutUser}>Sign out</button>
				</div>
				<div className="bord-lists">
					<TaskList listHeader="To Do" listItems={toDoList} removeCard={this.removeItem} moveCard={this.moveCard}
						listType={listType.TO_DO} addItemToBoard={this.addItemToBoard} />
					<TaskList listHeader="In Progress" listItems={inProgressList}  removeCard={this.removeItem} moveCard={this.moveCard}
						listType={listType.IN_PROGRESS} addItemToBoard={this.addItemToBoard} />
					<TaskList listHeader="Done" listItems={doneList}  removeCard={this.removeItem} moveCard={this.moveCard}
						listType={listType.DONE} addItemToBoard={this.addItemToBoard} />
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

export default DragDropContext(HTML5Backend)(Board);