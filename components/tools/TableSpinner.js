import React from "react";

export default () => {
  return (
    <tr style={{ width: "100%", textAlign: "center" }}>
      <td>
      <img
        src="/static/spinner.gif"
        style={{
          width: "170px",
          margin: "0 auto",
          paddingTop: "20px",
          paddingBottom: "20px",
          display: "block",
          opacity: "0.6"
        }}
        alt="Loading..."
      />
      </td>
    </tr>
  );
};
