import { useState, useRef } from 'react';
import { Upload, X, File, Image, FileText, FileJson, Film } from 'lucide-react';
import type { InputFileType } from "@/components/types/input/input-file-type.ts";

export function InputFile(item: InputFileType) {

    const [files, setFiles] = useState<File[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const inputRef = useRef<HTMLInputElement>(null);
    const dropRef = useRef<HTMLDivElement>(null);

    // Formater la taille du fichier
    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    // Obtenir l'icône selon le type de fichier
    const getFileIcon = (file: File) => {
        const type = file.type;
        if (type.startsWith('image/')) {
            return <Image className="w-8 h-8 text-blue-500" />;
        } else if (type.startsWith('video/')) {
            return <Film className="w-8 h-8 text-purple-500" />;
        } else if (type === 'application/pdf') {
            return <FileText className="w-8 h-8 text-red-500" />;
        } else if (type === 'application/json') {
            return <FileJson className="w-8 h-8 text-yellow-500" />;
        } else {
            return <File className="w-8 h-8 text-gray-500" />;
        }
    };

    // Valider un fichier
    const validateFile = (file: File): boolean => {
        // Valider le format
        const fileExtension = file.name.split('.').pop()?.toUpperCase() || '';
        const fileType = file.type.split('/')[1]?.toUpperCase() || '';

        const isValidFormat = item.format?.some(f =>
            f.toUpperCase() === fileExtension ||
            f.toUpperCase() === fileType ||
            file.type.includes(f.toLowerCase())
        );

        if (!isValidFormat) {
            setErrorMessage(`Format non supporté. Formats acceptés: ${item.format?.join(', ')}`);
            return false;
        }

        // Valider la taille (50 MB par défaut)
        const maxSize = item.max || 50 * 1024 * 1024;
        if (file.size > maxSize) {
            setErrorMessage(`Le fichier dépasse la taille maximale de ${formatFileSize(maxSize)}`);
            return false;
        }

        // Valider la taille minimale
        if (item.min && file.size < item.min) {
            setErrorMessage(`Le fichier est trop petit. Taille minimale: ${formatFileSize(item.min)}`);
            return false;
        }

        setErrorMessage('');
        return true;
    };

    // Ajouter des fichiers
    const addFiles = (newFiles: FileList | null) => {
        if (!newFiles) return;

        const fileArray = Array.from(newFiles);
        const validFiles: File[] = [];
        let hasError = false;

        fileArray.forEach(file => {
            if (validateFile(file)) {
                validFiles.push(file);
            } else {
                hasError = true;
            }
        });

        if (hasError && validFiles.length === 0) {
            return;
        }

        let updatedFiles: File[];
        if (item.type === 'multiple') {
            updatedFiles = [...files, ...validFiles];
        } else {
            updatedFiles = validFiles.slice(0, 1);
        }

        setFiles(updatedFiles);

        if (item.onChange) {
            item.onChange({
                target: {
                    name: item.name || '',
                    value: updatedFiles,
                    files: updatedFiles
                }
            } as any);
        }
    };

    // Supprimer un fichier
    const removeFile = (index: number, e: React.MouseEvent) => {
        e.stopPropagation();
        const updatedFiles = files.filter((_, i) => i !== index);
        setFiles(updatedFiles);

        if (item.onChange) {
            item.onChange({
                target: {
                    name: item.name || '',
                    value: updatedFiles,
                    files: updatedFiles
                }
            } as any);
        }

        // Reset input
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };

    // Gérer le drag & drop
    const handleDragEnter = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        addFiles(e.dataTransfer.files);
    };

    // Rendu des fichiers sélectionnés
    const renderFiles = () => {
        if (files.length === 0) return null;

        return (
            <div className={`${item.width || 'w-70'} mt-3 space-y-2 ${item.type === 'multiple' ? 'max-h-40 overflow-y-auto' : ''}`}>
                {files.map((file, index) => (
                    <div
                        key={index}
                        className={`flex items-center gap-3 p-2 bg-gray-50 rounded-lg border border-gray-200`}
                    >
                        {getFileIcon(file)}
                        <div className="flex-1 min-w-0">
                            <p className={`${item.textSize || 'text-xs'} font-medium text-gray-700 truncate`}>
                                {file.name}
                            </p>
                            <p className="text-xs text-gray-500">
                                {formatFileSize(file.size)}
                            </p>
                        </div>
                        {!item.disabled && (
                            <button
                                type="button"
                                onClick={(e) => removeFile(index, e)}
                                className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                            >
                                <X className="w-4 h-4 text-gray-500" />
                            </button>
                        )}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="w-fit flex flex-col">
            {item.label && (
                <label className={`font-caption text-caption text-on-surface-variant font-semibold block mb-1 ${item.textSize || 'text-xs'}`}>
                    {item.label} {item.isRequired && '*'}
                </label>
            )}

            <div
                ref={dropRef}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={`
                    ${item.width || 'w-70'}
                    ${item.height || 'h-45'}
                    relative border-2 border-dashed rounded-xl p-6
                    transition-all duration-200
                    ${isDragging
                    ? 'border-secondary-container bg-secondary-container/5'
                    : 'border-gray-300 hover:border-gray-400'
                }
                    ${item.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                    ${item.error || errorMessage ? 'border-red-500' : ''}
                    ${item.className}
                `}
                onClick={() => !item.disabled && inputRef.current?.click()}
            >
                <input
                    ref={inputRef}
                    type="file"
                    name={item.name}
                    id={item.id}
                    onChange={(e) => addFiles(e.target.files)}
                    disabled={item.disabled}
                    multiple={item.type === 'multiple'}
                    accept={item.format?.map(f => `.${f.toLowerCase()}`).join(',')}
                    className="sr-only"
                />

                <div className="flex flex-col items-center justify-center gap-2 text-center">
                    <div className={`
                        p-3 rounded-full bg-gray-100
                        ${isDragging ? 'bg-secondary-container/20' : ''}
                    `}>
                        <Upload className={`
                            w-8 h-8 
                            ${isDragging ? 'text-secondary-container' : 'text-gray-400'}
                        `} />
                    </div>

                    <div>
                        <p className={`${item.textSize || 'text-xs'} font-medium text-gray-700`}>
                            Choisissez un fichier ou faites-le glisser ici.
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            Formats {item.format?.join(', ')}, jusqu'à {formatFileSize(item.max || 50 * 1024 * 1024)}.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            if (!item.disabled) inputRef.current?.click();
                        }}
                        disabled={item.disabled}
                        className="mt-2 px-4 py-2 text-sm font-medium text-white bg-secondary-container rounded-lg hover:bg-secondary-container/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Parcourir les fichiers
                    </button>
                </div>
            </div>

            {renderFiles()}

            {(item.error || errorMessage) && (
                <p className="mt-1 text-sm text-red-500">
                    {item.error || errorMessage}
                </p>
            )}
        </div>
    );
}