import React, { useState, useEffect, useRef } from 'react';
import Workspace from './Workspace';
import { SparkleIcon, SettingsIcon, TerminalIcon, CloseIcon, GithubIcon } from './Icons';

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
  const [settings, setSettings] = useState({ awsIp: '', netlifyToken: '', groqKey: '', geminiKey: '', openAiKey: '', aiModel: 'groq' });
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [publishMethod, setPublishMethod] = useState('cloud'); 
  const [gitRepoName, setGitRepoName] = useState("");
  const [gitToken, setGitToken] = useState("");
  const [awsInstance, setAwsInstance] = useState('cpu'); 
  const [awsTargetIp, setAwsTargetIp] = useState(""); 
  const [awsAuthKey, setAwsAuthKey] = useState(""); 
  const [pemLoaded, setPemLoaded] = useState(false); 
  const [isEnvModalOpen, setIsEnvModalOpen] = useState(false);
  const [projectEnv, setProjectEnv] = useState([{ key: '', value: '' }]);

  useEffect(() => { 
      const saved = localStorage.getItem('mantuSettings'); 
      if (saved) {
          const parsed = JSON.parse(saved);
          // Safety fallback ensuring aiModel exists
          setSettings({ ...parsed, aiModel: parsed.aiModel || 'groq' }); 
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

  const handleGenerate = async () => {
      if (!prompt.trim()) return;
      if (isListening) toggleListening(); 
      setActionLogs(prev => [...prev, { id: Date.now(), type: 'user', text: prompt }]);
      setIsGenerating(true); setView('editor'); setActiveTab('code'); setIsConsoleOpen(true);
      
      try {
          // 🔥 FIXED: Safeguard added for aiModel to prevent silent crashes!
          const safeAiModel = settings.aiModel || 'groq';

          if (view === 'home') {
              setGeneratedFiles({}); setActionLogs([{ id: Date.now(), type: 'user', text: prompt }]);
              setTerminalOutput(`> Initializing Engine [Model: ${safeAiModel.toUpperCase()}]...\n> Architecting blueprint...`);
          } else {
              setTerminalOutput(prev => prev + "\n> Sending follow-up request to AI...");
          }
          
          // Use safe awsIp directly if present
          let baseUrl = 'http://localhost:3000';
          if (settings.awsIp) {
              baseUrl = settings.awsIp.startsWith('http') ? settings.awsIp : `http://${settings.awsIp}:3000`;
          }

          const payload = { prompt, image: attachedImage, voice: attachedVoice, voiceUrl: voiceUrl, customSettings: settings };
          
          const res = await fetch(`${baseUrl}/api/build`, { 
              method: 'POST', 
              headers: { 'Content-Type': 'application/json' }, 
              body: JSON.stringify(payload) 
          });
          
          if (!res.ok) throw new Error(`Backend Connection Refused. Ensure ${baseUrl} is online.`);
          
          const reader = res.body.getReader(); const decoder = new TextDecoder();
          
          while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              const chunks = decoder.decode(value).split('\n\n');
              for (const chunk of chunks) {
                  if (chunk.startsWith('data: ')) {
                      const data = JSON.parse(chunk.replace('data: ', ''));
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
                      } else if (data.type === 'done') setActiveTab('preview');
                  }
              }
          }
      } catch (error) { 
          // 🔥 NOW ERRORS WILL BE PROPERLY SHOWN IN CONSOLE
          setTerminalOutput(prev => prev + `\n> ❌ FRONTEND CRASH/NETWORK ERROR: ${error.message}`); 
          setActionLogs(prev => [...prev, { id: Date.now(), type: 'log', agent: "System", status: "Error", details: error.message }]);
      } finally { 
          setIsGenerating(false); setPrompt(''); setAttachedImage(null); setAttachedVoice(null); setVoiceUrl(''); 
      }
  };

  const handleRunCode = async () => {
      if (!activeFile) return;
      setTerminalOutput(`> Running ${activeFile} in Mantu Sandbox...`); setIsConsoleOpen(true);
      try {
          let baseUrl = settings.awsIp ? (settings.awsIp.startsWith('http') ? settings.awsIp : `http://${settings.awsIp}:3000`) : 'http://localhost:3000';
          const res = await fetch(`${baseUrl}/api/run`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ filename: activeFile, code: generatedFiles[activeFile] }) });
          const data = await res.json();
          if (data.error) setTerminalOutput(prev => prev + `\n> ❌ Sandbox Error:\n${data.error}`);
          if (data.output) setTerminalOutput(prev => prev + `\n> ✅ Output:\n${data.output}`);
      } catch (e) { setTerminalOutput(prev => prev + `\n> ❌ Request Failed: ${e.message}`); }
  };

  const handlePublish = async () => { 
      setIsPublishModalOpen(false); setIsConsoleOpen(true);
      if (publishMethod === 'custom') return setTerminalOutput("> ERROR: PRO feature pending payment.");
      let baseUrl = settings.awsIp ? (settings.awsIp.startsWith('http') ? settings.awsIp : `http://${settings.awsIp}:3000`) : 'http://localhost:3000';
      const apiUrl = `${baseUrl}/api/publish-${publishMethod}`;
      let payload = { files: generatedFiles };
      if (publishMethod === 'cloud') payload.netlifyToken = settings.netlifyToken;
      if (publishMethod === 'github') { payload.repoName = gitRepoName; payload.token = gitToken; }
      if (publishMethod === 'aws') { payload.instanceType = awsInstance; payload.targetIp = awsTargetIp; payload.authKey = awsAuthKey; }
      setTerminalOutput(`> 🚀 Initiating Deployment via ${publishMethod.toUpperCase()}...`);
      try {
          const res = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
          const data = await res.json();
          if(data.success) { setTerminalOutput(`> 🎉 SUCCESS! LIVE at: ${data.url || awsTargetIp}`); window.open(data.url, "_blank"); } 
          else setTerminalOutput(`> ❌ DEPLOY ERROR: ${data.error}`);
      } catch (e) { setTerminalOutput("> ❌ Failed to connect to Backend Server."); }
  };

  const handleBuildApk = async () => {
      setTerminalOutput("> 📦 Initiating Android APK Build on Remote AWS Server...\n> Packaging React Native / Web code...");
      setIsConsoleOpen(true);
      try {
          let baseUrl = settings.awsIp ? (settings.awsIp.startsWith('http') ? settings.awsIp : `http://${settings.awsIp}:3000`) : 'http://localhost:3000';
          const res = await fetch(`${baseUrl}/api/build-apk`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ files: generatedFiles })
          });
          if(!res.ok) throw new Error("Endpoint not available or server offline");
          const data = await res.json();
          if(data.success) {
              setTerminalOutput(`> 🎉 APK Build Successful!\n> 📥 Download Link: ${data.apkUrl}`);
          } else {
              setTerminalOutput(`> ❌ APK Build Error: ${data.error}`);
          }
      } catch (e) {
          setTerminalOutput(`> ❌ APK Build Failed: ${e.message}\n> Note: Ensure your AWS backend has Android Studio/Gradle installed.`);
      }
  };

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
                {(attachedImage || attachedVoice || showUrlInput) && (
                    <div className={`flex items-center gap-3 p-3 border-b rounded-t-2xl overflow-x-auto ${theme==='dark'?'border-[#2b2b2b] bg-[#0A0A0E]':'border-gray-200 bg-gray-50'}`}>
                        {attachedImage && ( <div className="relative shrink-0"><img src={attachedImage} alt="preview" className="h-12 w-12 object-cover rounded border border-[#3b3b3b]"/><button onClick={() => setAttachedImage(null)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-4 h-4 text-[10px] font-bold">X</button></div> )}
                        {attachedVoice && ( <div className="bg-blue-500/20 text-blue-600 text-xs px-3 py-1.5 rounded-full flex items-center gap-2 border border-blue-500/30">🎤 Audio Attached <button onClick={() => setAttachedVoice(null)} className="text-red-500 font-bold">X</button></div> )}
                        {showUrlInput && ( <div className="flex items-center gap-2 w-full max-w-sm"><input type="url" value={voiceUrl} onChange={(e)=>setVoiceUrl(e.target.value)} placeholder="Paste URL..." className={`w-full rounded p-1 text-xs outline-none focus:border-blue-500 ${theme==='dark'?'bg-[#1e1e1e] border-[#3b3b3b] text-white':'bg-white border-gray-300 text-black'}`}/><button onClick={()=>{setShowUrlInput(false); setVoiceUrl('');}} className="text-red-500 text-xs font-bold">Cancel</button></div> )}
                    </div>
                )}
                <div className="flex flex-col p-2 relative">
                    <textarea 
                        value={prompt} onChange={(e) => setPrompt(e.target.value)} 
                        placeholder={isListening ? "Listening... Speak now!" : "e.g. Build an AI video generator SaaS..."}
                        className={`w-full bg-transparent border-none outline-none p-4 resize-none min-h-[120px] md:min-h-[160px] text-lg font-medium leading-relaxed ${isListening ? 'placeholder-red-400' : ''} ${theme==='dark'?'text-white':'text-black'}`}
                        onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleGenerate(); } }}
                    />
                    <div className="flex items-center justify-between p-2 mt-2">
                        <div className="flex items-center gap-2 pl-2">
                            <button onClick={toggleListening} className={`p-2 transition rounded-full ${isListening ? 'text-red-500 bg-red-500/20 animate-pulse' : `text-gray-400 ${theme==='dark'?'bg-[#1e1e1e] border-[#2b2b2b] hover:text-white':'bg-white border-gray-200 hover:text-black'} border`}`} title="Mic"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path></svg></button>
                            <input type="file" ref={imageInputRef} onChange={(e) => handleFileUpload(e, 'image')} accept="image/*" className="hidden" />
                            <button onClick={() => imageInputRef.current.click()} className={`text-gray-400 p-2 rounded-full border transition ${theme==='dark'?'bg-[#1e1e1e] border-[#2b2b2b] hover:text-white':'bg-white border-gray-200 hover:text-black'}`} title="Upload Image"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg></button>
                            <input type="file" ref={voiceInputRef} onChange={(e) => handleFileUpload(e, 'voice')} accept="audio/*" className="hidden" />
                            <button onClick={() => voiceInputRef.current.click()} className={`text-gray-400 p-2 rounded-full border transition ${theme==='dark'?'bg-[#1e1e1e] border-[#2b2b2b] hover:text-white':'bg-white border-gray-200 hover:text-black'}`} title="Upload Audio File"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"></path><path d="M19 10v2a7 7 0 01-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line></svg></button>
                            <button onClick={() => setShowUrlInput(!showUrlInput)} className={`text-gray-400 p-2 rounded-full border transition ${theme==='dark'?'bg-[#1e1e1e] border-[#2b2b2b] hover:text-white':'bg-white border-gray-200 hover:text-black'}`} title="Attach Link"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"></path></svg></button>
                        </div>
                        <button onClick={handleGenerate} disabled={isGenerating || !prompt.trim()} className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-6 md:px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition shadow-lg whitespace-nowrap">
                            {isGenerating ? 'Building...' : <><SparkleIcon /> Generate</>}
                        </button>
                    </div>
                </div>
            </div>
            {theme === 'dark' && <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-blue-600/5 blur-[150px] rounded-full pointer-events-none"></div>}
        </div>
      ) : (
        /* 💻 WORKSPACE VIEW */
        <div className="flex-1 w-full overflow-hidden relative">
          <Workspace 
              theme={theme}
              activeTab={activeTab} setActiveTab={setActiveTab}
              generatedFiles={generatedFiles} activeFile={activeFile} setActiveFile={setActiveFile}
              previewHtml={previewHtml} terminalOutput={terminalOutput} setTerminalOutput={setTerminalOutput}
              isConsoleOpen={isConsoleOpen} setIsConsoleOpen={setIsConsoleOpen}
              handleRunCode={handleRunCode} setIsPublishModalOpen={setIsPublishModalOpen} setIsEnvModalOpen={setIsEnvModalOpen} 
              actionLogs={actionLogs} prompt={prompt} setPrompt={setPrompt}
              handleGenerate={handleGenerate} isGenerating={isGenerating}
              toggleListening={toggleListening} isListening={isListening}
              handleCodeChange={handleCodeChange} saveProject={saveCurrentProject} handleBuildApk={handleBuildApk}
          />
        </div>
      )}

      {/* 🌍 PUBLISH APP MODAL */}
      {isPublishModalOpen && ( 
           <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
             <div className={`border rounded-xl w-full max-w-3xl overflow-hidden flex flex-col shadow-2xl ${bgCard}`}>
                <div className={`flex justify-between items-center p-5 border-b ${theme==='dark'?'border-[#2b2b2b] bg-[#0A0A0E]':'border-gray-200 bg-gray-50'}`}>
                    <h2 className={`text-xl font-bold flex items-center gap-2 ${theme==='dark'?'text-white':'text-black'}`}>🌍 Publish Your App</h2>
                    <button onClick={() => setIsPublishModalOpen(false)} className="text-gray-400 hover:text-red-500 transition"><CloseIcon/></button>
                </div>
                <div className="flex flex-col md:flex-row h-full">
                    {/* LEFT TABS */}
                    <div className={`w-full md:w-1/3 border-r p-3 flex flex-col gap-2 ${theme==='dark'?'border-[#2b2b2b] bg-[#0A0A0E]':'border-gray-200 bg-gray-50'}`}>
                        <button onClick={() => setPublishMethod('cloud')} className={`p-3 text-left rounded-lg border transition-all ${publishMethod === 'cloud' ? 'bg-blue-600/20 border-blue-500 text-blue-500' : `border-transparent ${textMuted} hover:border-gray-500`}`}><h3 className="font-bold text-sm">☁️ Mantu Cloud</h3><p className="text-[10px] mt-1">Free 1-Click Subdomain</p></button>
                        <button onClick={() => setPublishMethod('aws')} className={`p-3 text-left rounded-lg border transition-all ${publishMethod === 'aws' ? 'bg-amber-500/20 border-amber-500 text-amber-500' : `border-transparent ${textMuted} hover:border-gray-500`}`}><h3 className="font-bold text-sm">🌩️ AWS EC2 Auto</h3><p className="text-[10px] mt-1">Deploy to your own server</p></button>
                        <button onClick={() => setPublishMethod('github')} className={`p-3 text-left rounded-lg border transition-all ${publishMethod === 'github' ? 'bg-gray-500/20 border-gray-500 text-gray-300' : `border-transparent ${textMuted} hover:border-gray-500`}`}><h3 className="font-bold text-sm flex items-center gap-1"><GithubIcon/> GitHub Push</h3><p className="text-[10px] mt-1">Push code to repository</p></button>
                        <button onClick={() => setPublishMethod('custom')} className={`p-3 text-left rounded-lg border transition-all ${publishMethod === 'custom' ? 'bg-orange-500/20 border-orange-500 text-orange-500' : `border-transparent ${textMuted} hover:border-gray-500`}`}><h3 className="font-bold text-sm">🔗 Custom Domain</h3><p className="text-[10px] mt-1">PRO Feature (₹699)</p></button>
                    </div>

                    {/* RIGHT CONTENT */}
                    <div className={`w-full md:w-2/3 p-6 ${theme==='dark'?'bg-[#111116]':'bg-white'}`}>
                        {publishMethod === 'cloud' && ( <div className="space-y-4"><h3 className="text-lg font-bold text-blue-500">Instant Global Deployment</h3><button onClick={handlePublish} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg mt-4 shadow-[0_0_15px_rgba(37,99,235,0.4)]">🚀 Go Live Now</button></div> )}
                        {publishMethod === 'aws' && (
                            <div className="space-y-4"><h3 className="text-lg font-bold text-amber-500">AWS Automatic Deployment</h3>
                                <div className="grid grid-cols-2 gap-3 mt-2">
                                    <button onClick={() => setAwsInstance('cpu')} className={`p-3 border rounded-xl text-left ${awsInstance === 'cpu' ? 'border-amber-500 bg-amber-500/10' : `border-gray-500 ${theme==='dark'?'bg-[#1e1e1e]':'bg-gray-100'}`}`}><h4 className={`font-bold text-sm ${theme==='dark'?'text-white':'text-black'}`}>🖥️ CPU Instance</h4><p className="text-[10px] text-gray-500 mt-1">t2.micro / t3.small</p></button>
                                    <button onClick={() => setAwsInstance('gpu')} className={`p-3 border rounded-xl text-left relative ${awsInstance === 'gpu' ? 'border-purple-500 bg-purple-500/10' : `border-gray-500 ${theme==='dark'?'bg-[#1e1e1e]':'bg-gray-100'}`}`}><div className="absolute top-0 right-0 bg-purple-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-bl-lg">PRO</div><h4 className={`font-bold text-sm ${theme==='dark'?'text-white':'text-black'}`}>🚀 GPU Instance</h4><p className="text-[10px] text-gray-500 mt-1">g4dn.xlarge (T4/A10G)</p></button>
                                </div>
                                <div className="space-y-3 mt-4">
                                    <div><label className="text-xs text-gray-400 font-bold">Target IP Address</label><input type="text" value={awsTargetIp} onChange={e => setAwsTargetIp(e.target.value)} placeholder="e.g. 13.234.11.22" className={`w-full border rounded-md p-2 text-sm outline-none ${theme==='dark'?'bg-[#1e1e1e] border-[#2b2b2b] text-white':'bg-white border-gray-300 text-black'}`} /></div>
                                    <div><label className="text-xs text-gray-400 font-bold flex justify-between"><span>Server Auth Key / Password</span>{pemLoaded && <span className="text-green-500">✅ PEM Loaded</span>}</label>
                                        <div className="flex gap-2 mt-1"><input type="password" value={awsAuthKey} onChange={e => setAwsAuthKey(e.target.value)} placeholder="Enter PEM content or password" className={`flex-1 border rounded-md p-2 text-sm outline-none ${theme==='dark'?'bg-[#1e1e1e] border-[#2b2b2b] text-white':'bg-white border-gray-300 text-black'}`} /><label className={`border px-3 py-2 rounded-md cursor-pointer text-xs font-bold whitespace-nowrap ${theme==='dark'?'bg-[#1e1e1e] border-[#2b2b2b]':'bg-gray-100 border-gray-300'}`}>Upload .pem<input type="file" accept=".pem,.cer,.txt" className="hidden" onChange={handlePemUpload} /></label></div>
                                    </div>
                                </div>
                                <button onClick={handlePublish} disabled={!awsTargetIp} className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 text-white font-bold py-3 rounded-lg mt-2 shadow-[0_0_15px_rgba(245,158,11,0.4)]">Deploy to AWS {awsInstance.toUpperCase()}</button>
                            </div>
                        )}
                        {publishMethod === 'github' && ( <div className="space-y-4"><h3 className="text-lg font-bold">Push to GitHub</h3><input type="text" value={gitRepoName} onChange={e => setGitRepoName(e.target.value)} placeholder="Repo Name" className={`w-full border rounded-md p-2 text-sm mb-2 outline-none ${theme==='dark'?'bg-[#1e1e1e] border-[#2b2b2b] text-white':'bg-white border-gray-300 text-black'}`} /><input type="password" value={gitToken} onChange={e => setGitToken(e.target.value)} placeholder="GitHub Token" className={`w-full border rounded-md p-2 text-sm outline-none ${theme==='dark'?'bg-[#1e1e1e] border-[#2b2b2b] text-white':'bg-white border-gray-300 text-black'}`} /><button onClick={handlePublish} className={`w-full font-bold py-3 rounded-lg mt-4 ${theme==='dark'?'bg-white text-black':'bg-gray-900 text-white'}`}>Commit & Push</button></div> )}
                        {publishMethod === 'custom' && ( <div className="space-y-4"><h3 className="text-lg font-bold text-orange-500">Connect .COM Domain</h3><p className={`text-sm ${textMuted}`}>Make it professional. Connect your own custom domain name directly to Mantu Cloud.</p><div><label className="text-xs text-gray-400 font-bold">Your Domain</label><input type="text" placeholder="e.g. www.mantu-app.com" className={`w-full border rounded-md p-2 text-sm mt-1 outline-none border-orange-500/50 ${theme==='dark'?'bg-[#1e1e1e] text-white':'bg-white text-black'}`} /></div><button onClick={handlePublish} className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white font-bold py-3 rounded-lg mt-2 shadow-lg">💳 Pay ₹699 to Unlock</button></div> )}
                    </div>
                </div>
             </div>
           </div>
        )}
      {/* 🔐 ENV VARIABLES MODAL */}
      {isEnvModalOpen && ( <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"><div className={`border rounded-xl w-full max-w-md p-5 ${bgCard}`}><div className="flex justify-between items-center mb-4"><h2 className={`text-lg font-bold ${theme==='dark'?'text-white':'text-black'}`}>🔐 Env Variables</h2><button onClick={() => setIsEnvModalOpen(false)} className="text-gray-400"><CloseIcon/></button></div><div className="space-y-3 max-h-[60vh] overflow-y-auto">{projectEnv.map((env, index) => (<div key={index} className="flex gap-2"><input type="text" placeholder="KEY" value={env.key} onChange={(e) => { const newEnv = [...projectEnv]; newEnv[index].key = e.target.value; setProjectEnv(newEnv); }} className={`w-1/3 border rounded p-2 text-xs outline-none ${theme==='dark'?'bg-[#1e1e1e] border-[#2b2b2b] text-white':'bg-white border-gray-300 text-black'}`} /><input type="password" placeholder="VALUE" value={env.value} onChange={(e) => { const newEnv = [...projectEnv]; newEnv[index].value = e.target.value; setProjectEnv(newEnv); }} className={`flex-1 border rounded p-2 text-xs outline-none ${theme==='dark'?'bg-[#1e1e1e] border-[#2b2b2b] text-white':'bg-white border-gray-300 text-black'}`} /><button onClick={() => { const newEnv = projectEnv.filter((_, i) => i !== index); setProjectEnv(newEnv.length ? newEnv : [{key:'', value:''}]); }} className="text-red-500 p-2 text-xs font-bold">X</button></div>))}</div><button onClick={() => setProjectEnv([...projectEnv, { key: '', value: '' }])} className="text-xs text-blue-500 font-bold w-full text-left py-2">+ Add Variable</button><button onClick={() => setIsEnvModalOpen(false)} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded-md mt-4">Save Keys</button></div></div> )}
      
      {/* 📂 PROJECTS HISTORY MODAL */}
      {isProjectsOpen && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className={`border rounded-xl w-full max-w-2xl p-5 shadow-2xl ${bgCard}`}>
                  <div className="flex justify-between items-center mb-4"><h2 className={`text-xl font-bold ${theme==='dark'?'text-white':'text-black'}`}>📂 My Projects</h2><button onClick={() => setIsProjectsOpen(false)} className="text-red-500 font-bold text-lg">X</button></div>
                  <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                      {projects.length === 0 ? <p className={textMuted}>No saved projects yet. Click "Save Project" in the workspace!</p> :
                       projects.map(proj => (
                          <div key={proj.id} className={`flex items-center justify-between p-4 border rounded-lg transition-all ${theme==='dark'?'bg-[#1e1e1e] border-[#3b3b3b] hover:border-blue-500':'bg-gray-50 border-gray-200 hover:border-blue-500'}`}>
                              <div className="cursor-pointer flex-1" onClick={() => loadProject(proj)}>
                                  <h3 className={`font-bold ${theme==='dark'?'text-blue-400':'text-blue-600'}`}>{proj.title}</h3>
                                  <p className={`text-xs mt-1 ${textMuted}`}>{Object.keys(proj.files).length} Files • {new Date(proj.id).toLocaleString()}</p>
                              </div>
                              <button onClick={() => deleteProject(proj.id)} className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white px-3 py-1.5 rounded text-xs font-bold transition">Delete</button>
                          </div>
                      ))}
                  </div>
              </div>
          </div>
      )}

      {/* ⚙️ MULTI-MODEL SETTINGS MODAL */}
      {isSettingsOpen && ( 
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className={`border rounded-xl w-full max-w-md p-5 shadow-2xl ${bgCard}`}>
                  <div className="flex justify-between items-center mb-4"><h2 className={`text-lg font-bold flex items-center gap-2 ${theme==='dark'?'text-white':'text-black'}`}>⚙️ Settings & Models</h2><button onClick={() => setIsSettingsOpen(false)} className="text-red-500 font-bold text-lg">X</button></div>
                  <div className="space-y-4">
                      <div>
                          <label className="text-xs text-purple-500 font-bold block mb-1">Select Active AI Engine</label>
                          <select value={settings.aiModel || 'groq'} onChange={e => setSettings({...settings, aiModel: e.target.value})} className={`w-full border rounded-md p-2 text-sm font-bold outline-none ${theme==='dark'?'bg-[#1e1e1e] border-[#3b3b3b] text-white':'bg-white border-gray-300 text-black'}`}>
                              <option value="groq">⚡ Groq Llama-3.3 (Fastest)</option>
                              <option value="gemini">🧠 Gemini 1.5 Pro (Multimodal)</option>
                              <option value="openai">🤖 OpenAI GPT-4o (Premium)</option>
                          </select>
                      </div>
                      <div>
                          <label className="text-xs text-blue-500 font-bold block mb-1">Backend URL (API Host)</label>
                          <input type="text" value={settings.awsIp} onChange={e => setSettings({...settings, awsIp: e.target.value})} placeholder="e.g. https://visora-code.onrender.com" className={`w-full border rounded-md p-2 text-sm outline-none ${theme==='dark'?'bg-[#1e1e1e] border-[#2b2b2b] text-white':'bg-white border-gray-300 text-black'}`} />
                      </div>
                      <button onClick={saveSettings} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-md mt-4 shadow-lg">Save Configuration</button>
                  </div>
              </div>
          </div> 
      )}
    </div>
  );
}
