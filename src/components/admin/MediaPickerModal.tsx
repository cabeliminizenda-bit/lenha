'use client';
import { useState, useEffect, useRef } from 'react';
import { getMediaList, uploadMediaAction, uploadMultipleMediaAction } from '@/actions/media';
import { useTranslations } from 'next-intl';
import Image from "next/image";

type Tab = 'library' | 'upload';

type MediaPickerModalProps = {
  onClose: () => void;
  onSelect?: (url: string) => void;
  onSelectMultiple?: (urls: string[]) => void;
  multiple?: boolean;
};

export default function MediaPickerModal({ 
  onClose, 
  onSelect,
  onSelectMultiple,
  multiple = false,
}: MediaPickerModalProps) {
  const [activeTab, setActiveTab] = useState<Tab>('library');
  const [media, setMedia] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Multi-select state in library tab
  const [selectedUrls, setSelectedUrls] = useState<string[]>([]);

  // Upload state
  const [uploadFiles, setUploadFiles] = useState<Array<{ id: string; file: File; preview: string }>>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const t = useTranslations('AdminMedia');

  const fetchMedia = async (p = 1, s = '') => {
    setIsLoading(true);
    try {
      const res = await getMediaList(p, 20, s);
      setMedia(res.items);
      setTotalPages(res.totalPages || 1);
    } catch (e) {
      console.error('Error fetching media', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'library') {
      fetchMedia(page, search);
    }
  }, [page, search, activeTab]);

  const isImageFile = (name: string) => /\.(jpg|jpeg|png|gif|webp|svg|avif)(\?|$)/i.test(name);

  // Library selection handler
  const handleItemClick = (url: string) => {
    if (multiple) {
      setSelectedUrls(prev => 
        prev.includes(url) ? prev.filter(u => u !== url) : [...prev, url]
      );
    } else {
      if (onSelect) onSelect(url);
      onClose();
    }
  };

  const handleConfirmLibrarySelection = () => {
    if (selectedUrls.length === 0) return;
    if (onSelectMultiple) {
      onSelectMultiple(selectedUrls);
    } else if (onSelect && selectedUrls[0]) {
      onSelect(selectedUrls[0]);
    }
    onClose();
  };

  // Upload file addition
  const addFilesToUpload = (newFiles: FileList | File[]) => {
    const list = Array.from(newFiles);
    if (!list.length) return;

    const filesToProcess = multiple ? list : [list[0]];
    const mapped = filesToProcess.map(file => ({
      id: Math.random().toString(36).substring(7),
      file,
      preview: isImageFile(file.name) ? URL.createObjectURL(file) : '',
    }));

    if (multiple) {
      setUploadFiles(prev => [...prev, ...mapped]);
    } else {
      setUploadFiles(mapped);
    }
    setUploadError('');
    setUploadSuccess('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addFilesToUpload(e.target.files);
      e.target.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      addFilesToUpload(e.dataTransfer.files);
    }
  };

  const handleRemoveUploadFile = (id: string) => {
    setUploadFiles(prev => {
      const removed = prev.find(item => item.id === id);
      if (removed?.preview) URL.revokeObjectURL(removed.preview);
      return prev.filter(item => item.id !== id);
    });
  };

  const handleBatchUpload = async () => {
    if (uploadFiles.length === 0) return;
    setIsUploading(true);
    setUploadError('');
    setUploadSuccess('');

    try {
      const formData = new FormData();
      for (const item of uploadFiles) {
        formData.append('files', item.file);
      }

      const res = await uploadMultipleMediaAction(formData);
      if (res.success && res.urls && res.urls.length > 0) {
        setUploadSuccess(`${res.urls.length} fichier(s) téléversé(s) avec succès !`);
        
        // Clean up preview blob URLs
        uploadFiles.forEach(f => {
          if (f.preview) URL.revokeObjectURL(f.preview);
        });

        if (multiple) {
          if (onSelectMultiple) onSelectMultiple(res.urls);
          else if (onSelect && res.urls[0]) onSelect(res.urls[0]);
        } else {
          if (onSelect && res.urls[0]) onSelect(res.urls[0]);
        }

        setTimeout(() => {
          onClose();
        }, 300);
      } else {
        setUploadError(res.error || (res.errors && res.errors.join(', ')) || 'Erreur lors du téléversement.');
      }
    } catch (e: any) {
      console.error('Upload error', e);
      setUploadError('Erreur lors du téléversement.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Médiathèque</h2>
            {multiple && (
              <p className="text-xs text-orange-600 font-medium">Mode sélection multiple activé</p>
            )}
          </div>
          <button 
            type="button"
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 transition w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b bg-white">
          <button
            type="button"
            onClick={() => setActiveTab('library')}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-semibold border-b-2 transition ${
              activeTab === 'library' 
                ? 'border-orange-500 text-orange-700' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Bibliothèque de médias
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-semibold border-b-2 transition ${
              activeTab === 'upload' 
                ? 'border-orange-500 text-orange-700' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            {multiple ? 'Téléverser des fichiers (multiples)' : 'Téléverser un fichier'}
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-grow overflow-hidden flex flex-col">

          {/* LIBRARY TAB */}
          {activeTab === 'library' && (
            <>
              <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-center gap-3">
                <input 
                  type="text" 
                  placeholder="Rechercher des médias..."
                  className="w-full sm:w-1/2 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-orange-500 focus:border-orange-500 outline-none"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                />
                {multiple && selectedUrls.length > 0 && (
                  <span className="text-xs font-semibold px-3 py-1 bg-orange-100 text-orange-800 rounded-full">
                    {selectedUrls.length} sélectionnée(s)
                  </span>
                )}
              </div>

              <div className="p-4 overflow-y-auto flex-grow">
                {isLoading ? (
                  <div className="flex items-center justify-center py-16">
                    <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : media.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                    <svg className="w-16 h-16 mb-3 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm">Aucun média trouvé</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
                    {media.map(m => {
                      const isSelected = selectedUrls.includes(m.url);
                      const selectIndex = selectedUrls.indexOf(m.url);

                      return (
                        <div 
                          key={m.id} 
                          onClick={() => handleItemClick(m.url)}
                          className={`relative aspect-square border-2 rounded-lg overflow-hidden cursor-pointer group transition-all shadow-sm ${
                            isSelected 
                              ? 'border-orange-500 ring-4 ring-orange-400/40' 
                              : 'border-transparent hover:border-orange-400'
                          }`}
                        >
                          {isImageFile(m.url) ? (
                            <Image width={800} height={800} unoptimized src={m.url} alt={m.altText || m.title || 'media'} className="object-cover w-full h-full" />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 p-2">
                              <svg className="w-8 h-8 text-gray-500 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                              </svg>
                              <span className="text-[10px] text-gray-500 truncate w-full text-center">{m.title || 'Fichier'}</span>
                            </div>
                          )}

                          {/* Multi-selection badges */}
                          {multiple ? (
                            isSelected ? (
                              <div className="absolute top-2 right-2 bg-orange-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-md z-10">
                                ✓ {selectIndex + 1}
                              </div>
                            ) : (
                              <div className="absolute top-2 right-2 w-6 h-6 rounded-full border-2 border-white bg-black/30 group-hover:block hidden z-10" />
                            )
                          ) : (
                            <div className="absolute inset-0 bg-orange-500/20 hidden group-hover:flex items-center justify-center">
                              <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow">Sélectionner</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Footer bar */}
              <div className="p-4 border-t flex flex-wrap items-center justify-between gap-3 bg-gray-50">
                <div className="flex gap-2 items-center">
                  <button 
                    type="button"
                    disabled={page === 1} 
                    onClick={() => setPage(p => p - 1)} 
                    className="px-3 py-1.5 border rounded-md disabled:opacity-40 text-sm bg-white hover:bg-gray-100 transition"
                  >
                    ← Précédent
                  </button>
                  <span className="text-sm text-gray-500">Page {page} / {Math.max(totalPages, 1)}</span>
                  <button 
                    type="button"
                    disabled={page >= totalPages} 
                    onClick={() => setPage(p => p + 1)} 
                    className="px-3 py-1.5 border rounded-md disabled:opacity-40 text-sm bg-white hover:bg-gray-100 transition"
                  >
                    Suivant →
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  {multiple && selectedUrls.length > 0 && (
                    <button 
                      type="button" 
                      onClick={() => setSelectedUrls([])}
                      className="text-xs text-gray-500 hover:text-red-600 underline mr-2"
                    >
                      Désélectionner tout
                    </button>
                  )}
                  <button 
                    type="button" 
                    onClick={onClose} 
                    className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 text-sm font-medium transition"
                  >
                    Fermer
                  </button>
                  {multiple && (
                    <button
                      type="button"
                      disabled={selectedUrls.length === 0}
                      onClick={handleConfirmLibrarySelection}
                      className="px-5 py-2 bg-orange-600 hover:bg-orange-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-bold rounded-lg shadow transition flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Ajouter la sélection ({selectedUrls.length})
                    </button>
                  )}
                </div>
              </div>
            </>
          )}

          {/* UPLOAD TAB */}
          {activeTab === 'upload' && (
            <div className="p-6 flex flex-col gap-4 overflow-y-auto flex-grow">
              
              {/* Dropzone */}
              <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition ${
                  uploadFiles.length > 0 ? 'border-orange-300 bg-orange-50/50' : 'border-gray-300 hover:border-orange-400 hover:bg-orange-50'
                }`}
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700">
                      {multiple 
                        ? 'Glissez-déposez plusieurs photos ici' 
                        : 'Glissez-déposez un fichier ici'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">ou cliquez pour sélectionner sur votre ordinateur</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    Formats acceptés : JPG, PNG, WEBP, GIF, SVG • Max 10 Mo par image
                  </p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple={multiple}
                  className="hidden"
                  onChange={handleFileChange}
                  accept="image/*,video/*,.pdf,.doc,.docx"
                />
              </div>

              {/* Previews of files to upload */}
              {uploadFiles.length > 0 && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-semibold text-gray-800">
                      Fichiers prêts au téléversement ({uploadFiles.length})
                    </h3>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-xs text-orange-600 hover:underline font-semibold"
                    >
                      + Ajouter d'autres fichiers
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-56 overflow-y-auto p-2 border rounded-lg bg-gray-50">
                    {uploadFiles.map((item) => (
                      <div key={item.id} className="relative bg-white border rounded-lg p-2 flex flex-col items-center group shadow-sm">
                        {item.preview ? (
                          <img src={item.preview} alt={item.file.name} className="h-20 w-full object-cover rounded mb-2" />
                        ) : (
                          <div className="h-20 w-full bg-gray-100 rounded mb-2 flex items-center justify-center text-gray-400">
                            📄
                          </div>
                        )}
                        <p className="text-xs text-gray-700 truncate w-full text-center font-medium">{item.file.name}</p>
                        <p className="text-[10px] text-gray-400">{(item.file.size / 1024 / 1024).toFixed(2)} MB</p>
                        
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveUploadFile(item.id);
                          }}
                          className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition shadow"
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {uploadError && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
                  {uploadError}
                </div>
              )}
              {uploadSuccess && (
                <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-lg">
                  ✓ {uploadSuccess}
                </div>
              )}

              <div className="flex gap-3 justify-end mt-auto pt-4 border-t">
                {uploadFiles.length > 0 && !uploadSuccess && (
                  <button
                    type="button"
                    onClick={() => {
                      uploadFiles.forEach(f => { if (f.preview) URL.revokeObjectURL(f.preview); });
                      setUploadFiles([]);
                      setUploadError('');
                    }}
                    className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 border rounded-lg hover:bg-gray-50 transition"
                  >
                    Tout effacer
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleBatchUpload}
                  disabled={uploadFiles.length === 0 || isUploading || !!uploadSuccess}
                  className="flex items-center gap-2 px-6 py-2.5 bg-orange-600 text-white text-sm font-semibold rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow"
                >
                  {isUploading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Téléversement en cours ({uploadFiles.length})...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      {uploadFiles.length > 1 
                        ? `Téléverser et insérer (${uploadFiles.length} photos)` 
                        : 'Téléverser et insérer'}
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
