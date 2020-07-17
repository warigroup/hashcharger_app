import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class PaymentRate extends React.Component {
	render() {
		return (
			<span style={{ display: 'inline-block' }}>
				{this.props.configs.payment_vehicle}/{
					(this.props.configs[this.props.miningalgo.algorithm] || {}).price_hash_units
				}
				Hashes/sec/{(this.props.configs[this.props.miningalgo.algorithm] || {}).price_time_units}
			</span>
		);
	}
}

PaymentRate.propTypes = {
	configs: PropTypes.object,
	miningalgo: PropTypes.object
};

const mapStateToProps = state => ({
	configs: state.configs,
	miningalgo: state.miningalgo
});

export default connect(mapStateToProps, null)(PaymentRate);
