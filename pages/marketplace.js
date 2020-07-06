import React from "react";
import PublicRoute from "../components/routes/PublicRoute";
import { connect } from "react-redux";
import {
  resetErrors,
  takeOffer,
  clearNetwork,
  clearAlert,
  getConfigs,
  getEstimate,
  marketplacePage,
  formSubmission,
  enableNavigation,
  timeoutError,
  timeoutReset,
  algoSelect,
  setStratumHostPort,
  setStratumUsernamePass,
  setRecentInvoiceId,
  setThemeColors,
  setToken,
  setSubUser } from "../actions/warihashApiCalls";
import { FaRegClock, FaBitcoin, FaQuestionCircle, FaWallet } from "react-icons/fa";
import { TiFlash } from "react-icons/ti";
import { Router } from "../routes";
import MiningAlgoDropDown from "../components/tools/MiningAlgoDropDown";
import PropTypes from "prop-types";
import NProgress from "nprogress";
import CSRFToken from "../utils/csrftoken";
import Cookies from "js-cookie";
import { googleAnalytics, minerLocations, algorithms } from "../settings";
import PaymentRate from "../components/tools/PaymentRate";
import BTCPaymentRate from "../components/tools/BTCPaymentRate";
import {
  WAIT_ALERT,
  TIMEOUT_DURATION
} from "../utils/timeout-config";
import { csrfcookie } from "../utils/cookieNames";
// import { alphaNumericCheck } from "../utils/alphaNumericCheck";
import ThreeDotsLoading from "../components/tools/ThreeDotsLoading";
import Head from "next/head";

class Marketplace extends React.Component {
  constructor() {
    super();
    this.state = {
      hashrate: "",
      hashrate_fiat: "",
      hashrate_units: "",
      hashrate_units_fiat: "",
      mining_algo: "",
      tag: "",
      duration: "",
      duration_example: "",
      durationunit: "hour",
      limit_price: "",
      durationClicked: false,
      stratum_id: "",
      currency: "BTC",
      location: "NA East",
      networkerror: "",
      stratum_info: [],
      email: "", 
      name_or_company: "", 
      phone_number: "",
      duration_days: "",
      internetExplorer: false,
      loading: false,
      refund_address: "",
      hashratefocus: false,
      durationfocus: false,
      emailfocus: false,
      pricefocus: false,
      nameorcompanyfocus: false,
      durationdaysfocus: false,
      phonenumberfocus: false,
      refundaddressfocus: false,
      formloading: false,
      menuOpen: false,
      checked: false
    };
    this.timer = null;
  }

  static async getInitialProps(props) {
    return props.query;
  };    

  componentDidMount() {
    this.props.timeoutReset();
    this.props.marketplacePage();
    this.props.getConfigs();
    this.props.clearNetwork();
    this.props.resetErrors();

    // set global stratum configs here
    if ( this.props.stratumaddress !== undefined || this.props.stratumport !== undefined ) {
      this.props.setStratumHostPort(this.props.stratumaddress, this.props.stratumport);
    };
    if ( this.props.username !== undefined || this.props.password !== undefined ) {
      this.props.setStratumUsernamePass(this.props.username, this.props.password);
    }; 
    // set subuser
    if (this.props.mysubuser !== undefined) {
      this.props.setSubUser(this.props.mysubuser);
    };

    // select algorithm
    if ( this.props.algorithm !== undefined && algorithms.includes(this.props.algorithm) === true ) {
      this.props.algoSelect(this.props.algorithm);
      const hashunits = ((this.props.configs || {})[this.props.algorithm] || {}).hashrate_units;
      this.setState({ mining_algo: this.props.algorithm, hashrate_units: hashunits });
      Cookies.set("algo_select", this.props.algorithm, { expires: 7 });
    };

    // set default algorithm
    if ( this.props.algorithm === undefined || algorithms.includes(this.props.algorithm) === false ) {
      this.selectAlgorithm("sha256d");
    };

    // set theme colors
    if ( this.props.navbg !== undefined ) {
      this.props.setThemeColors(
        this.props.navbg, 
        this.props.navtexts, 
        this.props.primary, 
        this.props.secondary, 
        this.props.buttontexts, 
        this.props.tabletexts, 
        this.props.nightmode
      );
    };

    // set token
    if ( this.props.mytoken !== undefined ) {
      this.props.setToken(this.props.mytoken);
    };

  };

  componentDidUpdate(prevProps) {
    if (prevProps.errors !== this.props.errors &&
      this.props.errors.errors === undefined) {
      this.setState({ formloading: false });
      NProgress.done();
      this.props.enableNavigation();
    };
    if (prevProps.configs !== this.props.configs) {
      this.setState({ hashrate_units: (this.props.configs[this.props.miningalgo.algorithm] || {}).hashrate_units });
      if (this.safeNestedCheck(() => (this.props.configs[this.props.miningalgo.algorithm] || {})[this.state.location][this.state.durationunit].hashrate_min) === null) {
        this.setState({ duration: 25, duration_example: 25 });
      };
      if (this.safeNestedCheck(() => (this.props.configs[this.props.miningalgo.algorithm] || {})[this.state.location][this.state.durationunit].hashrate_min) !== null){
        this.setState({ duration: parseInt(this.safeNestedCheck(() => this.props.configs[this.props.miningalgo.algorithm][this.state.location][this.state.durationunit].duration_min) / 60), 
          duration_example: parseInt(this.safeNestedCheck(() => this.props.configs[this.props.miningalgo.algorithm][this.state.location][this.state.durationunit].duration_min) / 60) });
      };
  };
    if (
      this.props.errors.alertnow === "alertnow" &&
      prevProps.errors.alertnow !== "alertnow"
    ) {
      NProgress.done();
      this.props.enableNavigation();
      this.setState({ networkerror: "", formloading: false });
    };
    if (
      this.props.errors.alertnow === "fiat_form_submitted" &&
      prevProps.errors.alertnow !== "fiat_form_submitted"
    ) {
      NProgress.done();
      this.props.enableNavigation();
      setTimeout(() => {
        this.successAlert();
        this.setState({ networkerror: "", formloading: false });
      }, WAIT_ALERT);
    };
    if(this.props.payment !== prevProps.payment && 
      this.props.payment.bid_id !== undefined) {
      if (googleAnalytics === "on") {
        window.gtag('event', 'conversion', 
        { 'send_to': 'AW-693268366/0QwACN7PnrYBEI7fycoC', 
        'transaction_id': `${this.props.payment.bid_id}` });
        window.ga('send', {
          hitType: 'event',
          eventCategory: 'marketplace',
          eventAction: 'invoice',
          eventLabel: 'Marketplace Events'
        });
      };
      this.props.setRecentInvoiceId(this.props.payment.bid_id);
      Router.pushRoute(`/invoice/id/${this.props.payment.bid_id}`);
    };
    if (
      this.props.errors.detail ===
      "CSRF Failed: CSRF token missing or incorrect." &&
      prevProps.errors.detail !==
      "CSRF Failed: CSRF token missing or incorrect."
    ) {
      Cookies.remove(csrfcookie);
    };
    if (
      (this.props.network.networkstatus === 500) &
      (prevProps.network.networkstatus !== 500)
    ) {
      NProgress.done();
      this.props.enableNavigation();
      this.setState({
        networkerror: "Failed for unknown reason. Contact info@warihash.com",
        formloading: false
      });
    };
    // clean up settimeout function
    clearTimeout(this.timer);
  };

  componentWillUnmount() {
    // clean up settimeout function
    clearTimeout(this.timer);
    this.props.resetErrors();
  };

  handleHashrateFocus = () => this.setState({ hashratefocus: true });
  handleHashrateBlur = () => { 
    this.setState({ hashratefocus: false });
    this.checkEstimatePrice();
  };
  handleDurationFocus = () => this.setState({ durationfocus: true, durationClicked: true });
  handleDurationBlur = () =>  { 
    this.setState({ durationfocus: false }) 
    this.checkEstimatePrice();
  };
  handleDurationDaysFocus = () => this.setState({ durationdaysfocus: true });
  handleDurationDaysBlur = () => this.setState({ durationdaysfocus: false });
  handleEmailFocus = () => this.setState({ emailfocus: true });
  handleEmailBlur = () => this.setState({ emailfocus: false });
  handleNameOrCompanyFocus = () => this.setState({ nameorcompanyfocus: true });
  handleNameOrCompanyBlur = () => this.setState({ nameorcompanyfocus: false });
  handlePhoneNumberFocus = () => this.setState({ phonenumberfocus: true });
  handlePhoneNumberBlur = () => this.setState({ phonenumberfocus: false });
  handlePriceFocus = () => this.setState({ pricefocus: true });
  handlePriceBlur = () => this.setState({ pricefocus: false });  
  handleRefundFocus = () => this.setState({ refundaddressfocus: true });
  handleRefundBlur = () => this.setState({ refundaddressfocus: false });

  handleCheck = () => this.setState({ checked: !this.state.checked, limit_price: "" });

  handleSubmit = event => {
    event.preventDefault();
    var durationHoursToMins = this.state.duration * 60;
    var durationDaysToMins = this.state.duration * 1440;
    this.setState({ formloading: true });
    NProgress.start();
    this.props.resetErrors();
    this.props.formSubmission();
    this.props.timeoutReset();
    this.props.takeOffer(
      this.state.hashrate,
      this.state.hashrate_units,
      this.props.miningalgo.algorithm,
      this.state.durationunit === "hour" ? durationHoursToMins : durationDaysToMins,
      this.props.settings.host,
      this.props.settings.port,
      this.props.settings.username,
      this.props.settings.password,
      this.state.location,
      this.state.limit_price,
      this.state.refund_address,
      this.props.subuser.value,
      this.props.token.value
    );
    this.timer = setTimeout(() => {
      NProgress.done();
      this.setState({ formloading: false });
      this.props.enableNavigation();
      if (!this.props.errors) {
        this.props.timeoutError();
      }
    }, TIMEOUT_DURATION);
    Cookies.remove("saved_data");
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


        //// ERROR ALERT ///////////////////////////////
        errorAlert = () => {
          const errorAlert = (
            <SweetAlert
              danger
              //  showCancel
              confirmBtnText="Confirm"
              //  cancelBtnText="Go to marketplace"
              confirmBtnBsStyle="warning"
              //  cancelBtnBsStyle="default btn-sm"
              title=""
              style={{ borderRadius: "0px" }}
              onConfirm={this.confirmError}
            //  onCancel={this.onCancel}
            >
               <p style={{ fontSize: "0.7em" }}>
                <br />
                {this.state.error_message}
                <br />
                <br />
              </p>
            </SweetAlert>
          );
          this.setState({ errorAlert: errorAlert });
        };

    /// ALGORITHM SELECTOR /////////////////////

    selectAlgorithm = algorithm_name => {
      this.props.algoSelect(algorithm_name);
      const hashunits = ((this.props.configs || {})[algorithm_name] || {}).hashrate_units;
      this.setState({ mining_algo: algorithm_name, hashrate_units: hashunits });
      Cookies.set("algo_select", algorithm_name, { expires: 7 });
      this.setState({ durationClicked: false });
      this.selectFirstRegion(algorithm_name);
    };

    selectFirstRegion = algorithm_name => {
      const locations = minerLocations;
      const firstAvailableLocation = locations.find(location => this.safeNestedCheck(() => this.props.configs[algorithm_name][location.value][this.state.durationunit].hashrate_min) !== null ||
      this.safeNestedCheck(() => this.props.configs[algorithm_name][location.value].hashrate_min) !== null );
      if (firstAvailableLocation !== undefined) {
          if (this.state.durationunit === "hour") {
            this.setState({ location: firstAvailableLocation.value });
            if (this.safeNestedCheck(() => (this.props.configs[algorithm_name] || {})[firstAvailableLocation.value][this.state.location][this.state.durationunit].hashrate_min) === null) {
              this.setState({ duration: 25, duration_example: 25 });
            } else { 
              this.setState({ duration: parseInt(this.safeNestedCheck(() => this.props.configs[algorithm_name][this.state.location][this.state.durationunit].duration_min) / 60), 
                duration_example: parseInt(this.safeNestedCheck(() => this.props.configs[algorithm_name][this.state.location][this.state.durationunit].duration_min) / 60) });
            };
          };
          if (this.state.durationunit === "day") {
            this.setState({ location: firstAvailableLocation.value });
            if (this.safeNestedCheck(() => (this.props.configs[algorithm_name] || {})[firstAvailableLocation.value][this.state.location][this.state.durationunit].hashrate_min) === null) {
              this.setState({ duration: 1, duration_example: 1 });
            } else { 
              this.setState({ duration: parseInt(this.safeNestedCheck(() => this.props.configs[algorithm_name][this.state.location][this.state.durationunit].duration_min) / 1440), 
                duration_example: parseInt(this.safeNestedCheck(() => this.props.configs[algorithm_name][this.state.location][this.state.durationunit].duration_min) / 1440) });
            };
          };
      };
      if (firstAvailableLocation === undefined) {
        this.setState({ location: "NA East" });
      };
    };

    handleUnitSelect = event => this.setState({ hashrate_units_fiat: event.target.value });

    selectLocation = event => {
      this.setState({ location: event.target.value });
      
      if (this.props.configs[this.props.miningalgo.algorithm][event.target.value] &&
          this.props.configs[this.props.miningalgo.algorithm][event.target.value]['hour'].hashrate_min !== null) {
        this.setState({ durationunit: "hour" });
        if (this.safeNestedCheck(() => (this.props.configs[this.props.miningalgo.algorithm] || {})[event.target.value]['hour'].hashrate_min) === null) {
          this.setState({ duration: 25, duration_example: 25 });
        } else { 
          this.setState({ duration: parseInt(this.safeNestedCheck(() => this.props.configs[this.props.miningalgo.algorithm][event.target.value]['hour'].duration_min) / 60), 
            duration_example: parseInt(this.safeNestedCheck(() => this.props.configs[this.props.miningalgo.algorithm][event.target.value]['hour'].duration_min) / 60) });
        };
        this.checkEstimatePrice();
     };

      if (this.props.configs[this.props.miningalgo.algorithm][event.target.value] &&
        this.props.configs[this.props.miningalgo.algorithm][event.target.value]['day'].hashrate_min !== null && 
        this.props.configs[this.props.miningalgo.algorithm][event.target.value]['hour'].hashrate_min === null) {
          this.setState({ durationunit: "day" });
          if (this.safeNestedCheck(() => (this.props.configs[this.props.miningalgo.algorithm] || {})[event.target.value]['day'].hashrate_min) === null) {
          this.setState({ duration: 1, duration_example: 1 });
        } else { 
          this.setState({ duration: parseInt(this.safeNestedCheck(() => this.props.configs[this.props.miningalgo.algorithm][event.target.value]['day'].duration_min) / 1440), 
            duration_example: parseInt(this.safeNestedCheck(() => this.props.configs[this.props.miningalgo.algorithm][event.target.value]['day'].duration_min) / 1440) });
        };
        this.checkEstimatePrice();
      };
    };

    selectDurationUnit = event => {
      this.setState({ durationunit: event.target.value });
      if (event.target.value === "hour") {
        this.setState({ duration: this.checkNestedConfigs() && 
          this.safeNestedCheck(() => (this.props.configs[this.props.miningalgo.algorithm] || {})[this.state.location][event.target.value].hashrate_min) === null ? 25 :
          parseInt((this.props.configs[this.props.miningalgo.algorithm] || {})[this.state.location][event.target.value].duration_min / 60)});
        this.setState({ duration_example: this.checkNestedConfigs() && 
          this.safeNestedCheck(() => (this.props.configs[this.props.miningalgo.algorithm] || {})[this.state.location][event.target.value].hashrate_min) === null ? 25 :
          parseInt((this.props.configs[this.props.miningalgo.algorithm] || {})[this.state.location][event.target.value].duration_min / 60)});
      
          if(this.state.duration !== "" && this.state.hashrate !== "") {  
          this.props.getEstimate(
            parseInt((this.props.configs[this.props.miningalgo.algorithm] || {})[this.state.location][event.target.value].duration_min),
            this.state.hashrate,
            this.state.hashrate_units,
            this.props.miningalgo.algorithm,
            this.state.location,
            this.state.limit_price)  
          }
      };
      if (event.target.value === "day") {
        this.setState({ duration: this.checkNestedConfigs() && 
          this.safeNestedCheck(() => (this.props.configs[this.props.miningalgo.algorithm] || {})[this.state.location][event.target.value].hashrate_min) === null ? 1 :
          parseInt((this.props.configs[this.props.miningalgo.algorithm] || {})[this.state.location][event.target.value].duration_min / 1440)});
        this.setState({ duration_example: this.checkNestedConfigs() && 
          this.safeNestedCheck(() => (this.props.configs[this.props.miningalgo.algorithm] || {})[this.state.location][event.target.value].hashrate_min) === null ? 1 :
          parseInt((this.props.configs[this.props.miningalgo.algorithm] || {})[this.state.location][event.target.value].duration_min / 1440)});
          if(this.state.duration !== "" && this.state.hashrate !== "") {
          this.props.getEstimate(
            parseInt((this.props.configs[this.props.miningalgo.algorithm] || {})[this.state.location][event.target.value].duration_min),
            this.state.hashrate,
            this.state.hashrate_units,
            this.props.miningalgo.algorithm,
            this.state.location,
            this.state.limit_price)
            }
          }
    };

    checkEstimatePrice = () => {
      if (this.state.hashrate !== "" && this.state.duration !== "") {
        const durationHoursToMins = this.state.duration * 60;
        const durationDaysToMins = this.state.duration * 1440;
        this.props.getEstimate(
          this.state.durationunit === "hour" ? durationHoursToMins : durationDaysToMins,
          this.state.hashrate,
          this.state.hashrate_units,
          this.props.miningalgo.algorithm,
          this.state.location,
          this.state.limit_price); 
      }
    };

    checkNestedConfigs = () => { 
      return (this.props.configs &&
        this.props.configs[this.props.miningalgo.algorithm])
    };
    
    checkNestedAvailable = () => {
      return (
        this.props.stats &&
        this.props.stats.available &&
        this.props.stats.available[this.props.miningalgo.algorithm]
      )
    };

    bestAvailableRate = () => {
      return (
        this.props.stats &&
        this.props.stats.best_offer && 
        (this.props.stats || {}).best_offer[this.props.miningalgo.algorithm]
      )
    };

    maxDurationCheck = () => {
      return (
        this.state.duration !== "" && 
        this.state.duration > 24
      )
    };

    minDurationCheck = () => {
      return (
        this.state.duration !== "" && 
        this.state.duration < 25
      )
    };

    checkDurationBelowDay = () => {
      return (
        this.state.duration === "" || 
        this.state.duration < 25
      )
    };

    safeNestedCheck = (fn, defaultVal) => {
      try {
          return fn();
      } catch (e) {
          return defaultVal;
      }
    };

    openOrderHistory = () => Router.pushRoute('/orderhistory');
    handlePriceFocus = () => this.setState({ pricefocus: true });
    handlePriceBlur = () => this.setState({ pricefocus: false });

  render() {
    const { hashratefocus, durationfocus, durationClicked,
      pricefocus, refundaddressfocus, durationunit,
      location, refund_address, checked, formloading,
      networkerror, limit_price, hashrate,
      duration, duration_example, internetExplorer } = this.state;
    const { miningalgo, configs, stats, theme, estimate, time, errors, payment } = this.props;
    
    let hashrateExampleText = "";
    
    if (this.checkDurationBelowDay() && 
      this.checkNestedConfigs() &&
      configs[miningalgo.algorithm][location] &&
      configs[miningalgo.algorithm][location][durationunit].hashrate_min !== null 
    ) {
      hashrateExampleText = `Example: ${
        this.checkNestedConfigs() &&
        configs[miningalgo.algorithm][location] &&
        configs[miningalgo.algorithm][location][durationunit].hashrate_min}`;
    } else if (this.maxDurationCheck() && 
    this.checkNestedConfigs() &&
    configs[miningalgo.algorithm][location][durationunit].hashrate_min !== null 
    ) {
      hashrateExampleText = `Example: ${this.checkNestedConfigs() &&
        configs[miningalgo.algorithm][location] && 
        configs[miningalgo.algorithm][location][durationunit].hashrate_min}`;
    } else if (this.checkDurationBelowDay() && 
    this.checkNestedConfigs() &&
    configs[miningalgo.algorithm][location] &&
    configs[miningalgo.algorithm][location][durationunit].hashrate_min === null 
    ) {
      hashrateExampleText = "Not available";
    } else if (this.maxDurationCheck() && 
    this.checkNestedConfigs() &&
    configs[miningalgo.algorithm][location][durationunit].hashrate_min === null
    ) {
      hashrateExampleText = "Not available";
    };

    const availableRegions = minerLocations.map(minerLocation => { 
      if (this.checkNestedConfigs() &&
      configs[miningalgo.algorithm] !== undefined &&
      configs[miningalgo.algorithm][minerLocation.value] !== undefined) 
        return (
        <option className={
          configs[miningalgo.algorithm][minerLocation.value][durationunit].hashrate_min !== null ||
          configs[miningalgo.algorithm][minerLocation.value][durationunit].hashrate_min !== null ?
          "selectstyles" : "hidethis"} 
          key={minerLocation.value} 
          value={minerLocation.value}
          disabled={configs[miningalgo.algorithm][minerLocation.value][durationunit].hashrate_min === null &&
            configs[miningalgo.algorithm][minerLocation.value][durationunit].hashrate_min === null}
          >
          {minerLocation.name}
          </option>
        )
      } 
    );

    const fielderrors = Object.keys(errors);
    const fielderrorsReason = errors[fielderrors];

    return (
      <PublicRoute>
        <style jsx>
          {`
          .refund-address-container {
            padding-right: 0px; 
            padding-left: 0px; 
            padding-top: 0px; 
            position: relative; 
            right: -33.5px;
          }
          .estimate-container {
            padding-left: 68px;
            padding-right: 45px;
          }
          .miningalgo-selector-container {
            display: block;
            width: 100%;
            margin-top: 77px;
          }

          .specify-limit {
            margin-top: 8px; 
            margin-left: 0px; 
            padding-left: 0%; 
            position: relative; 
            left: 90px;
            top: 6px;
          }

          .nav-buttons {
            background: none;
            display: inline-block;
            border: none;
            box-shadow: none;
            outline: none;
            font-size: 13px;
            transition: 0.5s ease all;
          }
          .nav-buttons:hover {
            color: #3626a5;
          }

          .nav-bar {
            display: inline-block;
            font-size: 13px;
          }

          .number-circle {
            border: 2.5px solid ${theme.navtexts};
            border-radius: 50%;
            padding: 1px 7px 1px 7px;
            color: ${theme.navtexts};
            display: inline-block;
            font-size: 0.95em;
            font-weight: bold;
            position: relative;
            top: -1px;
          }

          .unitselectstyles {
            height: 42.7px !important; 
            width: 100px; 
            max-height: 42.7px;
            display: inline-block; 
            padding-bottom: 0px; 
            margin-bottom: 0px;
            margin-left: 0px;
            font-size: 0.82em;
            position: relative;
            top: -2px;
            cursor: pointer;
          }

          .unitselectie {
            height: 42.7px !important; 
            width: 100px; 
            max-height: 42.7px;
            display: inline-block; 
            padding-bottom: 0px; 
            margin-bottom: 0px;
            margin-left: 0px;
            font-size: 0.82em;
            position: relative;
            top: -12px;
            cursor: pointer;
          }
          
          .offerformlabel {
            display: inline-block; 
            margin-left: 15px;
            font-weight: bold;
            font-size: 1.11em;
          }
          .buypage-title {
            display: inline-block; 
            margin-left: 3px;
            font-weight: bold;
            font-size: 1.4em;
          }
          .buy-info-container {
            width: 100%;
            display: block;
          }
            .pagetitle-container {
              margin-bottom: 6px;
              margin-top: 11px;
            }
            .pagetitle-container h6 {
              font-weight: bold;
              display: inline-block;
              margin-right: 15px;
            }
            .algo-select-title {
              display: inline-block;
              margin-right: 14px;
            }
            .formstyles {
              width: 100%;
            }
            .inputlabel {
              font-size: 0.83em;
            }
            .select-container {
              margin-bottom: 15px;
            }
            .addmarginright {
              margin-right: 14px;
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
            .buybtn {
              font-size: 0.85em;
              background: ${theme.primary};
              border: 1px solid ${theme.primary};
              border-radius: 0px;
              width: 200px;
              height: 40px;
              margin-top: 17px;
              margin-bottom: 0px;
              color: ${theme.buttontexts};
              font-weight: 600;
              position: relative; 
              left: -25px;
              top: 15px;
            }
            .buybtn:hover {
              opacity: 0.7 !important;
            }
            .buybtn:focus,
            .buybtn:active:focus,
            .buybtn.active:focus,
            .buybtn.focus,
            .buybtn:active.focus,
            .buybtn.active.focus {
              opacity: 0.7 !important;
              outline: none !important;
              box-shadow: none !important;
            }
            .stratum-address-container {
              padding-right: 30px; 
              padding-left: 0px;
            }
            .stratum-title {
              font-weight: bold;
              margin-bottom: 17px;
            }
            .description-texts {
              font-size: 0.82em;
              display: inline-block;
              margin-top: 0px;
              margin-bottom: 20px;
            }
            .formcontainer-price {
              width: 100%;
              padding-left: 15px;
            }
            .formcontainer-offerdetails {
              border: 0.5px solid rgba(0, 0, 0, 0.1);
              width: 100%;
              padding: 30px 35px 5px 35px;
              margin-top: 20px;
              border-radius: 7px;
              box-shadow: 0 11px 21px rgba(0, 0, 0, 0.08),
                0 10px 50px rgba(0, 0, 0, 0.02);
            }
            .buypage-details {
              font-size: 0.85em;
              display: block;
              margin-top: 5px;
              margin-bottom: 5px;
              padding-left: 5px;
            }
            .detail-title {
              font-weight: bold;
            }
            .instructions {
              padding-top: 10px;
              padding-bottom: 10px;
              padding-left: 0px;
              margin-left: 0px;
              font-size: 0.89em;
            }
            .nopower-icon {
              width: 147px; 
              margin-left: 50px;
            }
            .mobile-marketplacetitle1 {
              display: inline-block !important;
            }
            .mobile-marketplacetitle2 {
              display: none !important;
            }
            .linebreak-br {
              display: none;
            }
            .managestratum-btn {
              height: 41px;
              padding-top: 10px;
            }

            .discount-code-btn {
              background: transparent;
              border: none;
              display: inline-block;
              position: relative; 
              top: 20px;
              right: 10px;
              color: rgba(0,0,0,0.59);
            }

            .discount-code-btn:hover {
              color: rgba(0,0,0,0.77);
            }

            .borderbottomadj {
              border-bottom: 1.3px solid rgba(0,0,0,0.55);
            }

            .borderbottomfocus {
              border-bottom: 1.3px solid #4cb4cb;
            }

            .link-icon {
              color: rgba(0,0,0,0.5);
              position: relative;
              left: 2px;
              top: -2px;
              margin-right: 14px;
              font-size: 11px;
            }

            .link-icon:hover {
              color: rgba(0,0,0,0.77);
            }

            .main-marketplace-form {
              width: 100%;
              padding-left: 37px;
            }

            .limit-price-container {
              margin-top: 8px; 
              padding-left: 0px; 
              position: relative; 
              left: 9px; 
            }

            .addpaddingleft {
              padding-left: 35px;
            }

            .addpaddingleftmenu {
              padding-left: 35px;
            }

            .limitpricelabel {
              left: -6.9px;
            }

            .estimate-containerdiv {
              padding-top: 16px; 
              padding-left: 0px;
              padding-right: 0px;
            }

            .extrapadding {
              padding-left: 23px;
              padding-right: 0px;
            }
            .rowpaddings {
              padding-left: 25px; 
              padding-right: 0px;
            }
            .bordertop {
              border-top: 1px solid rgba(0,0,0,0.3);
              padding-top: 16px; 
              width: 400px;
              position: relative;
              left: 16px;
            }

            .iconcontainers {
              display: inline-block;
            }

            @media (max-width: 1203px) {
              .estimate-containerdiv {
                padding-top: 16px; 
                padding-left: 15px;
                padding-right: 0px;
                border-top: none;
              }

              .bordertop {
                border-top: none;
                padding-top: 16px; 
              }

              .limit-price-container {
                position: relative; 
                left: -15.5px;
              }

              .refund-address-container {
                padding-right: 0px; 
                padding-left: 0px; 
                padding-top: 0px; 
                position: relative;
                left: 0px;
              }

              .estimate-container {
                padding-left: 27px;
                padding-right: 25px;
              }

              .main-marketplace-form {
                padding-left: 10px;
              }

              .limitpricelabel {
                left: 0px;
              }

              .addpaddingleft {
                padding-left: 10px;
              }

              .addpaddingleftmenu {
                padding-left: 16px;
              }

              .offerformlabel {
                display: inline-block; 
                margin-left: 15px;
                font-weight: bold;
                font-size: 1.12em;
              }
              .managestratum-btn{
                display: block;
                margin-top: 17px;
                margin-bottom: 17px;
                margin-left: 0px;
              }
              .nopower-icon {
                width: 130px; 
                margin-left: 20px;
              }
              .stratum-address-container {
                padding-right: 0px; 
                padding-left: 0px;
              }
              .addpadding {
                padding: 0px;
              }
              .containerpadding {
                padding: 1px;
              }
              .miningalgo-selector-container {
                margin-top: 55px;
              }
              .miningalgorithm-dropdown {
                margin-left: 37.7px;
              }
              .formcontainer-price {
                padding: 0px 15px 15px 15px;
              }
              .formcontainer-offerdetails {
                padding: 15px;
              }
              .mainwrapper {
                padding: 0px;
              }
              .buybtn {
                position: relative; 
                top: 15px;
                left: 9px;
              }
              .buypage-title {
                font-size: 1.1em;
                margin-top: 0px;
              }
              .buypage-details {
                font-size: 0.8em;
              }
              .pagetitle-container {
                margin-top: 0px;
              }
              .miningalgo-selector-container {
                margin-top: 13px;
              }

              .desktop-br {
                display: none;
              }
            }

            @media (max-width: 1200px) {
              .main-marketplace-form {
                width: 100%;
                margin-bottom: 240px;
              }

              .specify-limit {
                position: relative; 
                left: 20px;
                top: 0px;
              }

              .buybtn {
                position: relative; 
                left: 12px;
              }

              .limitinput {
                text-align: left;
              }

              .limit-price-container {
                margin-top: 8px; 
                margin-left: 0px; 
                padding-left: 0px; 
                position: relative; 
                left: 0px;
              }
            }

            @media (max-width: 820px) {
              .iconcontainers {
                display: none;
              }
            }

            @media (max-width: 773px) {
              .estimate-containerdiv {
                padding-left: 5px;
              }
              .extrapadding {
                padding-left: 0px;
                padding-right: 0px;
              }
              .rowpaddings {
                padding-left: 0px; 
                padding-right: 0px;
              }
            }

            @media (max-width: 620px) {
              .linebreak-br {
                display: block;
              }
              .mobile-marketplacetitle1 {
                display: none !important;
              }
              .mobile-marketplacetitle2 {
                display: inline-block !important;
              }
            }

            @media (max-width: 460px) {
              .number-circle {
                border: 2.5px solid ${theme.navtexts};
                border-radius: 50%;
                padding: 1px 7px 1px 7px;
                margin-right: 12px;
                color: ${theme.navtexts};
                display: inline-block;
                font-size: 0.9em;
                font-weight: bold;
                position: relative;
                top: 0px;
              }
              .nopower-icon {
                width: 120px; 
                margin-left: 0px;
              }
              .offerformlabel {
                display: inline-block; 
                margin-left: 6px;
                font-weight: bold;
                font-size: 1em;
              }
            }
          `}
        </style>
        <Head>
          <title>WariHash</title>
        </Head>

        {this.checkNestedConfigs() &&
     configs[miningalgo.algorithm] !== undefined &&
     configs[miningalgo.algorithm][minerLocations[0].value] !== undefined ?
                     
        <div>
        <div className="container">
          <div className="row">
          <div className="col-sm-12 col-12 d-xl-none d-lg-none d-md-none d-sm-inline d-inline addpaddingleftmenu" 
             style={{paddingTop: "11.5px"}}>
               <br />
               <br />
            
             <a href="https://warihash.zendesk.com/hc/en-us/requests/new" 
             target="_blank"
             rel="noopener noreferrer">
               <button className="nav-buttons">
                 <p>Help</p>
                </button>
              </a>
             {" "}<p className="nav-bar">|</p>{" "} 
             <button className="nav-buttons"
             onClick={() => this.openOrderHistory()}>
               <p>My Order History</p>
             </button>
             </div>

             <div className="col-xl-7 col-lg-7 col-md-7 col-sm-12 col-12" > 
              {/******* MINING ALGORITHM SELECTOR *********/}
               <div className="miningalgo-selector-container addpaddingleft">
                  <h4 className="marketplacetitle">Buy Hashing Power for</h4>
                  <MiningAlgoDropDown 
                    selectAlgorithm={this.selectAlgorithm}
                    />
                </div>
                {/******* MINING ALGORITHM SELECTOR END *********/}
             </div>
             <div className="col-xl-5 col-lg-5 col-md-5 d-xl-inline d-lg-inline d-md-inline d-sm-none d-none" 
             style={{paddingTop: "11.5px", paddingLeft: "31px"}}>
               <br />
               <br />
               <br />
               <br />
             <a href="https://warihash.zendesk.com/hc/en-us/requests/new" 
             target="_blank"
             rel="noopener noreferrer"
             style={{ marginLeft: "14px" }}>
               <button className="nav-buttons">
                 <p>Help</p>
                </button>
              </a>
             {" "}<p className="nav-bar">|</p>{" "} 
             <button className="nav-buttons"
             onClick={() => this.openOrderHistory()}>
               <p>My Order History</p>
             </button>
               <br />
             </div>

             <div className="col-xl-12 col-lg-12 col-md-12 d-xl-inline d-lg-inline d-md-inline d-sm-none d-none">
               <br />
             </div>

              </div>
            </div>
            


            <div className="container">
              <div className="row">
              { this.checkNestedAvailable() &&
                stats.available[miningalgo.algorithm].hashrate !== undefined &&
                stats.available[miningalgo.algorithm].hashrate === "0.0000" ||
                this.checkNestedConfigs() &&
                configs[miningalgo.algorithm]['NA East'] &&
                configs[miningalgo.algorithm]['NA East'][durationunit].hashrate_min === null &&
                configs[miningalgo.algorithm]['NA West'] &&
                configs[miningalgo.algorithm]['NA West'][durationunit].hashrate_min === null &&
                configs[miningalgo.algorithm]['EU West'] &&
                configs[miningalgo.algorithm]['EU West'][durationunit].hashrate_min === null 
                ? 
<div className="container">
<div className="row">
           <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12 text-center">
                <br /><br />
                <div className="container">
                   <div className="row">
                     <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12 text-center">
                       <img src="/static/power-off-icon-2.svg" 
                       className="nopower-icon" alt="Not available" />

                      </div>
                   </div>
                </div>
                <br />
                <br />
              <div>
              <p style={{fontWeight: "bold",
              fontSize: "0.85em"}}>Currently, no hashing power is available for this algorithm. Please check again later.
              <br /> You can still buy hashing power for different mining algorithms.</p>
           
              </div> 
           </div>
       </div>
</div> : 
            <div className="main-marketplace-form">
            <form
              className="formstyles"
              onSubmit={this.handleSubmit}
              autoComplete="off"
              id="buy-form"
            >
                  <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                    <div className="row formcontainer-price">
                  
                  <div className="col-xl-4 col-lg-12 col-md-12 col-sm-12 col-12" 
                  style={{paddingLeft: "0px", paddingRight: "0px"}}>
                      
                      <div className="form-group">
                      <label htmlFor="location" className="inputlabel">
                        Miner Location:
                      </label><br />
                      <select
                            className="form-control selectstyles miningalgoselect"
                            name="location"
                            onChange={this.selectLocation}
                            style={{height: "42px", width: "285px", borderRadius: "3px"}}
                            value={this.checkNestedConfigs() &&
                              configs[miningalgo.algorithm] !== undefined &&
                              configs[miningalgo.algorithm][minerLocations[0].value] !== undefined ? 
                              location : ""}
                          >
                     {this.checkNestedConfigs() &&
      configs[miningalgo.algorithm] !== undefined &&
      configs[miningalgo.algorithm][minerLocations[0].value] !== undefined ?
                     availableRegions : <option className="selectstyles" selected>Loading ...</option>}  
                          </select>
                          </div>
                          </div>

                      <div className="col-xl-4 col-lg-12 col-md-12 col-sm-12 col-12" 
                      style={{paddingLeft: "0px", paddingRight: "0px"}}>
                        <div className="row">
                        <div className="col-xl-12 col-lg-12">
                        <div className="form-group">
                        <label htmlFor="duration" className="inputlabel">
                        Order Duration:
                        </label>
                        <div>
                        <div style={{display: "inline-block", paddingTop: "0px", paddingBottom: "0px", maxHeight: "43.65px"}}>
                        <div
                          className={
                            durationfocus === true
                              ? "input-group input-group-md focused"
                              : "input-group input-group-md"
                          }
                          style={{maxWidth: "170px", maxHeight: "60px", marginRight: "10px"}}
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
                              <FaRegClock style={durationfocus === true ? 
                                { fontSize: "1.26em", opacity: "1" } : 
                                { fontSize: "1.26em", opacity: "0.8" }} />
                            </span>
                          </div>
                          <input
                            type="text"
                            name="duration"
                            value={durationClicked === false ? "" : duration}
                            placeholder={durationClicked === false ? 
                              `Example: ${duration_example}` : duration}
                            className="form-control inputstyles2"
                            style={{
                              border: "none",
                              borderRadius: "7px",
                              fontSize: "0.82em"
                            }}
                            onChange={event => this.setState({duration: event.target.value.replace(/\D/,'')})}
                            onFocus={this.handleDurationFocus}
                            onBlur={this.handleDurationBlur}
                            autoComplete="off"
                            required
                          />
                       <br />
                        </div>
                        
                          </div>
                          <select
                            className={internetExplorer === true ? 
                              "form-control selectstyles unitselectie" : 
                              "form-control selectstyles unitselectstyles"}
                            name="durationunit"
                            onChange={this.selectDurationUnit}
                            value={durationunit}
                          >
                            <option className="selectstyles" value="hour">
                              {duration > 1 ? "Hours" : "Hour"}
                            </option>
                            <option className="selectstyles" value="day">
                              {duration > 1 ? "Days" : "Day"}
                            </option>
                          </select>
                          </div>
                        

                  {errors.duration !== undefined ? 
                  <p className="is-invalid-error add-padding-left">{errors.duration}</p> : null}
                 
                 {duration === undefined && 
                  duration !== "" && 
                  durationunit === "hour" &&
                  this.checkNestedConfigs() && 
                  parseInt(duration * 60) > (configs[miningalgo.algorithm] || {})[location][durationunit].duration_max ? 
                  <p className="is-invalid-error add-padding-left">
                    Your duration exceeds the maximum duration. Please decrease your duration input value. 
                  </p> : null}

                  {duration === undefined && 
                  duration !== "" && 
                  durationunit === "day" &&
                  this.checkNestedConfigs() && 
                  parseInt(duration * 1440) > (configs[miningalgo.algorithm] || {})[location][durationunit].duration_max ? 
                  <p className="is-invalid-error add-padding-left">
                    Your duration exceeds the maximum duration. Please decrease your duration input value. 
                  </p> : null}

                  {errors.duration === undefined && 
                  duration !== "" && 
                  durationfocus === false &&
                  durationunit === "hour" &&
                  this.checkNestedConfigs() && 
                  parseInt(duration * 60) < (configs[miningalgo.algorithm] || {})[location][durationunit].duration_min ? 
                  <p className="is-invalid-error add-padding-left">
                    The minimum duration you can purchase is {configs &&
                    configs[miningalgo.algorithm] && 
                    (configs[miningalgo.algorithm] || {})[location][durationunit].duration_min / 60 + " hours"}. 
                    Please increase your duration input value. 
                  </p> : null}

                  {errors.duration === undefined && 
                  duration !== "" && 
                  durationfocus === false &&
                  durationunit === "day" &&
                  this.checkNestedConfigs() && 
                  parseInt(duration * 1440) < (configs[miningalgo.algorithm] || {})[location][durationunit].duration_min ? 
                  <p className="is-invalid-error add-padding-left">
                    The minimum duration you can purchase is {configs &&
                    configs[miningalgo.algorithm] && 
                    (configs[miningalgo.algorithm] || {})[location][durationunit].duration_min / 1440 + " days"}. 
                    Please increase your duration input value. 
                  </p> : null}

                  {this.maxDurationCheck() &&
                  this.safeNestedCheck(() => configs[miningalgo.algorithm][location][durationunit].hashrate_min) === null ||
                  this.minDurationCheck() &&
                  this.safeNestedCheck(() => configs[miningalgo.algorithm][location][durationunit].hashrate_max) === null
                  ? 
                  <p className="is-invalid-error add-padding-left">
                   Selected duration is not available. Please change your duration.
                  </p> : null}
                         
                      </div>

                      <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12"
                      style={{paddingLeft: "0px", paddingRight: "0px", paddingTop: "0px"}}
                      >
                      <p
                      style={{
                        fontSize: "0.7em",
                        color: "rgba(0,0,0,0.6)",
                        marginLeft: "5px"
                      }}
                    >
                   <span className="min-value">Minimum duration:{" "}
                    {durationunit === "hour" && 
                     this.checkNestedConfigs() && 
                    this.safeNestedCheck(() => (configs[miningalgo.algorithm] || {})[location][durationunit].hashrate_min) === null ? "25 hours" :
                    durationunit === "hour" && 
                    parseInt((configs[miningalgo.algorithm] || {})[location][durationunit].duration_min / 60) + " hours"}
                    {durationunit === "day" && 
                     this.checkNestedConfigs() && 
                    this.safeNestedCheck(() => (configs[miningalgo.algorithm] || {})[location][durationunit].hashrate_min) === null ? "1 day" :
                    durationunit === "day" && 
                    parseInt((configs[miningalgo.algorithm] || {})[location][durationunit].duration_min / 1440) + " days"}
                    </span>
                    <br />
                    <span className="max-value">Maximum duration:{" "}
                    {durationunit === "hour" && 
                    this.checkNestedConfigs() && 
                    this.safeNestedCheck(() => (configs[miningalgo.algorithm] || {})[location][durationunit].hashrate_min) === null ? "24 hours" :
                     this.checkNestedConfigs() &&
                     durationunit === "hour" && 
                     parseInt(configs[miningalgo.algorithm][location][durationunit].duration_max / 60) + " hours" }

                    {durationunit === "day" && 
                    this.checkNestedConfigs() && 
                    this.safeNestedCheck(() => (configs[miningalgo.algorithm] || {})[location][durationunit].hashrate_min) === null ? "1 day" :
                     this.checkNestedConfigs() &&
                     durationunit === "day" && 
                     parseInt(configs[miningalgo.algorithm][location][durationunit].duration_max / 1440) + " days" }
                    </span>
                      </p> 
                      </div>
                        </div>
                        </div>
                      </div>

                      <div className="col-xl-4 col-lg-12 col-md-12 col-sm-12 col-12">
                      <div className="row">
                      <div className="form-group">
                        <label htmlFor="hashrate" className="inputlabel">
                         Hashrate to Purchase:
                        </label>
                        <div
                          className={
                            hashratefocus === true
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
                              <TiFlash style={hashratefocus === true ? 
                              { fontSize: "1.4em", opacity: "1" } : 
                              { fontSize: "1.4em", opacity: "0.8" }} />
                            </span>
                          </div>
                          <input
                            type="text"
                            name="hashrate"
                            value={hashrate}
                            placeholder={this.checkNestedConfigs() &&
                              configs[miningalgo.algorithm] !== undefined &&
                              configs[miningalgo.algorithm][minerLocations[0].value] !== undefined ?
                              hashrateExampleText : "Loading..."
                            }
                            className="form-control inputstyles2"
                            style={{
                              border: "none",
                              borderRadius: "7px",
                              fontSize: "0.82em"
                            }}
                            onChange={event => this.setState({hashrate: event.target.value.replace(/\D/,'')})}
                            onFocus={this.handleHashrateFocus}
                            onBlur={this.handleHashrateBlur}
                            autoComplete="off"
                            required
                          />   <p style={{paddingTop: "0px", 
                          paddingBottom: "0px", 
                          marginBottom: "0px",
                          position: "relative",
                          fontSize: "0.92em",
                          top: "5.9px",
                          right: "13px", 
                          zIndex: "222"}}>
                           {this.checkNestedConfigs() &&
                            configs[miningalgo.algorithm] !== undefined &&
                            configs[miningalgo.algorithm][minerLocations[0].value] !== undefined ?
                            this.safeNestedCheck(() => configs[miningalgo.algorithm].hashrate_units) + "H/s" : ""}
                          </p>
                          <br />
                        </div>
                      

{errors.hashrate !== undefined ? 
<p className="is-invalid-error add-padding-left">{errors.hashrate}</p> : null}

{errors.hashrate === undefined && 
  this.state.hashrate !== "" &&
  hashratefocus === false &&
  this.minDurationCheck() &&
  this.checkNestedConfigs() &&
  this.safeNestedCheck(() => configs[miningalgo.algorithm][location][durationunit].hashrate_max) !==
  this.safeNestedCheck(() => configs[miningalgo.algorithm][location][durationunit].hashrate_min) &&
  parseFloat(this.state.hashrate) > parseFloat(configs[miningalgo.algorithm][location][durationunit].hashrate_max) ? 
  <p className="is-invalid-error add-padding-left">
    The maximum hashrate you can purchase is {this.safeNestedCheck(() => configs[miningalgo.algorithm][location][durationunit].hashrate_max)}{" "}
    {this.safeNestedCheck(() => configs[miningalgo.algorithm].hashrate_units)}H/s. 
  Please decrease your hashrate input value.</p>
   : null}

{errors.hashrate === undefined && 
  this.state.hashrate !== "" &&
  this.maxDurationCheck() &&
  this.checkNestedConfigs() &&
  this.safeNestedCheck(() => configs[miningalgo.algorithm][location][durationunit].hashrate_max) !==
  this.safeNestedCheck(() => configs[miningalgo.algorithm][location][durationunit].hashrate_min) &&
  parseFloat(this.state.hashrate) > parseFloat(configs[miningalgo.algorithm][location][durationunit].hashrate_max) ? 
  <p className="is-invalid-error add-padding-left">
    The maximum hashrate you can purchase is {this.safeNestedCheck(() => configs[miningalgo.algorithm][location][durationunit].hashrate_max)}{" "}
     {this.safeNestedCheck(() => configs[miningalgo.algorithm].hashrate_units)}H/s. 
  Please decrease your hashrate input value.</p>
   : null}


{errors.hashrate === undefined && 
  this.state.hashrate !== "" &&
  this.minDurationCheck() &&
  hashratefocus === false &&
  this.checkNestedConfigs() &&
  this.safeNestedCheck(() => configs[miningalgo.algorithm][location][durationunit].hashrate_max) !==
  this.safeNestedCheck(() => configs[miningalgo.algorithm][location][durationunit].hashrate_min) &&
  parseFloat(this.state.hashrate) < parseFloat(configs[miningalgo.algorithm][location][durationunit].hashrate_min) ? 
  <p className="is-invalid-error add-padding-left">
    The minimum hashrate you can purchase is {this.safeNestedCheck(() => configs[miningalgo.algorithm][location][durationunit].hashrate_min)}{" "}
    {this.safeNestedCheck(() => configs[miningalgo.algorithm].hashrate_units)}H/s.
    Please increase your hashrate input value.
  </p>
   : null}                       
                 
{errors.hashrate === undefined && 
  hashrate !== "" &&
  this.maxDurationCheck() &&
  hashratefocus === false &&
  this.safeNestedCheck(() => configs[miningalgo.algorithm][location][durationunit].hashrate_max) !==
  this.safeNestedCheck(() => configs[miningalgo.algorithm][location][durationunit].hashrate_min) &&
  parseFloat(hashrate) < parseFloat(configs[miningalgo.algorithm][location][durationunit].hashrate_min) ? 
  <p className="is-invalid-error add-padding-left">
    The minimum hashrate you can purchase is {this.safeNestedCheck(() => configs[miningalgo.algorithm][location][durationunit].hashrate_min)}{" "}
   {this.safeNestedCheck(() => configs[miningalgo.algorithm].hashrate_units)}H/s.
    Please increase your hashrate input value.
  </p> : null}                               


                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12"
                      style={{paddingLeft: "0px", paddingRight: "0px", paddingTop: "0px", marginTop: "16px"}}
                      >
                      <p style={{
                        fontSize: "0.7em",
                        color: "rgba(0,0,0,0.6)",
                        marginLeft: "5px"
                      }}>
                   <span className="min-value">Minimum hashrate:{" "}{
                    this.checkNestedConfigs() &&
                    this.checkDurationBelowDay() ?
                    this.safeNestedCheck(() => configs[miningalgo.algorithm][location][durationunit].hashrate_min) !== null &&
                    this.safeNestedCheck(() => configs[miningalgo.algorithm][location][durationunit].hashrate_min) 
                   : 
                   this.safeNestedCheck(() => configs[miningalgo.algorithm][location][durationunit].hashrate_min) !== null &&
                   this.safeNestedCheck(() => configs[miningalgo.algorithm][location][durationunit].hashrate_min)
                   } 
                   {" "}{this.safeNestedCheck(() => configs[miningalgo.algorithm].hashrate_units)}H/s</span>
                    <br />
                    <span className="max-value">Maximum hashrate:{" "}{
                      this.checkNestedConfigs() && 
                      this.checkDurationBelowDay() ?
                      
                     this.safeNestedCheck(() => configs[miningalgo.algorithm][location][durationunit].hashrate_max) !== null &&
                     this.safeNestedCheck(() => configs[miningalgo.algorithm][location][durationunit].hashrate_max)
                    :
                     this.safeNestedCheck(() => configs[miningalgo.algorithm][location][durationunit].hashrate_max) !== null &&
                     this.safeNestedCheck(() => configs[miningalgo.algorithm][location][durationunit].hashrate_max)
                    }{" "}{this.safeNestedCheck(() => configs[miningalgo.algorithm].hashrate_units)}H/s</span>
                      </p> 
                   
                      </div>

                    </div>
                        </div>
                        </div>

                      <div>
                    </div>


                    </div>
                  </div>
                  
             <div className="clearfix" />
        
                
        <div className="container-fluid">
          <div className="row refund-address-container">
          
                <div className="offset-xl-6 col-xl-6 col-lg-12 col-md-12 col-sm-12 col-12" 
                style={{paddingRight: "0px"}}>
                  <div className="form-group" 
                  style={{paddingRight: "0px"}}>
                    <label htmlFor="refund_address" className="inputlabel">
                      Bitcoin Refund Address:
                    </label>
                    <div
                      className={
                        refundaddressfocus === true
                          ? "input-group input-group-md focused"
                          : "input-group input-group-md"
                      }
                      style={{maxWidth: "400px"}}
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
                          <FaWallet style={refundaddressfocus === true ?
                           { fontSize: "1.3em", opacity: "1" } : 
                           { fontSize: "1.3em", opacity: "0.8" }} />
                        </span>
                      </div>
                      <input
                        type="text"
                        placeholder="Example: 1BvBMSAYstWetqTQn5Au4t4GZg5xJaNVN4"
                        name="refund_address"
                        value={refund_address}
                        onChange={this.handleChange}
                        className="form-control inputstyles2"
                        style={{
                          border: "none",
                          borderRadius: "7px",
                          fontSize: "0.82em"
                        }}
                        onFocus={this.handleRefundFocus}
                        onBlur={this.handleRefundBlur}
                        autoComplete="off"
                        required
                      />
                    </div>

                    {errors.refund_address !== undefined ? <p className="is-invalid-error add-padding-left">
                      {errors.refund_address}</p> : null}
                  </div>
                
         
                </div>
                        
                       
              

      <div className="col-xl-12 col-lg-12 col-md-12 col-12" 
          style={{ paddingRight: "0px", paddingLeft: "0px" }}>

          <div className="container">
              <div className="row">
              <div className="specify-limit offset-xl-2 col-xl-10 col-lg-12 col-md-12 col-sm-12 col-12 text-xl-right text-lg-left text-md-left text-left"
              style={{marginBottom: "25px"}}>
                   <label>
                      <a href="https://warihash.zendesk.com/hc/en-us/articles/360040612232-What-is-a-limit-price-" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="link-icon">
                        <FaQuestionCircle />
                      </a>
                        <span style={{
                            fontSize: "0.83em",
                            marginLeft: "0px",
                            marginRight: "10px",
                            position: "relative",
                            top: "-1.2px",
                            zIndex: "1423",
                            display: "inline-block"
                          }}
                        >
                         Specify limit price
                        </span>
                       
                      </label>

                  <div className="pretty p-svg p-curve" style={{position: "relative", top: "1.5px"}}>
                    <input
                      type="checkbox"
                      onChange={this.handleCheck}
                      defaultChecked={checked}
                    />
                    <div className="state p-success">
                      <label>
                        <span
                          style={{
                            fontSize: "0.83em",
                            marginLeft: "7px",
                            position: "relative",
                            top: "0px",
                            zIndex: "1423"
                          }}
                        >
                        </span>
                      </label>
                      <svg className="svg svg-icon" viewBox="0 0 20 20" >
                        <path
                          d="M7.629,14.566c0.125,0.125,0.291,0.188,0.456,0.188c0.164,0,0.329-0.062,0.456-0.188l8.219-8.221c0.252-0.252,0.252-0.659,0-0.911c-0.252-0.252-0.659-0.252-0.911,0l-7.764,7.763L4.152,9.267c-0.252-0.251-0.66-0.251-0.911,0c-0.252,0.252-0.252,0.66,0,0.911L7.629,14.566z"
                          style={{ stroke: "white", fill: "white" }}
                        />
                      </svg>
                    </div>
                  </div>

                  {checked === true ? 
              <div className="container-fluid">
                <div className="offset-xl-8 col-xl-4 limit-price-container">
                <div className="text-xl-right text-lg-left text-md-left text-left">
                  <div className="form-group">
                    <label htmlFor="limit_price" 
                    className="inputlabel limitpricelabel"
                    style={{ position: "relative" }}>
                      Limit Price in <PaymentRate />
                    </label>
                    <div
                      className={
                        pricefocus === true
                          ? "input-group input-group-md limitinput focused"
                          : "input-group input-group-md limitinput"
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
                        name="limit_price"
                        value={limit_price}
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
                      /><p style={{paddingTop: "0px", 
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

                        {errors.price !== undefined ? 
                        <p className="is-invalid-error add-padding-left">
                          {errors.price}
                        </p> : null}
                  </div>
                  </div>
                  </div>
                  </div> : null}


                    </div>

      <div className="offset-xl-5 col-xl-6 col-lg-12 col-md-12 col-12 text-xl-left text-lg-left text-md-left text-left estimate-container">
        <div className="extrapadding">
          <div className="container-fluid estimate-containerdiv" style={{paddingLeft: "0px", paddingRight: "0px"}}>
          <div className="bordertop"></div>
            <div className="row rowpaddings">
              <div className="col-xl-5 col-lg-5 col-md-5 col-sm-5 col-5" 
                style={{paddingLeft: "3px", paddingRight: "0px"}}>
                    <div className="iconcontainers">
                      <FaBitcoin style={{
                        display: "inline-block",
                        fontSize: "1.18em",
                        opacity: "1",
                        color: "black",
                        marginRight: "16px",
                        marginLeft: "2px"
                      }} />
                      </div>
                        <h6 style={{ display: "inline-block", fontSize: "0.78em" }}>
                          Estimated Cost:
                          </h6>{" "}
                      </div>
                      <div className="col-xl-7 col-lg-6 col-md-6 col-sm-7 col-7 text-left">
                      <h6 style={{ display: "inline-block", fontSize: "0.78em" }}>
                        {estimate.price === undefined ? "- - - - - - - " : estimate.price.total_payment_amount} BTC</h6>
                      </div>


                            <div className="col-xl-5 col-lg-6 col-md-6 col-sm-5 col-5" 
                            style={{paddingLeft: "3px", paddingRight: "0px"}}>
                                <div className="iconcontainers">
                            <FaBitcoin style={{
                              display: "inline-block",
                              fontSize: "1.18em",
                              opacity: "0",
                              marginRight: "16px",
                              marginLeft: "2px"
                            }} /> 
                            </div>
                              <h6 style={{ display: "inline-block", fontSize: "0.78em" }}>
                              Estimated Rate:
                               </h6>{" "}
                            </div>
                            <div className="col-xl-7 col-lg-7 col-md-7 col-sm-7 col-7 text-left">
                              <h6 style={{ display: "inline-block", fontSize: "0.78em" }}>
                              {estimate.price === undefined ? "- - - - - - - " : estimate.price.average_price} <BTCPaymentRate />
                              </h6>
                            </div>

                           <div className="col-xl-12 col-lg-12 col-md-12 col-12">
                           <p style={{ fontSize: "0.73em", opacity: "0.7", marginTop: "7px"}}>
                      Estimate is based on latest available rate. May change when continuing to payment.
                      </p>
                           </div>
                        </div>
                      </div>
                     
                     
                    </div>     
                         
                    <CSRFToken />
                    <div style={{width: "100%", textAlign: "right"}}>
                       <button
                        disabled={formloading}
                        className="btn btn-info nooutline buybtn"
                        type="submit"
                        style={{position: "relative", left: "0px"}}
                      >
                        {formloading === true
                          ? <ThreeDotsLoading />
                          : <p style={{ paddingBottom: "0px", marginBottom: "0px" }}>Continue to Payment</p>}
                      </button>
                      </div>

                      <div className="text-center"
                            style={{ paddingTop: "25px", paddingBottom: "0px" }}>

                           {time.message !== null ? 
                           <p className="is-invalid-error add-padding-left">{time.message}</p> : null}
                           
                           {networkerror !== "" ? 
                           <p className="is-invalid-error add-padding-left">{networkerror}</p> : null}
                           {errors.errors !== null &&
                           errors !== undefined &&
                           payment.bid_id === undefined &&
                           networkerror === "" &&
                                fielderrors != "hashrate" &&
                                fielderrors != "duration" &&
                                fielderrors != "username" &&
                                fielderrors != "password" &&
                                fielderrors != "discount_code" &&
                                fielderrors != "price" &&
                               errors.host === undefined &&
                               errors.port === undefined 
                                ? <p className="is-invalid-error add-padding-left">
                               {fielderrorsReason} </p>
                                : null}
                          </div>
                          <br />
                          <br />    


                            </div>

                          </div>


                           
                           

                            </div>
                           </div>


                        </div>
                      </div>

                    


                        </form> 
            </div>   }
          </div>
         </div> 
         


         </div> : 
         
         <div 
         style={{width: "100vw", height: "100vh", 
         textAlign: "center", position: "absolute", 
         top: "0"}}>
            <img
              src="/static/spinner.gif"
              style={{
                width: "170px",
                margin: "0 auto",
                marginTop: "12%",
                paddingBottom: "20px",
                display: "block",
                opacity: "0.6"
              }}
              alt="Loading..."
            />
            <h6>Loading ...</h6>
         </div>
        }   
      </PublicRoute>
    );
  }
}

Marketplace.defaultProps = {
  network: [],
  configs: [],
  errors: {},
  profile: []
};

Marketplace.propTypes = {
  takeOffer: PropTypes.func,
  resetErrors: PropTypes.func,
  marketplacePage: PropTypes.func,
  getConfigs: PropTypes.func,
  getEstimate: PropTypes.func,
  clearNetwork: PropTypes.func,
  clearAlert: PropTypes.func,
  formSubmission: PropTypes.func,
  enableNavigation: PropTypes.func,
  timeoutError: PropTypes.func,
  timeoutReset: PropTypes.func,
  algoSelect: PropTypes.func,
  setStratumHostPort: PropTypes.func,
  setStratumUsernamePass: PropTypes.func,
  setRecentInvoiceId: PropTypes.func,
  setThemeColors: PropTypes.func,
  setToken: PropTypes.func,
  setSubUser: PropTypes.func,
  errors: PropTypes.object,
  configs: PropTypes.object,
  estimate: PropTypes.object,
  network: PropTypes.object,
  miningalgo: PropTypes.object,
  form: PropTypes.object,
  time: PropTypes.object,
  profile: PropTypes.object,
  stats: PropTypes.object,
  payment: PropTypes.object,
  settings: PropTypes.object,
  theme: PropTypes.object,
  token: PropTypes.object,
  subuser: PropTypes.object
};

const mapStateToProps = state => ({
  errors: state.errors,
  configs: state.configs,
  network: state.network,
  miningalgo: state.miningalgo,
  estimate: state.estimate,
  form: state.form,
  time: state.time,
  profile: state.profile,
  stats: state.stats,
  payment: state.payment,
  settings: state.settings,
  theme: state.theme,
  token: state.token,
  subuser: state.subuser
});

export default connect(
  mapStateToProps,
  {
    takeOffer,
    clearNetwork,
    clearAlert,
    getConfigs,
    getEstimate,
    marketplacePage,
    resetErrors,
    formSubmission,
    enableNavigation,
    timeoutError,
    timeoutReset,
    algoSelect,
    setStratumHostPort,
    setStratumUsernamePass,
    setRecentInvoiceId,
    setThemeColors,
    setToken,
    setSubUser
  }
)(Marketplace);
