import React, { useEffect, useRef } from 'react';
import JSZip from 'jszip'; 
import Editor from '@monaco-editor/react'; // 🔥 The VS Code Engine!
import { MonitorIcon, CodeIcon, PlayIcon, DownloadIcon, TerminalIcon, FileIcon, CloseIcon } from './Icons';

export default function Workspace({
    theme, activeTab, setActiveTab, generatedFiles, activeFile, setActiveFile,
    previewHtml, terminalOutput, setTerminalOutput, isConsoleOpen, setIsConsoleOpen, 
    handleRunCode, setIsPublishModalOpen, setIsEnvModalOpen,
    actionLogs, prompt, setPrompt, handleGenerate, isGenerating, toggleListening, isListening,
    handleCodeChange, saveProject // 🔥 New props
}) {

    const logsEndRef = useRef(null);
    useEffect(() => { logsEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [actionLogs]);

    const handleDownloadZip = async () => {
        setTerminalOutput("> Compiling ZIP file..."); setIsConsoleOpen(true);
        try {
            const zip = new JSZip();
            Object.entries(generatedFiles).forEach(([filename, content]) => { zip.file(filename, content); });
            const content = await zip.generateAsync({ type: "blob" });
            const a = document.createElement('a'); a.href = URL.createObjectURL(content);
            a.download = "mantu-cloud-project.zip"; a.click();
            setTerminalOutput("> 🎉 Project downloaded as ZIP successfully!");
        } catch(e) { setTerminalOutput("> ❌ Error creating ZIP: " + e.message); }
    };

    // Theme Variables for Workspace
    const bgSidebar = theme === 'dark' ? 'bg-[#0A0A0E] border-[#2b2b2b]' : 'bg-gray-50 border-gray-200';
    const bgHeader = theme === 'dark' ? 'bg-[#111116] border-[#2b2b2b]' : 'bg-white border-gray-200';
    const bgLogCard = theme === 'dark' ? 'bg-[#1e1e1e] border-[#2b2b2b] text-white' : 'bg-white border-gray-200 text-black';
    const textMuted = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';

    // Determine Language for Monaco
    const getLanguage = (fileName) => {
        if(!fileName) return 'javascript';
        if(fileName.endsWith('.css')) return 'css';
        if(fileName.endsWith('.html')) return 'html';
        if(fileName.endsWith('.json')) return 'json';
        return 'javascript';
    };

    return (
        <div className={`flex flex-1 w-full h-full overflow-hidden ${theme==='dark'?'bg-[#0A0A0E]':'bg-gray-100'}`}>
            
            {/* ⚡ LEFT SIDEBAR: ACTION TIMELINE & LIVE CHAT */}
            <div className={`w-72 md:w-80 border-r flex flex-col flex-shrink-0 h-full shadow-lg z-10 ${bgSidebar}`}>
                <div className={`h-12 border-b flex items-center px-4 shrink-0 ${bgHeader}`}>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-indigo-500 uppercase tracking-widest">
                        ⚡ Action Timeline
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-5 scrollbar-hide">
                    {actionLogs.length === 0 && <div className={`text-xs text-center mt-10 ${textMuted}`}>Starting project...</div>}
                    {actionLogs.map((log) => (
                        <div key={log.id} className="relative pl-5 border-l border-blue-500/30">
                            <div className="absolute -left-[4.5px] top-1.5 w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>
                            {log.type === 'user' ? (
                                <div className={`border rounded-lg p-3 mt-1 shadow-sm ${bgLogCard}`}>
                                    <span className="text-xs text-blue-500 font-bold mb-1 block">👤 User Prompt</span>
                                    <span className="text-sm font-medium break-words">{log.text}</span>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-0.5 mt-0.5">
                                    <span className={`text-[10px] uppercase tracking-wider ${textMuted}`}>{log.agent}</span>
                                    <span className={`text-xs font-bold ${log.status === 'Success' ? 'text-green-500' : log.status === 'Error' ? 'text-red-500' : 'text-blue-500'}`}>{log.status || 'Processing'}</span>
                                    <span className={`text-[11px] break-words mt-0.5 ${theme==='dark'?'text-gray-300':'text-gray-600'}`}>{log.details}</span>
                                </div>
                            )}
                        </div>
                    ))}
                    {isGenerating && (
                        <div className="relative pl-5 border-l border-purple-500/30">
                             <div className="absolute -left-[4.5px] top-1.5 w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
                             <span className="text-xs font-bold text-purple-500 animate-pulse">AI is working...</span>
                        </div>
                    )}
                    <div ref={logsEndRef} />
                </div>

                <div className={`p-3 border-t shrink-0 mt-auto ${bgHeader}`}>
                    <div className={`border rounded-lg p-2 transition-colors flex flex-col ${theme==='dark'?'bg-[#1e1e1e] border-[#3b3b3b]':'bg-white border-gray-300'} ${isListening ? 'border-red-500' : ''}`}>
                        <textarea 
                            value={prompt} onChange={e => setPrompt(e.target.value)}
                            placeholder={isListening ? "Listening..." : "Ask for changes or modifications..."}
                            className={`w-full bg-transparent border-none outline-none text-xs resize-none h-14 ${theme==='dark'?'text-white':'text-black'}`}
                            onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleGenerate(); } }}
                        />
                        <div className="flex justify-between items-center mt-1">
                            <button onClick={toggleListening} className={`p-1.5 rounded-full ${isListening ? 'text-red-500 bg-red-500/10 animate-pulse' : textMuted}`}>🎤</button>
                            <button onClick={handleGenerate} disabled={isGenerating || !prompt.trim()} className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded text-[10px] font-bold shadow-sm">Send 🚀</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* 💻 RIGHT SIDE: MAIN WORKSPACE */}
            <div className={`flex-1 flex flex-col relative min-w-0 ${theme==='dark'?'bg-[#1e1e1e]':'bg-white'}`}>
                
                {/* TOP TOOLBAR */}
                <div className={`h-12 border-b flex items-center justify-between px-3 shrink-0 overflow-x-auto ${bgHeader}`}>
                    <div className={`flex items-center rounded border p-0.5 shrink-0 ${theme==='dark'?'bg-[#1e1e1e] border-[#2b2b2b]':'bg-gray-100 border-gray-300'}`}>
                        <button onClick={() => setActiveTab('preview')} className={`flex items-center gap-1.5 px-3 py-1 rounded-sm text-[10px] font-bold transition-all ${activeTab === 'preview' ? (theme==='dark'?'bg-[#2b2b2b] text-white':'bg-white text-blue-600 shadow') : textMuted}`}>🖥️ Preview</button>
                        <button onClick={() => setActiveTab('code')} className={`flex items-center gap-1.5 px-3 py-1 rounded-sm text-[10px] font-bold transition-all ${activeTab === 'code' ? (theme==='dark'?'bg-[#2b2b2b] text-white':'bg-white text-blue-600 shadow') : textMuted}`}>📝 VS Code</button>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        {/* 🔥 NEW SAVE PROJECT BUTTON */}
                        <button onClick={saveProject} className="bg-indigo-600/10 text-indigo-500 border border-indigo-500/30 hover:bg-indigo-500 hover:text-white px-3 py-1.5 rounded text-[10px] font-bold transition">💾 Save</button>
                        <button onClick={() => setIsConsoleOpen(!isConsoleOpen)} className={`px-3 py-1.5 rounded text-[10px] font-bold border transition-all ${isConsoleOpen ? 'bg-gray-800 text-white' : `${textMuted} border-gray-300`}`}>_ Console</button>
                        <button onClick={handleDownloadZip} className={`border px-3 py-1.5 rounded text-[10px] font-bold transition ${theme==='dark'?'bg-[#1e1e1e] border-[#2b2b2b] text-gray-300 hover:bg-[#2b2b2b]':'bg-white border-gray-300 text-black hover:bg-gray-50'}`}>ZIP ⬇️</button>
                        <button onClick={() => setIsPublishModalOpen(true)} className="bg-blue-600 text-white px-4 py-1.5 rounded text-[10px] font-bold flex items-center gap-1 hover:bg-blue-500">Deploy 🌍</button>
                    </div>
                </div>

                {/* 📁 FILE TABS */}
                {activeTab === 'code' && Object.keys(generatedFiles).length > 0 && (
                    <div className={`flex border-b overflow-x-auto shrink-0 scrollbar-hide h-9 items-end ${bgSidebar}`}>
                        {Object.keys(generatedFiles).map(file => (
                            <button key={file} onClick={() => setActiveFile(file)} className={`flex items-center gap-1.5 px-4 py-1.5 text-[10px] font-mono border-t border-r border-l border-transparent rounded-t-md whitespace-nowrap transition-all ${activeFile === file ? (theme==='dark'?'bg-[#1e1e1e] text-blue-400 border-[#2b2b2b]':'bg-white text-blue-600 border-gray-200 shadow-sm') : `${textMuted} hover:opacity-70`}`}>
                                📄 {file}
                            </button>
                        ))}
                    </div>
                )}

                {/* 💻 MAIN SCREEN (Live Editor / Preview) */}
                <div className="flex-1 overflow-auto relative">
                    {activeTab === 'preview' ? (
                        <div className="w-full h-full bg-white relative">
                            <iframe title="Live View" srcDoc={previewHtml} className="w-full h-full border-none absolute inset-0" sandbox="allow-scripts allow-same-origin allow-forms allow-popups" />
                        </div>
                    ) : (
                        /* 🔥 MICROSOFT MONACO EDITOR (VS CODE) 🔥 */
                        <Editor
                            height="100%"
                            language={getLanguage(activeFile)}
                            theme={theme === 'dark' ? 'vs-dark' : 'light'}
                            value={generatedFiles[activeFile] || "// Awaiting generation..."}
                            onChange={(newValue) => handleCodeChange(activeFile, newValue)}
                            options={{ minimap: { enabled: false }, fontSize: 13, wordWrap: 'on', padding: { top: 16 } }}
                        />
                    )}
                </div>

                {/* 🖥️ BOTTOM TERMINAL CONSOLE */}
                {isConsoleOpen && (
                    <div className={`h-40 border-t shrink-0 flex flex-col z-20 ${bgSidebar}`}>
                        <div className={`h-7 border-b flex items-center justify-between px-3 text-[10px] uppercase tracking-widest font-bold ${bgHeader} ${textMuted}`}>
                            <div className="flex items-center gap-2">Output Console</div>
                            <button onClick={() => setIsConsoleOpen(false)} className="hover:text-red-500">X</button>
                        </div>
                        <div className={`flex-1 p-3 overflow-auto font-mono text-[11px] whitespace-pre-wrap leading-relaxed ${theme==='dark'?'text-gray-300':'text-gray-700'}`}>
                            {terminalOutput}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
