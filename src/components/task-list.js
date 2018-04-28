import React, { Component } from 'react';
import Card from './card';
import NewItem from './new-item';
import PropTypes from 'prop-types';
import { listType } from '../constants';
import '../css/task-list.css';


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
		return (
			<div className="task-list-outer">
				<div className="task-list">
					<div className="list-header">
						{this.props.listHeader}
					</div>
					<div className="task-list-body">
						{this.props.listItems.map(item => {
							return <Card key={item.id} content={item.content} id={item.id} />;
						})}
					</div>
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
};

export default TaskList;
