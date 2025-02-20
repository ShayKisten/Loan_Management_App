"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {
    const { login, logout } = useAuth();
    const { toast } = useToast();
    const router = useRouter();
    const [Email, setEmail] = useState('');
    const [Password, setPassword] = useState('');

    useEffect(() => {
        logout();
    }, []);

    const loginClicked = async () => {
        if (Email === '' || Password === '') {
            toast({
                variant: 'destructive',
                title: 'Invalid Login',
                description: 'Please enter your email and password.',
            });
            return;
        }

        const authenticated = await login(Email, Password);
        if (!authenticated) {
            toast({
                variant: 'destructive',
                title: 'Invalid Login',
                description: 'Invalid Credentials.',
            });
            return;
        } else {
            console.log('Login Success');
            router.push('/loans');
        }
    };

    return (
        <div className="flex flex-row justify-center items-center h-full">
            <Card className="w-96">
                <CardHeader className="text-center">
                    <CardTitle>Login</CardTitle>
                    <CardDescription>Enter your credentials</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Input placeholder="Email" type="email" value={Email} onChange={(e) => {setEmail(e.target.value);}} onKeyDown={(e) => {if(e.key === 'Enter'){loginClicked()}}}/>
                    <Input placeholder="Password" type="password" value={Password} onChange={(e) => {setPassword(e.target.value);}} onKeyDown={(e) => {if(e.key === 'Enter'){loginClicked()}}}/>
                    <Button className="w-full" onClick={loginClicked}>Login</Button>
                </CardContent>
            </Card>
        </div>
    );
}