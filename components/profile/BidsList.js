import React, { Fragment } from "react";
import { convertDuration } from "../../utils/convertDuration";
import { capitalizeFirstLetter } from "../../utils/capitalizeFirstLetter";;

class BidsList extends React.Component {

    render() {
      const {secondary, buttontexts} = this.props;
        let invoicePage = bid_id => this.props.goToInvoicePage(bid_id);

        const bidsList = this.props.bids.map(
            function (bid, index) {
              return (
                <tr className="row m-0 offercontents tablerowstyles"
                  key={index}
                  style={{
                    borderLeft: "1px solid rgba(0,0,0,0.3)",
                    borderRight: "1px solid rgba(0,0,0,0.3)"
                  }}
                >
                 
                  <td className="orders-table-id">
                    <p className="tabledata">{bid.bid_id}</p>
                  </td>
        
                  <td className="orders-table-algorithm">
                    <p className="tabledata">
                    {bid.mining_algo === "sha256d" ? "SHA256d" : capitalizeFirstLetter(bid.mining_algo)}
                    </p>
                  </td>
        
                  <td className="orders-table-duration">
                    <p className="tabledata">{convertDuration(bid.duration)}</p>
                  </td>
        
                  <td className="orders-table-average-hashrate">
                <p className="tabledata">{bid.reserved_hashrate === null ? "0.0000" : bid.reserved_hashrate} / {bid.average_hashrate === null ? "0.0000" : bid.average_hashrate} {bid.hashrate_units}H/s</p>
                  </td>
        
                  <td className="orders-table-status">
                    <p className="tabledata">
                      {bid.payment_success === true ? "Paid" : ""}
                      {bid.payment_fail === true ? "Failed" : ""}
                      {bid.payment_success === false &&
                        bid.payment_fail === false ? "Waiting for Payment" : ""}
                    </p>
                  </td>
        
                  <td className="orders-table-mining">
                    <p className="tabledata">
                      {/***** WAITING FOR PAYMENT  ****/}
                      {bid.payment_success === false &&
                        bid.payment_fail === false ? "N/A" : null}
                        {/***** PAYMENT FAILED  ****/}
                        {bid.payment_success === false &&
                        bid.payment_fail === true ? "N/A" : null}
                        {/***** PAID, MINING STARTED  ****/}
                      {bid.payment_success === true &&
                        bid.settlement_start_time !== null &&
                        bid.settlement_is_finished === false ? "In Progress" : null}
                        {/***** PAID, MINING FINISHED ****/}
                      {bid.payment_success === true &&
                        bid.settlement_start_time !== null &&
                        bid.settlement_is_finished !== false ? "Finished" : null}
                    </p>
                  </td>
        
                  <td
                    className="orders-table-buttons text-xl-center text-lg-center text-md-right text-right"
                  >
                    <button
                      className="btn btn-sm btn-secondary orderstable-btn invoice-btn"
                      style={{ background: secondary, color: buttontexts }}
                      onClick={() => invoicePage(bid.bid_id)}
                    >
                      View Invoice
                    </button>
                  </td>
                </tr>
              )
            }
          );

        return (
            <Fragment>
                 {bidsList}
            </Fragment>
           
        )
    }
}


export default BidsList;
