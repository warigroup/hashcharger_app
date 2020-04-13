import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link } from "../../routes";
import { TiDocumentText, TiPencil } from "react-icons/ti";
import { FaSearchPlus } from "react-icons/fa";

const MarketNav = ({ nav }) => (
  <div className="row marketnav-row" style={{ padding: "0px" }}>
    <div className="col-lg-12 col-md-12 col-12 col-xs-12 text-lg-left text-md-left text-sm-left text-left offerbtncontainer">
      <div className="marketplace-menu" style={{ background: "#3626A5" }}>
        <div className="container">
          <div className="row" style={{ padding: "10px 20px 10px 20px" }}>
             <style jsx>
               {`
               .marketplacenav {
                 width: 30%;
               }
               .number-circle {
                border: 2.5px solid #fff;
                border-radius: 50%;
                padding: 1px 7px 1px 7px;
                color: #fff;
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
               @media (max-width: 650px) {
                 .marketplacenav {
                   width: 100%;
                 }
               }
               `}
             </style>
            <Link route="/">
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

            <Link route="/invoice">
              <a
                className={
                  nav.page === "invoicepage"
                    ? "marketplacenav selected"
                    : "marketplacenav"
                }
              >
                <h4 className="number-circle">2</h4>
                <h4 className="offerformlabel">
                Pay for your order
                </h4> 
              </a>
            </Link>

            <Link route="/searchorders">
              <a
                className={
                  nav.page === "searchpage"
                    ? "marketplacenav selected"
                    : "marketplacenav"
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
  </div>
);

MarketNav.propTypes = {
  nav: PropTypes.object
};

const mapStateToProps = state => ({
  nav: state.nav
});

export default connect(
  mapStateToProps,
  null
)(MarketNav);
