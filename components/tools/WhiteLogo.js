import React from "react";

export default () => {
  return (
    <a
    className="navbar-brand"
    itemProp="logo"
    href="https://www.warihash.com"
    itemScope
    itemType="https://schema.org/ImageObject"
  >
     <img
      src="/static/warihash_logo_white.svg"
      style={{
        display: "inline-block",
        width: "188px",
        marginBottom: "10px"
      }}
      alt="Logo"
    />
  </a>
  );
};
