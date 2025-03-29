'use client'

import React, { useRef, useState, useEffect } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { AnnotationLayer } from './AnnotationLayer';
import { CommentPanel } from './CommentPanel';


// Set worker path
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

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

const PDFViewer: React.FC<PDFViewerProps> = ({
  file,
  currentPage,
  scale,
  annotations,
  comments,
  setComments,
  activeAnnotation,
  addAnnotation,
}) => {
  const pageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedAnnotationId, setSelectedAnnotationId] = useState<string | null>(null);
  const [showComments, setShowComments] = useState(false);
  const [pdfDocument, setPdfDocument] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  
  useEffect(() => {
    const loadPdf = async () => {
      if (!file) return;
      
      try {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
        setPdfDocument(pdf);
      } catch (error) {
        console.error('Failed to load PDF:', error);
      }
    };
    
    loadPdf();
    
    return () => {
      if (pdfDocument) {
        pdfDocument.destroy();
      }
    };
  }, [file]);
  
  useEffect(() => {
    const renderPage = async () => {
      if (!pdfDocument || !canvasRef.current || currentPage < 1 || currentPage > pdfDocument.numPages) return;
      
      try {
        const page = await pdfDocument.getPage(currentPage);
        const viewport = page.getViewport({ scale });
        
        // Prepare canvas
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        if (!context) return;
        
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        // Render PDF page
        await page.render({
          canvasContext: context,
          viewport: viewport
        }).promise;
      } catch (error) {
        console.error('Failed to render page:', error);
      }
    };
    
    renderPage();
  }, [pdfDocument, currentPage, scale]);
  
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

  return (
    <div className="flex w-full h-full overflow-hidden">
      <div 
        className="flex-grow flex items-center justify-center overflow-auto p-4 bg-primary/5"
        style={{ cursor: activeAnnotation ? 'crosshair' : 'default' }}
      >
        <div 
          className="relative"
          ref={pageRef}
          onClick={handlePageClick}
        >
          <div className="bg-white rounded-lg shadow-subtle overflow-hidden">
            <canvas ref={canvasRef} />
          </div>
          <AnnotationLayer 
            annotations={annotations}
            currentPage={currentPage}
            scale={scale}
            onSelectAnnotation={handleAnnotationClick}
          />
        </div>
      </div>
      
      {showComments && (
        <div className="animate-slide-in">
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


export default PDFViewer