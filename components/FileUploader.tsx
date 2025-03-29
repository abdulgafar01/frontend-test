import { FileUp} from "lucide-react";
import { useRef } from "react";

import { Button } from "./ui/button";



interface FileUploaderProps {
  handleFileUpload: (file: File) => void;
    handleDragOver: (e: React.DragEvent) => void;
    handleDrop: (e: React.DragEvent) => void;
  }


    const FileUploader = ({
      handleDragOver,
      handleDrop,
      handleFileUpload,
    }: FileUploaderProps) => {
      
  

      const fileInputRef = useRef<HTMLInputElement>(null);

      const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
          handleFileUpload(e.target.files[0]);
        }
      };
    
      const handleButtonClick = () => {
        fileInputRef.current?.click();
      };

  return (
    <div
      className="flex flex-col items-center justify-center w-full h-96 border-2 border-dashed rounded-xl border-primary/20
                transition-colors duration-300 ease-in-out bg-primary/5 hover:bg-primary/10"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center text-center px-4 py-10 animate-float">
        <div className="w-16 h-16 mb-6 rounded-full bg-blue-400 flex items-center justify-center">
          <FileUp className="h-8 w-8 text-gray-50 animate-pulse-subtle" />
        </div>
        <h3 className="text-xl font-medium mb-2">Upload PDF Document</h3>
        <p className="text-muted-foreground mb-8 max-w-sm">
          Drag and drop your PDF file here, or click the button below to select a file.
        </p>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInputChange}
          accept=".pdf"
          className="hidden"
        />
        <Button
          onClick={handleButtonClick}
          className="relative overflow-hidden bg-blue-500  text-white px-6 py-2 rounded-lg"
        >
          <span className="relative z-10">Select PDF File</span>
        </Button>
      </div>
    </div>
  )
}

export default FileUploader
