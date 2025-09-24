// File: CustomerPolicies.jsx
import React from "react";
import MyPolicies from "./MyPolicies";
import CustomerApplications from "../Applications/CustomerApplications";
import CustomerAgentApplications from "../Applications/CustomerAgentApplications";
function CustomerPolicies() {
  return (
    <div>
      <MyPolicies/>
     <CustomerApplications/>
     <CustomerAgentApplications/>
    </div>
  );
}

export default CustomerPolicies;
