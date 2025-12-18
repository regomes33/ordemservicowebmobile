import React, { useState } from 'react';
import { uploadPhoto, deletePhoto } from '../services/firebaseService';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

export default function PhotoUploader({ photos = [], onChange, orderId }) {
    const [uploading, setUploading] = useState(false);
    const [previews, setPreviews] = useState(photos);

    const handleFileSelect = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        setUploading(true);
        const newPhotos = [];

        try {
            for (const file of files) {
                // Create preview
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPreviews(prev => [...prev, { url: reader.result, uploading: true }]);
                };
                reader.readAsDataURL(file);

                // Upload to Firebase if orderId is provided
                if (orderId) {
                    const photoData = await uploadPhoto(file, orderId);
                    newPhotos.push(photoData);
                } else {
                    // If no orderId, just store file for later upload
                    newPhotos.push({ file, preview: URL.createObjectURL(file) });
                }
            }

            const updatedPhotos = [...photos, ...newPhotos];
            onChange(updatedPhotos);

            if (orderId) {
                setPreviews(updatedPhotos);
            }
        } catch (error) {
            console.error('Error uploading photos:', error);
            alert('Erro ao fazer upload das fotos');
        } finally {
            setUploading(false);
        }
    };

    const handleRemove = async (index) => {
        const photo = previews[index];

        try {
            // Delete from Firebase Storage if it has a path
            if (photo.path) {
                await deletePhoto(photo.path);
            }

            const updatedPhotos = previews.filter((_, i) => i !== index);
            setPreviews(updatedPhotos);
            onChange(updatedPhotos);
        } catch (error) {
            console.error('Error deleting photo:', error);
            alert('Erro ao excluir foto');
        }
    };

    return (
        <div className="space-y-4">
            {/* Upload Button */}
            <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-10 h-10 mb-2 text-gray-400" />
                        <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Clique para fazer upload</span> ou arraste e solte
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG ou JPEG (MAX. 5MB)</p>
                    </div>
                    <input
                        type="file"
                        className="hidden"
                        multiple
                        accept="image/*"
                        onChange={handleFileSelect}
                        disabled={uploading}
                    />
                </label>
            </div>

            {/* Photo Previews */}
            {previews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {previews.map((photo, index) => (
                        <div key={index} className="relative group">
                            <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                                <img
                                    src={photo.url || photo.preview}
                                    alt={`Preview ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <button
                                onClick={() => handleRemove(index)}
                                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                type="button"
                            >
                                <X size={16} />
                            </button>
                            {photo.uploading && (
                                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                    <div className="text-white text-sm">Enviando...</div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {uploading && (
                <div className="text-center text-sm text-gray-600">
                    Fazendo upload das fotos...
                </div>
            )}
        </div>
    );
}
