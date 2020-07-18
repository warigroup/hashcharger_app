import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { capitalizeFirstLetter } from '../../utils/capitalizeFirstLetter';

class MiningAlgoDropDown extends React.Component {
	constructor() {
		super();
		this.state = {
			menuOpen: false
		};
	}

	render() {
		return (
				<div className="miningalgorithm-dropdown" style={{ marginTop: '26px' }}>
					<div className="dropdown-btn" id="miningalgorithm-selector">
						<h4 style={{ color: `${this.props.theme.primary}` }}>
							{this.props.miningalgo.algorithm === 'sha256d'
								? 'SHA256d'
								: capitalizeFirstLetter(this.props.miningalgo.algorithm)}
						</h4>
					</div>
					<div className="displayblockdiv" />
				</div>
		);
	}
}

MiningAlgoDropDown.propTypes = {
	miningalgo: PropTypes.object,
	theme: PropTypes.object
};

const mapStateToProps = state => ({
	miningalgo: state.miningalgo,
	theme: state.theme
});

export default connect(mapStateToProps, null)(MiningAlgoDropDown);
