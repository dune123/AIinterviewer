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
      <h1>Click to suscribe to start the interview</h1>
      <Button onClick={handleSubscribe}>Subscribe</Button>
    </div>
  );
}