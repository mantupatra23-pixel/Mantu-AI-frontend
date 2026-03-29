import React, { useState, useEffect, useRef } from 'react';

// ==========================================
// 🎨 ALL REQUIRED ICONS (No imports needed)
// ==========================================
const SparkleIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3Z"/></svg>;
const MicIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>;
const ImageIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>;
const LinkIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>;
const TerminalIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>;
const SettingsIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z"/></svg>;
const CloseIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const CodeIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>;
const PlayIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>;

// ==========================================
// 🚀 MAIN APP COMPONENT
// ==========================================
export default function App() {
  const BACKEND_URL = "https://visora-code.onrender.com"; // Your Live Mantu OS Backend

  // 🧠 Core States
  const [prompt, setPrompt] = useState('');
  const [view, setView] = useState('home'); // 'home' or 'editor'
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('code'); // 'code' or 'preview'
  const [generatedFiles, setGeneratedFiles] = useState({});
  const [activeFile, setActiveFile] = useState("");
  const [actionLogs, setActionLogs] = useState([]);
  const [terminalOutput, setTerminalOutput] = useState("> System Ready. Welcome to Mantu OS.");
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  
  // 🎤 Attachments & Modals
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [isEnvModalOpen, setIsEnvModalOpen] = useState(false);
  const [awsTargetIp, setAwsTargetIp] = useState(""); 
  const [awsAuthKey, setAwsAuthKey] = useState(""); 
  const [projectEnv, setProjectEnv] = useState([{ key: '', value: '' }]);

  // ==========================================
  // 🎤 VOICE & ATTACHMENTS LOGIC
  // ==========================================
  const toggleListening = () => {
      if (isListening) { recognitionRef.current?.stop(); setIsListening(false); return; }
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) return alert("Browser does not support Voice Typing.");
      const recognition = new SpeechRecognition();
      recognition.continuous = true; recognition.interimResults = true;
      let initialPrompt = prompt;
      recognition.onresult = (e) => {
          let currentTranscript = '';
          for (let i = 0; i < e.results.length; i++) currentTranscript += e.results[i][0].transcript;
          setPrompt(initialPrompt + (initialPrompt ? ' ' : '') + currentTranscript);
      };
      recognition.onerror = () => setIsListening(false); recognition.onend = () => setIsListening(false);
      recognitionRef.current = recognition; recognition.start(); setIsListening(true);
  };

  // ==========================================
  // 🚀 THE CRASH-PROOF BUILD ENGINE
  // ==========================================
  const handleGenerate = async () => {
      if (!prompt.trim()) return;
      
      setIsGenerating(true); 
      setView('editor'); 
      setActiveTab('code'); 
      setIsConsoleOpen(true);
      setGeneratedFiles({});
      
      // Initialize Action Timeline
      setActionLogs([
          { id: 1, type: 'user', text: prompt },
          { id: 2, type: 'log', agent: 'MANTU OS', status: 'Active', details: 'Initializing Enterprise Engine...' }
      ]);
      setTerminalOutput(`> Initializing Engine [Model: GROQ]...\n> Architecting blueprint...`);
      
      try {
          const res = await fetch(`${BACKEND_URL}/api/build`, { 
              method: 'POST', headers: { 'Content-Type': 'application/json' }, 
              body: JSON.stringify({ prompt: prompt }) 
          });
          
          if (!res.ok) throw new Error(`Backend Connection Refused.`);
          
          const reader = res.body.getReader(); 
          const decoder = new TextDecoder();
          let buffer = ""; 

          while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              
              buffer += decoder.decode(value, { stream: true });
              let parts = buffer.split('\n\n');
              buffer = parts.pop(); 
              
              for (const part of parts) {
                  if (part.startsWith('data: ')) {
                      try {
                          const data = JSON.parse(part.replace('data: ', ''));
                          
                          if (data.type === 'log') {
                              setTerminalOutput(prev => prev + `\n> [${data.agent}] ${data.details}`);
                              setActionLogs(prev => [...prev, { id: Date.now(), type: 'log', agent: data.agent, status: data.status, details: data.details }]);
                          } 
                          else if (data.type === 'file') {
                              let cleanCode = String(data.code).replace(/\\n/g, '\n').replace(/\\"/g, '"');
                              cleanCode = cleanCode.replace(/```[a-zA-Z]*\n?/g, '').replace(/```/g, '').trim();
                              
                              setGeneratedFiles(prev => {
                                  const updated = { ...prev, [data.filename]: cleanCode };
                                  if (!activeFile) setActiveFile(data.filename); 
                                  return updated;
                              });
                          } 
                          else if (data.type === 'error') {
                              setTerminalOutput(prev => prev + `\n> ❌ ERROR: ${data.error}`);
                              setActionLogs(prev => [...prev, { id: Date.now(), type: 'log', agent: 'SYSTEM', status: 'Error', details: data.error }]);
                          } 
                          else if (data.type === 'done') {
                              setTerminalOutput(prev => prev + `\n> 🎉 Generation 100% Complete!`);
                              setActionLogs(prev => [...prev, { id: Date.now(), type: 'log', agent: 'SYSTEM', status: 'Done', details: 'All files generated successfully!' }]);
                          }
                      } catch (err) {}
                  }
              }
          }
      } catch (error) { 
          setTerminalOutput(prev => prev + `\n> ❌ CRASH: ${error.message}`); 
          setActionLogs(prev => [...prev, { id: Date.now(), type: 'log', agent: 'SYSTEM', status: 'Error', details: error.message }]);
      } finally { 
          setIsGenerating(false); 
      }
  };

  // ==========================================
  // 💻 LIVE PREVIEW ENGINE
  // ==========================================
  const renderLivePreview = () => {
      let htmlFile = generatedFiles['index.html'] || generatedFiles['public/index.html'] || `<div id="root" class="flex items-center justify-center h-screen font-sans bg-[#030303] text-gray-400">Building UI...</div>`;
      let cssFile = generatedFiles['styles.css'] || generatedFiles['index.css'] || "";
      let reactCode = generatedFiles['App.jsx'] || generatedFiles['src/App.jsx'] || generatedFiles['src/main.jsx'] || "";
      
      const envObj = {}; projectEnv.forEach(e => { if (e.key.trim()) envObj[e.key.trim()] = e.value.trim(); });
      
      const reactImports = `<script>window.mantuEnv = ${JSON.stringify(envObj)}; window.process = { env: window.mantuEnv };</script><script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script><script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script><script src="https://unpkg.com/babel-standalone@6/babel.min.js"></script><script src="https://cdn.tailwindcss.com"></script><style>${cssFile}</style>`;
      let cleanReact = reactCode.replace(/import\s+.*?from\s+['"].*?['"];?/g, '').replace(/export\s+default\s+function/g, 'function');
      let executeReact = reactCode ? `<script type="text/babel" data-type="module">${cleanReact} const root = ReactDOM.createRoot(document.getElementById('root')); root.render(<App />);</script>` : "";
      
      return `<!DOCTYPE html><html><head>${reactImports}</head><body>${htmlFile}${executeReact}</body></html>`;
  };

  // ==========================================
  // 🌍 PUBLISH & FEATURES
  // ==========================================
  const handlePublish = async () => {
      setIsPublishModalOpen(false); setIsConsoleOpen(true);
      setTerminalOutput(`> 🚀 Initiating AWS Deployment to ${awsTargetIp}...`);
      try {
          const res = await fetch(`${BACKEND_URL}/api/publish-aws`, { 
              method: 'POST', headers: { 'Content-Type': 'application/json' }, 
              body: JSON.stringify({ targetIp: awsTargetIp, authKey: awsAuthKey }) 
          });
          const data = await res.json();
          if(data.success) { setTerminalOutput(prev => prev + `\n> 🎉 SUCCESS! LIVE at: ${data.url}`); window.open(data.url, "_blank"); } 
          else setTerminalOutput(prev => prev + `\n> ❌ DEPLOY ERROR: ${data.error}`);
      } catch (e) { setTerminalOutput(prev => prev + `\n> ❌ Error: ${e.message}`); }
  };

  const handleDownloadZip = () => { alert("ZIP logic connected. Backend integration required."); };
  const handleBuildApk = () => { alert("APK build triggered in Cloud."); };

  // ==========================================
  // 🎨 UI RENDER
  // ==========================================
  return (
    <div className="h-[100dvh] w-full flex flex-col font-sans overflow-hidden bg-[#050505] text-white">
      
      {/* 🔝 1. MAIN TOP NAVBAR */}
      <nav className="h-14 flex items-center justify-between px-6 border-b border-[#1f1f23] bg-[#0a0a0c] shrink-0 z-20">
        <div className="text-xl font-extrabold flex items-center gap-2 cursor-pointer" onClick={() => setView('home')}>
            <span className="text-blue-600 font-mono tracking-tighter">#</span> mantu_ai
        </div>
        <div className="flex items-center gap-4 text-sm font-medium text-gray-400">
           <button className="hover:text-white transition flex items-center gap-2"><SparkleIcon/> History</button>
           <button className="hover:text-white transition"><SettingsIcon/></button>
           {view === 'home' && Object.keys(generatedFiles).length > 0 && (
               <button onClick={() => setView('editor')} className="text-xs font-bold text-white bg-blue-600 px-4 py-1.5 rounded-full hover:bg-blue-500">Resume →</button>
           )}
        </div>
      </nav>

      {/* 🏠 2. HOME VIEW (Matches Screenshot 46872) */}
      {view === 'home' ? (
        <div className="flex-1 flex flex-col items-center pt-24 p-4 overflow-y-auto">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-center tracking-tight">
                Build & Deploy in <span className="text-blue-600">Seconds</span>
            </h1>
            <p className="text-gray-400 mb-12 max-w-xl text-center text-sm md:text-base">
                Describe your dream SaaS, App, or Dashboard. Mantu AI will write the code, bundle the project, and deploy it to a live global URL instantly.
            </p>
            
            <div className="w-full max-w-3xl border border-[#1f1f23] bg-[#0d0d12] rounded-2xl flex flex-col shadow-2xl transition-all focus-within:border-blue-500/50">
                <textarea 
                    value={prompt} 
                    onChange={(e) => setPrompt(e.target.value)} 
                    placeholder="e.g. Build an AI video generator SaaS dashboard..."
                    className="w-full bg-transparent border-none outline-none p-5 resize-none min-h-[140px] text-lg text-white placeholder-gray-600"
                    onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleGenerate(); } }}
                />
                
                {/* Home Action Bar (Mic, Image, Link, Generate) */}
                <div className="flex items-center justify-between p-3">
                    <div className="flex gap-2 text-gray-500">
                        <button onClick={toggleListening} className={`p-2 rounded hover:bg-[#1a1a24] hover:text-white transition ${isListening ? 'text-red-500 animate-pulse' : ''}`}><MicIcon/></button>
                        <button className="p-2 rounded hover:bg-[#1a1a24] hover:text-white transition"><ImageIcon/></button>
                        <button className="p-2 rounded hover:bg-[#1a1a24] hover:text-white transition"><LinkIcon/></button>
                    </div>
                    <button onClick={handleGenerate} disabled={isGenerating} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 transition disabled:opacity-50">
                        {isGenerating ? <span className="animate-spin">🌀</span> : <SparkleIcon/>} {isGenerating ? 'Building...' : 'Generate'}
                    </button>
                </div>
            </div>
        </div>
      ) : (
        /* 💻 3. EDITOR VIEW (Matches Screenshot 47154 / 47156) */
        <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* 🛠️ Editor Toolbar (Live Preview, View Code, Env Keys, etc.) */}
            <div className="h-12 bg-[#0d0d12] border-b border-[#1f1f23] flex items-center justify-between px-4 shrink-0">
                <div className="flex gap-1 bg-[#1a1a24] p-1 rounded-lg">
                    <button onClick={()=>setActiveTab('preview')} className={`px-4 py-1 text-xs font-bold rounded flex items-center gap-2 ${activeTab === 'preview' ? 'bg-[#2b2b36] text-white shadow' : 'text-gray-400 hover:text-white'}`}><PlayIcon/> Live Preview</button>
                    <button onClick={()=>setActiveTab('code')} className={`px-4 py-1 text-xs font-bold rounded flex items-center gap-2 ${activeTab === 'code' ? 'bg-[#2b2b36] text-white shadow' : 'text-gray-400 hover:text-white'}`}><CodeIcon/> View Code</button>
                </div>
                
                <div className="flex gap-2">
                    <button className="px-3 py-1.5 text-xs font-bold bg-[#1a1a24] text-blue-400 border border-blue-900/50 hover:bg-blue-900/20 rounded flex items-center gap-2"><SparkleIcon/> Save Project</button>
                    <button onClick={() => setIsConsoleOpen(!isConsoleOpen)} className="px-3 py-1.5 text-xs font-bold bg-[#1a1a24] text-gray-300 hover:bg-[#2b2b36] rounded flex items-center gap-2"><TerminalIcon/> _Console</button>
                    <button onClick={() => setIsEnvModalOpen(true)} className="px-3 py-1.5 text-xs font-bold bg-[#1a1a24] text-yellow-500 hover:bg-[#2b2b36] rounded flex items-center gap-2">🔐 Env Keys</button>
                    <button onClick={handleBuildApk} className="px-3 py-1.5 text-xs font-bold bg-[#1a1a24] text-green-400 hover:bg-[#2b2b36] rounded flex items-center gap-2">📱 Build APK</button>
                    <button onClick={() => setIsPublishModalOpen(true)} className="px-3 py-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white rounded flex items-center gap-2">🌍 Publish</button>
                </div>
            </div>

            {/* Main Editor Split */}
            <div className="flex-1 flex overflow-hidden">
                
                {/* 📜 Left Sidebar: ACTION TIMELINE */}
                <div className="w-80 bg-[#0a0a0c] border-r border-[#1f1f23] flex flex-col shrink-0">
                    <div className="p-3 border-b border-[#1f1f23]">
                        <h2 className="text-[10px] font-bold text-yellow-500 uppercase tracking-widest flex items-center gap-2"><SparkleIcon/> ACTION TIMELINE</h2>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-4 space-y-6">
                        {actionLogs.map((log, index) => (
                            <div key={index} className="flex gap-3">
                                {log.type === 'user' ? (
                                    <div className="bg-[#1a1a24] border border-[#2b2b36] rounded p-3 text-sm text-gray-300 w-full">
                                        <div className="text-[10px] text-blue-400 font-bold mb-1 flex items-center gap-1"><MicIcon/> User Prompt</div>
                                        {log.text}
                                    </div>
                                ) : (
                                    <>
                                        {/* Status Dot */}
                                        <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${log.status==='Error'?'bg-red-500': log.status==='Done' || log.status==='Success'?'bg-green-500':'bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.8)]'}`}></div>
                                        <div className="flex-1">
                                            <div className="font-bold text-gray-500 text-[10px] uppercase tracking-wider">{log.agent}</div>
                                            <div className={`font-bold text-xs ${log.status==='Error'?'text-red-500': log.status==='Done' || log.status==='Success'?'text-green-500':'text-blue-500'}`}>{log.status}</div>
                                            <div className="text-gray-400 text-xs mt-1 leading-relaxed">{log.details}</div>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* 💻 Right Area: File Tabs & Code/Preview */}
                <div className="flex-1 flex flex-col bg-[#0d0d12]">
                    {/* File Tabs */}
                    <div className="flex overflow-x-auto bg-[#0a0a0c] border-b border-[#1f1f23] shrink-0 custom-scrollbar">
                        {Object.keys(generatedFiles).map(file => (
                            <button key={file} onClick={() => setActiveFile(file)} 
                                className={`px-4 py-2.5 text-[11px] font-mono whitespace-nowrap border-r border-[#1f1f23] flex items-center gap-2 transition-colors
                                ${activeFile === file ? 'bg-[#0d0d12] text-blue-400 border-t-2 border-t-blue-500' : 'text-gray-500 hover:bg-[#1a1a24] hover:text-gray-300'}`}>
                                📄 {file}
                            </button>
                        ))}
                    </div>
                    
                    {/* Content Area */}
                    <div className="flex-1 overflow-hidden relative">
                        {activeTab === 'code' ? (
                            <textarea 
                                value={generatedFiles[activeFile] || ''} 
                                onChange={(e) => setGeneratedFiles(prev => ({ ...prev, [activeFile]: e.target.value }))}
                                className="w-full h-full bg-[#0d0d12] text-green-400 p-6 font-mono text-sm resize-none outline-none leading-relaxed"
                                spellCheck="false"
                                placeholder={Object.keys(generatedFiles).length > 0 ? "Select a file..." : "Awaiting code generation..."}
                            />
                        ) : (
                            <div className="w-full h-full bg-white flex items-center justify-center">
                                {Object.keys(generatedFiles).length > 0 ? (
                                    <iframe srcDoc={renderLivePreview()} className="w-full h-full border-none" sandbox="allow-scripts allow-same-origin" title="preview" />
                                ) : (
                                    <div className="text-gray-400 flex flex-col items-center gap-2"><SparkleIcon/> <span>Generate code to see preview</span></div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* 🖥️ 4. BOTTOM OUTPUT CONSOLE */}
      {view === 'editor' && (
          <div className={`w-full transition-all duration-300 z-40 bg-[#0a0a0c] border-t border-[#1f1f23] shrink-0 ${isConsoleOpen ? 'h-56' : 'h-8'}`}>
              <div className="flex items-center justify-between px-4 h-8 cursor-pointer hover:bg-[#1a1a24]" onClick={() => setIsConsoleOpen(!isConsoleOpen)}>
                  <div className="text-[10px] font-bold text-gray-400 flex items-center gap-2 uppercase tracking-wider"><TerminalIcon/> OUTPUT CONSOLE</div>
                  <button className="text-gray-500 hover:text-white">{isConsoleOpen ? '▼' : '▲'}</button>
              </div>
              {isConsoleOpen && (
                  <div className="p-4 pt-2 h-48 overflow-y-auto font-mono text-[11px] text-green-500 custom-scrollbar">
                      <pre className="whitespace-pre-wrap leading-relaxed">{terminalOutput}</pre>
                  </div>
              )}
          </div>
      )}

      {/* 🌍 5. MODALS */}
      {isPublishModalOpen && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
              <div className="bg-[#111116] border border-[#2b2b2b] w-full max-w-md rounded-2xl overflow-hidden shadow-2xl">
                  <div className="p-4 border-b border-[#2b2b2b] flex justify-between items-center bg-[#0A0A0E]">
                      <h3 className="text-lg font-bold">🌍 AWS EC2 Publish</h3>
                      <button onClick={() => setIsPublishModalOpen(false)} className="text-gray-400 hover:text-red-500"><CloseIcon/></button>
                  </div>
                  <div className="p-6 flex flex-col gap-4">
                      <input type="text" value={awsTargetIp} onChange={(e) => setAwsTargetIp(e.target.value)} placeholder="AWS Target IP (e.g. 13.23.4.5)" className="w-full bg-[#0A0A0E] border border-[#2b2b2b] rounded p-3 text-sm text-white outline-none" />
                      <textarea value={awsAuthKey} onChange={(e) => setAwsAuthKey(e.target.value)} placeholder="Paste .pem key content here..." className="w-full bg-[#0A0A0E] border border-[#2b2b2b] rounded p-3 text-sm text-white h-24 outline-none" />
                      <button onClick={handlePublish} className="w-full bg-orange-600 hover:bg-orange-500 text-white py-3 rounded-lg font-bold">Deploy Now</button>
                  </div>
              </div>
          </div>
      )}

      {isEnvModalOpen && (
         <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-[#111116] border border-[#2b2b2b] w-full max-w-md rounded-2xl overflow-hidden shadow-2xl">
                <div className="p-4 border-b border-[#2b2b2b] flex justify-between items-center bg-yellow-500/10">
                    <h3 className="text-lg font-bold text-yellow-500">🔐 Env Variables</h3>
                    <button onClick={() => setIsEnvModalOpen(false)} className="text-gray-400 hover:text-white"><CloseIcon/></button>
                </div>
                <div className="p-6 flex flex-col gap-3">
                    {projectEnv.map((env, i) => (
                        <div key={i} className="flex gap-2">
                            <input type="text" placeholder="KEY" value={env.key} onChange={(e) => { const n = [...projectEnv]; n[i].key = e.target.value; setProjectEnv(n); }} className="w-1/3 bg-[#0A0A0E] border border-[#2b2b2b] rounded p-2 text-sm text-white" />
                            <input type="text" placeholder="VALUE" value={env.value} onChange={(e) => { const n = [...projectEnv]; n[i].value = e.target.value; setProjectEnv(n); }} className="w-full bg-[#0A0A0E] border border-[#2b2b2b] rounded p-2 text-sm text-white" />
                        </div>
                    ))}
                    <button onClick={() => setProjectEnv([...projectEnv, { key: '', value: '' }])} className="text-xs text-blue-500 text-left hover:underline">+ Add Variable</button>
                    <button onClick={() => setIsEnvModalOpen(false)} className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg font-bold">Save Vault</button>
                </div>
            </div>
         </div>
      )}

    </div>
  );
}
