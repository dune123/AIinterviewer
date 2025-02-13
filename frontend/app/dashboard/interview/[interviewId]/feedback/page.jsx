"use client";
import { db } from "@/utils/db";
import { eq } from "drizzle-orm";
import { UserAnswer } from "@/utils/schema";
import React, { useEffect, useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const Feedback = ({ params }) => {
  const [feedbackList, setFeedbackList] = useState([]);
  const router=useRouter();

  const GetFeedback = async () => {
    const result = await db
      .select()
      .from(UserAnswer)
      .where(eq(UserAnswer.mockIdRef, params.interviewId))
      .orderBy(UserAnswer.id);

    console.log(result);
    setFeedbackList(result);
  };  

  useEffect(() => {
    GetFeedback();
  }, []);
  return (
    <div className="p-10">
      {feedbackList?.length==0?
      <h2 className="font-bold text-xl text-gray-500">No Interview Feedback Record Found</h2>:
      <>
      <h2 className="text-2xl font-bold text-green-500">Congratulation</h2>
      <h2 className="font-bold text-2xl">Here is your interview feedback</h2>
      <h2 className="text-primary text-lg my-3">
        Your overall interview rating: <strong>7/10</strong>
      </h2>

      <h2 className="text-sm text-gray-500">
        Find below interview question with answer, Your answer and feedback for
        improvement
      </h2>
      {feedbackList &&
        feedbackList.map((item, index) => (
          <Collapsible key={item.mockIdRef} className="mt-7">
            <CollapsibleTrigger className="p-2 flex justify-between bg-secondary rounded-lg my-2 text-left gap-7 w-full">
              {item.question}
              <ChevronsUpDown className="h-5 w-5"/>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="flex flex-col gap-2">
                <h2 className="text-red-500 p-2 rounded-lg"><strong>Rating:</strong>{item.rating}</h2>
                <h2 className="p-2 border rounded-md bg-red-50 text-red-900"><strong>Your Answer:</strong>{item.userAns}</h2>
                <h2 className="p-2 border rounded-md bg-green-50 text-green-900" ><strong>Correct Answer:</strong>{item.correctAns}</h2>
                <h2 className="p-2 border rounded-md bg-blue-50 text-primary" ><strong>Feedback:</strong>{item.feedback}</h2>
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </>
      }
        <Button className="mt-4" onClick={()=>router.replace("/dashboard")}>Go Home</Button>
    </div>
  );
};

export default Feedback;
