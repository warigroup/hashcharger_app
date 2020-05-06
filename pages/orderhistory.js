import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Router } from "../routes";
//// COMPONENTS /////////////////
import PublicRoute from "../components/routes/PublicRoute";
import {
  getCurrentProfile,
  clearHashrateData,
  clearPaymentInfo,
  clearBids,
  clearOffers,
  clearNetwork,
  clearAlert,
  getBids,
  getOffers,
  getOfferInfo,
  getBidInfo,
  getBidHashrateChart,
  getHashrateInfo,
  orderHistoryPage,
  resetProfileLoading,
  setOldInvoiceId
} from "../actions/warihashApiCalls";
import Cookies from "js-cookie";
import { csrfcookie } from "../utils/cookieNames";
import Paginator from "../components/tools/Paginator";
import BidsList from "../components/profile/BidsList";
import BuyOrderModal from "../components/profile/BuyOrderModal";

class myOrderHistory extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      modaloffers: [{ bid_id: "" }],
      menuOpen: false,
      showBuyOrderModal: false,
      email: "",
      modalLoading: true,
      pagenumber: 0,
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
    this.props.orderHistoryPage();
    this.props.getBids(this.state.pagenumber, this.props.settings.sub_user);
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
    };
  };

  componentWillUnmount() {
    this.props.clearNetwork();
    this.props.clearHashrateData();
    this.props.clearAlert();
    this.props.resetProfileLoading();
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

  /// PAGINATION //////////////////////////

  selectNewPage = number => {
    let pagenumber = number - 1;
    this.props.getBids(pagenumber, this.props.settings.username);
  };

  prevPage = number => {
    let pagenumber = number - 1;
    this.props.getBids(pagenumber, this.props.settings.username);
  };

  nextPage = number => {
    let pagenumber = number + 1;
    this.props.getBids(pagenumber, this.props.settings.username);
  };

  firstPage = () => {
    let pagenumber = 0;
    this.props.getBids(pagenumber, this.props.settings.username);
  };

  lastPage = number => {
    let pagenumber = number;
    this.props.getBids(pagenumber, this.props.settings.username);
  };

  pageSix = () => {
    let pagenumber = 5;
    this.props.getBids(pagenumber, this.props.settings.username);

  };

  minusSix = number => {
    let pagenumber = number - 6;
    this.props.getBids(pagenumber, this.props.settings.username);
  };

  handleChange = event => {
    const itemName = event.target.name;
    const itemValue = event.target.value;
    this.setState({ [itemName]: itemValue });
  };

  render() {
    const modalcontents = this.state.modaloffers;

    const openBuyOrderModal = bid => {
      this.props.getBidHashrateChart(bid.bid_id);
      this.props.getBidInfo(bid.bid_id);
      this.setState({ showBuyOrderModal: true, menuOpen: false });
    };

    const goToInvoicePage = bid_id => { 
      this.props.setOldInvoiceId(bid_id);
      Router.pushRoute(`/invoice/id/${bid_id}`) 
    };

    return (
      <PublicRoute>
        <div className="container-fluid orderhistory-container">
          <div className="row">
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
                      @media (max-width: 730px) {
                        .tablecontainer {
                          margin-bottom: 80px;
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
                  <h4 className="marketplacetitle">My Order History</h4>
                  </div>

                  <div className="col-md-12 clearfix mb-2" />
                  <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12 tablecontainer">

                    <div className="buy-orders-table" style={{width: "100%"}}>
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
                          <thead style={{ background: this.props.theme.primary, color: this.props.theme.tabletexts }}>
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
                              primary={this.props.theme.primary}
                              buttontexts={this.props.theme.buttontexts}
                              goToInvoicePage={goToInvoicePage}
                              openBuyOrderModal={openBuyOrderModal}
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
                          {this.props.bids.bids.total_pages > 1 ? 
                                  <div className="col-xl-12 col-md-12 col-12 pagination-container" 
                                  style={{paddingRight: "20px", paddingLeft: "20px"}}>
                                                  <Paginator 
                                                      itemslist={this.props.bids.bids}
                                                      primary={this.props.theme.primary}
                                                      buttontexts={this.props.theme.buttontexts}
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

myOrderHistory.defaultProps = {
  profile: [],
  network: [],
  errors: [],
  miningalgo: [],
  configs: [],
  bids: [],
  hashrate: [],
  offers: []
};

myOrderHistory.propTypes = {
  getCurrentProfile: PropTypes.func,
  getBidHashrateChart: PropTypes.func,
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
  orderHistoryPage: PropTypes.func,
  resetProfileLoading: PropTypes.func,
  setOldInvoiceId: PropTypes.func,
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
  miningalgo: PropTypes.object,
  settings: PropTypes.object,
  theme: PropTypes.object
};

const mapStateToProps = state => ({
  profile: state.profile,
  configs: state.configs,
  errors: state.errors,
  network: state.network,
  offers: state.offers,
  time: state.time,
  bids: state.bids,
  payment: state.payment,
  hashrate: state.hashrate,
  miningalgo: state.miningalgo,
  settings: state.settings,
  theme: state.theme
});

export default connect(
  mapStateToProps,
  {
    getCurrentProfile,
    getBidHashrateChart,
    clearHashrateData,
    clearPaymentInfo,
    clearBids,
    clearOffers,
    clearNetwork,
    clearAlert,
    getBids,
    getOffers,
    getOfferInfo,
    getBidInfo,
    getHashrateInfo,
    orderHistoryPage,
    resetProfileLoading,
    setOldInvoiceId
  }
)(myOrderHistory);
