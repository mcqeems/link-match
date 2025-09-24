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
      // Atur tinggi konten berdasarkan apakah diperluas atau tidak
      setContentHeight(isExpanded ? `${contentRef.current.scrollHeight}px` : `${maxLength / 3}px`);
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
        className="overflow-hidden transition-max-height duration-700 ease-in-out"
        style={{ maxHeight: contentHeight }}
      >
        <p ref={contentRef} className="text-base-content/80 whitespace-pre-wrap">
          {text}
        </p>
      </div>
      <button
        onClick={toggleExpansion}
        className="btn btn-link btn-sm text-primary-light p-0 mt-1 no-underline hover:underline"
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
