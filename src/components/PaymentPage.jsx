// File: src/pages/PaymentPage.jsx
import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./CheckoutForm";

const stripePromise = loadStripe('pk_test_51RlaogHFEqisEz1rnVNjVu1b1saeegABrIlnTksfo9u7pE5GZioTcAkwhojpLETNRxVRYZj21tJjSP77XC4h2RiU009PBYfGYR');

const PaymentPage = () => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
};

export default PaymentPage;
