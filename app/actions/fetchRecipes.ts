"use server";

import { prismaClient } from "@/lib/prismaClient";
import { DietaryType } from "@prisma/client/edge";

export const fetchRecipes = async ({
  dietaryPref,
  ingredients,
}: {
  dietaryPref: DietaryType | "BOTH";
  ingredients: string[];
}) => {
  const recipes = await prismaClient.recipe.findMany({
    where: {
      ingredients: {
        some: {
          ingredientId: {
            in: ingredients,
          },
        },
      },
      ...(dietaryPref !== "BOTH" && { dietaryType: dietaryPref }),
    },
  });

  const calculateMatchPercentage = (
    recipeIngredients: string[],
    inputIngredients: string[],
  ): number => {
    const matches = recipeIngredients.filter((id) =>
      inputIngredients.includes(id),
    ).length;
    return (matches / inputIngredients.length) * 100;
  };

  const recipesWithMatch = recipes.map((recipe) => {
    const recipeIngredientIds = recipe.ingredients.map(
      ({ ingredientId }) => ingredientId,
    );
    const matchPercentage = calculateMatchPercentage(
      recipeIngredientIds,
      ingredients,
    );
    return { ...recipe, matchPercentage };
  });

  const sortedRecipes = recipesWithMatch.sort(
    (a, b) => b?.matchPercentage - a?.matchPercentage,
  );

  return sortedRecipes;
};
