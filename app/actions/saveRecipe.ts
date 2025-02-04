"use server";
import { getServerSession } from "next-auth";
import { prismaClient } from "@/lib/prismaClient";
import { authOptions } from "@/lib/authOptions";

export const saveRecipe = async ({ recipeId }: { recipeId: string }) => {
  const session = await getServerSession(authOptions);
  if (!session || !session!.user || !session!.user.id) {
    return { message: "You are not authorised!", success: false };
  }

  const existingRecord = await prismaClient.savedRecipes.findUnique({
    where: { userId_recipeId: { userId: session.user.id, recipeId } },
  });

  if (existingRecord) {
    await prismaClient.savedRecipes.delete({
      where: { userId_recipeId: { userId: session.user.id, recipeId } },
    });
    return { message: "Recipe is deleted!", success: true };
  } else {
    try {
      await prismaClient.savedRecipes.create({
        data: { userId: session.user.id, recipeId },
      });
    } catch {
      return { message: "Recipe not added, please try again!", success: !true };
    }
  }

  return { message: "Recipe added successfully!", success: true };
};
