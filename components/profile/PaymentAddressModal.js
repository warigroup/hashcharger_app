import React from "react";
import { connect } from "react-redux";
import ReactModal from "react-modal";
import PropTypes from "prop-types";
import { FaWallet } from "react-icons/fa";
import { setBTCAddress } from "../../actions/warihashApiCalls";
class PaymentAddressModal extends React.Component {
  constructor() {
    super();
    this.state = {
      paymentfocus: false,
      address: ""
    }
  }

  handlePaymentFocus = () => this.setState({ paymentfocus: true });
  handlePaymentBlur = () => this.setState({ paymentfocus: false });
  handleChange = event => {
    const itemName = event.target.name;
    const itemValue = event.target.value;
    this.setState({ [itemName]: itemValue });
  };
  setAddress = address => this.props.setBTCAddress(address);
  
  render() {
      const {paymentfocus} = this.state;
      
        return (
            <ReactModal
                isOpen={this.props.showPaymentAddressModal}
                contentLabel="Cancel Order Modal"
                className="removeprompt-modal"
                overlayClassName="Overlay"
                ariaHideApp={false}
                onRequestClose={this.props.handleCloseModal}
            >
              <div className="form-group">
                    <label
                      htmlFor="address"
                      className="inputlabel"
                    >
                      Set your bitcoin payment address:
                    </label>
                    <div
                      className={
                        paymentfocus === true
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
                          <FaWallet style={paymentfocus === true ? 
                          { fontSize: "1.15em", opacity: "1" } : 
                          { fontSize: "1.15em", opacity: "0.8" }} />
                        </span>
                      </div>
                      <input
                        type="text"
                        placeholder="Example: 1BvBMSAYstWetqTQn5Au4t4GZg5xJaNVN4"
                        name="address"
                        value={this.state.address}
                        onChange={this.handleChange}
                        className="form-control inputstyles2"
                        style={{
                          border: "none",
                          borderRadius: "7px",
                          fontSize: "0.82em"
                        }}
                        onFocus={this.handlePaymentFocus}
                        onBlur={this.handlePaymentBlur}
                        autoComplete="off"
                      />
                    </div>

                    {this.props.errors.address !== undefined ? <p className="is-invalid-error add-padding-left">
                      {this.props.errors.address}</p> : null}
                  </div>

                <div style={{width: "100%", textAlign: "right"}}>
                <button className="btn btn-sm btn-primary"
                style={{borderRadius: "0px", marginRight: "15px", fontSize: "0.8em", 
                paddingTop: "5px", paddingBottom: "5.15px"}}
                onClick={() => this.setAddress(this.state.address)}
                disabled={this.state.address === ""}
                >Save</button> 

                <button className="btn btn-sm btn-secondary"
                style={{borderRadius: "0px", fontSize: "0.8em"}}
                onClick={this.props.handleCloseModal}>Cancel</button>
                </div>
                
            </ReactModal>
        )
    }
}

PaymentAddressModal.propTypes = {
  setBTCAddress: PropTypes.func,
  errors: PropTypes.object
};

const mapStateToProps = state => ({
  errors: state.errors
});

export default connect(mapStateToProps, 
  {setBTCAddress})(PaymentAddressModal);