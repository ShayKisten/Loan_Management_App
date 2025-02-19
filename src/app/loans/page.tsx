"use client";
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { getAllLoanProducts } from '@/actions/loan';
import { useToast } from "@/hooks/use-toast"
import { ToastAction } from "@/components/ui/toast"
import { Button } from '@/components/ui/button';

interface LoanProductInterface { 
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
            // router.push('/login');
        }
        loadLoans();
    }, []);

    const loadLoans = async() => {
        let allLoansResponse = await getAllLoanProducts();
        console.log(allLoansResponse)
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

    // useEffect(() => {
    //     if (!isLoggedIn) {
    //         router.push('/login');
    //     }
    // }, [isLoggedIn]);

    return (
        <div className="p-4"> 
            <div className="flex flex-col items-center mb-4 md:flex-row md:justify-between w-full ">
                <h1 className="text-2xl font-bold mb-4">Loans</h1>
                <Button className='w-full md:w-[10%]'>New Loan</Button>
            </div>
        </div>
    );
}