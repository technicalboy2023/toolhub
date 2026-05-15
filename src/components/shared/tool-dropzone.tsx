"use client";

import { useState, useCallback, type DragEvent, useRef } from "react";
import { Upload, File, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ToolDropzoneProps {
  onFile: (file: File) => void;
  onFiles?: (files: File[]) => void;
  accept?: string;
  maxSize?: number; // in bytes
  label?: string;
  multiple?: boolean;
}

export function ToolDropzone({
  onFile,
  onFiles,
  accept,
  maxSize = 50 * 1024 * 1024, // 50MB default
  label,
  multiple = false,
}: ToolDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateAndSet = useCallback(
    (f: File | File[]) => {
      setError(null);
      const fileArray = Array.isArray(f) ? f : [f];

      for (const file of fileArray) {
        if (maxSize && file.size > maxSize) {
          setError(`File too large. Max size is ${Math.round(maxSize / 1024 / 1024)}MB.`);
          return;
        }
        if (accept) {
          const types = accept.split(",").map((t) => t.trim());
          const ext = file.name.split(".").pop()?.toLowerCase();
          const matchesType = types.some(
            (t) =>
              file.type.match(t.replace("*", ".*")) ||
              (ext && t.includes(ext)),
          );
          if (!matchesType) {
            setError(`Invalid file type. Accepted: ${accept}`);
            return;
          }
        }
      }

      if (multiple) {
        setFiles((prev) => [...prev, ...fileArray]);
        onFiles?.(fileArray);
      } else {
        setFiles(fileArray);
        onFile(fileArray[0]);
      }
    },
    [accept, maxSize, onFile, onFiles, multiple],
  );

  const handleDrag = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.type === "dragenter" || e.type === "dragover") {
        setIsDragging(true);
      } else {
        setIsDragging(false);
      }
    },
    [],
  );

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      const droppedFiles = Array.from(e.dataTransfer?.files || []);
      if (droppedFiles.length > 0) {
        validateAndSet(multiple ? droppedFiles : droppedFiles[0]);
      }
    },
    [validateAndSet, multiple],
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = Array.from(e.target.files || []);
      if (selectedFiles.length > 0) {
        validateAndSet(multiple ? selectedFiles : selectedFiles[0]);
      }
    },
    [validateAndSet, multiple],
  );

  const clear = useCallback(() => {
    setFiles([]);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  }, []);

  const removeFile = useCallback((index: number) => {
    setFiles((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      if (updated.length === 0) {
        setError(null);
      }
      return updated;
    });
  }, []);

  return (
    <div className="space-y-3">
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative cursor-pointer border-2 border-dashed border-foreground p-8 text-center bg-background shadow-[4px_4px_0px_0px] shadow-foreground transition-all duration-100 ${
          isDragging
            ? "bg-primary border-solid border-foreground translate-x-[2px] translate-y-[2px] shadow-none"
            : ""
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
          className="hidden"
          aria-label={label || "Upload file"}
        />

        <AnimatePresence mode="wait">
          {files.length === 0 ? (
            <motion.div
              key="upload"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-3"
            >
              <div className="flex h-12 w-12 items-center justify-center border-2 border-foreground bg-background">
                <Upload className="h-6 w-6 text-foreground" />
              </div>
              <div>
                <p className="text-sm font-bold">
                  {label || "Drop your file here or click to browse"}
                </p>
                {accept && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Accepted: {accept} (max {Math.round(maxSize / 1024 / 1024)}MB)
                  </p>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="files"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-2"
            >
              {files.map((file, index) => (
                <div
                  key={`${file.name}-${index}`}
                  className="flex items-center justify-between gap-3 px-4 py-2 border-2 border-foreground bg-muted"
                >
                  <div className="flex items-center gap-2">
                    <File className="h-5 w-5 text-foreground" />
                    <span className="text-sm font-bold truncate max-w-[200px]">
                      {file.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ({(file.size / 1024).toFixed(1)} KB)
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(index);
                    }}
                    className="p-0.5 border-2 border-foreground hover:bg-foreground hover:text-background transition-colors"
                    aria-label="Remove file"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {error && (
        <p className="text-sm text-destructive font-bold text-center">{error}</p>
      )}
    </div>
  );
}
