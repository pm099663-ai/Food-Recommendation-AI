import { Ingredient } from '../types';

export interface PantryPreset {
  id: string;
  name: string;
  description: string;
  ingredients: Omit<Ingredient, 'id'>[];
}

export const PANTRY_PRESETS: PantryPreset[] = [
  {
    id: 'italian-weeknight',
    name: 'Italian Weeknight',
    description: 'Classic rustic pantry: pasta, garlic, canned tomatoes, eggs, parmesan, olive oil.',
    ingredients: [
      { name: 'Spaghetti Pasta', category: 'Grains & Bakery', quantity: '1 box', perishable: false },
      { name: 'Garlic', category: 'Produce', quantity: '1 bulb', perishable: false },
      { name: 'Extra Virgin Olive Oil', category: 'Spices & Oils', quantity: '1 bottle', perishable: false },
      { name: 'Eggs', category: 'Dairy', quantity: '6 eggs', perishable: true },
      { name: 'Parmesan Cheese', category: 'Dairy', quantity: '1 wedge', perishable: true },
      { name: 'Canned Crushed Tomatoes', category: 'Pantry', quantity: '2 cans', perishable: false },
      { name: 'Fresh Basil', category: 'Produce', quantity: '1 small bunch', perishable: true },
      { name: 'Black Pepper', category: 'Spices & Oils', quantity: 'ground', perishable: false },
    ],
  },
  {
    id: 'asian-flavor-bowl',
    name: 'Savory Stir-Fry Prep',
    description: 'High-protein pantry: chicken, jasmine rice, broccoli, soy sauce, eggs, sesame oil.',
    ingredients: [
      { name: 'Chicken Breast', category: 'Protein', quantity: '2 fillets', perishable: true },
      { name: 'Jasmine Rice', category: 'Grains & Bakery', quantity: '2 cups', perishable: false },
      { name: 'Fresh Broccoli', category: 'Produce', quantity: '1 head', perishable: true },
      { name: 'Eggs', category: 'Dairy', quantity: '4 eggs', perishable: true },
      { name: 'Soy Sauce', category: 'Spices & Oils', quantity: '1 bottle', perishable: false },
      { name: 'Toasted Sesame Oil', category: 'Spices & Oils', quantity: 'half bottle', perishable: false },
      { name: 'Fresh Ginger', category: 'Produce', quantity: '1 knob', perishable: false },
      { name: 'Garlic', category: 'Produce', quantity: '4 cloves', perishable: false },
      { name: 'Green Onions', category: 'Produce', quantity: '1 bunch', perishable: true },
    ],
  },
  {
    id: 'farmers-market-fresh',
    name: 'Farmers Market Mediterranean',
    description: 'Vegetarian bounty: zucchini, cherry tomatoes, chickpeas, feta, lemons, herbs.',
    ingredients: [
      { name: 'Zucchini', category: 'Produce', quantity: '2 medium', perishable: true },
      { name: 'Cherry Tomatoes', category: 'Produce', quantity: '1 pint', perishable: true },
      { name: 'Canned Chickpeas', category: 'Pantry', quantity: '2 cans', perishable: false },
      { name: 'Feta Cheese', category: 'Dairy', quantity: '1 block', perishable: true },
      { name: 'Lemons', category: 'Produce', quantity: '2 lemons', perishable: true },
      { name: 'Baby Spinach', category: 'Produce', quantity: '1 bag', perishable: true },
      { name: 'Olive Oil', category: 'Spices & Oils', quantity: 'cruet', perishable: false },
      { name: 'Dried Oregano', category: 'Spices & Oils', quantity: 'jar', perishable: false },
    ],
  },
  {
    id: 'dorm-budget-saver',
    name: 'Pantry Essentials & Quick Fix',
    description: 'Budget staples: black beans, rice, eggs, onions, cheddar, salsa, tortillas.',
    ingredients: [
      { name: 'Canned Black Beans', category: 'Pantry', quantity: '2 cans', perishable: false },
      { name: 'White Rice', category: 'Grains & Bakery', quantity: '2 cups', perishable: false },
      { name: 'Eggs', category: 'Dairy', quantity: '6 eggs', perishable: true },
      { name: 'Yellow Onion', category: 'Produce', quantity: '2 onions', perishable: false },
      { name: 'Sharp Cheddar', category: 'Dairy', quantity: 'shredded', perishable: true },
      { name: 'Flour Tortillas', category: 'Grains & Bakery', quantity: '6 pack', perishable: false },
      { name: 'Jarred Salsa', category: 'Pantry', quantity: '1 jar', perishable: false },
      { name: 'Ground Cumin', category: 'Spices & Oils', quantity: 'tin', perishable: false },
    ],
  },
];

export const COMMON_PANTRY_CHIPS = [
  // Produce
  { name: 'Garlic', category: 'Produce' as const },
  { name: 'Onions', category: 'Produce' as const },
  { name: 'Tomatoes', category: 'Produce' as const },
  { name: 'Potatoes', category: 'Produce' as const },
  { name: 'Spinach', category: 'Produce' as const },
  { name: 'Lemons', category: 'Produce' as const },
  { name: 'Bell Peppers', category: 'Produce' as const },
  { name: 'Carrots', category: 'Produce' as const },
  { name: 'Mushrooms', category: 'Produce' as const },
  // Protein
  { name: 'Eggs', category: 'Protein' as const },
  { name: 'Chicken Breast', category: 'Protein' as const },
  { name: 'Ground Beef', category: 'Protein' as const },
  { name: 'Canned Tuna', category: 'Protein' as const },
  { name: 'Tofu', category: 'Protein' as const },
  { name: 'Bacon', category: 'Protein' as const },
  // Dairy
  { name: 'Butter', category: 'Dairy' as const },
  { name: 'Milk', category: 'Dairy' as const },
  { name: 'Cheddar Cheese', category: 'Dairy' as const },
  { name: 'Parmesan', category: 'Dairy' as const },
  { name: 'Greek Yogurt', category: 'Dairy' as const },
  // Grains & Bakery
  { name: 'Pasta', category: 'Grains & Bakery' as const },
  { name: 'Rice', category: 'Grains & Bakery' as const },
  { name: 'Bread', category: 'Grains & Bakery' as const },
  { name: 'Oats', category: 'Grains & Bakery' as const },
  { name: 'Flour', category: 'Grains & Bakery' as const },
  // Pantry & Canned
  { name: 'Canned Tomatoes', category: 'Pantry' as const },
  { name: 'Canned Beans', category: 'Pantry' as const },
  { name: 'Chicken Broth', category: 'Pantry' as const },
  { name: 'Peanut Butter', category: 'Pantry' as const },
  // Spices & Oils
  { name: 'Olive Oil', category: 'Spices & Oils' as const },
  { name: 'Soy Sauce', category: 'Spices & Oils' as const },
  { name: 'Black Pepper', category: 'Spices & Oils' as const },
  { name: 'Paprika', category: 'Spices & Oils' as const },
  { name: 'Chili Flakes', category: 'Spices & Oils' as const },
  { name: 'Honey', category: 'Spices & Oils' as const },
];
