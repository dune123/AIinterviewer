import React from 'react'
import planData from '@/utils/planData'
import { Button } from '@/components/ui/button'

const page = () => {
  return (
    <div className='flex flex-col gap-10 w-full h-full items-center p-10'>
    <div className='flex flex-col items-center gap-4'>
        <h1 className='font-bold text-4xl'>Upgrade</h1>
        <p className='text-gray-500'>upgrade to monthly plan to access unlimited mock interview</p>
        </div>
        <div className='flex gap-6'>
            {
                planData.map((item)=>(
                    <div className='p-10 border border-gray-500 rounded-2xl' key={item.id}>
                        <p className='font-bold'>{item.name}</p>
                        <p><span className='text-4xl font-bold'>{item.cost}$</span>/month</p>
                        <div className='flex flex-col gap-2'>
                        {
                            item.offering.map((para)=>(
                                <p>
                                    {para.value}
                                </p>
                            ))
                        }
                        </div>
                        <Button variant="outline" className='border-primary mt-4 text-primary w-40 text-xl rounded-3xl'>
                            start
                        </Button>
                    </div>
                ))
            }
        </div>
    </div>
  )
}

export default page