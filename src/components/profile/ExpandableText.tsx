'use client';

import { useState, useRef, useEffect } from 'react';
import { IconChevronDown } from '@tabler/icons-react';

interface ExpandableTextProps {
  text: string | null | undefined;
  maxLength: number;
  placeholder: string;
}

export default function ExpandableText({ text, maxLength, placeholder }: ExpandableTextProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [contentHeight, setContentHeight] = useState('0px');
  const contentRef = useRef<HTMLParagraphElement>(null);

  const isTextLong = text && text.length > maxLength;

  useEffect(() => {
    if (contentRef.current) {
      if (isExpanded) {
        // When expanding, set to full content height
        setContentHeight(`${contentRef.current.scrollHeight}px`);
      } else {
        // When collapsed, calculate appropriate height based on text length
        const estimatedHeight = Math.min(maxLength / 8, 120); // Reasonable collapsed height
        setContentHeight(`${estimatedHeight}px`);
      }
    }
  }, [isExpanded, text, maxLength]);

  if (!isTextLong) {
    return <p className="text-base-content/80 whitespace-pre-wrap">{text || placeholder}</p>;
  }

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div>
      <div
        className="overflow-hidden transition-all duration-500 ease-in-out"
        style={{
          maxHeight: contentHeight,
          marginBottom: isExpanded ? '0' : '0',
        }}
      >
        <p ref={contentRef} className="text-base-content/80 whitespace-pre-wrap">
          {text}
        </p>
      </div>
      <button
        onClick={toggleExpansion}
        className="btn btn-link btn-sm text-accent p-0 mt-1 no-underline hover:underline"
      >
        {isExpanded ? 'Tampilkan lebih sedikit' : 'Baca selengkapnya'}
        <IconChevronDown
          size={16}
          className={`ml-1 transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
        />
      </button>
    </div>
  );
}
