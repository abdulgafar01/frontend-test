
import React from 'react';
import { MessageSquare } from 'lucide-react';
import Image from 'next/image';

interface Annotation {
  id: string;
  type: 'highlight' | 'underline' | 'comment' | 'signature';
  color: string;
  position: {
    x: number;
    y: number;
    pageIndex: number;
  };
  content?: string;
  path?: string[];
  width?: number;
  height?: number;
}

interface AnnotationLayerProps {
  annotations: Annotation[];
  currentPage: number;
  scale: number;
  onSelectAnnotation: (id: string) => void;
}

export const AnnotationLayer: React.FC<AnnotationLayerProps> = ({
  annotations,
  currentPage,
  scale,
  onSelectAnnotation,
}) => {
  // Filter annotations for the current page
  const pageAnnotations = annotations.filter(
    (annotation) => annotation.position.pageIndex === currentPage - 1
  );

  return (
    <div className="absolute inset-0 pointer-events-none">
      {pageAnnotations.map((annotation) => {
        const style = {
          left: `${annotation.position.x * scale}px`,
          top: `${annotation.position.y * scale}px`,
        };

        if (annotation.type === 'signature' && annotation.content) {
          return (
            <div
              key={annotation.id}
              className="absolute pointer-events-auto cursor-move"
              style={{
                ...style,
                width: `${(annotation.width || 200) * scale}px`,
                height: `${(annotation.height || 100) * scale}px`,
              }}
            >
                <Image
                    src={annotation.content}
                    alt="Signature"
                    className="w-full h-full object-contain"
                    draggable={false}
                 />
             
            </div>
          );
        }

        if (annotation.type === 'comment') {
          return (
            <div
              key={annotation.id}
              className="absolute pointer-events-auto transition-transform hover:scale-110 cursor-pointer"
              style={style}
              onClick={() => onSelectAnnotation(annotation.id)}
            >
              <div 
                className="flex items-center justify-center w-8 h-8 rounded-full shadow-subtle"
                style={{ backgroundColor: annotation.color }}
              >
                <MessageSquare size={14} className="text-white" />
              </div>
            </div>
          );
        }

        return null;
      })}
    </div>
  );
};
