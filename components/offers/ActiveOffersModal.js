import React from "react";
import moment from "moment";
import AreaChart from "../tools/AreaChart";
import ReactModal from "react-modal";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { capitalizeFirstLetter } from "../../utils/capitalizeFirstLetter";

export class ActiveOffersModal extends React.Component {
    render() {
        ///// GRAPH DATA ////////////////////
        let overLayError = "overlay-error";
        let noOverLayError = "no-overlay-error";
        let overlayMessage = "overlay-message";
        let noOverlayMessage = "overlay-message-hidden";
        return (
            <ReactModal
            isOpen={this.props.showModal}
            contentLabel="Taken Offers Modal"
            className="offerdetails-modal"
            overlayClassName="Overlay"
            ariaHideApp={false}
            onRequestClose={this.props.handleCloseModal}
          >

            <div className="container-fluid">
              <div className="row">
                <div className="col-xl-12 col-lg-12 d-xl-inline-block d-lg-inline-block d-md-none d-sm-none d-none text-right">
                  <button
                    className="modalclose-icon"
                    onClick={this.props.handleCloseModal}>&#10006;</button>
                </div>
              </div>
            </div>

            <div className="container divboxes">
              <div className="row divboxes">
                <div className="col-xl-5 col-lg-5 col-md-12 col-sm-12 col-12 divboxes activemodalcontainer">
                  <p className="offeridtitle" style={{display: "inline-block"}}>
                    Offer ID #{this.props.modaloffers.offer_id}
                  </p>
                  <div className="d-xl-none d-lg-none d-md-inline-block d-sm-inline-block d-inline-block text-right"
                  style={{float: "right", marginRight: "25px", marginTop: "1.5px"}}>
                  <button
                    className="modalclose-icon"
                    onClick={this.props.handleCloseModal}>&#10006;</button>
                </div>
                  <br />
                  <p className="modal-texts">
                    {" "}
                    <span className="labelclass">Mining Algorithm:</span>{" "}
                    {this.props.modaloffers.mining_algo === "sha256d" ? "SHA256d" : capitalizeFirstLetter(this.props.modaloffers.mining_algo)}
                  </p>
                  <p className="modal-texts">
                    {" "}
                    <span className="labelclass">Created on:</span>{" "}
                    {moment(this.props.modaloffers.create_time).format("MMM DD HH:mm")}
                  </p>

                  <p className="modal-texts">
                    <span className="labelclass">Rate:</span> {this.props.modaloffers.price}{" "}
                    <span style={{display: "inline-block"}}>{this.props.configs.payment_vehicle}/{this.props.modaloffers.price_hash_units}
                                 Hashes/sec/{this.props.modaloffers.price_time_units}</span>
                  </p>

                  <p className="modal-texts">
                    <strong>Hashrate (24 hours): </strong>
                    <span
                      className={
                        ((this.props.modaloffers || {}).measured_hashrate ||
                          {}) === null
                          ? "hidethis"
                          : ""
                      }
                    >
                      {
                        ((this.props.modaloffers || {}).measured_hashrate || {})[
                        "1440"
                        ]
                      }{" "}
                      {this.props.modaloffers.hashrate_units}H/s
                </span>
                    <span
                      className={
                        ((this.props.modaloffers || {}).measured_hashrate ||
                          {}) === null
                          ? ""
                          : "hidethis"
                      }
                    >
                      Unavailable
                </span>
                  </p>

                  <p className="modal-texts">
                    <strong>Hashrate (last 1 hour): </strong>
                    <span
                      className={
                        ((this.props.modaloffers || {}).measured_hashrate ||
                          {}) === null
                          ? "hidethis"
                          : ""
                      }
                    >
                      {
                        ((this.props.modaloffers || {}).measured_hashrate || {})[
                        "60"
                        ]
                      }{" "}
                      {this.props.modaloffers.hashrate_units}H/s
                </span>
                    <span
                      className={
                        ((this.props.modaloffers || {}).measured_hashrate ||
                          {}) === null
                          ? ""
                          : "hidethis"
                      }
                    >
                      Unavailable
                </span>
                  </p>

                  <p className="modal-texts">
                    <strong>Hashrate (last 10 minutes): </strong>
                    <span
                      className={
                        ((this.props.modaloffers || {}).measured_hashrate ||
                          {}) === null
                          ? "hidethis"
                          : ""
                      }
                    >
                      {
                        ((this.props.modaloffers || {}).measured_hashrate || {})[
                        "10"
                        ]
                      }{" "}
                      {this.props.modaloffers.hashrate_units}H/s
                </span>
                    <span
                      className={
                        ((this.props.modaloffers || {}).measured_hashrate ||
                          {}) === null
                          ? ""
                          : "hidethis"
                      }
                    >
                      Unavailable
                </span>
                  </p>

                  <p className="modal-texts">
                    <span className="labelclass">Minimum Duration: </span>{" "}
                    {this.props.modaloffers.min_duration} minutes
              </p>
                  <p className="modal-texts">
                    <span className="labelclass">Maximum Duration: </span>{" "}
                    {this.props.modaloffers.max_duration} minutes
              </p>
                  <p className="modal-texts">
                    <span className="labelclass">Failed Settlements: </span>{" "}
                    {this.props.modaloffers.miner_failed_settlements}
                  </p>
                  <p className="modal-texts">
                    <span className="labelclass">Successful Settlements: </span>{" "}
                    {this.props.modaloffers.successful_settlements}
                  </p>
                  <div className="text-right d-xl-none d-lg-none d-md-inline-block d-sm-inline-block d-inline-block"
                  style={{width: "100%"}}>
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
                <div className="col-xl-7 col-lg-7 d-xl-inline-block d-lg-inline-block d-md-none d-sm-none d-none divboxes">
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
                      style={{ color: "white" }}
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

ActiveOffersModal.propTypes = {
  configs: PropTypes.object
};

const mapStateToProps = state => ({
  configs: state.configs
});

export default connect(mapStateToProps, 
  null)(ActiveOffersModal);