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
import Head from "next/head";
import {
  getCurrentProfile,
  clearCurrentProfile,
  clearHashrateData,
  clearPaymentInfo,
  clearBids,
  clearOffers,
  clearNetwork,
  clearAlert,
  logoutUser,
  myProfilePage,
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
import { maintenanceMode, alphaURL } from "../settings";
import { csrfcookie } from "../utils/cookieNames";
import SweetAlert from "react-bootstrap-sweetalert";
import Paginator from "../components/tools/Paginator";
import MyOffersList from "../components/profile/MyOffersList";
import BidsList from "../components/profile/BidsList";
import BuyOrderModal from "../components/profile/BuyOrderModal";
import SellOrderModal from "../components/profile/SellOrderModal";
import PaymentAddressModal from "../components/profile/PaymentAddressModal";
import CancelOrderModal from "../components/profile/CancelModal";
import { WAIT_ALERT } from "../utils/timeout-config";
var Scroll = require('react-scroll');
var scroll = Scroll.animateScroll;

class MyProfile extends React.Component {
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
    if (!this.props.auth.isAuthenticated) {
      this.props.redirectErrorMessage();
      this.props.clearCurrentProfile();
      Router.pushRoute("/login");
    };
    if (maintenanceMode === "true") {
      this.props.logoutUser();
    };
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
      scroll.scrollToTop({duration: 200});
    };
    this.props.myProfilePage();
    this.props.clearHashrateData();
    Cookies.remove("markethistory_page");
    Cookies.remove("page_number");
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
      this.props.logoutUser();
    };
    if (
      this.props.network.networkstatus === 401 &&
      prevProps.network.networkstatus !== 401
    ) {
      this.props.redirectErrorMessage();
      this.props.clearCurrentProfile();
      this.props.logoutUser();
    };
  }

  componentWillUnmount() {
    this.props.clearNetwork();
    this.props.clearPaymentInfo();
    this.props.clearHashrateData();
    this.props.clearAlert();
  };

    /// SUCCESS ALERT ////////////////////////////
    successAlert = () => {
      const successAlert = (
        <SweetAlert
          success
          confirmBtnText="Confirm"
          confirmBtnBsStyle="default"
          title=""
          style={{borderRadius: "0px"}}
          onConfirm={this.onConfirm}
        >
          <p style={{ fontSize: "0.74em" }}>
            <br />
            Your order has been cancelled.
            <br />
            <br />
          </p>
        </SweetAlert>
      );
      this.setState({ successAlert: successAlert });
    };

    paymentAddressSuccess = () => {
      const paymentAddressSuccess = (
        <SweetAlert
          success
          confirmBtnText="Confirm"
          confirmBtnBsStyle="default"
          title=""
          style={{borderRadius: "0px"}}
          onConfirm={this.onConfirm}
        >
          <p style={{ fontSize: "0.74em" }}>
            <br />
            Your BTC address has been updated successfully.
            <br />
            <br />
          </p>
        </SweetAlert>
      );
      this.setState({ paymentAddressSuccess: paymentAddressSuccess });
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
        <Head>
          <title>WariHash | My Profile</title>
          <meta name="description" content="" />
          <meta name="keywords" content="" />
          <meta name="author" content="" />
        </Head>
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

                    <div className="profileinfo-row">
                    <FaRegEnvelope
                        style={{ position: "relative", top: "-1px", fontSize: "1.1em" }}
                        className="profileinfo-icons"
                      />
                    <p className="profileinfo">
                      <strong> Email:</strong>{" "}
                      {this.props.profile && 
                       this.props.profile.profile !== null &&
                       this.props.profile.profile !== ""
                        ? this.props.profile.profile.email
                        : null}
                    </p>
                    </div>     

                    <div className="profileinfo-row">
                    <FaBitcoin className="profileinfo-icons"
                        style={{ fontSize: "1.1em", position: "relative", top: "-1px" }} />
                    <p className="profileinfo">
                      <strong> BTC Credits Available for Purchasing:</strong>{" "}
                      {this.props.profile.profile !== null &&
                        this.props.profile.profile !== ""
                        ? this.props.profile.profile.credits
                        : ""} BTC
                    </p>
                    </div>

                    <div className="profileinfo-row">
                    <IoLogoBitcoin className="profileinfo-icons"
                        style={{ fontSize: "1.1em", position: "relative", top: "-1px" }} />
                    <p className="profileinfo">
                      <strong> BTC Withdrawal Available:</strong>{" "}
                      {this.props.profile.profile !== null &&
                        this.props.profile.profile !== ""
                        ? this.props.profile.profile.owed_payouts
                        : ""} BTC
                    </p>
                    </div>

                    <div className="profileinfo-row">
                    <FaWallet className="profileinfo-icons"
                        style={{ fontSize: "1.1em", position: "relative", top: "-1px" }} />
                    <p className="profileinfo">
                      <strong> BTC Withdrawal Address:</strong>{" "}
                      {this.props.profile.profile !== null &&
                        this.props.profile.profile !== "" &&
                        this.props.profile.profile.withdrawal_address !== undefined &&
                        this.props.profile.profile.withdrawal_address !== null &&
                        this.props.profile.profile.withdrawal_address !== ""
                        ? this.props.profile.profile.withdrawal_address
                        : null }

                      {this.props.profile.profile !== null &&
                        this.props.profile.profile.withdrawal_address === null || 
                        this.props.profile.profile.withdrawal_address === ""
                        ? <button onClick={() => this.openPaymentAddressModal()} 
                        className="addbtcaddress-btn">
                          Please add your BTC address</button>
                        : null }

                    </p>
                    </div>


                    <div className="profileinfo-row">
                    
                    <p className="profileinfo" style={{display: "inline-block"}}>
                    <GoTag className="profileinfo-icons2" />  <strong> Number of Discounts Available (2% off per order):</strong>{" "}
                      {this.props.profile &&
                       this.props.profile.profile !== null &&
                       this.props.profile.profile !== ""
                        ? this.props.profile.profile.fee_free_orders
                        : null}
                    </p>
                    </div>     

                    <div className="profileinfo-row">
                    <FaExternalLinkSquareAlt className="profileinfo-icons"
                        style={{ fontSize: "1.1em", position: "relative", top: "-2px" }} />
                          <p className="profileinfo">
                      <strong>
                        <a href="https://warihash.com/referral-program/" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="referral-link-page">
                        Referral Link:</a>
                        </strong>{" "}
                    </p>
                    {this.props.profile &&
                     this.props.profile.profile !== null &&
                     this.props.profile.profile.referral_code !== undefined &&
                        this.props.profile.profile !== ""
                        ? <p 
                        className="referral-link">
                          {`${alphaURL}/register/${this.props.profile.profile.referral_code}`}</p> 
                        : null}
                    </div>

                    <div className="profileinfo-row">
                    <FaUserPlus className="profileinfo-icons"
                        style={{ fontSize: "1.1em", position: "relative", top: "-1px" }} />
                    <p className="profileinfo">
                      <strong> Number of Referred Users:</strong>{" "}
                      {this.props.profile.profile !== null &&
                        this.props.profile.profile !== ""
                        ? this.props.profile.profile.num_referred_users
                        : ""}
                    </p>
                    </div>
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

                          <div className="stratum-btn-container">
                          <Link prefetch route="/stratum">
                            <a className="btn btn-primary btn-mobile profile-menu-btn">
                              <FaCogs style={{marginRight: "12px", position: "relative", top: "2px",
                            fontSize: "1.3em" }}/>
                              <span style={{ position: "relative", top: "3px" }}>
                              Manage Stratum Settings
                              </span>
                            </a>
                          </Link> 
                          </div>
                          <div className="stratum-btn-container">
                   
                            <button className="btn btn-primary btn-mobile profile-menu-btn"
                            onClick={() => this.openPaymentAddressModal()}>
                              <FaWallet style={{marginRight: "12px", position: "relative", top: "-0.8px",
                            fontSize: "1.1em" }}/>
                              <span>
                              Set BTC Withdrawal Address
                              </span>
                            </button>
                    
                          </div>

                          <div className="tab-menu-container">
                            <button onClick={() => this.openMenuOne()}
                            className="btn btn-primary tabmenu-btn">Buy Orders</button>
                            <button onClick={() => this.openMenuTwo()}
                            className="btn btn-secondary tabmenu-btn" 
                            style={{border: "none"}}>Sell Orders</button>
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





                    <div className="sell-orders-table" 
                    style={this.state.menuTwo === true ? {width: "100%"} : {display: "none"}}>
                          {/******* SELL ORDERS TABLE ******/}

                           
                           


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
                                <strong>My Sell Orders</strong>
                              </h5>
                            </div>

                            <div
                              className="col-xl-9 col-lg-9 col-md-9 col-sm-12 col-12 hideonmobile"
                              style={{ paddingTop: "17px" }}
                            >
                          
                          {/****   Show pagination when total_pages is greater than 1 ******/}
                          {this.state.menuTwo === true && this.props.offers.active_offers.total_pages > 1 &&
                           this.props.offers.active_offers.result.length > 15 ? 
                          <Paginator 
                              itemslist={this.props.offers.active_offers}
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
                            style={{ background: "#808080" }}>
                            <tr className="row m-0" style={{
                              borderRight: "1px solid rgba(0,0,0,0.3)",
                              borderLeft: "1px solid rgba(0,0,0,0.3)"
                            }}>
                              <th
                                id="offer_id"
                                className="myoffers-table-id offertitle"
                              >
                                ID
                              </th>
                              <th
                                id="mining_algo"
                                className="myoffers-table-algorithm offertitle"
                              >
                                Algorithm
                              </th>
                              <th
                                id="measured_hashrate"
                                className="myoffers-table-hashrate offertitle"
                              >
                                Hashrate (24hr)
                              </th>

                              <th
                                id="rate"
                                className="myoffers-table-rate offertitle"
                              >
                                Rate
                              </th>

                              <th
                                id="match_status"
                                className="myoffers-table-match offertitle"
                              >
                                Match Status
                              </th>

                              <th
                                id="order_status"
                                className="myoffers-table-order offertitle"
                              >
                                Order Status
                              </th>

                              <th className="myoffers-table-buttons" />
                            </tr>
                          </thead>

                          {this.props.profile &&
                          this.props.profile.profile && 
                          

                          <tbody id="tablebodytaken">
                           
                          {this.state.loading === false && 
                              this.props.offers.active_offers.result.length > 0 && 
                              this.props.offers.active_offers.page !== [] ? 
                              <MyOffersList 
                              activeoffers={this.props.offers.active_offers.result}
                              goToInvoicePage={goToInvoicePage}
                              openSellOrderModal={openSellOrderModal}
                              openCancelOrderModal={openCancelOrderModal}
                              offerEditPage={offerEditPage}
                              />
                              : null}
                            {this.state.loading === false &&
                              this.props.offers.offers_loaded === true &&
                              this.props.offers.active_offers.result.length === 0 ?
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
                              this.props.offers.offers_loaded === false ? 
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



                          </tbody> }
                        </table>

                      </div>
                    </div>

                          


                          {/****   Show pagination when total_pages is greater than 1 ******/}
                          {this.state.menuTwo === true && this.props.offers.active_offers.total_pages > 1 ? 
                                  <div className="col-xl-12 col-md-12 col-12 pagination-container" 
                                  style={{paddingRight: "20px", paddingLeft: "20px"}}>
                                                  <Paginator 
                                                      itemslist={this.props.offers.active_offers}
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

                  {/**************** SELL ORDER MODAL ****************/}                
                   <SellOrderModal 
                   hashrate={this.props.hashrate}
                   modalcontents={modalcontents}
                   modalLoading={this.state.modalLoading}
                   handleCloseModal={this.handleCloseModal}
                   showSellOrderModal={this.state.showSellOrderModal}
                   />

                   {/**************** CANCEL ORDER MODAL ****************/}                
                   <CancelOrderModal 
                   handleCloseModal={this.handleCloseModal}
                   modalcontents={modalcontents}
                   offerCancel={this.offerCancel}
                   showCancelOrderModal={this.state.showCancelOrderModal}
                   />

                   {/**************** PAYMENT ADDRESS MODAL ****************/}                
                   <PaymentAddressModal
                   handleCloseModal={this.handleCloseModal}
                   showPaymentAddressModal={this.state.showPaymentAddressModal}
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
  logoutUser: PropTypes.func,
  myProfilePage: PropTypes.func,
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
    logoutUser,
    myProfilePage,
    redirectErrorMessage,
    getBids,
    getOffers,
    getOfferInfo,
    getBidInfo,
    getHashrateInfo,
    cancelOffer
  }
)(MyProfile);
