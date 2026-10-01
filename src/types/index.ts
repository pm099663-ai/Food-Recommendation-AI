export interface Ingredient {
  id: string;
  name: string;
  category: 'Produce' | 'Protein' | 'Dairy' | 'Pantry' | 'Spices & Oils' | 'Grains & Bakery' | 'Other';
  quantity?: string;
  perishable?: boolean;
}

export interface FlavorProfile {
  savory: number;
  tangy: number;
  spicy: number;
  sweet: number;
  umami: number;
}

export interface NutritionPerServing {
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  fiberGrams: number;
}

export interface IngredientUsage {
  name: string;
  amount: string;
  fromPantry: boolean;
  isOptional?: boolean;
}

export interface MissingIngredient {
  name: string;
  amount: string;
  estimatedPrice?: string;
}

export interface ChefSubstitution {
  original: string;
  substitute: string;
  note: string;
}

export interface RecipeStep {
  stepNumber: number;
  title: string;
  instruction: string;
  durationMinutes?: number;
  chefTip?: string;
}

export interface Recipe {
  id: string;
  title: string;
  tagline: string;
  cuisine: string;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  totalTimeMinutes: number;
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Chef-Level';
  pantryMatchPercentage: number;
  culinaryWhyItWorks: string;
  beveragePairing?: string;
  flavorProfile?: FlavorProfile;
  nutritionPerServing: NutritionPerServing;
  ingredientsUsed: IngredientUsage[];
  missingIngredients: MissingIngredient[];
  chefSubstitutions: ChefSubstitution[];
  steps: RecipeStep[];
}

export interface MealPlanDayMeal {
  mealType: 'Breakfast' | 'Lunch' | 'Dinner';
  dishName: string;
  prepTimeMinutes: number;
  briefDescription: string;
  ingredientsUsed: string[];
  zeroWasteTip?: string;
}

export interface MealPlanDay {
  dayNumber: number;
  dayTitle: string;
  meals: MealPlanDayMeal[];
}

export interface SmartGroceryAisle {
  aisle: string;
  items: string[];
}

export interface MealPlan {
  title: string;
  overview: string;
  days: MealPlanDay[];
  smartGroceryList: SmartGroceryAisle[];
}

export interface CookingPreferences {
  dietary: string;
  mealType: string;
  maxPrepTimeMinutes: number;
  cookMode: 'strict' | 'flexible' | 'zero-waste';
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  servings: number;
  equipment: string[];
  cuisinePreference: string;
  flavorNotes: string;
}
