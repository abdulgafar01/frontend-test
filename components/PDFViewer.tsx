"use client";

import { useState, useRef, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { AnnotationLayer } from "./AnnotationLayer";
import { CommentPanel } from "./CommentPanel";
import { Loader2 } from "lucide-react";

// Set up PDF.js worker with fallback
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface Annotation {
  id: string;
  type: "highlight" | "underline" | "comment" | "signature";
  position: { x: number; y: number; pageIndex: number };
  color?: string;
  content?: string;
  width?: number;
  height?: number;
}

interface PDFViewerProps {
  file: File | string | null;
  currentPage: number;
  scale: number;
  totalPages: number;
  annotations: any[];
  comments: any[];
  setComments: (comments: any[]) => void;
  activeAnnotation: string | null;
  addAnnotation: (event: React.MouseEvent, pageEl: HTMLElement) => void;
  onPageChange?: (page: number) => void;
  onDocumentLoadSuccess?: ({ numPages }: { numPages: number }) => void;
  className?: string;
}

const PDFViewer = ({
  file,
  currentPage = 1,
  totalPages,
  scale = 1.0,
  annotations = [],
  comments = [],
  setComments,
  activeAnnotation,
  addAnnotation,
  onPageChange,
  onDocumentLoadSuccess,
  className,
}: PDFViewerProps) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAnnotationId, setSelectedAnnotationId] = useState<string | null>(null);
  const [showComments, setShowComments] = useState(false);
  const [pageWidth, setPageWidth] = useState<number | null>(null);
  
  const pageRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const documentRef = useRef(null);

  // Handle responsive width
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setPageWidth(containerRef.current.clientWidth * 0.9); // 90% of container width
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Clean up object URLs
  useEffect(() => {
    const fileUrl = getFile();
    return () => {
      if (fileUrl && typeof file !== 'string') {
        URL.revokeObjectURL(fileUrl);
      }
    };
  }, [file]);

  const handleAnnotationClick = (id: string) => {
    setSelectedAnnotationId(id);
    setShowComments(true);
  };
  
  const handlePageClick = (e: React.MouseEvent) => {
    if (activeAnnotation && pageRef.current) {
      addAnnotation(e, pageRef.current);
    }
  };
  
  const handleCloseComments = () => {
    setShowComments(false);
    setSelectedAnnotationId(null);
  };

  const onDocumentLoadSuccessInternal = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setIsLoading(false);
    onDocumentLoadSuccess?.({ numPages });
  };

  const onDocumentLoadError = (error: Error) => {
    console.error('PDF load error:', error);
    setError(`Failed to load PDF: ${error.message}`);
    setIsLoading(false);
  };

  const onRenderError = (error: Error) => {
    console.error('Page render error:', error);
    setError(`Page render failed: ${error.message}`);
  };

  const getFile = () => {
    if (!file) return null;
    if (typeof file === 'string') {
      if (file.startsWith('http') || file.startsWith('blob') || file.startsWith('data')) {
        return file;
      }
      return `data:application/pdf;base64,${file}`;
    }
    return URL.createObjectURL(file);
  };

  return (
    <div className={cn("flex w-full h-full overflow-hidden", className)} ref={containerRef}>
      <div 
        className="flex-grow flex items-center justify-center overflow-auto p-4 bg-primary/5 relative"
        style={{ cursor: activeAnnotation ? 'crosshair' : 'default' }}
      >
        {isLoading && (
          <div className="flex flex-col items-center justify-center absolute inset-0">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-2 text-sm text-muted-foreground">Loading PDF...</p>
          </div>
        )}

        {error && (
          <div className="text-red-500 p-4 bg-red-50 rounded-lg absolute inset-0 flex items-center justify-center">
            {error}
          </div>
        )}

        {!isLoading && !error && (
          <div 
            className="relative"
            ref={pageRef}
            onClick={handlePageClick}
          >
            <Document
              inputRef={documentRef}
              file={getFile()}
              onLoadSuccess={onDocumentLoadSuccessInternal}
              onLoadError={onDocumentLoadError}
              loading={
                <div className="flex flex-col items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="mt-2 text-sm text-muted-foreground">Loading document...</p>
                </div>
              }
              noData={
                <div className="p-4 text-center text-muted-foreground">
                  No PDF file selected
                </div>
              }
            >
              <Page
                pageNumber={currentPage}
                scale={scale}
                width={pageWidth || undefined} // Use responsive width
                loading={
                  <div className="flex flex-col items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="mt-2 text-sm text-muted-foreground">Loading page {currentPage}...</p>
                  </div>
                }
                onRenderError={onRenderError}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                className="border border-border shadow-sm"
              />
            </Document>
            
            <AnnotationLayer 
              annotations={annotations.filter(ann => ann.position.pageIndex === currentPage - 1)}
              currentPage={currentPage}
              scale={scale}
              onSelectAnnotation={handleAnnotationClick}
            />
          </div>
        )}
      </div>
      
      {showComments && (
        <div className="animate-slide-in w-80 border-l">
          <CommentPanel
            comments={comments}
            setComments={setComments}
            selectedAnnotationId={selectedAnnotationId}
            onClose={handleCloseComments}
          />
        </div>
      )}
    </div>
  );
};

export default PDFViewer;