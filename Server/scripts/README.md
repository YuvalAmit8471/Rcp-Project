# Demo Recipes Seed Script

This script populates the MongoDB database with demo recipes for the Recipe Application.

## What it does

1. **Creates a demo user** (`demo@recipes.com`) if it doesn't exist
2. **Migrates 8 existing demo recipes** from the frontend to the database
3. **Generates 8 additional diverse recipes** to expand the demo content
4. **Prevents duplicates** by checking if recipes with the same title already exist
5. **Assigns all recipes** to the demo user as the creator

## Demo Recipes Included

### Original 8 Recipes (from frontend):

- Apple Pie (Dessert, Medium, 1h)
- BBQ Pulled Pork (Main, Hard, 6h)
- Caprese Salad (Salad, Easy, 10m)
- Chocolate Lava Cake (Dessert, Medium, 30m)
- Grilled Salmon (Main, Easy, 20m)
- Mushroom Risotto (Main, Medium, 45m)
- Pasta Carbonara (Main, Easy, 25m)
- Thai Green Curry (Main, Medium, 40m)

### New 8 Additional Recipes:

- Mediterranean Quinoa Bowl (Healthy, Easy, 35m)
- Beef Wellington (Main, Hard, 2h)
- Homemade Pizza Margherita (Main, Medium, 1h 30m)
- Chicken Caesar Salad (Salad, Easy, 25m)
- Beef Tacos (Mexican, Easy, 30m)
- Lemon Garlic Shrimp (Seafood, Easy, 15m)
- Vegetable Stir Fry (Vegetarian, Easy, 20m)
- Tiramisu (Dessert, Medium, 4h)

## How to Run

### Option 1: Using npm script (recommended)

```bash
cd Server
npm run seed:demo
```

### Option 2: Using ts-node directly

```bash
cd Server
npx ts-node scripts/seedDemoRecipes.ts
```

### Option 3: Using the standalone runner

```bash
cd Server/scripts
node runSeed.js
```

## Prerequisites

- MongoDB connection must be configured in `.env`
- Database should be running
- All dependencies should be installed (`npm install`)

## Environment Setup

Make sure your `.env` file has:

```
MONGODB_URI=mongodb://localhost:27017/recipe-app
# or your MongoDB connection string
```

## Features

- **Duplicate Protection**: Won't create recipes that already exist (checked by title)
- **Realistic Data**: Includes proper images from Unsplash, realistic cooking times, and view/like counts
- **User Management**: Creates a dedicated demo user for all recipes
- **Error Handling**: Comprehensive error handling and logging
- **Progress Reporting**: Shows detailed progress and summary

## Output

The script will show:

- Connection status
- Demo user creation/finding
- Each recipe creation (or skip if exists)
- Final summary with counts

Example output:

```
Connecting to database...
Successfully Connected to DB
Creating/finding demo user...
Demo user created successfully
Seeding 16 demo recipes...
Created recipe: Apple Pie
Created recipe: BBQ Pulled Pork
...
=== Seeding Complete ===
Created: 16 recipes
Skipped: 0 recipes (already exist)
Total recipes in database: 16
Database connection closed
```

## Troubleshooting

1. **Database Connection Error**: Check your MONGODB_URI in .env
2. **Permission Error**: Ensure your database user has write permissions
3. **TypeScript Error**: Run `npm install` to ensure all dependencies are installed
4. **Duplicate Key Error**: The script should handle this, but if it occurs, check for existing data

## Note

This script is designed to be safe to run multiple times - it will skip recipes that already exist rather than creating duplicates.
