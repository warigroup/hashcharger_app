import React from "react";
import PublicRoute from "../components/routes/PublicRoute";
import {
  getCurrentProfile,
  getBidInfo, 
  getBidHashrateChart,
  redirectErrorMessage,
  clearHashrateData,
  clearPaymentInfo,
  clearNetwork,
  orderDetailsPage
} from "../actions/warihashApiCalls";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link } from "../routes";
import { FaArrowLeft } from "react-icons/fa";
import moment from "moment";
import AreaChart from "../components/tools/AreaChart";

class OrderDetails extends React.Component {
  constructor() {
    super();
    this.state = {
      pageLoading: true,
      bidsLoaded: false,
      errorMessage: false,
      hashrateLoading: true,
      bidcontents: [{ bid_id: "" }]
    };
  };

  static async getInitialProps(props) {
    return props.query;
  };

  componentDidMount() {
      this.props.getCurrentProfile();
      this.props.orderDetailsPage();
      this.props.getBidInfo(this.props.bidid);
      this.props.getBidHashrateChart(this.props.bidid);
      this.setState({ pageLoading: false });
  };

  componentDidUpdate(prevProps) {
    if(prevProps.bids.bid_info.result[0] !== this.props.bids.bid_info.result[0]) {
      this.setState({ bidsLoaded: true });
    };
    if (prevProps.hashrate !== this.props.hashrate) {
      this.setState({ hashrateLoading: false });
    };
    if (prevProps.bids.bid_info.result[0] !== this.props.bids.bid_info.result[0] ) {
      this.setState({ bidcontents: this.props.bids.bid_info.result[0] });
    };
    if (
      this.props.network.networkstatus === 400 &&
      this.props.network.networkstatus !== prevProps.network.networkstatus
    ) {
      this.setState({ bidsLoaded: true });
    };
  };
  
  componentWillUnmount() {
    this.props.clearPaymentInfo();
    this.props.clearNetwork();
    this.props.clearHashrateData();
  };

  render() {
    const filteredBid = this.props.bids.bid_info.result.findIndex(
      bid => bid.bid_id == this.props.bidid
    );
    const pagecontents = this.state.bidcontents;
    let overLayError = "overlay-error";
    let noOverLayError = "no-overlay-error";
    let overlayMessage = "overlay-message";
    let noOverlayMessage = "overlay-message-hidden";

      return (
          <PublicRoute>
              <div className="container">
                  <div className="row">
                      <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12" style={{marginTop: "56px"}}>   
                      {
                      filteredBid === -1 &&
                      this.state.bidsLoaded === true ? (         
                        <div className="text-center">
                        <br/>
                        <br/>
                        <br/>
                        <h6>
                          <strong>ERROR: Invalid URL</strong>
                        </h6>
                        <br />
                        <br />
                        <br />
                        <Link prefetch route="/profile">
                          <a className="gotomain-btn">
                            <span>
                              <FaArrowLeft />
                            </span>{" "}
                            Go to profile page
                          </a>
                        </Link>
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                      </div>
                        ) : null }
                 
                 {this.state.pageLoading === true && 
                 this.state.bidsLoaded === false &&
                 this.props.bids.bid_info.result.length === 0 ?
                 (<div style={{width: "100%", textAlign: "center"}}>
                   <br/>
                   <br/>
                  
                   <img
                    src="/static/spinner.gif"
                    style={{
                      width: "170px",
                      paddingBottom: "90px",
                      display: "block",
                      margin: "0 auto",
                      opacity: "0.6"
                    }}
                    alt="Loading..."
                  />
                 <br/>
                 <br/>
                 <br/>
                 <br/>
                 </div>) : ( <br /> )
                }
              {this.state.pageLoading === false &&  
              this.props.bids.bid_info.result.length !== 0 &&
              this.state.bidsLoaded === true ?
                
                <div>
                <style jsx>
                    {`
                    
                      .invoice-title {
                        font-weight: 600;
                      }
                      .finalize-order {
                        margin-bottom: 35px;
                      }
                      .invoice-contents {
                        font-size: 0.89em;
                        display: inline-block;
                      }
                      .paymentinfo {
                        font-weight: 600;
                      }
                      .redtexts {
                        color: #ee5e5e;
                      }
                      .link-items {
                          color: #3626a5;
                          text-decoration: none !important;
                          transition: 0.4s ease all;
                      }
                      .btc-address-input {
                        width: 350px;
                      }
                      .boldtexts {
                        font-weight: bold;
                      }
                      .link-items:hover {
                        color: #644dff;
                      }
                      .copied-message {
                        font-size: 13px;
                        display: inline-block;
                        margin-left: 10px;
                        padding: 0px;
                        margin-bottom: 0px;
                      }

                      @media(max-width: 620px) {
                        .btc-address-input {
                          width: 260px;
                        }
                      }

                      @media(max-width: 520px) {
                        .btc-address-input {
                          width: 210px;
                        }
                        .copied-message {
                          text-align: right;
                          margin-right: 15px;
                          margin-top: 10px;
                          margin-left: 210px !important;
                        }
                      }
                    `}
                  </style>
                          
          {this.props.bids.bid_info.result.map(bid => {  
              if (bid.bid_id == this.props.bidid) {
                return (
                <div key={bid.bid_id}>


                <div className="container-fluid">
                      <div className="row">
                        <div className="col-xl-5 col-lg-5 col-md-12 col-sm-12 col-12 profile-modalcontainer">
                          <h4 className="offeridtitle profilemodal-title">
                            <strong>
                            Order ID #{pagecontents.bid_id}
                            </strong>
                          </h4>
                         
                          <br />
                          <p className="modal-texts">
                            <span className="labelclass">Mining Algorithm:</span>{" "}
                            {pagecontents.mining_algo === "sha256d" ? "SHA256d" : null}
                            {pagecontents.mining_algo === "scrypt" ? "Scrypt" : null}
                            {pagecontents.mining_algo === "ethash" ? "Ethash" : null}
                          </p>
                          <p className="modal-texts">
                            <span className="labelclass">Mining Start Time:</span>{" "}
                            {moment(pagecontents.settlement_start_time).format("MM/DD/YYYY HH:mm")}
                          </p>
                          <p className="modal-texts">
                            <span className="labelclass">Mining End Time:</span>{" "}
                            {moment(pagecontents.settlement_end_time).format(
                              "MM/DD/YYYY HH:mm"
                            )}
                          </p>
                          <p className="modal-texts">
                            <span className="labelclass">Rate:</span> {pagecontents.reserved_average_price}{" "}
                            <span style={{display: "inline-block"}}>{this.props.configs.payment_vehicle}/{(this.props.configs[pagecontents.mining_algo] || {}).price_hash_units}
                                 Hashes/sec/{(this.props.configs[pagecontents.mining_algo] || {}).price_time_units}</span>
                          </p>
                          <p className="modal-texts">
                            <span className="labelclass">Settlement Status:</span>{" "}
                            {pagecontents.settlement_is_finished === true ? "Finished" : null}
                            {pagecontents.settlement_is_finished === false ? "Ongoing" : null}
                            {pagecontents.settlement_is_finished === null || 
                             pagecontents.settlement_is_finished === undefined ? "Not Started" : null}
                          </p>
                          <p className="modal-texts">
                            <span className="labelclass">Average Hashrate, from start of order:</span>{" "}
                            <span
                              className={
                                pagecontents.average_hashrate === null ? "hidethis" : ""
                              }
                            >
                              {pagecontents.average_hashrate}{" "}
                              {pagecontents.hashrate_units}
                              H/s
                            </span>
                            <span
                              className={
                                pagecontents.average_hashrate === null ? "" : "hidethis"
                              }
                            >
                              Unavailable
                           </span>
                          </p>

                          <p className="modal-texts">
                            <span className="labelclass">Average Hashrate, last 10 mins:</span>{" "}
                            <span
                              className={
                                pagecontents['10min_hashrate'] === null ? "hidethis" : ""
                              }
                            >
                              {pagecontents['10min_hashrate']}{" "}
                              {pagecontents.hashrate_units}
                              H/s
                            </span>
                            <span
                              className={
                                pagecontents['10min_hashrate'] === null ? "" : "hidethis"
                              }
                            >
                              Unavailable
                           </span>
                          </p>

                          <p className="modal-texts">
                            <span className="labelclass">Average Hashrate, last 1 hour:</span>{" "}
                            <span
                              className={
                                pagecontents["1hour_hashrate"] === null ? "hidethis" : ""
                              }
                            >
                              {pagecontents["1hour_hashrate"]}{" "}
                              {pagecontents.hashrate_units}
                              H/s
                            </span>
                            <span
                              className={
                                pagecontents["1hour_hashrate"] === null ? "" : "hidethis"
                              }
                            >
                              Unavailable
                           </span>
                          </p>


                          <p className="modal-texts">
                            <span className="labelclass">Purchased Hashrate:</span>{" "}
                            {pagecontents.reserved_hashrate}{" "}
                            {pagecontents.hashrate_units}
                            H/s
                           </p>

                         
                        </div>

                        <div className="col-xl-7 col-lg-7 d-xl-inline-block d-lg-inline-block d-md-none d-sm-none d-none divboxes">
                          <div className="emptydivbox">
                            <br />
                            <br />
                          </div>
                          <div className={ this.props.hashrate.times.length === 0 &&
                                this.state.hashrateLoading === false &&
                                this.props.hashrate.hashrate_units != ""
                                ? overlayMessage
                                : noOverlayMessage } >
                            <p style={{ fontSize: "0.85em", marginTop: "20px" }}>
                              <strong>No mining reported</strong>
                            </p>
                          </div>
                          <div className={ this.props.hashrate.times.length === 0 &&
                                this.state.hashrateLoading === false
                                ? overLayError
                                : noOverLayError } >
                          <AreaChart hashrate={this.props.hashrate} />
                          </div>

                        </div>
                      </div>
                    </div>
                  </div> 
             
                );
              }
            })
          }

                    </div>
                      : 
                      
                      <div>
                        <br/>
                        <br/>
                        <br/>
                        <br/>
                        <br/>
                        <br/>
                        <br/>
                        <br/>
                        <br/>
                        <br/>
                        
                      </div>
                      
                      }

                        <br/>
                        <br/>
                        <br/>
                        <br/>
                        <br/>
                        <br/>
                        <br/>
                        <br/>
                  </div>
              </div>
          </div>
      </PublicRoute>
      )
    }
  }

  OrderDetails.defaultProps = {
    errors: [],
    profile: [],
    payment: [],
    bids: [],
    hashrate: [],
    network: []
  };
  
  OrderDetails.propTypes = {
    getCurrentProfile: PropTypes.func,
    getBidInfo: PropTypes.func,
    getBidHashrateChart: PropTypes.func,
    redirectErrorMessage: PropTypes.func,
    clearHashrateData: PropTypes.func,
    clearPaymentInfo: PropTypes.func,
    clearNetwork: PropTypes.func,
    orderDetailsPage: PropTypes.func,
    errors: PropTypes.object,
    profile: PropTypes.object,
    network: PropTypes.object,
    payment: PropTypes.object,
    bids: PropTypes.object,
    hashrate: PropTypes.object,
    configs: PropTypes.object
  };

  const mapStateToProps = state => ({
    errors: state.errors,
    profile: state.profile,
    payment: state.payment,
    network: state.network,
    bids: state.bids,
    hashrate: state.hashrate,
    configs: state.configs
  });

  export default connect(mapStateToProps, 
    {getCurrentProfile, 
      getBidInfo, 
      getBidHashrateChart,
      clearHashrateData,
      redirectErrorMessage, 
      orderDetailsPage,
      clearNetwork,
      clearPaymentInfo})(OrderDetails);