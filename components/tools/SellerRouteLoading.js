import React, { useEffect } from "react";
import Spinner2 from "./Spinner2";
import { Router } from "../../routes";

const SellerRouteLoading = ({ profile }) => {
  useEffect(() => {
    if (
      ((profile || {}).profile || {}).is_seller === false
    ) {
      Router.pushRoute("/login");
    };
  }, []);

  return (
    <div>
      <br />
      <Spinner2 />
      <br />
    </div>
  );

}

export default SellerRouteLoading;
