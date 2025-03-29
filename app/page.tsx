"use client"
import FileUploader from "@/components/FileUploader";
import PDFViewer from "@/components/PDFViewer";
import { SignatureCanvas } from "@/components/SignatureCanvas";
import { Toolbar } from "@/components/ToolBar";
import { usePdfAnnotation } from "@/hooks/usePdfAnnotation";

// interface Annotation {
//   id: string;
//   type: string;
//   position: { x: number; y: number };
//   data?: any;
//   page: number;
//   color?: string;
// }

export default function Home() {
  const {
    file,
    isLoading,
    currentPage,
    totalPages,
    scale,
    activeAnnotation,
    activeColor,
    annotations,
    comments,
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
  } = usePdfAnnotation();


  return (
    <div className="flex flex-col w-full h-screen overflow-hidden bg-background p-4 sm:p-6">
    <header className="mb-6 text-center">
      <h1 className="text-3xl font-medium text-gradient">PDF Annotator</h1>
      <p className="text-muted-foreground">Upload, annotate, and export PDF documents with ease</p>
    </header>

    {isLoading && (
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin"></div>
          <p className="mt-4 text-foreground/80">Processing document...</p>
        </div>
      </div>
    )} 
 


        {!file ? (
           <div className="flex-grow flex items-center justify-center">
           <div className="w-full max-w-2xl animate-fade-in">
             <FileUploader
               handleDragOver={handleDragOver}
               handleDrop={handleDrop}
               handleFileUpload={handleFileUpload}
             />
           </div>
         </div>
        ) : (
          <div className="flex-grow flex flex-col h-full overflow-hidden">
          <Toolbar
            activeAnnotation={activeAnnotation}
            activeColor={activeColor}
            setAnnotationTool={setAnnotationTool}
            setAnnotationColor={setAnnotationColor}
            startSignatureDrawing={startSignatureDrawing}
            exportAnnotatedPDF={exportAnnotatedPDF}
            zoomIn={zoomIn}
            zoomOut={zoomOut}
            resetZoom={resetZoom}
            goToPrevPage={goToPrevPage}
            goToNextPage={goToNextPage}
            currentPage={currentPage}
            totalPages={totalPages}
          />
          
          <div className="flex-grow overflow-hidden">
            <PDFViewer
               file={file}
               currentPage={currentPage}
               totalPages={totalPages}
               scale={scale}
               annotations={annotations}
               comments={comments}
               setComments={setComments}
               activeAnnotation={activeAnnotation}
               addAnnotation={addAnnotation}
            />
          </div>
        </div>
        )}
        
      <SignatureCanvas
        isOpen={isDrawingSignature}
        onSave={saveSignature}
        onCancel={cancelSignature}
        canvasRef={canvasRef}
      />

    <footer className="py-4 text-center text-xs text-muted-foreground">
      <p>PDF Annotator | A beautiful document annotation tool</p>
    </footer>
  </div>
  );
}
