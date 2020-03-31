import PublicRoute from "../components/routes/PublicRoute";
import React from "react";
import { connect } from "react-redux";
import { Link, Router } from "../routes";
import {
  FaBitcoin
} from "react-icons/fa";
import PropTypes from "prop-types";
import SweetAlert from "react-bootstrap-sweetalert";
import Head from "next/head";
import NProgress from "nprogress";
import {
  makeOffer,
  clearAlert,
  logoutUser,
  getCurrentProfile,
  resetErrors,
  clearNetwork,
  clearCurrentProfile,
  redirectErrorMessage,
  algoSelect,
  formSubmission,
  enableNavigation,
  getMinersList,
  timeoutError,
  timeoutReset,
  sellPage,
  getStratumList
} from "../actions/warihashApiCalls";
import MiningAlgoDropDown from "../components/tools/MiningAlgoDropDown";
import Cookies from "js-cookie";
import { maintenanceMode, algorithms } from "../settings";
import PaymentRate from "../components/tools/PaymentRate";
import { TIMEOUT_DURATION, WAIT_ALERT } from "../utils/timeout-config";
import { csrfcookie } from "../utils/cookieNames";
import StratumForm from "../components/tools/StratumForm";
import ThreeDotsLoading from "../components/tools/ThreeDotsLoading";
var Scroll = require('react-scroll');
var scroll = Scroll.animateScroll;

class SellHashingPower extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      miner_id: "",
      stratum_id: "",
      price: "",
      host: "",
      port: "",
      username: "",
      password: "",
      networkerror: "",
      location: "NA East",
      pricefocus: false,
      makeofferloading: false,
      loading: true,
      mining_algo: this.props.miningalgo.algorithm
    };
    this.timer = null;
  }

  componentDidMount() {
    if (maintenanceMode === "true") {
      this.props.logoutUser();
    };
    this.props.timeoutReset();
    this.props.clearNetwork();
    this.props.sellPage();
    this.setState({ makeofferloading: false });
    this.props.resetErrors();
    const algocookie = Cookies.get("algo_select");
    if (algocookie !== undefined && algorithms.includes(algocookie) === true) {
      this.props.algoSelect(algocookie);
    }

    if (algocookie === undefined) {
      this.props.algoSelect("sha256d");
    }

    if (this.props.auth.isAuthenticated === true) {
        if (this.props.profile.profile.username === "") {
          this.props.getCurrentProfile();
        };
        scroll.scrollToTop({duration: 200});
        // load miners list
        this.loadMinersList().then(this.setState({ loading: false }));
        // load stratum list
        this.props.getStratumList();
        Cookies.remove("markethistory_page");
        Cookies.remove("page_number");
    };
  };

  componentDidUpdate(prevProps) {
    if (prevProps.errors !== this.props.errors &&
      this.props.errors.errors === undefined) {
      this.setState({ makeofferloading: false });
      NProgress.done();
      this.props.enableNavigation();
    };
    if (prevProps.errors !== this.props.errors &&
      this.props.errors.miner_id !== undefined) {
        scroll.scrollTo(200, {duration: 220});
    };
    if (
      this.props.errors.alertnow === "alertnow" &&
      prevProps.errors.alertnow !== "alertnow"
    ) {
      NProgress.done();
      setTimeout(() => {
        this.successAlert();
        this.props.enableNavigation();
        this.setState({ networkerror: "", makeofferloading: false });
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
      this.props.clearCurrentProfile();
      this.props.logoutUser();
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
      this.setState({ makeofferloading: false });
    };
    if (
      this.props.network.networkstatus === 401 &&
      prevProps.network.networkstatus !== 401
    ) {
      this.props.logoutUser();
    };
    clearTimeout(this.timer);
  };

  async loadMinersList() {
    this.props.getMinersList(this.props.miningalgo.algorithm);
  };

  componentWillUnmount() {
    this.props.clearNetwork();
    this.props.resetErrors();
    // clean up any settimeout function
    clearTimeout(this.timer);
  };

  handleSubmit = event => {
    event.preventDefault();
    this.setState({ makeofferloading: true });
    NProgress.start();
    this.props.formSubmission();
    this.props.resetErrors();
    this.props.timeoutReset();
    this.props.makeOffer(
      this.state.miner_id,
      this.state.price,
      this.state.mining_algo,
      this.state.host,
      this.state.port,
      this.state.username,
      this.state.password
    );
    this.timer = setTimeout(() => {
      NProgress.done();
      this.setState({ makeofferloading: false });
      this.props.enableNavigation();
      if (!this.props.errors) {
        this.props.timeoutError();
      }
    }, TIMEOUT_DURATION);
  };

  handleStratumSelect = event => {
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
        //  showCancel
        confirmBtnText="Confirm"
        //  cancelBtnText="Go to marketplace"
        confirmBtnBsStyle="default"
        //  cancelBtnBsStyle="default btn-sm"
        title=""
        onConfirm={this.onConfirm}
        style={{borderRadius: "0px"}}
      //  onCancel={this.onCancel}
      >
        <p style={{ fontSize: "0.71em" }}>
          <br />
          Your sell order has been created. 
          Please connect your miner to stratum server at{" "}
          
            NA East: <span style={{fontWeight: "bold"}}>{this.props.configs &&
            this.props.configs[this.props.miningalgo.algorithm] &&
            this.props.configs[this.props.miningalgo.algorithm]["NA East"] &&
            this.props.configs[this.props.miningalgo.algorithm]["NA East"].proxy}</span>,{" "}
            NA West: <span style={{fontWeight: "bold"}}>{this.props.configs &&
            this.props.configs[this.props.miningalgo.algorithm] &&
            this.props.configs[this.props.miningalgo.algorithm]["NA West"] &&
            this.props.configs[this.props.miningalgo.algorithm]["NA West"].proxy}</span>, or{" "}
            EU West: <span style={{fontWeight: "bold"}}>{this.props.configs &&
            this.props.configs[this.props.miningalgo.algorithm] &&
            this.props.configs[this.props.miningalgo.algorithm]["EU West"] &&
            this.props.configs[this.props.miningalgo.algorithm]["EU West"].proxy}
          </span>.{" "}
          Your stratum username should be{" "}
          <span style={{fontWeight: "bold"}}>
            {this.props.profile.profile !== null
              ? this.props.profile.profile.username
              : ""}
            .your_miner_name
                    </span>. 
          For further details on your order, please see your <Link route="/profile/sellorders"><a>profile page</a></Link>.
          <br />
          <br />
        </p>
      </SweetAlert>
    );
    this.setState({ successAlert: successAlert });
  };

  onConfirm = () => {
    this.setState({ successAlert: null, networkerror: "" });
    this.props.clearAlert();
    this.props.clearNetwork();
    NProgress.done();
    this.props.enableNavigation();
  };

  handleChange = event => {
    const itemName = event.target.name;
    const itemValue = event.target.value;
    this.setState({ [itemName]: itemValue });
  };

  handleSelect = event => {
    this.setState({ miner_id: event.target.value });
    this.getMinerProxy(event.target.value);
  };

  getMinerProxy = miner_id => {
      const filteredMiner = this.props.profile.miners.find((miners) => {
        return miners.miner_id == miner_id;
      });
      if (filteredMiner !==  undefined) {
        this.setState({ 
          location: filteredMiner.location
        });
      }
  }

  handlePriceFocus = () => this.setState({ pricefocus: true });
  handlePriceBlur = () => this.setState({ pricefocus: false });

  /// ALGORITHM SELECTOR /////////////////////
  selectAlgorithm = algorithm_name => {
    this.props.algoSelect(algorithm_name);
    this.setState({ mining_algo: algorithm_name });
    this.props.getMinersList(algorithm_name);
    Cookies.set("algo_select", algorithm_name, { expires: 7 });
  };

  saveAndRedirect = url => {
    if (url === "login") {
      Router.pushRoute('/login');
    };
    if (url === "register") {
      Router.pushRoute('/register');
    };
  };

  redirectShowError = () => {
    this.props.redirectErrorMessage();
    Router.pushRoute('/login');
  };

  render() {
    const fielderrors = Object.keys(this.props.errors);
    const fielderrorsReason = this.props.errors[fielderrors];
    const loginURL = "login";
    const registerURL = "register";
    const {
      loading,
      pricefocus,
      paymentfocus
    } = this.state;

    const pleaseAdd = (
      <div style={{ textAlign: "left", paddingLeft: "20px" }}>
        <p
          style={{
            fontSize: "0.7em",
            color: "rgba(0,0,0,0.6)",
            paddingTop: "5px"
          }}
        >
          No miners found. Please add your miners to your profile.
          <br />
        </p>
      </div>
    );

    const minersList = this.props.profile.miners.map(miners => {
      return (
        <option
          className="selectstyles"
          value={miners.miner_id}
          key={miners.miner_id}
        >
          {miners.name}
        </option>
      );
    });

    const stratumList = this.props.stratum.stratum_list.map(stratum_list => {
        if (stratum_list.mining_algo == this.props.miningalgo.algorithm) {
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
          <title>WariHash | Sell Hashing Power</title>
       
            <meta name="description" content="" />
            <meta name="keywords" content="" />
            <meta name="author" content="" />
         
        </Head>
        <div style={{ width: "100%", height: "100%", background: "white" }}>
          <style jsx>
            {`
               
               .number-circle {
                 border: 2.5px solid #3626a5;
                 border-radius: 50%;
                 padding: 0px 7px 1px 7px;
                 color: #3626a5;
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
               .notamember-link {
                display: inline-block; 
                font-size: 0.85em; 
                cursor: pointer;
                font-weight: bold;
                transition: 0.2s ease all;
              }
              .notamember-link span {
                color: #3626a5;
              }
              .notamember-link:hover {
                opacity: 0.7;
              }

               .btn-primary{
                 border: 1px solid #3626a5;
               }

               .offerformlabel span {
                 color: rgba(0,0,0,0.5);
               }

               .miner-instructions {
                font-size: 0.82em;
                 margin-top: 18.5px;
                 margin-bottom: 43px;
               }
               .miner-instructions span {
                 font-weight: bold;
                 color: #3626a5;
               }
              .router-title {
                margin-top: 13px;
                margin-left: 15px;
                display: inline-block;
                margin-right: 14px;
                margin-bottom: 25px;
              }
              .router-description {
                font-size: 0.82em;
                display: inline-block;
                margin-top: 15px;
                margin-bottom: 20px;
              }
              .addminerbtn-style {
                margin-top: 0px;
                margin-bottom: 5px;
                padding-top: 7px;
                padding-bottom: 7px;
                padding-left: 13px;
                padding-right: 13px;
                font-size: 0.82em;
                border-radius: 0px;
              }

              .stratum-address-container {
                padding-right: 30px; 
                padding-left: 0px;
              }

              .submit-btn {
                font-size: 0.85em;
                background: #c526d8;
                border: 1px solid #c526d8;
                border-radius: 0px;
                width: 147px;
                height: 40px;
                margin-top: 11px;
                margin-bottom: 0px;
                color: white;
                font-weight: 600;
              }

              .submit-btn p {
                padding-top: 3px;
              }

              .submit-btn:hover {
                background: rgb(224, 79, 240) !important;
              }
              
              .submit-btn:focus,
              .submit-btn:active:focus,
              .submit-btn.active:focus,
              .submit-btn.focus,
              .submit-btn:active.focus,
              .submit-btn.active.focus {
                background: rgb(224, 79, 240) !important;
                outline: none !important;
                box-shadow: none !important;
              }

              .clearbtn {
                font-size: 0.85em;
                background: #999;
                border: 1px solid #999;
                border-radius: 0px;
                width: 147px;
                height: 40px;
                margin-top: 11px;
                margin-bottom: 0px;
                margin-left: 18px;
                padding-top: 9.5px;
                color: white;
                font-weight: 600;
              }

              .clearbtn:hover {
                background: rgba(0, 0, 0, 0.33);
              }

              .inputlabel {
                font-size: 0.83em;
                margin-bottom: 8px;
              }

              .formcontainer-sell {
                border: none;
                width: 100%;
                padding: 30px 40px 5px 40px;
                margin-top: 20px;
                box-shadow: none;
              }

              .algo-container {
                margin-top: 25px;
                margin-bottom: 50px;
              }

              .btnadjustments {
                margin-left: 38px;
              }

              .selectstyles {
                height: 36px; 
                font-size: 0.85em; 
                width: 290px;
                display: inline-block;
              }

              @media (max-width: 777px) {
                .btnadjustments {
                  margin-left: 0px;
                  width: 50%;
                }
              }

              @media (max-width: 770px) {
                .offerformlabel {
                  display: inline-block; 
                  margin-left: 15px;
                  font-weight: bold;
                  font-size: 1.1em;
                }
              }

              @media (max-width: 650px) {
                
                .selectstyles {
                  width: 295px;
                }
                .formcontainer-sell {
                  padding: 10px;
                  margin-left: 3px;
                }
                .containerpadding {
                  padding: 10px;
                }
                .algo-container {
                  margin-bottom: 10px;
                  font-size: 0.9em;
                }
              }

              @media (max-width: 500px) {
                .selectstyles {
                  width: 285px;
                }
                .btnadjustments {
                  margin-left: 0px;
                  width: 100%;
                }
              }
              @media (max-width: 450px) {
                .number-circle {
                  border: 2.5px solid #3626a5;
                  border-radius: 50%;
                  padding: 1px 5px 1px 5px;
                  color: #3626a5;
                  display: inline-block;
                  font-size: 0.75em;
                  font-weight: bold;
                  position: relative;
                  top: -2px;
                }
                .offerformlabel {
                  display: inline-block; 
                  margin-left: 6px;
                  font-weight: bold;
                  font-size: 0.95em;
                }
                .submit-btn {
                  width: 120px;
                }
                .clearbtn {
                  width: 120px;
                }
              }
            `}
          </style>
          <div className="container">
            <div className="row">
              <div className="col-md-12 col-sm-12 col-12 algo-container">
                {/******* MINING ALGORITHM SELECTOR *********/}
                <div style={{ marginTop: "46px", display: "inline-block" }}>
                  <h4 className="marketplacetitle">
                    Sell Hashing Power for
                  </h4>
                    <MiningAlgoDropDown 
                    selectAlgorithm={this.selectAlgorithm}
                    />
                </div>
                {/******* MINING ALGORITHM SELECTOR END *********/}
              </div>
            </div>
          </div>

          <form
            onSubmit={this.handleSubmit}
            id="sell-form"
          >
            <div className="container containerpadding">
              {this.state.successAlert}
              <div className="row containerpadding">
                <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12" 
                style={{ marginBottom: "32px" }}>

                  <h4 className="number-circle">1</h4>
                  <h4 className="offerformlabel">
                    Add mining hardware
                            </h4>


                </div>
                <div className="col-xl-3 col-lg-4 col-md-5 col-sm-12 col-12">
                  <select
                    className="form-control selectstyles"
                    name="miner_id"
                    placeholder="Choose your miners"
                    value={this.state.miner_id}
                    onChange={this.handleSelect}
                    style={{ height: "42px", fontSize: "0.8em" }}
                  >
                    <option className="selectstyles" value="" disabled>
                      Choose your miners
                              </option>
                    {minersList}
                  </select>

                  {this.props.errors.miner_id !== undefined ? <p className="is-invalid-error add-padding-left">
                      {this.props.errors.miner_id}</p> : null}
                </div>

                <div className="col-xl-4 col-lg-4 col-md-5 col-sm-12 col-12 addminersbtn">
                  {this.props.auth.isAuthenticated === true ? 
                  <Link prefetch route="/addminers">
                    <a className="btn btn-primary btn-sm nooutline addminerbtn-style btnadjustments"
                    style={{ height: "40px", paddingTop: "9px" }}>
                      + Add New Miners
                    </a>
                  </Link> : 
                  <a 
                  className="btn btn-primary btn-sm nooutline addminerbtn-style btnadjustments"
                  style={{color: "white", cursor: "pointer", height: "40px", paddingTop: "9px"}}
                  onClick={this.redirectShowError}>+ Add New Miners</a>}
                </div>
                <div className="col-md-12 col-sm-12 col-12 text-center">
                  {this.props.auth.isAuthenticated === true && 
                  this.props.profile.miners.length === 0 && 
                  this.props.profile.miners_loaded === true &&
                    loading === false   
                    ? pleaseAdd
                    : null}
                </div>


                <div className="col-xl-6 col-lg-8 col-md-10 col-sm-12 col-12">
            
                  <p className="miner-instructions">
                    Please connect your miner to stratum server.
                    <br />
                      NA East: <span>{this.props.configs &&
                      this.props.configs[this.props.miningalgo.algorithm] &&
                      this.props.configs[this.props.miningalgo.algorithm]["NA East"] &&
                      this.props.configs[this.props.miningalgo.algorithm]["NA East"].proxy !== undefined ? 
                      this.props.configs[this.props.miningalgo.algorithm]["NA East"].proxy : 
                      <img src="/static/three-dots.gif"
                      style={{
                          width: "33px",
                          color: "white",
                          paddingTop: "0px",
                          paddingBottom: "0px",
                          marginLeft: "11px",
                          marginTop: "-10px",
                          marginBottom: "-10px"
                      }}
                      alt="Loading ..." />
                    }</span>
                      <br />
                      NA West: <span>{this.props.configs &&
                      this.props.configs[this.props.miningalgo.algorithm] &&
                      this.props.configs[this.props.miningalgo.algorithm]["NA West"] &&
                      this.props.configs[this.props.miningalgo.algorithm]["NA West"].proxy !== undefined ? 
                      this.props.configs[this.props.miningalgo.algorithm]["NA West"].proxy : "Loading ..."}</span>
                      <br />
                      EU West: <span>{this.props.configs &&
                      this.props.configs[this.props.miningalgo.algorithm] &&
                      this.props.configs[this.props.miningalgo.algorithm]["EU West"] &&
                      this.props.configs[this.props.miningalgo.algorithm]["EU West"].proxy !== undefined ? 
                      this.props.configs[this.props.miningalgo.algorithm]["EU West"].proxy : "Loading ..."
                    }</span>
                
                    {this.props.auth.isAuthenticated === true ? <React.Fragment>
                      <br />
                      Your stratum username should be{" "}
                    <span>
                      {this.props.profile.profile !== null
                        ? this.props.profile.profile.username
                        : ""}
                      .your_miner_name
                    </span>
                    </React.Fragment> : null}

                  </p>
                </div>

                <div
                  className="col-md-12 col-sm-12 col-12"
                  style={{ marginBottom: "8px" }}
                >
                  <h4 className="number-circle">2</h4>
                  <h4 className="offerformlabel">
                    Set your price
                            </h4>
                </div>

                <div
                  className="col-md-5 col-sm-12 col-12"
                  style={{ marginTop: "7px" }}
                >
                  <div className="form-group">
                    <label htmlFor="price" className="inputlabel">
                      Price in <PaymentRate />:
                              </label>
                    <div
                      className={
                        pricefocus === true
                          ? "input-group input-group-md focused"
                          : "input-group input-group-md"
                      }
                      style={{maxWidth: "285px"}}
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
                          <FaBitcoin style={pricefocus === true ?
                           { fontSize: "1.3em", opacity: "1" } : 
                           { fontSize: "1.3em", opacity: "0.8" }} />
                        </span>
                      </div>
                      <input
                        type="text"
                        placeholder="Example: 0.0015"
                        name="price"
                        value={this.state.price}
                        onChange={this.handleChange}
                        className="form-control inputstyles2"
                        style={{
                          border: "none",
                          borderRadius: "7px",
                          fontSize: "0.82em"
                        }}
                        onFocus={this.handlePriceFocus}
                        onBlur={this.handlePriceBlur}
                        autoComplete="off"
                        required
                      />
                      <p style={{paddingTop: "0px", 
                          paddingBottom: "0px", 
                          marginBottom: "0px",
                          position: "relative",
                          fontSize: "0.92em",
                          top: "5.9px",
                          right: "13px", 
                          zIndex: "222"}}>
                           BTC
                          </p>
                    </div>

                    {this.props.errors.price !== undefined ? <p className="is-invalid-error add-padding-left">
                      {this.props.errors.price}</p> : null}
                  </div>

                 

                  
                  <br />
                  <br />
                </div>
                <div className="col-md-12 col-12"></div>


                <div className="col-md-6 col-sm-7 col-12" style={{ marginBottom: "7px" }}>
                  <h4 className="number-circle">3</h4>
                  <h4 className="offerformlabel">
                  Default Pool Setting
                  </h4>
                  <p className="router-description" style={{ paddingLeft: "0px", marginLeft: "0px" }}>
                  The default pool setting allows you to mine normally at any mining pool you specify below, and only switch to mining at WariHash when there is a buyer willing to pay at a price you set. This way your miner will always be active and only switch to WariHash if it is more profitable to do so.
                   </p>
                </div>


                {this.props.auth.isAuthenticated === true ? <React.Fragment>
                  <div className="container-fluid">
                    <div className="row">
                          <div className="col-md-12">
                      <p className="instructions"><strong>Select from your saved pool settings:</strong></p>
                      </div>

                      <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12" style={{paddingRight: "0px"}}>
                      {this.props.stratum.stratum_list.length > 0 &&
                  this.props.stratum.stratum_list.findIndex(stratum => stratum.mining_algo === this.props.miningalgo.algorithm) !== -1 ? 
                        <select
                          className="form-control selectstyles"
                          name="stratum_id"
                          id="stratum-setting-selector"
                          placeholder="My pool settings"
                          value={this.state.stratum_id}
                          onChange={this.handleStratumSelect}
                          style={{ height: "42px", fontSize: "0.8em" }}
                        >
                          <option className="selectstyles" value="" style={{fontSize: "14px"}}>
                          My pool settings
                          </option>
                          {stratumList}
                        </select>   :  
                        <select
                        className="form-control selectstyles"
                        name="stratum_id"
                        placeholder="No saved pool configurations available"
                        style={{ height: "42px", fontSize: "0.8em" }}
                      >
                        <option className="selectstyles" value="">
                        No saved pool configurations available
                        </option>
                        </select> }
                   
                      
                                 
                        <Link prefetch route="/stratum">
                          <a className="btn btn-primary btn-sm nooutline managestratum-btn btnadjustments"
                          style={{height: "41px", paddingTop: "9px"}}>
                          Manage Pool Settings
                          </a>
                        </Link> 
                        </div> 
                      <br />
                    
              <div className="col-xl-12 col-lg-12 col-md-12">
              <br />
              <p className="instructions"><strong>or enter a brand new pool setting:</strong></p>        
              </div>
                    </div>
                  </div>
               

        </React.Fragment> : null}


                <StratumForm 
                        handleChange={this.handleChange}
                        host={this.state.host}
                        port={this.state.port}
                        username={this.state.username}
                        password={this.state.password}
                        />  
                <div className="col-md-6 col-sm-7 col-12" style={{ paddingLeft: "0px", marginLeft: "0px" }}>
                  <div className="container-fluid" style={{ paddingLeft: "0px", marginLeft: "0px" }}>
                    <div className="row" style={{ paddingLeft: "0px", marginLeft: "0px", paddingRight: "0px" }}>
                      
                     
                      
                      <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12 text-center"
                      style={{ paddingLeft: "0px", marginLeft: "0px", paddingRight: "0px" }}>
                         {/******* OTHER ERRORS HANDLING  ********/}
                      {this.props.time.message !== null ? 
                      <p className="is-invalid-error add-padding-left">{this.props.time.message}</p> : null}
                      {this.state.networkerror !== "" ? 
                      <p className="is-invalid-error add-padding-left">{this.state.networkerror}</p> : null}
                      {this.props.errors.errors !== null &&
                      this.props.errors.error !== undefined &&
                      this.state.networkerror === "" &&
                      fielderrors != "payment_info" &&
                      fielderrors != "price" &&
                      fielderrors != "miner_id" &&
                      fielderrors != "port" &&
                      fielderrors != "host"
                        ? <p className="is-invalid-error add-padding-left">
                        {fielderrorsReason} </p>
                        : null}
                      </div>
                      
                      <div className="col-md-12 col-sm-12 col-12 text-right"
                      style={{ paddingLeft: "0px", marginLeft: "0px", paddingRight: "0px", paddingTop: "15px" }}>
                        {this.props.auth.isAuthenticated === true ? 
                        
                        <React.Fragment>
                          <button
                          type="submit"
                          disabled={this.state.makeofferloading}
                          className="btn btn-danger nooutline submit-btn"
                        >
                          {this.state.makeofferloading === true
                            ? <ThreeDotsLoading />
                            : <p>Submit Offer</p>}

                        </button>

                        </React.Fragment>
                        
                        : 
                        <React.Fragment>
                        <a className="btn btn-info nooutline buybtn" 
                        style={{width: "230px", paddingTop: "8px", color: "white", cursor: "pointer"}}
                        onClick={() => this.saveAndRedirect(loginURL)}>
                          Please Login to Continue</a>
                        <div style={{marginTop: "15px"}}>
                        <a
                        onClick={() => this.saveAndRedirect(registerURL)}
                        className="notamember-link">
                        Not a member yet? <span>Sign up.</span></a>
                      </div>
                      </React.Fragment>
                        
                        }
                        
                      </div>
                    

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
          <br />
          <br />
          <br />
          <br />
        </div>
      </PublicRoute>
    );
  }
}

SellHashingPower.defaultProps = {
  profile: [],
  network: [],
  miningalgo: [],
  configs: [],
  form: []
};

SellHashingPower.propTypes = {
  makeOffer: PropTypes.func,
  clearAlert: PropTypes.func,
  logoutUser: PropTypes.func,
  getCurrentProfile: PropTypes.func,
  clearCurrentProfile: PropTypes.func,
  clearNetwork: PropTypes.func,
  resetErrors: PropTypes.func,
  redirectErrorMessage: PropTypes.func,
  algoSelect: PropTypes.func,
  formSubmission: PropTypes.func,
  enableNavigation: PropTypes.func,
  getMinersList: PropTypes.func,
  timeoutError: PropTypes.func,
  timeoutReset: PropTypes.func,
  getStratumList: PropTypes.func,
  sellPage: PropTypes.func,
  auth: PropTypes.object,
  form: PropTypes.object,
  errors: PropTypes.object,
  profile: PropTypes.object,
  network: PropTypes.object,
  configs: PropTypes.object,
  miningalgo: PropTypes.object,
  time: PropTypes.object,
  stratum: PropTypes.object
};

const mapStateToProps = state => ({
  auth: state.auth,
  form: state.form,
  errors: state.errors,
  profile: state.profile,
  network: state.network,
  configs: state.configs,
  miningalgo: state.miningalgo,
  time: state.time,
  stratum: state.stratum
});

export default connect(
  mapStateToProps,
  {
    redirectErrorMessage,
    makeOffer,
    clearAlert,
    clearCurrentProfile,
    logoutUser,
    getCurrentProfile,
    algoSelect,
    resetErrors,
    clearNetwork,
    getMinersList,
    formSubmission,
    enableNavigation,
    timeoutError,
    timeoutReset,
    sellPage,
    getStratumList
  }
)(SellHashingPower);
