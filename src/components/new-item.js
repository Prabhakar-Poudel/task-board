import React, { Component } from 'react';
import '../css/new-item.css';
import PropTypes from 'prop-types';

class NewItem extends Component {

	constructor() {
		super();
		this.state = {
			textInput: ''
		};

		this.addItem = this.addItem.bind(this);
		this.onChange = this.onChange.bind(this);
		this.onKeyPress = this.onKeyPress.bind(this);
	}

	onChange(e) {
		this.setState({ textInput: e.target.value });
	}

	onKeyPress(e) {
		if (e.charCode === 13) {
			e.preventDefault();
			this.addItem();
		} 
	}

	addItem() {
		const { textInput }  = this.state;
		if (textInput.length > 0) {
			this.props.addItem(textInput);
			this.setState({ textInput: '' });
		}
	}

	render() {
		return (
			<div className="new-list-item">
				<textarea autoFocus value={this.state.textInput} className="text-field" onKeyPress={this.onKeyPress} onChange={this.onChange} />
				<div className="button-group">
					<button className="add-button" onClick={this.addItem}>Add</button>
					<button className="cancel-button" onClick={this.props.cancelNew}>Close</button>
				</div>
			</div>
		);
	}
}

NewItem.propTypes = {
	addItem: PropTypes.func.isRequired,
	cancelNew: PropTypes.func.isRequired
};

export default NewItem;	