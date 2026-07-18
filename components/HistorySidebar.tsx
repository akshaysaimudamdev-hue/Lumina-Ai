import React from 'react';
import { HistoryItem } from '../types';
import { Clock, Trash2, X } from 'lucide-react';

interface HistorySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onSelectHistory: (query: string) => void;
  onClearHistory: () => void;
}

const HistorySidebar: React.FC<HistorySidebarProps> = ({ 
  isOpen, 
  onClose, 
  history, 
  onSelectHistory,
  onClearHistory
}) => {
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Panel */}
      <div className={`
        fixed top-0 left-0 h-full w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-50 transform transition-transform duration-300 ease-in-out shadow-2xl
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900">
            <h2 className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Clock className="w-4 h-4" /> History
            </h2>
            <button onClick={onClose} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full">
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {history.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-sm">
                No recent searches.
              </div>
            ) : (
              history.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectHistory(item.query);
                    if (window.innerWidth < 1024) onClose();
                  }}
                  className="w-full text-left p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
                >
                  <p className="text-sm text-slate-700 dark:text-slate-300 font-medium truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                    {item.query}
                  </p>
                  <span className="text-xs text-slate-400 dark:text-slate-600">
                    {new Date(item.timestamp).toLocaleDateString()} • {new Date(item.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                </button>
              ))
            )}
          </div>

          {history.length > 0 && (
            <div className="p-4 border-t border-slate-200 dark:border-slate-800">
              <button 
                onClick={onClearHistory}
                className="flex items-center justify-center gap-2 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Clear History
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default HistorySidebar;