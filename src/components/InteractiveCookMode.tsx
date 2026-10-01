import React, { useState, useEffect } from 'react';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  Check,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Send,
  MessageSquare,
  Volume2,
  ChefHat,
  Users,
} from 'lucide-react';
import { Recipe } from '../types';

interface InteractiveCookModeProps {
  recipe: Recipe;
  onClose: () => void;
}

export const InteractiveCookMode: React.FC<InteractiveCookModeProps> = ({
  recipe,
  onClose,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [checkedIngredients, setCheckedIngredients] = useState<string[]>([]);
  const [servingMultiplier, setServingMultiplier] = useState(1);

  // Timer state for current step
  const currentStep = recipe.steps[currentStepIndex];
  const stepDurationSeconds = (currentStep?.durationMinutes || 0) * 60;
  const [timeLeft, setTimeLeft] = useState(stepDurationSeconds);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // AI Sous Chef panel state
  const [isSousChefOpen, setIsSousChefOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<
    Array<{ sender: 'user' | 'chef'; text: string }>
  >([
    {
      sender: 'chef',
      text: `Hello! I'm your AI Sous-Chef for "${recipe.title}". Need ingredient substitutions, cooking adjustments, or rescuing a sauce? Ask me anytime!`,
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isAskingChef, setIsAskingChef] = useState(false);

  // Reset timer when changing step
  useEffect(() => {
    const duration = (recipe.steps[currentStepIndex]?.durationMinutes || 0) * 60;
    setTimeLeft(duration);
    setIsTimerRunning(false);
  }, [currentStepIndex, recipe.steps]);

  // Timer countdown
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      playChime();
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  // Audio chime using browser Web Audio API
  const playChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3); // A5
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.8);
    } catch (e) {
      console.log('Audio chime not supported');
    }
  };

  const toggleStepCompleted = (stepNumber: number) => {
    setCompletedSteps((prev) =>
      prev.includes(stepNumber) ? prev.filter((s) => s !== stepNumber) : [...prev, stepNumber]
    );
  };

  const toggleIngredientCheck = (name: string) => {
    setCheckedIngredients((prev) =>
      prev.includes(name) ? prev.filter((i) => i !== name) : [...prev, name]
    );
  };

  const handleNextStep = () => {
    if (currentStepIndex < recipe.steps.length - 1) {
      if (!completedSteps.includes(currentStep.stepNumber)) {
        toggleStepCompleted(currentStep.stepNumber);
      }
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isAskingChef) return;

    const question = chatInput.trim();
    setChatMessages((prev) => [...prev, { sender: 'user', text: question }]);
    setChatInput('');
    setIsAskingChef(true);

    try {
      const response = await fetch('/api/sous-chef-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipe,
          question,
        }),
      });

      if (!response.ok) throw new Error('Failed to get answer');
      const data = await response.json();
      setChatMessages((prev) => [...prev, { sender: 'chef', text: data.answer }]);
    } catch (err: any) {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'chef',
          text: 'I could not process that request right now. Try tasting and adjusting seasoning gradually.',
        },
      ]);
    } finally {
      setIsAskingChef(false);
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/90 backdrop-blur-md flex flex-col text-stone-100 overflow-hidden">
      {/* Top Bar Navigation */}
      <div className="px-6 py-4 border-b border-stone-800 bg-stone-950/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-700/30 text-amber-400">
            <ChefHat className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-mono text-amber-400 uppercase tracking-widest">
              Live Cooking Mode
            </span>
            <h1 className="text-base sm:text-lg font-serif font-bold text-white line-clamp-1">
              {recipe.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Servings scaler */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-stone-800/80 rounded-lg text-xs border border-stone-700">
            <Users className="w-3.5 h-3.5 text-stone-400" />
            <span>Portions:</span>
            <button
              onClick={() => setServingMultiplier(0.5)}
              className={`px-1.5 py-0.5 rounded ${
                servingMultiplier === 0.5 ? 'bg-amber-700 text-white' : 'text-stone-400'
              }`}
            >
              ½x
            </button>
            <button
              onClick={() => setServingMultiplier(1)}
              className={`px-1.5 py-0.5 rounded ${
                servingMultiplier === 1 ? 'bg-amber-700 text-white' : 'text-stone-400'
              }`}
            >
              1x
            </button>
            <button
              onClick={() => setServingMultiplier(2)}
              className={`px-1.5 py-0.5 rounded ${
                servingMultiplier === 2 ? 'bg-amber-700 text-white' : 'text-stone-400'
              }`}
            >
              2x
            </button>
          </div>

          {/* AI Sous Chef Toggle Button */}
          <button
            onClick={() => setIsSousChefOpen(!isSousChefOpen)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors border ${
              isSousChefOpen
                ? 'bg-amber-600 text-white border-amber-500'
                : 'bg-stone-800 text-stone-300 border-stone-700 hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Ask Sous-Chef</span>
          </button>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Cooking Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Column: Ingredients Checklist */}
        <div className="hidden lg:block w-80 border-r border-stone-800 bg-stone-950/40 p-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
              Mise en Place (Ingredients)
            </h2>
            <span className="text-xs text-stone-500 font-mono">
              {checkedIngredients.length}/{recipe.ingredientsUsed.length} ready
            </span>
          </div>

          <div className="space-y-2">
            {recipe.ingredientsUsed.map((ing, i) => {
              const isChecked = checkedIngredients.includes(ing.name);
              return (
                <div
                  key={i}
                  onClick={() => toggleIngredientCheck(ing.name)}
                  className={`p-2.5 rounded-lg border text-xs cursor-pointer flex items-start gap-2.5 transition-colors ${
                    isChecked
                      ? 'bg-stone-900/40 border-stone-800 text-stone-500 line-through'
                      : 'bg-stone-900 border-stone-800 text-stone-200 hover:border-stone-700'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded shrink-0 flex items-center justify-center border mt-0.5 ${
                      isChecked
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-stone-600'
                    }`}
                  >
                    {isChecked && <Check className="w-3 h-3" />}
                  </div>
                  <div className="leading-tight">
                    <span className="font-medium text-stone-100">{ing.name}</span>
                    <span className="text-stone-400 ml-1.5 font-mono tabular-nums">
                      ({ing.amount})
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Chef Substitutions */}
          {recipe.chefSubstitutions.length > 0 && (
            <div className="mt-8 pt-6 border-t border-stone-800">
              <h3 className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">
                Chef Substitutions
              </h3>
              <div className="space-y-2 text-xs">
                {recipe.chefSubstitutions.map((sub, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-stone-900/80 border border-stone-800">
                    <p className="text-stone-300 font-medium">
                      No {sub.original}? Use {sub.substitute}
                    </p>
                    <p className="text-stone-400 text-[11px] mt-0.5">{sub.note}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Center: Active Step Showcase */}
        <div className="flex-1 p-6 md:p-12 overflow-y-auto flex flex-col justify-between">
          <div className="max-w-3xl mx-auto w-full space-y-8">
            {/* Step Progress indicators */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-stone-400 font-mono">
                <span>
                  STEP {currentStepIndex + 1} OF {recipe.steps.length}
                </span>
                <span>
                  {Math.round(((currentStepIndex + 1) / recipe.steps.length) * 100)}% Complete
                </span>
              </div>
              <div className="w-full bg-stone-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-amber-600 h-full transition-all duration-300"
                  style={{
                    width: `${((currentStepIndex + 1) / recipe.steps.length) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Current Step Card */}
            <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-6 sm:p-10 shadow-lg space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-widest text-amber-500">
                  Instruction
                </span>
                {currentStep.durationMinutes && (
                  <div className="flex items-center gap-1.5 text-xs text-stone-400 font-mono">
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Estimated: {currentStep.durationMinutes} minutes</span>
                  </div>
                )}
              </div>

              <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-white leading-snug">
                {currentStep.title}
              </h2>

              <p className="text-base sm:text-lg text-stone-200 leading-relaxed font-sans">
                {currentStep.instruction}
              </p>

              {/* Chef Tip Box */}
              {currentStep.chefTip && (
                <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-800/40 text-sm text-amber-200/90 flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block text-amber-300 mb-0.5">
                      Chef's Technique Tip
                    </span>
                    <span>{currentStep.chefTip}</span>
                  </div>
                </div>
              )}

              {/* Step Timer if duration present */}
              {stepDurationSeconds > 0 && (
                <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-xs text-stone-400">Step Timer</p>
                    <p className="text-2xl sm:text-3xl font-mono font-bold text-amber-400 tabular-nums">
                      {formatTimer(timeLeft)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsTimerRunning(!isTimerRunning)}
                      className="px-4 py-2 bg-amber-700 hover:bg-amber-600 text-white rounded-lg text-xs font-medium transition-colors flex items-center gap-2"
                    >
                      {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      <span>{isTimerRunning ? 'Pause' : 'Start Timer'}</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsTimerRunning(false);
                        setTimeLeft(stepDurationSeconds);
                      }}
                      className="p-2 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors"
                      title="Reset Timer"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="max-w-3xl mx-auto w-full pt-8 flex items-center justify-between gap-4">
            <button
              onClick={handlePrevStep}
              disabled={currentStepIndex === 0}
              className="px-5 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous Step</span>
            </button>

            <button
              onClick={() => toggleStepCompleted(currentStep.stepNumber)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 border ${
                completedSteps.includes(currentStep.stepNumber)
                  ? 'bg-emerald-950/60 border-emerald-700 text-emerald-300'
                  : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-white'
              }`}
            >
              <Check className="w-4 h-4" />
              <span>
                {completedSteps.includes(currentStep.stepNumber)
                  ? 'Marked Finished'
                  : 'Mark Step Done'}
              </span>
            </button>

            {currentStepIndex < recipe.steps.length - 1 ? (
              <button
                onClick={handleNextStep}
                className="px-6 py-2.5 bg-amber-700 hover:bg-amber-600 text-white rounded-xl text-sm font-medium transition-colors flex items-center gap-2 shadow-xs"
              >
                <span>Next Step</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-sm font-medium transition-colors flex items-center gap-2 shadow-xs"
              >
                <Check className="w-4 h-4" />
                <span>Bon Appétit! Finish</span>
              </button>
            )}
          </div>
        </div>

        {/* Right Drawer: AI Sous-Chef Chat */}
        {isSousChefOpen && (
          <div className="w-full sm:w-80 md:w-96 border-l border-stone-800 bg-stone-950 flex flex-col h-full shadow-2xl">
            <div className="p-4 border-b border-stone-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ChefHat className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-semibold text-white">AI Sous-Chef</h3>
              </div>
              <button
                onClick={() => setIsSousChefOpen(false)}
                className="p-1 rounded text-stone-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat message history */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-xl max-w-[88%] leading-relaxed ${
                    msg.sender === 'user'
                      ? 'ml-auto bg-amber-800 text-white'
                      : 'mr-auto bg-stone-900 border border-stone-800 text-stone-200'
                  }`}
                >
                  <p>{msg.text}</p>
                </div>
              ))}
              {isAskingChef && (
                <div className="mr-auto bg-stone-900 border border-stone-800 text-stone-400 p-3 rounded-xl flex items-center gap-2 text-xs">
                  <Sparkles className="w-3.5 h-3.5 animate-spin text-amber-400" />
                  <span>Chef is formulating advice...</span>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendChat} className="p-3 border-t border-stone-800 flex gap-2">
              <input
                type="text"
                placeholder="Ask e.g. How to rescue salty sauce?"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 px-3 py-2 text-xs bg-stone-900 border border-stone-800 rounded-lg text-white focus:outline-hidden focus:border-amber-600"
              />
              <button
                type="submit"
                disabled={!chatInput.trim() || isAskingChef}
                className="p-2 bg-amber-700 hover:bg-amber-600 text-white rounded-lg transition-colors disabled:opacity-40"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
