"use client"
import React, { useEffect } from 'react'
import Image from 'next/image'
import { UserButton } from '@clerk/nextjs'
import { usePathname } from 'next/navigation'
import { useRouter } from "next/navigation";

const Header = () => {
  const router = useRouter(); 
  const path=usePathname();
  

  return (
    <div className='flex p-4 items-center justify-between bg-secondary shadow-sm'> 
      <Image src={'/logo.svg'} width={160} height={100} alt='logo'/>
      <ul className='hidden md:flex gap-6'>
        <li className={`hover:text-primary hover:font-bold transition-all cursor-pointer ${path=='/dashboard'&&'text-primary font-bold'}`} onClick={()=>{router.push("/dashboard")}}>Dashboard</li>
        <li className={`hover:text-primary hover:font-bold transition-all cursor-pointer ${path=='/dashboard/questions'&&'text-primary font-bold'}`}>Questions</li>
        <li className={`hover:text-primary hover:font-bold transition-all cursor-pointer ${path=='/dashboard/upgrade'&&'text-primary font-bold'}`}
        onClick={()=>{router.push("/dashboard/upgrade")}}>Upgrade</li>
        <li className={`hover:text-primary hover:font-bold transition-all cursor-pointer ${path=='/dashboard/how'&&'text-primary font-bold'}`}>How it Works?</li>
      </ul>
      <UserButton/>
    </div>
  )
}

export default Header