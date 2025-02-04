"use server";
import bcrypt from "bcryptjs";
import { prismaClient } from "@/lib/prismaClient";
import { SignupSchema, SignupSchemaType } from "@/lib/schema/auth.schema";

export const registerUser = async (user: SignupSchemaType) => {
  const result = SignupSchema.safeParse(user);

  if (!result.success) {
    return { success: false, message: "Invalid credentials" };
  }

  const userAlreadyExist = await prismaClient.user.findFirst({
    where: {
      email: result.data.email,
    },
  });

  if (userAlreadyExist) {
    return { success: false, message: "User already exist!" };
  }

  const hashedPwd = await bcrypt.hash(result.data.password, 10);

  try {
    await prismaClient.user.create({
      data: {
        email: result.data.email,
        password: hashedPwd,
        name: result.data.name,
        verifiedAt: new Date(),
      },
    });
  } catch { 
    return { message: "Please try again!", success: false };
  }

  return { message: "User created!", success: true };
};
