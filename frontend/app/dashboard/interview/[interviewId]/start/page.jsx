"use client";
import { MockInterview } from '@/utils/schema';
import React, { useEffect, useState } from 'react';
import { db } from '@/utils/db';
import { eq } from 'drizzle-orm';
import QuestionSection from './_components/QuestionSection';
import RecordAnsSection from './_components/RecordAnsSection';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const StartInterview = ({ params }) => {
  const [interviewData,setInterviewData]=useState(null);
  const [mockInterviewQuestions, setMockInterviewQuestions] = useState([]);
  const [activeQuestion, setActiveQuestion] = useState(0);

  /* Used to Get Interview Details by MockId/Interviews Id */
 /* const GetInterviewDetails = async () => {
    try {
      const result = await db
        .select()
        .from(MockInterview)
        .where(eq(MockInterview.mockId, params.interviewId));
      
      console.log(result);
      if (result.length === 0 || !result[0].jsonMockResp) {
        console.error("No interview data found or jsonMockResp is undefined.");
        setMockInterviewQuestions([]); // Set to an empty array if data is invalid
        return;
      }
  
      const parsedQuestions = JSON.parse(result[0].jsonMockResp);
      console.log(parsedQuestions);
      if (!Array.isArray(parsedQuestions)) {
        console.error("Parsed questions are not an array.");
        setMockInterviewQuestions([]);
        //return;
      }
  
      setInterviewData(result[0]);
      setMockInterviewQuestions(parsedQuestions.interview_questions);
      console.log(mockInterviewQuestions);
    } catch (error) {
      console.error("Error fetching interview details:", error);
      setMockInterviewQuestions([]); // Fallback to an empty array in case of error
    }
  };*/

  const GetInterviewDetails = async () => {
    try {
      const [interview] = await db
        .select()
        .from(MockInterview)
        .where(eq(MockInterview.mockId, params.interviewId));
  
      if (!interview?.jsonMockResp) {
        console.error("No interview data found or 'jsonMockResp' is missing.");
        setMockInterviewQuestions([]);
        return;
      }
  
      let parsed;
      try {
        parsed = JSON.parse(interview.jsonMockResp);
      } catch (parseError) {
        console.error("Failed to parse 'jsonMockResp':", parseError);
        setMockInterviewQuestions([]);
        return;
      }
  
      if (!Array.isArray(parsed?.interview_questions)) {
        console.error("'interview_questions' is not a valid array.");
        setMockInterviewQuestions([]);
        return;
      }
  
      setInterviewData(interview);
      setMockInterviewQuestions(parsed.interview_questions);
    } catch (error) {
      console.error("Error fetching interview details:", error);
      setMockInterviewQuestions([]);
    }
  };
  useEffect(() => {
    GetInterviewDetails();
  }, [params.interviewId]);

 

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Questions */}
        <QuestionSection
          mockInterviewQuestion={mockInterviewQuestions}
          activeQuestion={activeQuestion}
        />

        {/* Video/ Audio Recording */}
        <RecordAnsSection
          mockInterviewQuestion={mockInterviewQuestions}
          activeQuestion={activeQuestion}
          interviewData={interviewData}
        />
      </div>
      <div className='flex justify-end gap-6'>
       {activeQuestion>0&&<Button onClick={()=>setActiveQuestion(activeQuestion-1)}>Previous Question</Button>}
       {activeQuestion!=mockInterviewQuestions?.length-1&&<Button onClick={()=>setActiveQuestion(activeQuestion+1)}>Next Question</Button>}
       {activeQuestion==mockInterviewQuestions?.length-1&& 
       <Link href={'/dashboard/interview/'+interviewData?.mockId+"/feedback"}>
          <Button>End Interview</Button>
       </Link>}
      </div>
    </div>
  );
};

export default StartInterview;
