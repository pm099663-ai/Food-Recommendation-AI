import React, { useState } from 'react';
import { Bookmark, ChefHat, Trash2, Clock, Search, ArrowRight, Printer } from 'lucide-react';
import { Recipe } from '../types';

interface SavedRecipesViewProps {
  savedRecipes: Recipe[];
  onRemoveSaved: (recipeId: string) => void;
  onSelectRecipe: (recipe: Recipe) => void;
  onStartCookMode: (recipe: Recipe) => void;
  onNavigateToPantry: () => void;
}

export const SavedRecipesView: React.FC<SavedRecipesViewProps> = ({
  savedRecipes,
  onRemoveSaved,
  onSelectRecipe,
  onStartCookMode,
  onNavigateToPantry,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = savedRecipes.filter(
    (r) =>
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.cuisine.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 md:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-800 mb-1">
            <Bookmark className="w-3.5 h-3.5 fill-current" />
            <span>Recipe Collection</span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-stone-900">
            Your Saved Culinary Recipes ({savedRecipes.length})
          </h1>
          <p className="text-xs text-stone-600 mt-1">
            Recipes you've bookmarked for weeknight dinners, meal prep, or special occasions.
          </p>
        </div>

        {savedRecipes.length > 3 && (
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-stone-400" />
            <input
              type="text"
              placeholder="Search saved recipes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-hidden focus:border-amber-700 text-stone-900"
            />
          </div>
        )}
      </div>

      {savedRecipes.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200 p-16 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 mx-auto flex items-center justify-center">
            <Bookmark className="w-6 h-6" />
          </div>
          <h2 className="text-base font-serif font-bold text-stone-800">
            No saved recipes yet
          </h2>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            When you find recipe ideas you love from your pantry ingredients, tap the bookmark icon to save
            them here for easy access anytime.
          </p>
          <div className="pt-2">
            <button
              onClick={onNavigateToPantry}
              className="px-4 py-2 bg-amber-800 hover:bg-amber-900 text-stone-50 rounded-lg text-xs font-medium transition-colors"
            >
              Browse Pantry & Get Recipes
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((recipe) => (
            <article
              key={recipe.id}
              className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-stone-300 transition-colors"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-stone-500">
                  <span className="text-amber-800 font-semibold">{recipe.cuisine}</span>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-stone-400" />
                    <span className="font-mono tabular-nums">{recipe.totalTimeMinutes}m</span>
                  </div>
                </div>

                <h3
                  onClick={() => onSelectRecipe(recipe)}
                  className="font-serif font-bold text-stone-900 text-lg cursor-pointer hover:text-amber-800 transition-colors line-clamp-1"
                >
                  {recipe.title}
                </h3>
                <p className="text-xs text-stone-600 line-clamp-2 italic">"{recipe.tagline}"</p>

                <div className="pt-2 text-xs text-stone-500 flex flex-wrap items-center gap-2">
                  <span>{recipe.ingredientsUsed.length} ingredients</span>
                  <span aria-hidden="true">·</span>
                  <span>{recipe.nutritionPerServing.calories} kcal</span>
                  <span aria-hidden="true">·</span>
                  <span>{recipe.difficulty}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => onRemoveSaved(recipe.id)}
                  className="p-1.5 text-stone-400 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                  title="Remove from saved"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onSelectRecipe(recipe)}
                    className="px-3 py-1.5 text-xs text-stone-700 hover:text-stone-900 font-medium"
                  >
                    Details
                  </button>
                  <button
                    onClick={() => onStartCookMode(recipe)}
                    className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-medium flex items-center gap-1"
                  >
                    <ChefHat className="w-3.5 h-3.5" />
                    <span>Cook</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};
