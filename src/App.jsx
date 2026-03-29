import React, { useState, useEffect, useRef } from 'react';
// Note: Make sure Workspace and Icons components exist in your project!
// import Workspace from './Workspace';
// import { SparkleIcon, SettingsIcon, TerminalIcon, CloseIcon, GithubIcon } from './Icons';

// ==========================================
// 🛠️ DUMMY ICONS (If actual ones are missing)
// ==========================================
const SparkleIcon = () => <span className="mr-2">✨</span>;
const SettingsIcon = () => <span>⚙️</span>;
const TerminalIcon = () => <span>💻</span>;
const CloseIcon = () => <span>❌</span>;
const GithubIcon = () => <span className="mr-2">🐙</span>;

export default function App() {
  // 🎨 Theme & History State
  const [theme, setTheme] = useState(localStorage.getItem('mantuTheme') || 'dark');
  const [projects, setProjects] = useState(JSON.parse(localStorage.getItem('mantuProjects')) || []);
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);

  // 🧠 Core States
  const [prompt, setPrompt] = useState('');
  const [view, setView] = useState('home'); 
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('preview'); 
  const [generatedFiles, setGeneratedFiles] = useState({});
  const [activeFile, setActiveFile] = useState("");
  const [previewHtml, setPreviewHtml] = useState("");
  const [terminalOutput, setTerminalOutput] = useState("> System Ready. Welcome to Mantu OS.");
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const [actionLogs, setActionLogs] = useState([]);
  
  // 🎤 Attachments
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const [attachedImage, setAttachedImage] = useState(null);
  const [attachedVoice, setAttachedVoice] = useState(null);
  const [voiceUrl, setVoiceUrl] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  
  const imageInputRef = useRef(null);
  const voiceInputRef = useRef(null);

  // ⚙️ Settings & Modals
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settings, setSettings] = useState({ awsIp: 'http://localhost:10000', netlifyToken: '', groqKey: '', geminiKey: '', openAiKey: '', aiModel: 'groq' });
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [publishMethod, setPublishMethod] = useState('aws'); 
  
  // Deployment States
  const [gitRepoName, setGitRepoName] = useState("");
  const [gitToken, setGitToken] = useState("");
  const [awsInstance, setAwsInstance] = useState('cpu'); 
  const [awsTargetIp, setAwsTargetIp] = useState(""); 
  const [awsAuthKey, setAwsAuthKey] = useState(""); 
  const [pemLoaded, setPemLoaded] = useState(false); 
  
  // Vault & Rollback States
  const [isEnvModalOpen, setIsEnvModalOpen] = useState(false);
  const [projectEnv, setProjectEnv] = useState([{ key: '', value: '' }]);
  const [customDomain, setCustomDomain] = useState("");

  useEffect(() => { 
      const saved = localStorage.getItem('mantuSettings'); 
      if (saved) {
          const parsed = JSON.parse(saved);
          setSettings({ ...parsed, aiModel: parsed.aiModel || 'groq', awsIp: parsed.awsIp || 'http://localhost:10000' }); 
      }
      document.body.className = theme === 'dark' ? 'bg-[#030303] text-white' : 'bg-gray-50 text-black';
  }, [theme]);

  const toggleTheme = () => {
      const newTheme = theme === 'dark' ? 'light' : 'dark';
      setTheme(newTheme); localStorage.setItem('mantuTheme', newTheme);
  };

  const saveSettings = () => { 
      localStorage.setItem('mantuSettings', JSON.stringify(settings)); 
      setIsSettingsOpen(false); 
      setTerminalOutput(`> Settings Saved. Active Engine: ${(settings.aiModel || 'groq').toUpperCase()}`);
      setIsConsoleOpen(true);
  };

  const saveCurrentProject = () => {
      if(Object.keys(generatedFiles).length === 0) return;
      const newProject = { id: Date.now(), title: prompt.substring(0, 40) || 'Untitled Codebase', files: generatedFiles, logs: actionLogs };
      const updated = [newProject, ...projects];
      setProjects(updated); localStorage.setItem('mantuProjects', JSON.stringify(updated));
      setTerminalOutput("> 💾 Project successfully saved to Local History!"); setIsConsoleOpen(true);
  };

  const loadProject = (proj) => {
      setGeneratedFiles(proj.files); setActionLogs(proj.logs || []); setPrompt(proj.title);
      setActiveFile(Object.keys(proj.files)[0] || "");
      setView('editor'); setIsProjectsOpen(false); setTerminalOutput(`> 📂 Loaded Project: ${proj.title}`);
  };

  const deleteProject = (id) => {
      const updated = projects.filter(p => p.id !== id);
      setProjects(updated); localStorage.setItem('mantuProjects', JSON.stringify(updated));
  };

  const handleCodeChange = (filename, newCode) => { setGeneratedFiles(prev => ({ ...prev, [filename]: newCode })); };

  const toggleListening = () => {
      if (isListening) { recognitionRef.current?.stop(); setIsListening(false); return; }
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) return alert("Browser does not support Voice Typing.");
      const recognition = new SpeechRecognition();
      recognition.continuous = true; recognition.interimResults = true; recognition.lang = 'en-IN';
      let initialPrompt = prompt;
      recognition.onresult = (e) => {
          let currentTranscript = '';
          for (let i = 0; i < e.results.length; i++) currentTranscript += e.results[i][0].transcript;
          setPrompt(initialPrompt + (initialPrompt ? ' ' : '') + currentTranscript);
      };
      recognition.onerror = () => setIsListening(false); recognition.onend = () => setIsListening(false);
      recognitionRef.current = recognition; recognition.start(); setIsListening(true);
  };

  const handleFileUpload = (e, type) => {
      const file = e.target.files[0]; if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => { type === 'image' ? setAttachedImage(ev.target.result) : setAttachedVoice(ev.target.result); };
      reader.readAsDataURL(file);
  };

  const handlePemUpload = (e) => {
      const file = e.target.files[0]; if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => { setAwsAuthKey(ev.target.result); setPemLoaded(true); };
      reader.readAsText(file); 
  };

  // ==========================================
  // 🚀 1. THE CRASH-PROOF BUILD ENGINE (Buffer Stream)
  // ==========================================
  const handleGenerate = async () => {
      if (!prompt.trim()) return;
      if (isListening) toggleListening(); 
      setActionLogs(prev => [...prev, { id: Date.now(), type: 'user', text: prompt }]);
      setIsGenerating(true); setView('editor'); setActiveTab('code'); setIsConsoleOpen(true);
      
      try {
          const safeAiModel = settings.aiModel || 'groq';
          if (view === 'home') {
              setGeneratedFiles({}); setActionLogs([{ id: Date.now(), type: 'user', text: prompt }]);
              setTerminalOutput(`> Initializing Engine [Model: ${safeAiModel.toUpperCase()}]...\n> Architecting blueprint...`);
          } else {
              setTerminalOutput(prev => prev + "\n> Sending follow-up request to AI...");
          }
          
          let baseUrl = settings.awsIp ? (settings.awsIp.startsWith('http') ? settings.awsIp : `http://${settings.awsIp}`) : 'http://localhost:10000';
          const payload = { prompt, image: attachedImage, voice: attachedVoice, voiceUrl: voiceUrl, customSettings: settings };
          
          const res = await fetch(`${baseUrl}/api/build`, { 
              method: 'POST', 
              headers: { 'Content-Type': 'application/json' }, 
              body: JSON.stringify(payload) 
          });
          
          if (!res.ok) throw new Error(`Backend Connection Refused. Ensure ${baseUrl} is online.`);
          
          const reader = res.body.getReader(); 
          const decoder = new TextDecoder();
          let buffer = ""; // 🔥 This buffer prevents the JSON crash

          while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              
              buffer += decoder.decode(value, { stream: true });
              let parts = buffer.split('\n\n');
              buffer = parts.pop(); // Keep incomplete chunk in buffer
              
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
                              setGeneratedFiles(prev => ({ ...prev, [data.filename]: cleanCode }));
                              setActiveFile(data.filename);
                          } else if (data.type === 'error') {
                              setTerminalOutput(prev => prev + `\n> ❌ ERROR: ${data.error}`);
                              setActionLogs(prev => [...prev, { id: Date.now(), type: 'log', agent: "System", status: "Error", details: data.error }]);
                          } else if (data.type === 'done') {
                              setActiveTab('preview');
                              setTerminalOutput(prev => prev + `\n> 🎉 Generation Complete!`);
                          }
                      } catch (err) {
                         console.log("Safe ignore partial chunk");
                      }
                  }
              }
          }
      } catch (error) { 
          setTerminalOutput(prev => prev + `\n> ❌ FRONTEND CRASH: ${error.message}`); 
          setActionLogs(prev => [...prev, { id: Date.now(), type: 'log', agent: "System", status: "Error", details: error.message }]);
      } finally { 
          setIsGenerating(false); setPrompt(''); setAttachedImage(null); setAttachedVoice(null); setVoiceUrl(''); 
      }
  };

  // ==========================================
  // 🚀 2. THE AWS AUTO-DEPLOYER (ZIP FROM BACKEND)
  // ==========================================
  const handlePublish = async () => { 
      setIsPublishModalOpen(false); setIsConsoleOpen(true);
      let baseUrl = settings.awsIp ? (settings.awsIp.startsWith('http') ? settings.awsIp : `http://${settings.awsIp}`) : 'http://localhost:10000';
      const apiUrl = `${baseUrl}/api/publish-${publishMethod}`;
      
      let payload = {};
      if (publishMethod === 'cloud') payload.netlifyToken = settings.netlifyToken;
      if (publishMethod === 'github') { payload.repoName = gitRepoName; payload.token = gitToken; }
      if (publishMethod === 'aws') { payload.targetIp = awsTargetIp; payload.authKey = awsAuthKey; payload.customSettings = settings; }
      
      setTerminalOutput(`> 🚀 Initiating Deployment via ${publishMethod.toUpperCase()}...`);
      try {
          const res = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
          const data = await res.json();
          if(data.success) { 
              setTerminalOutput(prev => prev + `\n> 🎉 SUCCESS! LIVE at: ${data.url || awsTargetIp}`); 
              window.open(data.url, "_blank"); 
          } else {
              setTerminalOutput(prev => prev + `\n> ❌ DEPLOY ERROR: ${data.error}`);
          }
      } catch (e) { setTerminalOutput(prev => prev + `\n> ❌ Failed to connect to Backend Server: ${e.message}`); }
  };

  // ==========================================
  // ⏪ 3. TIME MACHINE ROLLBACK
  // ==========================================
  const handleRollback = async () => {
      setIsConsoleOpen(true);
      setTerminalOutput("> ⏪ Initiating Time Machine Rollback...");
      try {
          let baseUrl = settings.awsIp ? (settings.awsIp.startsWith('http') ? settings.awsIp : `http://${settings.awsIp}`) : 'http://localhost:10000';
          const res = await fetch(`${baseUrl}/api/rollback-aws`, {
              method: 'POST', headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ targetIp: awsTargetIp, authKey: awsAuthKey })
          });
          const data = await res.json();
          if(data.success) setTerminalOutput(prev => prev + `\n> ✅ Rollback Successful! Previous version restored.`);
          else setTerminalOutput(prev => prev + `\n> ❌ Rollback Failed: ${data.error}`);
      } catch (e) { setTerminalOutput(prev => prev + `\n> ❌ Rollback Crash: ${e.message}`); }
  };

  // ==========================================
  // 🌍 4. AUTO-DOMAIN & SSL
  // ==========================================
  const handleSetupDomain = async () => {
      if(!customDomain || !awsTargetIp) return alert("Domain and Target IP required!");
      setIsPublishModalOpen(false); setIsConsoleOpen(true);
      setTerminalOutput(`> 🌍 Configuring Custom Domain (${customDomain}) and Free SSL...`);
      try {
          let baseUrl = settings.awsIp ? (settings.awsIp.startsWith('http') ? settings.awsIp : `http://${settings.awsIp}`) : 'http://localhost:10000';
          const res = await fetch(`${baseUrl}/api/setup-domain`, {
              method: 'POST', headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ domain: customDomain, targetIp: awsTargetIp, authKey: awsAuthKey })
          });
          const data = await res.json();
          if(data.success) setTerminalOutput(prev => prev + `\n> ✅ SSL Setup Complete! HTTPS Active at: ${data.url}`);
          else setTerminalOutput(prev => prev + `\n> ❌ Domain Setup Failed: ${data.error}`);
      } catch (e) { setTerminalOutput(prev => prev + `\n> ❌ Domain Crash: ${e.message}`); }
  };

  // ==========================================
  // 🔐 5. DYNAMIC .ENV VAULT
  // ==========================================
  const handleSaveEnv = async () => {
      setIsEnvModalOpen(false); setIsConsoleOpen(true);
      setTerminalOutput("> 🔐 Injecting Secrets into Mantu Vault...");
      const envObj = {};
      projectEnv.forEach(e => { if (e.key.trim()) envObj[e.key.trim()] = e.value.trim(); });
      
      try {
          let baseUrl = settings.awsIp ? (settings.awsIp.startsWith('http') ? settings.awsIp : `http://${settings.awsIp}`) : 'http://localhost:10000';
          const res = await fetch(`${baseUrl}/api/save-env`, {
              method: 'POST', headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ envVars: envObj, targetIp: awsTargetIp, authKey: awsAuthKey })
          });
          const data = await res.json();
          if(data.success) setTerminalOutput(prev => prev + `\n> ✅ Secrets Successfully Injected into AWS!`);
          else setTerminalOutput(prev => prev + `\n> ❌ Vault Error: ${data.error}`);
      } catch (e) { setTerminalOutput(prev => prev + `\n> ❌ Vault Crash: ${e.message}`); }
  };

  // Live Preview Logic
  const renderLivePreview = () => {
      let htmlFile = generatedFiles['index.html'] || generatedFiles['public/index.html'] || `<div id="root" class="flex items-center justify-center h-screen font-sans ${theme==='dark'?'bg-[#030303] text-gray-500':'bg-white text-gray-400'}">Building UI...</div>`;
      let cssFile = generatedFiles['styles.css'] || generatedFiles['App.css'] || generatedFiles['global.css'] || generatedFiles['index.css'] || "";
      let reactCode = generatedFiles['App.jsx'] || generatedFiles['index.jsx'] || generatedFiles['src/App.jsx'] || generatedFiles['src/main.jsx'] || "";
      const envObj = {}; projectEnv.forEach(e => { if (e.key.trim()) envObj[e.key.trim()] = e.value.trim(); });
      const reactImports = `<script>window.mantuEnv = ${JSON.stringify(envObj)}; window.process = { env: window.mantuEnv };</script><script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script><script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script><script src="https://unpkg.com/babel-standalone@6/babel.min.js"></script><script src="https://cdn.tailwindcss.com"></script><style>${cssFile}</style>`;
      let cleanReact = reactCode.replace(/import\s+.*?from\s+['"].*?['"];?/g, '').replace(/export\s+default\s+function/g, 'function').replace(/import\.meta\.env/g, 'window.mantuEnv').replace(/process\.env/g, 'window.mantuEnv');
      let executeReact = reactCode ? `<script type="text/babel" data-type="module">${cleanReact} const root = ReactDOM.createRoot(document.getElementById('root')); root.render(<App />);</script>` : "";
      setPreviewHtml(`<!DOCTYPE html><html><head>${reactImports}</head><body>${htmlFile}${executeReact}</body></html>`);
  };
  useEffect(() => { if (activeTab === 'preview') renderLivePreview(); }, [activeTab, generatedFiles, projectEnv, theme]);


  const bgMain = theme === 'dark' ? 'bg-[#030303] text-white' : 'bg-[#f4f4f5] text-gray-900';
  const bgNav = theme === 'dark' ? 'bg-[#0A0A0E] border-[#2b2b2b]' : 'bg-white border-gray-200 shadow-sm';
  const bgCard = theme === 'dark' ? 'bg-[#111116] border-[#2b2b2b]' : 'bg-white border-gray-200';
  const textMuted = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';

  return (
    <div className={`h-[100dvh] w-full flex flex-col font-sans overflow-hidden ${bgMain}`}>
      {/* 🔝 NAVBAR */}
      <nav className={`h-14 flex items-center justify-between px-6 border-b shrink-0 z-20 relative ${bgNav}`}>
        <div className="text-xl font-extrabold flex items-center gap-2 cursor-pointer" onClick={() => setView('home')}>
            <span className="text-blue-600 font-mono tracking-tighter">#</span> mantu_ai
        </div>
        <div className="flex items-center gap-3">
           <button onClick={toggleTheme} className={`${textMuted} hover:text-blue-500 transition p-1 text-lg`} title="Toggle Theme">
               {theme === 'dark' ? '☀️' : '🌙'}
           </button>
           <button onClick={() => setIsProjectsOpen(true)} className={`${textMuted} hover:text-blue-500 transition p-1 flex items-center gap-1 text-sm font-bold`} title="My Projects">
               📂 History
           </button>
           <button onClick={() => setIsSettingsOpen(true)} className={`${textMuted} hover:text-blue-500 transition p-1`}><SettingsIcon/></button>
           {view === 'home' && Object.keys(generatedFiles).length > 0 && (
               <button onClick={() => setView('editor')} className="text-xs font-bold text-white transition bg-blue-600 px-4 py-1.5 rounded-full hover:bg-blue-500 shadow">Resume →</button>
           )}
        </div>
      </nav>

      {/* 🏠 HOME VIEW */}
      {view === 'home' ? (
        <div className="flex-1 flex flex-col items-center pt-16 md:pt-24 p-4 relative overflow-y-auto">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-center tracking-tight">
                Build & Deploy in <span className="text-blue-600">Seconds</span>
            </h1>
            <p className={`${textMuted} mb-10 max-w-xl text-center text-sm md:text-base leading-relaxed`}>
                Describe your dream SaaS, App, or Dashboard. Mantu AI will write the code, bundle the project, and deploy it to a live global URL instantly.
            </p>
            
            <div className={`w-full max-w-4xl border ${bgCard} ${isListening ? 'border-red-500 shadow-[0_0_40px_rgba(239,68,68,0.2)]' : 'shadow-xl'} rounded-2xl flex flex-col focus-within:border-blue-500/50 transition-all z-10`}>
                {/* Inputs area */}
                <div className="flex flex-col p-2 relative">
                    <textarea 
                        value={prompt} onChange={(e) => setPrompt(e.target.value)} 
                        placeholder={isListening ? "Listening... Speak now!" : "e.g. Build an AI video generator SaaS..."}
                        className={`w-full bg-transparent border-none outline-none p-4 resize-none min-h-[120px] md:min-h-[160px] text-lg font-medium leading-relaxed ${isListening ? 'placeholder-red-400' : ''} ${theme==='dark'?'text-white':'text-black'}`}
                        onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleGenerate(); } }}
                    />
                    
                    {/* Action Bar */}
                    <div className="flex items-center justify-between p-2 mt-2 border-t border-gray-800 pt-4">
                        <div className="flex gap-2">
                           <button onClick={toggleListening} className={`p-2 rounded-full ${isListening ? 'text-red-500 animate-pulse bg-red-500/10' : 'text-gray-400 hover:text-white'}`}>🎤</button>
                        </div>
                        <button onClick={handleGenerate} disabled={isGenerating} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition disabled:opacity-50">
                            {isGenerating ? <span className="animate-spin">🌀</span> : <SparkleIcon/>} {isGenerating ? 'Building...' : 'Generate'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
      ) : (
        /* 💻 EDITOR VIEW */
        <div className="flex-1 flex overflow-hidden relative">
            {/* Editor Top Bar Placeholder for UI Completeness */}
            <div className={`absolute top-0 right-0 p-4 flex gap-2 z-50`}>
                <button onClick={() => setIsEnvModalOpen(true)} className="bg-yellow-600 hover:bg-yellow-500 text-white px-4 py-1.5 rounded text-sm font-bold shadow flex items-center gap-1">🔐 Env Keys</button>
                <button onClick={() => setIsPublishModalOpen(true)} className="bg-green-600 hover:bg-green-500 text-white px-4 py-1.5 rounded text-sm font-bold shadow flex items-center gap-1">🌍 Publish App</button>
            </div>
            
            {/* Main Workspace Area (Assume Workspace component handles file tree, code editor, and preview rendering) */}
            <div className="flex-1 flex bg-[#1e1e1e] items-center justify-center text-gray-500">
               {/* ⚠️ NOTE: Use your actual <Workspace/> component here. Replacing with a placeholder for now to ensure code integrity. */}
               <div className="text-center">
                 <h2 className="text-xl text-white mb-2">Editor Workspace Active</h2>
                 <p>Project Files Loaded: {Object.keys(generatedFiles).length}</p>
                 <div className="mt-4 flex gap-4 justify-center">
                    <button onClick={() => setActiveTab('code')} className={`px-4 py-2 rounded ${activeTab === 'code' ? 'bg-blue-600 text-white' : 'bg-gray-800'}`}>Code</button>
                    <button onClick={() => setActiveTab('preview')} className={`px-4 py-2 rounded ${activeTab === 'preview' ? 'bg-blue-600 text-white' : 'bg-gray-800'}`}>Live Preview</button>
                 </div>
               </div>
            </div>
        </div>
      )}

      {/* 🚀 PUBLISH MODAL */}
      {isPublishModalOpen && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
              <div className={`${bgCard} w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl flex flex-col`}>
                  <div className="p-4 border-b border-gray-800 flex justify-between items-center">
                      <h3 className="text-lg font-bold flex items-center gap-2">🌍 Publish Your App</h3>
                      <button onClick={() => setIsPublishModalOpen(false)} className="text-gray-400 hover:text-white"><CloseIcon/></button>
                  </div>
                  
                  <div className="flex flex-col md:flex-row h-full">
                      <div className="w-full md:w-1/3 bg-[#0A0A0E] p-4 flex flex-col gap-2 border-r border-gray-800">
                          <button onClick={() => setPublishMethod('aws')} className={`p-3 rounded-lg text-left transition ${publishMethod === 'aws' ? 'bg-orange-600/20 text-orange-500 border border-orange-500/50' : 'text-gray-400 hover:bg-gray-800'}`}>
                              <div className="font-bold text-sm">☁️ AWS EC2 Auto</div>
                              <div className="text-[10px] mt-1 opacity-70">Deploy to your own server</div>
                          </button>
                          <button onClick={() => setPublishMethod('github')} className={`p-3 rounded-lg text-left transition ${publishMethod === 'github' ? 'bg-blue-600/20 text-blue-500 border border-blue-500/50' : 'text-gray-400 hover:bg-gray-800'}`}>
                              <div className="font-bold text-sm"><GithubIcon/> GitHub Push</div>
                              <div className="text-[10px] mt-1 opacity-70">Push code to repository</div>
                          </button>
                      </div>
                      
                      <div className="w-full md:w-2/3 p-6 flex flex-col gap-4">
                          {publishMethod === 'aws' && (
                              <>
                                  <h4 className="font-bold text-orange-500">AWS Automatic Deployment</h4>
                                  <div>
                                      <label className="text-xs text-gray-400 font-bold mb-1 block">Target IP Address</label>
                                      <input type="text" value={awsTargetIp} onChange={(e) => setAwsTargetIp(e.target.value)} placeholder="e.g. 13.234.11.22" className="w-full bg-[#0A0A0E] border border-gray-700 rounded p-2 text-sm text-white" />
                                  </div>
                                  <div>
                                      <label className="text-xs text-gray-400 font-bold mb-1 block">Server Auth Key (.pem)</label>
                                      <input type="file" accept=".pem" onChange={handlePemUpload} className="w-full bg-[#0A0A0E] border border-gray-700 rounded p-2 text-sm text-white" />
                                      {pemLoaded && <span className="text-xs text-green-500 mt-1 block">✅ Key Loaded</span>}
                                  </div>
                                  <button onClick={handlePublish} className="mt-auto w-full bg-orange-600 hover:bg-orange-500 text-white py-3 rounded-lg font-bold shadow-lg transition">Deploy to AWS</button>
                                  
                                  <div className="mt-4 pt-4 border-t border-gray-800 flex gap-2">
                                      <button onClick={handleRollback} className="flex-1 bg-red-600/20 text-red-500 hover:bg-red-600/30 py-2 rounded text-sm font-bold border border-red-500/30">⏪ Rollback</button>
                                  </div>
                                  
                                  <div className="mt-4">
                                      <label className="text-xs text-gray-400 font-bold mb-1 block">Custom Domain setup (Optional)</label>
                                      <div className="flex gap-2">
                                        <input type="text" value={customDomain} onChange={(e) => setCustomDomain(e.target.value)} placeholder="e.g. neovid-ai.com" className="flex-1 bg-[#0A0A0E] border border-gray-700 rounded p-2 text-sm text-white" />
                                        <button onClick={handleSetupDomain} className="bg-blue-600 hover:bg-blue-500 px-4 rounded font-bold text-sm">Add SSL</button>
                                      </div>
                                  </div>
                              </>
                          )}
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* 🔐 ENV VAULT MODAL */}
      {isEnvModalOpen && (
         <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className={`${bgCard} w-full max-w-md rounded-xl overflow-hidden shadow-2xl flex flex-col`}>
                <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-yellow-600/10">
                    <h3 className="text-lg font-bold text-yellow-500 flex items-center gap-2">🔐 Env Variables</h3>
                    <button onClick={() => setIsEnvModalOpen(false)} className="text-gray-400 hover:text-white"><CloseIcon/></button>
                </div>
                <div className="p-4 flex flex-col gap-3">
                    {projectEnv.map((env, i) => (
                        <div key={i} className="flex gap-2">
                            <input type="text" placeholder="KEY (e.g. API_KEY)" value={env.key} onChange={(e) => { const n = [...projectEnv]; n[i].key = e.target.value; setProjectEnv(n); }} className="w-1/3 bg-[#0A0A0E] border border-gray-700 rounded p-2 text-sm text-white" />
                            <input type="text" placeholder="VALUE" value={env.value} onChange={(e) => { const n = [...projectEnv]; n[i].value = e.target.value; setProjectEnv(n); }} className="w-full bg-[#0A0A0E] border border-gray-700 rounded p-2 text-sm text-white" />
                        </div>
                    ))}
                    <button onClick={() => setProjectEnv([...projectEnv, { key: '', value: '' }])} className="text-xs text-blue-500 text-left hover:underline">+ Add Variable</button>
                    <button onClick={handleSaveEnv} className="mt-4 w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg font-bold shadow transition">Save & Inject Keys</button>
                </div>
            </div>
         </div>
      )}

      {/* 🖥️ BOTTOM TERMINAL/CONSOLE */}
      <div className={`fixed bottom-0 left-0 w-full transition-all duration-300 z-40 border-t ${theme==='dark'?'bg-[#0A0A0E] border-[#2b2b2b]':'bg-gray-100 border-gray-300'} ${isConsoleOpen ? 'h-64' : 'h-10'}`}>
          <div className="flex items-center justify-between px-4 h-10 cursor-pointer" onClick={() => setIsConsoleOpen(!isConsoleOpen)}>
              <div className="text-xs font-bold text-gray-400 flex items-center gap-2"><TerminalIcon/> OUTPUT CONSOLE</div>
              <button className="text-gray-500 hover:text-white">{isConsoleOpen ? '▼' : '▲'}</button>
          </div>
          {isConsoleOpen && (
              <div className="p-4 pt-0 h-52 overflow-y-auto font-mono text-[11px] text-green-500 bg-[#050505]">
                  <pre className="whitespace-pre-wrap">{terminalOutput}</pre>
              </div>
          )}
      </div>
      
    </div>
  );
}
