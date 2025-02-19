"use server";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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

export const createLoanProduct = async(loanProductData: LoanProductInterface) => {
    try {
        const loanProduct = await prisma.loanProduct.create({
            data: loanProductData
        });
        const plainLoanProduct = {
            ...loanProduct,
            interestRate: loanProduct.interestRate.toNumber(),
            maxAmount: loanProduct.maxAmount.toNumber(),
            minAmount: loanProduct.minAmount ? loanProduct.minAmount.toNumber() : 0,
            initiationFee: loanProduct.initiationFee.toNumber(),
            otherFee: loanProduct.otherFee ? loanProduct.otherFee.toNumber() : 0,
        }
        return { success: true, loanProduct: plainLoanProduct };
    } catch (error) {
        console.error("Loan Product Creation Error:", error);
        return { success: false, error: 'Failed to create loan product.' };
    }
}

export const getAllLoanProducts = async() => {
    try {
        const loanProducts = await prisma.loanProduct.findMany();
        const plainLoanProducts = loanProducts.map((loanProduct) => ({
            ...loanProduct,
            interestRate: loanProduct.interestRate.toNumber(),
            maxAmount: loanProduct.maxAmount.toNumber(),
            minAmount: loanProduct.minAmount ? loanProduct.minAmount.toNumber() : 0,
            initiationFee: loanProduct.initiationFee.toNumber(),
            otherFee: loanProduct.otherFee ? loanProduct.otherFee.toNumber() : 0,
        }));
        return { success: true, loanProducts: plainLoanProducts };
    } catch (error) {
        console.error("Loan Products Retrieval Error:", error);
        return { success: false, error: 'Failed to retrieve loan products' };
    }
}