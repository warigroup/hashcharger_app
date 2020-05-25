import React, { Component } from 'react';
import PublicRoute from "../components/routes/PublicRoute";
import { connect } from "react-redux";
import {
  resetErrors,
  getEstimate } from "../actions/warihashApiCalls";
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

        openOrderPage = () => Router.pushRoute('/');

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
                      
                     


                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12"
                      style={{paddingLeft: "0px", paddingRight: "0px", paddingTop: "0px", marginTop: "16px"}}
                      >
                    
                   
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
    estimate: PropTypes.object,
  };
  
  const mapStateToProps = state => ({
    estimate: state.estimate
  });
  
  export default connect(
    mapStateToProps,
    {
      resetErrors,
      getEstimate
    }
  )(calculatorPage);
  