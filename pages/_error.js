import React from "react";
import {
  notFoundPage,
  clearCurrentProfile,
  getCurrentProfile
} from "../actions/warihashApiCalls";
import { connect } from "react-redux";
import { FaArrowLeft } from "react-icons/fa";
import PropTypes from "prop-types";
import Cookies from "js-cookie";
import { COOKIE_TIMEOUT } from "../utils/timeout-config";
import PublicRoute from "../components/routes/PublicRoute";

class NotFound extends React.Component {
  constructor() {
    super();
    this.state = {
      cookiemodal: ""
    };
  }

  componentDidMount() {
    this.props.notFoundPage();

    /// TEST BROWER'S COOKIE SETTING /////////////////
    var inMinute = 1 / 1440;
    Cookies.set("testcookie06", "cookie-test", { expires: inMinute });
    setTimeout(() => {
      const cookievalue = Cookies.get("testcookie06");
      if (cookievalue !== "cookie-test") {
        this.openCookieModal();
      } else if (cookievalue === "cookie-test") {
        Cookies.remove("testcookie06");
      }
    }, COOKIE_TIMEOUT);
    if (this.props.auth.isAuthenticated === false) {
      this.props.clearCurrentProfile();
    };
    if (
      this.props.auth.isAuthenticated === true &&
      ((this.props.profile || {}).profile || {}).username === ""
    ) {
      this.props.getCurrentProfile();
    };
  }

  componentWillUnmount() {
    Cookies.remove("testcookie06");
  };

  openCookieModal = () => {
    this.setState({ cookiemodal: "openup" });
  };

  closeCookieModal = () => {
    this.setState({ cookiemodal: "closenow" });
  };

  render() {
    let cookiemodalClass = "hidethis";
    let modalcontentClass = "hidethis";
    if (this.state.cookiemodal === "") {
      cookiemodalClass = "hidethis";
      modalcontentClass = "hidethis";
    } else if (this.state.cookiemodal === "closenow") {
      cookiemodalClass = "hidethis";
      modalcontentClass = "hidethis";
    } else if (this.state.cookiemodal === "openup") {
      cookiemodalClass = "container showthis";
      modalcontentClass = "col-md-8 text-center cookie-error-modal";
    };

    return (
      <PublicRoute>
        <div style={{ width: "100%", marginBottom: "150px" }}>
          <div className="container">
            <style jsx>
              {`
                .gotomain-btn {
                  cursor: pointer;
                  background: #3626a5;
                  font-size: 16px;
                  border-radius: 0px;
                  color: white !important;
                  border: none;
                  box-shadow: 0 4px 15px 0 rgba(129, 150, 160, 0.45);
                  padding: 10px 15px 11px 15px;
                  text-decoration: none;
                  transition: 0.5s all ease-out;
                  margin-top: 4px;
                }
                .gotomain-btn:hover {
                  background: #5e51b7;
                  color: white;
                }
                .gotomain-btn span {
                  margin-right: 12px;
                  font-size: 20px;
                }
                .notfoundtitle {
                  color: rgba(0, 0, 0, 0.6);
                }
              `}
            </style>
            <div className="row">
              <div className="col-md-12 col-12 text-center">
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <h5 className="notfoundtitle">
                  <strong>ERROR: Page Not Found</strong>
                </h5>
                <br />
                <br />
                <br />
                  <a className="gotomain-btn" 
                  href="https://www.warihash.com"
                  itemProp="url">
                    <span>
                      <FaArrowLeft />
                    </span>{" "}
                    Go to main page
                  </a>
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
              </div>
              <div
                className={cookiemodalClass}
                style={{ position: "fixed", bottom: "0", zIndex: "234234134" }}
              >
                <div className="row">
                  <div className={modalcontentClass}>
                    <h5>
                      <strong>
                        WariHash.com makes heavy use of browser cookies.
                      </strong>
                    </h5>
                    <p>
                      Please enable cookies in your browser setting before
                      loggin in.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PublicRoute>
    );
  }
}

NotFound.propTypes = {
  notFoundPage: PropTypes.func,
  clearCurrentProfile: PropTypes.func,
  getCurrentProfile: PropTypes.func,
  auth: PropTypes.object,
  profile: PropTypes.object
};

const mapStateToProps = state => ({
  auth: state.auth,
  profile: state.profile
});

export default connect(
  mapStateToProps,
  { notFoundPage, clearCurrentProfile, getCurrentProfile }
)(NotFound);
