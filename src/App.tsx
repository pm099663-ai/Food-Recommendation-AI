import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { PantryManager } from './components/PantryManager';
import { PreferencesBar } from './components/PreferencesBar';
import { RecipeCard } from './components/RecipeCard';
import { RecipeDetailModal } from './components/RecipeDetailModal';
import { InteractiveCookMode } from './components/InteractiveCookMode';
import { PantryImageScannerModal } from './components/PantryImageScannerModal';
import { MealPlannerView } from './components/MealPlannerView';
import { SavedRecipesView } from './components/SavedRecipesView';
import { Ingredient, Recipe, CookingPreferences, MealPlan } from './types';
import { PANTRY_PRESETS } from './data/presetPantries';
import { Sparkles, AlertCircle, ChefHat, RefreshCw } from 'lucide-react';

const DEFAULT_PREFERENCES: CookingPreferences = {
  dietary: 'none',
  mealType: 'any',
  maxPrepTimeMinutes: 30,
  cookMode: 'flexible',
  skillLevel: 'intermediate',
  servings: 2,
  equipment: ['stovetop', 'oven'],
  cuisinePreference: 'any',
  flavorNotes: '',
};

// Initial starting recipes to provide immediate delicious culinary value
const INITIAL_DEMO_RECIPES: Recipe[] = [
  {
    id: 'demo-1',
    title: 'Rustic Garlic-Herb Skillet Pasta with Blistered Tomatoes',
    tagline: 'A silky, 20-minute Mediterranean masterpiece bound by rich emulsified pasta water and garlic oil.',
    cuisine: 'Italian',
    prepTimeMinutes: 10,
    cookTimeMinutes: 15,
    totalTimeMinutes: 25,
    servings: 2,
    difficulty: 'Easy',
    pantryMatchPercentage: 100,
    culinaryWhyItWorks:
      'Starch-rich pasta water emulsifies with hot extra virgin olive oil and grated parmesan to create a creamy sauce without cream, while sweet blistered tomatoes provide lively acidity.',
    beveragePairing: 'Crisp Pinot Grigio or chilled sparkling water with lemon peel',
    flavorProfile: {
      savory: 9,
      tangy: 7,
      spicy: 3,
      sweet: 4,
      umami: 8,
    },
    nutritionPerServing: {
      calories: 520,
      proteinGrams: 18,
      carbsGrams: 68,
      fatGrams: 20,
      fiberGrams: 5,
    },
    ingredientsUsed: [
      { name: 'Spaghetti Pasta', amount: '200g', fromPantry: true },
      { name: 'Garlic', amount: '4 cloves, sliced thin', fromPantry: true },
      { name: 'Extra Virgin Olive Oil', amount: '3 tbsp', fromPantry: true },
      { name: 'Canned Crushed Tomatoes', amount: '1 cup', fromPantry: true },
      { name: 'Parmesan Cheese', amount: '½ cup grated', fromPantry: true },
      { name: 'Fresh Basil', amount: 'handful torn', fromPantry: true },
      { name: 'Black Pepper', amount: '1 tsp freshly cracked', fromPantry: true },
    ],
    missingIngredients: [],
    chefSubstitutions: [
      {
        original: 'Parmesan Cheese',
        substitute: 'Pecorino Romano or nutritional yeast',
        note: 'Provides that crucial savory glutamic punch.',
      },
      {
        original: 'Fresh Basil',
        substitute: '1 tsp dried Italian herbs or fresh parsley',
        note: 'Bloom dried herbs gently in warm olive oil before adding tomatoes.',
      },
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Boil Salted Water & Cook Pasta',
        instruction:
          'Bring a large pot of water to a rolling boil. Season generously with salt until it tastes like the sea. Drop in spaghetti and cook until 2 minutes shy of al dente.',
        durationMinutes: 8,
        chefTip: 'Save ½ cup of starchy pasta water right before draining; this is liquid gold for your sauce!',
      },
      {
        stepNumber: 2,
        title: 'Infuse Garlic Oil & Sauté Tomatoes',
        instruction:
          'In a large wide skillet over medium-low heat, warm olive oil. Add thinly sliced garlic and gently sizzle until pale golden and fragrant (do not burn). Stir in crushed tomatoes and crack fresh black pepper.',
        durationMinutes: 4,
        chefTip: 'If garlic turns dark brown, it turns bitter. Keep heat gentle and controlled.',
      },
      {
        stepNumber: 3,
        title: 'Emulsify & Finish in the Skillet',
        instruction:
          'Transfer drained pasta directly into the sauce. Pour in 3 tablespoons of reserved pasta water and toss vigorously over medium heat. Remove from heat, fold in grated parmesan and fresh basil until silky and glossy.',
        durationMinutes: 3,
        chefTip: 'Always remove pan from heat before adding cheese to prevent clumping and maintain a velvety emulsion.',
      },
    ],
  },
  {
    id: 'demo-2',
    title: 'Golden Egg & Herb Fried Rice with Crispy Garlic',
    tagline: 'High-heat wok-style comfort utilizing pantry eggs, leftover rice, and savory aromatics.',
    cuisine: 'Asian-Inspired',
    prepTimeMinutes: 5,
    cookTimeMinutes: 10,
    totalTimeMinutes: 15,
    servings: 2,
    difficulty: 'Easy',
    pantryMatchPercentage: 90,
    culinaryWhyItWorks:
      'Coating the grains in whipped egg yolks prior to cooking forms the classic golden fried rice coat, while high pan heat triggers the Maillard reaction for smoky depth.',
    beveragePairing: 'Iced Jasmine Green Tea or crisp lager',
    flavorProfile: {
      savory: 9,
      tangy: 2,
      spicy: 4,
      sweet: 2,
      umami: 9,
    },
    nutritionPerServing: {
      calories: 440,
      proteinGrams: 16,
      carbsGrams: 58,
      fatGrams: 16,
      fiberGrams: 3,
    },
    ingredientsUsed: [
      { name: 'Rice', amount: '2 cups cooked & chilled', fromPantry: true },
      { name: 'Eggs', amount: '3 large eggs', fromPantry: true },
      { name: 'Garlic', amount: '3 cloves minced', fromPantry: true },
      { name: 'Black Pepper', amount: '½ tsp', fromPantry: true },
    ],
    missingIngredients: [
      { name: 'Soy Sauce', amount: '1.5 tbsp', estimatedPrice: '$1.50' },
      { name: 'Scallions / Green Onions', amount: '2 stalks', estimatedPrice: '$0.80' },
    ],
    chefSubstitutions: [
      {
        original: 'Soy Sauce',
        substitute: 'Fish sauce, tamari, or seasoned salt with a pinch of sugar',
        note: 'Enhances salt and umami profiles balance.',
      },
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Separate Grains & Beat Eggs',
        instruction:
          'Break apart chilled cooked rice with your fingers or a spoon. Whisk 2 whole eggs and 1 yolk in a bowl with a pinch of salt until uniform.',
        durationMinutes: 3,
        chefTip: 'Day-old dry chilled rice fries infinitely better than freshly steamed moist rice.',
      },
      {
        stepNumber: 2,
        title: 'Crisp Garlic & Scramble',
        instruction:
          'Heat 2 tablespoons of oil in a skillet or wok over medium-high heat until shimmering. Flash-fry minced garlic for 30 seconds, then pour in eggs. Scramble quickly into soft curds, then push to the side.',
        durationMinutes: 3,
        chefTip: 'Keep your pan ripping hot so eggs puff and stay light.',
      },
      {
        stepNumber: 3,
        title: 'Sear Rice & Season',
        instruction:
          'Toss in rice. Spread across pan surface for 60 seconds to toast the grains. Drizzle seasoning along the edge of the skillet and toss everything together until aromatic and hot.',
        durationMinutes: 4,
        chefTip: 'Drizzling sauce along the smoking rim of the pan caramelizes it instantly for authentic wok aroma.',
      },
    ],
  },
];

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<'pantry' | 'recipes' | 'planner' | 'saved'>('pantry');

  // Pantry Ingredients
  const [ingredients, setIngredients] = useState<Ingredient[]>(() => {
    const saved = localStorage.getItem('mise_meal_ingredients');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    // Default to Italian weeknight preset so user has instant rich context
    return PANTRY_PRESETS[0].ingredients.map((ing, i) => ({
      ...ing,
      id: `init-${i}-${Date.now()}`,
    }));
  });

  // Cooking Preferences
  const [preferences, setPreferences] = useState<CookingPreferences>(DEFAULT_PREFERENCES);

  // Recommendations & Saved
  const [recipes, setRecipes] = useState<Recipe[]>(INITIAL_DEMO_RECIPES);
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>(() => {
    const saved = localStorage.getItem('mise_meal_saved_recipes');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [INITIAL_DEMO_RECIPES[0]];
  });

  // Meal Plan
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);

  // Modals & States
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [selectedRecipeForModal, setSelectedRecipeForModal] = useState<Recipe | null>(null);
  const [activeCookingRecipe, setActiveCookingRecipe] = useState<Recipe | null>(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  // Sync ingredients to localStorage
  useEffect(() => {
    localStorage.setItem('mise_meal_ingredients', JSON.stringify(ingredients));
  }, [ingredients]);

  // Sync saved recipes to localStorage
  useEffect(() => {
    localStorage.setItem('mise_meal_saved_recipes', JSON.stringify(savedRecipes));
  }, [savedRecipes]);

  // Ingredient actions
  const handleAddIngredient = (newIng: Omit<Ingredient, 'id'>) => {
    const item: Ingredient = {
      ...newIng,
      id: `ing-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    };
    setIngredients((prev) => [item, ...prev]);
  };

  const handleAddMultipleIngredients = (newItems: Omit<Ingredient, 'id'>[]) => {
    const items: Ingredient[] = newItems.map((item, idx) => ({
      ...item,
      id: `ing-bulk-${Date.now()}-${idx}`,
    }));
    setIngredients((prev) => [...items, ...prev]);
  };

  const handleRemoveIngredient = (id: string) => {
    setIngredients((prev) => prev.filter((i) => i.id !== id));
  };

  const handleTogglePerishable = (id: string) => {
    setIngredients((prev) =>
      prev.map((i) => (i.id === id ? { ...i, perishable: !i.perishable } : i))
    );
  };

  const handleClearPantry = () => {
    if (window.confirm('Clear all ingredients from your pantry inventory?')) {
      setIngredients([]);
    }
  };

  const handleLoadPreset = (presetId: string) => {
    const preset = PANTRY_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    const items: Ingredient[] = preset.ingredients.map((ing, idx) => ({
      ...ing,
      id: `preset-${presetId}-${Date.now()}-${idx}`,
    }));
    setIngredients(items);
  };

  // Recipe Saving
  const handleToggleSaveRecipe = (recipe: Recipe) => {
    setSavedRecipes((prev) => {
      const exists = prev.some((r) => r.id === recipe.id);
      if (exists) {
        return prev.filter((r) => r.id !== recipe.id);
      } else {
        return [recipe, ...prev];
      }
    });
  };

  // Generate / Recommend Recipes from Gemini
  const handleRecommendRecipes = async () => {
    if (ingredients.length === 0) return;

    setIsGenerating(true);
    setGenerationError(null);
    setActiveTab('recipes');

    try {
      const response = await fetch('/api/recommend-recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ingredients,
          dietary: preferences.dietary,
          mealType: preferences.mealType,
          maxPrepTimeMinutes: preferences.maxPrepTimeMinutes,
          cookMode: preferences.cookMode,
          skillLevel: preferences.skillLevel,
          servings: preferences.servings,
          equipment: preferences.equipment,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to curate recipes from ingredients.');
      }

      const data = await response.json();
      if (data.recipes && Array.isArray(data.recipes) && data.recipes.length > 0) {
        setRecipes(data.recipes);
      } else {
        throw new Error('No recipes matched these criteria. Try adjusting filters or ingredients.');
      }
    } catch (err: any) {
      console.error(err);
      setGenerationError(
        err.message || 'An error occurred while generating recipe recommendations.'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  // Generate Multi-Day Zero-Waste Meal Plan
  const handleGenerateMealPlan = async (days: number) => {
    if (ingredients.length === 0) return;

    setIsGeneratingPlan(true);

    try {
      const response = await fetch('/api/generate-meal-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ingredients,
          daysCount: days,
          dietary: preferences.dietary,
          servings: preferences.servings,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to generate meal plan');
      }

      const data = await response.json();
      setMealPlan(data);
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Failed to generate meal plan.');
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col font-sans">
      {/* Top Bar Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pantryCount={ingredients.length}
        savedCount={savedRecipes.length}
        onGenerateClick={handleRecommendRecipes}
        isGenerating={isGenerating}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Tab 1: Pantry Inventory */}
        {activeTab === 'pantry' && (
          <PantryManager
            ingredients={ingredients}
            onAddIngredient={handleAddIngredient}
            onRemoveIngredient={handleRemoveIngredient}
            onTogglePerishable={handleTogglePerishable}
            onClearPantry={handleClearPantry}
            onLoadPreset={handleLoadPreset}
            onOpenScanner={() => setIsScannerOpen(true)}
            onFindRecipes={handleRecommendRecipes}
            isGenerating={isGenerating}
          />
        )}

        {/* Tab 2: Recipe Recommendations */}
        {activeTab === 'recipes' && (
          <div className="space-y-6">
            {/* Preferences Filter Bar */}
            <PreferencesBar
              preferences={preferences}
              onChange={(updated) => setPreferences((prev) => ({ ...prev, ...updated }))}
              onRefreshRecommendations={handleRecommendRecipes}
              isGenerating={isGenerating}
            />

            {/* Error state */}
            {generationError && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{generationError}</span>
                </div>
                <button
                  onClick={handleRecommendRecipes}
                  className="font-medium underline hover:text-red-900 ml-3"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Loading state indicator */}
            {isGenerating && (
              <div className="bg-white rounded-2xl border border-stone-200 p-16 text-center space-y-3 shadow-xs">
                <ChefHat className="w-10 h-10 text-amber-800 animate-bounce mx-auto" />
                <h3 className="text-xl font-serif font-bold text-stone-900">
                  Chef is formulating recipes...
                </h3>
                <p className="text-xs text-stone-500 max-w-md mx-auto">
                  Calculating flavor pairing matrix, balancing pantry matches, and structuring
                  step-by-step culinary instructions.
                </p>
              </div>
            )}

            {/* Recipes Grid */}
            {!isGenerating && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-serif font-bold text-stone-900">
                      Recommended Recipes ({recipes.length})
                    </h2>
                    <p className="text-xs text-stone-500">
                      Curated from your {ingredients.length} pantry ingredients with{' '}
                      <span className="font-semibold text-stone-700 capitalize">
                        {preferences.cookMode}
                      </span>{' '}
                      mode.
                    </p>
                  </div>

                  <button
                    onClick={handleRecommendRecipes}
                    disabled={ingredients.length === 0 || isGenerating}
                    className="text-xs text-amber-800 hover:text-amber-900 font-medium flex items-center gap-1.5 transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Re-roll Dishes</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recipes.map((recipe) => (
                    <RecipeCard
                      key={recipe.id}
                      recipe={recipe}
                      isSaved={savedRecipes.some((r) => r.id === recipe.id)}
                      onToggleSave={handleToggleSaveRecipe}
                      onSelectRecipe={(r) => setSelectedRecipeForModal(r)}
                      onStartCookMode={(r) => setActiveCookingRecipe(r)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Zero-Waste Meal Planner */}
        {activeTab === 'planner' && (
          <MealPlannerView
            ingredients={ingredients}
            mealPlan={mealPlan}
            onGenerateMealPlan={handleGenerateMealPlan}
            isGenerating={isGeneratingPlan}
          />
        )}

        {/* Tab 4: Saved Recipes */}
        {activeTab === 'saved' && (
          <SavedRecipesView
            savedRecipes={savedRecipes}
            onRemoveSaved={(id) => setSavedRecipes((prev) => prev.filter((r) => r.id !== id))}
            onSelectRecipe={(r) => setSelectedRecipeForModal(r)}
            onStartCookMode={(r) => setActiveCookingRecipe(r)}
            onNavigateToPantry={() => setActiveTab('pantry')}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200 bg-white py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-stone-800">Mise & Meal</span>
            <span aria-hidden="true">·</span>
            <span>Intelligent Culinary Assistant & Zero-Waste Kitchen</span>
          </div>

          <div className="flex items-center gap-4">
            <span>Powered by Gemini 3.8 Flash</span>
            <span aria-hidden="true">·</span>
            <span>Crafted for Home Chefs</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <RecipeDetailModal
        recipe={selectedRecipeForModal}
        isOpen={!!selectedRecipeForModal}
        onClose={() => setSelectedRecipeForModal(null)}
        isSaved={
          selectedRecipeForModal
            ? savedRecipes.some((r) => r.id === selectedRecipeForModal.id)
            : false
        }
        onToggleSave={handleToggleSaveRecipe}
        onStartCookMode={(recipe) => {
          setSelectedRecipeForModal(null);
          setActiveCookingRecipe(recipe);
        }}
      />

      {activeCookingRecipe && (
        <InteractiveCookMode
          recipe={activeCookingRecipe}
          onClose={() => setActiveCookingRecipe(null)}
        />
      )}

      <PantryImageScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onAddIngredients={handleAddMultipleIngredients}
      />
    </div>
  );
}
