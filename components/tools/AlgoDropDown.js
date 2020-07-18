import React from 'react';
import WatchClickOutside from './WatchClickOutside';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FaCaretDown } from 'react-icons/fa';
import { algorithms } from '../../settings';
import { capitalizeFirstLetter } from '../../utils/capitalizeFirstLetter';

class AlgoDropDown extends React.Component {
	constructor() {
		super();
		this.state = {
			menuOpen: false
		};
	}
	toggleAlgoMenu = () => {
		const currentState = this.state.menuOpen;
		this.setState({ menuOpen: !currentState });
	};

	collapseAlgoMenu = () => this.setState({ menuOpen: false });

	render() {
		return (
			<WatchClickOutside onClickOutside={this.collapseAlgoMenu}>
				<div className="miningalgorithm-dropdown">
					<button onClick={this.toggleAlgoMenu} className="dropdown-btn" id="miningalgorithm-selector">
						<h4>
							{this.props.miningalgo.algorithm === 'sha256d'
								? 'SHA256d'
								: capitalizeFirstLetter(this.props.miningalgo.algorithm)}{' '}
							<FaCaretDown className="facaretdown" />
						</h4>
					</button>
					<div className="displayblockdiv" />
					<div className={this.state.menuOpen === true ? 'algorithm-menu-display' : 'algorithm-menu-hidden'}>
						<div className="triangle-shape2" />
						<ul>
							{algorithms.map((item, i) =>
								<li
									className={
										this.props.miningalgo.algorithm === item ? 'listitem selected' : 'listitem'
									}
									key={i}
									onClick={() => this.props.selectAlgorithm(item)}
								>
									{item === 'sha256d' ? 'SHA256d' : capitalizeFirstLetter(item)}
								</li>
							)}
						</ul>
					</div>
				</div>
			</WatchClickOutside>
		);
	}
}

AlgoDropDown.propTypes = {
	miningalgo: PropTypes.object
};

const mapStateToProps = state => ({
	miningalgo: state.miningalgo
});

export default connect(mapStateToProps, null)(AlgoDropDown);
