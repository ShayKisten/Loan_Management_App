"use client";
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { cn } from "@/lib/utils" 
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import {Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue,} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { createLoanProduct, generateLoanProductAI } from '@/actions/loan';
import { FaArrowLeft } from 'react-icons/fa';
import { CiChat1 } from 'react-icons/ci'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog"

interface Loan {
    name: string;
    description: string;
    interestRate: number;
    term: number;
    maxAmount: number;
    minAmount: number;
    type: string;
    status: string;
    initiationFee: number;
    otherFee: number;
    [key: string]: string | number;
}

export default function AddLoanPage() {
    const { isLoggedIn } = useAuth();
    const { toast } = useToast();
    const router = useRouter();
    const [NewLoan, setNewLoan] = useState<Loan>({
        name: '',
        description: '',
        interestRate: 0,
        term: 1,
        maxAmount: 0,
        minAmount: 0,
        type: '',
        status: 'Active',
        initiationFee: 0,
        otherFee: 0
    });
    const [UserPrompt, setUserPrompt] = useState('');
    const [GeneratingLoan, setGeneratingLoan] = useState(false);

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


    function loanValueChanged(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
        const { id, value } = e.target;
        setNewLoan((prevLoan) => {
            const newValue =  e.target.type === 'number' ? Number(value) : value;
            return { ...prevLoan, [id]: newValue };
        });
    }

    function loanTypeChanged(value: string) {
        setNewLoan((prevLoan) => {
            return { ...prevLoan, type: value };
        })
    }
    function loanStatusChanged(value: string) {
        setNewLoan((prevLoan) => {
            return { ...prevLoan, status: value };
        })
    }

    function validateLoanData(){
        if (NewLoan.name === ''){
            toast({
                variant: 'destructive',
                title: 'Invalid Entry',
                description: 'Please enter a loan name',
            });
            return false;
        }
        if (NewLoan.description === ''){
            toast({
                variant: 'destructive',
                title: 'Invalid Entry',
                description: 'Please enter a loan description',
            });
            return false;
        }
        if (NewLoan.interestRate <= 0){
            toast({
                variant: 'destructive',
                title: 'Invalid Entry',
                description: 'Please enter a valid interest rate',
            });
            return false;
        }
        if (NewLoan.term <= 0){
            toast({
                variant: 'destructive',
                title: 'Invalid Entry',
                description: 'Please enter a valid loan term',
            });
            return false;
        }
        if (NewLoan.maxAmount <= 0){
            toast({
                variant: 'destructive',
                title: 'Invalid Entry',
                description: 'Please enter a valid max amount',
            });
            return false;
        }
        if (NewLoan.minAmount < 0){
            toast({
                variant: 'destructive',
                title: 'Invalid Entry',
                description: 'Min amount cannot be negative',
            });
            return false;
        }
        if (NewLoan.type === ''){
            toast({
                variant: 'destructive',
                title: 'Invalid Entry',
                description: 'Please enter a loan type',
            });
            return false;
        }
        if (NewLoan.status === ''){
            toast({
                variant: 'destructive',
                title: 'Invalid Entry',
                description: 'Please enter a loan status',
            });
            return false;
        }
        if (NewLoan.initiationFee <= 0){
            toast({
                variant: 'destructive',
                title: 'Invalid Entry',
                description: 'Please enter a valid initiation fee',
            });
            return false;
        }
        if (NewLoan.otherFee < 0){
            toast({
                variant: 'destructive',
                title: 'Invalid Entry',
                description: 'Other fees cannot be negative',
            });
            return false;
        }
        return true
    }

    const createLoanProductClicked = async() => {
        if(!validateLoanData()){
            return;
        }
        const createdProductResponse = await createLoanProduct(NewLoan);
        if (!createdProductResponse.success){
            toast({
                variant: 'destructive',
                title: 'Uh oh! Something went wrong.',
                description: createdProductResponse.error,
            });
            return
        }else{
            toast({
                title: 'Success',
                description: 'Loan Product Created Successfully',
            });
            router.push('/loans');
        }

    }

    const generateLoan = async() => {
        if (UserPrompt === ''){
            toast({
                variant: 'destructive',
                title: 'Invalid Entry',
                description: 'Please enter a prompt',
            });
            return;
        }
        setGeneratingLoan(true);
        const generatedLoanResponse = await generateLoanProductAI(UserPrompt, NewLoan);
        if (!generatedLoanResponse.success){
            toast({
                variant: 'destructive',
                title: 'Uh oh! Something went wrong.',
                description: generatedLoanResponse.response,
            });
            setGeneratingLoan(false);
            return
        }else{
            setNewLoan((prevLoan) => {
                return { ...prevLoan, ...generatedLoanResponse.response.loanProduct };
            });
            toast({
                title: 'Success',
                description: 'Loan Product Generated Successfully',
            });
            setGeneratingLoan(false);
            setUserPrompt('');
        }
        console.log(generatedLoanResponse);
    }


    return (
        <div className="p-4"> 
            <div className="flex items-center mb-4"> 
                <button onClick={() => {router.push('/loans')}} className="mr-2"> 
                    <FaArrowLeft />
                </button>
                <h1 className="text-2xl font-bold">Add Loan</h1>
            </div>
            {(!GeneratingLoan)?
            <div className="flex justify-center items-center h-full">
                <Card className={cn("w-full md:w-[80%] md:flex-row", "md:items-start")}>
                    <CardHeader className="text-center">
                        <CardTitle>Add Loan</CardTitle>
                    </CardHeader>
                    <CardContent className="md:grid md:grid-cols-2 md:gap-5 overflow-scroll">
                        <div className="col-span-2">
                            <label htmlFor='name' className="block text-xs font-medium text-gray-700 mb-[5px]">Loan Name*</label>
                            <Input type='text' placeholder='Loan Name' id='name' value={NewLoan.name} onChange={loanValueChanged} />
                        </div>
                        <div className="col-span-2">
                            <label htmlFor='description' className="block text-xs font-medium text-gray-700 mb-[5px]">Loan Description*</label>
                            <Textarea placeholder='Loan Description' className="col-span-2" id='description' value={NewLoan.description}  onChange={loanValueChanged}/>
                        </div>
                        <div>
                            <label htmlFor='interestRate' className="block text-xs font-medium text-gray-700 mb-[5px]">Interest Rate*</label>
                            <Input type='number' placeholder='Interest Rate' className="w-full" id='interestRate' value={NewLoan.interestRate.toFixed(0)} onChange={loanValueChanged} />
                        </div>
                        <div>
                            <label htmlFor='term' className="block text-xs font-medium text-gray-700 mb-[5px]">Term (Months)*</label>
                            <Input type='number' placeholder='Term (Months)' className="w-full" id='term' value={NewLoan.term.toFixed(0)} onChange={loanValueChanged} />
                        </div>
                        <div>
                            <label htmlFor='maxAmount' className="block text-xs font-medium text-gray-700 mb-[5px]">Max Amount*</label>
                            <Input type='number' placeholder='Max Amount' className="w-full" id='maxAmount' value={NewLoan.maxAmount.toString()} onChange={loanValueChanged} />
                        </div>
                        <div>
                            <label htmlFor='minAmount' className="block text-xs font-medium text-gray-700 mb-[5px]">Min Amount</label>
                            <Input type='number' placeholder='Min Amount' className="w-full" id='minAmount' value={NewLoan.minAmount.toString()} onChange={loanValueChanged} />
                        </div>
                        <div>
                            <label htmlFor='type' className="block text-xs font-medium text-gray-700 mb-[5px]">Loan Type*</label>
                            <Select value={NewLoan.type} onValueChange={loanTypeChanged}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a Loan Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Loan Type</SelectLabel>
                                    <SelectItem value='Personal Loan'>Personal Loan</SelectItem>
                                    <SelectItem value='Business Loan'>Business Loan</SelectItem>
                                    <SelectItem value='Vehicle Loan'>Vehicle Loan</SelectItem>
                                    <SelectItem value='Mortgage'>Mortgage</SelectItem>
                                    <SelectItem value='Flash Loan'>Flash Loan</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label htmlFor='status' className="block text-xs font-medium text-gray-700 mb-[5px]">Loan Status*</label>
                            <Select value={NewLoan.status} onValueChange={loanStatusChanged}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a Loan Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Loan Status</SelectLabel>
                                    <SelectItem value='Active'>Active</SelectItem>
                                    <SelectItem value='Inactive'>Inactive</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label htmlFor='initiationFee' className="block text-xs font-medium text-gray-700 mb-[5px]">Initiation Fee*</label>
                            <Input type='number' placeholder='Initiation Fee' className="w-full" id='initiationFee' value={NewLoan.initiationFee.toString()} onChange={loanValueChanged} />
                        </div>
                        <div>
                            <label htmlFor='otherFee' className="block text-xs font-medium text-gray-700 mb-[5px]">Other Fees</label>
                            <Input type='number' placeholder='Other Fees' className="w-full" id='otherFee' value={NewLoan.otherFee.toString()} onChange={loanValueChanged} />
                        </div>
                        <div className="col-span-2 mt-5">
                            <Button className='w-full' onClick={createLoanProductClicked}>Save</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
            :
            <div className="flex flex-col space-y-3">
                <Skeleton className="h-[125px] w-[250px] rounded-xl" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                </div>
            </div>
            }

            <Dialog>
                <DialogTrigger asChild>
                    <div className='absolute flex items-center justify-center cursor-pointer bottom-[30px] right-[30px] p-4 bg-black w-[50px] h-[50px] z-5 rounded-full'>
                        <CiChat1 className='text-white' />
                    </div>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Chat</DialogTitle>
                        <DialogDescription>Provide us with some of the loan details in plain english and let us fill in some of the product fields for you</DialogDescription>
                    </DialogHeader>
                    
                    <div className='flex flex-col items-center gap-5'>
                        <Input type='text' placeholder='Create a loan named...' value={UserPrompt} onChange={(e) => {setUserPrompt(e.target.value);}} />
                        <DialogClose asChild>
                            <Button className='w-full' onClick={generateLoan}>Send</Button>
                        </DialogClose>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}