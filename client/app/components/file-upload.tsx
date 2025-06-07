'use client'
import React from 'react';
import {Upload} from 'lucide-react';


const handleFileUploadButtonClick = () => {
    const el=document.createElement('input');
    el.setAttribute('type', 'file');
    el.setAttribute('accept', 'application/pdf');
    el.addEventListener('change', async() => {
        if(el.files && el.files.length > 0) {
            const  file =el.files[0];
            if(file){
                const formData = new FormData();
                formData.append('pdf', file);
                await fetch('http://localhost:8000/upload/pdf', {
                    method: 'POST',
                    body: formData,
            })
            console.log("File uploaded ");
            
            }
        }
    })
    el.click();
}

const FileUploadComponent: React.FC = () => {
    return (
        <div className='bg-slate-900 text-white shadow-2xl flex justify-center items-center p-4 rounded-lg border-2 border-white'>
            <div 
            onClick={handleFileUploadButtonClick} 
            className='flex justify-center items-center flex-col cursor-pointer'>

                <h3 >Upload PDF file </h3>
                <Upload />

            </div>
        </div>
    )

}

export default FileUploadComponent;