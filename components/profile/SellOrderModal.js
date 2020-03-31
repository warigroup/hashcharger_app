import React from "react";
import moment from "moment";
import AreaChart from "../tools/AreaChart";
import { connect } from "react-redux";
import ReactModal from "react-modal";
import { convertDuration } from "../../utils/convertDuration";
import PropTypes from "prop-types";
import { capitalizeFirstLetter } from "../../utils/capitalizeFirstLetter";

class SellOrderModal extends React.Component {
  locationTexts = () => {
    if (this.props.modalcontents.location === "NA East") {
      return "North America East (New York)"
    }
    if (this.props.modalcontents.location === "NA West") {
      return "North America West (San Francisco)"
    }
    if (this.props.modalcontents.location === "EU West") {
      return "Europe West (Amsterdam)"
    }
  }

  render() {
    let overLayError = "overlay-error";
    let noOverLayError = "no-overlay-error";
    let overlayMessage = "overlay-message";
    let noOverlayMessage = "overlay-message-hidden";

    return (
      <ReactModal
        isOpen={this.props.showSellOrderModal}
        contentLabel="Sell Order Modal"
        className="offerdetails-modal"
        overlayClassName="Overlay"
        ariaHideApp={false}
        onRequestClose={this.props.handleCloseModal}
      >
        <div className="container divboxes">
          <div className="row divboxes">
            <div className="col-xl-5 col-lg-12 col-md-12 col-sm-12 col-12 divboxes profile-modalcontainer">
              <p className="offeridtitle profilemodal-title" style={{ paddingTop: "0px", 
              marginTop: "0px", marginBottom: "13px" }}>
                Offer ID #{this.props.modalcontents.offer_id}
              </p>
              <p style={{fontSize: "0.8em", color: "rgba(0,0,0,0.55)", paddingBottom: "0px", marginBottom: "0px"}}>
                Connect your miner to <span style={{fontWeight: "bold"}}>{this.props.modalcontents.miner_proxy}</span> with stratum username <span style={{fontWeight: "bold"}}>{this.props.modalcontents.miner_stratum_username}</span>
              </p>
            
              <div className="d-xl-none d-lg-none d-md-inline-block d-sm-inline-block d-inline-block text-right"
                style={{ float: "right", marginRight: "25px", marginTop: "1.5px" }}>
                <button
                  className="modalclose-icon"
                  onClick={this.props.handleCloseModal}>&#10006;</button>
              </div>
              <br />
              <p className="modal-texts">
                <span className="labelclass">Mining Algorithm:</span>{" "}
                {this.props.modalcontents.mining_algo === "sha256d" ? "SHA256d" : capitalizeFirstLetter(this.props.modalcontents.mining_algo)}
              </p>
              
              <p className="modal-texts">
                <span className="labelclass">Order Creation Time:</span>{" "}
                {moment(this.props.modalcontents.create_time).format("MM/DD/YYYY HH:mm")}
              </p>
              
              <p className="modal-texts">
                <span className="labelclass">Order End Time:</span>{" "}
                {this.props.modalcontents.end_time !== null ? moment(this.props.modalcontents.end_time).format(
                  "MM/DD/YYYY HH:mm"
                ) : "N/A"}
              </p>
              
              <p className="modal-texts">
                <span className="labelclass">Rate:</span> {this.props.modalcontents.price}{" "}
                <span style={{display: "inline-block"}}>{this.props.configs.payment_vehicle}/{this.props.modalcontents.price_hash_units}
                                 Hashes/sec/{this.props.modalcontents.price_time_units}</span>
              </p>

              <p className="modal-texts">
                <span className="labelclass">Miner Location:</span> {this.locationTexts()}
              </p>

              <p className="modal-texts">
                <span className="labelclass">Total Rental Revenue:</span>{" "}
                {this.props.modalcontents.total_payment_amount} BTC
              </p>

              <p className="modal-texts">
                <span className="labelclass">Total Rented Duration:</span>{" "}
                  {convertDuration(this.props.modalcontents.total_settled_minutes)}
              </p>

              <p className="modal-texts">
                <span className="labelclass">Match Status:</span>{" "}
                {this.props.modalcontents.settled === true ? "Matched" : "Waiting for Buyer"}
              </p>

              <p className="modal-texts">
                <span className="labelclass">Order Status:</span>{" "}
                {this.props.modalcontents.active === true? "Active" : "Cancelled"}
              </p>

              <p className="modal-texts">
                <span className="labelclass">Average Hashrate, 24 hours:</span>{" "}
                {this.props.modalcontents &&
                this.props.modalcontents.measured_hashrate &&
                this.props.modalcontents.measured_hashrate['1440'] !== null ? 
                this.props.modalcontents.measured_hashrate['1440'] + " " + this.props.modalcontents.hashrate_units + 'H/s' : 'N/A'}
              </p>

              <p className="modal-texts">
                <span className="labelclass">Average Hashrate, last 10 mins:</span>{" "}
                {this.props.modalcontents &&
                this.props.modalcontents.measured_hashrate &&
                this.props.modalcontents.measured_hashrate['10'] !== null ? 
                this.props.modalcontents.measured_hashrate['10'] + " " + this.props.modalcontents.hashrate_units + 'H/s' : 'N/A'}
              </p>

              <p className="modal-texts">
                <span className="labelclass">Average Hashrate, last 1 hour:</span>{" "}
                {this.props.modalcontents &&
                this.props.modalcontents.measured_hashrate &&
                this.props.modalcontents.measured_hashrate['60'] !== null ? 
                this.props.modalcontents.measured_hashrate['60'] + " " + this.props.modalcontents.hashrate_units + 'H/s' : 'N/A'}
              </p>

              <div className="text-right d-xl-none d-lg-none d-md-inline-block d-sm-inline-block d-inline-block"
                style={{ width: "100%" }}>
                <br />
                <button
                  className="btn btn-md modal-close-btn"
                  onClick={this.props.handleCloseModal}
                  style={{ color: "white", marginRight: "25px" }}
                >
                  <p
                    style={{
                      paddingBottom: "0px", marginBottom: "0px",
                      position: "relative", top: "-1.5px"
                    }}>Close</p></button>
              </div>
            </div>

            <div className="col-xl-7 d-xl-inline-block d-lg-none d-md-none d-sm-none d-none divboxes">
              <div className="container-fluid">
                <div className="row">
                  <div className="col-xl-12 col-lg-12 d-xl-inline-block d-lg-inline-block d-md-none d-sm-none d-none text-right">
                    <button
                      className="modalclose-icon"
                      onClick={this.props.handleCloseModal}>&#10006;</button>
                  </div>
                </div>
              </div>
              <div className="emptydivbox">
                <br />
                <br />
              </div>
              <div
                className={
                  this.props.hashrate.times.length === 0 &&
                    this.props.modalLoading === false &&
                    this.props.hashrate.hashrate_units != ""
                    ? overlayMessage
                    : noOverlayMessage
                }
              >
                <p style={{ fontSize: "0.85em", marginTop: "20px" }}>
                  <strong>No mining reported</strong>
                </p>
              </div>
              <div
                className={
                  this.props.hashrate.times.length === 0 &&
                    this.props.modalLoading === false
                    ? overLayError
                    : noOverLayError
                }
              >
                <AreaChart hashrate={this.props.hashrate} />
              </div>
              <div style={{ width: "100%", textAlign: "right" }}>
                <button
                  className="btn btn-md modal-close-btn"
                  onClick={this.props.handleCloseModal}
                  style={{ color: "white", marginTop: "18px" }}
                >
                  <p
                    style={{
                      paddingBottom: "0px", marginBottom: "0px",
                      position: "relative", top: "-1.5px"
                    }}>Close</p></button>
              </div>
            </div>
          </div>
        </div>
      </ReactModal>

    )
  }
}

SellOrderModal.propTypes = {
  configs: PropTypes.object
};

const mapStateToProps = state => ({
  configs: state.configs
});

export default connect(mapStateToProps, 
  null)(SellOrderModal);