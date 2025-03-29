'use client'
import { useState, useCallback, useRef } from 'react';
import { toast } from 'sonner';

type AnnotationType = 'highlight' | 'underline' | 'comment' | 'signature';
type ColorType = string;

interface Annotation {
  id: string;
  type: AnnotationType;
  color: ColorType;
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

interface Comment {
  id: string;
  annotationId: string;
  text: string;
  timestamp: Date;
}

export function usePdfAnnotation() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [scale, setScale] = useState<number>(1);
  const [activeAnnotation, setActiveAnnotation] = useState<AnnotationType | null>(null);
  const [activeColor, setActiveColor] = useState<string>('#FFDE17');
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [signature, setSignature] = useState<string | null>(null);
  const [isDrawingSignature, setIsDrawingSignature] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Handle file uploads
  const handleFileUpload = useCallback((uploadedFile: File) => {
    if (uploadedFile.type !== 'application/pdf') {
      toast.error('Please upload a PDF document');
      return;
    }

    setIsLoading(true);
    setFile(uploadedFile);
    
    // Simulate PDF loading
    setTimeout(() => {
      setIsLoading(false);
      setTotalPages(Math.floor(Math.random() * 10) + 1); // Simulate random page count
      setCurrentPage(1);
      toast.success('Document uploaded successfully');
    }, 1500);
  }, []);

  // Drag and drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  }, [handleFileUpload]);

  // Navigation functions
  const goToNextPage = useCallback(() => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  }, [currentPage, totalPages]);

  const goToPrevPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  }, [currentPage]);

  // Zoom functions
  const zoomIn = useCallback(() => {
    setScale(prev => Math.min(prev + 0.1, 3));
  }, []);

  const zoomOut = useCallback(() => {
    setScale(prev => Math.max(prev - 0.1, 0.5));
  }, []);

  const resetZoom = useCallback(() => {
    setScale(1);
  }, []);

  // Annotation functions
  const setAnnotationTool = useCallback((tool: AnnotationType | null) => {
    setActiveAnnotation(tool);
  }, []);

  const setAnnotationColor = useCallback((color: string) => {
    setActiveColor(color);
  }, []);

  const addAnnotation = useCallback((event: React.MouseEvent, pageEl: HTMLElement) => {
    if (!activeAnnotation) return;

    const rect = pageEl.getBoundingClientRect();
    const x = (event.clientX - rect.left) / scale;
    const y = (event.clientY - rect.top) / scale;

    const newAnnotation: Annotation = {
      id: `annotation-${Date.now()}`,
      type: activeAnnotation,
      color: activeColor,
      position: {
        x,
        y,
        pageIndex: currentPage - 1,
      }
    };

    if (activeAnnotation === 'signature' && signature) {
      newAnnotation.content = signature;
      newAnnotation.width = 200;
      newAnnotation.height = 100;
    } else if (activeAnnotation === 'comment') {
      newAnnotation.content = '';
      
      const newComment: Comment = {
        id: `comment-${Date.now()}`,
        annotationId: newAnnotation.id,
        text: '',
        timestamp: new Date(),
      };
      
      setComments(prev => [...prev, newComment]);
    }

    setAnnotations(prev => [...prev, newAnnotation]);
    
    if (activeAnnotation === 'signature') {
      setAnnotationTool(null);
      toast.success('Signature added');
    } else if (activeAnnotation === 'comment') {
      toast.success('Comment added');
    }
  }, [activeAnnotation, activeColor, currentPage, scale, signature]);

  // Signature functions
  const startSignatureDrawing = useCallback(() => {
    setIsDrawingSignature(true);
  }, []);

  const saveSignature = useCallback((signatureData: string) => {
    setSignature(signatureData);
    setIsDrawingSignature(false);
    setAnnotationTool('signature');
    toast.success('Signature saved');
  }, []);

  const cancelSignature = useCallback(() => {
    setIsDrawingSignature(false);
  }, []);

  // Export function
  const exportAnnotatedPDF = useCallback(() => {
    if (!file) {
      toast.error('No document to export');
      return;
    }

    setIsLoading(true);
    
    // Simulate export process
    setTimeout(() => {
      setIsLoading(false);
      
      // Create download link
      const link = document.createElement('a');
      link.href = URL.createObjectURL(file);
      link.download = `annotated-${file.name}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Document exported successfully');
    }, 2000);
  }, [file]);

  return {
    file,
    isLoading,
    currentPage,
    totalPages,
    scale,
    activeAnnotation,
    activeColor,
    annotations,
    comments,
    signature,
    isDrawingSignature,
    canvasRef,
    handleFileUpload,
    handleDragOver,
    handleDrop,
    goToNextPage,
    goToPrevPage,
    zoomIn,
    zoomOut,
    resetZoom,
    setAnnotationTool,
    setAnnotationColor,
    addAnnotation,
    startSignatureDrawing,
    saveSignature,
    cancelSignature,
    exportAnnotatedPDF,
    setComments,
  };
}
