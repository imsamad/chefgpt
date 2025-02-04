import * as bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";
import { prismaClient } from "@/lib/prismaClient";
import { dummyIngredients, dummyRecipes, dummyUsers } from "./_dummy";

const seedUsers = async () => {
  const hashedPwd = await bcrypt.hash("12345678", 10);
  try {
    await prismaClient.user.createMany({
      // @ts-ignore
      data: dummyUsers.map((u) => ({
        ...u,
        password: hashedPwd,
        verifiedAt: new Date(),
      })),
    });
    console.log("Users data seeded!");
  } catch (err) {
    console.error("Error seeding users:", err);
  }
};

const seedIngredients = async () => {
  try {
    await prismaClient.ingredient.createMany({
      // @ts-ignore

      data: dummyIngredients,
    });

    console.log("Ingredients data seeded!");
  } catch (err) {
    console.error("Error seeding ingredients:", err);
  }
};

async function seedRecipes() {
  try {
    await prismaClient.recipe.createMany({
      // @ts-ignore
      data: dummyRecipes.map((d) => ({
        ...d,
        slug: d.title.split(" ").join("-").toLowerCase(),
      })),
    });

    console.log("Recipes data seeded!");
  } catch (err) {
    console.log("error seeding recipes:", err);
  }
}

seedUsers();
seedIngredients();
seedRecipes();
