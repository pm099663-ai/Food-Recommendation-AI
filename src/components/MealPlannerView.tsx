import React, { useState } from 'react';
import {
  Calendar,
  Sparkles,
  CheckCircle2,
  Clock,
  ShoppingCart,
  Printer,
  RotateCcw,
  Loader2,
  ChefHat,
  Leaf,
} from 'lucide-react';
import { Ingredient, MealPlan } from '../types';

interface MealPlannerViewProps {
  ingredients: Ingredient[];
  mealPlan: MealPlan | null;
  onGenerateMealPlan: (days: number) => Promise<void>;
  isGenerating: boolean;
}

export const MealPlannerView: React.FC<MealPlannerViewProps> = ({
  ingredients,
  mealPlan,
  onGenerateMealPlan,
  isGenerating,
}) => {
  const [selectedDays, setSelectedDays] = useState(3);
  const [checkedGroceryItems, setCheckedGroceryItems] = useState<string[]>([]);

  const toggleGroceryItem = (item: string) => {
    setCheckedGroceryItems((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8">
      {/* Top Banner / Generator */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 md:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-800 mb-2">
              <Leaf className="w-3.5 h-3.5" />
              <span>Zero-Waste Meal Planning</span>
              <span aria-hidden="true">·</span>
              <span>Pantry Optimization</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-stone-900 leading-tight">
              Turn your current pantry into a multi-day culinary plan
            </h1>
            <p className="text-sm text-stone-600 mt-2 leading-relaxed">
              Our AI connects your ingredients across multiple meals, using up perishable produce on Day 1
              and recycling staples into hearty lunches and dinners without waste.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            {/* Days segmented control */}
            <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-lg border border-stone-200 text-xs">
              <button
                onClick={() => setSelectedDays(3)}
                className={`px-3 py-1.5 font-medium rounded-md transition-colors ${
                  selectedDays === 3
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                3-Day Plan
              </button>
              <button
                onClick={() => setSelectedDays(5)}
                className={`px-3 py-1.5 font-medium rounded-md transition-colors ${
                  selectedDays === 5
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                5-Day Plan
              </button>
            </div>

            <button
              onClick={() => onGenerateMealPlan(selectedDays)}
              disabled={ingredients.length === 0 || isGenerating}
              className="px-5 py-2.5 bg-amber-800 hover:bg-amber-900 text-stone-50 rounded-lg text-sm font-medium transition-all shadow-xs flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>{isGenerating ? 'Building Plan...' : `Generate ${selectedDays}-Day Plan`}</span>
            </button>
          </div>
        </div>

        {mealPlan && (
          <div className="mt-6 pt-6 border-t border-stone-100 flex items-center justify-between text-xs text-stone-600">
            <span className="italic">{mealPlan.overview}</span>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 text-stone-700 hover:text-stone-900 font-medium ml-4 shrink-0"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Plan</span>
            </button>
          </div>
        )}
      </div>

      {/* Loading state */}
      {isGenerating && (
        <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-amber-800 animate-spin mx-auto" />
          <h3 className="text-base font-serif font-bold text-stone-900">
            Crafting your zero-waste meal strategy...
          </h3>
          <p className="text-xs text-stone-500 max-w-md mx-auto">
            Analyzing ingredient shelf life, batch cooking opportunities, and sequencing dishes to
            minimize leftover waste.
          </p>
        </div>
      )}

      {/* Meal Plan Content */}
      {!isGenerating && mealPlan && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Days breakdown: 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            {mealPlan.days.map((day) => (
              <div
                key={day.dayNumber}
                className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs"
              >
                <div className="px-6 py-4 bg-stone-100/60 border-b border-stone-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-amber-800 uppercase tracking-widest">
                      DAY {day.dayNumber}
                    </span>
                    <span aria-hidden="true" className="text-stone-300">
                      ·
                    </span>
                    <h2 className="text-sm font-semibold text-stone-900">{day.dayTitle}</h2>
                  </div>
                </div>

                <div className="p-6 space-y-4 divide-y divide-stone-100">
                  {day.meals.map((meal, mIdx) => (
                    <div
                      key={mIdx}
                      className={`${mIdx > 0 ? 'pt-4' : ''} space-y-1.5`}
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-amber-900 uppercase tracking-wider">
                          {meal.mealType}
                        </span>
                        <span className="text-stone-500 font-mono flex items-center gap-1">
                          <Clock className="w-3 h-3 text-stone-400" />
                          <span>{meal.prepTimeMinutes} min</span>
                        </span>
                      </div>

                      <h3 className="text-base font-serif font-bold text-stone-900">
                        {meal.dishName}
                      </h3>
                      <p className="text-xs text-stone-600 leading-relaxed">
                        {meal.briefDescription}
                      </p>

                      <div className="pt-1 flex flex-wrap items-center gap-2 text-xs text-stone-500">
                        <span className="font-medium text-stone-600">Uses:</span>
                        <span>{meal.ingredientsUsed.join(', ')}</span>
                      </div>

                      {meal.zeroWasteTip && (
                        <p className="text-[11px] text-amber-800 italic bg-amber-50/60 p-2 rounded mt-1">
                          <span className="font-semibold not-italic">Zero-Waste Note: </span>
                          {meal.zeroWasteTip}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Smart Grocery Checklist */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs sticky top-24 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4 text-amber-800" />
                  <h2 className="text-sm font-semibold text-stone-900">
                    Smart Grocery Additions
                  </h2>
                </div>
                <span className="text-xs text-stone-500 font-mono">
                  {checkedGroceryItems.length} checked
                </span>
              </div>

              <p className="text-xs text-stone-500">
                Only a few fresh additions needed to complete all {selectedDays} days of chef meals:
              </p>

              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                {mealPlan.smartGroceryList.map((aisle, aIdx) => (
                  <div key={aIdx} className="space-y-2">
                    <h3 className="text-xs font-semibold text-stone-700 tracking-wide">
                      {aisle.aisle}
                    </h3>
                    <div className="space-y-1.5">
                      {aisle.items.map((item, iIdx) => {
                        const isChecked = checkedGroceryItems.includes(item);
                        return (
                          <div
                            key={iIdx}
                            onClick={() => toggleGroceryItem(item)}
                            className={`p-2 rounded-lg border text-xs cursor-pointer flex items-center gap-2 transition-colors ${
                              isChecked
                                ? 'bg-stone-50 text-stone-400 border-stone-200 line-through'
                                : 'bg-white border-stone-200 text-stone-800 hover:border-stone-300'
                            }`}
                          >
                            <div
                              className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${
                                isChecked
                                  ? 'bg-emerald-600 border-emerald-600 text-white'
                                  : 'border-stone-300 bg-white'
                              }`}
                            >
                              {isChecked && <CheckCircle2 className="w-3 h-3" />}
                            </div>
                            <span className="truncate">{item}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isGenerating && !mealPlan && (
        <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 mx-auto flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
          <h3 className="text-base font-serif font-bold text-stone-800">
            No Meal Plan Generated Yet
          </h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Choose whether you'd like a 3-Day or 5-Day plan above, and click "Generate" to map out your
            meals seamlessly.
          </p>
        </div>
      )}
    </div>
  );
};
