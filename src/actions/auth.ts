"use server";

import { PrismaClient, User } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function userLogin(email: string, password: string) : Promise<{ success: boolean; user?: User; error?: string }> {
  console.log('getting user')
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (user) {
      console.log(user);
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

// export async function getAllUsers():Promise<{success: boolean}>{
//   try {
//     console.log('try');
//     const users = await prisma.user.findMany();
//     console.log(users);
//     // const user = await prisma.user.create({
//     //   data: {
//     //       firstName: 'Test',
//     //       lastName: 'User',
//     //       email: 'test@loanmanagement.com',
//     //       password: '$2a$12$s2VUj3qO68QSisOiMiQvIedTgSAyC0APJoz8K9J712hoI6F2ShhGq',
//     //       updatedAt: new Date(),
//     //   }
//     // });
//     return {success: true}
//   } catch (error) {
//     console.log(error);
//     return {success: false}
//   }
// }