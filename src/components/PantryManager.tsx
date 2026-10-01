import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  Camera,
  RotateCcw,
  Sparkles,
  AlertTriangle,
  Check,
  Search,
} from 'lucide-react';
import { Ingredient } from '../types';
import { COMMON_PANTRY_CHIPS, PANTRY_PRESETS } from '../data/presetPantries';

interface PantryManagerProps {
  ingredients: Ingredient[];
  onAddIngredient: (ingredient: Omit<Ingredient, 'id'>) => void;
  onRemoveIngredient: (id: string) => void;
  onTogglePerishable: (id: string) => void;
  onClearPantry: () => void;
  onLoadPreset: (presetId: string) => void;
  onOpenScanner: () => void;
  onFindRecipes: () => void;
  isGenerating: boolean;
}

const CATEGORIES: Ingredient['category'][] = [
  'Produce',
  'Protein',
  'Dairy',
  'Grains & Bakery',
  'Pantry',
  'Spices & Oils',
  'Other',
];

export const PantryManager: React.FC<PantryManagerProps> = ({
  ingredients,
  onAddIngredient,
  onRemoveIngredient,
  onTogglePerishable,
  onClearPantry,
  onLoadPreset,
  onOpenScanner,
  onFindRecipes,
  isGenerating,
}) => {
  const [nameInput, setNameInput] = useState('');
  const [quantityInput, setQuantityInput] = useState('');
  const [categoryInput, setCategoryInput] = useState<Ingredient['category']>('Produce');
  const [isPerishableInput, setIsPerishableInput] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) return;

    onAddIngredient({
      name: nameInput.trim(),
      category: categoryInput,
      quantity: quantityInput.trim() || undefined,
      perishable: isPerishableInput,
    });

    setNameInput('');
    setQuantityInput('');
    setIsPerishableInput(false);
  };

  const handleToggleCommonChip = (chip: (typeof COMMON_PANTRY_CHIPS)[0]) => {
    const existing = ingredients.find(
      (i) => i.name.toLowerCase() === chip.name.toLowerCase()
    );
    if (existing) {
      onRemoveIngredient(existing.id);
    } else {
      onAddIngredient({
        name: chip.name,
        category: chip.category,
        perishable: chip.category === 'Produce' || chip.category === 'Dairy' || chip.category === 'Protein',
      });
    }
  };

  const perishableCount = ingredients.filter((i) => i.perishable).length;

  const filteredIngredients = ingredients.filter((i) =>
    i.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Hero Welcome / Actions Area */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 md:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-800 mb-2">
              <span>Culinary Inventory</span>
              <span aria-hidden="true">·</span>
              <span>Zero-Waste Kitchen</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-stone-900 leading-tight">
              What ingredients do you have on hand today?
            </h1>
            <p className="text-sm text-stone-600 mt-2 leading-relaxed">
              Add your groceries, staples, and fresh produce below. Our AI chef will analyze flavor compounds,
              pantry matches, and cook modes to recommend restaurant-caliber recipes.
            </p>
          </div>

          <div className="flex flex-wrap md:flex-col lg:flex-row items-stretch md:items-end gap-3 shrink-0">
            <button
              onClick={onOpenScanner}
              className="flex-1 md:flex-none px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 border border-stone-200"
            >
              <Camera className="w-4 h-4 text-amber-800" />
              <span>Scan Fridge / Photo</span>
            </button>

            <button
              onClick={onFindRecipes}
              disabled={ingredients.length === 0 || isGenerating}
              className="flex-1 md:flex-none px-5 py-2.5 bg-amber-800 hover:bg-amber-900 text-stone-50 rounded-lg text-sm font-medium transition-all shadow-xs flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>{isGenerating ? 'Curating Dishes...' : 'Recommend Recipes'}</span>
            </button>
          </div>
        </div>

        {/* Preset Starters Bar */}
        <div className="mt-6 pt-6 border-t border-stone-100 flex flex-wrap items-center gap-2 text-xs text-stone-600">
          <span className="font-medium text-stone-500 mr-1">Quick Starter Pantries:</span>
          {PANTRY_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => onLoadPreset(preset.id)}
              className="px-2.5 py-1 rounded-md bg-stone-100 hover:bg-amber-50 hover:text-amber-900 hover:border-amber-200 border border-stone-200 transition-colors"
            >
              {preset.name}
            </button>
          ))}
          {ingredients.length > 0 && (
            <button
              onClick={onClearPantry}
              className="ml-auto text-xs text-stone-400 hover:text-red-700 flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
          )}
        </div>
      </div>

      {/* Manual Ingredient Input & Fast Toggles */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Input Form + Quick Add Chips */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs">
            <h2 className="text-sm font-semibold text-stone-900 mb-3 flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-amber-800" />
              <span>Add Custom Ingredient</span>
            </h2>

            <form onSubmit={handleAddCustom} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1">
                  Ingredient Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Chicken thighs, Kale, Lemon"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-hidden focus:border-amber-700 text-stone-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1">
                    Quantity / Unit (opt)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 2 pieces, 1 cup"
                    value={quantityInput}
                    onChange={(e) => setQuantityInput(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-hidden focus:border-amber-700 text-stone-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1">
                    Category
                  </label>
                  <select
                    value={categoryInput}
                    onChange={(e) => setCategoryInput(e.target.value as Ingredient['category'])}
                    className="w-full px-2.5 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-hidden focus:border-amber-700 text-stone-900"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={isPerishableInput}
                  onChange={(e) => setIsPerishableInput(e.target.checked)}
                  className="w-3.5 h-3.5 text-amber-700 rounded border-stone-300 focus:ring-amber-700"
                />
                <span className="text-xs text-stone-600">
                  Expiring soon / High perishable (prioritize in meals)
                </span>
              </label>

              <button
                type="submit"
                disabled={!nameInput.trim()}
                className="w-full py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Add to My Pantry
              </button>
            </form>
          </div>

          {/* Quick-add popular staples */}
          <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-stone-900">Popular Staples</h2>
              <span className="text-[11px] text-stone-500">Tap to toggle</span>
            </div>

            <div className="flex flex-wrap gap-1.5 max-h-64 overflow-y-auto pr-1">
              {COMMON_PANTRY_CHIPS.map((chip) => {
                const isActive = ingredients.some(
                  (i) => i.name.toLowerCase() === chip.name.toLowerCase()
                );
                return (
                  <button
                    key={chip.name}
                    onClick={() => handleToggleCommonChip(chip)}
                    className={`px-2.5 py-1 text-xs rounded-md border transition-all flex items-center gap-1 ${
                      isActive
                        ? 'bg-amber-100/70 border-amber-300 text-amber-900 font-medium'
                        : 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-700'
                    }`}
                  >
                    {isActive ? (
                      <Check className="w-3 h-3 text-amber-800" />
                    ) : (
                      <Plus className="w-3 h-3 text-stone-400" />
                    )}
                    <span>{chip.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Active Pantry Grid */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
              <div>
                <h2 className="text-base font-serif font-bold text-stone-900">
                  Your Available Ingredients ({ingredients.length})
                </h2>
                <div className="flex items-center gap-2 text-xs text-stone-500 mt-0.5">
                  <span>{ingredients.length} items logged</span>
                  {perishableCount > 0 && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="text-amber-700 font-medium flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        {perishableCount} expiring soon
                      </span>
                    </>
                  )}
                </div>
              </div>

              {ingredients.length > 5 && (
                <div className="relative w-full sm:w-56">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Search pantry..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-hidden focus:border-amber-700 text-stone-800"
                  />
                </div>
              )}
            </div>

            {ingredients.length === 0 ? (
              <div className="py-16 text-center">
                <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 mx-auto flex items-center justify-center mb-3">
                  <Plus className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-semibold text-stone-700">Your pantry is empty</h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1">
                  Add ingredients using the form on the left, tap a starter pantry, or take a picture
                  of your fridge.
                </p>
                <div className="mt-4 flex justify-center gap-2">
                  <button
                    onClick={() => onLoadPreset('italian-weeknight')}
                    className="px-3 py-1.5 bg-amber-800 text-stone-50 rounded-lg text-xs font-medium hover:bg-amber-900 transition-colors"
                  >
                    Load Italian Starter
                  </button>
                  <button
                    onClick={onOpenScanner}
                    className="px-3 py-1.5 bg-stone-100 text-stone-700 rounded-lg text-xs font-medium hover:bg-stone-200 transition-colors border border-stone-200"
                  >
                    Scan Fridge
                  </button>
                </div>
              </div>
            ) : (
              <div className="pt-4 space-y-6">
                {CATEGORIES.map((category) => {
                  const categoryItems = filteredIngredients.filter((i) => i.category === category);
                  if (categoryItems.length === 0) return null;

                  return (
                    <div key={category} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-stone-600 tracking-wide">
                          {category}
                        </span>
                        <span className="text-xs text-stone-400">({categoryItems.length})</span>
                        <div className="flex-1 border-b border-stone-100 ml-2" />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                        {categoryItems.map((item) => (
                          <div
                            key={item.id}
                            className={`p-2.5 rounded-lg border text-xs flex items-center justify-between group transition-all ${
                              item.perishable
                                ? 'bg-amber-50/70 border-amber-200'
                                : 'bg-stone-50/80 border-stone-200 hover:border-stone-300'
                            }`}
                          >
                            <div className="min-w-0 pr-2">
                              <p className="font-medium text-stone-900 truncate">{item.name}</p>
                              <div className="flex items-center gap-1.5 text-[11px] text-stone-500 mt-0.5">
                                {item.quantity && <span>{item.quantity}</span>}
                                {item.quantity && item.perishable && <span>·</span>}
                                {item.perishable && (
                                  <span className="text-amber-800 font-medium">Expiring</span>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                onClick={() => onTogglePerishable(item.id)}
                                title={
                                  item.perishable
                                    ? 'Marked as expiring soon (click to toggle)'
                                    : 'Click if expiring soon'
                                }
                                className={`p-1 rounded hover:bg-stone-200/60 transition-colors ${
                                  item.perishable ? 'text-amber-700' : 'text-stone-300 hover:text-stone-600'
                                }`}
                              >
                                <AlertTriangle className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => onRemoveIngredient(item.id)}
                                className="p-1 rounded text-stone-400 hover:text-red-700 hover:bg-red-50 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
