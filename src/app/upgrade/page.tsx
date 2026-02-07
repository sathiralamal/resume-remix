"use client";

import { Check } from "lucide-react";

export default function UpgradePage() {
  const handleBuy = () => {
    // In a real implementation, this would redirect to the LemonSqueezy Checkout URL
    // You can also use the LemonSqueezy Overlay
    const storeId = process.env.NEXT_PUBLIC_LEMONSQUEEZY_STORE_ID; 
    // For now, we'll just alert or link to a placeholder if env is missing
    alert("Redirecting to LemonSqueezy Checkout...");
    // window.location.href = "YOUR_CHECKOUT_URL";
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-lg w-full space-y-8 bg-white p-10 rounded-xl shadow-xl border border-gray-100">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Upgrade to <span className="text-blue-600">Pro</span>
          </h2>
          <p className="mt-2 text-gray-500">
            Supercharge your career with unlimited AI resumes.
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <Check className="h-6 w-6 text-green-500" />
            </div>
            <p className="text-lg text-gray-700">Unlimited Resumes</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <Check className="h-6 w-6 text-green-500" />
            </div>
            <p className="text-lg text-gray-700">Advanced AI Models</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <Check className="h-6 w-6 text-green-500" />
            </div>
            <p className="text-lg text-gray-700">Priority Support</p>
          </div>
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-center text-5xl font-extrabold text-gray-900">
            $19
            <span className="ml-2 text-xl font-medium text-gray-500 self-end mb-2">/month</span>
          </div>
        </div>

        <button
          onClick={handleBuy}
          className="w-full flex justify-center py-4 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          Subscribe Now
        </button>
        
        <div className="text-center mt-4">
             <a href="/dashboard" className="text-sm text-gray-500 hover:text-gray-900">Back to Dashboard</a>
        </div>
      </div>
    </div>
  );
}
