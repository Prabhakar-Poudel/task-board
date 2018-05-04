import React, { Component } from 'react';
import Card from './card';
import NewItem from './new-item';
import PropTypes from 'prop-types';
import { listType, CARD } from '../constants';
import { DropTarget } from 'react-dnd';
import '../css/task-list.css';

const listTarget = {
	drop(props, monitor) {
		if (!monitor.didDrop()) {
			const { sourceType } = monitor.getItem();
			let position = props.listItems.length;
			position = props.listType === sourceType ? position - 1 : position;
			return {
				destinationType: props.listType,
				destinationPosition: position,
			};
		}
		
	},
};

class TaskList extends Component {

	constructor(props) {
		super(props);
		this.state = {
			showNewInput: false,
		};

		this.counter = 0;

		this.addNewCard = this.addNewCard.bind(this);
		this.cancelNew = this.cancelNew.bind(this);
	}

	addNewCard(content) {
		this.props.addItemToBoard(this.props.listType, content, this.props.listItems.length);
	}

	cancelNew() {
		this.setState({ showNewInput: false });
	}

	render() {
		const { connectDropTarget, listItems, listType, listHeader, removeCard, moveCard } = this.props;
		return connectDropTarget(
			<div className="task-list-outer">
				<div className="task-list">
					<div className="list-header">
						{listHeader}
					</div>
					<div className="task-list-body">
						{listItems.sort((a, b) => {
							return a.position > b.position ? 1 : 0;
						}).map(item => {
							const { id, position, content } = item;
							return (
								<Card key={id} content={content} id={id}  listType={listType} position={position}
									deleteCard={() => removeCard(item, listItems)} moveCard={moveCard}/>
							);
						})}
						{
							!this.state.showNewInput &&
							<div className="list-footer" onClick={() => this.setState({ showNewInput: true}) }>
							Add New&#8230;
							</div>
						}
					
						{
							this.state.showNewInput && 
							<NewItem className="hidden" cancelNew={this.cancelNew} addItem={this.addNewCard} />
						}
					</div>
				</div>
			</div>
		);
	}
}

TaskList.propTypes = {
	listHeader: PropTypes.string.isRequired,
	listItems: PropTypes.arrayOf(PropTypes.shape ({
		content: PropTypes.string.isRequired,
		id: PropTypes.string.isRequired
	})).isRequired,
	listType: PropTypes.oneOf([listType.TO_DO, listType.IN_PROGRESS, listType.DONE]).isRequired,
	addItemToBoard: PropTypes.func.isRequired,
	removeCard: PropTypes.func.isRequired,
	moveCard: PropTypes.func.isRequired,
	connectDropTarget: PropTypes.func.isRequired,
};

export default DropTarget(CARD, listTarget, connect => ({
	connectDropTarget: connect.dropTarget(),
}))(TaskList);
