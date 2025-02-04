import RecipeGenerator from "@/components/RecipeGenerator";
import { prismaClient } from "@/lib/prismaClient";

const HomePage = async () => {
 try {
  const ingredients = await prismaClient.ingredient.findMany({
    select: {
      id: true,
      title: true,
      dietaryType: true,
      nutritionalProfile: true,
    },
  });
  return <RecipeGenerator ingredients={ingredients} />;
 }catch {
  return <h1>Please try again, server is under mainitenance</h1>
 }
};

export default HomePage;
