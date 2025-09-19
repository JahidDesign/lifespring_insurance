import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./CheckoutForm";

const STRIPE_PUBLISHABLE_KEY = "pk_test_xxxxx"; // from Stripe dashboard
const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

function PaymentPage() {
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    // 👇 Call backend to create PaymentIntent
    fetch("https://insurances-lmy8.onrender.com/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: 2000, currency: "usd" }), // $20.00
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, []);

  const options = {
    clientSecret, // 👈 use it here
  };

  return (
    <>
      {clientSecret && (
        <Elements stripe={stripePromise} options={options}>
          <CheckoutForm />
        </Elements>
      )}
    </>
  );
}

export default PaymentPage;
