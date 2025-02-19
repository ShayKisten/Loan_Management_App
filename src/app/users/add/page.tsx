"use client";
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { cn } from "@/lib/utils" 
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { createUser } from '@/actions/user';
import { FaArrowLeft } from 'react-icons/fa';
const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
const passworsRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
interface User { 
    firstName: string;
    lastName: string; 
    email: string;
    password: string;
}

export default function AddUserPage() {
    const { isLoggedIn } = useAuth();
    const { toast } = useToast();
    const router = useRouter();
    const [NewUser, setNewUser] = useState<User>({
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    });
    const [PasswordFocused, setPasswordFocused] = useState(false);

    useEffect(() => {
        if (!isLoggedIn) {
            router.push('/login');
        }
    }, []);

    useEffect(() => {
        if (!isLoggedIn) {
            router.push('/login');
        }
    }, [isLoggedIn]);


    function userValueChanged(e: React.ChangeEvent<HTMLInputElement>) {
        const { id, value } = e.target;
        setNewUser((prevUser) => {
            return { ...prevUser, [id]: value };
        });
    }

    function validateUserData(){
        if (NewUser.firstName === ''){
            toast({
                variant: 'destructive',
                title: 'Invalid Entry',
                description: 'Please enter a first name',
            });
            return false;
        }
        if (NewUser.lastName === ''){
            toast({
                variant: 'destructive',
                title: 'Invalid Entry',
                description: 'Please enter a last name',
            });
            return false;
        }
        if (NewUser.email === '' || !emailRegex.test(NewUser.email)){
            toast({
                variant: 'destructive',
                title: 'Invalid Entry',
                description: 'Please enter a valid email address',
            });
            return false;
        }
        if (NewUser.password === '' || !passworsRegex.test(NewUser.password)){
            toast({
                variant: 'destructive',
                title: 'Invalid Entry',
                description: 'Please enter a valid password',
            });
            return false;
        }
        return true
    }

    const createUserClicked = async() => {
        if(!validateUserData()){
            return;
        }
        const createdUserResponse = await createUser(NewUser);
        if (!createdUserResponse.success){
            toast({
                variant: 'destructive',
                title: 'Uh oh! Something went wrong.',
                description: createdUserResponse.error,
            });
            return
        }else{
            toast({
                title: 'Success',
                description: 'User Created Successfully',
            });
            router.push('/users');
        }

    }


    return (
        <div className="p-4"> 
            <div className="flex items-center mb-4"> 
                <button onClick={() => {router.push('/users')}} className="mr-2"> 
                    <FaArrowLeft />
                </button>
                <h1 className="text-2xl font-bold">Add User</h1>
            </div>

            <div className="flex justify-center items-center h-full">
                <Card className={cn("w-full md:w-[80%] md:flex-row", "md:items-start")}>
                    <CardHeader className="text-center">
                        <CardTitle>Add User</CardTitle>
                    </CardHeader>
                    <CardContent className="md:grid md:grid-cols-2 md:gap-5 overflow-scroll">
                        <div>
                            <label htmlFor='firstName' className="block text-xs font-medium text-gray-700 mb-[5px]">First Name*</label>
                            <Input type='text' placeholder='First Name' id='firstName' value={NewUser.firstName} onChange={userValueChanged} />
                        </div>
                        <div>
                            <label htmlFor='lastName' className="block text-xs font-medium text-gray-700 mb-[5px]">Last Name*</label>
                            <Input type='text' placeholder='Last Name' id='lastName' value={NewUser.lastName} onChange={userValueChanged} />
                        </div>
                        <div>
                            <label htmlFor='email' className="block text-xs font-medium text-gray-700 mb-[5px]">Email*</label>
                            <Input type='text' placeholder='Email' id='email' value={NewUser.email} onChange={userValueChanged} />
                        </div>
                        <div>
                            <label htmlFor='password' className="block text-xs font-medium text-gray-700 mb-[5px]">Password*</label>
                            <Input type='password' placeholder='Password' id='password' value={NewUser.password} onChange={userValueChanged} onFocus={() => {setPasswordFocused(true);}} onBlur={() => {setPasswordFocused(false);}} />
                            {PasswordFocused ? 
                            <div className='w-full p-5 mt-1 rounded-b-[8px] shadow-lg flex flex-col items-start gap-3'>
                                <p className='text-sm' style={{color: `${/^.{8,}$/.test(NewUser.password) ? 'green' : 'red'}`}}>8 Characters</p>
                                <p className='text-sm' style={{color: `${/^(?=.*[A-Z]).*$/.test(NewUser.password) ? 'green' : 'red'}`}}>Capital Letter</p>
                                <p className='text-sm' style={{color: `${/^(?=.*[a-z]).*$/.test(NewUser.password) ? 'green' : 'red'}`}}>Lowercase Letter</p>
                                <p className='text-sm' style={{color: `${/^(?=.*[@$!%*?&])/.test(NewUser.password) ? 'green' : 'red'}`}}>Special Character</p>
                                <p className='text-sm' style={{color: `${/^(?=.*\d).*$/.test(NewUser.password) ? 'green' : 'red'}`}}>Number</p>
                            </div>
                            :null}
                        </div>
                        
                        <div className="col-span-2 mt-5">
                            <Button className='w-full' onClick={createUserClicked}>Save</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}