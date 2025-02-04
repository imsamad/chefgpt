"use server";

import { authOptions } from "@/lib/authOptions";
import { prismaClient } from "@/lib/prismaClient";
import { RecipeRating, SavedRecipes } from "@prisma/client";
import { getServerSession } from "next-auth";

export const getUserState = async ({
  savedRecipes,
  ratedRecipes,
}: {
  savedRecipes: boolean;
  ratedRecipes: boolean;
}) => {
  const data: { savedRecipes: SavedRecipes[]; ratedRecipes: RecipeRating[] } = {
    savedRecipes: [],
    ratedRecipes: [],
  };
  const session = await getServerSession(authOptions);
  if (!session || !session!.user || !session!.user.id) {
    return data;
  }

  if (savedRecipes) {
    try {
      const tmp = await prismaClient.savedRecipes.findMany({
        where: { userId: session.user.id },
      });
      data.savedRecipes = tmp;
    } catch {}
  }

  if (ratedRecipes) {
    try {
      const tmp = await prismaClient.recipeRating.findMany({
        where: { userId: session.user.id },
        include: {
          recipe: true,
        },
      });
      data.ratedRecipes = tmp;
    } catch {}
  }

  return data;
};
