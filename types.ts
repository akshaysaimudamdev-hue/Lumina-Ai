export interface SearchSource {
  title: string;
  uri: string;
}

export interface SearchResult {
  query: string;
  text: string;
  sources: SearchSource[];
  timestamp: number;
}

export interface HistoryItem {
  id: string;
  query: string;
  timestamp: number;
}

export type Theme = 'light' | 'dark';

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}