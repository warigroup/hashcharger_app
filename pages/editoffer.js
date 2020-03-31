import React from "react";
import PublicRoute from "../components/routes/PublicRoute";
import {
  resetErrors,
  getCurrentProfile,
  getOfferInfo, 
  getStratumList,
  redirectErrorMessage,
  formSubmission,
  enableNavigation,
  clearPaymentInfo,
  clearNetwork,
  clearAlert,
  editOffers,
  timeoutError
} from "../actions/warihashApiCalls";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import NProgress from "nprogress";
import MarketNav from "../components/common/MarketNav";
import SweetAlert from "react-bootstrap-sweetalert";
import { Link, Router } from "../routes";
import { FaArrowLeft } from "react-icons/fa";
import Head from "next/head";
import {
  WAIT_ALERT,
  TIMEOUT_DURATION
} from "../utils/timeout-config";
import StratumForm from "../components/tools/StratumForm";
import Cookies from "js-cookie";
var Scroll = require('react-scroll');
var scroll = Scroll.animateScroll;

class EditOfferPage extends React.Component {
  constructor() {
    super();
    this.state = {
      isLoading: true,
      offerLoaded: false,
      countdown: "",
      editformloading: false,
      host: "",
      port: "",
      username: "",
      password: "",
      networkerror: "",
      stratum_id: ""
    };
    this.timer = null;
  };

  static async getInitialProps(props) {
    return props.query;
  };

  componentDidMount() {
    if (this.props.auth.isAuthenticated === false) {
      this.props.redirectErrorMessage();
    };
    if (this.props.auth.isAuthenticated === true) {
      this.props.getCurrentProfile();
      this.props.getStratumList();
      this.props.getOfferInfo(this.props.offerid);
      scroll.scrollToTop({ duration: 200 });
      this.setState({ isLoading: false });
      Cookies.remove("markethistory_page");
      Cookies.remove("page_number");
    };
  };

  componentDidUpdate(prevProps) {
    if(prevProps.offers.offer_info.result[0] !== this.props.offers.offer_info.result[0]) {
      this.setState({ offerLoaded: true });
    };
    if (
      this.props.network.networkstatus === 400 &&
      this.props.network.networkstatus !== prevProps.network.networkstatus
    ) {
      this.setState({ offerLoaded: true });
    };
    if (
      this.props.errors.alertnow === "alertnow" &&
      prevProps.errors.alertnow !== "alertnow"
    ) {
      NProgress.done();
      this.props.enableNavigation();
      setTimeout(() => {
        this.successAlert();
        this.setState({ editformloading: false });
      }, WAIT_ALERT);
    };
    if (prevProps.errors !== this.props.errors &&
      this.props.errors.errors === undefined) {
      this.setState({ editformloading: false });
      NProgress.done();
      this.props.enableNavigation();
    };
    if (
      (this.props.network.networkstatus === 500) &
      (prevProps.network.networkstatus !== 500)
    ) {
      NProgress.done();
      this.props.enableNavigation();
      this.setState({
        networkerror: "Failed for unknown reason. Contact info@warihash.com"
      });
      this.setState({ editformloading: false });
    };
  };
 
  componentWillUnmount() {
    this.props.clearPaymentInfo();
    this.props.clearNetwork();
    clearTimeout(this.timer);
  };

  editMyOffer = offer_id => {
    this.props.resetErrors();
    this.setState({ editformloading: true });
    NProgress.start();
    this.props.editOffers(
      offer_id, 
      this.state.host,
      this.state.port,
      this.state.username,
      this.state.password 
    );
    this.timer = setTimeout(() => {
      NProgress.done();
      this.setState({ formloading: false });
      this.props.enableNavigation();
      if (!this.props.errors) {
        this.props.timeoutError();
      }
    }, TIMEOUT_DURATION);
  };

  handleCancel = () => {
    Router.pushRoute('/profile')
  };

  handleChange = event => {
    const itemName = event.target.name;
    const itemValue = event.target.value;
    this.setState({ [itemName]: itemValue });
  };

  handleSelect = event => {
    this.setState({ stratum_id: event.target.value });
    this.selectStratumSetting(event.target.value);
  };

  selectStratumSetting = stratum_id => {
    const filteredStratum = this.props.stratum.stratum_list.find((stratum_setting) => {
       return stratum_setting.stratum_id == stratum_id;
     });
     if (filteredStratum !== undefined) {
      this.setState({ 
        host: filteredStratum.stratum_host,
        port: filteredStratum.stratum_port,
        username: filteredStratum.stratum_username,
        password: filteredStratum.stratum_password
      });
     } 
     if (filteredStratum === undefined) {
      this.setState({ 
        host: "",
        port: "",
        username: "",
        password: ""
      });
     }
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
        <p style={{ fontSize: "0.7em" }}>
          <br />
          You have successfully updated stratum setting in your offer!
          <br />
          Remaining hashing power will be delivered to your new stratum setting.
          <br />
          <br />
        </p>
      </SweetAlert>
    );
    this.setState({ successAlert: successAlert });
  };

  onConfirm = () => {
    this.setState({ host: "", port: "", username: "", password: ""});
    this.props.getOfferInfo(this.props.offerid);
    this.props.clearAlert();
    this.setState({ successAlert: null });
  };

  render() {
    const filteredInvoice = this.props.offers.offer_info.result.findIndex(
      offer => offer.offer_id == this.props.offerid
    );
    const loadingSpinner = (
      <img src="/static/three-dots-white.gif" style={{width: "33px", color: "white", paddingTop: "0px",
    paddingBottom: "0px", marginTop: "-10px", marginBottom: "-10px"}} />
    );
    const stratumList = this.props.stratum.stratum_list.map(stratum_list => {
      if (stratum_list.mining_algo == this.props.offers.offer_info.result[0].mining_algo) {
        return (
        <option
          className="selectstyles"
          value={stratum_list.stratum_id}
          key={stratum_list.stratum_id}
        >
         {stratum_list.stratum_tag} [{stratum_list.stratum_host}:{stratum_list.stratum_port}]
        </option>
      );
    } 
  });
      return (
          <PublicRoute>
            <Head>
            <title>WariHash | Edit Offer</title>
            <meta name="description" content="" />
            <meta name="keywords" content="" />
            </Head>
            <MarketNav />
              <div className="container">
                  <div className="row">
                  {this.state.successAlert}
                      <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12" style={{marginTop: "56px"}}>   
                      {
                      filteredInvoice === -1 &&
                      this.state.offerLoaded === true ? (         
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
                      </div>
                        ) : null }
                 
                 {this.state.isLoading === true && 
                 this.state.offerLoaded === false &&
                 this.props.offers.offer_info.result.length === 0 ?
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
              {this.state.isLoading === false &&  
              this.props.offers.offer_info.result.length !== 0 &&
              this.state.offerLoaded === true ?
                
                <div>
                <style jsx>
                    {`
                      .editpagetitle {
                        font-weight: bold;
                        font-size: 0.97em;
                        padding-top: 15px;
                        padding-bottom: 17px;
                      }

                      .save-stratum-btn {
                        background: #c526d8;
                        color: white;
                        border: none !important;
                        font-size: 0.92em !important;
                        padding: 9px 15px 9px 15px;
                        transition: 0.4s ease all;
                        width: 150px;
                      }

                      .mobilefix {
                        width: 150px;
                        position: relative;
                        top: 0.7px;
                      }
                      
                      .save-stratum-btn:hover {
                        background: rgb(224, 79, 240) !important;
                        color: white !important;
                        text-decoration: none !important;
                      }

                      .save-stratum-btn:focus,
                      .save-stratum-btn:active:focus,
                      .save-stratum-btn.active:focus,
                      .save-stratum-btn.focus,
                      .save-stratum-btn:active.focus,
                      .save-stratum-btn.active.focus {
                        background: rgb(224, 79, 240) !important;
                        outline: none !important;
                        box-shadow: none !important;
                      }


                      .currentsetting {
                        font-size: 0.83em;
                        padding-top: 0px;
                        padding-bottom: 0px;
                        line-height: 5px;
                      }
                      .page-title {
                        font-weight: 600;
                        font-size: 1.2em;
                      }
                      .finalize-order {
                        margin-bottom: 35px;
                      }
                      .link-items {
                        color: #3626a5;
                        text-decoration: none !important;
                        transition: 0.4s ease all;
                      }
                      .boldtexts {
                        font-weight: bold;
                      }
                      .link-items:hover {
                        color: #644dff;
                      }
                      @media (max-width: 993px) {
                        .managestratum-btn {
                          display: block !important;
                          margin-left: 15px;
                          margin-top: 17px;
                          width: 225px;
                        }
                      }
                      @media (max-width: 530px) {
                        .mobilefix {
                          display: block !important;
                          margin-left: 0px;
                          margin-top: 17px;
                          float: right;
                          width: 225px;
                        }

                        .save-stratum-btn {
                          width: 225px;
                        }
                      }
                    `}
                  </style>
                          
          {this.props.offers.offer_info.result.map(offer => {  
              if (offer.offer_id == this.props.offerid) {
                return (
                <div key={offer.offer_id}>

               <div className="container">
                 <div className="row">
                   <div className="col-xl-12 col-lg-12 col-md-12 col-lg-12">
                    <h4 className="page-title">Edit Stratum Setting for Offer #{offer.offer_id}</h4>
                    <br />
                    <h5 className="editpagetitle">
                            Current stratum setting:
                          </h5>
                          <p className="currentsetting">Host: {offer.stratum_host !== undefined ? offer.stratum_host : "N/A"}</p>
                          <p className="currentsetting">Port: {offer.stratum_port !== undefined ? offer.stratum_port : "N/A"}</p>
                          <p className="currentsetting">Username: {offer.stratum_username !== undefined ? offer.stratum_username : "N/A"}</p>
                          <br/>
                    </div>
               
                   {this.props.stratum.stratum_list.length > 0 &&
                     this.props.stratum.stratum_list.findIndex(stratum => stratum.mining_algo == this.props.offers.offer_info.result[0].mining_algo) !== -1 ?

                  
            <React.Fragment>
            <div className="col-md-12"  style={{marginLeft: "0px"}}>
               
               <p className="instructions"><strong>Switch to your saved stratum setting</strong></p>
               </div>

                <div className="col-md-4 col-sm-12 col-12" style={{paddingTop: "0px", paddingRight: "20px", 
             paddingBottom: "0px"}}>
             
                  <select
                    className="form-control selectstyles"
                    name="stratum_id"
                    placeholder="My stratum settings list"
                    value={this.state.stratum_id}
                    onChange={this.handleSelect}
                    style={{ height: "36px", fontSize: "0.8em" }}
                  >
                    <option className="selectstyles" value="">
                      My stratum settings list
                    </option>
                    {stratumList}
                  </select>
                </div> 
                
                <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12 col-12" style={{padding: "0px"}}>
                  <Link prefetch route="/stratum">
                    <a className="btn btn-primary btn-sm nooutline managestratum-btn" 
                    style={{height: "35px", paddingTop: "8px", borderRadius: "0px", fontSize: "0.77em"}}>
                  
                  Manage Stratum Settings    

                              </a>
                  </Link>
                </div>
                <br />
        
             </React.Fragment> : null }

           <div className="col-xl-12 col-lg-12 col-md-12">
            
           <h5 className="editpagetitle">
           {this.props.stratum.stratum_list.length > 0 &&
                     this.props.stratum.stratum_list.findIndex(stratum => stratum.mining_algo == this.props.offers.offer_info.result[0].mining_algo) !== -1 ?
           <span ><br/> or enter a new stratum setting:</span> : <span>
             Enter a new stratum setting:
           </span> }
                          </h5>
           </div>
              
           <StratumForm 
               handleChange={this.handleChange}
               host={this.state.host}
               port={this.state.port}
               username={this.state.username}
               password={this.state.password}
               />
            <div className="col-xl-6 col-lg-6 col-md-12">
            {this.props.time.message !== null ? 
               <p className="is-invalid-error add-padding-left">{this.props.time.message}</p> : null}
           {this.state.networkerror !== "" ? 
                           <p className="is-invalid-error add-padding-left">{this.state.networkerror}</p> : null}
            </div>
            <div className="col-xl-12 col-lg-12 col-md-12" style={{padding: "5px"}}/>
            <div className="col-xl-6 col-lg-6 col-md-12 col-12 text-right">
              <br />
            <button className="save-stratum-btn" 
            onClick={() => this.editMyOffer(offer.offer_id)}>{this.state.editformloading === true ? 
              loadingSpinner : <p style={{paddingTop: "0px", paddingBottom: "0px", marginBottom: "0px",
                marginLeft: "0px", marginRight: "0px", fontSize: "0.95em", fontWeight: "bold"}}>Submit</p>}</button>
            <button className="btn btn-sm btn-secondary mobilefix"
            style={{marginLeft: "15px", padding: "8px", borderRadius: "0px",
          position: "relative", top: "-1.7px", outline: "none", boxShadow: "none", fontWeight: "bold"}} 
            onClick={this.handleCancel}><p style={{paddingTop: "0px", paddingBottom: "0px", marginBottom: "0px",
            marginLeft: "0px", marginRight: "0px", fontSize: "0.95em"}}>Cancel</p></button>
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

  EditOfferPage.defaultProps = {
    auth: [],
    errors: [],
    profile: [],
    payment: [],
    offers: [],
    network: [],
    stratum: []
  };
  
  EditOfferPage.propTypes = {
    resetErrors: PropTypes.func,
    getCurrentProfile: PropTypes.func,
    getStratumList: PropTypes.func,
    getOfferInfo: PropTypes.func,
    redirectErrorMessage: PropTypes.func,
    formSubmission: PropTypes.func,
    enableNavigation: PropTypes.func,
    clearPaymentInfo: PropTypes.func,
    clearNetwork: PropTypes.func,
    clearAlert: PropTypes.func,
    editOffers: PropTypes.func,
    timeoutError: PropTypes.func,
    auth: PropTypes.object,
    errors: PropTypes.object,
    profile: PropTypes.object,
    network: PropTypes.object,
    payment: PropTypes.object,
    offers: PropTypes.object,
    configs: PropTypes.object,
    time: PropTypes.object,
    stratum: PropTypes.object,
    miningalgo: PropTypes.object
  };

  const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors,
    profile: state.profile,
    payment: state.payment,
    network: state.network,
    offers: state.offers,
    configs: state.configs,
    time: state.time,
    stratum: state.stratum,
    miningalgo: state.miningalgo
  });

  export default connect(mapStateToProps, 
    {resetErrors, 
      formSubmission,
      enableNavigation,
      getCurrentProfile, 
      getStratumList,
      getOfferInfo, 
      editOffers,
      redirectErrorMessage, 
      clearNetwork,
      clearAlert,
      clearPaymentInfo,
      timeoutError})(EditOfferPage);