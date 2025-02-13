import { serial, varchar, text } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";

export const MockInterview = pgTable('interviewerAI', {
    id: serial('id').primaryKey(),
    jsonMockResp: text('jsonMockResp').notNull(),
    jobPosition: varchar('jobPosition', 255).notNull(),
    jobDesc: varchar('jobDesc', 1000).notNull(), 
    jobExperience: varchar('jobExperience', 255).notNull(), 
    createdBy: varchar('createdBy', 255).notNull(),   
    createdAt: varchar('createdAt', 255),        
    mockId: varchar('mockId', 255).notNull()         
});

export const UserAnswer=pgTable('userAnswer',{
    id:serial('id').primaryKey(),
    mockIdRef: varchar('mockId', 255).notNull(),
    question:varchar('question').notNull(),
    correctAns:text('correctAns'),
    userAns:text('userAns'),
    feedback:text('feedback'),
    rating:varchar('rating'),
    userEmail:varchar('userEmail'),
    createdAt:varchar('createdAt')
})