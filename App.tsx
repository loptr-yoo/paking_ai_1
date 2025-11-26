import React, { useState, useCallback } from 'react';
import { ControlPanel } from './components/ControlPanel';
import { MapViewer } from './components/MapViewer';
import { Legend } from './components/Legend';
import { generateParkingLotSVG } from './services/geminiService';

const App: React.FC = () => {
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async (image: string | null, prompt: string) => {
    setIsGenerating(true);
    setError(null);
    try {
      const generatedSvg = await generateParkingLotSVG(image, prompt);
      setSvgContent(generatedSvg);
    } catch (err: any) {
      console.error(err);
      setError("Failed to generate map. Please try again with a simpler prompt or clear image.");
    } finally {
      setIsGenerating(false);
    }
  }, []);

  return (
    <div className="flex h-screen w-screen bg-gray-950 text-gray-100 overflow-hidden font-sans">
      <ControlPanel onGenerate={handleGenerate} isGenerating={isGenerating} />
      
      <main className="flex-1 relative flex flex-col h-full">
        {/* Header/Toolbar Area for Top Stats if needed */}
        <div className="h-14 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-6">
           <div className="flex items-center space-x-4">
             <span className="text-gray-400 text-sm">Project:</span>
             <span className="font-mono text-indigo-400 text-sm">PKG-UNDERGROUND-01</span>
           </div>
           
           {svgContent && (
             <button 
               onClick={() => {
                 const blob = new Blob([svgContent], {type: 'image/svg+xml'});
                 const url = URL.createObjectURL(blob);
                 const a = document.createElement('a');
                 a.href = url;
                 a.download = 'parking-layout.svg';
                 a.click();
               }}
               className="text-xs bg-gray-800 hover:bg-gray-700 border border-gray-600 px-3 py-1.5 rounded text-gray-300 transition"
             >
               Export SVG
             </button>
           )}
        </div>

        <div className="flex-1 relative">
           <MapViewer svgContent={svgContent} isLoading={isGenerating} />
           <Legend />
           
           {error && (
             <div className="absolute bottom-8 left-8 right-8 z-50">
               <div className="bg-red-500/10 border border-red-500/50 text-red-200 p-4 rounded backdrop-blur-md shadow-lg flex items-center justify-between max-w-2xl mx-auto">
                 <span>{error}</span>
                 <button onClick={() => setError(null)} className="ml-4 hover:text-white">
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                 </button>
               </div>
             </div>
           )}
        </div>
      </main>
    </div>
  );
};

export default App;
