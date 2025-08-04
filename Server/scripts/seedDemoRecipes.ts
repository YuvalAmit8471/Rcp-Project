import mongoose from "mongoose";
import dotenv from "dotenv";
import Recipe from "../src/models/Recipe";
import User from "../src/models/User";
import connectDB from "../src/config/db";

// Load environment variables
dotenv.config({ path: ".env" });

// Demo recipes data (from frontend)
const demoRecipesData = [
  {
    title: "Apple Pie",
    description:
      "Classic apple pie with cinnamon and a flaky crust. Perfect for holidays and family gatherings.",
    image:
      "https://images.unsplash.com/photo-1587132137056-bfbf0166836e?w=800&q=80",
    cookTime: "1h",
    servings: 8,
    difficulty: "Medium" as const,
    category: "Dessert",
    ingredients: [
      "6 cups thinly sliced apples",
      "3/4 cup sugar",
      "2 tablespoons flour",
      "1/2 teaspoon cinnamon",
      "1/4 teaspoon salt",
      "2 tablespoons butter",
      "2 pie crusts",
    ],
    instructions: [
      "Preheat oven to 425°F (220°C)",
      "Mix apples, sugar, flour, cinnamon, and salt in large bowl",
      "Place bottom crust in 9-inch pie pan",
      "Fill with apple mixture and dot with butter",
      "Cover with top crust and seal edges",
      "Cut slits in top crust for steam vents",
      "Bake 40-50 minutes until golden brown",
    ],
    views: 45,
    likes: 12,
  },
  {
    title: "BBQ Pulled Pork",
    description:
      "Slow-cooked pork shoulder with tangy BBQ sauce, perfect for sandwiches and gatherings.",
    image:
      "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80",
    cookTime: "6h",
    servings: 6,
    difficulty: "Hard" as const,
    category: "Main",
    ingredients: [
      "3-4 lb pork shoulder",
      "2 tablespoons brown sugar",
      "1 tablespoon paprika",
      "2 teaspoons garlic powder",
      "2 teaspoons onion powder",
      "1 teaspoon cayenne pepper",
      "1 cup BBQ sauce",
      "1/2 cup apple cider vinegar",
    ],
    instructions: [
      "Mix all dry ingredients to create rub",
      "Rub mixture all over pork shoulder",
      "Place in slow cooker with apple cider vinegar",
      "Cook on low for 6-8 hours until tender",
      "Remove pork and shred with two forks",
      "Mix with BBQ sauce",
      "Serve on buns with coleslaw",
    ],
    views: 78,
    likes: 23,
  },
  {
    title: "Caprese Salad",
    description:
      "Fresh mozzarella, ripe tomatoes, and basil drizzled with balsamic glaze.",
    image:
      "https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=800&q=80",
    cookTime: "10m",
    servings: 2,
    difficulty: "Easy" as const,
    category: "Salad",
    ingredients: [
      "2 large ripe tomatoes",
      "8 oz fresh mozzarella cheese",
      "1/4 cup fresh basil leaves",
      "3 tablespoons extra virgin olive oil",
      "2 tablespoons balsamic vinegar",
      "Salt and pepper to taste",
    ],
    instructions: [
      "Slice tomatoes and mozzarella into 1/4-inch thick rounds",
      "Arrange alternating slices of tomato and mozzarella on a platter",
      "Tuck fresh basil leaves between slices",
      "Drizzle with olive oil and balsamic vinegar",
      "Season with salt and pepper",
      "Let sit for 10 minutes before serving",
    ],
    views: 32,
    likes: 8,
  },
  {
    title: "Chocolate Lava Cake",
    description:
      "Rich chocolate cake with a molten center that flows like lava when cut.",
    image:
      "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&q=80",
    cookTime: "30m",
    servings: 4,
    difficulty: "Medium" as const,
    category: "Dessert",
    ingredients: [
      "4 oz dark chocolate, chopped",
      "4 tablespoons butter",
      "2 large eggs",
      "2 large egg yolks",
      "1/4 cup granulated sugar",
      "2 tablespoons all-purpose flour",
      "Pinch of salt",
      "Butter and cocoa powder for ramekins",
    ],
    instructions: [
      "Preheat oven to 425°F (220°C)",
      "Butter four 6-oz ramekins and dust with cocoa powder",
      "Melt chocolate and butter in double boiler until smooth",
      "Whisk eggs, egg yolks, and sugar until thick and pale",
      "Fold melted chocolate mixture into egg mixture",
      "Gently fold in flour and salt",
      "Divide batter among ramekins",
      "Bake for 12-14 minutes until edges are firm but center jiggles",
      "Let cool for 1 minute, then invert onto serving plates",
    ],
    views: 89,
    likes: 34,
  },
  {
    title: "Grilled Salmon",
    description:
      "Fresh salmon fillet grilled to perfection with herbs and lemon.",
    image:
      "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&q=80",
    cookTime: "20m",
    servings: 2,
    difficulty: "Easy" as const,
    category: "Main",
    ingredients: [
      "2 salmon fillets (6 oz each)",
      "2 tablespoons olive oil",
      "1 lemon, sliced",
      "2 cloves garlic, minced",
      "1 teaspoon dried dill",
      "1 teaspoon dried thyme",
      "Salt and pepper to taste",
      "Fresh parsley for garnish",
    ],
    instructions: [
      "Preheat grill to medium-high heat",
      "Pat salmon fillets dry and brush with olive oil",
      "Season both sides with salt, pepper, dill, and thyme",
      "Rub minced garlic onto salmon",
      "Grill for 4-5 minutes per side until fish flakes easily",
      "Serve with lemon slices and fresh parsley",
      "Drizzle with remaining olive oil if desired",
    ],
    views: 56,
    likes: 19,
  },
  {
    title: "Mushroom Risotto",
    description:
      "Creamy Arborio rice cooked with wild mushrooms and parmesan cheese.",
    image:
      "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=800&q=80",
    cookTime: "45m",
    servings: 4,
    difficulty: "Medium" as const,
    category: "Main",
    ingredients: [
      "1 1/2 cups Arborio rice",
      "4 cups warm chicken or vegetable stock",
      "1 lb mixed mushrooms, sliced",
      "1 medium onion, diced",
      "3 cloves garlic, minced",
      "1/2 cup white wine",
      "1/2 cup grated Parmesan cheese",
      "3 tablespoons butter",
      "2 tablespoons olive oil",
      "Salt and pepper to taste",
      "Fresh parsley for garnish",
    ],
    instructions: [
      "Heat stock in a saucepan and keep warm",
      "Sauté mushrooms in olive oil until golden, set aside",
      "In same pan, melt 1 tablespoon butter and sauté onion until soft",
      "Add garlic and rice, stir for 2 minutes",
      "Add wine and stir until absorbed",
      "Add warm stock one ladle at a time, stirring constantly",
      "Continue until rice is creamy and tender (about 20 minutes)",
      "Stir in mushrooms, remaining butter, and Parmesan",
      "Season with salt and pepper, garnish with parsley",
    ],
    views: 67,
    likes: 15,
  },
  {
    title: "Pasta Carbonara",
    description:
      "Classic Italian pasta with crispy pancetta, eggs, and parmesan cheese.",
    image:
      "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=800&q=80",
    cookTime: "25m",
    servings: 2,
    difficulty: "Easy" as const,
    category: "Main",
    ingredients: [
      "8 oz spaghetti or linguine",
      "4 oz pancetta or bacon, diced",
      "2 large eggs",
      "1 egg yolk",
      "1/2 cup grated Parmesan cheese",
      "2 cloves garlic, minced",
      "2 tablespoons olive oil",
      "Black pepper to taste",
      "Salt for pasta water",
    ],
    instructions: [
      "Cook pasta in salted boiling water until al dente",
      "While pasta cooks, sauté pancetta until crispy",
      "Add garlic to pancetta and cook for 1 minute",
      "Whisk eggs, egg yolk, and Parmesan in a bowl",
      "Drain pasta, reserving 1 cup pasta water",
      "Add hot pasta to pancetta pan",
      "Remove from heat and quickly stir in egg mixture",
      "Add pasta water gradually until creamy",
      "Season with black pepper and serve immediately",
    ],
    views: 92,
    likes: 28,
  },
  {
    title: "Thai Green Curry",
    description:
      "Spicy and aromatic green curry with chicken, vegetables, and coconut milk.",
    image:
      "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=800&q=80",
    cookTime: "40m",
    servings: 4,
    difficulty: "Medium" as const,
    category: "Main",
    views: 73,
    likes: 21,
  },
];

// Additional 8 new demo recipes
const additionalRecipes = [
  {
    title: "Mediterranean Quinoa Bowl",
    description:
      "Healthy quinoa bowl with roasted vegetables, feta cheese, and tahini dressing.",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80",
    cookTime: "35m",
    servings: 2,
    difficulty: "Easy" as const,
    category: "Healthy",
    views: 41,
    likes: 14,
  },
  {
    title: "Beef Wellington",
    description:
      "Tender beef fillet wrapped in puff pastry with mushroom duxelles.",
    image:
      "https://images.unsplash.com/photo-1574653431259-d8e6c0821904?w=800&q=80",
    cookTime: "2h",
    servings: 6,
    difficulty: "Hard" as const,
    category: "Main",
    views: 156,
    likes: 45,
  },
  {
    title: "Thai Green Curry",
    description:
      "Spicy and aromatic green curry with chicken, vegetables, and coconut milk.",
    image:
      "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=800&q=80",
    cookTime: "40m",
    servings: 4,
    difficulty: "Medium" as const,
    category: "Main",
    ingredients: [
      "1 lb chicken breast, sliced thin",
      "1 can (14 oz) coconut milk",
      "2-3 tablespoons green curry paste",
      "1 Thai eggplant, cubed",
      "1 red bell pepper, sliced",
      "1 cup green beans, trimmed",
      "2 tablespoons fish sauce",
      "1 tablespoon brown sugar",
      "1/4 cup Thai basil leaves",
      "2 kaffir lime leaves",
      "1 red chili, sliced for garnish",
      "Jasmine rice for serving",
    ],
    instructions: [
      "Heat thick coconut milk in a wok over medium heat",
      "Add curry paste and fry until fragrant (2-3 minutes)",
      "Add chicken and cook until no longer pink",
      "Add remaining coconut milk and bring to simmer",
      "Add eggplant, bell pepper, and green beans",
      "Simmer for 10-15 minutes until vegetables are tender",
      "Stir in fish sauce and brown sugar",
      "Add Thai basil and lime leaves",
      "Serve over jasmine rice, garnish with chili and basil",
    ],
    views: 73,
    likes: 21,
  },
  {
    title: "Mediterranean Quinoa Bowl",
    description:
      "Healthy quinoa bowl with roasted vegetables, feta cheese, and tahini dressing.",
    image:
      "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=800&q=80",
    cookTime: "25m",
    servings: 2,
    difficulty: "Easy" as const,
    category: "Salad",
    views: 38,
    likes: 11,
    ingredients: [
      "1 cup cooked quinoa",
      "1/2 cup roasted bell peppers",
      "1/2 cup cucumbers, diced",
      "1/4 cup crumbled feta cheese",
      "2 tbsp tahini dressing",
    ],
    instructions: [
      "Cook quinoa according to package instructions.",
      "Roast or grill vegetables and dice them.",
      "In a bowl, combine quinoa, veggies, and feta.",
      "Drizzle tahini dressing over and serve.",
    ],
  },
  {
    title: "Beef Tacos",
    description:
      "Seasoned ground beef in soft tortillas with fresh toppings and lime.",
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&q=80",
    cookTime: "30m",
    servings: 4,
    difficulty: "Easy" as const,
    category: "Mexican",
    views: 87,
    likes: 31,
    ingredients: [
      "500g ground beef",
      "1 tsp chili powder",
      "1/2 tsp cumin",
      "8 soft tortillas",
      "Lettuce, tomato, cheese, lime",
    ],
    instructions: [
      "Cook ground beef with chili and cumin until browned.",
      "Warm tortillas in a pan or oven.",
      "Assemble tacos with beef and desired toppings.",
      "Serve with lime wedges.",
    ],
  },
  {
    title: "Lemon Garlic Shrimp",
    description:
      "Succulent shrimp sautéed with garlic, lemon, and fresh herbs.",
    image:
      "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&q=80",
    cookTime: "15m",
    servings: 3,
    difficulty: "Easy" as const,
    category: "Seafood",
    views: 52,
    likes: 18,
    ingredients: [
      "300g shrimp, peeled and deveined",
      "3 cloves garlic, minced",
      "2 tbsp olive oil",
      "Juice of 1 lemon",
      "Fresh parsley, chopped",
    ],
    instructions: [
      "Heat olive oil in a skillet.",
      "Sauté garlic for 1 minute.",
      "Add shrimp and cook until pink (about 3–4 minutes).",
      "Add lemon juice and parsley before serving.",
    ],
  },
  {
    title: "Vegetable Stir Fry",
    description:
      "Fresh mixed vegetables stir-fried with ginger, garlic, and soy sauce.",
    image:
      "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&q=80",
    cookTime: "20m",
    servings: 4,
    difficulty: "Easy" as const,
    category: "Vegetarian",
    views: 29,
    likes: 9,
    ingredients: [
      "1 tbsp vegetable oil",
      "2 cups mixed vegetables (broccoli, bell peppers, carrots)",
      "1 tsp ginger, minced",
      "1 clove garlic, minced",
      "2 tbsp soy sauce",
    ],
    instructions: [
      "Heat oil in a wok or large pan.",
      "Add garlic and ginger, sauté for 1 minute.",
      "Add vegetables and stir-fry for 5–7 minutes.",
      "Add soy sauce and cook for another 2 minutes.",
    ],
  },
  {
    title: "Tiramisu",
    description:
      "Classic Italian dessert with coffee-soaked ladyfingers and mascarpone cream.",
    image:
      "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&q=80",
    cookTime: "4h",
    servings: 8,
    difficulty: "Medium" as const,
    category: "Dessert",
    views: 103,
    likes: 42,
    ingredients: [
      "200g ladyfingers",
      "1 cup brewed coffee",
      "250g mascarpone cheese",
      "3 eggs, separated",
      "1/2 cup sugar",
      "Cocoa powder for dusting",
    ],
    instructions: [
      "Beat egg yolks with sugar until pale.",
      "Fold in mascarpone cheese.",
      "Whisk egg whites to stiff peaks and fold into mixture.",
      "Dip ladyfingers in coffee and layer with mascarpone mixture.",
      "Repeat layers and chill for 4 hours.",
      "Dust with cocoa powder before serving.",
    ],
  },
];

async function createDemoUser(): Promise<mongoose.Types.ObjectId> {
  // Check if demo user already exists
  let demoUser = await User.findOne({ email: "demo@recipes.com" });

  if (!demoUser) {
    console.log("Creating demo user...");
    demoUser = await User.create({
      email: "demo@recipes.com",
      name: "Demo Chef",
      password: "demo123", // This should be hashed in production
    });
    console.log("Demo user created successfully");
  } else {
    console.log("Demo user already exists");
  }

  return demoUser._id;
}

async function seedRecipes() {
  try {
    console.log("Connecting to database...");
    await connectDB();

    console.log("Creating/finding demo user...");
    const demoUserId = await createDemoUser();

    // Combine both arrays
    const allRecipes = [...demoRecipesData, ...additionalRecipes];

    console.log(`Seeding ${allRecipes.length} demo recipes...`);

    let createdCount = 0;
    let skippedCount = 0;

    for (const recipeData of allRecipes) {
      // Check if recipe already exists (by title to avoid duplicates)
      const existingRecipe = await Recipe.findOne({ title: recipeData.title });

      if (existingRecipe) {
        console.log(`Recipe "${recipeData.title}" already exists, skipping...`);
        skippedCount++;
        continue;
      }

      // Create recipe with demo user as creator
      const recipe = await Recipe.create({
        ...recipeData,
        createdBy: demoUserId,
        createdDate: new Date(),
        isSaved: false,
      });

      console.log(`Created recipe: ${recipe.title}`);
      createdCount++;
    }

    console.log(`\n=== Seeding Complete ===`);
    console.log(`Created: ${createdCount} recipes`);
    console.log(`Skipped: ${skippedCount} recipes (already exist)`);
    console.log(`Total recipes in database: ${await Recipe.countDocuments()}`);
  } catch (error) {
    console.error("Error seeding recipes:", error);
  } finally {
    await mongoose.connection.close();
    console.log("Database connection closed");
  }
}

// Check if this script is being run directly
if (require.main === module) {
  seedRecipes();
}

export { seedRecipes, demoRecipesData, additionalRecipes };
