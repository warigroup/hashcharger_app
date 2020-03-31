import React from "react";
import { connect } from "react-redux";
import PublicRoute from "../components/routes/PublicRoute";
import {
  clearAlert,
  logoutUser,
  redirectErrorMessage,
  clearCurrentProfile,
  getCurrentProfile,
  resetErrors,
  clearNetwork,
  algoSelect,
  formSubmission,
  enableNavigation,
  addStratumInfo,
  removeStratumInfo,
  getStratumList,
  resetStratumStatus,
  timeoutError,
  timeoutReset
} from "../actions/warihashApiCalls";
import PropTypes from "prop-types";
import SweetAlert from "react-bootstrap-sweetalert";
import { csrfcookie } from "../utils/cookieNames";
import Head from "next/head";
import {
  FaUser,
  FaLock,
  FaServer,
  FaHashtag
} from "react-icons/fa";
import { Link, Router } from "../routes";
import NProgress from "nprogress";
import { maintenanceMode, algorithms } from "../settings";
import Cookies from "js-cookie";
import CSRFToken from "../utils/csrftoken";
import { TIMEOUT_DURATION, WAIT_ALERT } from "../utils/timeout-config";
import { capitalizeFirstLetter } from "../utils/capitalizeFirstLetter";
import {
  STRATUM_HOST,
  STRATUM_HOST_PLACE,
  STRATUM_PORT,
  STRATUM_USERNAME,
  STRATUM_PASSWORD
} from "../utils/stratumLabels";
import ReactModal from "react-modal";
import ThreeDotsLoading from "../components/tools/ThreeDotsLoading";
var Scroll = require('react-scroll');
var scroll = Scroll.animateScroll;

class AddStratum extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tag: "",
      host: "",
      port: "",
      username: "",
      password: "",
      networkerror: "",
      mining_algo: this.props.miningalgo.algorithm,
      stratum_info: [],
      stratumloading: false,
      hostfocus: false,
      portfocus: false,
      usernamefocus: false,
      passwordfocus: false,
      loading: true,
      showModal: false
    };
    this.timer = null;
  };

  componentDidMount() {
    if (!this.props.auth.isAuthenticated) {
      this.props.redirectErrorMessage();
      this.props.clearCurrentProfile();
      Router.pushRoute("/login");
    };
    if (maintenanceMode === "maintenance") {
      this.props.logoutUser();
      window.location = "https://www.warihash.com";
    };
    this.props.timeoutReset();
    this.props.getCurrentProfile();
    this.props.clearNetwork();
    this.props.resetStratumStatus();
    this.setState({ stratumloading: false, loading: true });
    this.props.resetErrors();
    //// LOAD STRATUM LIST /////////////////////////////////
    if (this.props.auth.isAuthenticated === true) {
      scroll.scrollToTop({ duration: 200 });
      this.loadStratumList().then(this.setState({ loading: false }));
    };
  };

  async loadStratumList() {
    this.props.getStratumList();
  };

  componentDidUpdate(prevProps) {
    if (prevProps.errors !== this.props.errors &&
      this.props.errors.errors === undefined) {
      this.setState({ stratumloading: false });
      this.props.enableNavigation();
      NProgress.done();
    };
    if (
      this.props.errors.stratum_id != null &&
      this.props.errors.stratum_id != prevProps.errors.stratum_id
    ) {
      NProgress.done();
      setTimeout(() => {
        this.failureAlert();
        this.props.enableNavigation();
        this.setState({ networkerror: "", stratumloading: false });
      }, WAIT_ALERT);
    };
    if (
      this.props.stratum.stratum_status === "removed" &&
      this.props.stratum.stratum_status != prevProps.stratum.stratum_status
    ) {
      NProgress.done();
      setTimeout(() => {
        this.stratumRemoved();
        this.props.enableNavigation();
        this.setState({ networkerror: "", stratumloading: false });
      }, WAIT_ALERT);
    };
    if (
      this.props.errors.alertnow === "alertnow" &&
      prevProps.errors.alertnow !== "alertnow"
    ) {
      NProgress.done();
      this.loadStratumList();
      setTimeout(() => {
        this.successAlert();
        this.props.enableNavigation();
        this.setState({ networkerror: "", stratumloading: false });
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
      this.props.network.networkstatus === 500 &&
      prevProps.network.networkstatus !== 500
    ) {
      NProgress.done();
      this.props.enableNavigation();
      this.setState({
        networkerror: "Failed for unknown reason. Contact info@warihash.com"
      });
      this.setState({ stratumloading: false });
    };
    if (
      this.props.network.networkstatus === 401 &&
      prevProps.network.networkstatus !== 401
    ) {
      NProgress.done();
      this.props.enableNavigation();
      this.props.logoutUser();
      this.props.redirectErrorMessage();
    };
    if (
      this.props.network.networkstatus === 405 &&
      prevProps.network.networkstatus !== 405
    ) {
      NProgress.done();
      this.props.enableNavigation();
      this.props.logoutUser();
      this.props.redirectErrorMessage();
    };
    clearTimeout(this.timer);
  };

  componentWillUnmount() {
    // reset network error message
    this.props.clearNetwork();
    this.props.resetErrors();
    // clean up settimeout function
    clearTimeout(this.timer);
  };

  handleSubmit = event => {
    event.preventDefault();
    this.setState({ stratumloading: true });
    this.props.formSubmission();
    this.props.timeoutReset();
    this.props.resetErrors();
    this.props.addStratumInfo(
      this.state.tag,
      this.state.mining_algo,
      this.state.host,
      this.state.port,
      this.state.username,
      this.state.password
    );
    NProgress.start();
    this.timer = setTimeout(() => {
      NProgress.done();
      this.setState({ stratumloading: false });
      this.props.enableNavigation();
      if (!this.props.errors) {
        this.props.timeoutError();
      }
    }, TIMEOUT_DURATION);
  };

  deleteStratum = stratum_id => {
    this.props.removeStratumInfo(stratum_id);
    this.setState({ showModal: false });
    setTimeout(() => {
      this.loadStratumList();
    }, 1000);
  };

  handleOpenModal = stratum => {
    const stratum_info = stratum;
    this.setState({ stratum_info: stratum_info });
    this.setState({ showModal: true });
  };

  handleCloseModal = () => {
    this.setState({ showModal: false });
    this.setState({ stratum_info: [] });
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
        style={{ borderRadius: "0px" }}
        onConfirm={this.onConfirm}
      //  onCancel={this.onCancel}
      >
        <p style={{ fontSize: "0.74em" }}>
          <br />
          Your stratum setting has been saved to your profile.
          <br />
          Now you can purchase hashsing power with the saved stratum setting.
          <br />
          <br />
        </p>
      </SweetAlert>
    );
    this.setState({ successAlert: successAlert });
  };

  stratumRemoved = () => {
    const stratumRemoved = (
      <SweetAlert
        success
        //  showCancel
        confirmBtnText="Confirm"
        //  cancelBtnText="Go to marketplace"
        confirmBtnBsStyle="default"
        //  cancelBtnBsStyle="default btn-sm"
        title=""
        style={{ borderRadius: "0px" }}
        onConfirm={this.onConfirm}
      //  onCancel={this.onCancel}
      >
        <p style={{ fontSize: "0.74em" }}>
          <br />
          Your stratum setting has been removed.
          <br />
          <br />
        </p>
      </SweetAlert>
    );
    this.setState({ stratumRemoved: stratumRemoved });
  };

  failureAlert = () => {
    const failureAlert = (
      <SweetAlert
        danger
        //  showCancel
        confirmBtnText="Confirm"
        //  cancelBtnText="Go to marketplace"
        confirmBtnBsStyle="warning"
        //  cancelBtnBsStyle="default btn-sm"
        title=""
        style={{ borderRadius: "0px" }}
        onConfirm={this.onConfirm}
      //  onCancel={this.onCancel}
      >
        <p style={{ fontSize: "0.74em" }}>
          <br />
          {this.props.errors.stratum_id}
          <br />
          <br />
        </p>
      </SweetAlert>
    );
    this.setState({ failureAlert: failureAlert });
  };

  onConfirm = () => {
    this.setState({ successAlert: null, failureAlert: null, stratumRemoved: null });
    this.props.clearAlert();
    this.props.resetErrors();
    this.props.resetStratumStatus();
    NProgress.done();
    this.loadStratumList();
    this.setState({ tag: "", host: "", port: "", username: "", password: "" });
    this.setState({ showModal: false });
    this.props.clearNetwork();
  };

  handleChange = event => {
    const itemName = event.target.name;
    const itemValue = event.target.value;
    this.setState({ [itemName]: itemValue });
  };

  openRemoveModal = stratum => {
    const stratum_info = stratum;
    this.setState({ stratum_info: stratum_info, removeMinerModalShow: true });
  };

  handleHostFocus = () => this.setState({ hostfocus: true });
  handleHostBlur = () => this.setState({ hostfocus: false });
  handlePortFocus = () => this.setState({ portfocus: true });
  handlePortBlur = () => this.setState({ portfocus: false });
  handleUsernameFocus = () => this.setState({ usernamefocus: true });
  handleUsernameBlur = () => this.setState({ usernamefocus: false });
  handlePasswordFocus = () => this.setState({ passwordfocus: true });
  handlePasswordBlur = () => this.setState({ passwordfocus: false });

  /// ALGORITHM SELECTOR /////////////////////
  selectAlgorithm = event => {
    this.props.algoSelect(event.target.value);
    this.setState({ mining_algo: event.target.value });
    Cookies.set("algo_select", event.target.value, { expires: 7 });
  };

  render() {
    const fielderrors = Object.keys(this.props.errors);
    const fielderrorsReason = this.props.errors[fielderrors];
    
    const { stratumloading, 
      loading, 
      tag,
      host,
      port,
      username,
      password, 
      hostfocus,
      portfocus,
      usernamefocus,
      passwordfocus } = this.state;

    const stratumList = this.props.stratum.stratum_list.map(
      stratum => {
        return (
          <tr
            className="row m-0 offercontents tablerowstyles"
            key={stratum.stratum_id}
            style={{
              borderRight: "0.5px solid rgba(0, 0, 0, 0.1)",
              borderLeft: "0.5px solid rgba(0, 0, 0, 0.1)"
            }}
          >
            <td className="stratum-table-tag">
              {stratum.stratum_tag}
            </td>
            <td className="stratum-table-miningalgo">
              {stratum.mining_algo === "sha256d" ? "SHA256d" : capitalizeFirstLetter(stratum.mining_algo)}
            </td>
            <td className="stratum-table-host">
              {stratum.stratum_host}
            </td>
            <td className="stratum-table-port">
              {stratum.stratum_port}
            </td>
            <td className="stratum-table-username">
              {stratum.stratum_username}
            </td>
            <td className="stratum-table-btn">
              <button
                className="btn btn-sm btn-outline-danger remove-btn nooutline"
                style={{ borderRadius: "0px", fontSize: "0.8em" }}
                onClick={() => this.handleOpenModal(stratum)}
              >
                Remove
              </button>
            </td>
          </tr>
        );
      }
    );

    const noSettingsFound = (
      <tr className="row m-0 offercontents tablerowstyles" style={{
        borderRight: "0.5px solid rgba(0, 0, 0, 0.1)",
        borderLeft: "0.5px solid rgba(0, 0, 0, 0.1)"
      }}>
        <td
          className="col-12 col-md-12 text-center"
          style={{ paddingTop: "77px", paddingBottom: "77px" }}
        >
          No stratum settings found
        </td>
      </tr>
    );

    return (
      <PublicRoute>
        <Head>
          <title>WariHash | Stratum Settings</title>
          <meta name="description" content="" />
          <meta name="keywords" content="" />
          <meta name="author" content="" />
        </Head>
        <div
          style={{ width: "100%", background: "white", marginBottom: "145px" }}
        >

          <div className="container">
            {this.state.successAlert}
            {this.state.failureAlert}
            {this.state.stratumRemoved}
            <div className="row">
              <div className="col-lg-12 col-md-12 col-12">
                <br />
                <br />
              </div>

              <div className="col-xl-7 col-lg-8 col-md-12 col-sm-12 col-12">
                <style jsx>
                  {`
                    .formcontainer-addstratum {
                      width: 100%;
                      padding: 35px 30px 20px 30px;
                      margin-top: 0px;
                      border-radius: 10px;
                      border: 0.5px solid rgba(0, 0, 0, 0.1);
                      box-shadow: 0 11px 21px rgba(0, 0, 0, 0.08),
                        0 10px 50px rgba(0, 0, 0, 0.02);
                    }
                    .stratum-description {
                      font-size: 0.82em;
                      color: rgba(0,0,0,0.7);
                      display: inline-block;
                      margin-top: 15px;
                      margin-bottom: 25px;

                    }
                    .remove-btn {
                      width: 75px;
                      border-radius: none !important;
                      display: inline-block;
                      margin-right: 8px;
                      outline: none !important;
                    }
                    
                    .remove-btn:active {
                      outline: none !important;
                      box-shadow: none !important;
                    }
                    
                    .remove-btn:focus {
                      outline: none !important;
                      box-shadow: none !important;
                    }
                    .inputlabel {
                      margin-right: 15px;
                      font-size: 0.8em;
                    }

                    .mining-title {
                      display: inline-block;
                      margin-right: 14px;
                      margin-left: 10px;
                      font-size: 0.8em;
                    }

                    @media (max-width: 750px) {
                      .mining-title {
                        margin-left: 0px;
                        margin-top: 19px;
                      }
                      .formcontainer-addstratum {
                        border: none;
                        width: 100%;
                        padding: 0px 15px 15px 15px;
                        margin-top: 0px;
                        border-radius: 0px;
                        box-shadow: none;
                      }
                      .remove-btn {
                        font-size: 0.78em !important;
                        text-align: center !important;
                      }
                      .mobileadjustments {
                        display: block !important;
                        margin-bottom: 10px;
                      }
                    }

                    @media (max-width: 620px) {
                      .createofferbtn {
                        width: 100%;
                        font-size: 0.86em;
                        margin-top: 25px;
                      }
                    }
                  `}
                </style>
                <br />

                <div className="formcontainer-addstratum">
                  <h5 className="page-title" style={{paddingBottom: "10px", fontWeight: "bold"}}>
                  Add Pool Setting
                  </h5>
        
                  <p className="stratum-description">
                  When purchasing hashing power, you must specify your stratum server setting.{" "}
                  This page allows you to save your stratum server setting, so that it can be reused when purchasing hashing power multiple times.{" "}
                  Mining pools will specify their stratum server setting in their help pages.{" "}
                  For further help,{" "}
                  <a href="https://warihash.zendesk.com/hc/en-us/articles/360033466572-How-Do-I-Specify-my-Stratum-Server-Configuration-">please read our FAQ.</a>
                  </p>
                  {this.props.miningalgo.algorithm === "ethash" ? 
                            
                            <p style={{
                              fontSize: "0.82em",
                              color: "rgb(255, 93, 87)",
                              paddingBottom: "0px",
                              marginBottom: "0px",
                              marginTop: "0px",
                              paddingTop: "0px"
                            }}>Due to varying Ethereum Stratum implementations, not all pools may be supported. 
                            In particular we currently do not support any pools that strictly uses EthereumStratum 1.0.0 / 2.0.0. Our system is known to work with f2pool.com, ethermine.org, sparkpool.com, and nanopool.org.</p>
                           
                            
                            : null}

                  {this.props.miningalgo.algorithm === "handshake" ? 
                            
                            <p style={{
                              fontSize: "0.82em",
                              color: "rgb(255, 93, 87)",
                              paddingBottom: "0px",
                              marginBottom: "0px",
                              marginTop: "0px",
                              paddingTop: "0px"
                            }}>Currently our pool has only been tested to be compatible with 6block.com and f2pool.com pools. We will work to add compatibility with more pools, but for now we do not recommend using other pools.</p>

                            : null}
                  <br />

                  <form onSubmit={this.handleSubmit} id="stratum-form" style={{padding: "0px"}}>
                    <CSRFToken />

                    <div className="container-fluid" style={{ padding: "0px" }}>
                      <div className="row" style={{ padding: "0px" }}>
                        <div className="col-md-6 col-12" style={{ padding: "0px 0px 0px 15px" }}>
                        <label htmlFor="tag" className="inputlabel mobileadjustments">
                            Setting Name
                        </label>
                         
                          <input
                            type="text"
                            className="form-control inputfix mobileadjustments"
                            placeholder="Example: My pool 1"
                            name="tag"
                            value={tag}
                            onChange={this.handleChange}
                            style={{
                              display: "inline-block",
                              width: "200px",
                              fontSize: "0.82em",
                              padding: "17px"
                            }}
                            required
                            autoComplete="off"
                          />
                          {this.props.errors.tag !== undefined ? <p className="is-invalid-error">{this.props.errors.tag}</p> : null}
                        </div>

                   
                        
                        <div className="col-md-6 col-12">
                        <label htmlFor="mining-algo" className="inputlabel">
                            Mining Algorithm
                          </label>
                          <br/>
                          <select
                            className="form-control selectstyles miningalgoselect"
                            name="mining-algo"
                            placeholder="SHA256d"
                            onChange={this.selectAlgorithm}
                            value={this.props.miningalgo.algorithm}
                            style={{width: "200px"}}
                          >
                          {algorithms.map((item, i) => (
                           <option className="selectstyles" value={item} key={i}>
                              {item === "sha256d" ? "SHA256d" : capitalizeFirstLetter(item)}
                            </option>
                           ))}  
                          </select>
                        </div>

                        <div className="col-md-12 col-12" style={{padding: "5px"}} />

                        <div className="col-md-7 col-12">
                        <div className="form-group">
        <label htmlFor="host" className="inputlabel">
          {STRATUM_HOST}
        </label>
        <div
          className={
            hostfocus === true
              ? "input-group input-group-md focused"
              : "input-group input-group-md"
          }
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
              <FaServer style={hostfocus === true ? 
                { fontSize: "1.15em", opacity: "1" } : 
                { fontSize: "1.15em", opacity: "0.8" }} />
            </span>
          </div>
          <input
            type="text"
            name="host"
            value={host}
            placeholder={STRATUM_HOST_PLACE}
            className="form-control inputstyles2"
            onChange={this.handleChange}
            onFocus={this.handleHostFocus}
            onBlur={this.handleHostBlur}
            style={{
              border: "none",
              borderRadius: "7px",
              fontSize: "0.82em"
            }}
            autoComplete="off"
          />
        </div>

        {this.props.errors.host !== undefined ? 
        <p className="is-invalid-error add-padding-left">{this.props.errors.host}</p> : null}
      </div>
                        </div>

                  

                        <div className="col-md-5 col-12">

                        <div className="form-group">
                        <label htmlFor="port" className="inputlabel">
                          {STRATUM_PORT}
                        </label>
                        <div
                          className={
                            portfocus === true
                              ? "input-group input-group-md focused"
                              : "input-group input-group-md"
                          }
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
                              <FaHashtag style={portfocus === true ? 
                              { fontSize: "1.15em", opacity: "1" } : 
                              { fontSize: "1.15em", opacity: "0.8" } } />
                            </span>
                          </div>
                          <input
                            type="text"
                            name="port"
                            value={port}
                            placeholder="Example: 3333"
                            className="form-control inputstyles2"
                            style={{
                              border: "none",
                              borderRadius: "7px",
                              fontSize: "0.82em"
                            }}
                            onChange={this.handleChange}
                            onFocus={this.handlePortFocus}
                            onBlur={this.handlePortBlur}
                            autoComplete="off"
                          />
                        </div>

                        {this.props.errors.port !== undefined ? 
                        <p className="is-invalid-error">{this.props.errors.port}</p> : null}
                      </div>

                   
                        </div>
                        <div className="col-md-12 col-12" />

                          <div className="col-md-6 col-12">
                          <div className="form-group">
              <label htmlFor="username" className="inputlabel">
                {STRATUM_USERNAME}
              </label>
              <div
                className={
                  usernamefocus === true
                    ? "input-group input-group-md focused"
                    : "input-group input-group-md"
                }
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
                    <FaUser style={usernamefocus === true ? 
                    { fontSize: "1.15em", opacity: "1" } : 
                    { fontSize: "1.15em", opacity: "0.8" }} />
                  </span>
                </div>
                <input
                  type="text"
                  name="username"
                  value={username}
                  placeholder={STRATUM_USERNAME}
                  className="form-control inputstyles2"
                  style={{
                    border: "none",
                    borderRadius: "7px",
                    fontSize: "0.82em"
                  }}
                  onChange={this.handleChange}
                  onFocus={this.handleUsernameFocus}
                  onBlur={this.handleUsernameBlur}
                  autoComplete="off"
                />
              </div>

                {this.props.errors.username !== undefined ? 
                <p className="is-invalid-error add-padding-left">{this.props.errors.username}</p> : null}
            </div>
                          </div>



                          <div className="col-md-6 col-12">
                          <div className="form-group">
              <label htmlFor="password" className="inputlabel">
                {STRATUM_PASSWORD}
              </label>
              <div
                className={
                  passwordfocus === true
                    ? "input-group input-group-md focused"
                    : "input-group input-group-md"
                }
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
                    <FaLock style={passwordfocus === true ? 
                    { fontSize: "1.15em", opacity: "1" } : 
                    { fontSize: "1.15em", opacity: "0.8" }} />
                  </span>
                </div>
                <input
                  type="text"
                  name="password"
                  value={password}
                  placeholder={STRATUM_PASSWORD}
                  className="form-control inputstyles2"
                  style={{
                      border: "none",
                      borderRadius: "7px",
                      fontSize: "0.82em"
                    }}
                  onChange={this.handleChange}
                  onFocus={this.handlePasswordFocus}
                  onBlur={this.handlePasswordBlur}
                  autoComplete="new-password"
                />
              </div>
                {this.props.errors.password !== undefined ? 
                <p className="is-invalid-error add-padding-left">{this.props.errors.password}</p> : null}
            </div>
                          </div>

                      </div>
                    </div>
                    {/******** ERROR MESSAGES **********/}
                    {this.props.time.message !== null ? <p className="is-invalid-error">{this.props.time.message}</p> : null}
                    {this.state.networkerror !== "" ? <p className="is-invalid-error">{this.state.networkerror}</p> : null}
                    {this.props.errors.errors !== null &&
                      this.props.errors.errors !== undefined &&
                      this.state.networkerror === "" &&
                      fielderrors != "host" &&
                      fielderrors != "port" &&
                      fielderrors != "username" &&
                      fielderrors != "password"
                      ? <p className="is-invalid-error add-padding-left">
                        {fielderrorsReason} </p>
                      : null}
                    <div style={{ marginTop: "17px" }}>
                      <button
                        type="submit"
                        disabled={stratumloading}
                        className="btn btn-info nooutline createofferbtn"
                        style={{
                          display: "inline-block",
                          marginRight: "22px",
                          borderRadius: "0px",
                          width: "110px"
                        }}
                        id="add-stratum-btn"
                      >
                        {stratumloading === true ? <ThreeDotsLoading /> :
                          <p style={{ marginBottom: "0px", paddingBottom: "0px" }}>Save to List</p>}

                      </button>
                      
                     <Link route="/">     
                      <a
                        className="btn btn-secondary nooutline createofferbtn"
                        style={{
                          display: "inline-block",
                          borderRadius: "0px",
                          width: "150px",
                          color: "white",
                          cursor: "pointer"
                        }}
                      >
                          <p style={{ marginBottom: "0px", paddingBottom: "0px" }}>Go to Marketplace</p>
                      </a>
                      </Link>  
                    </div>
                    <br />
                  </form>
                </div>
              </div>

              <div className="col-xl-10 col-lg-11 col-md-12 col-sm-12 col-12">
                <br />
                <br />
                <br />
                <h5>
                  <strong>My Pool Settings</strong>
                </h5>
                <br />
                <style jsx>
                  {`
                    .inventorystyles {
                      border-right: 0.5px solid rgba(0, 0, 0, 0.1);
                      border-left: 0.5px solid rgba(0, 0, 0, 0.1);
                      border-bottom: 0.5px solid rgba(0, 0, 0, 0.1);
                      background: white;
                      border-bottom-right-radius: 3px;
                      border-bottom-left-radius: 3px;
                      table-layout: fixed;
                      width: 100%;
                    }
                  `}
                </style>
                <table
                  id="tableT"
                  className="table table-borderless container inventorytable inventorystyles"
                >
                  <thead className="text-white"
                    style={{
                      borderRight: "0.5px solid rgba(0, 0, 0, 0.1)",
                      borderLeft: "0.5px solid rgba(0, 0, 0, 0.1)", background: "black"
                    }}>
                    <tr className="row m-0" style={{
                      borderRight: "0.5px solid rgba(0, 0, 0, 0.1)",
                      borderLeft: "0.5px solid rgba(0, 0, 0, 0.1)"
                    }}>
                      <th
                        id="tag"
                        className="stratum-table-tag offertitle"
                      >
                        Name
                      </th>
                      <th
                        id="miningalgo"
                        className="stratum-table-miningalgo offertitle"
                      >
                        Algorithm
                      </th>
                      <th
                        id="host"
                        className="stratum-table-host offertitle"
                      >
                        Host
                      </th>
                      <th
                        id="port"
                        className="stratum-table-port offertitle"
                      >
                        Port
                      </th>
                      <th
                        id="username"
                        className="stratum-table-username offertitle"
                      >
                        Username
                      </th>

                      <th
                        id="remove_buttons"
                        className="stratum-table-btn offertitle"
                      />
                    </tr>
                  </thead>
                  <tbody className="tablebodytaken" >
                    {loading === false && 
                    this.props.stratum.stratum_list.length === 0 &&
                     this.props.stratum.stratum_loaded === true  
                      ? noSettingsFound
                      : null}
                      {loading === true && 
                      this.props.stratum.stratum_list.length === 0 &&
                      this.props.stratum.stratum_loaded === false ?
                      <tr style={{ width: "100%", textAlign: "center",
                      borderRight: "1px solid rgba(0,0,0,0.1)",
                          borderLeft: "1px solid rgba(0,0,0,0.1)", }}>
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

                    {stratumList}
                  </tbody>
                </table>
                <br />
                <br />
              </div>
            </div>
          </div>

          <ReactModal
            isOpen={this.state.showModal}
            contentLabel="Remove Stratum Modal"
            className="removeprompt-stratum-modal"
            overlayClassName="Overlay"
            ariaHideApp={false}
            onRequestClose={this.handleCloseModal}
          >
            <div>
              <br /><br />
              Are you sure you want to remove the stratum setting from your list?
              <br /><br /><br />
            </div>

            <div className="text-right" style={{ width: "100%" }}>
              <CSRFToken />
              <button
                onClick={this.handleCloseModal}
                className="btn btn-sm cancelbtn-styles"
              >
                No
              </button>
              <button
                className="btn btn-sm btn-danger"
                onClick={() => {
                  this.deleteStratum(this.state.stratum_info.stratum_id);
                }}
                style={{ fontSize: "0.85em", borderRadius: "0px" }}
              >
                Yes, remove it
             </button>
            </div>
          </ReactModal>
        </div>
      </PublicRoute>
    );
  }
}

AddStratum.defaultProps = {
  profile: [],
  network: [],
  miningalgo: [],
  errors: [],
  stratum: []
};

AddStratum.propTypes = {
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
  addStratumInfo: PropTypes.func,
  removeStratumInfo: PropTypes.func,
  getStratumList: PropTypes.func,
  resetStratumStatus: PropTypes.func,
  timeoutError: PropTypes.func,
  timeoutReset: PropTypes.func,
  auth: PropTypes.object,
  errors: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object
  ]),
  profile: PropTypes.object,
  network: PropTypes.object,
  configs: PropTypes.object,
  miningalgo: PropTypes.object,
  time: PropTypes.object,
  stratum: PropTypes.object
};

const mapStateToProps = state => ({
  auth: state.auth,
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
    clearAlert,
    logoutUser,
    getCurrentProfile,
    clearCurrentProfile,
    clearNetwork,
    resetErrors,
    redirectErrorMessage,
    algoSelect,
    formSubmission,
    enableNavigation,
    addStratumInfo,
    removeStratumInfo,
    getStratumList,
    resetStratumStatus,
    timeoutError,
    timeoutReset
  }
)(AddStratum);
