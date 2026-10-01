import React from 'react';
import { Clock, ChefHat, Bookmark, ArrowRight, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { Recipe } from '../types';

interface RecipeCardProps {
  recipe: Recipe;
  isSaved: boolean;
  onToggleSave: (recipe: Recipe) => void;
  onSelectRecipe: (recipe: Recipe) => void;
  onStartCookMode: (recipe: Recipe) => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  isSaved,
  onToggleSave,
  onSelectRecipe,
  onStartCookMode,
}) => {
  const pantryIngredients = recipe.ingredientsUsed.filter((i) => i.fromPantry);
  const missingCount = recipe.missingIngredients.length;

  // Visual header gradient theme based on cuisine / flavor
  const getCuisineTheme = (cuisine: string) => {
    const c = cuisine.toLowerCase();
    if (c.includes('italian') || c.includes('mediterranean')) {
      return 'from-amber-900/90 via-stone-900 to-stone-950';
    }
    if (c.includes('asian') || c.includes('japanese') || c.includes('thai')) {
      return 'from-stone-900 via-stone-850 to-amber-950';
    }
    if (c.includes('mexican') || c.includes('latin')) {
      return 'from-amber-950 via-stone-900 to-stone-900';
    }
    return 'from-stone-900 via-stone-850 to-stone-950';
  };

  return (
    <article className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group">
      {/* Culinary Visual Showcase Header */}
      <div
        className={`relative h-48 bg-gradient-to-br ${getCuisineTheme(
          recipe.cuisine
        )} p-5 text-stone-100 flex flex-col justify-between overflow-hidden`}
      >
        {/* Subtle decorative background culinary lines */}
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id={`pattern-${recipe.id}`} width="28" height="28" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1" fill="#fff" />
                <path d="M 28 0 L 0 28 M 0 0 L 28 28" stroke="#fff" strokeWidth="0.3" fill="none" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#pattern-${recipe.id})`} />
          </svg>
        </div>

        {/* Top Header Row */}
        <div className="relative z-10 flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-medium text-amber-200/90">
            <span>{recipe.cuisine}</span>
            <span aria-hidden="true">·</span>
            <span>{recipe.difficulty}</span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave(recipe);
            }}
            title={isSaved ? 'Remove from Saved' : 'Save Recipe'}
            className={`p-2 rounded-full backdrop-blur-md transition-colors ${
              isSaved
                ? 'bg-amber-600 text-white'
                : 'bg-stone-900/60 text-stone-300 hover:text-white hover:bg-stone-900/90'
            }`}
          >
            <Bookmark className="w-4 h-4 fill-current" />
          </button>
        </div>

        {/* Title & Tagline in visual box */}
        <div className="relative z-10">
          <div className="flex items-center gap-1.5 text-xs text-amber-300 font-mono mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="font-semibold">{recipe.pantryMatchPercentage}% Pantry Match</span>
            {missingCount === 0 ? (
              <span className="text-emerald-400 ml-1">· 100% On-Hand</span>
            ) : (
              <span className="text-stone-300 ml-1">
                · {missingCount} {missingCount === 1 ? 'grocery add' : 'grocery adds'}
              </span>
            )}
          </div>
          <h3
            onClick={() => onSelectRecipe(recipe)}
            className="text-xl font-serif font-bold text-white tracking-tight cursor-pointer hover:text-amber-200 transition-colors line-clamp-1"
          >
            {recipe.title}
          </h3>
          <p className="text-xs text-stone-300 mt-0.5 line-clamp-1 italic">
            "{recipe.tagline}"
          </p>
        </div>
      </div>

      {/* Card Content & Metadata */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        {/* Clean Unboxed Metadata */}
        <div className="flex items-center gap-2 text-xs text-stone-500">
          <span className="flex items-center gap-1 text-stone-700 font-medium">
            <Clock className="w-3.5 h-3.5 text-stone-400" />
            <span className="font-mono tabular-nums">{recipe.totalTimeMinutes}m</span> total
          </span>
          <span aria-hidden="true">·</span>
          <span>{recipe.prepTimeMinutes}m prep</span>
          <span aria-hidden="true">·</span>
          <span>{recipe.servings} servings</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono tabular-nums">{recipe.nutritionPerServing.calories} kcal</span>
        </div>

        {/* Ingredients Summary */}
        <div className="space-y-1.5 text-xs">
          <div className="flex items-center justify-between text-stone-600 font-medium">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Using from your pantry ({pantryIngredients.length}):</span>
            </span>
          </div>
          <p className="text-stone-700 line-clamp-2 leading-relaxed">
            {pantryIngredients.map((i) => i.name).join(', ') || 'Various pantry staples'}
          </p>

          {missingCount > 0 && (
            <div className="pt-1 text-[11px] text-stone-500 flex items-center gap-1.5">
              <AlertCircle className="w-3 h-3 text-amber-700 shrink-0" />
              <span className="truncate">
                Optional additions: {recipe.missingIngredients.map((i) => i.name).join(', ')}
              </span>
            </div>
          )}
        </div>

        {/* Culinary Theory Teaser */}
        <div className="p-3 rounded-lg bg-stone-50 border border-stone-100 text-xs text-stone-600">
          <p className="line-clamp-2 italic leading-relaxed">
            <span className="font-semibold text-stone-800 not-italic">Chef's Note: </span>
            {recipe.culinaryWhyItWorks}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
          <button
            onClick={() => onSelectRecipe(recipe)}
            className="text-xs font-medium text-stone-600 hover:text-stone-900 transition-colors"
          >
            View Recipe Details
          </button>

          <button
            onClick={() => onStartCookMode(recipe)}
            className="px-3.5 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <ChefHat className="w-3.5 h-3.5" />
            <span>Cook Step-by-Step</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </article>
  );
};
