import React, { useEffect, useRef, useState } from 'react';

interface MapViewerProps {
  svgContent: string | null;
  isLoading: boolean;
}

export const MapViewer: React.FC<MapViewerProps> = ({ svgContent, isLoading }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Reset view when SVG changes
  useEffect(() => {
    if (svgContent) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  }, [svgContent]);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const scaleFactor = 0.1;
    const newScale = e.deltaY > 0 
      ? Math.max(0.5, scale - scaleFactor) 
      : Math.min(5, scale + scaleFactor);
    setScale(newScale);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Center button handler
  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div className="relative flex-1 bg-gray-950 overflow-hidden cursor-move">
      {/* Background Grid for Blueprint feel */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(#374151 1px, transparent 1px), linear-gradient(90deg, #374151 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}
      />

      {isLoading ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 z-10">
           <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
           <p className="animate-pulse font-mono">Architecting layout...</p>
        </div>
      ) : !svgContent ? (
         <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-600 z-10 p-8 text-center">
            <svg className="w-24 h-24 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 7m0 13V7m0 0L9 7" />
            </svg>
            <h2 className="text-xl font-semibold mb-2">No Map Generated</h2>
            <p className="max-w-md">Upload a reference image or describe the parking lot requirements to generate a semantic layout.</p>
         </div>
      ) : (
        <div 
          ref={containerRef}
          className="w-full h-full flex items-center justify-center origin-center transition-transform duration-75 ease-out"
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div 
            style={{ 
              transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
              transition: isDragging ? 'none' : 'transform 0.2s'
            }}
            className="shadow-2xl bg-gray-800 p-8 border border-gray-700 rounded-sm"
            dangerouslySetInnerHTML={{ __html: svgContent }}
          />
        </div>
      )}

      {/* View Controls */}
      <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-20">
        <button onClick={() => setScale(s => Math.min(5, s + 0.2))} className="bg-gray-800 hover:bg-gray-700 text-white p-2 rounded shadow-lg border border-gray-600">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
        </button>
        <button onClick={handleReset} className="bg-gray-800 hover:bg-gray-700 text-white p-2 rounded shadow-lg border border-gray-600 font-mono text-xs">
          1:1
        </button>
        <button onClick={() => setScale(s => Math.max(0.5, s - 0.2))} className="bg-gray-800 hover:bg-gray-700 text-white p-2 rounded shadow-lg border border-gray-600">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
        </button>
      </div>
    </div>
  );
};
