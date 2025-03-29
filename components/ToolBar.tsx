'use client'
import { 
  Highlighter, 
  Underline, 
  MessageSquare, 
  Pen, 
  Download, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

interface AnnotationToolbarProps {
  activeAnnotation: string | null;
  activeColor: string;
  setAnnotationTool: (tool: 'highlight' | 'underline' | 'comment' | 'signature' | null) => void;
  setAnnotationColor: (color: string) => void;
  startSignatureDrawing: () => void;
  exportAnnotatedPDF: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  goToPrevPage: () => void;
  goToNextPage: () => void;
  currentPage: number;
  totalPages: number;
}

export const Toolbar: React.FC<AnnotationToolbarProps> = ({
  activeAnnotation,
  activeColor,
  setAnnotationTool,
  setAnnotationColor,
  startSignatureDrawing,
  exportAnnotatedPDF,
  zoomIn,
  zoomOut,
  resetZoom,
  goToPrevPage,
  goToNextPage,
  currentPage,
  totalPages,
}) => {
  const colors = {
    highlight: ['#FFDE17', '#FFB340', '#FF9F0A', '#FFD60A', '#E7FF0A'],
    underline: ['#0A84FF', '#30B0C7', '#64D2FF', '#5AC8FA', '#30C7B0'],
    comment: ['#34C759', '#30C79E', '#30C7B0', '#A2E4B8', '#B0E9C5'],
    signature: ['#FF2D55', '#FF375F', '#FF453A', '#FF6482', '#FF7AC1']
  };

  const getColorsForType = (type: string) => {
    switch(type) {
      case 'highlight': return colors.highlight;
      case 'underline': return colors.underline;
      case 'comment': return colors.comment;
      case 'signature': return colors.signature;
      default: return colors.highlight;
    }
  };

  return (
    <TooltipProvider>
      <div className="flex items-center justify-between w-full py-2 px-4 mb-1 glassmorphism rounded-xl">
        <div className="flex items-center space-x-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                className={`tool-button ${activeAnnotation === 'highlight' ? 'active' : ''}`}
                onClick={() => setAnnotationTool(activeAnnotation === 'highlight' ? null : 'highlight')}
              >
                <Highlighter size={18} />
              </button>
            </TooltipTrigger>
            <TooltipContent>Highlight Text</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                className={`tool-button ${activeAnnotation === 'underline' ? 'active' : ''}`}
                onClick={() => setAnnotationTool(activeAnnotation === 'underline' ? null : 'underline')}
              >
                <Underline size={18} />
              </button>
            </TooltipTrigger>
            <TooltipContent>Underline Text</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                className={`tool-button ${activeAnnotation === 'comment' ? 'active' : ''}`}
                onClick={() => setAnnotationTool(activeAnnotation === 'comment' ? null : 'comment')}
              >
                <MessageSquare size={18} />
              </button>
            </TooltipTrigger>
            <TooltipContent>Add Comment</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                className={`tool-button ${activeAnnotation === 'signature' ? 'active' : ''}`}
                onClick={startSignatureDrawing}
              >
                <Pen size={18} />
              </button>
            </TooltipTrigger>
            <TooltipContent>Add Signature</TooltipContent>
          </Tooltip>

          {activeAnnotation && (
            <Popover>
              <PopoverTrigger asChild>
                <button 
                  className="w-6 h-6 rounded-full ml-2 border-2 border-white/50 shadow-sm"
                  style={{ backgroundColor: activeColor }}
                />
              </PopoverTrigger>
              <PopoverContent className="w-auto p-2">
                <div className="flex space-x-1">
                  {getColorsForType(activeAnnotation).map((color) => (
                    <button
                      key={color}
                      className={`w-6 h-6 rounded-full transition-all duration-200 hover:scale-110 ${activeColor === color ? 'ring-2 ring-primary ring-offset-2' : ''}`}
                      style={{ backgroundColor: color }}
                      onClick={() => setAnnotationColor(color)}
                    />
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1 bg-blue-200 rounded-lg px-2 py-1">
            <button 
              className="text-foreground/60 hover:text-foreground button-transition"
              onClick={goToPrevPage}
              disabled={currentPage <= 1}
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-xs font-medium">
              {currentPage}/{totalPages}
            </span>
            <button 
              className="text-foreground/60 hover:text-foreground"
              onClick={goToNextPage}
              disabled={currentPage >= totalPages}
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="flex items-center space-x-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="tool-button" onClick={zoomOut}>
                  <ZoomOut size={16} />
                </button>
              </TooltipTrigger>
              <TooltipContent>Zoom Out</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="tool-button" onClick={resetZoom}>
                  <RotateCcw size={16} />
                </button>
              </TooltipTrigger>
              <TooltipContent>Reset Zoom</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="tool-button" onClick={zoomIn}>
                  <ZoomIn size={16} />
                </button>
              </TooltipTrigger>
              <TooltipContent>Zoom In</TooltipContent>
            </Tooltip>
          </div>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                className="bg-blue-500 text-white"
                onClick={exportAnnotatedPDF}
              >
                <Download size={16} className="mr-2" />
                Export PDF
              </Button>
            </TooltipTrigger>
            <TooltipContent>Export Annotated PDF</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  )      
};
