"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Loader2 } from "lucide-react";

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PDFViewerProps {
  file: File | null;
  currentPage: number;
  totalPages: number;
  scale: number;
  annotations: any[];
  comments: any[];
  setComments: (comments: any[]) => void;
  activeAnnotation: string | null;
  addAnnotation: (event: React.MouseEvent, pageEl: HTMLElement) => void;
}

const PDFViewer = ({
  file,
  currentPage = 1,
  totalPages,
  scale = 1.0,
  annotations,
  comments,
  setComments,
  activeAnnotation,
  addAnnotation,
}: PDFViewerProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageWidth, setPageWidth] = useState<number | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);

  // Get the file URL or data URI
  const getFile = useCallback(() => {
    if (!file) return null;
    return URL.createObjectURL(file);
  }, [file]);

  // Handle document load success
  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setIsLoading(false);
  };

  // Handle document load error
  const onDocumentLoadError = (error: Error) => {
    console.error('PDF load error:', error);
    setError(`Failed to load PDF: ${error.message}`);
    setIsLoading(false);
  };

  // Handle page click for annotations
  const handlePageClick = (e: React.MouseEvent) => {
    if (activeAnnotation && pageRef.current) {
      addAnnotation(e, pageRef.current);
    }
  };

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setPageWidth(containerRef.current.clientWidth * 0.9);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Clean up object URL when component unmounts or file changes
  useEffect(() => {
    const fileUrl = getFile();
    return () => {
      if (fileUrl) {
        URL.revokeObjectURL(fileUrl);
      }
    };
  }, [getFile]);

  return (
    <div 
      ref={containerRef}
      className="flex items-center justify-center w-full h-full bg-gray-50 relative"
      style={{ cursor: activeAnnotation ? 'crosshair' : 'auto' }}
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
          ref={pageRef}
          onClick={handlePageClick}
          className="relative"
        >
          <Document
            file={getFile()}
            onLoadSuccess={onDocumentLoadSuccess}
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
              width={pageWidth || undefined}
              className="border border-gray-200 shadow-sm"
              renderTextLayer={false}
              renderAnnotationLayer={false}
              loading={
                <div className="flex flex-col items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="mt-2 text-sm text-muted-foreground">Loading page {currentPage}...</p>
                </div>
              }
            />
          </Document>

          {/* Render annotations layer */}
          {annotations
            .filter(ann => ann.position.pageIndex === currentPage - 1)
            .map(annotation => (
              <div
                key={annotation.id}
                style={{
                  position: 'absolute',
                  left: `${annotation.position.x}px`,
                  top: `${annotation.position.y}px`,
                  backgroundColor: annotation.type === 'highlight' ? annotation.color || 'yellow' : 'transparent',
                  opacity: 0.5,
                  width: '100px',
                  height: '20px',
                  pointerEvents: 'none',
                }}
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default PDFViewer;