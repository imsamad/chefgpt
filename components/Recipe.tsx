"use client";
import { useState } from "react";

import { BookmarkPlus } from "lucide-react";

import { Button } from "@/components/ui/button";

import { useToast } from "@/hooks/use-toast";
import { CounterInput } from "./CounterInput";
import { useSession } from "next-auth/react";
import { saveRecipe } from "@/app/actions/saveRecipe";
import { RecipeForDisplay } from "@/lib/types";
import Link from "next/link";
import { AuthFormDialog } from "./AuthFormDialog";
import { UserCtxWrapper, useUserState } from "@/app/userStateCtx";

export const RecipeCard = ({ recipe }: { recipe: RecipeForDisplay }) => {
  const [servingCount, setServingCount] = useState(1);

  const {
    protein: protienPerServing,
    fats: fatsPerServing,
    carbs: carbsPerServing,
    calories: caloriesPerServing,
  } = recipe.ingredients.reduce(
    (acc, { nutritionalProfile }) => {
      acc.protein += nutritionalProfile.protein;
      acc.fats += nutritionalProfile.fats;
      acc.carbs += nutritionalProfile.carbs;
      acc.calories +=
        nutritionalProfile.protein * 4 +
        nutritionalProfile.carbs * 4 +
        nutritionalProfile.fats * 9;
      return acc;
    },
    { totalMass: 0, protein: 0, fats: 0, carbs: 0, calories: 0 },
  );
  const { toast } = useToast();
  const { status } = useSession();

  const [_isLoadingRecipes, setIsLoading] = useState(false);
  const { savedRecipes, refetchSavedRecipes } = useUserState();
  const handleSave = async () => {
    if (status == "unauthenticated") {
      toast({
        variant: "destructive",
        title: "You are not logged in!",
        action: <AuthFormDialog />,
        duration: Infinity,
      });
      return;
    }
    setIsLoading(true);
    try {
      const res = await saveRecipe({ recipeId: recipe.id });
      toast({
        title: res.message,
      });
      await refetchSavedRecipes();
    } catch (err) {
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200 w-full">
      <div className="flex justify-between items-center">
        <Link href={`/recipes/${recipe.slug}`}>
          <h2 className="text-2xl font-bold text-gray-900">{recipe.title}</h2>
        </Link>
        <Button
          size="sm"
          variant={
            savedRecipes.find((p) => p.recipeId === recipe.id)
              ? "destructive"
              : "default"
          }
          className="my-4"
          onClick={handleSave}
        >
          {savedRecipes.find((p) => p.recipeId === recipe.id)
            ? "Remove"
            : "Add"}
          <BookmarkPlus />
        </Button>
      </div>
      <div className="flex gap-4 justify-between">
        <p className="text-gray-600 text-sm mt-2">{recipe.description}</p>
        <div className="shadow-xs rounded-md px-4 py-2 border-[1px]  items-center text-sm flex flex-col ">
          <p>Servings</p>
          <CounterInput
            count={servingCount}
            increase={() => setServingCount((p) => p + 1)}
            decrease={() => setServingCount((p) => p - 1)}
            min={1}
          />
        </div>
      </div>
      <p className="text-sm text-gray-700 mt-2">
        <span className="font-semibold">Cook Time:</span> {recipe.cookTime} mins
      </p>

      <p
        className={`mt-2 text-xs font-bold px-2 py-1 inline-block rounded ${
          recipe.dietaryType === "VEG"
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800"
        }`}
      >
        {recipe.dietaryType == "NON_VEG" ? "Non Veg" : "Veg"}
      </p>

      <h3 className="mt-4 text-lg font-semibold text-gray-800">Steps:</h3>
      <ol className="list-decimal list-inside text-gray-700 text-sm mt-2 space-y-1">
        {recipe.instructions.map((step, index) => (
          <li key={index}>{step}</li>
        ))}
      </ol>

      <h3 className="mt-4 text-lg font-semibold text-gray-800">
        Required Ingredients:
      </h3>
      <ul className="mt-2 text-sm text-gray-700 space-y-1">
        {recipe.ingredients.map((ing) => (
          <li key={ing.id} className="flex justify-between">
            <span>{ing.title}</span>
            <span className="font-semibold">
              {ing.quantity * servingCount}g
            </span>
          </li>
        ))}
      </ul>
      <h3 className="mt-4 text-lg font-semibold text-gray-800">
        Nutritional Profile:
      </h3>
      <ul className="mt-2 text-sm text-gray-700 space-y-1">
        <li className="flex justify-between">
          <span>Protien</span>
          <span className="font-semibold">
            {(protienPerServing * servingCount).toFixed(2)}g
          </span>
        </li>
        <li className="flex justify-between">
          <span>Fats</span>
          <span className="font-semibold">
            {(fatsPerServing * servingCount).toFixed(2)}g
          </span>
        </li>
        <li className="flex justify-between">
          <span>Carbs</span>
          <span className="font-semibold">
            {(carbsPerServing * servingCount).toFixed(2)}g
          </span>
        </li>

        <li className="flex justify-between">
          <span>Calories</span>
          <span className="font-semibold">
            {(caloriesPerServing * servingCount).toFixed(2)}kcal
          </span>
        </li>
      </ul>
    </div>
  );
};

export const RecipeList = ({
  recipes: _recipes,
  label,
}: {
  recipes: RecipeForDisplay[];
  label?: string;
}) => {
  const [recipes, setRecipes] = useState(
    [..._recipes].sort((a, b) => a.cookTime - b.cookTime),
  );
  const [isAsc, setIsAsc] = useState(true);

  return (
    <UserCtxWrapper>
      <h1 className="text-2xl font-bold text-gray-900 mt-6 ">
        {label ?? "Recipes"}
      </h1>
      <div className="flex flex-end">
        <Button
          variant="secondary"
          size="sm"
          className="max-w-fit my-2 ml-auto"
          onClick={() => {
            setRecipes((r) =>
              [...r].sort((a, b) =>
                isAsc ? a.cookTime - b.cookTime : b.cookTime - a.cookTime,
              ),
            );
            setIsAsc((p) => !p);
          }}
        >
          Sort by Cooking Time {isAsc ? "⬆️" : "⬇️"}
        </Button>
      </div>
      <div className="flex flex-col gap-6">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </UserCtxWrapper>
  );
};
