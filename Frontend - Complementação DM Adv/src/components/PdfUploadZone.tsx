import { useRef, useState } from 'react';
import { FileText, Upload, X } from 'lucide-react';
import { Button } from './ui/button';

interface PdfUploadZoneProps {
  file: File | null;
  onFileSelect: (file: File | null) => void;
  disabled?: boolean;
}

export function PdfUploadZone({ file, onFileSelect, disabled }: PdfUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (disabled) return;

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'application/pdf') {
      onFileSelect(droppedFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      onFileSelect(selectedFile);
    }
  };

  const handleRemove = () => {
    onFileSelect(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleClick = () => {
    if (!disabled) {
      inputRef.current?.click();
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-gray-700 dark:text-gray-300 px-1 transition-colors duration-300">
        Selecione o PDF de Formulário (AcroForm)
      </label>
      
      {!file ? (
        <div
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            relative border-2 border-dashed rounded-[16px] p-10
            transition-all duration-300 cursor-pointer
            ${isDragging 
              ? 'border-blue-400 bg-blue-50/50 dark:bg-blue-950/30 scale-[0.99]' 
              : 'border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            disabled={disabled}
            className="hidden"
          />
          
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <div className={`
              rounded-full p-4 transition-all duration-300
              ${isDragging ? 'bg-blue-100 dark:bg-blue-900 scale-110' : 'bg-gray-100 dark:bg-gray-700'}
            `}>
              <Upload className={`size-7 transition-colors duration-300 ${isDragging ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`} />
            </div>
            
            <div>
              <p className="text-gray-700 dark:text-gray-300 transition-colors duration-300">
                <span className="text-blue-600 dark:text-blue-400">Clique para selecionar</span> ou arraste um arquivo
              </p>
              <p className="text-gray-400 dark:text-gray-500 mt-2 transition-colors duration-300">
                Apenas arquivos PDF são aceitos
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between p-5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-[16px] shadow-sm transition-colors duration-300">
          <div className="flex items-center space-x-4">
            <div className="rounded-full p-3 bg-blue-50 dark:bg-blue-950/50 transition-colors duration-300">
              <FileText className="size-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-gray-900 dark:text-white transition-colors duration-300">
                {file.name}
              </p>
              <p className="text-gray-400 dark:text-gray-500 transition-colors duration-300">
                {(file.size / 1024).toFixed(2)} KB
              </p>
            </div>
          </div>
          
          {!disabled && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleRemove}
              className="text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-full transition-all duration-200"
            >
              <X className="size-5" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}