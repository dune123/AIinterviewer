import Webcam from "react-webcam";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import useSpeechToText from "react-hook-speech-to-text";
import { Mic, StopCircle } from "lucide-react";
import { toast } from "sonner";
import { chatSession } from "@/utils/GeminiAIModel";
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import { db } from "@/utils/db";
import { UserAnswer } from "@/utils/schema";

const RecordAnsSection = ({
  mockInterviewQuestion,
  activeQuestion,
  interviewData,
}) => {
  const [userAnswer, setUserAnswer] = useState("");
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
 
  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
    setResults,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

  useEffect(() => {
    results.map((result) =>
      setUserAnswer((prevAns) => prevAns + result?.transcript)
    );
  }, [results]);

  useEffect(() => {
    if (!isRecording && userAnswer.length > 10) {
      UpdateUserAnswer();
    }
  }, [userAnswer]);

  const StartStopRecording = async () => {
    if (isRecording) {
      stopSpeechToText();
      if (userAnswer?.length < 10) {
        setLoading(false);
        toast("Error while saving your answer, Please record again");
        return;
      }
    } else {
      startSpeechToText();
    }
  };

  /* const UpdateUserAnswer=async()=>{
        console.log(userAnswer);
        setLoading(true);
        const feedbackPrompt="Question: "+mockInterviewQuestion[activeQuestion]?.question+", User Answer:"+userAnswer+",Depends on question and user answer for given interview question Please give us rating for answer and feedback as area of improvement "+"in just 3 to 5 line to improve it in JSON format with rating field and feedback field"

            const result=await chatSession.sendMessage(feedbackPrompt);

            const mockJsonResp=(result.response.text()).replace("```json", "").replace("```", "");;

            console.log(mockJsonResp);
            const JsonFeedbackResp=JSON.parse(mockJsonResp);

            const resp=await db.insert(userAnswer)
            .values({
                mockIdRef:interviewData?.mockId,
                question:mockInterviewQuestion[activeQuestion]?.question,
                correctAns:mockInterviewQuestion[activeQuestion]?.answer,
                userAns:userAnswer,
                feedback:JsonFeedbackResp?.feedback,
                rating:JsonFeedbackResp?.rating,
                userEmail:user?.primaryEmailAddress?.emailAddress,
                createdAt:moment().format('DD-MM-YYYY'),
            })

            if(resp){
                toast('User Answer recorded successfully')
                setUserAnswer('');
                setResults([]);
            }
            setResults([]);
            setLoading(false);
    }*/

  const UpdateUserAnswer = async () => {
    try {
      console.log("User Answer:", userAnswer);
      console.log("Interview Data:", interviewData); // Debugging: Log the data structure
      setLoading(true);
      const mockId=interviewData.mockId;
      // Construct feedback prompt
      const feedbackPrompt = `Question: ${mockInterviewQuestion[activeQuestion]?.question}, User Answer: ${userAnswer}. Based on the question and user answer, provide a rating and feedback for improvement in JSON format with fields 'rating' and 'feedback'.`;

      // Call chat session
      const result = await chatSession.sendMessage(feedbackPrompt);

      // Parse the result
      const responseText = await result.response.text();
      const sanitizedResponse = responseText.replace(/```json|```/g, "").trim();
      let JsonFeedbackResp=JSON.parse(sanitizedResponse);
      console.log(JsonFeedbackResp);

      // Insert into the database
      const resp = await db.insert(UserAnswer).values({
        mockIdRef: mockId || "unknown-mock-id",
        question:
          mockInterviewQuestion[activeQuestion]?.question ||
          "No question provided",
        correctAns:
          mockInterviewQuestion[activeQuestion]?.answer ||
          "No correct answer available",
        userAns: userAnswer || "No user answer",
        feedback: JsonFeedbackResp?.feedback || "No feedback provided.",
        rating: JsonFeedbackResp?.rating || 0,
        userEmail:
          user?.primaryEmailAddress?.emailAddress || "anonymous@example.com",
        createdAt: moment().format("YYYY-MM-DD"),
      });

      console.log("response",resp);
      if (resp) {
        toast("User Answer recorded successfully");
        setUserAnswer("");
        setResults([]);
      }
    } catch (error) {
      console.error("Error saving user answer:", error.message || error);
      toast(`Failed to save user answer: ${error.message || "Unknown error"}`);
    } finally {
      setResults([]);
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center flex-col">
      <div className="flex flex-col my-10 justify-center items-center rounded-lg p-5 bg-black">
        <Image
          src={"/webcam.png"}
          width={200}
          height={200}
          className="absolute"
          alt=""
        />
        <Webcam
          mirrored="true"
          style={{
            height: 300,
            width: "100%",
            zIndex: 10,
          }}
        />
      </div>
      <Button disabled={loading} variant="outline" onClick={StartStopRecording}>
        {isRecording ? (
          <h2 className="text-red-600">
            <StopCircle />
            Stop Recording
          </h2>
        ) : (
          <h2 className="text-primary flex items-center">
            <Mic /> Record Answer
          </h2>
        )}
      </Button>
    </div>
  );
};

export default RecordAnsSection;
