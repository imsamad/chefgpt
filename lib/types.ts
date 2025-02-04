import { NutritionalProfile, Recipe } from "@prisma/client";

export type RecipeForDisplay = {
  ingredients: {
    id: string;
    title: string;
    quantity: number;
    nutritionalProfile: NutritionalProfile;
    ingredientId?: string;
    isRequired?: boolean;
  }[];
} & Omit<Recipe, "ingredients">;
