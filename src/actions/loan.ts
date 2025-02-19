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

export const getLoanProductById = async(id: number) => {
    try {
        const loanProduct = await prisma.loanProduct.findUnique({
            where: { 
                id 
            }
        })
        if (loanProduct){
            const plainLoanProduct = {
                ...loanProduct,
                interestRate: loanProduct.interestRate.toNumber(),
                maxAmount: loanProduct.maxAmount.toNumber(),
                minAmount: loanProduct.minAmount ? loanProduct.minAmount.toNumber() : 0,
                initiationFee: loanProduct.initiationFee.toNumber(),
                otherFee: loanProduct.otherFee ? loanProduct.otherFee.toNumber() : 0,
            }
            return { success: true, loanProduct: plainLoanProduct };
        }
        return { success: false, error: 'Loan product not found'};
        
    } catch (error) {
        console.error("Loan Product Retrieval Error:", error);
        return { success: false, error: 'Failed to retrieve loan product' };
    }
}

export const updateLoanProductById = async(id: number, loanProductData: LoanProductInterface) => {
    try {
        const loanProduct = await prisma.loanProduct.update({
            where: { id },
            data: loanProductData
        })
        if (loanProduct){
            const plainLoanProduct = {
                ...loanProduct,
                interestRate: loanProduct.interestRate.toNumber(),
                maxAmount: loanProduct.maxAmount.toNumber(),
                minAmount: loanProduct.minAmount ? loanProduct.minAmount.toNumber() : 0,
                initiationFee: loanProduct.initiationFee.toNumber(),
                otherFee: loanProduct.otherFee ? loanProduct.otherFee.toNumber() : 0,
            }
            return { success: true, loanProduct: plainLoanProduct };
        }
        return { success: false, error: 'Loan product update failed'};
    } catch (error) {
        console.error("Loan Product Update Error:", error);
        return { success: false, error: 'Failed to update loan product' };
    }
}

export const deleteLoanProductById = async(id: number) => {
    try {
        let loanProduct = await prisma.loanProduct.delete({
            where: { 
                id 
            }
        })
        if (loanProduct){
            const plainLoanProduct = {
                ...loanProduct,
                interestRate: loanProduct.interestRate.toNumber(),
                maxAmount: loanProduct.maxAmount.toNumber(),
                minAmount: loanProduct.minAmount ? loanProduct.minAmount.toNumber() : 0,
                initiationFee: loanProduct.initiationFee.toNumber(),
                otherFee: loanProduct.otherFee ? loanProduct.otherFee.toNumber() : 0,
            }
            return { success: true, loanProduct: plainLoanProduct };
        }
        return { success: false, error: 'Loan product delete failed'};
    } catch (error) {
        console.error("Loan Product Delete Error:", error);
        return { success: false, error: 'Failed to delete loan product' };
    }
}