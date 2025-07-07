"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Loader from "@/components/ui/loader";

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayOptions {
    key: string;
    amount: number;
    currency: string;
    name: string;
    description: string;
    order_id: string;
    handler: (response: RazorpayResponse) => void;
    prefill: {
        name?: string;
        email?: string;
    };
    theme: {
        color: string;
    };
    modal: {
        ondismiss: () => void;
    };
}

declare const Razorpay: new (options: RazorpayOptions) => { open: () => void; };

const plans = [
    { name: 'Starter', price: 149, credits: 298, popular: false, tag: 'Best for beginners' },
    { name: 'Pro', price: 300, credits: 630, popular: true, tag: 'Save 5%', save: 5 },
    { name: 'Power User', price: 799, credits: 1758, popular: false, tag: 'For power users/agencies', save: 10 }
];

const PricingPage = () => {
  const { user, loading: authLoading, refetchCredits } = useAuth();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      toast.error("Please login to access this page.");
      router.push("/login");
    }
  }, [user, authLoading, router]);

  const handlePayment = async (plan: { name: string; price: number; credits: number }) => {
    if (!user) {
      toast.error("Please log in to purchase credits.");
      return;
    }
    setLoadingPlan(plan.name);

    const res = await fetch("/api/razorpay", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: plan.price * 100 }), // amount in paise
    });

    if (!res.ok) {
      toast.error("Failed to create Razorpay order.");
      setLoadingPlan(null);
      return;
    }

    const data = await res.json();
    const order = data.order;

    if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || !order) {
        toast.error("Razorpay key or order details are missing. Please try again later.");
        setLoadingPlan(null);
        return;
    }

    const options: RazorpayOptions = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "AIrena",
      description: `Purchase ${plan.name} Plan`,
      order_id: order.id,
      handler: async function (response: RazorpayResponse) {
        const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = response;

        const verifyRes = await fetch("/api/razorpay/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            razorpay_payment_id,
            razorpay_order_id,
            razorpay_signature,
            userId: user.id,
            creditsToAdd: plan.credits,
          }),
        });
        
        const verifyData = await verifyRes.json();

        if (verifyData.success) {
          toast.success("Payment successful! Credits added.");
          setTimeout(() => {
            refetchCredits();
          }, 500);
        } else {
          toast.error(verifyData.message || "Payment verification failed.");
        }
        setLoadingPlan(null);
      },
      prefill: {
        name: user.email ?? undefined,
        email: user.email ?? undefined,
      },
      theme: {
        color: "#3b82f6",
      },
      modal: {
        ondismiss: function() {
            setLoadingPlan(null);
            toast.error("Payment cancelled.");
        }
      }
    };

    const rzp = new Razorpay(options);
    rzp.open();
  };
  
  if (authLoading) {
    return <Loader text="Loading pricing..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
        {loadingPlan && <Loader text="Processing payment..." />}
        <main className="container mx-auto px-4 py-16">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-2">Choose Your Plan</h1>
                <p className="text-lg text-gray-600">
                    Select a plan to top up your credits. No hidden fees, credits never expire.
                </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {plans.map(plan => (
                    <PricingCard
                        key={plan.name}
                        plan={plan}
                        onBuy={() => handlePayment(plan)}
                        loading={loadingPlan === plan.name}
                    />
                ))}
            </div>
             <div className="text-center text-xs text-gray-500 mt-10 space-y-1">
                <p>Payments are securely processed by Razorpay.</p>
                <p>1 Credit = ₹0.50. Gemini queries cost 1 credit, GPT-4.1 mini queries cost 2 credits.</p>
            </div>
        </main>
    </div>
  );
};

interface PricingCardProps {
  plan: { name: string; price: number; credits: number; popular?: boolean; tag: string; save?: number };
  onBuy: () => void;
  loading: boolean;
}

const PricingCard = ({ plan, onBuy, loading }: PricingCardProps) => (
  <div className={`relative rounded-xl border bg-white p-8 shadow-lg transition-all duration-300 hover:shadow-xl ${plan.popular ? 'border-blue-500 ring-2 ring-blue-500' : 'border-gray-200'}`}>
    {plan.popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-blue-500 px-4 py-1 text-sm font-semibold text-white shadow-md">
            Most Popular
        </div>
    )}
     {plan.save && (
        <div className="absolute top-5 right-5 rounded-full bg-green-100 text-green-800 px-3 py-1 text-xs font-bold">
            SAVE {plan.save}%
        </div>
    )}
    <h2 className="text-2xl font-bold text-gray-900">{plan.name}</h2>
    <p className="text-sm font-medium text-gray-500 h-5">{plan.tag}</p>

    <p className="mt-4 text-5xl font-extrabold text-gray-900">
      ₹{plan.price}
      <span className="text-lg font-normal text-gray-400">/one-time</span>
    </p>
     <p className="mt-2 text-xl font-bold text-blue-600">{plan.credits} Credits</p>
    <ul className="mt-6 space-y-3 text-gray-600">
        <li className="flex items-center">
            <CheckIcon /> Up to {plan.credits} Gemini 2.5 Flash queries
        </li>
        <li className="flex items-center">
            <CheckIcon /> Up to {Math.floor(plan.credits / 2)} GPT-4.1 mini queries
        </li>
    </ul>
    <button
      onClick={onBuy}
      disabled={loading}
      className={`mt-8 w-full rounded-lg px-4 py-3 font-semibold text-white transition-transform transform hover:scale-105 ${
        loading ? 'bg-gray-400 cursor-not-allowed' : (plan.popular ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-800 hover:bg-gray-900')
      }`}
    >
      {loading ? 'Processing...' : 'Buy Now'}
    </button>
  </div>
);

const CheckIcon = () => (
    <svg className="mr-2 h-5 w-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
    </svg>
)

export default PricingPage; 