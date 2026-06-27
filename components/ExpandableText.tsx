'use client';
import { useState } from 'react';

export default function ExpandableText({ text } : {text : string}) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div>
      <p className={expanded ? '' : 'line-clamp-3'}>{text}</p>
      <button onClick={() => setExpanded(!expanded)} className="text-blue-500 text-sm">
        {expanded ? 'Show less' : '...more'}
      </button>
    </div>
  );
}