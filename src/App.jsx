import React, { useState, useEffect } from 'react';
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

  // ⚙️ Settings State (Global Platform Settings)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settings, setSettings] = useState({ awsIp: '', netlifyToken: '', groqKey: '' });

  // 🌍 Publish Modal State
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [publishMethod, setPublishMethod] = useState('cloud'); // 'cloud', 'github', 'custom', 'aws'
  const [gitRepoName, setGitRepoName] = useState("");
  const [gitToken, setGitToken] = useState("");
  
  // 🌩️ AWS Specific Deploy States (User's Manual Inputs)
  const [awsInstance, setAwsInstance] = useState('cpu'); // 'cpu' or 'gpu'
  const [awsTargetIp, setAwsTargetIp] = useState(""); // The target server IP
  const [awsAuthKey, setAwsAuthKey] = useState(""); // Server password or PEM key

  // 🔐 Environment Variables State
  const [isEnvModalOpen, setIsEnvModalOpen] = useState(false);
  const [projectEnv, setProjectEnv] = useState([{ key: '', value: '' }]);

  // Load Settings on Start
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

  // 🖥️ 1. LIVE PREVIEW RENDERER
  const renderLivePreview = () => {
      let htmlFile = generatedFiles['index.html'] || generatedFiles['public/index.html'] || `<div id="root" class="flex items-center justify-center h-screen text-gray-500 font-sans bg-gray-50">App will render here...</div>`;
      let cssFile = generatedFiles['styles.css'] || generatedFiles['App.css'] || generatedFiles['global.css'] || generatedFiles['index.css'] || "";
      let reactCode = generatedFiles['App.jsx'] || generatedFiles['index.jsx'] || generatedFiles['src/App.jsx'] || generatedFiles['src/main.jsx'] || "";

      const envObj = {}; 
      projectEnv.forEach(e => { if (e.key.trim()) envObj[e.key.trim()] = e.value.trim(); });
      
      const reactImports = `<script>window.mantuEnv = ${JSON.stringify(envObj)}; window.process = { env: window.mantuEnv };</script><script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script><script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script><script src="https://unpkg.com/babel-standalone@6/babel.min.js"></script><script src="https://cdn.tailwindcss.com"></script><style>${cssFile}</style>`;
      let cleanReact = reactCode.replace(/import\s+.*?from\s+['"].*?['"];?/g, '').replace(/export\s+default\s+function/g, 'function').replace(/import\.meta\.env/g, 'window.mantuEnv').replace(/process\.env/g, 'window.mantuEnv');
      let executeReact = reactCode ? `<script type="text/babel" data-type="module">${cleanReact} const root = ReactDOM.createRoot(document.getElementById('root')); root.render(<App />);</script>` : "";
      
      setPreviewHtml(`<!DOCTYPE html><html><head>${reactImports}</head><body>${htmlFile}${executeReact}</body></html>`);
  };
  useEffect(() => { if (activeTab === 'preview') renderLivePreview(); }, [activeTab, generatedFiles, projectEnv]);

  // 🤖 2. THE AI GENERATOR
  const handleGenerate = async () => {
      if (!prompt.trim()) return;
      setIsGenerating(true);
      setView('editor');
      setTerminalOutput("> Initializing Mantu AI Engine...\n> Architecting project blueprint...");
      setIsConsoleOpen(true);
      setGeneratedFiles({});
      
      try {
          const baseUrl = settings.awsIp ? `http://${settings.awsIp}:3000` : 'http://localhost:3000';
          const res = await fetch(`${baseUrl}/api/build`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ prompt, customSettings: { groqKey: settings.groqKey, awsIp: settings.awsIp } })
          });

          const reader = res.body.getReader();
          const decoder = new TextDecoder();
          
          while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              const chunks = decoder.decode(value).split('\n\n');
              for (const chunk of chunks) {
                  if (chunk.startsWith('data: ')) {
                      const data = JSON.parse(chunk.replace('data: ', ''));
                      if (data.type === 'log') {
                          setTerminalOutput(prev => prev + `\n> [${data.agent}] ${data.details}`);
                      } else if (data.type === 'file') {
                          setGeneratedFiles(prev => ({ ...prev, [data.filename]: data.code }));
                          setActiveFile(data.filename);
                      } else if (data.type === 'error') {
                          setTerminalOutput(prev => prev + `\n> ❌ ERROR: ${data.error}`);
                      } else if (data.type === 'done') {
                          setTerminalOutput(prev => prev + `\n> ✅ Project generated successfully!`);
                          setActiveTab('preview');
                      }
                  }
              }
          }
      } catch (error) {
          setTerminalOutput(prev => prev + `\n> ❌ CONNECTION ERROR: ${error.message}\n> Please check if your Backend is running on Port 3000.`);
      } finally {
          setIsGenerating(false);
      }
  };

  // 💻 3. RUN SANDBOX
  const handleRunCode = async () => {
      if (!activeFile) return;
      setTerminalOutput(`> Running ${activeFile} in Mantu Sandbox...`);
      setIsConsoleOpen(true);
      try {
          const baseUrl = settings.awsIp ? `http://${settings.awsIp}:3000` : 'http://localhost:3000';
          const res = await fetch(`${baseUrl}/api/run`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ filename: activeFile, code: generatedFiles[activeFile] })
          });
          const data = await res.json();
          if (data.error) setTerminalOutput(prev => prev + `\n> ❌ Sandbox Error:\n${data.error}`);
          if (data.output) setTerminalOutput(prev => prev + `\n> ✅ Output:\n${data.output}`);
      } catch (e) {
          setTerminalOutput(prev => prev + `\n> ❌ Request Failed: ${e.message}`);
      }
  };

  // 🌍 4. PUBLISH APP
  const handlePublish = async () => {
      setIsPublishModalOpen(false);
      setIsConsoleOpen(true);

      if (publishMethod === 'custom') {
          setTerminalOutput("> ERROR: Custom Domain is a PRO feature. Payment Gateway integration pending. Charge ₹699 first!");
          return;
      }

      const baseUrl = settings.awsIp ? `http://${settings.awsIp}:3000` : 'http://localhost:3000';
      const apiUrl = `${baseUrl}/api/publish-${publishMethod}`;
      
      let payload = { files: generatedFiles };
      
      // Attach payload based on user's choice
      if (publishMethod === 'cloud') payload.netlifyToken = settings.netlifyToken;
      if (publishMethod === 'github') { payload.repoName = gitRepoName; payload.token = gitToken; }
      if (publishMethod === 'aws') { 
          payload.instanceType = awsInstance;
          payload.targetIp = awsTargetIp;  // 🔥 User's Manual IP
          payload.authKey = awsAuthKey;    // 🔥 User's Server Key
      }

      setTerminalOutput(`> 🚀 Initiating Deployment via ${publishMethod.toUpperCase()}...\n> Packaging files and sending to target server...`);

      try {
          const res = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
          const data = await res.json();
          
          if(data.success) {
              setTerminalOutput(`> 🎉 SUCCESS! Your app is LIVE!\n> 🌍 URL: ${data.url || awsTargetIp}`);
              if (data.url && data.url.startsWith('http')) window.open(data.url, "_blank"); 
          } else {
              setTerminalOutput(`> ❌ DEPLOY ERROR: ${data.error}`);
          }
      } catch (e) { 
          setTerminalOutput("> ❌ Failed to connect to Backend Server. Is Port 3000 open?"); 
      }
  };

  return (
    <div className="min-h-screen bg-[#030303] text-white flex flex-col font-sans overflow-hidden">
      {/* 🔝 NAVBAR */}
      <nav className="h-16 flex items-center justify-between px-6 border-b border-white/10 shrink-0">
        <div className="text-2xl font-extrabold flex items-center gap-2 cursor-pointer" onClick={() => setView('home')}>
            <span className="text-blue-600">Mantu</span> Cloud
        </div>
        <div className="flex items-center gap-4">
           <button onClick={() => setIsSettingsOpen(true)} className="text-gray-400 hover:text-white transition" title="Platform Settings"><SettingsIcon/></button>
           {view === 'home' && Object.keys(generatedFiles).length > 0 && (
               <button onClick={() => setView('editor')} className="text-sm font-medium text-blue-400 hover:text-blue-300 transition bg-blue-500/10 px-4 py-1.5 rounded-full border border-blue-500/20">Return to Workspace →</button>
           )}
        </div>
      </nav>

      {/* 🏠 HOME VIEW */}
      {view === 'home' ? (
        <div className="flex-1 flex flex-col items-center justify-center p-4 relative">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-center tracking-tight">
                Build & Deploy in <span className="text-blue-500">Seconds</span>
            </h1>
            <p className="text-gray-400 mb-8 max-w-xl text-center text-sm md:text-base leading-relaxed">
                Describe your dream SaaS, App, or Dashboard. Mantu AI will write the code, bundle the project, and deploy it to a live global URL instantly.
            </p>
            
            <div className="w-full max-w-3xl bg-[#111116] border border-[#2b2b2b] rounded-2xl p-2 flex items-center shadow-[0_0_30px_rgba(37,99,235,0.15)] focus-within:border-blue-500/50 transition-all z-10">
                <textarea 
                    value={prompt} 
                    onChange={(e) => setPrompt(e.target.value)} 
                    placeholder="e.g. Build an AI video generator SaaS with a dark theme..." 
                    className="flex-1 bg-transparent border-none outline-none p-4 text-white resize-none h-14 md:h-16 text-sm md:text-base font-medium"
                    onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleGenerate(); } }}
                />
                <button 
                    onClick={handleGenerate} 
                    disabled={isGenerating || !prompt.trim()} 
                    className="bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white p-3 md:px-6 md:py-4 rounded-xl font-bold flex items-center gap-2 transition"
                >
                    {isGenerating ? 'Building...' : <><SparkleIcon /> Generate</>}
                </button>
            </div>
            
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/5 blur-[150px] rounded-full pointer-events-none"></div>
        </div>
      ) : (
        /* 💻 WORKSPACE VIEW */
        <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
          <Workspace 
              activeTab={activeTab} setActiveTab={setActiveTab}
              generatedFiles={generatedFiles} activeFile={activeFile} setActiveFile={setActiveFile}
              previewHtml={previewHtml} terminalOutput={terminalOutput} setTerminalOutput={setTerminalOutput}
              isConsoleOpen={isConsoleOpen} setIsConsoleOpen={setIsConsoleOpen}
              handleRunCode={handleRunCode} 
              setIsPublishModalOpen={setIsPublishModalOpen} 
              setIsEnvModalOpen={setIsEnvModalOpen} 
          />
        </div>
      )}

      {/* 🌍 PUBLISH MODAL */}
      {isPublishModalOpen && (
           <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
             <div className="bg-[#111116] border border-[#3b3b3b] rounded-xl w-full max-w-3xl overflow-hidden flex flex-col shadow-2xl">
                <div className="flex justify-between items-center p-5 border-b border-[#2b2b2b] bg-[#0A0A0E]">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">🌍 Publish Your App</h2>
                    <button onClick={() => setIsPublishModalOpen(false)} className="text-gray-400 hover:text-red-400 transition"><CloseIcon/></button>
                </div>
                
                <div className="flex flex-col md:flex-row h-full">
                    {/* Sidebar Options */}
                    <div className="w-full md:w-1/3 bg-[#0A0A0E] border-r border-[#2b2b2b] p-3 flex flex-col gap-2">
                        <button onClick={() => setPublishMethod('cloud')} className={`p-3 text-left rounded-lg border transition-all ${publishMethod === 'cloud' ? 'bg-blue-600/20 border-blue-500 text-blue-400' : 'bg-[#1e1e1e] border-transparent text-gray-400 hover:text-white'}`}>
                            <h3 className="font-bold text-sm">☁️ Mantu Cloud</h3>
                            <p className="text-[10px] mt-1">Free 1-Click Subdomain</p>
                        </button>
                        
                        <button onClick={() => setPublishMethod('aws')} className={`p-3 text-left rounded-lg border transition-all ${publishMethod === 'aws' ? 'bg-amber-500/20 border-amber-500 text-amber-400' : 'bg-[#1e1e1e] border-transparent text-gray-400 hover:text-white'}`}>
                            <h3 className="font-bold text-sm">🌩️ Custom EC2 Auto</h3>
                            <p className="text-[10px] mt-1">Deploy to your own server</p>
                        </button>

                        <button onClick={() => setPublishMethod('github')} className={`p-3 text-left rounded-lg border transition-all ${publishMethod === 'github' ? 'bg-white/10 border-white text-white' : 'bg-[#1e1e1e] border-transparent text-gray-400 hover:text-white'}`}>
                            <h3 className="font-bold text-sm flex items-center gap-1"><GithubIcon/> GitHub Push</h3>
                            <p className="text-[10px] mt-1">Push code to repository</p>
                        </button>
                        
                        <button onClick={() => setPublishMethod('custom')} className={`p-3 text-left rounded-lg border transition-all ${publishMethod === 'custom' ? 'bg-orange-500/20 border-orange-500 text-orange-400' : 'bg-[#1e1e1e] border-transparent text-gray-400 hover:text-white'}`}>
                            <h3 className="font-bold text-sm">🔗 Custom Domain</h3>
                            <p className="text-[10px] mt-1">PRO Feature (₹699)</p>
                        </button>
                    </div>

                    {/* Right Panel */}
                    <div className="w-full md:w-2/3 p-6 bg-[#111116]">
                        
                        {publishMethod === 'cloud' && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-blue-400">Instant Global Deployment</h3>
                                <p className="text-sm text-gray-400">Deploy your Frontend and Serverless Backend instantly. Zero configuration required. Your app will be live globally in 5 seconds.</p>
                                <div className="bg-[#1e1e1e] p-3 rounded border border-[#2b2b2b] text-sm text-green-400 font-mono">Cost: ₹0.00 / month</div>
                                <button onClick={handlePublish} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg mt-4 transition shadow-[0_0_15px_rgba(37,99,235,0.4)]">🚀 Go Live Now</button>
                            </div>
                        )}

                        {/* 🔥 AWS DEPLOY WITH MANUAL IP & GPU/CPU TOGGLE */}
                        {publishMethod === 'aws' && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-amber-400">Custom AWS Server Deploy</h3>
                                <p className="text-sm text-gray-400">Enter your server details to push code directly to your own EC2 instance.</p>
                                
                                <div className="grid grid-cols-2 gap-3 mt-2">
                                    <button onClick={() => setAwsInstance('cpu')} className={`p-3 border rounded-xl text-left transition-all ${awsInstance === 'cpu' ? 'border-amber-500 bg-amber-500/10' : 'border-[#2b2b2b] bg-[#1e1e1e] hover:border-gray-500'}`}>
                                        <h4 className="font-bold text-white mb-1 text-sm">🖥️ CPU (t2/t3)</h4>
                                        <p className="text-[10px] text-gray-400">Standard Web Apps</p>
                                    </button>
                                    <button onClick={() => setAwsInstance('gpu')} className={`p-3 border rounded-xl text-left transition-all relative overflow-hidden ${awsInstance === 'gpu' ? 'border-purple-500 bg-purple-500/10' : 'border-[#2b2b2b] bg-[#1e1e1e] hover:border-gray-500'}`}>
                                        <div className="absolute top-0 right-0 bg-purple-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-bl-lg">PRO</div>
                                        <h4 className="font-bold text-white mb-1 text-sm">🚀 GPU (A10G/T4)</h4>
                                        <p className="text-[10px] text-gray-400">AI / Video Rendering</p>
                                    </button>
                                </div>

                                <div className="space-y-3 mt-4">
                                    <div>
                                        <label className="text-xs text-gray-400 font-bold">Target IP Address</label>
                                        <input type="text" value={awsTargetIp} onChange={e => setAwsTargetIp(e.target.value)} placeholder="e.g. 13.234.11.22" className="w-full bg-[#1e1e1e] border border-[#2b2b2b] focus:border-amber-500 rounded-md p-2 text-sm text-white mt-1 outline-none transition" />
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-400 font-bold">Server Auth Key / Password</label>
                                        <input type="password" value={awsAuthKey} onChange={e => setAwsAuthKey(e.target.value)} placeholder="Enter PEM content or password" className="w-full bg-[#1e1e1e] border border-[#2b2b2b] focus:border-amber-500 rounded-md p-2 text-sm text-white mt-1 outline-none transition" />
                                    </div>
                                </div>

                                <button onClick={handlePublish} disabled={!awsTargetIp} className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:opacity-50 text-white font-bold py-3 rounded-lg mt-2 shadow-[0_0_15px_rgba(245,158,11,0.4)] transition">
                                    Push to {awsTargetIp || 'AWS Server'}
                                </button>
                            </div>
                        )}

                        {publishMethod === 'github' && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-bold">Push to GitHub</h3>
                                <div><label className="text-xs text-gray-400">Repository Name</label><input type="text" value={gitRepoName} onChange={e => setGitRepoName(e.target.value)} placeholder="e.g. my-awesome-app" className="w-full bg-[#1e1e1e] border border-[#2b2b2b] rounded-md p-2 text-sm text-white mt-1 outline-none" /></div>
                                <div><label className="text-xs text-gray-400">GitHub Token</label><input type="password" value={gitToken} onChange={e => setGitToken(e.target.value)} placeholder="ghp_xxxx..." className="w-full bg-[#1e1e1e] border border-[#2b2b2b] rounded-md p-2 text-sm text-white mt-1 outline-none" /></div>
                                <button onClick={handlePublish} className="w-full bg-white hover:bg-gray-200 text-black font-bold py-3 rounded-lg mt-2 transition">Commit & Push</button>
                            </div>
                        )}

                        {publishMethod === 'custom' && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-orange-400">Connect .COM Domain</h3>
                                <p className="text-sm text-gray-400">Make it professional. Connect your own custom domain name directly to Mantu Cloud.</p>
                                <div><label className="text-xs text-gray-400">Your Domain</label><input type="text" placeholder="e.g. www.mukesh-app.com" className="w-full bg-[#1e1e1e] border border-orange-500/50 rounded-md p-2 text-sm text-white mt-1 outline-none" /></div>
                                <button onClick={handlePublish} className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white font-bold py-3 rounded-lg mt-2 shadow-lg transition">💳 Pay ₹699 to Unlock</button>
                            </div>
                        )}
                    </div>
                </div>
             </div>
           </div>
        )}

      {/* 🔐 ENV VARIABLES MODAL */}
      {isEnvModalOpen && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-[#111116] border border-[#3b3b3b] rounded-xl w-full max-w-md p-5 shadow-2xl">
                  <div className="flex justify-between items-center mb-4"><h2 className="text-lg font-bold text-white">🔐 Environment Variables</h2><button onClick={() => setIsEnvModalOpen(false)} className="text-gray-400 hover:text-white"><CloseIcon/></button></div>
                  <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                      {projectEnv.map((env, index) => (
                          <div key={index} className="flex gap-2">
                              <input type="text" placeholder="KEY (e.g. API_URL)" value={env.key} onChange={(e) => { const newEnv = [...projectEnv]; newEnv[index].key = e.target.value; setProjectEnv(newEnv); }} className="w-1/3 bg-[#1e1e1e] border border-[#2b2b2b] rounded p-2 text-xs text-white outline-none" />
                              <input type="password" placeholder="VALUE" value={env.value} onChange={(e) => { const newEnv = [...projectEnv]; newEnv[index].value = e.target.value; setProjectEnv(newEnv); }} className="w-flex-1 w-full bg-[#1e1e1e] border border-[#2b2b2b] rounded p-2 text-xs text-white outline-none" />
                              <button onClick={() => { const newEnv = projectEnv.filter((_, i) => i !== index); setProjectEnv(newEnv.length ? newEnv : [{key:'', value:''}]); }} className="text-red-400 hover:text-red-300 p-2 text-xs font-bold">X</button>
                          </div>
                      ))}
                      <button onClick={() => setProjectEnv([...projectEnv, { key: '', value: '' }])} className="text-xs text-blue-400 font-bold w-full text-left py-2">+ Add Variable</button>
                  </div>
                  <button onClick={() => setIsEnvModalOpen(false)} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded-md mt-4 transition">Save Keys</button>
              </div>
          </div>
      )}

      {/* ⚙️ GLOBAL PLATFORM SETTINGS MODAL */}
      {isSettingsOpen && (
           <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
             <div className="bg-[#111116] border border-[#3b3b3b] rounded-xl w-full max-w-md p-5 shadow-2xl">
                <div className="flex justify-between items-center mb-4"><h2 className="text-lg font-bold text-white flex items-center gap-2">⚙️ Mantu Core Settings</h2><button onClick={() => setIsSettingsOpen(false)} className="text-gray-400 hover:text-red-400 transition"><CloseIcon/></button></div>
                <div className="space-y-4">
                    <div>
                        <label className="text-xs text-blue-400 font-bold block mb-1">Mantu Backend Master IP (Port 3000)</label>
                        <input type="text" value={settings.awsIp} onChange={e => setSettings({...settings, awsIp: e.target.value})} placeholder="e.g. 3.209.1.117" className="w-full bg-[#1e1e1e] border border-blue-500/50 rounded-md p-2 text-sm text-white outline-none focus:border-blue-500 transition" />
                        <p className="text-[10px] text-gray-500 mt-1">This connects your UI to your main Code Generation engine.</p>
                    </div>
                    <div>
                        <label className="text-xs text-green-400 font-bold block mb-1">Netlify Default Token (For Cloud Deploy)</label>
                        <input type="password" value={settings.netlifyToken} onChange={e => setSettings({...settings, netlifyToken: e.target.value})} placeholder="Enter Netlify API Key" className="w-full bg-[#1e1e1e] border border-green-500/50 rounded-md p-2 text-sm text-white outline-none focus:border-green-500 transition" />
                    </div>
                    <div>
                        <label className="text-xs text-orange-400 font-bold block mb-1">Groq API Key (AI Master Engine)</label>
                        <input type="password" value={settings.groqKey || ''} onChange={e => setSettings({...settings, groqKey: e.target.value})} placeholder="gsk_..." className="w-full bg-[#1e1e1e] border border-orange-500/50 rounded-md p-2 text-sm text-white outline-none focus:border-orange-500 transition" />
                    </div>
                    <button onClick={saveSettings} className="w-full bg-white hover:bg-gray-200 text-black font-bold py-2.5 rounded-md mt-4 transition shadow-lg">Save Configuration</button>
                </div>
             </div>
           </div>
        )}
    </div>
  );
}
