"use client";
import React, { useEffect, useState } from "react";
import Webcam from "react-webcam";
import { Button } from "@/components/ui/button";
import { LuWebcam } from "react-icons/lu";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { Lightbulb } from "lucide-react";
import Link from "next/link";

const Interview = ({ params }) => {
  const [interviewData, setInterviewData] = useState([]);
  const [webCamEnabled, setWebCamEnabled] = useState(false);

  useEffect(() => {
    if (params?.interviewId) {
      console.log(params.interviewId);
      GetInterviewDetails(params.interviewId);
    }
  }, [params]);

  /* Used to Get Interview Details by MockId/Interviews Id */
  const GetInterviewDetails = async (interviewId) => {
    try {
      const result = await db
        .select()
        .from(MockInterview)
        .where(eq(MockInterview.mockId, params.interviewId));

      console.log(result);
      setInterviewData(result[0]); // Update state with the result
    } catch (error) {
      console.error("Error fetching interview details:", error);
    }
  };

  return (
    <div className="my-10">
      <h2 className="font-bold text-2xl">Let's Get Started</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="flex flex-col my-5 gap-5 border p-5 rounded">
          <div className="flex flex-col border p-5 rounded gap-5">
            <h2>
              <strong>Job Role/Job Position: </strong>
              {interviewData.jobPosition}
            </h2>
            <h2>
              <strong>Job Description/Tech Stack: </strong>
              {interviewData.jobDesc}
            </h2>
            <h2>
              <strong>Years of Experience: </strong>
              {interviewData.jobExperience}
            </h2>
          </div>
          <div className="p-5 border rounded-lg border-yellow-300 bg-yellow-100">
            <h2 className="flex gap-2 items-center text-yellow-500">
              <Lightbulb />
              <strong>Information</strong>
            </h2>
            <h2 className="mt-3 text-yellow-500">{process.env.NEXT_PUBLIC_INFORMATION}</h2>
          </div>
        </div>
        <div>
          {webCamEnabled ? (
            <Webcam
              audio={true}
              mirrored={true}
              videoConstraints={{
                width: 300,
                height: 300,
                facingMode: "user",
              }}
              className="border rounded-md"
            />
          ) : (
            <div className="flex flex-col gap-2 items-center">
              <LuWebcam className="h-40 w-40 text-gray-500" />
              <Button className="text-black" onClick={() => setWebCamEnabled(true)}>
                Enable Webcam and Microphone
              </Button>
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-end items-end">
          <Link href={`/dashboard/interview/${params.interviewId}/start`}>
          <Button>Start Interview</Button>
          </Link>
      </div>
    </div>
  );
};

export default Interview;
