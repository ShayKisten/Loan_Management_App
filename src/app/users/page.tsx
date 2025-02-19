"use client";
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { getAllUsers } from '@/actions/user';
import { useToast } from "@/hooks/use-toast"
import { ToastAction } from "@/components/ui/toast"
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FaTrash } from 'react-icons/fa';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog"
import { deleteUserById } from '@/actions/user';

interface UserInterface { 
    id: number;
    firstName: string;
    lastName: string; 
    email: string;
    password: string;
}

export default function UsersPage() {
    const { isLoggedIn } = useAuth();
    const router = useRouter();
    const { toast } = useToast();
    const [AllUsers, setAllUsers] = useState<UserInterface[]>([]);

    useEffect(() => {
        if (!isLoggedIn) {
            router.push('/login');
        }
        loadUsers();
    }, []);

    const loadUsers = async() => {
        let allUsersResponse = await getAllUsers();
        if (allUsersResponse.success && allUsersResponse.users){
            console.log(allUsersResponse.users);
            setAllUsers(allUsersResponse.users);
        }else{
            toast({
                variant: 'destructive',
                title: 'Uh oh! Something went wrong.',
                description: 'There was a problem retrieving all the users.',
                action: <ToastAction altText="Try again" onClick={loadUsers}>Try again</ToastAction>,
            });
        }
    }


    useEffect(() => {
        if (!isLoggedIn) {
            router.push('/login');
        }
    }, [isLoggedIn]);

    const deleteUserClicked = async(id: number) => {
        const deletedUserResponse = await deleteUserById(id);
        if (deletedUserResponse.success){
            toast({
                title: 'Success',
                description: 'The user was deleted successfully.',
            });
            loadUsers();
        }else{
            toast({
                title: 'Uh oh! Something went wrong.',
                description: 'There was a problem deleting the user.',
            });
        }
    }

    return (
        <div className="p-4"> 
            <div className="flex flex-col items-center mb-4 md:flex-row md:justify-between w-full ">
                <h1 className="text-2xl font-bold mb-4">Users</h1>
                <Button className='w-full md:w-[10%]' onClick={() => {router.push('/users/add')}}>New User</Button>
            </div>
            <div className='w-full flex flex-col items-center gap-4 md:grid md:grid-cols-3 md:gap-4'>
                {AllUsers.map((user, index) => {
                    return (
                        <Card key={user.id} className='w-full hover:scale-105 transition-transform duration-200 md:h-full'>
                            <CardHeader>
                                <div className='w-full flex flex-row items-start justify-between'>
                                    <CardTitle>{user.firstName} {user.lastName}</CardTitle>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <FaTrash className='cursor-pointer'/>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>You are about to delete a user.</DialogTitle>
                                                <DialogDescription>Are you sure you want to delete this user?</DialogDescription>
                                            </DialogHeader>
                                            <div className='flex flex-col items-center gap-4 md:flex-row md:item-center md:justify-evenly'>
                                                <DialogClose asChild>
                                                    <Button className='w-full'>Cancel</Button>
                                                </DialogClose>
                                                <DialogClose asChild>
                                                    <Button className='w-full' variant='destructive' onClick={() => {deleteUserClicked(user.id)}}>Delete User</Button>
                                                </DialogClose>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                                <CardDescription>{user.email}</CardDescription>
                            </CardHeader>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}