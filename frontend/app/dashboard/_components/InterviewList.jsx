"use client";

import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import { eq, desc } from 'drizzle-orm';
import React, { useEffect, useState } from 'react';
import InterviewItemCard from './InterviewItemCard';

const InterviewList = () => {
  const { user } = useUser();
  const [interviewList, setInterviewList] = useState([]);
  
  const GetInterviewList = async () => {
    try {
      if (!user?.primaryEmailAddress?.emailAddress) {
        console.warn("User email is not available yet.");
        return;
      }
      const result = await db
        .select()
        .from(MockInterview)
        .where(eq(MockInterview.createdBy, user.primaryEmailAddress.emailAddress))
        .orderBy(desc(MockInterview.id));
     
      setInterviewList(result);
    } catch (error) {
      console.error("Error fetching interview list:", error);
    }
  };

  useEffect(() => {
    if (user) {
      GetInterviewList();
    }
  }, [user]); // Dependency on `user`

  return (
    <div>
      <h2 className="font-medium text-xl">Previous Mock Interview</h2>
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 my-3'>
      {interviewList.length > 0 ? (
        interviewList.map((interview,index) => (
            <InterviewItemCard
             key={index} 
             interview={interview}
             />
        ))
      ) : (
        <p>No interviews found</p>
      )}
      </div>
    </div>
  );
};

export default InterviewList;
