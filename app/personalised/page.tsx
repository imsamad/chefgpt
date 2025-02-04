import { RecipeList } from "@/components/Recipe";
import { authOptions } from "@/lib/authOptions";
import { prismaClient } from "@/lib/prismaClient";
import { RecipeForDisplay } from "@/lib/types";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const RecommendedRecipePage = async () => {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.id) {
    redirect("/login?next=myrecipes");
  }

  const savedRecipes = await prismaClient.savedRecipes.findMany({
    where: {
      userId: session.user.id,
    },
    select: {
      recipe: true,
    },
  });

  if (savedRecipes.length === 0) {
    return (
      <h1 className="text-2xl text-center my-6 text-red-300">
        You have no recipes saved.
      </h1>
    );
  }
  const ingredientIds = [
    ...new Set(
      savedRecipes.flatMap(({ recipe }) =>
        recipe.ingredients.map((i) => i.ingredientId),
      ),
    ),
  ];

  const recommendedRecipes = await prismaClient.recipe.findMany({
    where: {
      ingredients: {
        some: {
          ingredientId: { in: ingredientIds },
        },
      },
      id: { notIn: savedRecipes.map(({ recipe }) => recipe.id) || [] },
    },
  });

  if (recommendedRecipes.length == 0) {
    return (
      <h1 className="text-2xl text-center my-6 text-red-300">
        We extremely sorry, we do not have personalised for you!
      </h1>
    );
  }
  const ingredients = await prismaClient.ingredient.findMany({
    where: {
      id: {
        in: recommendedRecipes
          .map((r) => r.ingredients.map((i) => i.ingredientId))
          .flat(),
      },
    },
    select: {
      id: true,
      nutritionalProfile: true,
      title: true,
    },
  });
  const recipesForDisplay: RecipeForDisplay[] = recommendedRecipes.map((r) => ({
    ...r,
    ingredients: r.ingredients.map((i) => ({
      ...i,
      id: i.ingredientId,
      title: ingredients.find(({ id }) => id === i.ingredientId)!.title,
      nutritionalProfile: ingredients.find(({ id }) => id === i.ingredientId)!
        .nutritionalProfile,
    })),
  }));
  return (
    <div className="mb-6">
      <RecipeList recipes={recipesForDisplay} label="Recommended For You" />
    </div>
  );
};

export default RecommendedRecipePage;
