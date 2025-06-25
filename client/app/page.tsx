'use client';

import FileUploadComponent from './components/file-upload';
import ChatComponent from './components/chat';

export default function Home() {
  return (
    <main className="h-screen w-screen bg-gradient-to-br from-black via-[#111] to-[#1c1c1c] text-gray-400 px-4 py-6 flex flex-col items-center justify-start relative overflow-hidden">
      
      {/* Upload Section */}
      <div
        className="
          w-full max-w-xs z-10
          bg-gradient-to-br from-[#1a1a1a] via-[#1f1f1f] to-[#252525]
          p-5 rounded-xl shadow-lg border border-[#2a2a2a]
          transition-all duration-300 hover:scale-[1.015] hover:shadow-xl

          mb-4
          lg:mb-0 lg:absolute lg:bottom-6 lg:left-6
        "
      >
        <h2 className="text-md font-semibold text-center mb-3 text-gray-400 tracking-wide">
          Upload Your File
        </h2>
        <FileUploadComponent />
      </div>

      {/* Chat Section */}
      <div className="w-full max-w-4xl flex-1 bg-[#121212] rounded-xl shadow-inner p-4 sm:p-6 overflow-hidden flex flex-col">

        <ChatComponent />
      </div>
    </main>
  );
}
