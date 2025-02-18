"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Home() {
  const router = useRouter();

  const handleSubscribe = () => {
    router.push("/dashboard");
  };

  return (
    <div>
      <div className="flex justify-center items-center min-h-screen bg-white">
      <div className="text-center p-6 bg-white shadow-xl rounded-xl max-w-xl mx-auto">
        {/* Heading */}
        <h1 className="text-4xl font-bold text-purple-600 mb-4">
          Welcome to AI Interviewer
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Start your journey to get hired. Click below to subscribe and begin your interview!
        </p>

        {/* Subscribe Button */}
        <a href="#subscribe" className="inline-block">
            <Button className="px-6 py-3 bg-purple-600 text-white text-xl font-semibold rounded-lg hover:bg-purple-700 transition-all duration-300" onClick={handleSubscribe}>Subscribe</Button>
        </a>
      </div>
    </div>
   </div>
  );
}