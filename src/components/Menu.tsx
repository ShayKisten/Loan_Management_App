"use client";

import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { FaBars, FaUsers, FaDollarSign } from 'react-icons/fa';
import { MdLogout, MdLogin } from 'react-icons/md';
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { Button } from './ui/button';

export default function Menu() {
  const { isLoggedIn, logout } = useAuth();

  return (
    <>
      <nav className="flex md:hidden gap-5">
        <Drawer>
          <DrawerTrigger asChild>
            <button>
              <FaBars className='text-white text-[20px]'/>
            </button>
          </DrawerTrigger>
          <DrawerContent>
            <div className='mx-auto w-full max-w-sm'>
              <DrawerHeader>
                <DrawerTitle className='text-xl hidden'>Menu</DrawerTitle>
              </DrawerHeader>
              <div className='w-full flex flex-row items-center justify-evenly gap-5'>
                {isLoggedIn ? 
                <DrawerClose asChild>
                  <Link href="/users" className='text-lg flex flex-col items-center justify-center'>
                    <FaUsers />
                    Users
                  </Link>
                </DrawerClose>
                :null}
                {isLoggedIn ? 
                <DrawerClose asChild>
                  <Link href="/loans" className='text-lg flex flex-col items-center justify-center'>
                    <FaDollarSign />
                    Loans
                  </Link>
                </DrawerClose>
                :null}
                {isLoggedIn ? 
                <DrawerClose asChild>
                  <div onClick={logout} className='text-lg flex flex-col items-center justify-center'>
                    <MdLogout />
                    Logout
                  </div>
                </DrawerClose>
                :
                <DrawerClose asChild>
                  <Link href="/login" className='text-lg flex flex-col items-center justify-center'>
                    <MdLogin />
                    Login
                  </Link>
                </DrawerClose>}
              </div>
            </div>
            
          </DrawerContent>
        </Drawer>
      </nav>

      <nav className="hidden md:flex gap-5">
        {isLoggedIn ? <Link href="/users">Users</Link>:null}
        {isLoggedIn ? <Link href="/loans">Loans</Link>:null}
        {isLoggedIn ? <p className="cursor-pointer" onClick={logout}>Logout</p>:<Link href="/login">Login</Link>}
      </nav>
    </>
  );
}