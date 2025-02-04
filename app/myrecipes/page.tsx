import { RecipeList } from "@/components/Recipe";
import { authOptions } from "@/lib/authOptions";
import { prismaClient } from "@/lib/prismaClient";
import { RecipeForDisplay } from "@/lib/types";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const MyRecipesPage = async () => {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.id) {
    redirect("/login?next=myrecipes");
  }

  const myRecipes = await prismaClient.savedRecipes.findMany({
    where: {
      userId: session.user.id,
    },
    select: {
      recipe: true,
    },
  });

  if (!myRecipes || myRecipes.length === 0) {
    return (
      <h1 className="text-2xl text-center my-6 text-red-300">
        You have no recipes saved.
      </h1>
    );
  }

  const ingredients = await prismaClient.ingredient.findMany({
    where: {
      id: {
        in: myRecipes
          .map((m) =>
            m.recipe.ingredients.map(({ ingredientId }) => ingredientId),
          )
          .flat(),
      },
    },
    select: {
      id: true,
      nutritionalProfile: true,
      title: true,
    },
  });

  const recipesForDisplay: RecipeForDisplay[] = myRecipes.map(
    ({ recipe: r }) => ({
      ...r,
      ingredients: r.ingredients.map((i) => ({
        ...i,
        id: i.ingredientId,
        title: ingredients.find(({ id }) => id === i.ingredientId)!.title,
        nutritionalProfile: ingredients.find(({ id }) => id === i.ingredientId)!
          .nutritionalProfile,
      })),
    }),
  );

  return (
    <div className="mb-6">
      <RecipeList recipes={recipesForDisplay} label="My Recipes" />
    </div>
  );
};

export default MyRecipesPage;
