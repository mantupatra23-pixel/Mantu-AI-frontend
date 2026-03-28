import React, { useState, useEffect, useRef } from 'react';
import Workspace from './Workspace';
import { SparkleIcon, SettingsIcon, TerminalIcon, CloseIcon, GithubIcon } from './Icons';

export default function App() {
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

  // ⚡ ACTION TIMELINE STATE
  const [actionLogs, setActionLogs] = useState([]);

  // 🎤 Live Voice Typing State
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  // 📎 Attachments State
  const [attachedImage, setAttachedImage] = useState(null);
  const [attachedVoice, setAttachedVoice] = useState(null);
  const [voiceUrl, setVoiceUrl] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  
  const imageInputRef = useRef(null);
  const voiceInputRef = useRef(null);

  // ⚙️ Settings & Deploy States
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settings, setSettings] = useState({ awsIp: '', netlifyToken: '', groqKey: '' });
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
      if (saved) setSettings(JSON.parse(saved)); 
  }, []);

  const saveSettings = () => { 
      localStorage.setItem('mantuSettings', JSON.stringify(settings)); 
      setIsSettingsOpen(false); 
      setTerminalOutput("> Settings Saved Successfully.");
      setIsConsoleOpen(true);
  };

  // 🎙️ LIVE VOICE TYPING
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
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
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
      let htmlFile = generatedFiles['index.html'] || generatedFiles['public/index.html'] || `<div id="root" class="flex items-center justify-center h-screen text-gray-500 font-sans bg-[#030303]">Building UI...</div>`;
      let cssFile = generatedFiles['styles.css'] || generatedFiles['App.css'] || generatedFiles['global.css'] || generatedFiles['index.css'] || "";
      let reactCode = generatedFiles['App.jsx'] || generatedFiles['index.jsx'] || generatedFiles['src/App.jsx'] || generatedFiles['src/main.jsx'] || "";
      const envObj = {}; projectEnv.forEach(e => { if (e.key.trim()) envObj[e.key.trim()] = e.value.trim(); });
      const reactImports = `<script>window.mantuEnv = ${JSON.stringify(envObj)}; window.process = { env: window.mantuEnv };</script><script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script><script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script><script src="https://unpkg.com/babel-standalone@6/babel.min.js"></script><script src="https://cdn.tailwindcss.com"></script><style>${cssFile}</style>`;
      let cleanReact = reactCode.replace(/import\s+.*?from\s+['"].*?['"];?/g, '').replace(/export\s+default\s+function/g, 'function').replace(/import\.meta\.env/g, 'window.mantuEnv').replace(/process\.env/g, 'window.mantuEnv');
      let executeReact = reactCode ? `<script type="text/babel" data-type="module">${cleanReact} const root = ReactDOM.createRoot(document.getElementById('root')); root.render(<App />);</script>` : "";
      setPreviewHtml(`<!DOCTYPE html><html><head>${reactImports}</head><body>${htmlFile}${executeReact}</body></html>`);
  };
  useEffect(() => { if (activeTab === 'preview') renderLivePreview(); }, [activeTab, generatedFiles, projectEnv]);

  // 🤖 2. THE AI GENERATOR
  const handleGenerate = async () => {
      if (!prompt.trim()) return;
      if (isListening) toggleListening(); 
      
      setActionLogs(prev => [...prev, { id: Date.now(), type: 'user', text: prompt }]);
      
      setIsGenerating(true);
      setView('editor');
      setIsConsoleOpen(true);
      
      // 🔥 FIX 1: Restore the initializing logs so you know it started
      if (view === 'home') {
          setGeneratedFiles({});
          setActionLogs([{ id: Date.now(), type: 'user', text: prompt }]); // Reset timeline
          setTerminalOutput("> Initializing Mantu AI Engine...\n> Architecting project blueprint...");
      } else {
          setTerminalOutput(prev => prev + "\n> Sending follow-up request to AI...");
      }
      
      try {
          // 🔥 FIX 2: Better URL handling for Render HTTPS backends
          let baseUrl = 'http://localhost:3000';
          if (settings.awsIp) {
              baseUrl = settings.awsIp.startsWith('http') ? settings.awsIp : `http://${settings.awsIp}:3000`;
          }

          const payload = { prompt, image: attachedImage, voice: attachedVoice, voiceUrl: voiceUrl, customSettings: { groqKey: settings.groqKey, awsIp: settings.awsIp } };

          const res = await fetch(`${baseUrl}/api/build`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
          
          if (!res.ok) throw new Error(`Backend returned status ${res.status}`);

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
                          setGeneratedFiles(prev => ({ ...prev, [data.filename]: data.code }));
                          setActiveFile(data.filename);
                      } else if (data.type === 'error') {
                          setTerminalOutput(prev => prev + `\n> ❌ ERROR: ${data.error}`);
                          setActionLogs(prev => [...prev, { id: Date.now(), type: 'log', agent: "System", status: "Error", details: data.error }]);
                      } else if (data.type === 'done') {
                          setActiveTab('preview');
                      }
                  }
              }
          }
      } catch (error) { 
          // 🔥 Will now properly show network/CORS errors in console
          setTerminalOutput(prev => prev + `\n> ❌ CONNECTION ERROR: ${error.message}\n> Tip: Make sure your Backend URL in Settings is correct (e.g., https://your-backend.onrender.com)`); 
      } 
      finally { setIsGenerating(false); setPrompt(''); setAttachedImage(null); setAttachedVoice(null); setVoiceUrl(''); }
  };

  const handleRunCode = async () => {
      if (!activeFile) return;
      setTerminalOutput(`> Running ${activeFile} in Mantu Sandbox...`);
      setIsConsoleOpen(true);
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

  return (
    <div className="min-h-screen bg-[#030303] text-white flex flex-col font-sans overflow-hidden">
      {/* 🔝 NAVBAR */}
      <nav className="h-14 flex items-center justify-between px-6 border-b border-white/10 shrink-0 bg-[#0A0A0E]">
        <div className="text-xl font-extrabold flex items-center gap-2 cursor-pointer" onClick={() => setView('home')}>
            <span className="text-blue-500 font-mono tracking-tighter">#</span> mantu_ai
        </div>
        <div className="flex items-center gap-4">
           <button onClick={() => setIsSettingsOpen(true)} className="text-gray-400 hover:text-white transition"><SettingsIcon/></button>
           {view === 'home' && Object.keys(generatedFiles).length > 0 && (
               <button onClick={() => setView('editor')} className="text-xs font-bold text-blue-400 hover:text-blue-300 transition bg-blue-500/10 px-4 py-1.5 rounded-full border border-blue-500/20">Resume Session →</button>
           )}
        </div>
      </nav>

      {/* 🏠 HOME VIEW */}
      {view === 'home' ? (
        <div className="flex-1 flex flex-col items-center pt-24 md:pt-32 p-4 relative">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-center tracking-tight">
                Build & Deploy in <span className="text-blue-500">Seconds</span>
            </h1>
            <p className="text-gray-400 mb-10 max-w-xl text-center text-sm md:text-base leading-relaxed">
                Describe your dream SaaS, App, or Dashboard. Mantu AI will write the code, bundle the project, and deploy it to a live global URL instantly.
            </p>
            
            {/* BIG PROMPT BOX */}
            <div className={`w-full max-w-4xl bg-[#111116] border ${isListening ? 'border-red-500 shadow-[0_0_40px_rgba(239,68,68,0.2)]' : 'border-[#2b2b2b] shadow-[0_0_40px_rgba(37,99,235,0.1)]'} rounded-2xl flex flex-col focus-within:border-blue-500/50 transition-all z-10`}>
                {(attachedImage || attachedVoice || showUrlInput) && (
                    <div className="flex items-center gap-3 p-3 border-b border-[#2b2b2b] bg-[#0A0A0E] rounded-t-2xl overflow-x-auto">
                        {attachedImage && ( <div className="relative shrink-0"><img src={attachedImage} alt="preview" className="h-12 w-12 object-cover rounded border border-[#3b3b3b]"/><button onClick={() => setAttachedImage(null)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-4 h-4 text-[10px] font-bold">X</button></div> )}
                        {attachedVoice && ( <div className="bg-blue-500/20 text-blue-400 text-xs px-3 py-1.5 rounded-full flex items-center gap-2 border border-blue-500/30">🎤 Audio Attached <button onClick={() => setAttachedVoice(null)} className="text-red-400 font-bold hover:text-red-300">X</button></div> )}
                        {showUrlInput && ( <div className="flex items-center gap-2 w-full max-w-sm"><input type="url" value={voiceUrl} onChange={(e)=>setVoiceUrl(e.target.value)} placeholder="Paste Voice URL here..." className="w-full bg-[#1e1e1e] border border-[#3b3b3b] rounded p-1 text-xs text-white outline-none focus:border-blue-500"/><button onClick={()=>{setShowUrlInput(false); setVoiceUrl('');}} className="text-gray-400 hover:text-red-400 text-xs font-bold">Cancel</button></div> )}
                    </div>
                )}
                <div className="flex flex-col p-2 relative">
                    <textarea 
                        value={prompt} onChange={(e) => setPrompt(e.target.value)} 
                        placeholder={isListening ? "Listening... Speak now!" : "e.g. Build an AI video generator SaaS with a dark theme..."}
                        className={`w-full bg-transparent border-none outline-none p-4 text-white resize-none min-h-[120px] md:min-h-[160px] text-lg font-medium leading-relaxed ${isListening ? 'placeholder-red-400' : ''}`}
                        onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleGenerate(); } }}
                    />
                    <div className="flex items-center justify-between p-2 mt-2">
                        <div className="flex items-center gap-2 pl-2">
                            <button onClick={toggleListening} className={`p-2 transition rounded-full ${isListening ? 'text-red-500 bg-red-500/20 animate-pulse' : 'text-gray-400 bg-[#1e1e1e] hover:text-white border border-[#2b2b2b]'}`} title="Live Voice Typing"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path></svg></button>
                            <input type="file" ref={imageInputRef} onChange={(e) => handleFileUpload(e, 'image')} accept="image/*" className="hidden" />
                            <button onClick={() => imageInputRef.current.click()} className="text-gray-400 bg-[#1e1e1e] hover:text-white p-2 rounded-full border border-[#2b2b2b] transition" title="Upload Image"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg></button>
                            <input type="file" ref={voiceInputRef} onChange={(e) => handleFileUpload(e, 'voice')} accept="audio/*" className="hidden" />
                            <button onClick={() => voiceInputRef.current.click()} className="text-gray-400 bg-[#1e1e1e] hover:text-white p-2 rounded-full border border-[#2b2b2b] transition" title="Upload Audio File"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"></path><path d="M19 10v2a7 7 0 01-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line></svg></button>
                            <button onClick={() => setShowUrlInput(!showUrlInput)} className="text-gray-400 bg-[#1e1e1e] hover:text-white p-2 rounded-full border border-[#2b2b2b] transition" title="Attach Voice URL"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"></path></svg></button>
                        </div>
                        <button onClick={handleGenerate} disabled={isGenerating || !prompt.trim()} className="bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition shadow-lg">
                            {isGenerating ? 'Building...' : <><SparkleIcon /> Generate Project</>}
                        </button>
                    </div>
                </div>
            </div>
            
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-blue-600/5 blur-[150px] rounded-full pointer-events-none"></div>
        </div>
      ) : (
        /* 💻 WORKSPACE VIEW */
        <div className="flex flex-1 overflow-hidden flex-row w-full">
          <Workspace 
              activeTab={activeTab} setActiveTab={setActiveTab}
              generatedFiles={generatedFiles} activeFile={activeFile} setActiveFile={setActiveFile}
              previewHtml={previewHtml} terminalOutput={terminalOutput} setTerminalOutput={setTerminalOutput}
              isConsoleOpen={isConsoleOpen} setIsConsoleOpen={setIsConsoleOpen}
              handleRunCode={handleRunCode} setIsPublishModalOpen={setIsPublishModalOpen} setIsEnvModalOpen={setIsEnvModalOpen} 
              
              actionLogs={actionLogs}
              prompt={prompt}
              setPrompt={setPrompt}
              handleGenerate={handleGenerate}
              isGenerating={isGenerating}
              toggleListening={toggleListening}
              isListening={isListening}
          />
        </div>
      )}

      {/* 🌍 MODALS */}
      {isPublishModalOpen && ( 
           <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
             <div className="bg-[#111116] border border-[#3b3b3b] rounded-xl w-full max-w-3xl overflow-hidden flex flex-col shadow-2xl">
                <div className="flex justify-between items-center p-5 border-b border-[#2b2b2b] bg-[#0A0A0E]"><h2 className="text-xl font-bold text-white flex items-center gap-2">🌍 Publish Your App</h2><button onClick={() => setIsPublishModalOpen(false)} className="text-gray-400 hover:text-red-400 transition"><CloseIcon/></button></div>
                <div className="flex flex-col md:flex-row h-full">
                    <div className="w-full md:w-1/3 bg-[#0A0A0E] border-r border-[#2b2b2b] p-3 flex flex-col gap-2">
                        <button onClick={() => setPublishMethod('cloud')} className={`p-3 text-left rounded-lg border transition-all ${publishMethod === 'cloud' ? 'bg-blue-600/20 border-blue-500 text-blue-400' : 'bg-[#1e1e1e] border-transparent text-gray-400 hover:text-white'}`}><h3 className="font-bold text-sm">☁️ Mantu Cloud</h3><p className="text-[10px] mt-1">Free 1-Click Subdomain</p></button>
                        <button onClick={() => setPublishMethod('aws')} className={`p-3 text-left rounded-lg border transition-all ${publishMethod === 'aws' ? 'bg-amber-500/20 border-amber-500 text-amber-400' : 'bg-[#1e1e1e] border-transparent text-gray-400 hover:text-white'}`}><h3 className="font-bold text-sm">🌩️ Custom EC2 Auto</h3><p className="text-[10px] mt-1">Deploy to your own server</p></button>
                        <button onClick={() => setPublishMethod('github')} className={`p-3 text-left rounded-lg border transition-all ${publishMethod === 'github' ? 'bg-white/10 border-white text-white' : 'bg-[#1e1e1e] border-transparent text-gray-400 hover:text-white'}`}><h3 className="font-bold text-sm flex items-center gap-1"><GithubIcon/> GitHub Push</h3><p className="text-[10px] mt-1">Push code to repository</p></button>
                    </div>
                    <div className="w-full md:w-2/3 p-6 bg-[#111116]">
                        {publishMethod === 'cloud' && ( <div className="space-y-4"><h3 className="text-lg font-bold text-blue-400">Instant Global Deployment</h3><button onClick={handlePublish} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg mt-4 shadow-[0_0_15px_rgba(37,99,235,0.4)]">🚀 Go Live Now</button></div> )}
                        {publishMethod === 'aws' && (
                            <div className="space-y-4"><h3 className="text-lg font-bold text-amber-400">Custom AWS Server Deploy</h3>
                                <div className="grid grid-cols-2 gap-3 mt-2">
                                    <button onClick={() => setAwsInstance('cpu')} className={`p-3 border rounded-xl text-left ${awsInstance === 'cpu' ? 'border-amber-500 bg-amber-500/10' : 'border-[#2b2b2b] bg-[#1e1e1e]'}`}><h4 className="font-bold text-white text-sm">🖥️ CPU (t2/t3)</h4></button>
                                    <button onClick={() => setAwsInstance('gpu')} className={`p-3 border rounded-xl text-left ${awsInstance === 'gpu' ? 'border-purple-500 bg-purple-500/10' : 'border-[#2b2b2b] bg-[#1e1e1e]'}`}><h4 className="font-bold text-white text-sm">🚀 GPU (A10G/T4)</h4></button>
                                </div>
                                <div className="space-y-3 mt-4">
                                    <div><label className="text-xs text-gray-400 font-bold">Target IP</label><input type="text" value={awsTargetIp} onChange={e => setAwsTargetIp(e.target.value)} className="w-full bg-[#1e1e1e] border border-[#2b2b2b] rounded-md p-2 text-sm text-white outline-none" /></div>
                                    <div><label className="text-xs text-gray-400 font-bold flex justify-between"><span>Auth Key / Password</span>{pemLoaded && <span className="text-green-400">✅ PEM Loaded</span>}</label>
                                        <div className="flex gap-2 mt-1"><input type="password" value={awsAuthKey} onChange={e => setAwsAuthKey(e.target.value)} className="flex-1 bg-[#1e1e1e] border border-[#2b2b2b] rounded-md p-2 text-sm text-white outline-none" /><label className="bg-[#1e1e1e] border border-[#2b2b2b] px-3 py-2 rounded-md cursor-pointer text-xs font-bold whitespace-nowrap">Upload .pem<input type="file" accept=".pem,.cer,.txt" className="hidden" onChange={handlePemUpload} /></label></div>
                                    </div>
                                </div>
                                <button onClick={handlePublish} disabled={!awsTargetIp} className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 text-white font-bold py-3 rounded-lg mt-2 shadow-[0_0_15px_rgba(245,158,11,0.4)]">Push to {awsTargetIp || 'AWS Server'}</button>
                            </div>
                        )}
                        {publishMethod === 'github' && ( <div className="space-y-4"><h3 className="text-lg font-bold">Push to GitHub</h3><input type="text" value={gitRepoName} onChange={e => setGitRepoName(e.target.value)} placeholder="Repo Name" className="w-full bg-[#1e1e1e] border border-[#2b2b2b] rounded-md p-2 text-sm text-white mb-2 outline-none" /><input type="password" value={gitToken} onChange={e => setGitToken(e.target.value)} placeholder="GitHub Token" className="w-full bg-[#1e1e1e] border border-[#2b2b2b] rounded-md p-2 text-sm text-white outline-none" /><button onClick={handlePublish} className="w-full bg-white hover:bg-gray-200 text-black font-bold py-3 rounded-lg mt-4">Commit & Push</button></div> )}
                    </div>
                </div>
             </div>
           </div>
        )}
      {isEnvModalOpen && ( <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"><div className="bg-[#111116] border border-[#3b3b3b] rounded-xl w-full max-w-md p-5"><div className="flex justify-between items-center mb-4"><h2 className="text-lg font-bold text-white">🔐 Env Variables</h2><button onClick={() => setIsEnvModalOpen(false)} className="text-gray-400"><CloseIcon/></button></div><div className="space-y-3 max-h-[60vh] overflow-y-auto">{projectEnv.map((env, index) => (<div key={index} className="flex gap-2"><input type="text" placeholder="KEY" value={env.key} onChange={(e) => { const newEnv = [...projectEnv]; newEnv[index].key = e.target.value; setProjectEnv(newEnv); }} className="w-1/3 bg-[#1e1e1e] border border-[#2b2b2b] rounded p-2 text-xs text-white outline-none" /><input type="password" placeholder="VALUE" value={env.value} onChange={(e) => { const newEnv = [...projectEnv]; newEnv[index].value = e.target.value; setProjectEnv(newEnv); }} className="flex-1 bg-[#1e1e1e] border border-[#2b2b2b] rounded p-2 text-xs text-white outline-none" /><button onClick={() => { const newEnv = projectEnv.filter((_, i) => i !== index); setProjectEnv(newEnv.length ? newEnv : [{key:'', value:''}]); }} className="text-red-400 p-2 text-xs font-bold">X</button></div>))}</div><button onClick={() => setProjectEnv([...projectEnv, { key: '', value: '' }])} className="text-xs text-blue-400 font-bold w-full text-left py-2">+ Add Variable</button><button onClick={() => setIsEnvModalOpen(false)} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded-md mt-4">Save Keys</button></div></div> )}
      
      {isSettingsOpen && ( <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"><div className="bg-[#111116] border border-[#3b3b3b] rounded-xl w-full max-w-md p-5"><div className="flex justify-between items-center mb-4"><h2 className="text-lg font-bold text-white">⚙️ Core Settings</h2><button onClick={() => setIsSettingsOpen(false)} className="text-gray-400"><CloseIcon/></button></div><div className="space-y-4"><div><label className="text-xs text-blue-400 font-bold block mb-1">Backend URL (API Host)</label><input type="text" value={settings.awsIp} onChange={e => setSettings({...settings, awsIp: e.target.value})} placeholder="e.g. https://my-backend.onrender.com" className="w-full bg-[#1e1e1e] border border-blue-500/50 rounded-md p-2 text-sm text-white outline-none" /><p className="text-[10px] text-gray-500 mt-1">If your backend is on Render, paste the full HTTPS URL here.</p></div><div><label className="text-xs text-green-400 font-bold block mb-1">Netlify Default Token</label><input type="password" value={settings.netlifyToken} onChange={e => setSettings({...settings, netlifyToken: e.target.value})} className="w-full bg-[#1e1e1e] border border-green-500/50 rounded-md p-2 text-sm text-white outline-none" /></div><div><label className="text-xs text-orange-400 font-bold block mb-1">Groq API Key</label><input type="password" value={settings.groqKey || ''} onChange={e => setSettings({...settings, groqKey: e.target.value})} className="w-full bg-[#1e1e1e] border border-orange-500/50 rounded-md p-2 text-sm text-white outline-none" /></div><button onClick={saveSettings} className="w-full bg-white hover:bg-gray-200 text-black font-bold py-2.5 rounded-md mt-4">Save Configuration</button></div></div></div> )}
    </div>
  );
}
