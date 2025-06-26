import React, { useState } from "react";
import { UploadCloud, Loader2 } from "lucide-react";
import { cn } from "@/js/frontend-panel/lib/utils";

interface ImportedImage {
    src: string;
    imported: true;
    id?: string;
    type?: string;
}

interface FileUploadProps {
    files: (File | ImportedImage)[];
    onFilesChange: (files: (File | ImportedImage)[]) => void;
    maxFiles?: number;
    acceptedExtensions?: string[];
    maxFileSize?: number; // in MB
    className?: string;
    label?: string;
    loading?: boolean;
    showPreview?: boolean;
    previewSize?: "sm" | "md" | "lg";
}

export const FileUpload: React.FC<FileUploadProps> = ({
    files,
    onFilesChange,
    maxFiles = 10,
    acceptedExtensions = ["image/*", "video/*"],
    maxFileSize = 5, // 5MB default
    className,
    label = "Upload Files",
    loading = false,
    showPreview = true,
    previewSize = "md"
}) => {
    const [dragActive, setDragActive] = useState(false);

    const handleFileChange = (newFiles: FileList | null) => {
        if (!newFiles) return;
        const fileArray = Array.from(newFiles);
        const validFiles = fileArray.filter(file => {
            if (file.size > maxFileSize * 1024 * 1024) {
                alert(`File ${file.name} is too large. Maximum size is ${maxFileSize}MB.`);
                return false;
            }
            return true;
        });
        const remainingSlots = maxFiles - files.length;
        const filesToAdd = validFiles.slice(0, remainingSlots);
        onFilesChange([...files, ...filesToAdd]);
    };

    const handleRemoveFile = (index: number) => {
        const newFiles = files.filter((_, i) => i !== index);
        onFilesChange(newFiles);
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileChange(e.dataTransfer.files);
        }
    };

    const getPreviewSizeClasses = () => {
        switch (previewSize) {
            case "sm": return "w-16 h-16";
            case "lg": return "w-24 h-24";
            default: return "w-20 h-20";
        }
    };

    return (
        <div className={cn("space-y-4", className)}>
            {label && (
                <label className="block text-sm font-medium text-foreground mb-2">
                    {label} {maxFiles > 1 && `(up to ${maxFiles} files)`}
                </label>
            )}

            {/* File Previews */}
            {showPreview && files.length > 0 && (
                <div className="flex flex-wrap gap-2 min-h-[88px]">
                    {loading ? (
                        <div className="flex items-center justify-center w-full h-20">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        </div>
                    ) : (
                        files.map((file, index) => {
                            // If File object
                            if (file instanceof File) {
                                return (
                                    <div
                                        key={index}
                                        className={cn(
                                            "relative rounded-lg overflow-hidden border border-border bg-muted flex items-center justify-center group",
                                            getPreviewSizeClasses()
                                        )}
                                    >
                                        {file.type.startsWith('image') ? (
                                            <img
                                                src={URL.createObjectURL(file)}
                                                alt="Preview"
                                                className="object-cover w-full h-full"
                                            />
                                        ) : (
                                            <div className="relative w-full h-full flex items-center justify-center bg-black/60 dark:bg-white/10">
                                                <svg
                                                    className="absolute w-8 h-8 text-white dark:text-white opacity-90"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M14.752 11.168l-4.197-2.474A1 1 0 009 9.618v4.764a1 1 0 001.555.832l4.197-2.474a1 1 0 000-1.664z"
                                                    />
                                                </svg>
                                            </div>
                                        )}
                                        <button
                                            type="button"
                                            className="absolute top-1 right-1 bg-background/80 dark:bg-background/90 rounded-full p-1 hover:bg-destructive/10 transition opacity-80 group-hover:opacity-100"
                                            onClick={() => handleRemoveFile(index)}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4 text-destructive"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M6 18L18 6M6 6l12 12"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                );
                            } else if ((file as ImportedImage).imported && (file as ImportedImage).src) {
                                // Imported image object
                                return (
                                    <div
                                        key={index}
                                        className={cn(
                                            "relative rounded-lg overflow-hidden border border-border bg-muted flex items-center justify-center group",
                                            getPreviewSizeClasses()
                                        )}
                                    >
                                        <img
                                            src={(file as ImportedImage).src}
                                            alt="Preview"
                                            className="object-cover w-full h-full"
                                        />
                                        <button
                                            type="button"
                                            className="absolute top-1 right-1 bg-background/80 dark:bg-background/90 rounded-full p-1 hover:bg-destructive/10 transition opacity-80 group-hover:opacity-100"
                                            onClick={() => handleRemoveFile(index)}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4 text-destructive"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M6 18L18 6M6 6l12 12"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                );
                            } else {
                                return null;
                            }
                        })
                    )}
                </div>
            )}

            {/* Upload Area */}
            <label
                className={cn(
                    "w-full flex flex-col items-center px-4 py-6 bg-background text-foreground rounded-lg shadow-lg tracking-wide uppercase border border-border cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors",
                    dragActive && "bg-accent border-accent-foreground",
                    files.length >= maxFiles && "opacity-50 cursor-not-allowed"
                )}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <UploadCloud className="w-6 h-6 mb-2 text-primary" />
                <span className="text-xs font-semibold">
                    {files.length >= maxFiles ? "Maximum files reached" : "Upload Files"}
                </span>
                <input
                    type="file"
                    className="hidden"
                    multiple={maxFiles > 1}
                    accept={acceptedExtensions.join(',')}
                    onChange={(e) => handleFileChange(e.target.files)}
                    disabled={files.length >= maxFiles}
                />
            </label>

            {/* File Info */}
            <div className="text-xs text-muted-foreground">
                <p>Accepted formats: {acceptedExtensions.join(', ')}</p>
                <p>Maximum file size: {maxFileSize}MB per file</p>
                {maxFiles > 1 && <p>Maximum files: {maxFiles}</p>}
            </div>
        </div>
    );
};
