import React, { useState, useRef } from 'react';
import { Camera, Upload, X, Check, AlertCircle, Loader2, Sparkles } from 'lucide-react';
import { Ingredient } from '../types';

interface PantryImageScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddIngredients: (ingredients: Omit<Ingredient, 'id'>[]) => void;
}

interface DetectedItem {
  name: string;
  category: Ingredient['category'];
  estimatedQuantity?: string;
  perishable?: boolean;
  selected: boolean;
}

export const PantryImageScannerModal: React.FC<PantryImageScannerModalProps> = ({
  isOpen,
  onClose,
  onAddIngredients,
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('image/jpeg');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [detectedItems, setDetectedItems] = useState<DetectedItem[]>([]);
  const [photoSummary, setPhotoSummary] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setMimeType(file.type || 'image/jpeg');
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
      setDetectedItems([]);
      setPhotoSummary(null);
      setErrorMessage(null);
    };
    reader.readAsDataURL(file);
  };

  const handleScan = async () => {
    if (!imagePreview) return;

    setIsAnalyzing(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/scan-pantry-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: imagePreview,
          mimeType: mimeType,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to scan image');
      }

      const data = await response.json();
      const detected = (data.detectedIngredients || []).map((item: any) => ({
        name: item.name,
        category: (item.category as Ingredient['category']) || 'Pantry',
        estimatedQuantity: item.estimatedQuantity || '',
        perishable: !!item.perishable,
        selected: true,
      }));

      if (detected.length === 0) {
        setErrorMessage('No distinct food ingredients recognized. Try a closer, well-lit photo.');
      } else {
        setDetectedItems(detected);
        setPhotoSummary(data.photoSummary || null);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Error communicating with pantry scanner.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const toggleItemSelection = (index: number) => {
    setDetectedItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, selected: !item.selected } : item))
    );
  };

  const handleConfirmAdd = () => {
    const selected = detectedItems.filter((i) => i.selected);
    onAddIngredients(
      selected.map((item) => ({
        name: item.name,
        category: item.category,
        quantity: item.estimatedQuantity,
        perishable: item.perishable,
      }))
    );
    handleReset();
    onClose();
  };

  const handleReset = () => {
    setImagePreview(null);
    setDetectedItems([]);
    setPhotoSummary(null);
    setErrorMessage(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="bg-stone-50 rounded-2xl border border-stone-200 shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-serif font-bold text-stone-900">
              AI Fridge & Pantry Scanner
            </h2>
            <p className="text-xs text-stone-500">
              Snap or upload a photo of your shelves, produce bin, or receipt to auto-populate ingredients.
            </p>
          </div>
          <button
            onClick={() => {
              handleReset();
              onClose();
            }}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {!imagePreview ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-stone-300 hover:border-amber-600 rounded-xl p-8 text-center cursor-pointer transition-colors bg-white/50 hover:bg-amber-50/30 flex flex-col items-center justify-center gap-3"
            >
              <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center">
                <Camera className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-stone-800">
                  Click to take a photo or select an image
                </p>
                <p className="text-xs text-stone-500 mt-0.5">
                  Supports JPG, PNG, WEBP from mobile camera or desktop
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative rounded-xl overflow-hidden border border-stone-200 bg-stone-900 max-h-60 flex items-center justify-center">
                <img
                  src={imagePreview}
                  alt="Pantry Scan Preview"
                  className="max-h-60 w-auto object-contain"
                />
                <button
                  onClick={handleReset}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-stone-900/80 text-white hover:bg-stone-900 transition-colors text-xs flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Retake</span>
                </button>
              </div>

              {detectedItems.length === 0 && !isAnalyzing && (
                <div className="flex justify-end">
                  <button
                    onClick={handleScan}
                    className="px-5 py-2.5 bg-amber-800 text-stone-50 rounded-lg text-sm font-medium hover:bg-amber-900 flex items-center gap-2 transition-all shadow-xs"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Analyze Pantry with Gemini</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Loading state */}
          {isAnalyzing && (
            <div className="p-6 text-center space-y-2 border border-stone-200 rounded-xl bg-white">
              <Loader2 className="w-6 h-6 text-amber-800 animate-spin mx-auto" />
              <p className="text-sm font-medium text-stone-800">Scanning ingredients...</p>
              <p className="text-xs text-stone-500">
                Gemini is identifying produce, dairy, proteins, and shelf-stable goods.
              </p>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Detected items list */}
          {detectedItems.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                  Detected Ingredients ({detectedItems.filter((i) => i.selected).length} selected)
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      setDetectedItems((prev) => prev.map((item) => ({ ...item, selected: true })))
                    }
                    className="text-xs text-amber-800 hover:underline"
                  >
                    Select All
                  </button>
                  <span className="text-stone-300">·</span>
                  <button
                    onClick={() =>
                      setDetectedItems((prev) => prev.map((item) => ({ ...item, selected: false })))
                    }
                    className="text-xs text-stone-500 hover:underline"
                  >
                    Deselect All
                  </button>
                </div>
              </div>

              {photoSummary && (
                <p className="text-xs italic text-stone-600 bg-amber-50/50 p-2.5 rounded-md border border-amber-100">
                  Chef observation: {photoSummary}
                </p>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                {detectedItems.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => toggleItemSelection(idx)}
                    className={`p-2.5 rounded-lg border text-xs cursor-pointer flex items-center justify-between transition-colors ${
                      item.selected
                        ? 'bg-amber-50/60 border-amber-300 text-stone-900'
                        : 'bg-white border-stone-200 text-stone-400 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-4 h-4 rounded flex items-center justify-center border ${
                          item.selected
                            ? 'bg-amber-800 border-amber-800 text-white'
                            : 'border-stone-300 bg-white'
                        }`}
                      >
                        {item.selected && <Check className="w-3 h-3" />}
                      </div>
                      <div>
                        <span className="font-medium text-stone-900">{item.name}</span>
                        {item.estimatedQuantity && (
                          <span className="text-stone-500 ml-1">({item.estimatedQuantity})</span>
                        )}
                        <div className="text-[10px] text-stone-500 flex items-center gap-1.5 mt-0.5">
                          <span>{item.category}</span>
                          {item.perishable && (
                            <>
                              <span>·</span>
                              <span className="text-amber-700 font-medium">Perishable</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="px-6 py-3 border-t border-stone-200 bg-stone-100/50 flex items-center justify-end gap-2">
          <button
            onClick={() => {
              handleReset();
              onClose();
            }}
            className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-200/50 transition-colors"
          >
            Cancel
          </button>
          {detectedItems.length > 0 && (
            <button
              onClick={handleConfirmAdd}
              disabled={detectedItems.filter((i) => i.selected).length === 0}
              className="px-4 py-2 bg-amber-800 text-stone-50 rounded-lg text-xs font-medium hover:bg-amber-900 transition-colors shadow-xs disabled:opacity-50"
            >
              Add {detectedItems.filter((i) => i.selected).length} Ingredients to Pantry
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
