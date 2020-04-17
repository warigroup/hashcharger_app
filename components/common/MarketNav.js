import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link } from "../../routes";

const MarketNav = ({ nav, payment }) => (
      <div className="marketplace-menu" 
      style={{ background: "#3626A5", 
      position: "absolute", 
      bottom: "0px",
      width: "100vw", 
      display: "block",
      marginTop: "80px" }}>
        <div className="container">
          <div className="row" style={{ padding: "13px 20px 13px 20px" }}>
             <style jsx>
               {`
               .number-circle {
                border: 2.5px solid rgba(255,255,255,0.6);
                border-radius: 50%;
                padding: 1px 7px 1px 7px;
                color: rgba(255,255,255,0.6);
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
               .marketplacenav  {
                color: rgba(255,255,255,0.6);
               }
               .marketplacenav.selected {
                color: #fff;
                pointer: cursor;
               }
               .marketplacenav.selected .number-circle {
                color: #fff;
                border: 2.5px solid #fff;
               }

              .disabled-link {
                pointer-events: none;
              }
               `}
             </style>
            
            <div className="col-xl-4 col-lg-4 col-md-12 text-center">
            <Link route="/market">
              <a
                className={
                  nav.page === "marketplacepage"
                    ? "marketplacenav selected"
                    : "marketplacenav"
                }
              >
               <h4 className="number-circle">1</h4>
                <h4 className="offerformlabel">
                Place an order
                </h4> 
              </a>
            </Link>
            </div>

           
            <div className="col-xl-4 col-lg-4 col-md-12 text-center">
            <Link route={`/invoice/id/${payment.bid_id}`}>
              <a
                className={
                  nav.page === "invoicepage" &&
                  payment.bid_id !== undefined
                    ? "marketplacenav selected"
                    : "marketplacenav disabled-link"
                }
              >
                <h4 className="number-circle">2</h4>
                <h4 className="offerformlabel">
                Pay for your order
                </h4> 
              </a>
            </Link>
            </div>

            <div className="col-xl-4 col-lg-4 col-md-12 text-center">
             <Link route={`/orderdetails/id/${payment.bid_id}`}>
             <a
               className={
                 nav.page === "orderdetailspage" &&
                 payment.bid_id !== undefined 
                   ? "marketplacenav selected"
                   : "marketplacenav disabled-link"
               }
             >
               <h4 className="number-circle">3</h4>
               <h4 className="offerformlabel">
               Order details
               </h4> 
             </a>
           </Link>
       
           
            </div>

          </div>
        </div>
      </div>
);

MarketNav.propTypes = {
  nav: PropTypes.object,
  payment: PropTypes.object
};

const mapStateToProps = state => ({
  nav: state.nav,
  payment: state.payment
});

export default connect(
  mapStateToProps,
  null
)(MarketNav);
