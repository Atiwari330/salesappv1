'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

interface TranscriptDisplayProps {
  content: string;
  defaultCollapsed?: boolean;
  collapsedHeight?: string;
  showMoreText?: string;
  showLessText?: string;
}

const TranscriptDisplay: React.FC<TranscriptDisplayProps> = ({
  content,
  defaultCollapsed = true,
  collapsedHeight = "150px",
  showMoreText = "Show full transcript",
  showLessText = "Hide transcript",
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultCollapsed === false);

  return (
    <div>
      <div
        className="prose dark:prose-invert max-w-none whitespace-pre-wrap"
        style={{
          maxHeight: isExpanded ? 'none' : collapsedHeight,
          overflow: 'hidden',
        }}
      >
        {content}
      </div>
      <Button
        variant="link"
        className="mt-2"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? showLessText : showMoreText}
      </Button>
    </div>
  );
};

export default TranscriptDisplay;
