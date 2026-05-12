"use client";

import { useState, useCallback, useRef, type DragEvent } from "react";
import { Upload, File, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ToolDropzoneProps {
  onFile: (file: File) => void;
  accept?: string;
  maxSize?: number; // in bytes
  label?: string;
}

export function ToolDropzone({
  onFile,
  accept,
  maxSize = 50 * 1024 * 1024, // 50MB default
  label,
}: ToolDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateAndSet = useCallback(
    (f: File) => {
      setError(null);
      if (maxSize && f.size > maxSize) {
        setError(`File too large. Max size is ${Math.round(maxSize / 1024 / 1024)}MB.`);
        return;
      }
      if (accept) {
        const types = accept.split(",").map((t) => t.trim());
        const ext = f.name.split(".").pop()?.toLowerCase();
        const matchesType = types.some(
          (t) =>
            f.type.match(t.replace("*", ".*")) ||
            (ext && t.includes(ext)),
        );
        if (!matchesType) {
          setError(`Invalid file type. Accepted: ${accept}`);
          return;
        }
      }
      setFile(f);
      onFile(f);
    },
    [accept, maxSize, onFile],
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
      const droppedFile = e.dataTransfer.files?.[0];
      if (droppedFile) validateAndSet(droppedFile);
    },
    [validateAndSet],
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0];
      if (selectedFile) validateAndSet(selectedFile);
    },
    [validateAndSet],
  );

  const clear = useCallback(() => {
    setFile(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  }, []);

  return (
    <div className="space-y-3">
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-all duration-200 ${
          isDragging
            ? "border-indigo-500 bg-indigo-500/5"
            : "border-border hover:border-muted-foreground/30"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleChange}
          className="hidden"
          aria-label={label || "Upload file"}
        />

        <AnimatePresence mode="wait">
          {file ? (
            <motion.div
              key="file"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex items-center justify-center gap-3"
            >
              <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-muted">
                <File className="h-5 w-5 text-indigo-500" />
                <span className="text-sm font-medium truncate max-w-[200px]">
                  {file.name}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    clear();
                  }}
                  className="p-0.5 rounded-full hover:bg-muted-foreground/20 transition-colors"
                  aria-label="Remove file"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="upload"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-3"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10">
                <Upload className="h-6 w-6 text-indigo-500" />
              </div>
              <div>
                <p className="text-sm font-medium">
                  {label || "Drop a file here or click to browse"}
                </p>
                {accept && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Accepted: {accept} (max {Math.round(maxSize / 1024 / 1024)}MB)
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {error && (
        <p className="text-sm text-destructive text-center">{error}</p>
      )}
    </div>
  );
}