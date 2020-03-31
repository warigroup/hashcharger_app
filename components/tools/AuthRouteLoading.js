import React, { useEffect } from "react";
import Spinner2 from "./Spinner2";
import { Router } from "../../routes";

const AuthRouteLoading = () => {
  useEffect(() => {
    Router.pushRoute("/");
  }, []);

  return (
    <div>
      <br />
      <Spinner2 />
      <br />
    </div>
  );
}

export default AuthRouteLoading;
