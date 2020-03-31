import React from "react";
import ReactModal from "react-modal";

class CancelModal extends React.Component {
    render() {
        return (
            <ReactModal
                isOpen={this.props.showCancelOrderModal}
                contentLabel="Cancel Order Modal"
                className="removeprompt-modal"
                overlayClassName="Overlay"
                ariaHideApp={false}
                onRequestClose={this.props.handleCloseModal}
            >
              
                <p style={{fontSize: "0.88em", 
                marginTop: "35px", 
                marginBottom: "35px",
                marginLeft: "15px"}}>
                    Are you sure you want to cancel this order?</p>

                <div style={{width: "100%", textAlign: "right"}}>
                <button className="btn btn-sm btn-danger"
                style={{borderRadius: "0px", marginRight: "15px", fontSize: "0.8em"}}
                onClick={() => this.props.offerCancel(this.props.modalcontents.offer_id)}
                >Yes, cancel my order</button> 
                <button className="btn btn-sm btn-secondary"
                style={{borderRadius: "0px", fontSize: "0.8em"}}
                onClick={this.props.handleCloseModal}>No</button>
                </div>
                
            </ReactModal>
        )
    }
}

export default CancelModal;
