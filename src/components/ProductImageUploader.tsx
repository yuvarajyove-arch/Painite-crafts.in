import React, { useState, useRef } from 'react';
import {
  Upload,
  X,
  Star,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Link as LinkIcon,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Flame,
  Plus,
  Image as ImageIcon
} from 'lucide-react';
import {
  uploadProductImageToFirebase
} from '../lib/firebase';

interface ProductImageUploaderProps {
  images: string[];
  onChange: (newImages: string[]) => void;
}

// Ready-to-use sample clay craft photo presets (zero loading time)
const CLAY_PRESET_IMAGES = [
  {
    name: 'Floral Polymer Studs',
    url: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=800&auto=format&fit=crop&q=80'
  },
  {
    name: 'Terracotta Trinket Tray',
    url: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800&auto=format&fit=crop&q=80'
  },
  {
    name: 'Artisan Clay Pendant',
    url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&auto=format&fit=crop&q=80'
  },
  {
    name: 'Pastel Botanical Keychain',
    url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&auto=format&fit=crop&q=80'
  },
  {
    name: 'Marble Clay Ring Dish',
    url: 'https://images.unsplash.com/photo-1590736704728-f4730bb30770?w=800&auto=format&fit=crop&q=80'
  },
  {
    name: 'Botanical Clay Sculpture',
    url: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=800&auto=format&fit=crop&q=80'
  }
];

export const ProductImageUploader: React.FC<ProductImageUploaderProps> = ({
  images,
  onChange
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<'upload' | 'url' | 'presets'>('upload');
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [inputUrl, setInputUrl] = useState('');

  const handleFiles = async (files: FileList | File[]) => {
    setErrorMessage(null);
    setSuccessMessage(null);

    const validFiles: File[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) {
        setErrorMessage(`"${file.name}" is not an image file.`);
        return;
      }
      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    setIsProcessing(true);

    try {
      // Process all selected files concurrently for maximum speed (<1 second)
      const uploadPromises = validFiles.map((file) => uploadProductImageToFirebase(file));
      const results = await Promise.all(uploadPromises);

      const newUrls = results.map((r) => r.publicUrl);
      onChange([...images, ...newUrls]);

      setSuccessMessage(`Added ${newUrls.length} photo${newUrls.length > 1 ? 's' : ''} in under a second! ⚡`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      console.error('Instant upload error:', err);
      setErrorMessage('Could not process photo. Please try again or paste an image link.');
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleAddUrl = (e?: React.FormEvent | React.MouseEvent | React.KeyboardEvent) => {
    if (e) e.preventDefault();
    if (!inputUrl.trim()) return;

    const trimmed = inputUrl.trim();
    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://') && !trimmed.startsWith('data:image')) {
      setErrorMessage('Please enter a valid web image URL (e.g. https://...)');
      return;
    }

    onChange([...images, trimmed]);
    setInputUrl('');
    setErrorMessage(null);
    setSuccessMessage('Image link added! ✨');
    setTimeout(() => setSuccessMessage(null), 2500);
  };

  const handleAddPreset = (url: string) => {
    if (images.includes(url)) {
      setSuccessMessage('Photo is already in your gallery!');
      setTimeout(() => setSuccessMessage(null), 2000);
      return;
    }
    onChange([...images, url]);
    setSuccessMessage('Sample craft photo added! 🌸');
    setTimeout(() => setSuccessMessage(null), 2000);
  };

  const handleRemoveImage = (indexToRemove: number) => {
    const updated = images.filter((_, idx) => idx !== indexToRemove);
    onChange(updated);
  };

  const handleSetCover = (coverIndex: number) => {
    if (coverIndex === 0) return;
    const selected = images[coverIndex];
    const rest = images.filter((_, idx) => idx !== coverIndex);
    onChange([selected, ...rest]);
    setSuccessMessage('Main cover photo updated! ⭐');
    setTimeout(() => setSuccessMessage(null), 2000);
  };

  const handleMoveLeft = (index: number) => {
    if (index <= 0) return;
    const updated = [...images];
    const temp = updated[index - 1];
    updated[index - 1] = updated[index];
    updated[index] = temp;
    onChange(updated);
  };

  const handleMoveRight = (index: number) => {
    if (index >= images.length - 1) return;
    const updated = [...images];
    const temp = updated[index + 1];
    updated[index + 1] = updated[index];
    updated[index] = temp;
    onChange(updated);
  };

  return (
    <div className="space-y-3.5">
      {/* Header with quick count & Firebase status */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <label className="block text-xs font-bold text-[#4A3728] uppercase tracking-wider">
            Product Photos ({images.length})
          </label>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold">
            <Flame className="w-3 h-3 text-amber-600 fill-amber-600" />
            <span>Fast Firebase Mode</span>
          </span>
        </div>
      </div>

      {/* 3 Easy Options: Device File, Paste Link, or Quick Presets */}
      <div className="flex p-1 bg-[#F5ECE5] rounded-xl text-xs font-bold text-[#7D6B5D]">
        <button
          type="button"
          onClick={() => setActiveTab('upload')}
          className={`flex-1 py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'upload'
              ? 'bg-white text-[#4A3728] shadow-xs'
              : 'hover:text-[#4A3728]'
          }`}
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload File (Instant)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('url')}
          className={`flex-1 py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'url'
              ? 'bg-white text-[#4A3728] shadow-xs'
              : 'hover:text-[#4A3728]'
          }`}
        >
          <LinkIcon className="w-3.5 h-3.5" />
          <span>Paste Image URL</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('presets')}
          className={`flex-1 py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'presets'
              ? 'bg-white text-[#4A3728] shadow-xs'
              : 'hover:text-[#4A3728]'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
          <span>Sample Clay Photos</span>
        </button>
      </div>

      {/* TAB 1: Instant Device Upload */}
      {activeTab === 'upload' && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setIsDragging(false);
          }}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            if (e.dataTransfer.files?.length) {
              handleFiles(e.dataTransfer.files);
            }
          }}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-5 text-center transition-all cursor-pointer select-none ${
            isDragging
              ? 'border-[#4A3728] bg-[#F8D7DA]/30'
              : 'border-[#E8DCCF] bg-[#FDF9F6] hover:bg-white hover:border-[#C48B9F]'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
            className="hidden"
          />

          <div className="flex flex-col items-center justify-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-white shadow-xs border border-[#E8DCCF] flex items-center justify-center text-[#4A3728]">
              {isProcessing ? (
                <Loader2 className="w-5 h-5 animate-spin text-[#C48B9F]" />
              ) : (
                <Upload className="w-5 h-5 text-[#4A3728]" />
              )}
            </div>

            <div>
              <span className="font-bold text-xs text-[#4A3728] block">
                {isProcessing ? 'Optimizing instantly...' : 'Click to Choose Photo from Phone / PC'}
              </span>
              <span className="text-[10px] text-[#7D6B5D] block mt-0.5">
                Instant client-side compression • No waiting or freezing
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Direct URL Paste (Super fast for existing links) */}
      {activeTab === 'url' && (
        <div className="p-3.5 rounded-2xl bg-[#FDF9F6] border border-[#E8DCCF] space-y-2.5">
          <label className="block text-[11px] font-bold text-[#4A3728]">
            Paste Web Image URL (Unsplash, Pinterest, Cloudinary, Imgur, etc.)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddUrl();
                }
              }}
              placeholder="https://images.unsplash.com/..."
              className="flex-1 px-3 py-2 rounded-xl bg-white border border-[#E8DCCF] text-xs text-[#4A3728] focus:outline-hidden focus:border-[#4A3728]"
            />
            <button
              type="button"
              onClick={handleAddUrl}
              disabled={!inputUrl.trim()}
              className="px-4 py-2 rounded-xl bg-[#4A3728] text-white text-xs font-bold hover:bg-[#32231A] disabled:opacity-50 transition-colors shrink-0 flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add URL</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: 1-Click Sample Clay Art Photos */}
      {activeTab === 'presets' && (
        <div className="p-3.5 rounded-2xl bg-[#FDF9F6] border border-[#E8DCCF] space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-bold text-[#4A3728]">Click any craft photo to add instantly:</span>
            <span className="text-[#7D6B5D]">Zero load time</span>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {CLAY_PRESET_IMAGES.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleAddPreset(preset.url)}
                className="group relative aspect-square rounded-xl overflow-hidden border border-[#E8DCCF] hover:border-[#4A3728] hover:shadow-xs transition-all cursor-pointer"
                title={preset.name}
              >
                <img
                  src={preset.url}
                  alt={preset.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                  <Plus className="w-4 h-4 font-bold" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      {errorMessage && (
        <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2 text-xs text-rose-800">
          <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-600" />
          <span className="font-medium">{errorMessage}</span>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="ml-auto text-rose-600 hover:text-rose-900"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {successMessage && (
        <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-xs text-emerald-800">
          <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
          <span className="font-medium">{successMessage}</span>
        </div>
      )}

      {/* Image Gallery & Main Cover Chooser */}
      {images.length > 0 && (
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between text-[11px] text-[#7D6B5D] px-1">
            <span className="font-bold uppercase text-[#4A3728] text-[10px]">
              Current Gallery ({images.length})
            </span>
            <span>⭐ First photo is the <strong>Main Cover</strong></span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
            {images.map((imgUrl, index) => {
              const isCover = index === 0;

              return (
                <div
                  key={index}
                  className={`group relative rounded-xl bg-white border overflow-hidden p-1.5 shadow-2xs transition-all ${
                    isCover
                      ? 'border-[#4A3728] ring-2 ring-[#F8D7DA]'
                      : 'border-[#E8DCCF] hover:border-[#C48B9F]'
                  }`}
                >
                  <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-[#FDF9F6]">
                    <img
                      src={imgUrl}
                      alt={`Product photo ${index + 1}`}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />

                    {isCover && (
                      <div className="absolute top-1.5 left-1.5 z-10">
                        <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-[#4A3728] text-white text-[9px] font-bold shadow-xs">
                          <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                          <span>Cover</span>
                        </span>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1.5 right-1.5 z-10 w-6 h-6 rounded-full bg-white/90 hover:bg-rose-600 hover:text-white text-stone-700 flex items-center justify-center shadow-xs transition-all cursor-pointer"
                      title="Remove image"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="mt-1.5 flex items-center justify-between gap-1 text-[10px]">
                    {!isCover ? (
                      <button
                        type="button"
                        onClick={() => handleSetCover(index)}
                        className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-[#FDF9F6] hover:bg-[#F8D7DA]/60 text-[#4A3728] font-bold border border-[#E8DCCF] transition-colors cursor-pointer text-[9px]"
                      >
                        <Star className="w-2.5 h-2.5 text-[#C5A059]" />
                        <span>Set Cover</span>
                      </button>
                    ) : (
                      <span className="text-emerald-700 font-bold px-1 flex items-center gap-0.5 text-[9px]">
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        <span>Cover</span>
                      </span>
                    )}

                    <div className="flex items-center gap-0.5 ml-auto">
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => handleMoveLeft(index)}
                        className={`p-0.5 rounded-sm border ${
                          index === 0
                            ? 'opacity-25 border-transparent cursor-not-allowed'
                            : 'border-[#E8DCCF] hover:bg-[#FDF9F6] text-[#4A3728] cursor-pointer'
                        }`}
                        title="Move left"
                      >
                        <ChevronLeft className="w-2.5 h-2.5" />
                      </button>
                      <button
                        type="button"
                        disabled={index === images.length - 1}
                        onClick={() => handleMoveRight(index)}
                        className={`p-0.5 rounded-sm border ${
                          index === images.length - 1
                            ? 'opacity-25 border-transparent cursor-not-allowed'
                            : 'border-[#E8DCCF] hover:bg-[#FDF9F6] text-[#4A3728] cursor-pointer'
                        }`}
                        title="Move right"
                      >
                        <ChevronRight className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
