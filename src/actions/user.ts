"use server";
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

interface UserInterface { 
    firstName: string;
    lastName: string; 
    email: string;
    password: string;
}

export const getAllUsers = async() => {
    try {
        const users = await prisma.user.findMany();
        return {success: true, users: users};
    } catch (error) {
        console.error("Users Retrieval Error:", error);
        return { success: false, error: 'Failed to retrieve users' };
    }
}

export const getUserById = async(id: number) => {
    try {
        const user = await prisma.user.findUnique({
            where: { 
                id 
            }
        })
        if (user){
            return { success: true, user: user };
        }
        return { success: false, error: 'User not found'};
        
    } catch (error) {
        console.error("User Retrieval Error:", error);
        return { success: false, error: 'Failed to retrieve user' };
    }
}

export const createUser = async(userData: UserInterface) => {
    try {
        const user = await prisma.user.create({
            data: {
                ...userData,
                password: await bcrypt.hash(userData.password, 12),
                updatedAt: new Date(),
            }
        })
        if (user){
            return {success: true, user: user};
        }
        return {success: false, error: 'Failed to create user'};
    } catch (error) {
        console.error("Users Creation Error:", error);
        return { success: false, error: 'Failed to create user' };
    }
}

export const updateUserById = async(id: number, userData: UserInterface) => {
    try {
        const user = await prisma.user.update({
            where: { id },
            data: userData
        })
        if (user){
            return { success: true, user: user };
        }
        return { success: false, error: 'User update failed'};
    } catch (error) {
        console.error("Users Update Error:", error);
        return { success: false, error: 'Failed to update user' };
    }
}

export const deleteUserById = async(id: number) => {
    try {
        let user = await prisma.user.delete({
            where: { 
                id 
            }
        })
        if (user){
            return { success: true, user: user };
        }
        return { success: false, error: 'User delete failed'};
    } catch (error) {
        console.error("User Delete Error:", error);
        return { success: false, error: 'Failed to delete user' };
    }
}