import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'

const InterviewItemCard = ({interview}) => {
  const router=useRouter();

  const onStart=()=>{
    router.push('/dashboard/interview/'+interview?.mockId)
  }

  const onFeedback=()=>{
    router.push('/dashboard/interview/'+interview?.mockId+"/feedback");
  }
  return (
    <div className='border-2 shadow-sm rounded-lg p-3'>
      <h2 className='font-bold text-primary'>{interview?.jobPosition}</h2>
      <h2 className='text-sm text-gray-600'>{interview?.jobExperience} Years of Experience</h2>
      <h2 className='text-xs text-gray-400'>Created At:{interview.createdAt}</h2>
      <div className='flex justify-between gap-5 mt-2'>
        <Button 
        className="w-full" size="sm"
        onClick={onFeedback} 
        variant="outline">
          Feedback
        </Button>
        <Button 
        size="sm" 
        onClick={onStart}
        className="w-full">Start</Button>
      </div>
    </div>
  )
}

export default InterviewItemCard