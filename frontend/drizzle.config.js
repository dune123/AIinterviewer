/** @type { import("drizzle-kit").Config }*/
export default{
    schema:"./utils/schema.js",
    dialect:'postgresql',
    dbCredentials:{
        url:'postgresql://interviewerAI_owner:uepyFMN20ibx@ep-wispy-king-a5gah6ku.us-east-2.aws.neon.tech/interviewerAI?sslmode=require'
    }
}