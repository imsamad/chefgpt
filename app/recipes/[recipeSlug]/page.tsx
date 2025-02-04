import { UserCtxWrapper } from "@/app/userStateCtx";
import { RecipeCard } from "@/components/Recipe";
import { prismaClient } from "@/lib/prismaClient";
import { RecipeForDisplay } from "@/lib/types";

const RecipePage = async ({ params }: any) => {
  const { recipeSlug } = await params;
  const recipe = await prismaClient.recipe.findUnique({
    where: {
      slug: recipeSlug,
    },
  });

  if (!recipe) {
    return <div>Recipe not found!</div>;
  }
  const ingredients = await prismaClient.ingredient.findMany({
    where: {
      id: { in: recipe.ingredients.map((i) => i.ingredientId) },
    },
    select: {
      id: true,
      nutritionalProfile: true,
      title: true,
    },
  });

  const recipeForDisplay: RecipeForDisplay = {
    ...recipe,
    ingredients: recipe.ingredients.map((i) => ({
      ...i,
      id: i.ingredientId,
      title: ingredients.find(({ id }) => id === i.ingredientId)!.title,
      nutritionalProfile: ingredients.find(({ id }) => id === i.ingredientId)!
        .nutritionalProfile,
    })),
  };
  return (
    <div className="max-w-xl py-8">
      <UserCtxWrapper>
        <RecipeCard recipe={recipeForDisplay} />
      </UserCtxWrapper>
    </div>
  );
};
export default RecipePage;
