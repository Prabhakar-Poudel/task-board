import React, { Component } from 'react';
import PropTtpes from 'prop-types';
import '../css/card.css';

class Card extends Component {
	
	render() {
		return(
			<div className="card">
				<div className="card-text">{this.props.content}</div>
				<i className="fas fa-trash-alt delete-card" onClick={this.props.deleteCard} />
			</div>
		);
	}
}

Card.propTypes = {
	deleteCard: PropTtpes.func.isRequired,
	content: PropTtpes.string.isRequired,
};

export default Card;
