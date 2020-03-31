import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link } from "../../routes";

const MarketNav = ({ nav }) => (
  <div className="row marketnav-row" style={{ padding: "0px" }}>
    <div className="col-lg-12 col-md-12 col-12 col-xs-12 text-lg-left text-md-left text-sm-left text-left offerbtncontainer">
      <div className="marketplace-menu" style={{ background: "#3626A5" }}>
        <div className="container">
          <div className="row" style={{ padding: "10px 20px 10px 20px" }}>
             <style jsx>
               {`
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
                Buy Hashing Power
              </a>
            </Link>

            <Link route="/invoice">
              <a
                className={
                  nav.page === "marketplacepage"
                    ? "marketplacenav selected"
                    : "marketplacenav"
                }
              >
                Invoice
              </a>
            </Link>

            <Link route="/searchorders">
              <a
                className={
                  nav.page === "marketplacepage"
                    ? "marketplacenav selected"
                    : "marketplacenav"
                }
              >
                Search Orders
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
