import React from "react";

export default () => {
  return (
    <span style={{ width: "100%", textAlign: "center" }}>
      <img
        src="/static/spinner.gif"
        className="spinner-img-class"
        style={{
          width: "170px",
          margin: "0 auto",
          paddingTop: "90px",
          paddingBottom: "90px",
          display: "block",
          opacity: "0.6"
        }}
        alt="Loading..."
      />
    </span>
  );
};
