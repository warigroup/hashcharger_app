import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Router } from "../routes";
//// COMPONENTS /////////////////
import PublicRoute from "../components/routes/PublicRoute";
import {
  getCurrentProfile,
  clearCurrentProfile,
  clearHashrateData,
  clearPaymentInfo,
  clearBids,
  clearOffers,
  clearNetwork,
  clearAlert,
  redirectErrorMessage,
  getBids,
  getOffers,
  getOfferInfo,
  getBidInfo,
  getBidHashrateChart,
  getHashrateInfo,
  cancelOffer,
  searchPage
} from "../actions/warihashApiCalls";
import Cookies from "js-cookie";
import { csrfcookie } from "../utils/cookieNames";
import Paginator from "../components/tools/Paginator";
import BidsList from "../components/profile/BidsList";
import BuyOrderModal from "../components/profile/BuyOrderModal";
import { FaEnvelope } from "react-icons/fa";

class SearchPage extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      modaloffers: [{ bid_id: "" }],
      menuOpen: false,
      showBuyOrderModal: false,
      email: "",
      sub_id: "",
      modalLoading: true,
      pagenumber: 0,
      menuOne: true,
      menuTwo: false,
      emailfocus: false
    };
  };

  static async getInitialProps(props) {
    return props.query;
  };    

  componentDidMount() {
    
    this.props.clearHashrateData();
    this.props.clearAlert();
    this.props.clearHashrateData();
    this.props.searchPage();
  };

  componentDidUpdate(prevProps) {
    if (prevProps.hashrate !== this.props.hashrate) {
      this.setState({ modalLoading: false });
    };
    if (prevProps.bids.bid_info.result[0] !== this.props.bids.bid_info.result[0] ) {
      this.setState({ modaloffers: this.props.bids.bid_info.result[0] });
    };
    if (prevProps.offers.offer_info.result[0] !== this.props.offers.offer_info.result[0] ) {
      this.setState({ modaloffers: this.props.offers.offer_info.result[0] });
    };
    if (prevProps.bids.bids.result !== this.props.bids.bids.result) {
      this.setState({ loading: false });
    };
    if (
      this.props.errors.detail ===
      "CSRF Failed: CSRF token missing or incorrect." &&
      prevProps.errors.detail !==
      "CSRF Failed: CSRF token missing or incorrect."
    ) {
      Cookies.remove(csrfcookie);
      this.props.enableNavigation();
      this.props.redirectErrorMessage();
      this.props.clearCurrentProfile();
    };
    if (
      this.props.network.networkstatus === 401 &&
      prevProps.network.networkstatus !== 401
    ) {
      this.props.redirectErrorMessage();
      this.props.clearCurrentProfile();
    };
  }

  componentWillUnmount() {
    this.props.clearNetwork();
    this.props.clearPaymentInfo();
    this.props.clearHashrateData();
    this.props.clearAlert();
  };

  searchOrders = () => this.props.getOffers(this.state.pagenumber, this.state.sub_id);

  /// VIEW INFO MODAL ////////////////////

  handleCloseModal = () => {
    this.props.clearHashrateData();
    this.props.clearBids();
    this.props.clearOffers();
    this.setState({ showBuyOrderModal: false, 
      showSellOrderModal: false, 
      showCancelOrderModal: false,
    showPaymentAddressModal: false });
    this.setState({ modaloffers: [{ bid_id: { result: {} } }] });
  };

  /// PAGINATION //////////////////////////

  selectNewPage = number => {
    let pagenumber = number - 1;
    if (this.state.menuOne === true) {
      this.props.getBids(pagenumber);
    } else {
      this.props.getOffers(pagenumber);
    };
  };

  prevPage = number => {
    let pagenumber = number - 1;
    if (this.state.menuOne === true) {
      this.props.getBids(pagenumber);
    } else {
      this.props.getOffers(pagenumber);
    };
  };

  nextPage = number => {
    let pagenumber = number + 1;
    if (this.state.menuOne === true) {
      this.props.getBids(pagenumber);
    } else {
      this.props.getOffers(pagenumber);
    };
  };

  firstPage = () => {
    let pagenumber = 0;
    if (this.state.menuOne === true) {
      this.props.getBids(pagenumber);
    } else {
      this.props.getOffers(pagenumber);;
    };
  };

  lastPage = number => {
    let pagenumber = number;
    if (this.state.menuOne === true) {
      this.props.getBids(pagenumber);
    } else {
      this.props.getOffers(pagenumber);
    };
  };

  pageSix = () => {
    let pagenumber = 5;
    if (this.state.menuOne === true) {
      this.props.getBids(pagenumber);
    } else {
      this.props.getOffers(pagenumber);
    };
  };

  minusSix = number => {
    let pagenumber = number - 6;
    if (this.state.menuOne === true) {
      this.props.getBids(pagenumber);
    } else {
      this.props.getOffers(pagenumber);
    };
  };

  handleEmailFocus = () => this.setState({ emailfocus: true });
  handleEmailBlur = () => this.setState({ emailfocus: false });

  render() {
    const modalcontents = this.state.modaloffers;

    const openBuyOrderModal = bid => {
      this.props.getBidHashrateChart(bid.bid_id);
      this.props.getBidInfo(bid.bid_id);
      this.setState({ showBuyOrderModal: true, menuOpen: false });
    };

    const { emailfocus } = this.state;

    const goToInvoicePage = bid_id => Router.pushRoute(`/invoice/id/${bid_id}`);

    return (
      <PublicRoute>
        <div
          className="container-fluid"
          style={{ marginTop: "20px", marginBottom: "150px" }}
        >
          <div className="row">
          {this.state.successAlert}
          {this.state.paymentAddressSuccess}
            <div className="container" style={{ padding: "0px" }}>
              <div className="container-fluid">
                <div className="row" style={{ padding: "0px" }}>
                <style jsx>
                    {`
                      .marketplace-menu {
                        margin-right: 27px;
                      }
                      .createorderstable-btn {
                        margin-top: 15px;
                        display: inline-block;
                        font-weight: bold;
                        font-size: 0.82em;
                        border: none;
                      }
                      .th {
                        padding-top: 7px;
                        padding-bottom: 7px;
                      }
                      .search-btn {
                          display: inline-block;
                          border: none;
                      }

                      .stratum-btn-container {
                        width: 100%;
                        padding-right: 33px;
                        margin-top: 15px;
                      }
                      .tab-menu-container {
                        padding-right: 25px;
                        margin-top: 27px;
                      }
                      .tabmenu-btn {
                        border-radius: 0px;
                        font-size: 0.79em;
                        margin-right: 15px;
                        padding-right: 19px;
                        padding-left: 19px;
                        font-weight: bold;
                        height: 33px !important;
                      }
                      .addbtcaddress-btn {
                        border: none; 
                        background: none; 
                        color: #ff320a;
                        font-weight: bold; 
                        box-shadow: none;
                      }
                      .addbtcaddress-btn:hover {
                        color: #ff846c;
                      }
                      @media (max-width: 992px) {
                        .tab-menu-container{
                          text-align: left !important;
                          margin-top: 25px;
                          margin-bottom: 5px;
                        }
                        .stratum-btn-container {
                          text-align: left !important;
                        }
                        .hideonmobile {
                          display: none;
                        }
                      }
                      @media (max-width: 650px) {
                        .tabmenu-btn {
                          border-radius: 0px;
                          font-size: 0.76em;
                          margin-right: 12px;
                          padding-right: 15px;
                          padding-left: 15px;
                          font-weight: bold;
                        }
                      }
                    `}
                  </style>

                  <div className="col-xl-7 col-lg-7 col-md-12 col-sm-12 col-12">
                      <br />
                      <br />
                  <h4 className="marketplacetitle">Search Previous Orders</h4>
                  </div>

                  <div className="col-xl-5 col-lg-5 col-md-12 col-sm-12 col-12 text-right">

                        <div style={{ width: "100%", paddingTop: "45px" }}>
                        <div className="form-group" 
                        style={{ display: "inline-block" }}>
                        <div
                          className={
                            emailfocus === true
                              ? "input-group input-group-md focused"
                              : "input-group input-group-md"
                          }
                          style={{width: "400px"}}
                        >
                          <div className="input-group-prepend">
                            <span
                              className="input-group-text"
                              style={{
                                background: "white",
                                border: "none",
                                color: "rgba(0,0,0,0.5)"
                              }}
                            >
                              <FaEnvelope style={emailfocus === true ? 
                                { fontSize: "1.26em", opacity: "1" } : 
                                { fontSize: "1.26em", opacity: "0.8" }} />
                            </span>
                          </div>
                          <input
                            type="text"
                            name="email"
                            value={this.state.email}
                            placeholder="example@email.com"
                            className="form-control inputstyles2"
                            style={{
                              border: "none",
                              borderRadius: "7px",
                              fontSize: "0.82em"
                            }}
                            onChange={event => this.setState({sub_id: event.target.value})}
                            onFocus={this.handleEmailFocus}
                            onBlur={this.handleEmailBlur}
                            autoComplete="off"
                            required
                          />
                           <button className="btn btn-primary search-btn"
                           onClick={() => this.searchOrders()}>
                                <p style={{ marginBottom: "0px", fontSize: "0.9em" }}>Search Orders</p>
                            </button> 
                        </div>
                      </div>
                        </div>
                                        
                  </div>

                  <div className="col-md-12 clearfix mb-2" />
                  <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12 tablecontainer">

                    <div className="buy-orders-table" 
                    style={this.state.menuOne === true ? {width: "100%"} : {display: "none"}}>
                          {/******* BUY ORDERS TABLE ******/}

                          <div
                      className="board"
                      style={{
                        borderBottom: "1px solid rgba(0,0,0,0.3)",
                        borderRadius: "0px"
                      }}
                    >
                      <div
                        className="tableheader"
                        style={{ color: "gray", width: "100%" }}
                      >
                        <table id="tableT" className="table table-borderless myorders-table-styles container-fluid">
                          <thead className="text-white"
                            style={{ background: "#3626a5" }}>
                            <tr className="row m-0" style={{
                              borderRight: "1px solid rgba(0,0,0,0.3)",
                              borderLeft: "1px solid rgba(0,0,0,0.3)"
                            }}>
                              <th
                                id="current_hash_rate"
                                className="orders-table-id offertitle"
                              >
                                ID
                              </th>
                              <th
                                id="mining_algo"
                                className="orders-table-algorithm offertitle"
                              >
                                Algorithm
                              </th>

                              <th
                                id="duration"
                                className="orders-table-duration offertitle"
                              >
                                Duration
                              </th>

                              <th
                                id="average_hashrate"
                                className="orders-table-average-hashrate offertitle"
                              >
                                Purchased / Average Hashrate
                              </th>

                              <th
                                id="payment_status"
                                className="orders-table-status offertitle"
                              >
                                Payment Status
                              </th>

                              <th
                                id="mining_status"
                                className="orders-table-mining offertitle"
                              >
                                Mining Status
                              </th>

                              <th className="orders-table-buttons" />
                            </tr>
                          </thead>
                          <tbody id="tablebodytaken">
                            {this.state.loading === false && 
                              this.props.bids.bids.result.length > 0 && 
                              this.props.bids.bids.result[0].offer_take_ids !== "" ? 
                              <BidsList 
                              bids={this.props.bids.bids.result}
                              goToInvoicePage={goToInvoicePage}
                              openBuyOrderModal={openBuyOrderModal}
                              goToEditPage={goToEditPage}
                              />
                              : null}
                            {this.state.loading === false &&
                              this.props.bids.bid_loaded === true &&
                              this.props.bids.bids.result.length === 0 ?
                              <tr style={{
                                width: "100%", borderRight: "1px solid rgba(0,0,0,0.3)",
                                borderLeft: "1px solid rgba(0,0,0,0.3)"
                              }}>
                                <td style={{
                                  width: "100%",
                                  paddingTop: "90px",
                                  paddingBottom: "90px",
                                  textAlign: "center"
                                }}>
                                  <p style={{ fontWeight: "bold", color: "rgba(0,0,0,0.5)" }}>No orders found.</p>
                                </td>
                              </tr> : null}
                              {this.state.loading === true && 
                              this.props.bids.bid_loaded === false ? 
                              <tr style={{ width: "100%", textAlign: "center",
                              borderRight: "1px solid rgba(0,0,0,0.2)",
                                  borderLeft: "1px solid rgba(0,0,0,0.2)", }}>
                              <td>
                              <img
                                src="/static/spinner.gif"
                                style={{
                                  width: "170px",
                                  margin: "0 auto",
                                  paddingTop: "20px",
                                  paddingBottom: "20px",
                                  display: "block",
                                  opacity: "0.6"
                                }}
                                alt="Loading..."
                              />
                              </td>
                            </tr> : null}
                          </tbody>
                        </table>

                      </div>
                    </div>

                          {/****   Show pagination when total_pages is greater than 1 ******/}
                          {this.state.menuOne === true && this.props.bids.bids.total_pages > 1 ? 
                                  <div className="col-xl-12 col-md-12 col-12 pagination-container" 
                                  style={{paddingRight: "20px", paddingLeft: "20px"}}>
                                                  <Paginator 
                                                      itemslist={this.props.bids.bids}
                                                      nextPage={this.nextPage}
                                                      prevPage={this.prevPage}
                                                      firstPage={this.firstPage}
                                                      lastPage={this.lastPage}
                                                      selectNewPage={this.selectNewPage}
                                                      pageSix={this.pageSix}
                                                      minusSix={this.minusSix}
                                                      textSize="medium"
                                                    />
                                    </div>
                             : null} 



                    </div>    



                  </div>

                  {/**************** BUY ORDER MODAL ****************/}             
                     <BuyOrderModal 
                     hashrate={this.props.hashrate}
                     modalcontents={modalcontents}
                     modalLoading={this.state.modalLoading}
                     handleCloseModal={this.handleCloseModal}
                     showBuyOrderModal={this.state.showBuyOrderModal}
                     />

                  <div className="clearfix" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </PublicRoute>
    );
  }
}

SearchPage.defaultProps = {
  profile: [],
  network: [],
  errors: [],
  miningalgo: [],
  configs: [],
  bids: [],
  hashrate: [],
  offers: []
};

SearchPage.propTypes = {
  getCurrentProfile: PropTypes.func,
  getBidHashrateChart: PropTypes.func,
  clearCurrentProfile: PropTypes.func,
  clearHashrateData: PropTypes.func,
  clearPaymentInfo: PropTypes.func,
  clearNetwork: PropTypes.func,
  clearBids: PropTypes.func,
  clearOffers: PropTypes.func,
  clearAlert: PropTypes.func,
  getBids: PropTypes.func,
  getOffers: PropTypes.func,
  getOfferInfo: PropTypes.func,
  getBidInfo: PropTypes.func,
  getHashrateInfo: PropTypes.func,
  redirectErrorMessage: PropTypes.func,
  cancelOffer: PropTypes.func,
  searchPage: PropTypes.func,
  auth: PropTypes.object,
  profile: PropTypes.object,
  configs: PropTypes.object,
  errors: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object
  ]),
  network: PropTypes.object,
  offers: PropTypes.object,
  time: PropTypes.object,
  bids: PropTypes.object,
  payment: PropTypes.object,
  hashrate: PropTypes.object,
  miningalgo: PropTypes.object
};

const mapStateToProps = state => ({
  auth: state.auth,
  profile: state.profile,
  configs: state.configs,
  errors: state.errors,
  network: state.network,
  offers: state.offers,
  time: state.time,
  bids: state.bids,
  payment: state.payment,
  hashrate: state.hashrate,
  miningalgo: state.miningalgo
});

export default connect(
  mapStateToProps,
  {
    getCurrentProfile,
    getBidHashrateChart,
    clearCurrentProfile,
    clearHashrateData,
    clearPaymentInfo,
    clearBids,
    clearOffers,
    clearNetwork,
    clearAlert,
    redirectErrorMessage,
    getBids,
    getOffers,
    getOfferInfo,
    getBidInfo,
    getHashrateInfo,
    cancelOffer,
    searchPage
  }
)(SearchPage);
