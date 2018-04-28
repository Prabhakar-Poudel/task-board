import React, { Component } from 'react';
import PropTtpes from 'prop-types';
import '../css/card.css';

class Card extends Component {
	render() {
		return(
			<div className="card">
				<div className="card-text">{this.props.content}</div>
				<div className="card-options">&#8942;</div>
			</div>
		);
	}
}

Card.propTypes = {
	id: PropTtpes.string.isRequired,
	content: PropTtpes.string.isRequired,
};

export default Card;
