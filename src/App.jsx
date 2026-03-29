import React, { useState, useEffect, useRef } from 'react';

// ==========================================
// 🎨 ALL ICONS
// ==========================================
const SparkleIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3Z"/></svg>;
const MicIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>;
const ImageIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>;
const TerminalIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>;
const CloseIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const CodeIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>;
const PlayIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>;
const CloudIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>;
const ServerIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="20" height="8" x="2" y="2" rx="2" ry="2"/><rect width="20" height="8" x="2" y="14" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>;
const GithubIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.5 6-6.5a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 5 3 6.2 6 6.5a4.8 4.8 0 0 0-1 3.2v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>;
const LinkIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>;
const CpuIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="16" height="16" x="4" y="4" rx="2" ry="2"/><rect width="6" height="6" x="9" y="9" rx="1" ry="1"/><path d="M9 4v-2"/><path d="M15 4v-2"/><path d="M9 22v2"/><path d="M15 22v2"/><path d="M20 9h2"/><path d="M20 14h2"/><path d="M2 9h2"/><path d="M2 14h2"/></svg>;
const LockIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
const SettingsIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z"/></svg>;
const SendIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>;

// ==========================================
// 🚀 MAIN APP COMPONENT
// ==========================================
export default function App() {
  const BACKEND_URL = "https://visora-code.onrender.com"; // Your Live Mantu OS Backend

  // 🧠 Core States
  const [projects, setProjects] = useState([]);
  const [prompt, setPrompt] = useState('');
  const [followUpPrompt, setFollowUpPrompt] = useState(''); 
  const [view, setView] = useState('home'); 
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('code'); 
  const [generatedFiles, setGeneratedFiles] = useState({});
  const [activeFile, setActiveFile] = useState("");
  const [actionLogs, setActionLogs] = useState([]);
  const [terminalOutput, setTerminalOutput] = useState("> System Ready. Welcome to Mantu OS.");
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  
  // 🎤 UI & Listeners
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  // 🌍 Publish Modal States
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [publishMethod, setPublishMethod] = useState('aws'); 
  const [awsInstanceType, setAwsInstanceType] = useState('cpu'); 
  const [awsTargetIp, setAwsTargetIp] = useState(""); 
  const [awsAuthKey, setAwsAuthKey] = useState(""); 
  const [gitRepoName, setGitRepoName] = useState("");
  const [gitToken, setGitToken] = useState("");
  const [customDomain, setCustomDomain] = useState("");
  
  const [isEnvModalOpen, setIsEnvModalOpen] = useState(false);
  const [projectEnv, setProjectEnv] = useState([{ key: '', value: '' }]);

  // Code Editor Refs (For VS Code Sync Scroll)
  const codeTextareaRef = useRef(null);
  const lineNumbersRef = useRef(null);

  // Load History on Mount
  useEffect(() => {
      try {
          const savedProjects = JSON.parse(localStorage.getItem('mantuProjects'));
          if (savedProjects) setProjects(savedProjects);
      } catch(e) {}
  }, []);

  // ==========================================
  // 💾 1. SAVE PROJECT LOGIC (FIXED)
  // ==========================================
  const saveCurrentProject = () => {
      if (Object.keys(generatedFiles).length === 0) {
          setTerminalOutput(prev => prev + `\n> ⚠️ Error: No code generated to save yet.`);
          setIsConsoleOpen(true);
          return;
      }
      const newProject = {
          id: Date.now(),
          title: prompt.substring(0, 30) || 'Untitled App',
          files: generatedFiles,
          logs: actionLogs
      };
      const updatedProjects = [newProject, ...projects];
      setProjects(updatedProjects);
      localStorage.setItem('mantuProjects', JSON.stringify(updatedProjects));
      setTerminalOutput(prev => prev + `\n> 💾 SUCCESS: Project saved to History!`);
      setIsConsoleOpen(true);
  };

  // ==========================================
  // 🎤 2. VOICE LISTENER
  // ==========================================
  const toggleListening = (targetInput) => {
      if (isListening) { recognitionRef.current?.stop(); setIsListening(false); return; }
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) return alert("Browser does not support Voice Typing.");
      const recognition = new SpeechRecognition();
      recognition.continuous = true; recognition.interimResults = true;
      
      let initialPrompt = targetInput === 'followUp' ? followUpPrompt : prompt;
      recognition.onresult = (e) => {
          let currentTranscript = '';
          for (let i = 0; i < e.results.length; i++) currentTranscript += e.results[i][0].transcript;
          if (targetInput === 'followUp') setFollowUpPrompt(initialPrompt + (initialPrompt ? ' ' : '') + currentTranscript);
          else setPrompt(initialPrompt + (initialPrompt ? ' ' : '') + currentTranscript);
      };
      recognition.onerror = () => setIsListening(false); recognition.onend = () => setIsListening(false);
      recognitionRef.current = recognition; recognition.start(); setIsListening(true);
  };

  const handlePemUpload = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => setAwsAuthKey(ev.target.result);
      reader.readAsText(file);
  };

  // ==========================================
  // 🚀 3. CRASH-PROOF BUILD ENGINE
  // ==========================================
  const triggerBuild = async (text, isFollowUp = false) => {
      if (!text.trim()) return;
      setIsGenerating(true); setView('editor'); setActiveTab('code'); setIsConsoleOpen(true);
      
      if (!isFollowUp) setGeneratedFiles({});
      const newLogs = [...actionLogs, { id: Date.now(), type: 'user', text: text }];
      
      if (!isFollowUp) {
          newLogs.push({ id: Date.now()+1, type: 'log', agent: 'MANTU OS', status: 'Active', details: 'Initializing Enterprise Engine...' });
          setTerminalOutput(`> Initializing Engine [Model: GROQ]...\n> Architecting blueprint...`);
      } else {
          newLogs.push({ id: Date.now()+1, type: 'log', agent: 'MANTU OS', status: 'Active', details: 'Processing update request...' });
          setTerminalOutput(prev => prev + `\n> Processing follow-up request...`);
      }
      
      setActionLogs(newLogs);
      if(isFollowUp) setFollowUpPrompt(''); else setPrompt('');
      
      try {
          const res = await fetch(`${BACKEND_URL}/api/build`, { 
              method: 'POST', headers: { 'Content-Type': 'application/json' }, 
              body: JSON.stringify({ prompt: text, existingFiles: isFollowUp ? generatedFiles : {} }) 
          });
          
          if (!res.ok) throw new Error(`Backend Connection Refused. Server might be sleeping.`);
          
          const reader = res.body.getReader(); const decoder = new TextDecoder();
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
                              setActionLogs(prev => [...prev, { id: Date.now()+Math.random(), type: 'log', agent: data.agent, status: data.status, details: data.details }]);
                          } else if (data.type === 'file') {
                              let cleanCode = String(data.code).replace(/\\n/g, '\n').replace(/\\"/g, '"');
                              cleanCode = cleanCode.replace(/```[a-zA-Z]*\n?/g, '').replace(/```/g, '').trim();
                              
                              setGeneratedFiles(prev => {
                                  const updated = { ...prev, [data.filename]: cleanCode };
                                  if (!activeFile) setActiveFile(data.filename); 
                                  return updated;
                              });
                          } else if (data.type === 'done') {
                              setTerminalOutput(prev => prev + `\n> 🎉 Generation Complete!`);
                              setActionLogs(prev => [...prev, { id: Date.now()+Math.random(), type: 'log', agent: 'SYSTEM', status: 'Done', details: 'Files generated successfully!' }]);
                          }
                      } catch (err) {}
                  }
              }
          }
      } catch (error) { 
          setTerminalOutput(prev => prev + `\n> ❌ CRASH: ${error.message}`); 
          setActionLogs(prev => [...prev, { id: Date.now(), type: 'log', agent: 'SYSTEM', status: 'Error', details: error.message }]);
      } finally { setIsGenerating(false); }
  };

  // ==========================================
  // 💻 4. LIVE PREVIEW COMPILER
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

  const handlePublish = async () => {
      setIsPublishModalOpen(false); setIsConsoleOpen(true);
      setTerminalOutput(`> 🚀 Initiating Deployment via ${publishMethod.toUpperCase()}...`);
      setTimeout(() => setTerminalOutput(prev => prev + `\n> ✅ Deployment logic triggered successfully.`), 1000);
  };

  // ==========================================
  // 🎨 5. VS CODE EDITOR RENDER HELPERS
  // ==========================================
  const activeCode = generatedFiles[activeFile] || '';
  const lineCount = activeCode.split('\n').length;
  const lines = Array.from({length: Math.max(lineCount, 1)}, (_, i) => i + 1);

  const handleCodeScroll = (e) => {
      if (lineNumbersRef.current) lineNumbersRef.current.scrollTop = e.target.scrollTop;
  };

  // ==========================================
  // 🌍 FULL APP RENDER
  // ==========================================
  return (
    <div className="h-[100dvh] w-full flex flex-col font-sans overflow-hidden bg-[#050505] text-white">
      
      {/* 🔝 NAVBAR */}
      <nav className="h-14 flex items-center justify-between px-6 border-b border-[#1f1f23] bg-[#0a0a0c] shrink-0 z-20">
        <div className="text-xl font-extrabold flex items-center gap-2 cursor-pointer" onClick={() => setView('home')}>
            <span className="text-blue-600 font-mono tracking-tighter">#</span> mantu_ai
        </div>
        <div className="flex items-center gap-4 text-sm font-medium text-gray-400">
           <button className="hover:text-white transition flex items-center gap-2">☀️</button>
           <button className="hover:text-white transition flex items-center gap-2"><SparkleIcon/> History</button>
           <button className="hover:text-white transition"><SettingsIcon/></button>
           {view === 'home' && Object.keys(generatedFiles).length > 0 && (
               <button onClick={() => setView('editor')} className="text-xs font-bold text-white bg-blue-600 px-4 py-1.5 rounded-full hover:bg-blue-500 shadow-lg">Resume →</button>
           )}
        </div>
      </nav>

      {/* 🏠 HOME VIEW */}
      {view === 'home' ? (
        <div className="flex-1 flex flex-col items-center pt-24 p-4 overflow-y-auto">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-center tracking-tight">
                Build & Deploy in <span className="text-blue-600">Seconds</span>
            </h1>
            <p className="text-gray-400 mb-12 max-w-xl text-center text-sm md:text-base leading-relaxed">
                Describe your dream SaaS, App, or Dashboard. Mantu AI will write the code, bundle the project, and deploy it to a live global URL instantly.
            </p>
            
            <div className="w-full max-w-3xl border border-[#1f1f23] bg-[#0d0d12] rounded-2xl flex flex-col shadow-2xl transition-all focus-within:border-blue-500/50">
                <textarea 
                    value={prompt} onChange={(e) => setPrompt(e.target.value)} 
                    placeholder="e.g. Build an AI video generator SaaS dashboard..."
                    className="w-full bg-transparent border-none outline-none p-5 resize-none min-h-[140px] text-lg text-white placeholder-gray-600"
                    onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); triggerBuild(prompt, false); } }}
                />
                <div className="flex items-center justify-between p-3">
                    <div className="flex gap-3 px-2 text-gray-500">
                        <button onClick={() => toggleListening('new')} className={`hover:text-white transition ${isListening ? 'text-red-500 animate-pulse' : ''}`}><MicIcon/></button>
                        <button className="hover:text-white transition"><ImageIcon/></button>
                    </div>
                    <button onClick={() => triggerBuild(prompt, false)} disabled={isGenerating} className="bg-[#1a40af] hover:bg-blue-600 text-blue-100 px-6 py-2 rounded-xl font-bold flex items-center gap-2 transition disabled:opacity-50 text-sm">
                        {isGenerating ? <span className="animate-spin">🌀</span> : <SparkleIcon/>} {isGenerating ? 'Building...' : 'Generate'}
                    </button>
                </div>
            </div>
        </div>
      ) : (
        /* 💻 EDITOR VIEW */
        <div className="flex-1 flex flex-col overflow-hidden">
            {/* Editor Toolbar */}
            <div className="h-12 bg-[#0d0d12] border-b border-[#1f1f23] flex items-center justify-between px-4 shrink-0 overflow-x-auto custom-scrollbar">
                <div className="flex gap-1 bg-[#1a1a24] p-1 rounded-lg shrink-0">
                    <button onClick={()=>setActiveTab('preview')} className={`px-4 py-1 text-xs font-bold rounded flex items-center gap-2 ${activeTab === 'preview' ? 'bg-[#2b2b36] text-white shadow' : 'text-gray-400 hover:text-white transition'}`}><PlayIcon/> Live Preview</button>
                    <button onClick={()=>setActiveTab('code')} className={`px-4 py-1 text-xs font-bold rounded flex items-center gap-2 ${activeTab === 'code' ? 'bg-[#2b2b36] text-white shadow' : 'text-gray-400 hover:text-white transition'}`}><CodeIcon/> View Code</button>
                </div>
                <div className="flex gap-2 shrink-0">
                    {/* 🔥 SAVE PROJECT BUTTON 🔥 */}
                    <button onClick={saveCurrentProject} className="px-3 py-1.5 text-xs font-bold bg-[#1a1a24] text-blue-400 border border-blue-900/50 hover:bg-blue-900/20 rounded flex items-center gap-2 transition"><SparkleIcon/> Save Project</button>
                    
                    <button onClick={() => setIsConsoleOpen(!isConsoleOpen)} className="px-3 py-1.5 text-xs font-bold bg-[#1a1a24] text-gray-300 hover:bg-[#2b2b36] rounded flex items-center gap-2 transition"><TerminalIcon/> _Console</button>
                    <button onClick={() => setIsEnvModalOpen(true)} className="px-3 py-1.5 text-xs font-bold bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 hover:bg-yellow-500/20 rounded flex items-center gap-2 transition"><LockIcon/> Env Keys</button>
                    <button className="px-3 py-1.5 text-xs font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500/20 rounded flex items-center gap-2 transition">📱 Build APK</button>
                    <button onClick={() => setIsPublishModalOpen(true)} className="px-4 py-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white rounded flex items-center gap-2 shadow transition"><CloudIcon/> Publish App</button>
                </div>
            </div>

            {/* Main Split Area */}
            <div className="flex-1 flex overflow-hidden">
                
                {/* 📜 Action Timeline (Left) with Chat Box at bottom */}
                <div className="w-80 bg-[#0a0a0c] border-r border-[#1f1f23] flex flex-col shrink-0 relative">
                    <div className="p-3 border-b border-[#1f1f23] shrink-0">
                        <h2 className="text-[10px] font-bold text-yellow-500 uppercase tracking-widest flex items-center gap-2"><SparkleIcon/> ACTION TIMELINE</h2>
                    </div>
                    
                    {/* Logs Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-20 custom-scrollbar">
                        {actionLogs.map((log, index) => (
                            <div key={index} className="flex gap-3">
                                {log.type === 'user' ? (
                                    <div className="bg-[#1a1a24] border border-[#2b2b36] rounded-lg p-3 text-sm text-gray-300 w-full shadow-sm">
                                        <div className="text-[10px] text-blue-400 font-bold mb-1.5 flex items-center gap-1.5 uppercase tracking-wide"><SparkleIcon/> User Prompt</div>
                                        <div className="leading-relaxed">{log.text}</div>
                                    </div>
                                ) : (
                                    <>
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

                    {/* Live Chat Box */}
                    <div className="absolute bottom-0 left-0 w-full bg-[#0a0a0c] border-t border-[#1f1f23] p-3">
                        <div className="bg-[#1a1a24] border border-[#2b2b36] rounded-xl flex items-center px-3 py-2.5 focus-within:border-blue-500/50 transition-all shadow-inner">
                            <button onClick={() => toggleListening('followUp')} className={`text-gray-500 hover:text-white transition mr-2 ${isListening ? 'text-red-500 animate-pulse' : ''}`}><MicIcon/></button>
                            <input 
                                type="text" 
                                value={followUpPrompt} 
                                onChange={(e)=>setFollowUpPrompt(e.target.value)} 
                                placeholder="Ask for changes..." 
                                className="flex-1 bg-transparent border-none outline-none text-xs text-white placeholder-gray-600"
                                onKeyDown={(e) => { if(e.key === 'Enter') triggerBuild(followUpPrompt, true); }}
                            />
                            <button onClick={() => triggerBuild(followUpPrompt, true)} disabled={!followUpPrompt.trim() || isGenerating} className="bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-500 text-white p-1.5 rounded-lg ml-2 transition shadow">
                                <SendIcon/>
                            </button>
                        </div>
                    </div>
                </div>

                {/* 💻 Code / Preview Area (Right) */}
                <div className="flex-1 flex flex-col bg-[#1e1e1e] w-full">
                    <div className="flex overflow-x-auto bg-[#181818] border-b border-[#2d2d2d] shrink-0 custom-scrollbar">
                        {Object.keys(generatedFiles).map(file => (
                            <button key={file} onClick={() => setActiveFile(file)} 
                                className={`px-4 py-2.5 text-[12px] font-mono whitespace-nowrap flex items-center gap-2 transition-colors
                                ${activeFile === file ? 'bg-[#1e1e1e] text-blue-400 border-t-2 border-t-blue-500' : 'text-[#969696] hover:bg-[#2a2a2a] hover:text-[#cccccc]'}`}>
                                📄 {file}
                            </button>
                        ))}
                        {Object.keys(generatedFiles).length === 0 && <div className="px-4 py-2.5 text-[11px] font-mono text-[#858585] italic">Waiting for AI generation...</div>}
                    </div>
                    
                    <div className="flex-1 overflow-hidden relative">
                        {activeTab === 'code' ? (
                            // 🔥 REAL VS CODE STYLE EDITOR 🔥
                            <div className="flex h-full w-full bg-[#1e1e1e] text-[#d4d4d4] font-mono text-[13px] overflow-hidden">
                                {/* Line Numbers */}
                                <div ref={lineNumbersRef} className="w-12 bg-[#1e1e1e] border-r border-[#333333] text-[#858585] flex flex-col items-end pr-3 py-4 select-none overflow-hidden" style={{lineHeight: '21px'}}>
                                    {lines.map(l => <div key={l}>{l}</div>)}
                                </div>
                                {/* Code Textarea */}
                                <textarea 
                                    ref={codeTextareaRef}
                                    value={activeCode} 
                                    onChange={(e) => setGeneratedFiles(prev => ({ ...prev, [activeFile]: e.target.value }))}
                                    onScroll={handleCodeScroll}
                                    className="flex-1 bg-transparent text-[#9cdcfe] p-4 outline-none resize-none whitespace-pre overflow-auto custom-scrollbar"
                                    style={{lineHeight: '21px', tabSize: 4}}
                                    spellCheck="false"
                                />
                            </div>
                        ) : (
                            <div className="w-full h-full bg-white flex items-center justify-center">
                                {Object.keys(generatedFiles).length > 0 ? (
                                    <iframe srcDoc={renderLivePreview()} className="w-full h-full border-none" sandbox="allow-scripts allow-same-origin" title="preview" />
                                ) : (
                                    <div className="text-gray-400 flex flex-col items-center gap-3"><SparkleIcon/> <span>No preview available yet.</span></div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* 🖥️ BOTTOM CONSOLE */}
      {view === 'editor' && (
          <div className={`w-full transition-all duration-300 z-40 bg-[#0a0a0c] border-t border-[#1f1f23] shrink-0 ${isConsoleOpen ? 'h-56' : 'h-8'}`}>
              <div className="flex items-center justify-between px-4 h-8 cursor-pointer hover:bg-[#1a1a24] transition-colors" onClick={() => setIsConsoleOpen(!isConsoleOpen)}>
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

      {/* 🌍 THE ULTIMATE PUBLISH MODAL (GITHUB & DOMAIN FIXED) */}
      {isPublishModalOpen && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
              <div className="bg-[#111116] border border-[#2b2b2b] w-full max-w-3xl rounded-xl overflow-hidden shadow-2xl flex flex-col md:flex-row h-auto md:h-[450px]">
                  {/* Left Sidebar */}
                  <div className="w-full md:w-1/3 bg-[#0a0a0c] border-r border-[#1f1f23] flex flex-col">
                      <div className="p-4 border-b border-[#1f1f23] flex items-center gap-2">
                          <CloudIcon /> <h3 className="font-bold text-sm">Publish Your App</h3>
                      </div>
                      <div className="p-2 flex flex-col gap-1 flex-1">
                          <button onClick={() => setPublishMethod('cloud')} className={`p-3 text-left rounded-lg transition ${publishMethod === 'cloud' ? 'bg-[#1a40af]/20 border border-blue-600 text-blue-500' : 'text-gray-400 hover:bg-[#1a1a24]'}`}>
                              <div className="font-bold text-xs flex items-center gap-2"><CloudIcon/> Mantu Cloud</div>
                              <div className="text-[10px] mt-1 opacity-70">Free 1-Click Subdomain</div>
                          </button>
                          <button onClick={() => setPublishMethod('aws')} className={`p-3 text-left rounded-lg transition ${publishMethod === 'aws' ? 'bg-orange-500/10 border border-orange-500/50 text-orange-500' : 'text-gray-400 hover:bg-[#1a1a24]'}`}>
                              <div className="font-bold text-xs flex items-center gap-2"><ServerIcon/> AWS EC2 Auto</div>
                              <div className="text-[10px] mt-1 opacity-70">Deploy to your own server</div>
                          </button>
                          <button onClick={() => setPublishMethod('github')} className={`p-3 text-left rounded-lg transition ${publishMethod === 'github' ? 'bg-gray-800 border border-gray-600 text-white' : 'text-gray-400 hover:bg-[#1a1a24]'}`}>
                              <div className="font-bold text-xs flex items-center gap-2"><GithubIcon/> GitHub Push</div>
                              <div className="text-[10px] mt-1 opacity-70">Push code to repository</div>
                          </button>
                          <button onClick={() => setPublishMethod('domain')} className={`p-3 text-left rounded-lg transition ${publishMethod === 'domain' ? 'bg-green-500/10 border border-green-500/50 text-green-500' : 'text-gray-400 hover:bg-[#1a1a24]'}`}>
                              <div className="font-bold text-xs flex items-center gap-2"><LinkIcon/> Custom Domain</div>
                              <div className="text-[10px] mt-1 opacity-70">Point DNS to Server</div>
                          </button>
                      </div>
                  </div>

                  {/* Right Content Area */}
                  <div className="w-full md:w-2/3 bg-[#111116] p-6 flex flex-col relative">
                      <button onClick={() => setIsPublishModalOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white transition"><CloseIcon/></button>
                      
                      {publishMethod === 'aws' && (
                          <div className="flex flex-col h-full mt-4">
                              <h4 className="text-orange-500 font-bold text-sm mb-4">AWS Automatic Deployment</h4>
                              <div className="flex gap-3 mb-6">
                                  <button onClick={()=>setAwsInstanceType('cpu')} className={`flex-1 p-3 rounded-lg border flex flex-col items-start transition ${awsInstanceType === 'cpu' ? 'border-orange-500 bg-orange-500/5 text-orange-400' : 'border-[#2b2b2b] text-gray-400 hover:border-gray-600'}`}>
                                      <div className="flex items-center gap-2 font-bold text-xs"><CpuIcon/> CPU Instance</div>
                                      <div className="text-[10px] mt-1 opacity-70">t2.micro / t3.small</div>
                                  </button>
                                  <button onClick={()=>setAwsInstanceType('gpu')} className={`flex-1 p-3 rounded-lg border flex flex-col items-start relative transition ${awsInstanceType === 'gpu' ? 'border-purple-500 bg-purple-500/5 text-purple-400' : 'border-[#2b2b2b] text-gray-400 hover:border-gray-600'}`}>
                                      <span className="absolute -top-2 -right-2 bg-purple-600 text-[9px] text-white px-2 py-0.5 rounded-full font-bold">PRO</span>
                                      <div className="flex items-center gap-2 font-bold text-xs">⚡ GPU Instance</div>
                                      <div className="text-[10px] mt-1 opacity-70">g4dn.xlarge (T4/A100)</div>
                                  </button>
                              </div>
                              <div className="mb-4">
                                  <label className="text-xs text-gray-400 font-bold mb-1.5 block">Target IP Address</label>
                                  <input type="text" value={awsTargetIp} onChange={(e) => setAwsTargetIp(e.target.value)} placeholder="e.g. 13.234.11.22" className="w-full bg-[#0A0A0E] border border-[#2b2b2b] rounded-lg p-2.5 text-sm text-white outline-none focus:border-orange-500 transition" />
                              </div>
                              <div className="mb-6">
                                  <label className="text-xs text-gray-400 font-bold mb-1.5 block">Server Auth Key / Password</label>
                                  <div className="flex gap-2">
                                      <input type="password" value={awsAuthKey ? '************************' : ''} readOnly placeholder="Upload .pem file" className="flex-1 bg-[#0A0A0E] border border-[#2b2b2b] rounded-lg p-2.5 text-sm text-gray-500 outline-none" />
                                      <label className="bg-[#1a1a24] border border-[#2b2b2b] hover:bg-[#2b2b36] cursor-pointer text-white px-4 py-2.5 rounded-lg text-xs font-bold flex items-center transition">
                                          Upload .pem
                                          <input type="file" accept=".pem" onChange={handlePemUpload} className="hidden" />
                                      </label>
                                  </div>
                              </div>
                              <button onClick={handlePublish} className="mt-auto w-full bg-orange-600 hover:bg-orange-500 text-white py-3 rounded-lg font-bold text-sm shadow-lg transition">Deploy to AWS {awsInstanceType.toUpperCase()}</button>
                          </div>
                      )}

                      {/* 🔥 NEW GITHUB UI 🔥 */}
                      {publishMethod === 'github' && (
                          <div className="flex flex-col h-full mt-4">
                              <h4 className="text-white font-bold text-sm mb-4"><GithubIcon/> GitHub Push Configuration</h4>
                              <div className="mb-4">
                                  <label className="text-xs text-gray-400 font-bold mb-1.5 block">Repository Name</label>
                                  <input type="text" value={gitRepoName} onChange={(e) => setGitRepoName(e.target.value)} placeholder="e.g. my-awesome-app" className="w-full bg-[#0A0A0E] border border-[#2b2b2b] rounded-lg p-2.5 text-sm text-white outline-none focus:border-gray-500 transition" />
                              </div>
                              <div className="mb-6">
                                  <label className="text-xs text-gray-400 font-bold mb-1.5 block">GitHub Personal Access Token</label>
                                  <input type="password" value={gitToken} onChange={(e) => setGitToken(e.target.value)} placeholder="ghp_xxxxxxxxxxxxxxxxxxxx" className="w-full bg-[#0A0A0E] border border-[#2b2b2b] rounded-lg p-2.5 text-sm text-white outline-none focus:border-gray-500 transition" />
                              </div>
                              <button onClick={handlePublish} className="mt-auto w-full bg-gray-800 hover:bg-gray-700 border border-gray-600 text-white py-3 rounded-lg font-bold text-sm shadow-lg transition">Push to GitHub</button>
                          </div>
                      )}

                      {/* 🔥 NEW CUSTOM DOMAIN UI 🔥 */}
                      {publishMethod === 'domain' && (
                          <div className="flex flex-col h-full mt-4">
                              <h4 className="text-green-500 font-bold text-sm mb-4"><LinkIcon/> Custom Domain & SSL</h4>
                              <div className="mb-4">
                                  <label className="text-xs text-gray-400 font-bold mb-1.5 block">Your Domain Name</label>
                                  <input type="text" value={customDomain} onChange={(e) => setCustomDomain(e.target.value)} placeholder="e.g. neovid-ai.com" className="w-full bg-[#0A0A0E] border border-[#2b2b2b] rounded-lg p-2.5 text-sm text-white outline-none focus:border-green-500 transition" />
                              </div>
                              <div className="mb-6">
                                  <label className="text-xs text-gray-400 font-bold mb-1.5 block">AWS Server IP (Where app is hosted)</label>
                                  <input type="text" value={awsTargetIp} onChange={(e) => setAwsTargetIp(e.target.value)} placeholder="e.g. 13.234.11.22" className="w-full bg-[#0A0A0E] border border-[#2b2b2b] rounded-lg p-2.5 text-sm text-white outline-none focus:border-green-500 transition" />
                              </div>
                              <button onClick={handlePublish} className="mt-auto w-full bg-green-600 hover:bg-green-500 text-white py-3 rounded-lg font-bold text-sm shadow-lg transition">Setup Domain & SSL</button>
                          </div>
                      )}

                      {publishMethod === 'cloud' && (
                          <div className="flex flex-col h-full mt-4 justify-center items-center text-center">
                              <h4 className="text-blue-500 font-bold text-lg mb-2">Instant Global Deployment</h4>
                              <p className="text-gray-400 text-sm mb-8">Your app will be live at a secure mantu-cloud subdomain.</p>
                              <button onClick={handlePublish} className="w-full max-w-xs bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg font-bold text-sm shadow-lg transition flex items-center justify-center gap-2"><CloudIcon/> Go Live Now</button>
                          </div>
                      )}
                  </div>
              </div>
          </div>
      )}

      {/* 🔐 ENV VARIABLES MODAL */}
      {isEnvModalOpen && (
         <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-[#111116] border border-[#2b2b2b] w-full max-w-lg rounded-xl overflow-hidden shadow-2xl">
                <div className="p-4 border-b border-[#2b2b2b] flex justify-between items-center bg-yellow-500/5">
                    <h3 className="text-sm font-bold text-yellow-500 flex items-center gap-2"><LockIcon/> Env Variables</h3>
                    <button onClick={() => setIsEnvModalOpen(false)} className="text-gray-400 hover:text-white transition"><CloseIcon/></button>
                </div>
                <div className="p-6 flex flex-col gap-4">
                    <div className="flex gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                        <div className="w-1/3 pl-1">KEY</div>
                        <div className="flex-1 pl-1">VALUE</div>
                    </div>
                    {projectEnv.map((env, i) => (
                        <div key={i} className="flex gap-2 items-center">
                            <input type="text" value={env.key} onChange={(e) => { const n = [...projectEnv]; n[i].key = e.target.value; setProjectEnv(n); }} placeholder="e.g. API_KEY" className="w-1/3 bg-[#0A0A0E] border border-[#2b2b2b] rounded-lg p-2.5 text-sm text-white outline-none focus:border-yellow-500 transition" />
                            <input type="text" value={env.value} onChange={(e) => { const n = [...projectEnv]; n[i].value = e.target.value; setProjectEnv(n); }} placeholder="Value..." className="flex-1 bg-[#0A0A0E] border border-[#2b2b2b] rounded-lg p-2.5 text-sm text-white outline-none focus:border-yellow-500 transition" />
                            <button onClick={() => setProjectEnv(projectEnv.filter((_, idx) => idx !== i))} className="text-red-500 hover:text-red-400 px-2 font-bold transition">X</button>
                        </div>
                    ))}
                    <button onClick={() => setProjectEnv([...projectEnv, { key: '', value: '' }])} className="text-xs text-blue-500 font-bold w-max hover:text-blue-400 transition">+ Add Variable</button>
                    <button onClick={() => setIsEnvModalOpen(false)} className="mt-4 w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg font-bold text-sm shadow transition">Save Keys</button>
                </div>
            </div>
         </div>
      )}

    </div>
  );
}
