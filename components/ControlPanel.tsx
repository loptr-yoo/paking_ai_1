import React, { useRef, useState } from 'react';

interface ControlPanelProps {
  onGenerate: (image: string | null, prompt: string) => void;
  isGenerating: boolean;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({ onGenerate, isGenerating }) => {
  const [prompt, setPrompt] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearImage = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full md:w-80 bg-gray-800 border-r border-gray-700 flex flex-col h-full z-30 shadow-2xl">
      <div className="p-6 border-b border-gray-700 bg-gray-900">
        <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
          AI Parking Architect
        </h1>
        <p className="text-xs text-gray-400 mt-1">Image-to-Layout Generator</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Reference Image Section */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-300 uppercase tracking-wide flex justify-between">
            <span>1. Reference Floor Plan</span>
            <span className="text-gray-500 text-[10px] normal-case self-center">(Recommended)</span>
          </label>
          <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 transition hover:border-green-500 bg-gray-800/50">
            {!preview ? (
              <div 
                className="flex flex-col items-center justify-center cursor-pointer h-32"
                onClick={() => fileInputRef.current?.click()}
              >
                <svg className="w-8 h-8 text-gray-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-xs text-center text-gray-400">Upload an example parking plan<br/>to mimic its structure</span>
              </div>
            ) : (
              <div className="relative group">
                <img 
                  src={preview} 
                  alt="Reference" 
                  className="w-full h-40 object-cover rounded-md border border-gray-600"
                />
                <button 
                  onClick={handleClearImage}
                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            )}
            <input 
              type="file" 
              ref={fileInputRef}
              className="hidden" 
              accept="image/*"
              onChange={handleImageUpload}
            />
          </div>
        </div>

        {/* Prompt Section */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-300 uppercase tracking-wide">
            2. Layout Instructions
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="E.g., 'Generate a layout similar to the reference image, but maximize parking spaces in the center and add 4 elevators in the corners...'"
            className="w-full h-32 bg-gray-700 text-sm text-gray-100 p-3 rounded-lg border border-gray-600 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none resize-none placeholder-gray-500"
          />
        </div>
        
        {/* Info */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-3">
          <p className="text-[10px] text-gray-400 leading-relaxed">
            <strong>How it works:</strong> The AI analyzes the topology of your reference image (roads, walls) and recreates it as a clean semantic SVG, applying your requested modifications.
          </p>
        </div>
      </div>

      <div className="p-6 border-t border-gray-700 bg-gray-900">
        <button
          onClick={() => onGenerate(preview, prompt)}
          disabled={isGenerating}
          className={`w-full py-3 px-4 rounded-lg font-bold text-sm uppercase tracking-wider transition duration-200 flex items-center justify-center gap-2 ${
            isGenerating 
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
              : 'bg-green-600 hover:bg-green-500 text-white shadow-lg hover:shadow-green-500/30'
          }`}
        >
          {isGenerating ? (
            <>
              <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Architecting...
            </>
          ) : (
            <>
              Generate Layout
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
            </>
          )}
        </button>
      </div>
    </div>
  );
};