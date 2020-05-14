import React from "react";
import PublicRoute from "../components/routes/PublicRoute";
import { connect } from "react-redux";
import {
  resetErrors,
  takeOffer,
  clearNetwork,
  clearAlert,
  getConfigs,
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
  setToken } from "../actions/warihashApiCalls";
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

    // select algorithm
    if ( this.props.algorithm !== undefined && algorithms.includes(this.props.algorithm) === true ) {
      this.selectAlgorithm(this.props.algorithm);
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
        if (this.safeNestedCheck(() => (this.props.configs[this.props.miningalgo.algorithm] || {})[this.state.location].min_order_hashrate[0].min) === null) {
          this.setState({ duration: 25, duration_example: 25 });
        };
        if (this.safeNestedCheck(() => (this.props.configs[this.props.miningalgo.algorithm] || {})[this.state.location].min_order_hashrate[0].min) !== null){
          this.setState({ duration:  parseInt(this.safeNestedCheck(() => this.props.configs[this.props.miningalgo.algorithm].min_order_duration_min) / 60), 
            duration_example: parseInt(this.safeNestedCheck(() => this.props.configs[this.props.miningalgo.algorithm].min_order_duration_min) / 60) });
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
  handleHashrateBlur = () => this.setState({ hashratefocus: false });
  handleDurationFocus = () => this.setState({ durationfocus: true, durationClicked: true });
  handleDurationBlur = () => this.setState({ durationfocus: false });
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
    const durationInMinutes = this.state.duration * 60;
    this.setState({ formloading: true });
    NProgress.start();
    this.props.resetErrors();
    this.props.formSubmission();
    this.props.timeoutReset();
    this.props.takeOffer(
      this.state.hashrate,
      this.state.hashrate_units,
      this.props.miningalgo.algorithm,
      durationInMinutes,
      this.props.settings.host,
      this.props.settings.port,
      this.props.settings.username,
      this.props.settings.password,
      this.state.location,
      this.state.limit_price,
      this.state.refund_address,
      this.props.settings.sub_user,
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
      const firstAvailableLocation = locations.find(location => this.safeNestedCheck(() => this.props.configs[algorithm_name][location.value].min_order_hashrate[0].min) !== null ||
      this.safeNestedCheck(() => this.props.configs[algorithm_name][location.value].min_order_hashrate[1].min) !== null );
      if (firstAvailableLocation !== undefined) {
        this.setState({ location: firstAvailableLocation.value });
        if (this.safeNestedCheck(() => (this.props.configs[algorithm_name] || {})[firstAvailableLocation.value].min_order_hashrate[0].min) === null) {
          this.setState({ duration: 25, duration_example: 25 });
        } else { 
          this.setState({ duration: parseInt(this.safeNestedCheck(() => this.props.configs[algorithm_name].min_order_duration_min) / 60), 
            duration_example: parseInt(this.safeNestedCheck(() => this.props.configs[algorithm_name].min_order_duration_min) / 60) });
        };
      };
      if (firstAvailableLocation === undefined) {
        this.setState({ location: "NA East" });
      };
    };

    handleUnitSelect = event => this.setState({ hashrate_units_fiat: event.target.value });

    selectLocation = event => {
      this.setState({ location: event.target.value });
      if (this.safeNestedCheck(() => (this.props.configs[this.props.miningalgo.algorithm] || {})[event.target.value].min_order_hashrate[0].min) === null) {
        this.setState({ duration: 25, duration_example: 25 });
      } else { 
        this.setState({ duration: parseInt(this.safeNestedCheck(() => this.props.configs[this.props.miningalgo.algorithm].min_order_duration_min) / 60), 
          duration_example: parseInt(this.safeNestedCheck(() => this.props.configs[this.props.miningalgo.algorithm].min_order_duration_min) / 60) });
      };
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

    openOrderHistoryPage = () => Router.pushRoute(`/orderhistory`);
    handlePriceFocus = () => this.setState({ pricefocus: true });
    handlePriceBlur = () => this.setState({ pricefocus: false });

  render() {
    const {
      hashratefocus,
      durationfocus,
      durationClicked,
      pricefocus,
      refundaddressfocus
    } = this.state;
    let hashrateExampleText = "";
    
    if (this.checkDurationBelowDay() && 
      this.checkNestedConfigs() &&
      this.props.configs[this.props.miningalgo.algorithm][this.state.location] &&
      this.props.configs[this.props.miningalgo.algorithm][this.state.location].min_order_hashrate[0].min !== null 
    ) {
      hashrateExampleText = `Example: ${
        this.checkNestedConfigs() &&
        this.props.configs[this.props.miningalgo.algorithm][this.state.location].min_order_hashrate[0] &&
        this.props.configs[this.props.miningalgo.algorithm][this.state.location].min_order_hashrate[0].min}`;
   
    } else if (this.maxDurationCheck() && 
    this.checkNestedConfigs() &&
    this.props.configs[this.props.miningalgo.algorithm][this.state.location].min_order_hashrate[1].min !== null 
    ) {
      hashrateExampleText = `Example: ${this.checkNestedConfigs() &&
        this.props.configs[this.props.miningalgo.algorithm][this.state.location].min_order_hashrate[1] && 
        this.props.configs[this.props.miningalgo.algorithm][this.state.location].min_order_hashrate[1].min}`;
 
    } else if (this.checkDurationBelowDay() && 
    this.checkNestedConfigs() &&
    this.props.configs[this.props.miningalgo.algorithm][this.state.location] &&
    this.props.configs[this.props.miningalgo.algorithm][this.state.location].min_order_hashrate[0].min === null 
    ) {
      hashrateExampleText = "Not available";
    } else if (this.maxDurationCheck() && 
    this.checkNestedConfigs() &&
    this.props.configs[this.props.miningalgo.algorithm][this.state.location].min_order_hashrate[1].min === null
    ) {
      hashrateExampleText = "Not available";
    };

    const availableRegions = minerLocations.map(location => { 
      if (this.checkNestedConfigs() &&
      this.props.configs[this.props.miningalgo.algorithm] !== undefined &&
      this.props.configs[this.props.miningalgo.algorithm][location.value] !== undefined) 
        return (
        <option className={
          this.props.configs[this.props.miningalgo.algorithm][location.value].min_order_hashrate[0].min !== null ||
        this.props.configs[this.props.miningalgo.algorithm][location.value].min_order_hashrate[1].min !== null ?
          "selectstyles" : "hidethis"} 
          key={location.value} 
          value={location.value}
          disabled={this.props.configs[this.props.miningalgo.algorithm][location.value].min_order_hashrate[0].min === null &&
            this.props.configs[this.props.miningalgo.algorithm][location.value].min_order_hashrate[1].min === null}
          >
          {location.name}
          </option>
        )
      } 
    );

    const fielderrors = Object.keys(this.props.errors);
    const fielderrorsReason = this.props.errors[fielderrors];

    return (
      <PublicRoute>
        <style jsx>
          {`

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
            left: 0px;
            top: 30px;
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
            border: 2.5px solid ${this.props.theme.navtexts};
            border-radius: 50%;
            padding: 1px 7px 1px 7px;
            color: ${this.props.theme.navtexts};
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
              background: ${this.props.theme.primary};
              border: 1px solid ${this.props.theme.primary};
              border-radius: 0px;
              width: 200px;
              height: 40px;
              margin-top: 17px;
              margin-bottom: 0px;
              color: ${this.props.theme.buttontexts};
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
              margin-top: 15px;
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
              left: 6px;
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
              margin-left: 2px; 
              padding-left: 0px; 
              position: relative; 
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


            @media (max-width: 770px) {
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
                margin-top: 10px;
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
                border: 2.5px solid ${this.props.theme.navtexts};
                border-radius: 50%;
                padding: 1px 7px 1px 7px;
                margin-right: 12px;
                color: ${this.props.theme.navtexts};
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
      this.props.configs[this.props.miningalgo.algorithm] !== undefined &&
      this.props.configs[this.props.miningalgo.algorithm][minerLocations[0].value] !== undefined ?
                     
        <div>
        <div className="container">
          <div className="row">
          <div className="col-sm-12 col-12 d-xl-none d-lg-none d-md-none d-sm-inline d-inline" 
             style={{paddingTop: "11.5px", paddingLeft: "37px"}}>
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
             onClick={() => this.openOrderHistoryPage()}>
               <p>My Order History</p>
             </button>
             </div>

             <div className="col-xl-7 col-lg-7 col-md-7 col-sm-12 col-12" style={{paddingLeft: "40px"}}> 
              {/******* MINING ALGORITHM SELECTOR *********/}
               <div className="miningalgo-selector-container">
                  <h4 className="marketplacetitle">Buy Hashing Power for</h4>
                  <MiningAlgoDropDown 
                    selectAlgorithm={this.selectAlgorithm}
                    />
                
                </div>
                {/******* MINING ALGORITHM SELECTOR END *********/}
             </div>
             <div className="col-xl-5 col-lg-5 col-md-5 d-xl-inline d-lg-inline d-md-inline d-sm-none d-none" 
             style={{paddingTop: "11.5px"}}>
               <br />
               <br />
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
             onClick={() => this.openOrderHistoryPage()}>
               <p>My Order History</p>
             </button>
               <br />
             </div>

             <div className="col-xl-12 col-lg-12 col-md-12 d-xl-inline d-lg-inline d-md-inline d-sm-none d-none">
               <br />
               <br />
             </div>

              </div>
            </div>
            


            <div className="container">
              <div className="row">
{ this.checkNestedAvailable() &&
  this.props.stats.available[this.props.miningalgo.algorithm].hashrate !== undefined &&
  this.props.stats.available[this.props.miningalgo.algorithm].hashrate === "0.0000" ||
  this.checkNestedConfigs() &&
  this.props.configs[this.props.miningalgo.algorithm]['NA East'] &&
  this.props.configs[this.props.miningalgo.algorithm]['NA East'].min_order_hashrate[0].min === null &&
  this.props.configs[this.props.miningalgo.algorithm]['NA East'].min_order_hashrate[1].min === null && 
  this.props.configs[this.props.miningalgo.algorithm]['NA West'] &&
  this.props.configs[this.props.miningalgo.algorithm]['NA West'].min_order_hashrate[0].min === null &&
  this.props.configs[this.props.miningalgo.algorithm]['NA West'].min_order_hashrate[1].min === null && 
  this.props.configs[this.props.miningalgo.algorithm]['EU West'] &&
  this.props.configs[this.props.miningalgo.algorithm]['EU West'].min_order_hashrate[0].min === null &&
  this.props.configs[this.props.miningalgo.algorithm]['EU West'].min_order_hashrate[1].min === null
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
                            style={{height: "42px", width: "285px"}}
                            value={this.checkNestedConfigs() &&
                              this.props.configs[this.props.miningalgo.algorithm] !== undefined &&
                              this.props.configs[this.props.miningalgo.algorithm][minerLocations[0].value] !== undefined ? 
                              this.state.location : ""}
                          >
                     {this.checkNestedConfigs() &&
      this.props.configs[this.props.miningalgo.algorithm] !== undefined &&
      this.props.configs[this.props.miningalgo.algorithm][minerLocations[0].value] !== undefined ?
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
                        <div
                          className={
                            durationfocus === true
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
                              <FaRegClock style={durationfocus === true ? 
                                { fontSize: "1.26em", opacity: "1" } : 
                                { fontSize: "1.26em", opacity: "0.8" }} />
                            </span>
                          </div>
                          <input
                            type="text"
                            name="duration"
                            value={durationClicked === false ? "" : this.state.duration}
                            placeholder={durationClicked === false ? 
                              `Example: ${this.state.duration_example}` : this.state.duration}
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
                          <p style={{paddingTop: "0px", 
                          paddingBottom: "0px", 
                          marginBottom: "0px",
                          position: "relative",
                          fontSize: "0.88em",
                          top: "6.2px",
                          right: "13px", 
                          zIndex: "2342342"}}>
                          Hours
                          </p>
                          <br />
                        </div>

                  {this.props.errors.duration !== undefined ? 
                  <p className="is-invalid-error add-padding-left">{this.props.errors.duration}</p> : null}
                  {this.props.errors.duration === undefined && 
                  this.state.duration !== "" && 
                  this.checkNestedConfigs() && 
                  parseInt(this.state.duration * 60) > (this.props.configs[this.props.miningalgo.algorithm] || {}).max_order_duration_min ? 
                  <p className="is-invalid-error add-padding-left">
                    Your duration exceeds the maximum duration. 
                    <br />Please decrease your duration input value. 
                  </p> : null}

                  {this.props.errors.duration === undefined && 
                  this.state.duration !== "" && 
                  durationfocus === false &&
                  this.checkNestedConfigs() && 
                  parseInt(this.state.duration * 60) < (this.props.configs[this.props.miningalgo.algorithm] || {}).min_order_duration_min ? 
                  <p className="is-invalid-error add-padding-left">
                    The minimum duration you can purchase is {this.props.configs &&
                    this.props.configs[this.props.miningalgo.algorithm] && 
                    (this.props.configs[this.props.miningalgo.algorithm] || {}).min_order_duration_min / 60 + " hours"}. 
                    <br />Please increase your duration input value. 
                  </p> : null}

                  {this.maxDurationCheck() &&
                  this.safeNestedCheck(() => this.props.configs[this.props.miningalgo.algorithm][this.state.location].min_order_hashrate[1].min) === null ||
                  this.minDurationCheck() &&
                  this.safeNestedCheck(() => this.props.configs[this.props.miningalgo.algorithm][this.state.location].min_order_hashrate[0].min) === null
                  ? 
                  <p className="is-invalid-error add-padding-left">
                   Selected duration is not available. 
                   <br />Please change your duration.
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
                    {this.checkNestedConfigs() && 
                    this.safeNestedCheck(() => (this.props.configs[this.props.miningalgo.algorithm] || {})[this.state.location].min_order_hashrate[0].min) === null ? "25 hours" :
                    parseInt((this.props.configs[this.props.miningalgo.algorithm] || {}).min_order_duration_min / 60) + " hours"}</span>
                    <br />
                    <span className="max-value">Maximum duration:{" "}
                    {this.checkNestedConfigs() && 
                    this.safeNestedCheck(() => (this.props.configs[this.props.miningalgo.algorithm] || {})[this.state.location].min_order_hashrate[1].min) === null ? "24 hours" :
                     this.checkNestedConfigs() &&
                     parseInt(this.props.configs[this.props.miningalgo.algorithm].max_order_duration_min / 60) + " hours" }
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
                            value={this.state.hashrate}
                            placeholder={this.checkNestedConfigs() &&
                              this.props.configs[this.props.miningalgo.algorithm] !== undefined &&
                              this.props.configs[this.props.miningalgo.algorithm][minerLocations[0].value] !== undefined ?
                              hashrateExampleText : "Loading..."
                            }
                            className="form-control inputstyles2"
                            style={{
                              border: "none",
                              borderRadius: "7px",
                              fontSize: "0.82em"
                            }}
                            onChange={this.handleChange}
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
                            this.props.configs[this.props.miningalgo.algorithm] !== undefined &&
                            this.props.configs[this.props.miningalgo.algorithm][minerLocations[0].value] !== undefined ?
                            this.safeNestedCheck(() => this.props.configs[this.props.miningalgo.algorithm].hashrate_units) + "H/s" : ""}
                          
                          </p>
                          <br />
                        </div>
                      

{this.props.errors.hashrate !== undefined ? 
<p className="is-invalid-error add-padding-left">{this.props.errors.hashrate}</p> : null}

{this.props.errors.hashrate === undefined && 
  this.state.hashrate !== "" &&
  hashratefocus === false &&
  this.minDurationCheck() &&
  this.checkNestedConfigs() &&
  this.safeNestedCheck(() => this.props.configs[this.props.miningalgo.algorithm][this.state.location].max_order_hashrate[0].max) !==
  this.safeNestedCheck(() => this.props.configs[this.props.miningalgo.algorithm][this.state.location].min_order_hashrate[0].min) &&
  parseFloat(this.state.hashrate) > parseFloat(this.props.configs[this.props.miningalgo.algorithm][this.state.location].max_order_hashrate[0].max) ? 
  <p className="is-invalid-error add-padding-left">
    The maximum hashrate you can purchase is {this.safeNestedCheck(() => this.props.configs[this.props.miningalgo.algorithm].max_order_hashrate[0].max)}{" "}
    {this.safeNestedCheck(() => this.props.configs[this.props.miningalgo.algorithm].hashrate_units)}H/s. 
  Please decrease your hashrate input value.</p>
   : null}

{this.props.errors.hashrate === undefined && 
  this.state.hashrate !== "" &&
  this.maxDurationCheck() &&
  this.checkNestedConfigs() &&
  this.safeNestedCheck(() => this.props.configs[this.props.miningalgo.algorithm][this.state.location].max_order_hashrate[1].max) !==
  this.safeNestedCheck(() => this.props.configs[this.props.miningalgo.algorithm][this.state.location].min_order_hashrate[1].min) &&
  parseFloat(this.state.hashrate) > parseFloat(this.props.configs[this.props.miningalgo.algorithm][this.state.location].max_order_hashrate[1].max) ? 
  <p className="is-invalid-error add-padding-left">
    The maximum hashrate you can purchase is {this.safeNestedCheck(() => this.props.configs[this.props.miningalgo.algorithm][this.state.location].max_order_hashrate[1].max)}{" "}
     {this.safeNestedCheck(() => this.props.configs[this.props.miningalgo.algorithm].hashrate_units)}H/s. 
  Please decrease your hashrate input value.</p>
   : null}


{this.props.errors.hashrate === undefined && 
  this.state.hashrate !== "" &&
  this.minDurationCheck() &&
  hashratefocus === false &&
  this.checkNestedConfigs() &&
  this.safeNestedCheck(() => this.props.configs[this.props.miningalgo.algorithm][this.state.location].max_order_hashrate[0].max) !==
  this.safeNestedCheck(() => this.props.configs[this.props.miningalgo.algorithm][this.state.location].min_order_hashrate[0].min) &&
  parseFloat(this.state.hashrate) < parseFloat(this.props.configs[this.props.miningalgo.algorithm][this.state.location].min_order_hashrate[0].min) ? 
  <p className="is-invalid-error add-padding-left">
    The minimum hashrate you can purchase is {this.safeNestedCheck(() => this.props.configs[this.props.miningalgo.algorithm][this.state.location].min_order_hashrate[0].min)}{" "}
    {this.safeNestedCheck(() => this.props.configs[this.props.miningalgo.algorithm].hashrate_units)}H/s.
    <br />Please increase your hashrate input value.
  </p>
   : null}                       
                 
{this.props.errors.hashrate === undefined && 
  this.state.hashrate !== "" &&
  this.maxDurationCheck() &&
  hashratefocus === false &&
  this.safeNestedCheck(() => this.props.configs[this.props.miningalgo.algorithm][this.state.location].max_order_hashrate[1].max) !==
  this.safeNestedCheck(() => this.props.configs[this.props.miningalgo.algorithm][this.state.location].min_order_hashrate[1].min) &&
  parseFloat(this.state.hashrate) < parseFloat(this.props.configs[this.props.miningalgo.algorithm][this.state.location].min_order_hashrate[1].min) ? 
  <p className="is-invalid-error add-padding-left">
    The minimum hashrate you can purchase is {this.safeNestedCheck(() => this.props.configs[this.props.miningalgo.algorithm][this.state.location].min_order_hashrate[1].min)}{" "}
   {this.safeNestedCheck(() => this.props.configs[this.props.miningalgo.algorithm].hashrate_units)}H/s.
   <br />Please increase your hashrate input value.
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
                    this.safeNestedCheck(() => this.props.configs[this.props.miningalgo.algorithm][this.state.location].min_order_hashrate[0].min) !== null &&
                    this.safeNestedCheck(() => this.props.configs[this.props.miningalgo.algorithm][this.state.location].min_order_hashrate[0].min) 
                   : 
                   this.safeNestedCheck(() => this.props.configs[this.props.miningalgo.algorithm][this.state.location].min_order_hashrate[1].min) !== null &&
                   this.safeNestedCheck(() => this.props.configs[this.props.miningalgo.algorithm][this.state.location].min_order_hashrate[1].min)
                   } 
                   {" "}{this.safeNestedCheck(() => this.props.configs[this.props.miningalgo.algorithm].hashrate_units)}H/s</span>
                   <br />
                    <span className="max-value">Maximum hashrate:{" "}{
                      this.checkNestedConfigs() && 
                      this.checkDurationBelowDay() ?
                      
                     this.safeNestedCheck(() => this.props.configs[this.props.miningalgo.algorithm][this.state.location].max_order_hashrate[0].max) !== null &&
                     this.safeNestedCheck(() => this.props.configs[this.props.miningalgo.algorithm][this.state.location].max_order_hashrate[0].max)
                    :
                     this.safeNestedCheck(() => this.props.configs[this.props.miningalgo.algorithm][this.state.location].max_order_hashrate[1].max) !== null &&
                     this.safeNestedCheck(() => this.props.configs[this.props.miningalgo.algorithm][this.state.location].max_order_hashrate[1].max)
                    }{" "}{this.safeNestedCheck(() => this.props.configs[this.props.miningalgo.algorithm].hashrate_units)}H/s</span>
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
                        <div className="row" style={{ paddingRight: "0px", paddingLeft: "0px", paddingTop: "0px" }}>
                        
                <div className="col-xl-5 col-lg-12 col-md-12 col-sm-12 col-12" 
                style={{paddingRight: "0px"}}>
                  <div className="form-group" style={{paddingRight: "0px"}}>
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
                        value={this.state.refund_address}
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

                    {this.props.errors.refund_address !== undefined ? <p className="is-invalid-error add-padding-left">
                      {this.props.errors.refund_address}</p> : null}
                  </div>
                
                <div className="desktop-br">
                  <br />
                 
                </div>
                <br />
                </div>
                        
                       
              
                  

                    

      <div className="col-xl-6 col-lg-12 col-md-12 col-12" 
          style={{ paddingRight: "0px", paddingLeft: "0px", paddingTop: "0px" }}>

          <div className="container-fluid">
              <div className="row">
              <div className="specify-limit col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12 text-xl-right text-lg-left text-md-left text-left">
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
                      defaultChecked={this.state.checked}
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

                  {this.state.checked === true ? 
                <div className="limit-price-container text-xl-right text-lg-left text-md-left text-left">
                  <div className="form-group">
                    <label htmlFor="limit_price" 
                    className="inputlabel"
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
                        value={this.state.limit_price}
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

                        {this.props.errors.price !== undefined ? 
                        <p className="is-invalid-error add-padding-left">
                          {this.props.errors.price}
                        </p> : null}
                  </div>
                  </div> : null}


                    </div>

      <div className="col-xl-6 col-lg-12 col-md-12 col-12 text-xl-right text-lg-left text-md-left text-left">
                            <CSRFToken />
                       <button
                        disabled={this.state.formloading}
                        className="btn btn-info nooutline buybtn"
                        type="submit"
                      >
                        {this.state.formloading === true
                          ? <ThreeDotsLoading />
                          : <p style={{ paddingBottom: "0px", marginBottom: "0px" }}>Continue to Payment</p>}

                      </button>



                      <div className="text-center"
                            style={{ paddingTop: "25px", paddingBottom: "0px" }}>

                           {this.props.time.message !== null ? 
                           <p className="is-invalid-error add-padding-left">{this.props.time.message}</p> : null}
                           
                           {this.state.networkerror !== "" ? 
                           <p className="is-invalid-error add-padding-left">{this.state.networkerror}</p> : null}
                           {this.props.errors.errors !== null &&
                           this.props.errors !== undefined &&
                           this.props.payment.bid_id === undefined &&
                           this.state.networkerror === "" &&
                                fielderrors != "hashrate" &&
                                fielderrors != "duration" &&
                                fielderrors != "username" &&
                                fielderrors != "password" &&
                                fielderrors != "discount_code" &&
                                fielderrors != "price" &&
                               this.props.errors.host === undefined &&
                               this.props.errors.port === undefined 
                                ? <p className="is-invalid-error add-padding-left">
                               {fielderrorsReason} </p>
                                : null}
                          </div>

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
  errors: PropTypes.object,
  configs: PropTypes.object,
  network: PropTypes.object,
  miningalgo: PropTypes.object,
  form: PropTypes.object,
  time: PropTypes.object,
  profile: PropTypes.object,
  stats: PropTypes.object,
  payment: PropTypes.object,
  settings: PropTypes.object,
  theme: PropTypes.object,
  token: PropTypes.object
};

const mapStateToProps = state => ({
  errors: state.errors,
  configs: state.configs,
  network: state.network,
  miningalgo: state.miningalgo,
  form: state.form,
  time: state.time,
  profile: state.profile,
  stats: state.stats,
  payment: state.payment,
  settings: state.settings,
  theme: state.theme,
  token: state.token
});

export default connect(
  mapStateToProps,
  {
    takeOffer,
    clearNetwork,
    clearAlert,
    getConfigs,
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
    setToken
  }
)(Marketplace);
