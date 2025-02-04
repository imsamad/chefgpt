"use client";
import { useState } from "react";
import { motion } from "motion/react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import * as React from "react";
import { Check, ChevronsUpDown, MoveLeft, RotateCw } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { fetchRecipes } from "@/app/actions/fetchRecipes";
import { DietaryType, NutritionalProfile } from "@prisma/client";

import { RecipeForDisplay } from "@/lib/types";
import { RecipeList } from "./Recipe";

export default function RecipeGenerator({
  ingredients,
}: {
  ingredients: {
    id: string;
    title: string;
    dietaryType: DietaryType;
    nutritionalProfile: NutritionalProfile;
  }[];
}) {
  const ingredientMapping = React.useMemo(() => {
    return Object.fromEntries(
      ingredients.map((ing) => [
        ing.id,
        { title: ing.title, nutritionalProfile: ing.nutritionalProfile },
      ]),
    );
  }, [ingredients]);

  const { toast } = useToast();
  const [isLoadingRecipes, setIsLoadingRecipes] = useState(false);
  const [step, setStep] = useState(1);
  const [dietaryPref, setDietryPref] = useState<DietaryType | "BOTH">("BOTH");

  const [selectedIngredients, setSelectedIngredients] = React.useState<
    {
      id: string;
      title: string;
    }[]
  >([]);

  const animationVariants = {
    initial: { opacity: 0, x: 20, scale: 0.98 },
    animate: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: { duration: 0.4, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      x: -20,
      scale: 0.98,
      transition: { duration: 0.3, ease: "easeIn" },
    },
  };
  const handleNext = async () => {
    if (step === 1 && !dietaryPref) {
      return toast({
        title: "Select a dietary preference",
        variant: "destructive",
      });
    }
    if (step === 2 && selectedIngredients.length === 0) {
      return toast({
        title: "Select at least one ingredient",
        variant: "destructive",
      });
    }
    if (step === 2) {
      await getRecipes();
    }
    setStep(step + 1);
  };

  const [recipes, setRecipes] = useState<RecipeForDisplay[]>([]);

  const getRecipes = async () => {
    setIsLoadingRecipes(true);
    try {
      const res = await fetchRecipes({
        dietaryPref,
        ingredients: selectedIngredients.map(({ id }) => id),
      });

      const recipesForDisplay = res.map((r) => ({
        ...r,
        ingredients: r.ingredients.map(({ ingredientId, quantity }) => ({
          id: ingredientId,
          title: ingredientMapping[ingredientId].title,
          quantity,
          nutritionalProfile:
            ingredientMapping[ingredientId].nutritionalProfile,
        })),
      }));
      setRecipes(recipesForDisplay);
    } catch (err) {
    } finally {
      setIsLoadingRecipes(false);
    }
  };

  const handleBack = () => {
    setStep((p) => p - 1);
  };

  return (
    <div className="max-w-xl w-full mx-auto p-6 bg-white shadow-lg rounded-lg overflow-hidden mb-8">
      <h1 className="text-3xl text-center font-semibold border-b-2 border-b-gray-500">
        Generate Recipe
      </h1>
      <motion.div
        key={step}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={animationVariants}
        className="flex flex-col h-full"
      >
        {step === 1 && (
          <div className="flex-1 pt-2">
            <h2 className="text-lg font-bold mb-4">
              Step 1: Select prefrences
            </h2>
            <RadioGroup defaultValue="option-one">
              <div className="flex flex-col gap-4 ">
                <div className="flex-1 flex gap-4 ">
                  <RadioGroupItem
                    value="veg"
                    id="veg"
                    checked={dietaryPref == "VEG"}
                    onClick={() => setDietryPref("VEG")}
                  />
                  <label htmlFor="veg" className="cursor-pointer">
                    Vegeterian
                  </label>
                </div>
                <div className="flex-1 flex gap-4 items-center">
                  <RadioGroupItem
                    value="non-veg"
                    id="non-veg"
                    checked={dietaryPref == "NON_VEG"}
                    onClick={() => setDietryPref("NON_VEG")}
                  />
                  <label htmlFor="non-veg" className="cursor-pointer">
                    Non-Vegeterian
                  </label>
                </div>
                <div className="flex-1 flex gap-4 items-center">
                  <RadioGroupItem
                    value="both"
                    id="both"
                    checked={dietaryPref == "BOTH"}
                    onClick={() => setDietryPref("BOTH")}
                  />
                  <label htmlFor="both" className="cursor-pointer">
                    Both
                  </label>
                </div>
              </div>
            </RadioGroup>
          </div>
        )}

        {step === 2 && (
          <div className="flex-1 flex flex-col pt-2">
            <h2 className="text-lg font-bold mb-4">
              Step 2: Select Ingredients
            </h2>

            <IngredientsSelector
              ingredients={ingredients.filter(({ dietaryType }) =>
                dietaryPref == "BOTH" ? true : dietaryType == dietaryPref,
              )}
              selectedIngredients={selectedIngredients}
              setSelectedIngredients={setSelectedIngredients}
            />

            <div className="flex gap-2 flex-wrap mt-4 justify-start">
              {selectedIngredients.map((ingr) => (
                <IngredientBadge
                  title={ingr.title}
                  key={ingr.id}
                  removeIngredient={() => {
                    setSelectedIngredients((p) =>
                      p.filter(({ id }) => id != ingr.id),
                    );
                  }}
                />
              ))}
            </div>
          </div>
        )}
        {step == 3 && (
          <>
            <div className="flex justify-between mt-2">
              <Button
                size="sm"
                variant="outline"
                disabled={isLoadingRecipes}
                onClick={handleBack}
              >
                <MoveLeft />
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={isLoadingRecipes}
                onClick={() => {
                  setStep(1);
                  setDietryPref("BOTH");
                  setSelectedIngredients([]);
                  setRecipes([]);
                }}
              >
                Restart <RotateCw />
              </Button>
            </div>
            {recipes.length == 0 ? (
              <h3 className="text-xl italic text-gray-500">No recipes found</h3>
            ) : (
              <RecipeList recipes={recipes} />
            )}
          </>
        )}
        {step == 3 ? null : (
          <div className="flex justify-between my-4 pb-4">
            {step > 1 && (
              <Button disabled={isLoadingRecipes} onClick={handleBack}>
                Back
              </Button>
            )}
            {step < 3 && (
              <Button disabled={isLoadingRecipes} onClick={handleNext}>
                Next
              </Button>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}

function IngredientsSelector({
  ingredients,
  selectedIngredients,
  setSelectedIngredients,
}: {
  ingredients: { id: string; title: string }[];
  selectedIngredients: { id: string; title: string }[];
  setSelectedIngredients: React.Dispatch<
    React.SetStateAction<{ id: string; title: string }[]>
  >;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          Select Ingredients...
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search framework..." />
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {ingredients.map((ingredient) => (
                <CommandItem
                  key={ingredient.id}
                  value={ingredient.id}
                  onSelect={(crtId) => {
                    const exist = selectedIngredients.find(
                      ({ id }) => crtId === id,
                    );
                    if (exist) {
                      setSelectedIngredients((p) =>
                        p.filter(({ id }) => id != crtId),
                      );
                    } else {
                      setSelectedIngredients((p) => [...p, ingredient]);
                    }
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedIngredients.find(
                        ({ id }) => ingredient.id === id,
                      )!!
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                  {ingredient.title}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

const IngredientBadge = ({
  title,
  removeIngredient,
}: {
  title: string;
  removeIngredient: () => void;
}) => {
  return (
    <div className="inline-flex items-center rounded-md text-xs font-semibold transition-colors border-transparent bg-primary overflow-hidden text-primary-foreground shadow">
      <span className=" pl-2.5 py-0.5">{title}</span>
      <button
        onClick={removeIngredient}
        className="bg-white text-red-700 text-xs p-[2px] w-[22px] h-[22px] grid place-items-center rounded-md ml-2 hover:bg-gray-200"
      >
        X
      </button>
    </div>
  );
};
