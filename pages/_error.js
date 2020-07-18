import React from 'react';
import { notFoundPage } from '../actions/warihashApiCalls';
import { connect } from 'react-redux';
import { FaArrowLeft } from 'react-icons/fa';
import { Router } from '../routes';
import PropTypes from 'prop-types';
import PublicRoute from '../components/routes/PublicRoute';

class NotFound extends React.Component {
	componentDidMount() {
		this.props.notFoundPage();
	}

	gotomainpage = () => Router.pushRoute(
			`/market/${this.props.settings.host}/${this.props.settings.port}/${this.props.settings.username}/${this
				.props.settings.password}/${this.props.miningalgo.algorithm}`
		);

	render() {
		return (
			<PublicRoute>
				<div style={{ width: '100%', marginBottom: '150px' }}>
					<div className="container">
						<style jsx>
							{`
                .gotomain-btn {
                  cursor: pointer;
                  background: ${this.props.theme.primary}
                  font-size: 16px;
                  border-radius: 0px;
                  color: ${this.props.theme.buttontexts} !important;
                  border: none;
                  box-shadow: 0 4px 15px 0 rgba(129, 150, 160, 0.45);
                  padding: 9px 15px 11px 15px;
                  text-decoration: none;
                  transition: 0.5s all ease-out;
                  margin-top: 4px;
                  opacity: 1;
                }
                .gotomain-btn:hover {
                  color: ${this.props.theme.buttontexts};
                  opacity: 0.7;
                }
                .gotomain-btn span {
                  margin-right: 12px;
                  font-size: 20px;
                }
                .notfoundtitle {
                  color: rgba(0, 0, 0, 0.6);
                }
              `}
						</style>
						<div className="row">
							<div className="col-md-12 col-12 text-center">
								<br />
								<br />
								<br />
								<br />
								<br />
								<br />
								<br />
								<h5 className="notfoundtitle">
									<strong>An error has occurred :(</strong>
								</h5>
								<br />
								<br />
								<br />
								<button className="gotomain-btn" onClick={this.gotomainpage}>
									<span>
										<FaArrowLeft />
									</span>{' '}
									Go to main page
								</button>
								<br />
								<br />
								<br />
								<br />
								<br />
								<br />
							</div>
						</div>
					</div>
				</div>
			</PublicRoute>
		);
	}
}

NotFound.propTypes = {
	notFoundPage: PropTypes.func,
	profile: PropTypes.object,
	settings: PropTypes.object,
	miningalgo: PropTypes.object,
	theme: PropTypes.object
};

const mapStateToProps = state => ({
	profile: state.profile,
	settings: state.settings,
	miningalgo: state.miningalgo,
	theme: state.theme
});

export default connect(mapStateToProps, { notFoundPage })(NotFound);
