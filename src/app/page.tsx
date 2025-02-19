
"use client";
import { useEffect, useState } from 'react';
import { cn } from "@/lib/utils" 
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { createUser } from '@/actions/user';

interface User { 
  firstName: string;
  lastName: string; 
  email: string;
  password: string;
}
export default function Home() {
  const { toast } = useToast();
  const [PasswordFocused, setPasswordFocused] = useState(false);
  const [NewUser, setNewUser] = useState<User>({
          firstName: '',
          lastName: '',
          email: '',
          password: ''
  });

  function userValueChanged(e: React.ChangeEvent<HTMLInputElement>) {
    const { id, value } = e.target;
    setNewUser((prevUser) => {
        return { ...prevUser, [id]: value };
    });
  }

  const createUserClicked = async() => {
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
            description: 'User Created Successfully, you can log in',
        });
    }
  }
  return (
    <div className="p-4 flex flex-col items-center gap-2">
      <h1 className="text-4xl font-bold">Welcome to the Loan Management Dashboard</h1>
      <h2 className='text-xl'>To get login, click the Login button at the top right of your screen</h2>

      <p className='text-gray-500'>To the team testing this project, please use the this form to create a user so that you can begin assessing this project.</p>
      <p className='text-gray-500'>Please note that I have left out all validations on this form to streamline your testing, however please make sure the db you will be using has been configured.</p>

      <div className="flex justify-center items-center h-full w-full mt-[20px]">
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
