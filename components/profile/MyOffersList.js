import React, { Fragment } from 'react';
import PaymentRate from "../tools/PaymentRate";
import { capitalizeFirstLetter } from "../../utils/capitalizeFirstLetter";

class MyOffersList extends React.Component {

  render() {
    const detailsModal = offer => this.props.openSellOrderModal(offer);
    const cancelModal = offer => this.props.openCancelOrderModal(offer);
    const editPage = offer => this.props.offerEditPage(offer);

    const offersList = this.props.activeoffers.map(
      function (offer, index) {
        return (
          <tr className="row m-0 offercontents tablerowstyles"
            key={index}
            style={{
              borderLeft: "1px solid rgba(0,0,0,0.3)",
              borderRight: "1px solid rgba(0,0,0,0.3)"
            }}
          >
            <td className="myoffers-table-id">
              <p className="tabledata">{offer.offer_id}</p>
            </td>
  
            <td className="myoffers-table-algorithm">
              <p className="tabledata">
              {offer.mining_algo === "sha256d" ? "SHA256d" : capitalizeFirstLetter(offer.mining_algo)}
              </p>
            </td>
  
            <td className="myoffers-table-hashrate">
              <p className="tabledata">
              {offer &&
              offer.measured_hashrate &&
              offer.measured_hashrate['1440'] !== null ? offer.measured_hashrate['1440'] + " " + offer.hashrate_units + 'H/s' : "N/A"}  
              </p>
            </td>
  
            <td className="myoffers-table-rate">
              <p className="tabledata">{offer.price}{" "}<PaymentRate /></p>
            </td>
  
            <td className="myoffers-table-match">
              <p className="tabledata">{offer.settled === true ? "Matched" : "Waiting for Buyer"}</p>
            </td>
  
  
            <td className="myoffers-table-order">
              <p className="tabledata">
                 {offer.active === true? "Active" : "Cancelled"}
              </p>
            </td>
  
            <td
              className="myoffers-table-buttons text-right"
            >
              <button
                className="btn btn-sm btn-secondary orderstable-btn2"
                id="detailsbtn"
                onClick={() => detailsModal(offer)}
                >
                  Details
            </button>
             <button 
                className="btn btn-sm btn-info orderstable-btn2 editbtn"
                id="editbtn"
                disabled={offer.active === false}
                onClick={() => editPage(offer)}
                >
                  Edit
              </button>
              <button 
                className="btn btn-sm btn-danger orderstable-btn2 cancelbtn"
                id="cancelbtn"
                disabled={offer.active === false}
                onClick={() => cancelModal(offer)}
                >
                  Cancel
              </button>
  
  
            </td>
          </tr>
        )
      }
    );
  
   
    return(
      <Fragment>
        {offersList}
      </Fragment>
    )
  }

}
 

export default MyOffersList;