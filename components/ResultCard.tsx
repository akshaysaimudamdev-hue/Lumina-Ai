import React from 'react';
import { SearchResult } from '../types';
import { Globe, ExternalLink, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface ResultCardProps {
  result: SearchResult;
}

const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-fade-in-up">
      
      {/* AI Summary Header */}
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-indigo-500" />
        <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          AI Generated Response
        </h2>
      </div>

      {/* Main Content */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="markdown-body text-slate-800 dark:text-slate-200">
          <ReactMarkdown>{result.text}</ReactMarkdown>
        </div>
      </div>

      {/* Sources Section */}
      {result.sources.length > 0 && (
        <div className="mt-8">
           <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Sources & Grounding
          </h3>
          <div className="flex flex-wrap gap-2">
            {result.sources.map((source, idx) => (
              <a 
                key={idx}
                href={source.uri}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-xs text-slate-700 dark:text-slate-300 hover:border-indigo-500 dark:hover:border-indigo-500 transition-colors truncate max-w-[250px]"
              >
                <ExternalLink className="w-3 h-3 flex-shrink-0" />
                <span className="truncate">{source.title}</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultCard;