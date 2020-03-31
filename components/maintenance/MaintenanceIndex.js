import React, { Component } from "react";

class MaintenanceIndex extends Component {
  render() {
    return (
      <div className="maintenancemode-container">
        <br />
        <br />
        <br />
        <img
          src="/static/maintenance-icon.svg"
          style={{ width: "350px", padding: "50px" }}
        />
        <br />
        <h5
          className="display-5 mb-4"
          style={{
            color: "black",
            fontFamily: "sans-serif",
            fontSize: "1.5em",
            fontWeight: "bold"
          }}
        >
          Under Maintenance
          </h5>
        <br />
        <p
          className="landing-texts"
          style={{ color: "black", fontFamily: "sans-serif" }}
        >
          We'll be back soon! If you have any question, please send us an
            email:{" "}
          <a href="mailto:info@warihash.com" className="hreflink">
            info@warihash.com
            </a>
        </p>
        <br />
        <br />
      </div>
    )
  }
};

export default MaintenanceIndex;