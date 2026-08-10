import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  Camera,
  CheckCircle2,
  AlertTriangle,
  Send,
  Sparkles,
  Leaf,
  Droplets,
  Zap,
  ArrowRight,
  RotateCcw,
  HelpCircle,
  ThumbsUp,
  ThumbsDown,
  ChevronDown,
  ChevronUp,
  Cpu,
  Info,
  Globe,
} from 'lucide-react';
import { TypesOfWasteAndRecycling } from './TypesOfWasteAndRecycling';
import { WasteTypeInfo } from '../data/wasteTypes';
import { ClassificationResult, WasteCategory } from '../types';
import { saveScanToFirestore, submitFeedbackToFirestore } from '../lib/firebase';

// Helper to sanitize item names and prevent displaying raw filenames
const getCleanItemName = (name: string, category: string) => {
  if (!name) return `${category} Item`;
  if (
    /\.(png|jpe?g|webp|gif|svg|bmp)$/i.test(name) ||
    /^upload[-_]?\d+/i.test(name) ||
    /^image\d*/i.test(name) ||
    /^blob:/i.test(name)
  ) {
    return `${category} Waste Item`;
  }
  return name;
};

// Category styling map with explicit category colors
const CATEGORY_STYLES: Record<
  string,
  { bg: string; text: string; border: string; hex: string; label: string }
> = {
  Plastic: {
    bg: 'bg-blue-50',
    text: 'text-blue-800',
    border: 'border-blue-200',
    hex: '#2563eb',
    label: 'Plastics & PET Packaging',
  },
  'Paper & Cardboard': {
    bg: 'bg-sky-50',
    text: 'text-sky-800',
    border: 'border-sky-200',
    hex: '#0284c7',
    label: 'Paper & Cardboard',
  },
  Metal: {
    bg: 'bg-amber-50',
    text: 'text-amber-800',
    border: 'border-amber-200',
    hex: '#d97706',
    label: 'Aluminum & Steel Cans',
  },
  Glass: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-800',
    border: 'border-emerald-200',
    hex: '#16a34a',
    label: 'Glass Containers & Jars',
  },
  'Organic / Food Waste': {
    bg: 'bg-green-50',
    text: 'text-green-800',
    border: 'border-green-200',
    hex: '#15803d',
    label: 'Food Scraps & Organic Waste',
  },
  'E-Waste / Electronics': {
    bg: 'bg-purple-50',
    text: 'text-purple-800',
    border: 'border-purple-200',
    hex: '#9333ea',
    label: 'Electronics & E-Waste',
  },
  'Residual / Non-Recyclable': {
    bg: 'bg-slate-100',
    text: 'text-slate-800',
    border: 'border-slate-300',
    hex: '#475569',
    label: 'General Landfill Trash',
  },
};

const getCategoryStyle = (category: string) => {
  return (
    CATEGORY_STYLES[category] || {
      bg: 'bg-emerald-50',
      text: 'text-emerald-800',
      border: 'border-emerald-200',
      hex: '#10b981',
      label: category,
    }
  );
};

// Regional / Continent bin color mapping
const getRegionBinColorDetails = (category: string, region: string) => {
  if (region === 'EU / UK') {
    switch (category) {
      case 'Plastic':
      case 'Metal':
        return {
          continent: 'Europe / UK',
          binName: 'Yellow Bin / Sack',
          hex: '#d97706',
          badgeBg: 'bg-amber-50 text-amber-900 border-amber-300',
        };
      case 'Paper & Cardboard':
        return {
          continent: 'Europe / UK',
          binName: 'Blue Paper Bin',
          hex: '#0284c7',
          badgeBg: 'bg-sky-50 text-sky-900 border-sky-300',
        };
      case 'Glass':
        return {
          continent: 'Europe / UK',
          binName: 'Green / Amber Glass Bank',
          hex: '#15803d',
          badgeBg: 'bg-emerald-50 text-emerald-900 border-emerald-300',
        };
      case 'Organic / Food Waste':
        return {
          continent: 'Europe / UK',
          binName: 'Brown Organic Bin',
          hex: '#854d0e',
          badgeBg: 'bg-amber-100 text-amber-950 border-amber-300',
        };
      case 'E-Waste / Electronics':
        return {
          continent: 'Europe / UK',
          binName: 'WEEE Drop-point',
          hex: '#9333ea',
          badgeBg: 'bg-purple-50 text-purple-900 border-purple-300',
        };
      default:
        return {
          continent: 'Europe / UK',
          binName: 'Gray Residual Bin',
          hex: '#475569',
          badgeBg: 'bg-slate-100 text-slate-900 border-slate-300',
        };
    }
  } else if (region === 'Asia Pacific') {
    switch (category) {
      case 'Plastic':
      case 'Paper & Cardboard':
      case 'Metal':
      case 'Glass':
        return {
          continent: 'Asia Pacific',
          binName: 'Dry Recyclables Bin',
          hex: '#2563eb',
          badgeBg: 'bg-blue-50 text-blue-900 border-blue-300',
        };
      case 'Organic / Food Waste':
        return {
          continent: 'Asia Pacific',
          binName: 'Wet Waste Bin (Green)',
          hex: '#15803d',
          badgeBg: 'bg-green-50 text-green-900 border-green-300',
        };
      case 'E-Waste / Electronics':
        return {
          continent: 'Asia Pacific',
          binName: 'E-Waste Point (Red)',
          hex: '#dc2626',
          badgeBg: 'bg-rose-50 text-rose-900 border-rose-300',
        };
      default:
        return {
          continent: 'Asia Pacific',
          binName: 'General Waste Bin (Black)',
          hex: '#334155',
          badgeBg: 'bg-slate-100 text-slate-900 border-slate-300',
        };
    }
  } else {
    // North America
    switch (category) {
      case 'Plastic':
      case 'Paper & Cardboard':
      case 'Metal':
      case 'Glass':
        return {
          continent: 'North America',
          binName: 'Blue Recyclables Bin',
          hex: '#2563eb',
          badgeBg: 'bg-blue-50 text-blue-900 border-blue-300',
        };
      case 'Organic / Food Waste':
        return {
          continent: 'North America',
          binName: 'Green Compost Bin',
          hex: '#16a34a',
          badgeBg: 'bg-green-50 text-green-900 border-green-300',
        };
      case 'E-Waste / Electronics':
        return {
          continent: 'North America',
          binName: 'E-Waste Drop Center',
          hex: '#9333ea',
          badgeBg: 'bg-purple-50 text-purple-900 border-purple-300',
        };
      default:
        return {
          continent: 'North America',
          binName: 'Black / Gray Trash Bin',
          hex: '#334155',
          badgeBg: 'bg-slate-100 text-slate-900 border-slate-300',
        };
    }
  }
};

interface ImageClassifierProps {
  currentRegion: string;
  onFeedbackSubmitted: () => void;
  authUser: any;
  onOpenAuthModal: () => void;
}

export const ImageClassifier: React.FC<ImageClassifierProps> = ({
  currentRegion,
  onFeedbackSubmitted,
  authUser,
  onOpenAuthModal,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [itemDescription, setItemDescription] = useState<string>('');
  const [isClassifying, setIsClassifying] = useState<boolean>(false);
  const [result, setResult] = useState<ClassificationResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showTechDetails, setShowTechDetails] = useState<boolean>(false);
  const [guestScansCount, setGuestScansCount] = useState<number>(() => {
    return parseInt(localStorage.getItem('guest_demo_scans_count') || '0', 10);
  });

  // Camera state
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Feedback state
  const [currentScanId, setCurrentScanId] = useState<string | null>(null);
  const [feedbackState, setFeedbackState] = useState<'prompt' | 'correct' | 'incorrect' | 'submitted'>('prompt');
  const [correctedCategory, setCorrectedCategory] = useState<WasteCategory>('Plastic');
  const [feedbackNotes, setFeedbackNotes] = useState<string>('');
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState<boolean>(false);

  // Handle camera start/stop
  const startCamera = async () => {
    try {
      setErrorMsg(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraActive(true);
    } catch (err: any) {
      console.error('Camera access error:', err);
      setErrorMsg('Could not access camera. Please allow camera permissions or upload an image.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const captureCameraPhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setSelectedImage(dataUrl);
        stopCamera();
        runClassification(dataUrl, null, '');
      }
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Handle File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setSelectedImage(base64);
        runClassification(base64, null, file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Waste Type Selection for Classification
  const handleSelectWasteType = (wasteType: WasteTypeInfo) => {
    setItemDescription(wasteType.sampleQuery);
    runClassification(null, wasteType.id, wasteType.sampleQuery);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Execute Classification API Call
  const runClassification = async (
    imgBase64: string | null,
    sampleId: string | null,
    desc: string
  ) => {
    const isGuest = !authUser || authUser.isAnonymous;
    if (isGuest && guestScansCount >= 3) {
      setErrorMsg('You have used all 3 free demo scans. Please sign in to continue classifying items!');
      return;
    }

    setIsClassifying(true);
    setErrorMsg(null);
    setResult(null);
    setFeedbackState('prompt');
    setFeedbackNotes('');

    try {
      const res = await fetch('/api/classify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: imgBase64,
          sampleId,
          description: desc || itemDescription,
          region: currentRegion,
        }),
      });

      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await res.text();
        throw new Error(`Server error (${res.status}): ${text.substring(0, 100)}`);
      }

      const data = await res.json();
      if (data.success) {
        setResult(data);
        setCorrectedCategory(data.category);

        if (isGuest) {
          const newGuestCount = guestScansCount + 1;
          setGuestScansCount(newGuestCount);
          localStorage.setItem('guest_demo_scans_count', newGuestCount.toString());
        }

        try {
          const docId = await saveScanToFirestore({
            userId: authUser && !authUser.isAnonymous ? authUser.uid : undefined,
            userEmail: authUser && !authUser.isAnonymous ? authUser.email : undefined,
            itemName: data.itemName || 'Identified Item',
            predictedCategory: data.category,
            confidence: data.confidence,
            region: currentRegion,
            description: desc || itemDescription,
          });
          if (docId) {
            setCurrentScanId(docId);
          }

          const userKey = authUser && !authUser.isAnonymous ? `user_scans_history_${authUser.uid || authUser.email}` : 'user_scans_history';
          const existing = JSON.parse(localStorage.getItem(userKey) || '[]');
          const newEntry = {
            id: docId || `scan-${Date.now()}`,
            itemName: data.itemName || 'Identified Item',
            category: data.category,
            confidence: data.confidence,
            timestamp: 'Just now',
            feedbackGiven: false,
            wasCorrect: true,
          };
          localStorage.setItem(userKey, JSON.stringify([newEntry, ...existing.slice(0, 19)]));
        } catch (e) {
          console.warn('Could not update user scan history');
        }
      } else {
        setErrorMsg(data.error || 'Failed to identify item. Please try again.');
      }
    } catch (err: any) {
      console.error('Classification request failed:', err);
      setErrorMsg('Network error. Please check your internet connection.');
    } finally {
      setIsClassifying(false);
    }
  };

  // Submit Feedback Handler
  const handleSubmitFeedback = async (isCorrectBool: boolean) => {
    if (!result) return;
    setIsSubmittingFeedback(true);

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          predictedCategory: result.category,
          actualCategory: isCorrectBool ? result.category : correctedCategory,
          isCorrect: isCorrectBool,
          userNotes: feedbackNotes,
          region: currentRegion,
          itemDescription: result.itemName,
          modelConfidence: result.confidence,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setFeedbackState('submitted');
        onFeedbackSubmitted();

        await submitFeedbackToFirestore({
          scanId: currentScanId || undefined,
          userId: authUser && !authUser.isAnonymous ? authUser.uid : undefined,
          userEmail: authUser && !authUser.isAnonymous ? authUser.email : undefined,
          originalCategory: result.category,
          correctedCategory: isCorrectBool ? result.category : correctedCategory,
          itemName: result.itemName,
          isCorrect: isCorrectBool,
          comments: feedbackNotes,
        });

        try {
          const existing = JSON.parse(localStorage.getItem('user_scans_history') || '[]');
          if (existing.length > 0) {
            existing[0].feedbackGiven = true;
            existing[0].wasCorrect = isCorrectBool;
            localStorage.setItem('user_scans_history', JSON.stringify(existing));
          }
        } catch (e) {
          console.warn('Failed to update feedback status');
        }
      }
    } catch (err) {
      console.error('Feedback submission failed:', err);
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  const categoriesList: WasteCategory[] = [
    'Plastic',
    'Paper & Cardboard',
    'Metal',
    'Glass',
    'Organic / Food Waste',
    'E-Waste / Hazardous',
    'General Trash',
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Friendly Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-lg border border-emerald-800/40 relative overflow-hidden">
        <div className="max-w-3xl space-y-2 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Smart Waste Assistant</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Snap, Classify & Recycle Correctly
          </h1>
          <p className="text-slate-200 text-xs sm:text-sm leading-relaxed max-w-2xl">
            Upload a photo or snap a picture of any item to instantly learn which bin it belongs in, how to clean it, and how much carbon you save.
          </p>
        </div>
      </div>

      {/* Main Grid: Upload (Priority #1) & Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Image Input */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5">
            {(!authUser || authUser.isAnonymous) && (
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between gap-2">
                <div>
                  <div className="font-bold flex items-center space-x-1.5">
                    <span>Free Guest Scans:</span>
                    <span className="bg-amber-200 text-amber-950 font-extrabold px-2 py-0.5 rounded-full text-[10px]">
                      {Math.max(0, 3 - guestScansCount)} / 3 Left
                    </span>
                  </div>
                </div>
                <button
                  onClick={onOpenAuthModal}
                  className="shrink-0 bg-amber-600 hover:bg-amber-700 text-white px-3 py-1 rounded-lg font-bold text-xs shadow-xs"
                >
                  Sign In
                </button>
              </div>
            )}

            <div className="flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center space-x-2">
                <Upload className="w-5 h-5 text-emerald-600" />
                <span>1. Upload or Take Photo</span>
              </h2>
              <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                Bin standard: {currentRegion}
              </span>
            </div>

            {/* Camera View */}
            {isCameraActive ? (
              <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 aspect-video flex flex-col justify-between shadow-inner">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center space-x-3 px-4">
                  <button
                    onClick={captureCameraPhoto}
                    className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold px-5 py-2.5 rounded-full shadow-lg flex items-center space-x-2 text-xs"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Take Snap</span>
                  </button>
                  <button
                    onClick={stopCamera}
                    className="bg-slate-800/80 hover:bg-slate-800 text-white font-bold px-4 py-2.5 rounded-full backdrop-blur text-xs"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              /* Dropzone */
              <div className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-6 text-center bg-slate-50/50 hover:bg-emerald-50/30 transition-all">
                {selectedImage ? (
                  <div className="space-y-4">
                    <div className="relative mx-auto w-full max-h-56 rounded-xl overflow-hidden bg-slate-900 border border-slate-200 flex items-center justify-center shadow-xs">
                      <img src={selectedImage} alt="Selected Waste Item" className="max-h-56 object-contain" />
                      {isClassifying && (
                        <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs flex flex-col items-center justify-center space-y-3 text-white">
                          <div className="w-10 h-10 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                          <span className="text-xs font-bold text-emerald-300 animate-pulse">
                            Identifying item...
                          </span>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        setSelectedImage(null);
                        setResult(null);
                      }}
                      className="text-xs font-bold text-rose-600 hover:text-rose-700 inline-flex items-center space-x-1"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Remove Photo</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-bold text-slate-800">
                        Drag and drop your item image here
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Supports JPG, PNG up to 10MB</p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-1">
                      <label className="w-full sm:w-auto cursor-pointer bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-all flex items-center justify-center space-x-2 shadow-xs">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Choose File</span>
                        <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                      </label>

                      <button
                        onClick={startCamera}
                        className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-all flex items-center justify-center space-x-2 shadow-xs"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>Use Camera</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Error Message */}
            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Classification Results */}
        <div className="lg:col-span-7 space-y-6">
          {result ? (
            (() => {
              const categoryStyle = getCategoryStyle(result.category);
              const regionalBin = getRegionBinColorDetails(result.category, currentRegion);
              const cleanTitle = getCleanItemName(result.itemName, result.category);

              return (
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6 animate-fadeIn">
                  {/* Main Result Banner */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
                    <div className="space-y-2">
                      {/* Category Color & Regional Bin Badges */}
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Category Color Badge */}
                        <span
                          className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-black border ${categoryStyle.bg} ${categoryStyle.text} ${categoryStyle.border}`}
                        >
                          <span
                            className="w-2.5 h-2.5 rounded-full inline-block shadow-xs shrink-0"
                            style={{ backgroundColor: categoryStyle.hex }}
                          />
                          <span>Category: {result.category}</span>
                        </span>

                        {/* Region / Continent Bin Color Badge */}
                        <span
                          className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-black border ${regionalBin.badgeBg}`}
                        >
                          <Globe className="w-3.5 h-3.5 shrink-0" />
                          <span>Region ({regionalBin.continent}):</span>
                          <span
                            className="w-2.5 h-2.5 rounded-full inline-block shrink-0 shadow-xs"
                            style={{ backgroundColor: regionalBin.hex }}
                          />
                          <span>{regionalBin.binName}</span>
                        </span>
                      </div>

                      {/* Clean Item Title without Filenames */}
                      <h2 className="text-2xl font-black text-slate-900">{cleanTitle}</h2>
                    </div>

                    <div className="bg-emerald-50 rounded-2xl p-3 border border-emerald-200 text-center sm:text-right shrink-0">
                      <div className="text-[10px] uppercase font-bold text-emerald-800">Match Confidence</div>
                      <div className="text-2xl font-black text-emerald-600">
                        {(result.confidence * 100).toFixed(0)}%
                      </div>
                    </div>
                  </div>

              {/* Clear Disposal Bin Banner */}
              {result.guidance && (
                <div
                  className="rounded-2xl p-5 border text-slate-900 space-y-2"
                  style={{
                    backgroundColor: `${result.guidance.binColorHex || '#10b981'}10`,
                    borderColor: `${result.guidance.binColorHex || '#10b981'}40`,
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-base shadow-sm shrink-0"
                      style={{ backgroundColor: result.guidance.binColorHex || '#10b981' }}
                    >
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-slate-900">
                        Put in: {result.guidance.binType}
                      </h3>
                      <p className="text-xs text-slate-600">
                        Material type: {result.guidance.materialType} • Rating: {result.guidance.recyclabilityRating}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Simple AI Explanation */}
              {result.aiExplanation?.cvModelExplanation && (
                <div className="bg-slate-900 text-white rounded-2xl p-5 space-y-2 border border-slate-800">
                  <div className="flex items-center space-x-2 text-xs font-bold text-emerald-400">
                    <Sparkles className="w-4 h-4" />
                    <span>How to Handle This Item</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed font-normal">
                    {result.aiExplanation.cvModelExplanation}
                  </p>
                </div>
              )}

              {/* Easy Step-by-Step Preparation */}
              {result.guidance && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center space-x-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Easy Steps to Prepare</span>
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-800">
                      {(result.guidance.prepSteps || []).map((step, i) => (
                        <li key={i} className="flex items-start space-x-2">
                          <span className="w-4 h-4 rounded-full bg-emerald-200 text-emerald-900 text-[10px] font-extrabold flex items-center justify-center shrink-0 mt-0.5">
                            {i + 1}
                          </span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 bg-rose-50/70 border border-rose-200/80 rounded-2xl space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-rose-900 flex items-center space-x-1.5">
                      <AlertTriangle className="w-4 h-4 text-rose-600" />
                      <span>What NOT to Do</span>
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-800">
                      {(result.guidance.doNotDo || []).map((warn, i) => (
                        <li key={i} className="flex items-start space-x-2">
                          <span className="w-4 h-4 rounded-full bg-rose-200 text-rose-900 text-[10px] font-extrabold flex items-center justify-center shrink-0 mt-0.5">
                            !
                          </span>
                          <span>{warn}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Environmental Savings */}
              {result.guidance?.environmentalImpact && (
                <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-2">
                  <div className="text-xs font-bold text-emerald-400 flex items-center space-x-1.5">
                    <Leaf className="w-4 h-4" />
                    <span>Your Environmental Savings</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center pt-1">
                    <div className="p-2.5 bg-slate-800 rounded-xl">
                      <div className="text-emerald-400 text-sm font-black">
                        {result.guidance.environmentalImpact.carbonSavedKg} kg
                      </div>
                      <div className="text-[10px] text-slate-300">CO₂ Saved</div>
                    </div>
                    <div className="p-2.5 bg-slate-800 rounded-xl">
                      <div className="text-sky-400 text-sm font-black">
                        {result.guidance.environmentalImpact.waterSavedLiters} L
                      </div>
                      <div className="text-[10px] text-slate-300">Water Conserved</div>
                    </div>
                    <div className="p-2.5 bg-slate-800 rounded-xl">
                      <div className="text-amber-400 text-sm font-black">
                        {result.guidance.environmentalImpact.energySavedKWh} kWh
                      </div>
                      <div className="text-[10px] text-slate-300">Energy Saved</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Feedback Section */}
              <div className="pt-4 border-t border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 flex items-center space-x-1.5">
                    <HelpCircle className="w-4 h-4 text-emerald-600" />
                    <span>Was this classification correct?</span>
                  </span>
                </div>

                {feedbackState === 'submitted' ? (
                  <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-center text-emerald-900 text-xs font-bold flex items-center justify-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Thank you! Your feedback helps train our AI.</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleSubmitFeedback(true)}
                      disabled={isSubmittingFeedback}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 shadow-xs"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>Yes, Correct!</span>
                    </button>

                    <button
                      onClick={() => setFeedbackState('incorrect')}
                      disabled={isSubmittingFeedback}
                      className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 border border-slate-200"
                    >
                      <ThumbsDown className="w-3.5 h-3.5 text-rose-600" />
                      <span>Report Issue</span>
                    </button>
                  </div>
                )}

                {feedbackState === 'incorrect' && (
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 animate-fadeIn">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Select Actual Category:
                      </label>
                      <select
                        value={correctedCategory}
                        onChange={(e) => setCorrectedCategory(e.target.value as WasteCategory)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white"
                      >
                        {categoriesList.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      onClick={() => handleSubmitFeedback(false)}
                      disabled={isSubmittingFeedback}
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 rounded-xl text-xs transition-all flex items-center justify-center space-x-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Correction</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Optional Advanced Technical Details Accordion */}
              <div className="pt-2 border-t border-slate-100">
                <button
                  onClick={() => setShowTechDetails(!showTechDetails)}
                  className="w-full flex items-center justify-between text-[11px] font-bold text-slate-500 hover:text-slate-800 py-2"
                >
                  <span className="flex items-center space-x-1">
                    <Cpu className="w-3.5 h-3.5 text-slate-400" />
                    <span>Advanced Technical Model Metrics</span>
                  </span>
                  {showTechDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {showTechDetails && (
                  <div className="mt-2 p-4 bg-slate-900 text-slate-200 rounded-2xl space-y-3 text-xs font-mono border border-slate-800 animate-fadeIn">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="font-bold text-emerald-400">Model Details</span>
                      <span>{result.mlPipeline?.modelName || 'MobileNetV2'} ({result.mlPipeline?.modelVersion || 'v2.1'})</span>
                    </div>
                    {result.mlPipeline && (
                      <div className="grid grid-cols-2 gap-2 text-[10px]">
                        <div>Inference Time: {result.mlPipeline.inferenceTimeMs}ms</div>
                        <div>Entropy: {result.mlPipeline.entropy}</div>
                        <div>Architecture: {result.mlPipeline.architecture}</div>
                        <div>Input Shape: [{result.mlPipeline.preprocessing.inputShape.join(', ')}]</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
                </div>
              );
            })()
          ) : (
            /* Empty State */
            <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 text-center space-y-6 shadow-xs min-h-[420px] flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center shadow-inner">
                <Leaf className="w-8 h-8 animate-bounce-slow" />
              </div>

              <div className="max-w-md space-y-2">
                <h3 className="text-lg font-black text-slate-900">Ready to Classify</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Upload a photo or capture an image on the left. AI will instantly show you which bin it goes in and how to recycle it properly.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 max-w-sm text-center pt-2">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <div className="text-emerald-600 font-extrabold text-sm">1. Snap</div>
                  <div className="text-[10px] text-slate-500">Take a photo</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <div className="text-emerald-600 font-extrabold text-sm">2. Analyze</div>
                  <div className="text-[10px] text-slate-500">AI recognizes</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <div className="text-emerald-600 font-extrabold text-sm">3. Recycle</div>
                  <div className="text-[10px] text-slate-500">Exact bin guide</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Types of Waste & Recycling Process Section */}
      <div className="pt-6 border-t border-slate-200">
        <TypesOfWasteAndRecycling onSelectWasteType={handleSelectWasteType} />
      </div>
    </div>
  );
};

