import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useState } from "react";

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const amount = 5000; // BDT 5000 (or $50)

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);

    const res = await fetch("https://insurances-lmy8.onrender.com/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount }),
    });

    const { clientSecret } = await res.json();

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    if (result.error) {
      alert(`❌ Payment failed: ${result.error.message}`);
    } else if (result.paymentIntent.status === "succeeded") {
      alert("✅ Payment successful!");
    }

    setProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md text-black">
      <h2 className="text-2xl font-semibold mb-4">Pay with Card</h2>
      <CardElement className="border p-3 rounded mb-4" />
      <button
        type="submit"
        disabled={!stripe || processing}
        className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded w-full"
      >
        {processing ? "Processing..." : `Pay ৳${amount}`}
      </button>
    </form>
  );
};

export default CheckoutForm;
