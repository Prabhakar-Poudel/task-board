import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DragSource, DropTarget } from 'react-dnd';
import { CARD } from '../constants';
import '../css/card.css';


const cardSource = {
	beginDrag(props) {
		return {
			id: props.id,
			sourceType: props.listType,
			sourcePosition: props.position,
		};
	},
	
	endDrag(props, monitor) {
		if(monitor.didDrop()) {
			const { id, sourceType, sourcePosition } = monitor.getItem();
			const { destinationType, destinationPosition } = monitor.getDropResult();
			props.moveCard(id, sourcePosition, sourceType, destinationPosition, destinationType);
		}
	},
};

const cardTarget = {
	drop(props) {
		return {
			destinationType: props.listType,
			destinationPosition: props.position,
		};
	},
};

class Card extends Component {
	
	render() {
		const { connectDragSource, connectDropTarget } = this.props;
		return connectDragSource(connectDropTarget(
			<div className="card">
				<div className="card-text">{this.props.content}</div>
				<i className="fas fa-trash-alt delete-card" onClick={this.props.deleteCard} />
			</div>
		));
	}
}

Card.propTypes = {
	deleteCard: PropTypes.func.isRequired,
	content: PropTypes.string.isRequired,
	connectDragSource: PropTypes.func.isRequired,
	connectDropTarget: PropTypes.func.isRequired,
};

export default DragSource(CARD, cardSource, (connect, monitor) => ({
	connectDragSource: connect.dragSource(),
	isDragging: monitor.isDragging(),
}))(DropTarget(CARD, cardTarget, connect => ({
	connectDropTarget: connect.dropTarget(),
}))(Card));
