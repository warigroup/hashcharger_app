import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link, Router } from "../routes";
//// COMPONENTS /////////////////
import PublicRoute from "../components/routes/PublicRoute";
import {
  FaBitcoin,
  FaWallet,
  FaRegEnvelope,
  FaCogs,
  FaExternalLinkSquareAlt,
  FaUserPlus
} from "react-icons/fa";
import { IoLogoBitcoin } from "react-icons/io";
import { GoTag } from "react-icons/go";
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
  cancelOffer
} from "../actions/warihashApiCalls";
import Cookies from "js-cookie";
import { alphaURL } from "../settings";
import { csrfcookie } from "../utils/cookieNames";
import SweetAlert from "react-bootstrap-sweetalert";
import Paginator from "../components/tools/Paginator";
import MyOffersList from "../components/profile/MyOffersList";
import BidsList from "../components/profile/BidsList";
import BuyOrderModal from "../components/profile/BuyOrderModal";
import SellOrderModal from "../components/profile/SellOrderModal";
import CancelOrderModal from "../components/profile/CancelModal";
import { WAIT_ALERT } from "../utils/timeout-config";

class SearchPage extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      modaloffers: [{ bid_id: "" }],
      menuOpen: false,
      showPaymentAddressModal: false,
      showBuyOrderModal: false,
      showSellOrderModal: false,
      showCancelOrderModal: false,
      modalLoading: true,
      pagenumber: 0,
      menuOne: true,
      menuTwo: false
    };
  };

  static async getInitialProps(props) {
    return props.query;
  };    

  componentDidMount() {
    if (this.props.auth.isAuthenticated === true) {
      this.props.getCurrentProfile();
      this.props.clearHashrateData();
      this.props.clearPaymentInfo();
      this.props.clearAlert();
      if (this.props.sellorders === undefined || 
        this.props.sellorders !== "sellorders") {
        this.props.getBids(this.state.pagenumber);
        this.props.getOffers(this.state.pagenumber);
      }
      if (this.props.sellorders === "sellorders") {
        this.setState({ menuOne: false, menuTwo: true });
        this.props.getOffers(this.state.pagenumber);
        this.props.getBids(this.state.pagenumber);
      }
    };
    this.props.clearHashrateData();
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
      this.props.errors.alertnow === "alertnow" &&
      prevProps.errors.alertnow !== "alertnow"
    ) {
      this.handleCloseModal();
      setTimeout(() => {
        this.successAlert();
        this.props.getOffers(this.state.pagenumber);
      }, WAIT_ALERT);
      this.openMenuTwo();
    };
    if (
      this.props.errors.alertnow === "set_address_success" &&
      prevProps.errors.alertnow !== "set_address_success"
    ) {
      this.handleCloseModal();
      this.props.getCurrentProfile();
      setTimeout(() => {
        this.paymentAddressSuccess();
      }, WAIT_ALERT);
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


  onConfirm = () => {
    this.setState({ successAlert: null, paymentAddressSuccess: null });
    this.props.clearAlert();
  };

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

  /// TAB MENU ////////////////////////////

  openMenuOne = () => this.setState({ menuOne: true, menuTwo: false });
  openMenuTwo = () => this.setState({ menuOne: false, menuTwo: true });

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

  offerCancel = offerId => this.props.cancelOffer(offerId);
  openPaymentAddressModal = () => this.setState({ showPaymentAddressModal: true, menuOpen: false });

  render() {
    const modalcontents = this.state.modaloffers;

    const openBuyOrderModal = bid => {
      this.props.getBidHashrateChart(bid.bid_id);
      this.props.getBidInfo(bid.bid_id);
      this.setState({ showBuyOrderModal: true, menuOpen: false });
    };

    const openSellOrderModal = offer => {
      this.props.getHashrateInfo(offer.offer_id);
      this.props.getOfferInfo(offer.offer_id);
      this.setState({ showSellOrderModal: true, menuOpen: false });
    };

    const openCancelOrderModal = offer => {
      this.props.getOfferInfo(offer.offer_id);
      this.setState({ showCancelOrderModal: true, menuOpen: false });
    };

    const goToInvoicePage = bid_id => Router.pushRoute(`/invoice/id/${bid_id}`);
    const goToEditPage = bid => Router.pushRoute(`/editstratum/id/${bid.bid_id}`);
    const offerEditPage = offer => Router.pushRoute(`/editoffer/id/${offer.offer_id}`);

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
                  <div className="col-xl-7 col-lg-7 col-md-12 col-sm-12 col-12 infocontainer">


  
                  </div>

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
                  <div className="col-xl-5 col-lg-5 col-md-12 col-sm-12 col-12 text-right">

                        <div style={{ width: "100%", paddingTop: "15px" }}>

                        
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
                        <div className="container-fluid" style={{ border: "1px solid rgba(0,0,0,0.3)" }}>
                          <div className="row">
                            <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12 col-12">
                              <br />
                              <h5 style={{paddingBottom: "15px"}}>
                                <strong>My Buy Orders</strong>
                              </h5>
                            </div>

                            <div
                              className="col-xl-9 col-lg-9 col-md-9 col-sm-12 col-12 hideonmobile"
                              style={{ paddingTop: "17px" }}
                            >
                          {/****   Show pagination when total_pages is greater than 1 ******/}
                          {this.state.menuOne === true && this.props.bids.bids.total_pages > 1 &&
                          this.props.bids.bids.result.length > 15 ? 
                          <Paginator 
                              itemslist={this.props.bids.bids}
                              nextPage={this.nextPage}
                              prevPage={this.prevPage}
                              firstPage={this.firstPage}
                              lastPage={this.lastPage}
                              selectNewPage={this.selectNewPage}
                              pageSix={this.pageSix}
                              minusSix={this.minusSix}
                              textSize="small"
                            />
                          : null}
                            </div>
                          </div>
                        </div>

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

MyProfile.defaultProps = {
  profile: [],
  network: [],
  errors: [],
  miningalgo: [],
  configs: [],
  bids: [],
  hashrate: [],
  offers: []
};

MyProfile.propTypes = {
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
    cancelOffer
  }
)(SearchPage);
