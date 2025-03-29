'use client'

import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

interface SignatureCanvasProps {
  isOpen: boolean;
  onSave: (signatureData: string) => void;
  onCancel: () => void;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}

export const SignatureCanvas: React.FC<SignatureCanvasProps> = ({
  isOpen,
  onSave,
  onCancel,
  canvasRef,
}) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasStartedDrawing, setHasStartedDrawing] = useState(false);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    canvas.style.width = `${canvas.offsetWidth}px`;
    canvas.style.height = `${canvas.offsetHeight}px`;
    
    const context = canvas.getContext('2d');
    if (!context) return;
    
    context.scale(2, 2);
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.strokeStyle = 'black';
    context.lineWidth = 2;
    contextRef.current = context;
    
    // Clear canvas when component opens
    context.clearRect(0, 0, canvas.width, canvas.height);
    setHasStartedDrawing(false);
  }, [canvasRef, isOpen]);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const { offsetX, offsetY } = getCoordinates(e);
    if (!contextRef.current) return;
    
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
    setHasStartedDrawing(true);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !contextRef.current) return;
    
    const { offsetX, offsetY } = getCoordinates(e);
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
  };

  const stopDrawing = () => {
    if (!contextRef.current) return;
    
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    if (!canvasRef.current) return { offsetX: 0, offsetY: 0 };

    // For mouse events
    if ('nativeEvent' in e && 'offsetX' in e.nativeEvent) {
      return {
        offsetX: (e.nativeEvent as MouseEvent).offsetX,
        offsetY: (e.nativeEvent as MouseEvent).offsetY
      };
    }
    
    // For touch events
    if ('touches' in e) {
      const rect = canvasRef.current.getBoundingClientRect();
      const touch = e.touches[0];
      return {
        offsetX: touch.clientX - rect.left,
        offsetY: touch.clientY - rect.top
      };
    }
    
    return { offsetX: 0, offsetY: 0 };
  };

  const clearCanvas = () => {
    if (!contextRef.current || !canvasRef.current) return;
    
    contextRef.current.clearRect(
      0, 
      0, 
      canvasRef.current.width, 
      canvasRef.current.height
    );
    setHasStartedDrawing(false);
  };

  const handleSave = () => {
    if (!canvasRef.current) return;
    
    const signatureData = canvasRef.current.toDataURL('image/png');
    onSave(signatureData);
  };

  // Add touch event handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    startDrawing(e);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    draw(e);
  };

  const handleTouchEnd = () => {
    stopDrawing();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">Draw Your Signature</DialogTitle>
        </DialogHeader>
        <div className="bg-white border rounded-lg overflow-hidden">
          <canvas
            ref={canvasRef}
            className="w-full h-64 touch-none cursor-crosshair bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IArs4c6QAAACRJREFUOBFjZGBgEAFifOANPkkmBgoDRg0cNXDUwFEDB6GBAA6oCL0k8AeZAAAAAElFTkSuQmCC')]"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          />
        </div>
        
        <div className="text-center text-sm text-muted-foreground">
          Draw your signature in the box above
        </div>
        
        <DialogFooter className="flex justify-between sm:justify-between gap-2">
          <div className="flex gap-2">
            <Button variant="outline" onClick={clearCanvas}>
              Clear
            </Button>
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
          <Button 
            onClick={handleSave} 
            disabled={!hasStartedDrawing}
            className="bg-blue-600  text-white"
          >
            Save Signature
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
