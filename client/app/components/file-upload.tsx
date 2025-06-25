'use client';
import * as React from 'react';
import { Upload } from 'lucide-react';

const FileUploadComponent: React.FC = () => {
  const handleFileUploadButtonClick = () => {
    const el = document.createElement('input');
    el.setAttribute('type', 'file');
    el.setAttribute('accept', 'application/pdf');
    el.addEventListener('change', async (ev) => {
      if (el.files && el.files.length > 0) {
        const file = el.files.item(0);
        if (file) {
          const formData = new FormData();
          formData.append('pdf', file);

          await fetch('http://localhost:8000/upload/pdf', {
            method: 'POST',
            body: formData,
          });
          console.log('File uploaded');
        }
      }
    });
    el.click();
  };

  return (
    <div
      onClick={handleFileUploadButtonClick}
      className="cursor-pointer group w-full bg-gradient-to-br from-[#111] via-[#1a1a1a] to-[#2a2a2a] text-white rounded-xl p-6 flex flex-col items-center justify-center border border-[#333] hover:from-[#191919] hover:to-[#333] transition-all duration-300 hover:shadow-xl"
    >
      <Upload
        className="mb-2 text-cyan-400 group-hover:scale-110 group-hover:text-cyan-300 transition-transform duration-300"
        size={32}
      />
      <h3 className="text-sm font-medium text-gray-200 group-hover:text-white tracking-wide">
        Upload PDF File
      </h3>
    </div>
  );
};

export default FileUploadComponent;
