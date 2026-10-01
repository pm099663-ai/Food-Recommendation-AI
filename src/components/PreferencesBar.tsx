import React from 'react';
import { SlidersHorizontal, Clock, Flame, ShieldAlert } from 'lucide-react';
import { CookingPreferences } from '../types';

interface PreferencesBarProps {
  preferences: CookingPreferences;
  onChange: (updated: Partial<CookingPreferences>) => void;
  onRefreshRecommendations: () => void;
  isGenerating: boolean;
}

const DIETARY_OPTIONS = [
  { value: 'none', label: 'No Restrictions' },
  { value: 'vegetarian', label: 'Vegetarian' },
  { value: 'vegan', label: 'Vegan' },
  { value: 'gluten-free', label: 'Gluten-Free' },
  { value: 'dairy-free', label: 'Dairy-Free' },
  { value: 'keto', label: 'Keto / Low-Carb' },
  { value: 'pescatarian', label: 'Pescatarian' },
];

const MEAL_TYPES = [
  { value: 'any', label: 'Any Meal' },
  { value: 'quick dinner', label: 'Weeknight Dinner' },
  { value: 'breakfast', label: 'Breakfast / Brunch' },
  { value: 'quick lunch', label: '15-Min Lunch' },
  { value: 'comfort bowl', label: 'Hearty / Comfort' },
  { value: 'dessert', label: 'Dessert' },
];

const TIME_OPTIONS = [15, 30, 45, 60];

const EQUIPMENT_OPTIONS = ['stovetop', 'oven', 'air-fryer', 'microwave', 'blender'];

export const PreferencesBar: React.FC<PreferencesBarProps> = ({
  preferences,
  onChange,
  onRefreshRecommendations,
  isGenerating,
}) => {
  const toggleEquipment = (eq: string) => {
    const current = preferences.equipment;
    if (current.includes(eq)) {
      if (current.length > 1) {
        onChange({ equipment: current.filter((e) => e !== eq) });
      }
    } else {
      onChange({ equipment: [...current, eq] });
    }
  };

  return (
    <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-stone-100">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-amber-800" />
          <h2 className="text-sm font-semibold text-stone-900">
            Culinary Filters & Cooking Mode
          </h2>
        </div>

        {/* Cook Mode Segmented Control */}
        <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-lg border border-stone-200/70 text-xs">
          <button
            type="button"
            onClick={() => onChange({ cookMode: 'flexible' })}
            className={`px-3 py-1.5 font-medium rounded-md transition-colors ${
              preferences.cookMode === 'flexible'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Smart Complement
          </button>
          <button
            type="button"
            onClick={() => onChange({ cookMode: 'strict' })}
            className={`px-3 py-1.5 font-medium rounded-md transition-colors ${
              preferences.cookMode === 'strict'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Strict Pantry Only
          </button>
          <button
            type="button"
            onClick={() => onChange({ cookMode: 'zero-waste' })}
            className={`px-3 py-1.5 font-medium rounded-md transition-colors ${
              preferences.cookMode === 'zero-waste'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Zero-Waste Priority
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        {/* Prep Time */}
        <div>
          <label className="block text-stone-600 font-medium mb-1.5 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-stone-400" />
            <span>Max Time ({preferences.maxPrepTimeMinutes} min)</span>
          </label>
          <div className="flex items-center gap-1 p-1 bg-stone-50 rounded-lg border border-stone-200">
            {TIME_OPTIONS.map((time) => (
              <button
                key={time}
                onClick={() => onChange({ maxPrepTimeMinutes: time })}
                className={`flex-1 py-1 text-center rounded-md font-medium transition-colors ${
                  preferences.maxPrepTimeMinutes === time
                    ? 'bg-stone-900 text-white'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {time}m
              </button>
            ))}
          </div>
        </div>

        {/* Dietary */}
        <div>
          <label className="block text-stone-600 font-medium mb-1.5 flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5 text-stone-400" />
            <span>Dietary Restrictions</span>
          </label>
          <select
            value={preferences.dietary}
            onChange={(e) => onChange({ dietary: e.target.value })}
            className="w-full px-2.5 py-1.5 bg-stone-50 border border-stone-200 rounded-lg focus:outline-hidden focus:border-amber-700 text-stone-800"
          >
            {DIETARY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Meal Type */}
        <div>
          <label className="block text-stone-600 font-medium mb-1.5 flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-stone-400" />
            <span>Meal Type</span>
          </label>
          <select
            value={preferences.mealType}
            onChange={(e) => onChange({ mealType: e.target.value })}
            className="w-full px-2.5 py-1.5 bg-stone-50 border border-stone-200 rounded-lg focus:outline-hidden focus:border-amber-700 text-stone-800"
          >
            {MEAL_TYPES.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>

        {/* Servings & Skill */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-stone-600 font-medium mb-1.5">Servings</label>
            <select
              value={preferences.servings}
              onChange={(e) => onChange({ servings: parseInt(e.target.value, 10) })}
              className="w-full px-2 py-1.5 bg-stone-50 border border-stone-200 rounded-lg focus:outline-hidden focus:border-amber-700 text-stone-800"
            >
              {[1, 2, 4, 6, 8].map((s) => (
                <option key={s} value={s}>
                  {s} {s === 1 ? 'serving' : 'servings'}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-stone-600 font-medium mb-1.5">Skill</label>
            <select
              value={preferences.skillLevel}
              onChange={(e) =>
                onChange({
                  skillLevel: e.target.value as CookingPreferences['skillLevel'],
                })
              }
              className="w-full px-2 py-1.5 bg-stone-50 border border-stone-200 rounded-lg focus:outline-hidden focus:border-amber-700 text-stone-800"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Chef-Level</option>
            </select>
          </div>
        </div>
      </div>

      {/* Equipment row */}
      <div className="pt-2 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-medium text-stone-500">Equipment:</span>
          <div className="flex flex-wrap gap-1">
            {EQUIPMENT_OPTIONS.map((eq) => {
              const active = preferences.equipment.includes(eq);
              return (
                <button
                  key={eq}
                  onClick={() => toggleEquipment(eq)}
                  className={`px-2 py-0.5 rounded-md border capitalize transition-colors ${
                    active
                      ? 'bg-amber-100/70 border-amber-300 text-amber-900 font-medium'
                      : 'bg-stone-50 border-stone-200 text-stone-500 hover:text-stone-800'
                  }`}
                >
                  {eq.replace('-', ' ')}
                </button>
              );
            })}
          </div>
        </div>

        <button
          onClick={onRefreshRecommendations}
          disabled={isGenerating}
          className="text-amber-800 hover:text-amber-900 font-medium text-xs flex items-center gap-1 hover:underline ml-auto"
        >
          <span>Apply Filters & Re-roll Recipes</span>
        </button>
      </div>
    </div>
  );
};
