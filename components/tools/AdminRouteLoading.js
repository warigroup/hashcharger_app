import React, { useEffect } from "react";
import Spinner2 from "./Spinner2";
import { Router } from "../../routes";

const AdminRouteLoading = ({ profile }) => {
  useEffect(() => {
    if (
      ((profile || {}).profile || {}).is_staff === false
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

export default AdminRouteLoading;
