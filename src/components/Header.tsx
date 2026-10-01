import React from 'react';
import { ChefHat, Bookmark, Sparkles, Calendar, Refrigerator } from 'lucide-react';

interface HeaderProps {
  activeTab: 'pantry' | 'recipes' | 'planner' | 'saved';
  setActiveTab: (tab: 'pantry' | 'recipes' | 'planner' | 'saved') => void;
  pantryCount: number;
  savedCount: number;
  onGenerateClick: () => void;
  isGenerating: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  pantryCount,
  savedCount,
  onGenerateClick,
  isGenerating,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-stone-50/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-700 text-stone-50 flex items-center justify-center font-serif text-lg font-bold shadow-xs">
              M
            </div>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setActiveTab('pantry');
              }}
              className="text-xl font-serif font-bold tracking-tight text-stone-900 hover:text-amber-800 transition-colors"
            >
              Mise & Meal
            </a>
          </div>

          {/* Zone 2: Clean 4-link navigation */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab('pantry')}
              className={`px-3 py-1.5 text-sm font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === 'pantry'
                  ? 'text-amber-900 border-b-2 border-amber-800'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Refrigerator className="w-4 h-4" />
              <span>Pantry</span>
              {pantryCount > 0 && (
                <span className="text-xs text-stone-500 font-mono">({pantryCount})</span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('recipes')}
              className={`px-3 py-1.5 text-sm font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === 'recipes'
                  ? 'text-amber-900 border-b-2 border-amber-800'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <ChefHat className="w-4 h-4" />
              <span>Recipe Suggestions</span>
            </button>

            <button
              onClick={() => setActiveTab('planner')}
              className={`px-3 py-1.5 text-sm font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === 'planner'
                  ? 'text-amber-900 border-b-2 border-amber-800'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Meal Planner</span>
            </button>

            <button
              onClick={() => setActiveTab('saved')}
              className={`px-3 py-1.5 text-sm font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === 'saved'
                  ? 'text-amber-900 border-b-2 border-amber-800'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span>Saved Recipes</span>
              {savedCount > 0 && (
                <span className="text-xs text-stone-500 font-mono">({savedCount})</span>
              )}
            </button>
          </nav>

          {/* Zone 3: Primary action button */}
          <div className="flex items-center gap-2">
            <button
              onClick={onGenerateClick}
              disabled={pantryCount === 0 || isGenerating}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-2 whitespace-nowrap shadow-xs ${
                pantryCount === 0
                  ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                  : 'bg-amber-800 text-stone-50 hover:bg-amber-900 active:scale-98'
              }`}
            >
              <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>{isGenerating ? 'Curating Dishes...' : 'Find Meal Ideas'}</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden border-t border-stone-200 py-2 justify-around text-xs">
          <button
            onClick={() => setActiveTab('pantry')}
            className={`flex flex-col items-center gap-1 py-1 px-2 ${
              activeTab === 'pantry' ? 'text-amber-900 font-semibold' : 'text-stone-600'
            }`}
          >
            <Refrigerator className="w-4 h-4" />
            <span>Pantry ({pantryCount})</span>
          </button>
          <button
            onClick={() => setActiveTab('recipes')}
            className={`flex flex-col items-center gap-1 py-1 px-2 ${
              activeTab === 'recipes' ? 'text-amber-900 font-semibold' : 'text-stone-600'
            }`}
          >
            <ChefHat className="w-4 h-4" />
            <span>Recipes</span>
          </button>
          <button
            onClick={() => setActiveTab('planner')}
            className={`flex flex-col items-center gap-1 py-1 px-2 ${
              activeTab === 'planner' ? 'text-amber-900 font-semibold' : 'text-stone-600'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Planner</span>
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`flex flex-col items-center gap-1 py-1 px-2 ${
              activeTab === 'saved' ? 'text-amber-900 font-semibold' : 'text-stone-600'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>Saved ({savedCount})</span>
          </button>
        </div>
      </div>
    </header>
  );
};
