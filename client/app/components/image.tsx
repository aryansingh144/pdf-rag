'use client'
import React from 'react';
import {Upload} from 'lucide-react';


const FileUploadComponent: React.FC = () => {
    return (
        <div className='bg-slate-900 text-white shadow-2xl flex justify-center items-center p-4 rounded-lg border-2 border-white'>
            <div 
            // onClick={handleFileUploadButtonClick} 
            className='flex justify-center items-center flex-col cursor-pointer'>

                <h3 >Upload PDF file </h3>
                <Upload />

            </div>
        </div>
    )

}

export default FileUploadComponent;