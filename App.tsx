import React, { useState, useEffect } from 'react';
import { Search, Mic, Moon, Sun, Menu, Loader2, Cpu, ArrowRight } from 'lucide-react';
import { performSearch } from './services/geminiService';
import { saveToHistory, getHistory, clearHistory } from './services/historyService';
import { SearchResult, HistoryItem } from './types';
import ResultCard from './components/ResultCard';
import HistorySidebar from './components/HistorySidebar';

function App() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  // Initialize
  useEffect(() => {
    setHistory(getHistory());
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      setTheme('light');
    }
  }, []);

  // Update DOM for theme
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    setError(null);
    setQuery(searchQuery);

    try {
      // 1. Save to History
      const updatedHistory = saveToHistory(searchQuery);
      setHistory(updatedHistory);

      // 2. Call API
      const data = await performSearch(searchQuery);
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong. Please check your API key or connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert("Voice search is not supported in this browser.");
      return;
    }
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.start();
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
      handleSearch(transcript);
    };
  };

  const clearAllHistory = () => {
    clearHistory();
    setHistory([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 font-sans">
      
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-30 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div 
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => { setResult(null); setQuery(''); }}
              >
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <Cpu className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-xl tracking-tight hidden sm:block">Lumina</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <HistorySidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        history={history}
        onSelectHistory={handleSearch}
        onClearHistory={clearAllHistory}
      />

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-[calc(100vh-4rem)]">
        
        {/* Search Hero Section - Centered when no results */}
        <div className={`transition-all duration-500 ease-in-out flex flex-col items-center ${result ? 'translate-y-0' : 'translate-y-[20vh]'}`}>
          
          {!result && (
            <div className="text-center mb-8 space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600 pb-2">
                What can I clarify for you?
              </h1>
              <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
                Search the web and get AI-powered explanations in real-time.
              </p>
            </div>
          )}

          {/* Search Input */}
          <div className="w-full max-w-2xl relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
              className="block w-full pl-11 pr-36 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-lg shadow-slate-200/50 dark:shadow-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-lg placeholder:text-slate-400"
              placeholder="Ask anything..."
            />
            
            <div className="absolute inset-y-0 right-2 flex items-center gap-2">
              <button 
                onClick={handleVoiceSearch}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-400 hover:text-indigo-500"
                title="Voice Search"
              >
                <Mic className="h-5 w-5" />
              </button>
              
              <button
                onClick={() => handleSearch(query)}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors text-sm shadow-sm"
              >
                <span>Go</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Suggested Chips (Only on home) */}
          {!result && !loading && (
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {['React lifecycle flow', 'Structure of the UN', 'Latest AI news'].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => handleSearch(suggestion)}
                  className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full text-sm text-slate-600 dark:text-slate-400 hover:border-indigo-500 dark:hover:border-indigo-500 hover:text-indigo-500 transition-colors shadow-sm"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center mt-20 space-y-4 animate-in fade-in duration-500">
            <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
            <p className="text-slate-500 dark:text-slate-400 animate-pulse">Thinking & browsing...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="mt-10 p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl text-center max-w-2xl mx-auto">
            <h3 className="text-red-600 dark:text-red-400 font-semibold">Error</h3>
            <p className="text-slate-600 dark:text-slate-300 mt-2">{error}</p>
          </div>
        )}

        {/* Results View */}
        {result && !loading && (
          <div className="mt-12 animate-in slide-in-from-bottom-10 duration-700">
            <ResultCard result={result} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;