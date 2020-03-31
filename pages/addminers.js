import React from "react";
import { connect } from "react-redux";
import PublicRoute from "../components/routes/PublicRoute";
import {
  clearAlert,
  addMiners,
  removeMiners,
  logoutUser,
  redirectErrorMessage,
  getCurrentProfile,
  resetErrors,
  clearNetwork,
  algoSelect,
  formSubmission,
  enableNavigation,
  getMinersList,
  resetMinerStatus,
  timeoutError,
  timeoutReset
} from "../actions/warihashApiCalls";
import PropTypes from "prop-types";
import SweetAlert from "react-bootstrap-sweetalert";
import Head from "next/head";
import { Link, Router } from "../routes";
import NProgress from "nprogress";
import { maintenanceMode, algorithms, minerLocations } from "../settings";
import Cookies from "js-cookie";
import CSRFToken from "../utils/csrftoken";
import { TIMEOUT_DURATION, WAIT_ALERT } from "../utils/timeout-config";
import { capitalizeFirstLetter } from "../utils/capitalizeFirstLetter";
import ReactModal from "react-modal";
import { csrfcookie } from "../utils/cookieNames";
import ThreeDotsLoading from "../components/tools/ThreeDotsLoading";
var Scroll = require('react-scroll');
var scroll = Scroll.animateScroll;

class AddMiners extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      declared_hashrate: "",
      hashrate_units: "",
      name: "",
      networkerror: "",
      minerinfo: [],
      addminersloading: false,
      loading: false,
      mining_algo: this.props.miningalgo.algorithm,
      location: "NA East",
      showModal: false,
      triggered: false
    };
    this.timer = null;
  };

  componentDidMount() {
    if (!this.props.auth.isAuthenticated) {
      Router.pushRoute("/login");
    };
    if (maintenanceMode === "maintenance") {
      this.props.logoutUser();
      window.location = "https://www.warihash.com";
    };
    this.props.timeoutReset();
    this.props.getCurrentProfile();
    this.props.clearNetwork();
    this.props.resetMinerStatus();
    this.setState({ addminersloading: false });
    this.setState({ loading: true });
    this.props.resetErrors();
    const algocookie = Cookies.get("algo_select");
    if (algocookie !== undefined && algorithms.includes(algocookie) === true) {
      this.setState({ mining_algo: algocookie });
    };
    
    //// LOAD MINER'S LIST /////////////////////////////////
    if (this.props.auth.isAuthenticated === true &&
      this.props.profile.profile.username !== "") {
        scroll.scrollToTop({duration: 200});
        this.loadMinersList().then(this.setState({ loading: false }));
        Cookies.remove("markethistory_page");
        Cookies.remove("page_number");
    };
  };

  async loadMinersList() {
    this.props.getMinersList(this.props.miningalgo.algorithm);
  };

  componentDidUpdate(prevProps) {
    // load miners list when refreshing browser.
    if (prevProps.profile.profile !== this.props.profile.profile &&
      this.props.auth.isAuthenticated === true &&
      this.props.profile.profile.username !== "") {
        this.loadMinersList().then(this.setState({ loading: false }));
    };
    if (prevProps.errors !== this.props.errors &&
      this.props.errors.errors === undefined) {
      this.setState({ addminersloading: false });
      this.props.enableNavigation();
      NProgress.done();
    };
    if (
      this.props.errors.miner_id != null &&
      this.props.errors.miner_id != prevProps.errors.miner_id
    ) {
      NProgress.done();
      setTimeout(() => {
        this.failureAlert();
        this.props.enableNavigation();
        this.setState({ networkerror: "", addminersloading: false });
      }, WAIT_ALERT);
    };
    if (
      this.props.inventory.miners_status === "removed" &&
      this.props.inventory.miners_status != prevProps.inventory.miners_status
    ) {
      NProgress.done();
      setTimeout(() => {
        this.minerRemoved();
        this.props.enableNavigation();
        this.setState({ networkerror: "", addminersloading: false });
      }, WAIT_ALERT);
    };
    if (
      this.props.errors.alertnow === "alertnow" &&
      prevProps.errors.alertnow !== "alertnow"
    ) {
      NProgress.done();
      this.loadMinersList();
      setTimeout(() => {
        this.successAlert();
        this.props.enableNavigation();
        this.setState({ networkerror: "", addminersloading: false });
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
      this.setState({ addminersloading: false });
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
    this.setState({ addminersloading: true });
    this.props.formSubmission();
    this.props.timeoutReset();
    this.props.resetErrors();
    this.props.addMiners(
      this.state.name,
      this.state.declared_hashrate,
      this.state.hashrate_units,
      this.state.mining_algo,
      this.state.location,
      this.state.triggered
    );
    NProgress.start();
    this.timer = setTimeout(() => {
      NProgress.done();
      this.setState({ addminersloading: false });
      this.props.enableNavigation();
      if (!this.props.errors) {
        this.props.timeoutError();
      }
    }, TIMEOUT_DURATION);
  };

  deleteMiner = miner_id => {
    this.props.removeMiners(miner_id);
    this.setState({ showModal: false });
    setTimeout(() => {
      this.loadMinersList();
    }, 1000);
  };

  handleOpenModal = miners => {
    const minerinfo = miners;
    this.setState({ minerinfo: minerinfo });
    this.setState({ showModal: true });
  };

  handleCloseModal = () => {
    this.setState({ showModal: false });
    this.setState({ minerinfo: [] });
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
          Your miners have been added to your profile.
          <br />
          Now you can create a new offer with your miners.
          <br />
          <br />
        </p>
      </SweetAlert>
    );
    this.setState({ successAlert: successAlert });
  };

  minerRemoved = () => {
    const minerRemoved = (
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
          Your miners have been removed from inventory.
          <br />
          <br />
        </p>
      </SweetAlert>
    );
    this.setState({ minerRemoved: minerRemoved });
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
          {this.props.errors.miner_id}
          <br />
          <br />
        </p>
      </SweetAlert>
    );
    this.setState({ failureAlert: failureAlert });
  };

  onConfirm = () => {
    this.setState({ successAlert: null, failureAlert: null, minerRemoved: null });
    this.props.clearAlert();
    this.props.resetErrors();
    this.props.resetMinerStatus();
    NProgress.done();
    this.loadMinersList();
    this.setState({ declared_hashrate: "", hashrate_units: "", name: ""  });
    this.setState({ showModal: false });
    this.props.clearNetwork();
  };

  handleChange = event => {
    const itemName = event.target.name;
    const itemValue = event.target.value;
    this.setState({ [itemName]: itemValue });
  };

  handleSelect = event => {
    this.setState({ hashrate_units: event.target.value });
  };

  openRemoveModal = miners => {
    const minerinfo = miners;
    this.setState({ minerinfo: minerinfo });
    this.setState({ removeMinerModalShow: true });
  };

  /// ALGORITHM SELECTOR /////////////////////
  selectAlgorithm = event => {
      this.props.algoSelect(event.target.value);
      this.setState({ mining_algo: event.target.value });
      this.props.getMinersList(event.target.value);
      Cookies.set("algo_select", event.target.value, { expires: 7 });
  };

  selectLocation = event => {
    this.setState({ location: event.target.value });
  };

  render() {
    const fielderrors = Object.keys(this.props.errors);
    const fielderrorsReason = this.props.errors[fielderrors];
    const { addminersloading, loading } = this.state;

    const minersList = this.props.profile.miners.map(
      miners => {
        return (
          <tr
            className="row m-0 offercontents tablerowstyles"
            key={miners.miner_id}
            style={{
              borderRight: "0.5px solid rgba(0, 0, 0, 0.1)",
              borderLeft: "0.5px solid rgba(0, 0, 0, 0.1)"
            }}
          >
            <td className="d-none d-md-inline-block col-md-1">
              {miners.miner_id}
            </td>
            <td className="d-inline-block col-md-3 col-8">
              {miners.name}
            </td>
            <td className="d-none d-md-inline-block col-md-3 col-4">
              {miners.mining_algo === "sha256d" ? "SHA256d" : capitalizeFirstLetter(miners.mining_algo)}
            </td>
            <td className="d-none d-md-inline-block col-md-3">
              {miners.declared_hashrate} {miners.hashrate_units}
              H/s
            </td>
            <td className="d-inline-block col-md-2 col-4">
              <button
                className="btn btn-sm btn-outline-danger remove-btn nooutline"
                style={{borderRadius: "0px", fontSize: "0.8em"}}
                onClick={() => this.handleOpenModal(miners)}
              >
                Remove
              </button>
            </td>
          </tr>
        );
      }
    );

    const noMinersFound = (
      <tr className="row m-0 offercontents tablerowstyles" style={{
        borderRight: "0.5px solid rgba(0, 0, 0, 0.1)",
        borderLeft: "0.5px solid rgba(0, 0, 0, 0.1)"
      }}>
        <td
          className="col-12 col-md-12 text-center"
          style={{ paddingTop: "77px", paddingBottom: "77px" }}
        >
          No miners found
        </td>
      </tr>
    );

    return (
      <PublicRoute>
        <Head>
          <title>WariHash | Add Miners</title>
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
            {this.state.minerRemoved}
            <div className="row">
              <div className="col-lg-12 col-md-12 col-12">
                <br />
                <br />
              </div>

              <div className="col-xl-8 col-lg-12 col-md-12 col-sm-12 col-12">
              <style jsx>
                  {`
                    .formcontainer-addminers {
                      border: 0.5px solid rgba(0, 0, 0, 0.1);
                      width: 100%;
                      padding: 35px 30px 15px 30px;
                      margin-top: 0px;
                      border-radius: 10px;
                      box-shadow: 0 11px 21px rgba(0, 0, 0, 0.08),
                        0 10px 50px rgba(0, 0, 0, 0.02);
                    }
                    .addminers-description {
                      font-size: 0.82em;
                      color: rgba(0,0,0,0.55);
                      display: inline-block;
                      margin-top: 15px;
                      margin-bottom: 9px;
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
                    .mobilestyles {
                      position: relative;
                      left: 10px;
                      top: 3px;
                    }
                    @media (max-width: 774px) {
                      .offerformlabel {
                        margin-top: 17px;
                      }
                      .mobilestyles {
                        position: relative;
                        left: 0px;
                      }
                    }

                    @media (max-width: 650px) {
                      .formcontainer-addminers {
                        border: none;
                        width: 100%;
                        padding: 0px 15px 15px 15px;
                        margin-top: 0px;
                        border-radius: 0px;
                        box-shadow: none;
                      }
                      .createofferbtn {
                        padding-left: 5px;
                        padding-right: 5px;
                        margin-bottom: 15px;
                      }

                      .remove-btn {
                        font-size: 0.78em !important;
                        text-align: center !important;
                      }
                    }
                  `}
                </style>
                <br />

                <div className="formcontainer-addminers">
                  <h5 className="page-title">
                    <strong>Add Miners</strong>
                  </h5>
                  <div className="container-fluid">
                    <div className="row" style={{padding: "0px"}}>
                      <div className="col-xl-10 col-md-10 col-sm-12 col-12" style={{padding: "0px"}}>
                      <p className="addminers-description">
                  In order to sell hashing power, you must add your miner on this page.{" "}
                  Each miner will connect to our stratum server as <strong>username.minername</strong>.
                  </p>
                      </div>
                    </div>
                  </div>
                  
                  <br />

                  <form onSubmit={this.handleSubmit} id="addminers-form">
                    <CSRFToken />

                    <div className="container" style={{ padding: "0" }}>
                      <div className="row" style={{ padding: "3px" }}>
                        <div className="col-xl-3 col-lg-12 col-md-12 col-sm-12 col-12">
                          <p
                            className="offerformlabel"
                            style={{
                              display: "inline-block",
                              marginRight: "0px",
                              paddingRight: "0px",
                              fontSize: "0.8em",
                              padding: "0px"
                            }}
                          >
                            Name of your miners:
                          </p>
                        </div>
                        <div className="col-xl-7 col-lg-12 col-md-12 col-sm-12 col-12">
                          <input
                            type="text"
                            className="form-control inputfix"
                            placeholder="example: Antminer_S9s"
                            name="name"
                            value={this.state.name}
                            onChange={this.handleChange}
                            style={{
                              display: "inline-block",
                              width: "250px"
                            }}
                            autoComplete="off"
                          />
                         {this.props.errors.name !== undefined ? <p className="is-invalid-error">{this.props.errors.name}</p> : null}
                        </div>
                        <div className="d-none d-xl-inline-block col-xl-12" style={{padding: "10px"}}></div>
                        <div className="col-xl-2 col-lg-12 col-md-12 col-sm-12 col-12">
                          <p
                            className="offerformlabel"
                            style={{
                              display: "inline-block",
                              marginRight: "14px",
                              fontSize: "0.8em",
                              padding: "0px"
                            }}
                          >
                            Algorithm:{" "}
                          </p>
                        </div>
                        <div className="col-xl-3 col-lg-12 col-md-12 col-sm-12 col-12">
                          <select
                            className="form-control selectstyles miningalgoselect"
                            name="mining-algo"
                            placeholder="SHA256d"
                            onChange={this.selectAlgorithm}
                            value={this.props.miningalgo.algorithm}
                          >
                           {algorithms.map((item, i) => (
                           <option className="selectstyles" value={item} key={i}>
                              {item === "sha256d" ? "SHA256d" : capitalizeFirstLetter(item)}
                            </option>
                           ))} 
                          </select>
                        </div>

                        <div className="col-xl-2 col-lg-12 col-md-12 col-sm-12 col-12">
                          <p
                            className="offerformlabel mobilestyles"
                            style={{
                              display: "inline-block",
                              marginRight: "0px",
                              paddingRight: "0px",
                              fontSize: "0.8em",
                              padding: "0px"
                            }}
                          >
                            Location:{" "}
                          </p>
                        </div>
                        <div className="col-xl-4 col-lg-12 col-md-12 col-sm-12 col-12">
                          <select
                            className="form-control selectstyles miningalgoselect"
                            name="location"
                            placeholder="NA East"
                            value={this.state.location}
                            onChange={this.selectLocation}
                            style={{width: "265px"}}
                          >
                            { 
                    minerLocations.map((location, i) => (
                        <option className="selectstyles" key={i} value={location.value}>
                            {location.name}
                        </option>
                    ))
                       } 
                          </select>
                        </div>
                        <div className="d-none d-xl-inline-block col-xl-12" style={{padding: "10px"}}></div>
                        <div className="col-xl-2 col-lg-12 col-md-12 col-sm-12 col-12">
                          <p
                            className="offerformlabel"
                            style={{
                              display: "inline-block",
                              marginRight: "0px",
                              paddingRight: "0px",
                              fontSize: "0.8em",
                              padding: "0px"
                            }}
                          >
                            Hashrate:
                          </p>
                        </div>
                        <div className="col-xl-3 col-lg-12 col-md-12 col-sm-12 col-12">
                          <input
                            type="text"
                            className="form-control inputfix"
                            placeholder="example: 3"
                            name="declared_hashrate"
                            value={this.state.declared_hashrate}
                            onChange={this.handleChange}
                            autoComplete="off"
                            style={{
                              display: "inline-block",
                              width: "160px"
                            }}
                          />
                          {this.props.errors.declared_hashrate !== undefined ? <p className="is-invalid-error">{this.props.errors.declared_hashrate}</p> : null}
                        </div>

                        <div className="col-xl-2 col-lg-12 col-md-12 col-sm-12 col-12">
                          <p
                            className="offerformlabel mobilestyles"
                            style={{
                              display: "inline-block",
                              marginRight: "0px",
                              paddingRight: "0px",
                              fontSize: "0.8em",
                              padding: "0px"
                            }}
                          >
                            Hashrate unit:
                          </p>
                        </div>
                        <div className="col-xl-4 col-lg-12 col-md-12 col-sm-12 col-12">
                          <select
                            className="form-control selectstyles miningalgoselect"
                            name="hashrate_units"
                            placeholder="Select hashrate unit"
                            style={{
                              display: "inline-block",
                              width: "170px"
                            }}
                            value={this.state.hashrate_units}
                            onChange={this.handleSelect}
                          >
                            <option className="selectstyles" value="">
                              Select hashrate unit
                            </option>
                            <option className="selectstyles" value="K">
                              KH/s
                            </option>
                            <option className="selectstyles" value="M">
                              MH/s
                            </option>
                            <option className="selectstyles" value="G">
                              GH/s
                            </option>
                            <option className="selectstyles" value="T">
                              TH/s
                            </option>
                          </select>

                          {this.props.errors.hashrate_units !== undefined ? <p className="is-invalid-error">{this.props.errors.hashrate_units}</p> : null}
                        </div>
                      </div>
                    </div>

                    {this.props.time.message !== null ? <p className="is-invalid-error">{this.props.time.message}</p> : null}
                    {this.state.networkerror !== "" ? <p className="is-invalid-error">{this.state.networkerror}</p> : null}
                    {this.props.errors.errors !== null &&
                      this.props.errors.errors !== undefined &&
                      this.state.networkerror === "" &&
                        fielderrors != "name" &&
                        fielderrors != "declared_hashrate" &&
                        fielderrors != "hashrate_units" &&
                        fielderrors != "miner_id"
                        ? <p className="is-invalid-error add-padding-left">
                        {fielderrorsReason} </p>
                        : null}
                    <div style={{ marginTop: "17px" }}>
                      <button
                        type="submit"
                        disabled={addminersloading}
                        className="btn btn-info nooutline createofferbtn"
                        style={{
                          display: "inline-block",
                          marginRight: "15px",
                          borderRadius: "0px",
                          width: "90px"
                        }}
                        id="add-miners-btn"
                      >
                        {addminersloading === true ? <ThreeDotsLoading /> :
                          <p style={{ marginBottom: "0px", paddingBottom: "0px" }}>Add</p>}

                      </button>
                      <Link route="/sell">
                        <a
                          className="btn btn-secondary nooutline createofferbtn"
                          style={{ display: "inline-block", borderRadius: "0px" }}
                        >
                          Back to Sell Hashing Power
                        </a>
                      </Link>
                    </div>
                    <br />
                  </form>
                </div>
              </div>

              <div className="col-xl-8 col-lg-12 col-md-12 col-sm-12 col-12">
                <br /> <br /> <br />
                <h5>
                  <strong>Miners Inventory</strong>
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
                    .table-borderless th {
                      border: 0;
                  }
                  `}
                </style>
                <table
                  id="tableT"
                  className="table container inventorytable inventorystyles"
                >
                  <thead className="text-white table-borderless"
                    style={{
                      borderRight: "0.5px solid rgba(0, 0, 0, 0.1)",
                      borderLeft: "0.5px solid rgba(0, 0, 0, 0.1)", background: "black"
                    }}>
                    <tr className="row m-0" style={{
                      borderRight: "0.5px solid rgba(0, 0, 0, 0.1)",
                      borderLeft: "0.5px solid rgba(0, 0, 0, 0.1)"
                    }}>
                      <th
                        id="miner_id"
                        className="d-none d-md-inline-block col-md-1 offertitle minerstable-styles"
                      >
                        ID
                      </th>
                      <th
                        id="miner"
                        className="d-inline-block col-md-3 col-8 offertitle minerstable-styles"
                      >
                        Name
                      </th>
                      <th
                        id="current_hashrate"
                        className="d-none d-md-inline-block col-md-3 col-4 offertitle minerstable-styles"
                      >
                        Algorithm
                      </th>
                      <th
                        id="price"
                        className="d-none d-md-inline-block col-md-3 offertitle minerstable-styles"
                      >
                        Hashrate
                      </th>

                      <th
                        id="remove_buttons"
                        className="d-inline-block col-md-2 col-4 offertitle"
                      />
                    </tr>
                  </thead>
                  <tbody className="tablebodytaken" >
                    {loading === true && 
                      this.props.profile.miners_loaded === false ? 
                      <tr style={{ width: "100%", textAlign: "center",
                      borderRight: "1px solid rgba(0,0,0,0.1)",
                          borderLeft: "1px solid rgba(0,0,0,0.1)", }}>
                      <td>
                      <img
                        src="/static/spinner.gif"
                        style={{
                          width: "150px",
                          margin: "0 auto",
                          paddingTop: "20px",
                          paddingBottom: "20px",
                          display: "block",
                          opacity: "0.6"
                        }}
                        alt="Loading..."
                      />
                      </td>
                    </tr>
                      : null}

                    {this.props.profile.miners.length === 0 &&
                      loading === false &&
                     this.props.profile.miners_loaded === true 
                      ? noMinersFound
                      : null}

                     {minersList}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <ReactModal
            isOpen={this.state.showModal}
            contentLabel="Remove Miners Modal"
            className="removeprompt-modal"
            overlayClassName="Overlay"
            ariaHideApp={false}
            onRequestClose={this.handleCloseModal}
          >
            <div>
              <br /><br />
              Are you sure you want to remove the miners from your inventory?
                 <br /> <br /><br />
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
                  this.deleteMiner(this.state.minerinfo.miner_id);
                }}
                style={{ fontSize: "0.85em", borderRadius: "0px" }}
              >
                Yes, remove them
          </button>
            </div>
          </ReactModal>
        </div>
      </PublicRoute>
    );
  }
}

AddMiners.defaultProps = {
  profile: [],
  network: [],
  miningalgo: [],
  inventory: [],
  errors: []
};

AddMiners.propTypes = {
  addMiners: PropTypes.func,
  removeMiners: PropTypes.func,
  clearAlert: PropTypes.func,
  logoutUser: PropTypes.func,
  getCurrentProfile: PropTypes.func,
  clearNetwork: PropTypes.func,
  resetErrors: PropTypes.func,
  redirectErrorMessage: PropTypes.func,
  algoSelect: PropTypes.func,
  formSubmission: PropTypes.func,
  enableNavigation: PropTypes.func,
  getMinersList: PropTypes.func,
  timeoutError: PropTypes.func,
  timeoutReset: PropTypes.func,
  resetMinerStatus: PropTypes.func,
  auth: PropTypes.object,
  errors: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object
  ]),
  profile: PropTypes.object,
  network: PropTypes.object,
  configs: PropTypes.object,
  inventory: PropTypes.object,
  miningalgo: PropTypes.object,
  time: PropTypes.object
};
const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  profile: state.profile,
  network: state.network,
  configs: state.configs,
  inventory: state.inventory,
  miningalgo: state.miningalgo,
  time: state.time
});

export default connect(
  mapStateToProps,
  {
    addMiners,
    removeMiners,
    clearAlert,
    logoutUser,
    getCurrentProfile,
    clearNetwork,
    resetErrors,
    redirectErrorMessage,
    algoSelect,
    formSubmission,
    enableNavigation,
    getMinersList,
    timeoutError,
    timeoutReset,
    resetMinerStatus
  }
)(AddMiners);
