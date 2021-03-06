import React from "react";
import PublicRoute from "../components/routes/PublicRoute";
import {
  getBidInfo, 
  clearPaymentInfo,
  clearNetwork,
  invoicePage
} from "../actions/warihashApiCalls";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link } from "../routes";
import { convertDuration } from "../utils/convertDuration";
import copy from 'copy-to-clipboard';
import { googleAnalytics } from "../settings";

const moment = require('moment-timezone');
var Scroll = require('react-scroll');
var scroll = Scroll.animateScroll;
var QRCode = require('qrcode.react');

class InvoicePage extends React.Component {
  _isMounted = false;
  constructor() {
    super();
    this.state = {
      isLoading: true,
      bidsLoaded: false,
      copied: false,
      countdown: "",
      percentage: 0,
      cancelLoading: false,
      msIE: false,
      isSent: false,
      isFailed: false
    };
    this.countdownTimer = null;
    this.getbidsTimer = null;
  };

  static async getInitialProps(props) {
    return props.query;
  };

  componentDidMount() {
    this._isMounted = true;
      this.props.invoicePage();
      window.addEventListener("focus", this.onFocus);
      //// get invoice info 
      this.props.getBidInfo(this.props.bidid, this.props.token.value);
      this.automaticRefresh();
      if (/*@cc_on!@*/false || !!document.documentMode === true) {
        this.setState({ msIE: true });
      };
      scroll.scrollToTop({ duration: 200 });
      this.setState({ isLoading: false });
  };

  componentDidUpdate(prevProps) {
    if(prevProps.bids.bid_info.result[0] !== this.props.bids.bid_info.result[0]) {
      this.setState({ bidsLoaded: true });
    };
    if (
      this.props.network.networkstatus === 400 &&
      this.props.network.networkstatus !== prevProps.network.networkstatus
    ) {
      this.setState({ bidsLoaded: true });
    };
  };

    /// SUCCESS ALERT ////////////////////////////

  automaticRefresh = () => {
    this.getbidsTimer = setInterval(() => {
      if (this._isMounted && 
        this.state.isSent === false && 
        this.state.isFailed === false) {
        this.props.getBidInfo(this.props.payment.bid_id, this.props.token.value);
      }
    }, 5000);
  };
 
  setCountdown = (invoice_expiration_time, invoice_length_min) => { this.countdownTimer = setInterval(() => {
      let utctime = moment().tz('UTC').valueOf() / 1000;
      let expirationtime = moment(invoice_expiration_time).valueOf() / 1000;
      let remainingtime = expirationtime - utctime;
      let minutes = Math.floor(remainingtime / 60);
      let seconds = Math.trunc(remainingtime % 60);
      let countdowntime = (minutes > 0 ? minutes : "0") + (minutes > 1 ? ' minutes' : ' minute') + " and " + (seconds < 10 ? '0' : '') + seconds + " seconds";
      let progressbarTime =  100 - Math.floor(minutes * 100 / invoice_length_min );
      if (this._isMounted && 
        this.state.isSent === false &&
        this.state.isFailed === false) {
        this.setState({ countdown: countdowntime, percentage: progressbarTime });
      };
    }, 1000);
  };

  stopRefresh = () => {
    clearInterval(this.countdownTimer, this.getbidsTimer);
    this.setState({ isFailed: true });
    this._isMounted = false;
  };

  stopRefreshAndCheck = () => {
    clearInterval(this.countdownTimer, this.getbidsTimer);
    this.setState({ isFailed: true });
    this.props.getBidInfo(this.props.bidid, this.props.token.value);
    this._isMounted = false;
  };

  successConversion = invoice_id => {
    if (this._isMounted && 
      googleAnalytics === "on" &&
      this.state.isSent === false) {
      window.gtag('event', 'conversion', 
      { 'send_to': 'AW-693268366/ieyuCOvusbcBEI7fycoC', 
      'transaction_id': `${invoice_id}` }); 
      window.ga('send', {
        hitType: 'event',
        eventCategory: 'marketplace',
        eventAction: 'funded',
        eventLabel: 'Marketplace Events'
      });
      this.setState({ isSent: true });
      this._isMounted = false;
    } else {
      return false
    }
    clearInterval(this.countdownTimer, this.getbidsTimer);
  };

  componentWillUnmount() {
    this._isMounted = false;
    clearInterval(this.countdownTimer, this.getbidsTimer);
    window.removeEventListener("focus", this.onFocus);
    this.props.clearNetwork();
  };

  copyAndShowAlert = payment_address => {
    copy(payment_address);
    this.setState({ copied: true })
  };

  onFocus = () => {
    this.props.getBidInfo(this.props.bidid, this.props.token.value);
    this.setCountdown();
    this.automaticRefresh();
  };

  render() {
    let utctime = moment().tz('UTC').valueOf() / 1000;
      return (
          <PublicRoute>
              <div className="container">
                  <div className="row">
                      <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12" style={{marginTop: "56px"}}>   
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
                      .invoice-container {
                        border: 1px solid black;
                        border-radius: 0px;
                      }
                      .invoice-section {
                        padding: 25px 45px 25px 45px;
                      }
                      .invoice-left {
                        background: #f4f4f4;
                      }
                      .invoice-section-title {
                        font-weight: bold;
                        font-size: 1em;
                        margin-bottom: 25px;
                      }

                      .invoice-info p {
                        font-size: 0.81em;
                      }

                      .invoice-label {
                        font-weight: bold;
                      }

                      .stratum-info {
                        color: rgba(0,0,0,0.49);
                      }
                      .paymentinfo {
                        font-weight: 600;
                      }
                      .redtexts {
                        color: #ee5e5e;
                      }
                      .discounted-texts {
                        color: #3626a5;
                        font-weight: bold;
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

                      .progress-bar-background {
                        background: rgba(0,0,0,0.37);
                        height: 30px;
                        width: 100%;
                        color: white;
                      }

                      .progress-bar-background p {
                        font-size: 0.85em;
                        margin-top: 5px;
                      }

                      .btcaddress-container {
                        padding-bottom: 0px; 
                        padding-top: 25px;
                      }

                      @media(max-width: 720px) {
                        .mobile-padding {
                          margin-bottom: 120px;
                        }
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
                          margin-right: 12px;
                          margin-top: 10px;
                        }
                      }

                      @media(max-width: 460px) {
                        .btc-address-input {
                          width: 200px;
                        }
                        .copied-message {
                          margin-left: 200px !important;
                        }
                      }

                      @media(max-width: 389px) {
                        .btc-address-input {
                          width: 165px;
                        }
                        .copied-message {
                          margin-left: 159px !important;
                        }
                      }
                      @media(max-width: 367px) {
                        .btc-address-input {
                          width: 150px;
                        }
                        .btcaddress-container {
                          padding-left: 0px; 
                          padding-right: 0px; 
                          padding-bottom: 0px; 
                          padding-top: 25px;
                        }
                        .copied-message {
                          margin-left: 143px !important;
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
                      <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12 invoice-left invoice-container" 
                      style={{paddingLeft: "0px", paddingRight: "0px"}}>
                        <div style={{paddingLeft: "30px", paddingRight: "25px", paddingTop: "25px", paddingBottom: "13px"}}>
                        <br />
                        <h5 className="invoice-section-title">Payment Total</h5>
                        <h2>{bid.payment_amount} BTC</h2>
                     </div>
                   
                {/*********** PAYMENT FAIL  *********************/}
                { bid.payment_fail === true ?  
                <div className="invoice-section text-center">
                  <img src="/static/x-circle.svg" style={{ width: "140px", margin: "20px" }} /><br/>
                <p className="invoice-contents" style={{marginTop: "20px", marginBottom: "26px"}}>
                You have failed to make the payment on time. <br />
                Your order has been cancelled.</p>
                {this.state.isFailed === false ? this.stopRefresh() : null}
                </div> : null }

                {/*********** PAYMENT SUCCESS  ******************/}
                { bid.payment_success === true ? 
                 <div className="invoice-section text-center">
                   <img src="/static/checkmark.svg" style={{ width: "140px", margin: "20px" }} /><br/>
                <p className="invoice-contents" style={{marginTop: "20px", marginBottom: "26px"}}>
                You have successfully made the payment! <br /> 
                Hashing power is being delivered.</p>
                {this.state.isSent === false ? this.successConversion(bid.invoice_id) : null}
                </div> : null }
               
               {/*********** PAYMENT STILL PROCESSING  ******************/}
               { bid.payment_success === false && bid.payment_fail === false && 
                moment(bid.invoice_expiration_time).valueOf() / 1000 < utctime ? 
                 <div className="invoice-section text-center">
                   <br />
                <p className="invoice-contents" style={{marginTop: "22px", marginBottom: "26px"}}>
                We're processing your order. Please check this invoice page later.</p>
                {this.state.isFailed === false ? this.stopRefreshAndCheck() : null}
                </div> : null }

                {/*********** WAITING FOR PAYMENT  **************/}
                { bid.payment_success === false && bid.payment_fail === false && 
                moment(bid.invoice_expiration_time).valueOf() / 1000 > utctime  ? 
                <React.Fragment>
                  {this.state.msIE === false ? 
                
                <div className="progress-bar-background">
                      <div className="progress-bar-component" 
                      style={ bid.payment_success === false && bid.payment_fail === false && 
                moment(bid.invoice_expiration_time).valueOf() / 1000 > utctime ? 
                        
                        { position: "absolute", background: this.props.theme.secondary, height: "30px", width: `${this.state.percentage}%`} :
                        { position: "absolute", background: this.props.theme.secondary, height: "30px", width: "100%" } }>
                      </div>
                      <div className="container-fluid">
                        <div className="row">
                          <div className="col-md-6 col-sm-6 col-6 d-md-inline d-sm-inline d-none text-left">
                               <p style={{ color: this.props.theme.buttontexts }}>Waiting for payment...</p>
                            </div>
                            <div className="col-md-6 col-sm-6 col-12 d-md-inline d-sm-inline d-inline text-right">
                            <span className="paymentinfo"
                                style={{ fontSize: "0.85em", position: "relative", top: "2.5px", color: this.props.theme.buttontexts }}> {this.state.countdown}</span>
                              </div>
                          </div>
                        </div>
                    </div> : null }
                    <div style={{paddingTop: "30px", paddingBottom: "5px", paddingLeft: "30px", paddingRight: "25px"}}>
                    {this.state.msIE === false ? 
                <p className="invoice-contents" style={{marginTop: "15px", marginBottom: "0px"}}>Please make a payment of <span className="paymentinfo">{bid.payment_amount} BTC</span> to complete purchase.
                {/********* Set countdown and automatic page refresh ********/}
                {this.state.isSent === false ? this.setCountdown(
                    bid.invoice_expiration_time,
                    Math.floor((moment(bid.invoice_expiration_time).valueOf() - moment(bid.invoice_creation_time).valueOf())/1000/60)) : null}
               
                </p> : null }

                <div className="btcaddress-container">
                  {this.state.msIE === false ? 
                  <React.Fragment>
                    <p style={{fontSize: "0.9em", fontWeight: "bold"}}>Copy BTC address to clipboard:</p>
                    <div className="form-group">
                  
                <input defaultValue={bid.payment_address} 
                className="form-control btc-address-input" 
                style={{fontSize: "15px", display: "inline-block",
                borderTopRightRadius: "0px",
                borderBottomRightRadius: "0px"}} />

                  <button onClick={() => this.copyAndShowAlert(bid.payment_address)}
                  className="btn btn-light" 
                  title="Copy to clipboard"
                  style={{display: "inline-block", border: "1px solid rgba(0,0,0,0.5)",
                  paddingTop: "4.1px", paddingBottom: "5.9px", position: "relative", top: "-1.5px",
                  borderTopLeftRadius: "0px",
                  borderBottomLeftRadius: "0px"}}> 
                    <img src="/static/clippy.png" alt="Copy to clipboard" 
                    style={{width: "19px"}} />
                  </button>
                  <p className="copied-message">
                    {this.state.copied === true ? "Copied!" : null}
                  </p></div>
                  </React.Fragment>
                : 
                <React.Fragment>
                   <p style={{fontSize: "0.9em"}}>Please make a payment to below BTC address within {invoiceExpMin} minutes:</p>
                   <p style={{fontSize: "0.9em", fontWeight: "bold"}}>{bid.payment_address}</p>
                </React.Fragment>
                }
                  
                  
                  <p style={{fontSize: "0.9em", fontWeight: "bold"}}>Scan QR Code:</p>
                  <QRCode 
                  value={`bitcoin:${bid.payment_address}?amount=${bid.payment_amount}`} 
                  size={200}/>
                  <br/><br/><br/>
                  </div>
                </div>
                </React.Fragment> : null }

                        </div>

                         <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12 invoice-section">
                           <br />
                           <h5 className="invoice-section-title" 
                           style={{marginTop: "16px", paddingBottom: "5px"}}>Invoice For Order #{bid.bid_id}</h5>
                           <div className="invoice-info">
                           <p><span className="invoice-label">Hashrate Reserved:</span> {bid.reserved_hashrate}{" "}{bid.hashrate_units}H/s</p>
                            </div>

                            {bid.discount_amount == 0 ? 
                          <div className="invoice-info">
                            <p><span className="invoice-label">Rate:</span> {bid.reserved_average_price}{" "}<span style={{display: "inline-block"}}>{this.props.configs.payment_vehicle}/{(this.props.configs[bid.mining_algo] || {}).price_hash_units}
                                 Hashes/sec/{(this.props.configs[bid.mining_algo] || {}).price_time_units}</span></p>
                          </div> : null}
                          
                          {bid.discount_amount > 0 ? 
                          <div className="invoice-info">
                          <p><span className="invoice-label discounted-texts">Discount Applied:</span> <span>You saved {bid.discount_amount} BTC</span></p>
                        </div>
                          : null}

                          {bid.discount_amount > 0 ? 
                          <div className="invoice-info">
                          <p><span className="invoice-label discounted-texts">Discounted Rate:</span> {bid.discount_reserved_average_price}{" "}<span style={{display: "inline-block"}}>{this.props.configs.payment_vehicle}/{(this.props.configs[bid.mining_algo] || {}).price_hash_units}
                               Hashes/sec/{(this.props.configs[bid.mining_algo] || {}).price_time_units}</span></p>
                        </div>
                         : null}

                          <div className="invoice-info">
                           <p>
                             <span className="invoice-label">Duration:</span> {convertDuration(bid.duration)}
                           </p>
                           </div>
                        
                           <h5 className="invoice-section-title" 
                           style={{marginTop: "35px", paddingBottom: "5px"}}>Refund Information</h5>

                          <div className="invoice-info">
                            <p>
                              <span className="invoice-label">Owed Refund:</span> {bid.settlement_is_finished === false ? "Order is not finished yet" : bid.refund_amount + " BTC"}
                            </p>
                            <p>
                              <span className="invoice-label">Refund Method:</span> {bid.refund_address === null ? "Credit given to user account" : "Send to " + bid.refund_address}
                            </p>
                            <p>
                          <span className="invoice-label">Refund Transaction:</span> {bid.refund_txid === null ? "Not available" : <a href={`https://blockstream.info/tx/` + bid.refund_txid}>https://blockstream.info/tx/{bid.refund_txid}</a>}
                            </p>
                          </div>

                           <div className="stratum-info">
                           <h5 className="invoice-section-title" 
                           style={{marginTop: "35px", paddingBottom: "5px"}}>Stratum Configuration</h5>
                           <div className="invoice-info">
                                 <p><span className="invoice-label">Stratum Host:</span> {bid.stratum_host}</p>
                            </div>

                          <div className="invoice-info">
                            <p><span className="invoice-label">Stratum Port:</span> {bid.stratum_port}</p>
                          </div>
                       
                           </div>
                         
                           <div className="mobile-padding" style={{paddingBottom: "25px", paddingTop: "25px"}}>    
                   <p className="invoice-contents">
                  This invoice can be accessed again through{" "}
                  <Link route="/orderhistory"><a className="link-items">order hisotry page</a></Link>.
                  </p>
                     </div>
                     <br />        
                         </div>
                        </div>
                      </div>
                  </div>
                );
              }
            })
          }

                    </div>
                    <br />
                    <br />
                  </div>
              </div>
          </div>
      </PublicRoute>
      )
    }
  }

  InvoicePage.defaultProps = {
    payment: [],
    bids: [],
    network: []
  };
  
  InvoicePage.propTypes = {
    getBidInfo: PropTypes.func,
    clearPaymentInfo: PropTypes.func,
    clearNetwork: PropTypes.func,
    invoicePage: PropTypes.func,
    network: PropTypes.object,
    payment: PropTypes.object,
    errors: PropTypes.object,
    bids: PropTypes.object,
    settings: PropTypes.object,
    configs: PropTypes.object,
    theme: PropTypes.object,
    token: PropTypes.object
  };

  const mapStateToProps = state => ({
    network: state.network,
    payment: state.payment,
    errors: state.errors,
    bids: state.bids,
    settings: state.settings,
    configs: state.configs,
    theme: state.theme,
    token: state.token
  });

  export default connect(mapStateToProps, 
    {getBidInfo, 
      clearNetwork,
      clearPaymentInfo,
    invoicePage})(InvoicePage);