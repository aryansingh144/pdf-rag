'use client';

import * as React from 'react';
import { SendHorizonal } from 'lucide-react';

interface Doc {
  pageContent?: string;
  metdata?: {
    loc?: {
      pageNumber?: number;
    };
    source?: string;
  };
}

interface IMessage {
  role: 'assistant' | 'user';
  content?: string;
  documents?: Doc[];
}

const ChatComponent: React.FC = () => {
  const [message, setMessage] = React.useState('');
  const [messages, setMessages] = React.useState<IMessage[]>([]);
  const [loading, setLoading] = React.useState(false);
  const chatRef = React.useRef<HTMLDivElement>(null);

  const handleSendChatMessage = async () => {
    if (!message.trim()) return;
    setMessages((prev) => [...prev, { role: 'user', content: message }]);
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch(`http://localhost:8000/chat?message=${message}`);
      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data?.message,
          documents: data?.docs,
        },
      ]);
    } catch (err) {
      console.error('Error fetching message:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSendChatMessage();
  };

  React.useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-full max-h-full w-full ]">
      
      {/* Chat Section */}
      <div
        ref={chatRef}
        className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#0e0e0e] border-y border-[#222] shadow-inner"
        >

        {messages.length === 0 ? (
          <p className="text-gray-500 text-center mt-6 italic">No messages yet. Start chatting!</p>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`mb-4 w-fit max-w-[75%] px-4 py-3 rounded-xl shadow-md border text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'ml-auto bg-gray-300 text-[#0f2146] border-[#0e1419]'
                  : 'mr-auto bg-[#141b26] text-gray-200 border-gray-700'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.content}</div>
              {(msg.documents?.length ?? 0) > 0 && (
                <div className="mt-3 space-y-2 text-sm text-teal-400">
                  <p className="font-semibold text-teal-300">Referenced Docs:</p>
                  {msg.documents?.map((doc, i) => (
                    <div
                      key={i}
                      className="border border-teal-700 bg-[#0c1a22] rounded p-2 text-xs text-teal-200"
                    >
                      <p>{doc.pageContent}</p>
                      {doc.metdata?.source && (
                        <p className="mt-1 text-teal-400">Source: {doc.metdata.source}</p>
                      )}
                      {doc.metdata?.loc?.pageNumber && (
                        <p className="text-teal-400">Page: {doc.metdata.loc.pageNumber}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
        {loading && (
          <div className="text-sm text-gray-400 italic">Assistant is typing...</div>
        )}
      </div>

      {/* Input Section */}
      <div className="p-4 border-t relative border-black bg-[#0e0e0e]">
        <div className="flex items-center gap-2">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask something about the PDF..."
            className="flex-1 bg-[#121212] text-white placeholder-gray-500 border border-[#333] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
          />
          <button
            onClick={handleSendChatMessage}
            disabled={!message.trim() || loading}
            className="bg-cyan-700 hover:bg-cyan-600 text-white p-3 rounded-lg shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <SendHorizonal size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatComponent;
