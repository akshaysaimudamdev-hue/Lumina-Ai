import React, { useEffect, useRef, useState } from 'react';

interface MermaidDiagramProps {
  code: string;
}

const MermaidDiagram: React.FC<MermaidDiagramProps> = ({ code }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>('');
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    const renderDiagram = async () => {
      if (!code || typeof window.mermaid === 'undefined') return;

      try {
        // Reset state
        setError(false);
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
        
        // Use the global mermaid instance
        const { svg } = await window.mermaid.render(id, code);
        setSvg(svg);
      } catch (err) {
        console.error("Mermaid render error:", err);
        setError(true);
      }
    };

    renderDiagram();
  }, [code]);

  if (error) {
    return (
      <div className="p-4 border border-red-200 bg-red-50 text-red-600 rounded-lg text-sm">
        <p className="font-semibold">Failed to render diagram.</p>
        <pre className="mt-2 text-xs overflow-auto">{code}</pre>
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 my-6 overflow-x-auto">
      <div 
        ref={ref}
        dangerouslySetInnerHTML={{ __html: svg }} 
        className="mermaid-container"
      />
    </div>
  );
};

export default MermaidDiagram;