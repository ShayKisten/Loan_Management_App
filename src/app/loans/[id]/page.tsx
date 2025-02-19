"use client";
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import { cn } from "@/lib/utils" 
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { updateLoanProductById, getLoanProductById, deleteLoanProductById } from '@/actions/loan';
import { FaArrowLeft } from 'react-icons/fa';

interface Loan {
    id: number;
    name: string;
    description: string | null; 
    interestRate: number;
    term: number;
    maxAmount: number;
    minAmount: number | null;
    type: string;
    status: string;
    initiationFee: number;
    otherFee: number | null;
}

export default function EditLoanPage() {
    const { isLoggedIn } = useAuth();
    const { toast } = useToast();
    const params = useParams();
    const router = useRouter();
    const [NewLoan, setNewLoan] = useState<Loan>({
        id: -1,
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
    useEffect(() => {
        if (!isLoggedIn) {
            router.push('/login');
        }
        getLoan();
    }, []);

    const getLoan = async() => {
        const { id } = params;
        const getLoanResponse = await getLoanProductById(Number(id));
        if (getLoanResponse.success && getLoanResponse.loanProduct){
            setNewLoan(getLoanResponse.loanProduct);
        }else{
            toast({
                variant: 'destructive',
                title: 'Uh oh! Something went wrong.',
                description: 'There was a problem retrieving the loan.',
            });
            router.push('/loans');
        }
    }

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
        if (NewLoan.minAmount! < 0){
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
        if (NewLoan.otherFee! < 0){
            toast({
                variant: 'destructive',
                title: 'Invalid Entry',
                description: 'Other fees cannot be negative',
            });
            return false;
        }
        return true
    }

    const updateLoanProductClicked = async() => {
        if(!validateLoanData()){
            return;
        }
        const updatedProductResponse = await updateLoanProductById(Number(params.id), NewLoan);
        if (!updatedProductResponse.success){
            toast({
                variant: 'destructive',
                title: 'Uh oh! Something went wrong.',
                description: updatedProductResponse.error,
            });
            return
        }else{
            toast({
                title: 'Success',
                description: 'Loan Product Updated Successfully',
            });
            router.push('/loans');
        }

    }

    const deleteLoanProductClicked = async() => {
        const deleteLoanProductResponse = await deleteLoanProductById(Number(params.id));
        if (!deleteLoanProductResponse.success){
            toast({
                variant: 'destructive',
                title: 'Uh oh! Something went wrong.',
                description: deleteLoanProductResponse.error,
            });
            return
        }else{
            toast({
                title: 'Success',
                description: 'Loan Product Deleted Successfully',
            });
            router.push('/loans');
        }
    }


    return (
        <div className="p-4"> 
            <div className="flex items-center mb-4"> 
                <button onClick={() => {router.push('/loans')}} className="mr-2"> 
                    <FaArrowLeft />
                </button>
                <h1 className="text-2xl font-bold">Update Loan</h1>
            </div>

            <div className="flex justify-center items-center h-full">
                <Card className={cn("w-full md:w-[80%] md:flex-row", "md:items-start")}>
                    <CardHeader className="text-center">
                        <CardTitle>Update Loan</CardTitle>
                    </CardHeader>
                    <CardContent className="md:grid md:grid-cols-2 md:gap-5 overflow-scroll">
                        <div className="col-span-2">
                            <label htmlFor='name' className="block text-xs font-medium text-gray-700 mb-[5px]">Loan Name*</label>
                            <Input type='text' placeholder='Loan Name' id='name' value={NewLoan.name} onChange={loanValueChanged} />
                        </div>
                        <div className="col-span-2">
                            <label htmlFor='description' className="block text-xs font-medium text-gray-700 mb-[5px]">Loan Description*</label>
                            <Textarea placeholder='Loan Description' className="col-span-2" id='description' value={NewLoan.description || ''}  onChange={loanValueChanged}/>
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
                            <Input type='number' placeholder='Min Amount' className="w-full" id='minAmount' value={NewLoan.minAmount?.toString() || 0} onChange={loanValueChanged} />
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
                            <Input type='number' placeholder='Other Fees' className="w-full" id='otherFee' value={NewLoan.otherFee?.toString() || 0} onChange={loanValueChanged} />
                        </div>
                        {/* <div className="mt-5">
                            <Button className='w-full' variant='destructive' onClick={createLoanProductClicked}>Delete Loan</Button>
                        </div> */}
                        <div className="mt-5">
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button className='w-full' variant='destructive'>Delete Loan</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>You are about to delete a loan.</DialogTitle>
                                    <DialogDescription>Are you sure you want to delete this loan?</DialogDescription>
                                </DialogHeader>
                                <div className='flex flex-col items-center gap-4 md:flex-row md:item-center md:justify-evenly'>
                                    <DialogClose asChild>
                                        <Button className='w-full'>Cancel</Button>
                                    </DialogClose>
                                    <DialogClose asChild>
                                        <Button className='w-full' variant='destructive' onClick={deleteLoanProductClicked}>Delete Loan</Button>
                                    </DialogClose>
                                </div>
                            </DialogContent>
                        </Dialog>
                        </div>
                        <div className="mt-5">
                            <Button className='w-full' onClick={updateLoanProductClicked}>Save</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}