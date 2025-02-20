"use server";
import { PrismaClient } from '@prisma/client';
import { GoogleGenerativeAI } from '@google/generative-ai';

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

export const generateLoanProductAI = async(userPrompt: string, loanProduct: LoanProductInterface) => {
    const API_KEY = process.env.GEMINI_API_KEY;
    if (!API_KEY){
        return {success: false, response: 'You have not set up your API key.'};
        
    }
    try {
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const prompt = `Create a loan product. Here is some initial information: ${JSON.stringify(loanProduct)} ${userPrompt} Return the result as a JSON object with the following structure: {"loanProduct": {"name": "string","description": "string","interestRate": "number","term": "number","maxAmount": "number","minAmount": "number | 0","type": "string ("Personal Loan" or "Business Loan" or "Vehicle Loan" or "Mortgage" or "Flash Loan")","status": "string ('Active' or 'Inactive')","initiationFee": "number","otherFee": "number | 0"},"message": "string"} Fill in or update the missing fields in the loanProduct object based on the user prompt.  The 'status' field *must* be either 'Active' or 'Inactive'. The 'type' field *must* be either 'Personal Loan' or 'Business Loan' or 'Vehicle Loan' or 'Mortgage' or 'Flash Loan'. Do not assume any values, only use what is provided. If any other required fields are missing, provide a message in the "message" field indicating the *next* missing field. If all fields are complete, the message should be "Would you like to create this product?". Return the response in plain text without the formatting or backticks.`;
        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
        });
        if (result.response.candidates){
            const responseText = result.response.candidates[0].content.parts[0].text;
            let cleanedResponseText = responseText?.replace(/```json\n|\`\`\`|\`|json/g, '');
            cleanedResponseText = cleanedResponseText?.trim();
            const parsedResponse = JSON.parse(cleanedResponseText!);
            if ('loanProduct' in parsedResponse && 'message' in parsedResponse) {
                return { success: true, response: parsedResponse };
            } else {
                return {success: false, response: 'An error has occured generating a response.'};
            }
        }else{
            return {success: false, response: 'An error has occured generating a response.'};
        }
        
    } catch (error) {
        console.error("Gemini API error:", error);
        return {success: false, response: 'An error has occured generating a response.'};
    }
}