"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { RecipeRating, SavedRecipes } from "@prisma/client";
import { useSession } from "next-auth/react";
import { getUserState } from "./actions/userState";

const UserCtx = createContext<{
  savedRecipes: SavedRecipes[];
  ratedRecipes: RecipeRating[];
  refetchSavedRecipes: () => Promise<void>;
  refetchRatedRecipes: () => Promise<void>;
}>({
  savedRecipes: [],
  ratedRecipes: [],
  refetchSavedRecipes: async () => {},
  refetchRatedRecipes: async () => {},
});

export const UserCtxWrapper = ({ children }: { children: React.ReactNode }) => {
  const { status } = useSession();
  const [savedRecipes, setSavedRecipes] = useState<SavedRecipes[]>([]);
  const [ratedRecipes, setRatedRecipes] = useState<RecipeRating[]>([]);

  useEffect(() => {
    (async () => {
      if (status === "loading" || status === "unauthenticated") return;
      try {
        const data = await getUserState({
          savedRecipes: true,
          ratedRecipes: true,
        });
        if (data.savedRecipes) setSavedRecipes(data.savedRecipes);
        if (data.ratedRecipes) setRatedRecipes(data.ratedRecipes);
      } catch { 
      }
    })();
  }, [status]);

  const refetchSavedRecipes = async () => {
    if (status === "loading" || status === "unauthenticated") return;
    try {
      const data = await getUserState({
        savedRecipes: true,
        ratedRecipes: false,
      });
      if (data.savedRecipes) setSavedRecipes(data.savedRecipes);
    } catch {
    }
  };

  const refetchRatedRecipes = async () => {
    if (status === "loading" || status === "unauthenticated") return;
    try {
      const data = await getUserState({
        savedRecipes: false,
        ratedRecipes: true,
      });
      if (data.ratedRecipes) setRatedRecipes(data.ratedRecipes);
    } catch {
    }
  };

  return (
    <UserCtx.Provider
      value={{
        savedRecipes,
        ratedRecipes,
        refetchSavedRecipes,
        refetchRatedRecipes,
      }}
    >
      {children}
    </UserCtx.Provider>
  );
};

export const useUserState = () => {
  const ctx = useContext(UserCtx);
  if (!ctx)
    throw new Error("useUserState must be used within a UserCtx.Provider");
  return ctx;
};
