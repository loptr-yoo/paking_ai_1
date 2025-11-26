import React from 'react';
import { LEGEND_DATA } from '../types';

export const Legend: React.FC = () => {
  return (
    <div className="absolute top-4 right-4 bg-gray-900/90 backdrop-blur-sm p-4 rounded-lg border border-gray-700 shadow-xl max-h-[80vh] overflow-y-auto w-72 z-20">
      <h3 className="text-sm font-bold text-gray-200 mb-3 uppercase tracking-wider border-b border-gray-700 pb-2">
        Semantic Legend
      </h3>
      <div className="grid grid-cols-1 gap-2">
        {LEGEND_DATA.map((item) => (
          <div key={item.type} className="flex items-center gap-3">
            <div 
              className="w-4 h-4 rounded-sm shadow-sm border border-gray-600 flex-shrink-0" 
              style={{ backgroundColor: item.color }}
            />
            <span className="text-xs text-gray-300 font-medium leading-tight">
              {item.description}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};