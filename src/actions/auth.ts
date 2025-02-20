"use server";

import { PrismaClient, User } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function userLogin(email: string, password: string) : Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email
      },
    });

    if (user) {
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (passwordMatch) {
        return { success: true, user: user, error: '' };
      }
    }

    return { success: false, user: undefined, error: "Invalid credentials" };
  } catch (error: any) { 
    console.error("Login Error:", error);
    return { success: false, user: undefined, error: error.message };
  }
}
