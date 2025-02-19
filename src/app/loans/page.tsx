"use client";
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { getAllLoanProducts } from '@/actions/loan';
import { useToast } from "@/hooks/use-toast"
import { ToastAction } from "@/components/ui/toast"
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface LoanProductInterface { 
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

export default function LoansPage() {
    const { isLoggedIn } = useAuth();
    const router = useRouter();
    const { toast } = useToast();
    const [AllLoans, setAllLoans] = useState<LoanProductInterface[]>([]);

    useEffect(() => {
        if (!isLoggedIn) {
            router.push('/login');
        }
        loadLoans();
    }, []);

    const loadLoans = async() => {
        let allLoansResponse = await getAllLoanProducts();
        if (allLoansResponse.success && allLoansResponse.loanProducts){
            setAllLoans(allLoansResponse.loanProducts);
            
        }else{
            toast({
                variant: 'destructive',
                title: 'Uh oh! Something went wrong.',
                description: 'There was a problem retrieving all the loans.',
                action: <ToastAction altText="Try again" onClick={loadLoans}>Try again</ToastAction>,
            });
        }
    }

    useEffect(() => {
        if (!isLoggedIn) {
            router.push('/login');
        }
    }, [isLoggedIn]);

    return (
        <div className="p-4"> 
            <div className="flex flex-col items-center mb-4 md:flex-row md:justify-between w-full ">
                <h1 className="text-2xl font-bold mb-4">Loans</h1>
                <Button className='w-full md:w-[10%]' onClick={() => {router.push('/loans/add')}}>New Loan</Button>
            </div>
            <div className='w-full flex flex-col items-center gap-4 md:grid md:grid-cols-3 md:gap-4'>
                {AllLoans.map((loan, index) => {
                    const statusIndicator = () => {
                        return (
                            <div className={`w-[10px] h-[10px] rounded-full ${loan.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        );
                    };
                    return (
                        <Card key={loan.id} className='w-full hover:scale-105 transition-transform duration-200 cursor-pointer md:h-full' onClick={() => {router.push(`/loans/${loan.id}`)}}>
                            <CardHeader>
                                <div className='w-full flex flex-row items-start justify-between'>
                                    <CardTitle>{loan.name}</CardTitle>
                                    {statusIndicator()}
                                </div>
                                <CardDescription>{loan.description}</CardDescription>
                                <Separator />
                            </CardHeader>
                            <CardContent className='flex flex-col gap-1'>
                                <b>Loan Type</b>
                                <div className='w-full flex flex-row items-center justify-between'>
                                    <p>Interest Rate: <b>{loan.interestRate}%</b></p>
                                    <p>Loan Term: <b>{loan.term} Months</b></p>
                                </div>
                                <div className='w-full flex flex-row items-center justify-between'>
                                    <p>Min Amount: <b>{loan.maxAmount}</b></p>
                                    <p>Max Amount: <b>{loan.minAmount || 0}</b></p>
                                </div>
                                <div className='w-full flex flex-row items-center justify-between'>
                                    <p>Initiation Fee: <b>{loan.initiationFee}</b></p>
                                    <p>Other Fee: <b>{loan.otherFee}</b></p>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}