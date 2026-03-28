import React, { useEffect, useRef } from 'react';
import JSZip from 'jszip'; 
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
// 🔥 FIX: Added CloseIcon to the imports here!
import { MonitorIcon, CodeIcon, PlayIcon, CopyIcon, DownloadIcon, TerminalIcon, FileIcon, CloseIcon } from './Icons';

export default function Workspace({
    activeTab, setActiveTab, generatedFiles, activeFile, setActiveFile,
    previewHtml, terminalOutput, setTerminalOutput, isConsoleOpen, setIsConsoleOpen, 
    handleRunCode, setIsPublishModalOpen, setIsEnvModalOpen,
    
    // 🔥 New Props for Left Sidebar Chat & Timeline
    actionLogs, prompt, setPrompt, handleGenerate, isGenerating, toggleListening, isListening
}) {

    const logsEndRef = useRef(null);
    
    // Auto-scroll timeline to bottom
    useEffect(() => {
        logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [actionLogs]);

    const formatCode = (code, filename) => {
        if (!code) return "// Awaiting generation...";
        let text = String(code).replace(/\\n/g, '\n').replace(/\\"/g, '"');
        text = text.replace(/```[a-zA-Z]*\n?/g, '').replace(/```/g, '');
        return text.trim();
    };

    const handleCopy = () => { 
        navigator.clipboard.writeText(formatCode(generatedFiles[activeFile], activeFile)); 
        setTerminalOutput("> Code Copied to clipboard!"); setIsConsoleOpen(true); 
    };

    const handleDownload = () => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(new Blob([formatCode(generatedFiles[activeFile], activeFile)]));
        a.download = activeFile || 'download.txt'; 
        a.click();
    };

    const handleDownloadZip = async () => {
        setTerminalOutput("> Compiling ZIP file..."); setIsConsoleOpen(true);
        try {
            const zip = new JSZip();
            Object.entries(generatedFiles).forEach(([filename, content]) => {
                zip.file(filename, formatCode(content, filename));
            });
            const content = await zip.generateAsync({ type: "blob" });
            const a = document.createElement('a'); a.href = URL.createObjectURL(content);
            a.download = "mantu-cloud-project.zip"; a.click();
            setTerminalOutput("> 🎉 Project downloaded as ZIP successfully!");
        } catch(e) { setTerminalOutput("> ❌ Error creating ZIP: " + e.message); }
    };

    return (
        <div className="flex flex-1 w-full h-full overflow-hidden bg-[#0A0A0E]">
            
            {/* ⚡ LEFT SIDEBAR: ACTION TIMELINE & LIVE CHAT */}
            <div className="w-72 md:w-80 border-r border-[#2b2b2b] flex flex-col flex-shrink-0 bg-[#0A0A0E] h-full shadow-[5px_0_15px_rgba(0,0,0,0.2)] z-10">
                
                {/* Header */}
                <div className="h-12 border-b border-[#2b2b2b] flex items-center px-4 shrink-0 bg-[#111116]">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                        Action Timeline
                    </div>
                </div>

                {/* Timeline Logs Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-5 scrollbar-hide">
                    {actionLogs.length === 0 && (
                        <div className="text-xs text-gray-500 text-center mt-10">Starting project...</div>
                    )}
                    
                    {actionLogs.map((log) => (
                        <div key={log.id} className="relative pl-5 border-l border-blue-900/30">
                            {/* Blue Glowing Dot */}
                            <div className="absolute -left-[4.5px] top-1.5 w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>
                            
                            {log.type === 'user' ? (
                                // User Prompts (Chat style)
                                <div className="bg-[#1e1e1e] border border-[#2b2b2b] rounded-lg p-3 mt-1 shadow-sm">
                                    <span className="text-xs text-blue-400 font-bold mb-1 block">👤 User Prompt</span>
                                    <span className="text-sm font-medium text-white break-words">{log.text}</span>
                                </div>
                            ) : (
                                // System/AI Logs (Screenshot style)
                                <div className="flex flex-col gap-0.5 mt-0.5">
                                    <span className="text-[10px] text-gray-500 uppercase tracking-wider">{log.agent}</span>
                                    <span className={`text-xs font-bold ${log.status === 'Success' ? 'text-green-400' : log.status === 'Error' ? 'text-red-400' : 'text-blue-400'}`}>{log.status || 'Processing'}</span>
                                    <span className="text-[11px] text-gray-300 break-words mt-0.5">{log.details}</span>
                                </div>
                            )}
                        </div>
                    ))}
                    {isGenerating && (
                        <div className="relative pl-5 border-l border-blue-900/30">
                             <div className="absolute -left-[4.5px] top-1.5 w-2 h-2 rounded-full bg-purple-500 animate-pulse shadow-[0_0_8px_rgba(168,85,247,0.8)]"></div>
                             <span className="text-xs font-bold text-purple-400 animate-pulse">AI is working...</span>
                        </div>
                    )}
                    <div ref={logsEndRef} />
                </div>

                {/* 💬 LIVE CHAT / FOLLOW UP PROMPT BOX */}
                <div className="p-3 border-t border-[#2b2b2b] bg-[#111116] shrink-0">
                    <div className={`bg-[#1e1e1e] border ${isListening ? 'border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.2)]' : 'border-[#3b3b3b] focus-within:border-blue-500'} rounded-lg p-2 transition-colors flex flex-col`}>
                        <textarea 
                            value={prompt} 
                            onChange={e => setPrompt(e.target.value)}
                            placeholder={isListening ? "Listening..." : "Ask for changes or add features..."}
                            className={`w-full bg-transparent border-none outline-none text-xs text-white resize-none h-14 ${isListening ? 'placeholder-red-400' : ''}`}
                            onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleGenerate(); } }}
                        />
                        <div className="flex justify-between items-center mt-1">
                            <button onClick={toggleListening} className={`p-1.5 rounded-full ${isListening ? 'text-red-500 bg-red-500/10 animate-pulse' : 'text-gray-400 hover:text-white hover:bg-[#2b2b2b]'}`} title="Mic">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path></svg>
                            </button>
                            <button onClick={handleGenerate} disabled={isGenerating || !prompt.trim()} className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-3 py-1.5 rounded text-[10px] font-bold flex items-center gap-1 shadow-sm transition">
                                Send 🚀
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* 💻 RIGHT SIDE: MAIN WORKSPACE (Code & Preview) */}
            <div className="flex-1 flex flex-col relative min-w-0 bg-[#1e1e1e]">
                
                {/* 🔝 TOP TOOLBAR */}
                <div className="h-12 border-b border-[#2b2b2b] flex items-center justify-between px-3 bg-[#111116] shrink-0 overflow-x-auto">
                    {/* View Toggles */}
                    <div className="flex items-center bg-[#1e1e1e] rounded border border-[#2b2b2b] p-0.5 shrink-0">
                        <button onClick={() => setActiveTab('preview')} className={`flex items-center gap-1.5 px-3 py-1 rounded-sm text-[10px] font-bold transition-all ${activeTab === 'preview' ? 'bg-[#2b2b2b] text-white shadow' : 'text-gray-400 hover:text-white'}`}><MonitorIcon className="w-3 h-3"/> Live Preview</button>
                        <button onClick={() => setActiveTab('code')} className={`flex items-center gap-1.5 px-3 py-1 rounded-sm text-[10px] font-bold transition-all ${activeTab === 'code' ? 'bg-[#2b2b2b] text-white shadow' : 'text-gray-400 hover:text-white'}`}><CodeIcon className="w-3 h-3"/> View Code</button>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 shrink-0">
                        <button onClick={() => setIsConsoleOpen(!isConsoleOpen)} className={`flex items-center gap-1 px-3 py-1.5 rounded text-[10px] font-bold border transition-all ${isConsoleOpen ? 'bg-[#2b2b2b] text-white border-transparent' : 'bg-transparent text-gray-400 border-[#2b2b2b] hover:text-white'}`}>_ Console</button>
                        <button onClick={() => setIsEnvModalOpen(true)} className="bg-[#1e1e1e] text-gray-300 border border-[#2b2b2b] px-3 py-1.5 rounded text-[10px] font-bold hover:bg-[#2b2b2b] hover:text-white transition">🔐 Keys</button>
                        <div className="h-4 w-px bg-[#3b3b3b] mx-1"></div>
                        <button onClick={handleDownloadZip} className="bg-[#1e1e1e] text-gray-300 border border-[#2b2b2b] px-3 py-1.5 rounded text-[10px] font-bold hover:bg-[#2b2b2b] hover:text-white transition flex items-center gap-1"><DownloadIcon className="w-3 h-3"/> ZIP</button>
                        <button onClick={() => setIsPublishModalOpen(true)} className="bg-white text-black px-4 py-1.5 rounded text-[10px] font-bold flex items-center gap-1 hover:bg-gray-200 transition-all">Deploy 🌍</button>
                        <button onClick={handleRunCode} className="bg-green-600/20 text-green-400 border border-green-600/30 px-3 py-1.5 rounded text-[10px] font-bold flex items-center gap-1 hover:bg-green-600/40 transition"><PlayIcon className="w-3 h-3"/> Run</button>
                    </div>
                </div>

                {/* 📁 FILE TABS (Only in Code View) */}
                {activeTab === 'code' && Object.keys(generatedFiles).length > 0 && (
                    <div className="flex bg-[#0A0A0E] border-b border-[#2b2b2b] overflow-x-auto shrink-0 scrollbar-hide h-9 items-end">
                        {Object.keys(generatedFiles).map(file => (
                            <button key={file} onClick={() => setActiveFile(file)} className={`flex items-center gap-1.5 px-4 py-1.5 text-[10px] font-mono border-t border-r border-l border-transparent rounded-t-md whitespace-nowrap transition-all ${activeFile === file ? 'bg-[#1e1e1e] text-blue-400 border-[#2b2b2b]' : 'text-gray-500 hover:bg-[#111116] hover:text-gray-300'}`}>
                                <FileIcon className="w-3 h-3"/> {file}
                            </button>
                        ))}
                        <button onClick={handleCopy} className="ml-auto px-4 text-gray-500 hover:text-white pb-1" title="Copy Current File Code"><CopyIcon className="w-3.5 h-3.5"/></button>
                    </div>
                )}

                {/* 💻 MAIN SCREEN */}
                <div className="flex-1 overflow-auto relative">
                    {activeTab === 'preview' ? (
                        <div className="w-full h-full bg-white relative">
                            <iframe title="Live View" srcDoc={previewHtml} className="w-full h-full border-none absolute inset-0" sandbox="allow-scripts allow-same-origin allow-forms allow-popups" />
                        </div>
                    ) : (
                        <SyntaxHighlighter language="javascript" style={vscDarkPlus} showLineNumbers={true} wrapLines={true} customStyle={{ margin: 0, padding: '1rem', background: '#1e1e1e', fontSize: '12px', minHeight: '100%' }}>
                            {formatCode(generatedFiles[activeFile], activeFile)}
                        </SyntaxHighlighter>
                    )}
                </div>

                {/* 🖥️ BOTTOM TERMINAL CONSOLE */}
                {isConsoleOpen && (
                    <div className="h-40 bg-[#0A0A0E] border-t border-[#2b2b2b] shrink-0 flex flex-col z-20">
                        <div className="h-7 bg-[#111116] border-b border-[#2b2b2b] flex items-center justify-between px-3 text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                            <div className="flex items-center gap-2"><TerminalIcon className="w-3 h-3"/> Output Console</div>
                            <button onClick={() => setIsConsoleOpen(false)} className="hover:text-red-400"><CloseIcon className="w-3 h-3"/></button>
                        </div>
                        <div className="flex-1 p-3 overflow-auto font-mono text-[11px] text-gray-300 whitespace-pre-wrap leading-relaxed">
                            {terminalOutput}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
