import React from 'react';
import {
  X,
  Clock,
  ChefHat,
  Bookmark,
  Share2,
  CheckCircle2,
  AlertCircle,
  Wine,
  Sparkles,
  ArrowRight,
  Flame,
} from 'lucide-react';
import { Recipe } from '../types';

interface RecipeDetailModalProps {
  recipe: Recipe | null;
  isOpen: boolean;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: (recipe: Recipe) => void;
  onStartCookMode: (recipe: Recipe) => void;
}

export const RecipeDetailModal: React.FC<RecipeDetailModalProps> = ({
  recipe,
  isOpen,
  onClose,
  isSaved,
  onToggleSave,
  onStartCookMode,
}) => {
  if (!isOpen || !recipe) return null;

  const handleCopyRecipe = () => {
    const text = `${recipe.title} (${recipe.cuisine})
"${recipe.tagline}"
Prep: ${recipe.prepTimeMinutes}m | Cook: ${recipe.cookTimeMinutes}m | Servings: ${recipe.servings}

INGREDIENTS:
${recipe.ingredientsUsed.map((i) => `- ${i.amount} ${i.name}`).join('\n')}

INSTRUCTIONS:
${recipe.steps.map((s) => `${s.stepNumber}. ${s.title}: ${s.instruction}`).join('\n\n')}

CHEF'S NOTE:
${recipe.culinaryWhyItWorks}`;

    navigator.clipboard.writeText(text);
    alert('Recipe copied to clipboard!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="bg-stone-50 rounded-2xl border border-stone-200 shadow-2xl max-w-4xl w-full max-h-[92vh] overflow-hidden flex flex-col">
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-stone-200 bg-white flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-800">
            <span>{recipe.cuisine} Cuisine</span>
            <span aria-hidden="true">·</span>
            <span>{recipe.difficulty}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-amber-900 font-bold">
              {recipe.pantryMatchPercentage}% Match
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleSave(recipe)}
              className={`p-2 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors ${
                isSaved
                  ? 'bg-amber-100 border-amber-300 text-amber-900'
                  : 'bg-white border-stone-200 text-stone-600 hover:text-stone-900'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
              <span className="hidden sm:inline">{isSaved ? 'Saved' : 'Save'}</span>
            </button>

            <button
              onClick={handleCopyRecipe}
              className="p-2 rounded-lg border border-stone-200 bg-white text-stone-600 hover:text-stone-900 transition-colors"
              title="Copy recipe text"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-8">
          {/* Title Area */}
          <div>
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-stone-900">
              {recipe.title}
            </h1>
            <p className="text-sm text-stone-600 italic mt-1 font-serif">
              "{recipe.tagline}"
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-stone-600 mt-4 pt-4 border-t border-stone-200">
              <span className="flex items-center gap-1 text-stone-900 font-semibold">
                <Clock className="w-4 h-4 text-amber-800" />
                <span className="font-mono tabular-nums">{recipe.totalTimeMinutes} min</span> total
              </span>
              <span aria-hidden="true">·</span>
              <span>{recipe.prepTimeMinutes} min prep</span>
              <span aria-hidden="true">·</span>
              <span>{recipe.cookTimeMinutes} min cook</span>
              <span aria-hidden="true">·</span>
              <span>{recipe.servings} servings</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">
                {recipe.nutritionPerServing.calories} calories / serving
              </span>
            </div>
          </div>

          {/* Culinary Flavor Science / Theory */}
          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs text-stone-700 space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-amber-900">
              <Sparkles className="w-4 h-4 text-amber-800" />
              <span>Culinary Architecture (Why It Works)</span>
            </div>
            <p className="leading-relaxed italic pl-5">{recipe.culinaryWhyItWorks}</p>
          </div>

          {/* Two-Column: Ingredients vs Flavor/Nutrition */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Ingredients */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-900">
                  Ingredients Checklist
                </h2>
                <span className="text-xs text-stone-500">
                  {recipe.ingredientsUsed.length} items
                </span>
              </div>

              <div className="space-y-2">
                {recipe.ingredientsUsed.map((ing, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg border border-stone-200 bg-white text-xs flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle2
                        className={`w-4 h-4 ${
                          ing.fromPantry ? 'text-emerald-600' : 'text-stone-300'
                        }`}
                      />
                      <span className="font-medium text-stone-900">{ing.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-stone-500 font-mono tabular-nums">{ing.amount}</span>
                      {ing.fromPantry ? (
                        <span className="text-[10px] text-emerald-800 font-medium bg-emerald-50 px-1.5 py-0.5 rounded">
                          In Pantry
                        </span>
                      ) : (
                        <span className="text-[10px] text-amber-800 font-medium bg-amber-50 px-1.5 py-0.5 rounded">
                          Grocery Add
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Missing Ingredients / Groceries */}
              {recipe.missingIngredients.length > 0 && (
                <div className="pt-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-700 mb-2">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
                    <span>Missing additions (optional):</span>
                  </div>
                  <div className="space-y-1.5">
                    {recipe.missingIngredients.map((m, idx) => (
                      <div
                        key={idx}
                        className="text-xs text-stone-600 bg-stone-100/70 p-2 rounded-md flex justify-between"
                      >
                        <span>
                          {m.amount} {m.name}
                        </span>
                        {m.estimatedPrice && (
                          <span className="text-stone-500 font-mono">{m.estimatedPrice}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Chef Substitutions */}
              {recipe.chefSubstitutions.length > 0 && (
                <div className="pt-2">
                  <h3 className="text-xs font-semibold text-stone-900 mb-2">
                    Chef Substitution Hacks:
                  </h3>
                  <div className="space-y-2">
                    {recipe.chefSubstitutions.map((sub, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-lg bg-stone-100/80 border border-stone-200 text-xs"
                      >
                        <p className="font-medium text-stone-800">
                          Swap <span className="text-amber-900 underline">{sub.original}</span> for{' '}
                          <span className="text-emerald-800 font-semibold">{sub.substitute}</span>
                        </p>
                        <p className="text-stone-500 text-[11px] mt-0.5">{sub.note}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Flavor Profile & Nutrition */}
            <div className="space-y-6">
              {/* Macro Nutrition Facts Table */}
              <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-stone-900 mb-3">
                  Nutritional Estimates (Per Serving)
                </h2>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-stone-50 rounded-lg border border-stone-100">
                    <span className="text-stone-500 block">Calories</span>
                    <span className="text-xl font-mono font-bold text-stone-900 tabular-nums">
                      {recipe.nutritionPerServing.calories} kcal
                    </span>
                  </div>

                  <div className="p-3 bg-stone-50 rounded-lg border border-stone-100">
                    <span className="text-stone-500 block">Protein</span>
                    <span className="text-xl font-mono font-bold text-stone-900 tabular-nums">
                      {recipe.nutritionPerServing.proteinGrams}g
                    </span>
                  </div>

                  <div className="p-3 bg-stone-50 rounded-lg border border-stone-100">
                    <span className="text-stone-500 block">Carbohydrates</span>
                    <span className="text-xl font-mono font-bold text-stone-900 tabular-nums">
                      {recipe.nutritionPerServing.carbsGrams}g
                    </span>
                  </div>

                  <div className="p-3 bg-stone-50 rounded-lg border border-stone-100">
                    <span className="text-stone-500 block">Healthy Fats</span>
                    <span className="text-xl font-mono font-bold text-stone-900 tabular-nums">
                      {recipe.nutritionPerServing.fatGrams}g
                    </span>
                  </div>
                </div>
                <div className="mt-3 text-[11px] text-stone-500 flex justify-between">
                  <span>Dietary Fiber: {recipe.nutritionPerServing.fiberGrams}g</span>
                  <span>Calculated from ingredients</span>
                </div>
              </div>

              {/* Flavor Profile Radar / Bars */}
              {recipe.flavorProfile && (
                <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs space-y-3">
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-stone-900">
                    Flavor Profile Balance
                  </h2>
                  <div className="space-y-2 text-xs">
                    {Object.entries(recipe.flavorProfile).map(([flavor, val]) => (
                      <div key={flavor} className="space-y-1">
                        <div className="flex justify-between capitalize text-stone-600">
                          <span>{flavor}</span>
                          <span className="font-mono text-stone-500">{val}/10</span>
                        </div>
                        <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-amber-700 h-full rounded-full"
                            style={{ width: `${(val / 10) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Beverage Pairing */}
              {recipe.beveragePairing && (
                <div className="p-4 rounded-xl bg-stone-100/90 border border-stone-200 text-xs text-stone-700 flex items-start gap-3">
                  <Wine className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block text-stone-900 mb-0.5">
                      Chef's Beverage Pairing
                    </span>
                    <span>{recipe.beveragePairing}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Step-by-Step Instructions */}
          <div className="space-y-4 pt-4 border-t border-stone-200">
            <h2 className="text-base font-serif font-bold text-stone-900">
              Cooking Instructions & Technique
            </h2>

            <div className="space-y-4">
              {recipe.steps.map((step) => (
                <div
                  key={step.stepNumber}
                  className="p-4 rounded-xl bg-white border border-stone-200 space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-amber-900 font-mono">
                      STEP {step.stepNumber}
                    </span>
                    {step.durationMinutes && (
                      <span className="text-stone-500 font-mono">
                        ~{step.durationMinutes} minutes
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-stone-900 text-sm">{step.title}</h3>
                  <p className="text-xs text-stone-700 leading-relaxed">{step.instruction}</p>
                  {step.chefTip && (
                    <p className="text-[11px] text-amber-800 italic bg-amber-50 p-2 rounded">
                      <span className="font-medium not-italic">Chef Tip: </span>
                      {step.chefTip}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Sticky Footer CTA */}
        <div className="px-6 py-4 border-t border-stone-200 bg-stone-100 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-200 transition-colors"
          >
            Close
          </button>

          <button
            onClick={() => {
              onClose();
              onStartCookMode(recipe);
            }}
            className="px-6 py-2.5 bg-amber-800 hover:bg-amber-900 text-stone-50 rounded-lg text-xs font-semibold transition-all shadow-xs flex items-center gap-2"
          >
            <ChefHat className="w-4 h-4" />
            <span>Launch Step-by-Step Cooking Mode</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
