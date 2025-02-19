"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const { login, logout } = useAuth();
    const router = useRouter();
    const [Email, setEmail] = useState('');
    const [Password, setPassword] = useState('');
    const [Error, setError] = useState('');

    useEffect(() => {
        logout();
        setError('');
    }, []);

    const loginClicked = async () => {
        if (Email === '' || Password === '') {
            setError('Please enter your username and password.');
            return;
        }

        const authenticated = await login(Email, Password);
        if (!authenticated) {
            setError('Invalid Credentials.');
            return;
        } else {
            console.log('Login Success');
            router.push('/loans');
        }
    };

    return (
        <div className="flex justify-center items-center h-full">
            <Card className="w-96">
                <CardHeader className="text-center">
                    <CardTitle>Login</CardTitle>
                    <CardDescription>Enter your credentials</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Input placeholder="Email" type="email" value={Email} onChange={(e) => {setEmail(e.target.value); setError('');}}/>
                    <Input placeholder="Password" type="password" value={Password} onChange={(e) => {setPassword(e.target.value); setError('');}} />
                    <Button className="w-full" onClick={loginClicked}>Login</Button>
                    {Error && <p className="text-red-500 mt-2">{Error}</p>}
                </CardContent>
            </Card>
        </div>
    );
}