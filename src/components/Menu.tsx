"use client";

import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function Menu() {
  const { isLoggedIn, logout } = useAuth();

  return (
    <nav className="flex space-x-4">
        {isLoggedIn ? <Link href="/users">Users</Link>:null}
        {isLoggedIn ? <Link href="/loans">Loans</Link>:null}
      {isLoggedIn ? <p className="cursor-pointer" onClick={logout}>Logout</p>:<Link href="/login">Login</Link>}
    </nav>
  );
}