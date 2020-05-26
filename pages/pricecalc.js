import React, { Component } from 'react';
import PublicRoute from "../components/routes/PublicRoute";
import { connect } from "react-redux";
import {
  resetErrors,
  getEstimate,
  formSubmission,
  timeoutReset,
  enableNavigation } from "../actions/warihashApiCalls";
import {
  TIMEOUT_DURATION
} from "../utils/timeout-config";
import { FaWallet } from "react-icons/fa";
import ThreeDotsLoading from "../components/tools/ThreeDotsLoading";
import Head from "next/head";
import PropTypes from "prop-types";

class calculatorPage extends Component {
    constructor() {
        super();
        this.state = {
            duration: "",
            hashrate: "",
            hashrate_units: "",
            mining_algo: "",
            location: "",
            limit_price: ""
        }
    }

    render() {

        openOrderPage = () => Router.pushRoute(`/market/${this.props.settings.host}/${this.props.settings.port}/${this.props.settings.username}/${this.props.settings.password}/${this.props.miningalgo.algorithm}`);

        handleSubmit = event => {
          event.preventDefault();
          const durationInMinutes = this.state.duration * 60;
          this.setState({ formloading: true });
          NProgress.start();
          this.props.resetErrors();
          this.props.formSubmission();
          this.props.timeoutReset();
          this.props.getEstimate(
            this.state.duration,
            this.state.hashrate,
            this.state.hashrate_units,
            this.state.mining_algo,
            this.state.location,
            this.state.limit_price
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

        return (
            <PublicRoute>
                <Head>
                <title>WariHash</title>
                </Head>
      <div>
        <div className="container">
          <div className="row">
          <div className="col-sm-12 col-12 d-xl-none d-lg-none d-md-none d-sm-inline d-inline addpaddingleft" 
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
             onClick={() => this.openOrderPage()}>
               <p>Place an Order</p>
             </button>
             </div>

             <div className="col-xl-7 col-lg-7 col-md-7 col-sm-12 col-12" > 
              {/******* MINING ALGORITHM SELECTOR *********/}
               <div className="miningalgo-selector-container addpaddingleft">
                  <h4 className="marketplacetitle">Price Estimate Calculator for </h4>
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
             onClick={() => this.openOrderPage()}>
               <p>Place an Order</p>
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
                              <FaWallet style={durationfocus === true ? 
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
                              <FaWallet style={hashratefocus === true ? 
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
                      
                     


                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12"
                      style={{paddingLeft: "0px", paddingRight: "0px", paddingTop: "0px", marginTop: "16px"}}
                      ></div>

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
              

      <div className="col-xl-6 col-lg-12 col-md-12 col-12 text-xl-right text-lg-left text-md-left text-left">
                  
                       <button
                        disabled={this.state.formloading}
                        className="btn btn-info nooutline buybtn"
                        type="submit"
                      >
                        {this.state.formloading === true
                          ? <ThreeDotsLoading />
                          : <p style={{ paddingBottom: "0px", marginBottom: "0px" }}>Continue to Payment</p>}

                      </button>




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
         


         </div> 
         
     
        }   
            </PublicRoute>
        )
    }
}

calculatorPage.defaultProps = {
    estimate: []
  };
  
  calculatorPage.propTypes = {
    resetErrors: PropTypes.func,
    getEstimate: PropTypes.func,
    formSubmission: PropTypes.func,
    timeoutReset: PropTypes.func,
    enableNavigation: PropTypes.func,
    estimate: PropTypes.object,
    settings: PropTypes.object,
    miningalgo: PropTypes.object
  };
  
  const mapStateToProps = state => ({
    estimate: state.estimate,
    settings: state.settings,
    miningalgo: state.miningalgo
  });
  
  export default connect(
    mapStateToProps,
    {
      resetErrors,
      getEstimate,
      formSubmission,
      timeoutReset,
      enableNavigation
    }
  )(calculatorPage);
  