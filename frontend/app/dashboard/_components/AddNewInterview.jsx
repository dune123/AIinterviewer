"use client"
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { chatSession } from "@/utils/GeminiAIModel";
import { LoaderCircle } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import { MockInterview } from "@/utils/schema";
import { db } from "@/utils/db";

function AddNewInterview() {
  const [openDialog, setOpenDialog] = useState(false);
  const [jobposition, setJobposition] = useState("");
  const [jobdesc, setJobdesc] = useState("");
  const [jobexperience, setJobexperience] = useState("");
  const [loading, setLoading] = useState(false);
  const [jsonRes, setJsonRes] = useState([]);
  const [questions, setQuestions] = useState([]); 
  
  const { user } = useUser();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const InputPrompt=`Job Position: ${jobposition}, Job Description: ${jobdesc}, Years of Experience: ${jobexperience} , Depending upon the job description and years of experience give me ${process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT} interview question with Answer in JSON format, Give us question and answer field on JSON`
    const result = await chatSession.sendMessage(InputPrompt);
    const MockJsonResp = result.response
      .text()
      .replace("```json", "")
      .replace("```", "");

    try {
      // Parse the string into JSON
      const parsedJson = MockJsonResp;

      // Set parsed JSON to state
      setJsonRes(parsedJson);

      // Save to database (optional)
      if (MockJsonResp) {
        const resp = await db
          .insert(MockInterview)
          .values({
            mockId: uuidv4(),
            jsonMockResp: MockJsonResp,
            jobPosition: jobposition,
            jobDesc: jobdesc,
            jobExperience: jobexperience,
            createdBy: user?.primaryEmailAddress?.emailAddress,
            createdAt: moment().format("DD-MM-YYYY"),
          })
          .returning({ mockId: MockInterview.mockId });

        console.log("Inserted ID:", resp);
        if (resp) {
          setOpenDialog(false);
          // Navigate using window.location
          window.location.href = `/dashboard/interview/${resp[0]?.mockId}`;
        }
      }
    } catch (error) {
      console.error("Error parsing JSON:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div
        className="p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all"
        onClick={() => setOpenDialog(true)}
      >
        <h2 className="font-bold text-lg text-center">+ Add New</h2>
      </div>
      <Dialog open={openDialog}>
        <DialogContent className="max-x-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Tell us more about your job interviewing
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={onSubmit}>
            <div>
              <h2>Add details about your job position/role</h2>
              <div className="mt-7 my-2">
                <label>Job Role/Job Position</label>
                <Input
                  type="text"
                  placeholder="Ex. Full stack developer"
                  required
                  onChange={(e) => setJobposition(e.target.value)}
                  value={jobposition}
                />
              </div>
              <div className="my-3">
                <label>Job Description/ Tech Stack (In Short)</label>
                <Textarea
                  type="text"
                  placeholder="Ex. React, Angular, Nodejs"
                  required
                  onChange={(e) => setJobdesc(e.target.value)}
                  value={jobdesc}
                />
              </div>
              <div className="my-3">
                <label>Years of experience</label>
                <Input
                  type="number"
                  placeholder="5"
                  max="100"
                  required
                  onChange={(e) => setJobexperience(e.target.value)}
                  value={jobexperience}
                />
              </div>
            </div>
            <div className="flex gap-4 justify-end mt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setOpenDialog(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <LoaderCircle className="animate-spin" /> Generating from AI
                  </>
                ) : (
                  "Start Interview"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddNewInterview;
