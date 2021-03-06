import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from '../../routes';

const MarketNav = ({ nav, profile, settings, miningalgo, theme }) =>
	<div className="marketplace-menu" style={{ background: theme.navbg }}>
		<div className="container">
			<div className="row" style={{ padding: '13px 20px 13px 20px' }}>
				<style jsx>
					{`
						.number-circle {
							border: 2.5px solid ${theme.navtexts};
							border-radius: 50%;
							padding: 1px 7px 1px 7px;
							opacity: 0.6 !important;
							display: inline-block;
							font-size: 0.95em;
							font-weight: bold;
							position: relative;
							top: -1px;
						}
						.offerformlabel {
							display: inline-block;
							margin-left: 15px;
							font-weight: bold;
							font-size: 1.11em;
						}
						.marketplacenav {
							color: ${theme.navtexts};
							opacity: 0.6 !important;
						}
						.marketplacenav.selected {
							opacity: 1 !important;
							pointer: cursor;
						}

						.marketplacenav.selected .number-circle {
							opacity: 1 !important;
						}

						.disabled-link {
							pointer-events: none;
						}

						@media (max-width: 932px) {
							.addspace {
								padding-top: 13px;
								padding-bottom: 13px;
							}
						}
					`}
				</style>

				<div className="col-xl-4 col-lg-4 col-md-12 text-center addspace">
					<Link
						route={`/market/${settings.host}/${settings.port}/${settings.username}/${settings.password}/${miningalgo.algorithm}`}
					>
						<a className={nav.page === 'marketplacepage' ? 'marketplacenav selected' : 'marketplacenav'}>
							<h4 className="number-circle">1</h4>
							<h4 className="offerformlabel">Place an order</h4>
						</a>
					</Link>
				</div>

				<div className="col-xl-4 col-lg-4 col-md-12 text-center addspace">
					<Link route={`/invoice/id/${profile.recent_invoice_id}`}>
						<a
							className={
								nav.page === 'invoicepage' && profile.recent_invoice_id !== undefined
									? 'marketplacenav selected'
									: 'marketplacenav disabled-link'
							}
						>
							<h4 className="number-circle">2</h4>
							<h4 className="offerformlabel">Pay for your order</h4>
						</a>
					</Link>
				</div>

				<div className="col-xl-4 col-lg-4 col-md-12 text-center addspace">
					<Link route={`/orderhistory`}>
						<a className={nav.page === 'orderhistorypage' ? 'marketplacenav selected' : 'marketplacenav'}>
							<h4 className="number-circle">3</h4>
							<h4 className="offerformlabel">Check order status</h4>
						</a>
					</Link>
				</div>
			</div>
		</div>
	</div>;

MarketNav.propTypes = {
	nav: PropTypes.object,
	profile: PropTypes.object,
	settings: PropTypes.object,
	miningalgo: PropTypes.object,
	theme: PropTypes.object
};

const mapStateToProps = state => ({
	nav: state.nav,
	profile: state.profile,
	settings: state.settings,
	miningalgo: state.miningalgo,
	theme: state.theme
});

export default connect(mapStateToProps, null)(MarketNav);
