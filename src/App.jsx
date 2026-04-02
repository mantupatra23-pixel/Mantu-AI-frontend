import React, { useState, useEffect, useRef, Component } from 'react';
import AuthModal from './components/AuthModal';

// ==========================================
// 🛡️ ANTI-CRASH ERROR BOUNDARY
// ==========================================
class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { hasError: false, errorInfo: null }; }
  static getDerivedStateFromError(error) { return { hasError: true, errorInfo: error }; }
  componentDidCatch(error, errorInfo) { console.error("Mantu OS Fatal Crash:", error, errorInfo); }
  render() {
    if (this.state.hasError) {
      return (
        <div className="h-[100dvh] w-full bg-[#0a0a0c] flex flex-col items-center justify-center p-6 text-white font-sans">
          <div className="bg-red-500/10 border border-red-500/50 p-6 rounded-2xl max-w-2xl w-full text-center shadow-[0_0_30px_rgba(239,68,68,0.2)]">
            <h1 className="text-3xl font-black text-red-500 mb-4">⚠️ UI Crashed!</h1>
            <p className="text-gray-300 mb-4 text-sm">Mantu bhai, app mein ek runtime error aaya hai:</p>
            <pre className="bg-[#050505] p-4 rounded-lg text-left text-xs text-red-400 overflow-x-auto whitespace-pre-wrap font-mono border border-[#1f1f23]">{this.state.errorInfo?.toString() || "Unknown fatal error occurred."}</pre>
            <button onClick={() => { localStorage.clear(); window.location.reload(); }} className="mt-6 bg-white text-black px-6 py-2 rounded-lg font-bold hover:bg-gray-200 transition">Clear Data & Restart App</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// ==========================================
// 🎨 ALL ICONS
// ==========================================
const MantuLogo = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="url(#blue-grad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><defs><linearGradient id="blue-grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#3b82f6" /><stop offset="100%" stopColor="#8b5cf6" /></linearGradient></defs><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>;
const SparkleIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1-1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3Z"/></svg>;
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
const UserIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const SendIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>;
const HistoryIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>;

const globalStyles = `@keyframes marquee { 0% { transform: translateX(100vw); } 100% { transform: translateX(-100%); } } .animate-marquee { animation: marquee 30s linear infinite; display: inline-block; padding-left: 100%; } .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; } .custom-scrollbar::-webkit-scrollbar-track { background: transparent; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #2b2b36; border-radius: 4px; } .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #3b3b46; }`;

function MantuEngineApp() {
  const BACKEND_URL = "[https://visora-code.onrender.com](https://visora-code.onrender.com)"; 
  
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [prompt, setPrompt] = useState('');
  const [followUpPrompt, setFollowUpPrompt] = useState(''); 
  const [uploadedImage, setUploadedImage] = useState(null); 
  const [view, setView] = useState('home'); 
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('preview'); 
  const [generatedFiles, setGeneratedFiles] = useState({});
  const [activeFile, setActiveFile] = useState("");
  const [actionLogs, setActionLogs] = useState([]);
  const [terminalOutput, setTerminalOutput] = useState("> System Ready. Welcome to Mantu OS Enterprise.");
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const [isListening, setIsListening] = useState(false); 
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [publishMethod, setPublishMethod] = useState('github'); 
  const [awsTargetIp, setAwsTargetIp] = useState(""); 
  const [awsAuthKey, setAwsAuthKey] = useState(""); 
  const [githubToken, setGithubToken] = useState("");
  const [repoName, setRepoName] = useState("");
  const [customDomain, setCustomDomain] = useState(""); 
  const [isEnvModalOpen, setIsEnvModalOpen] = useState(false);
  const [projectEnv, setProjectEnv] = useState([{ key: '', value: '' }]);
  const [deployedUrl, setDeployedUrl] = useState(null); 

  const consoleEndRef = useRef(null);
  const fileInputRef = useRef(null); 
  const codeTextareaRef = useRef(null);
  const lineNumbersRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => { if (isConsoleOpen && consoleEndRef.current) consoleEndRef.current.scrollIntoView({ behavior: "smooth" }); }, [terminalOutput, isConsoleOpen]);

  useEffect(() => {
      try {
          const storedUser = localStorage.getItem('mantu_user');
          const token = localStorage.getItem('mantu_token');
          if (storedUser && token) {
              setCurrentUser(JSON.parse(storedUser));
              fetchCloudProjects(JSON.parse(storedUser).id, token);
          }
      } catch (error) { localStorage.removeItem('mantu_user'); localStorage.removeItem('mantu_token'); }
  }, []);

  const fetchCloudProjects = async (userId, token) => {
      try {
          const res = await fetch(`${BACKEND_URL}/api/get-projects?userId=${userId}`, { headers: { 'Authorization': `Bearer ${token}` }});
          const data = await res.json();
          if (data?.success) setProjects(data.data);
      } catch (err) {}
  };

  const handleAuthSuccess = (token, user) => {
      localStorage.setItem('mantu_token', token); localStorage.setItem('mantu_user', JSON.stringify(user));
      setCurrentUser(user); setIsAuthModalOpen(false);
      setTerminalOutput(prev => prev + `\n> 🔓 Access Granted. Welcome, ${user.name}.`);
      fetchCloudProjects(user.id, token);
  };

  const handleLogout = () => {
      localStorage.removeItem('mantu_token'); localStorage.removeItem('mantu_user');
      setCurrentUser(null); setProjects([]); setView('home');
      setTerminalOutput("> Logged out successfully.");
  };

  const toggleListening = (targetInput) => {
      if (isListening) { recognitionRef.current?.stop(); setIsListening(false); return; }
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) return alert("Voice Typing is not supported.");
      const recognition = new SpeechRecognition();
      recognition.continuous = true; recognition.interimResults = true;
      let initialPrompt = targetInput === 'followUp' ? followUpPrompt : prompt;
      recognition.onresult = (e) => {
          let trans = ''; for (let i = 0; i < e.results.length; i++) trans += e.results[i][0].transcript;
          if (targetInput === 'followUp') setFollowUpPrompt(initialPrompt + (initialPrompt ? ' ' : '') + trans);
          else setPrompt(initialPrompt + (initialPrompt ? ' ' : '') + trans);
      };
      recognition.onerror = () => setIsListening(false); recognition.onend = () => setIsListening(false);
      recognitionRef.current = recognition; recognition.start(); setIsListening(true);
  };

  const triggerBuild = async (text, isFollowUp = false) => {
      if (!text.trim() && !uploadedImage) return;
      if (!currentUser) return setIsAuthModalOpen(true); 

      setIsGenerating(true); setView('editor'); setActiveTab('preview'); setIsConsoleOpen(true); setDeployedUrl(null);
      if (!isFollowUp) setGeneratedFiles({});
      
      const newLogs = [...actionLogs, { id: Date.now(), type: 'user', text: text || "[Image Uploaded as Reference]" }];
      newLogs.push({ id: Date.now()+1, type: 'log', agent: 'MANTU OS', status: 'Active', details: 'Architecting App...' });
      setActionLogs(newLogs);
      
      const finalPrompt = text; const finalImage = uploadedImage;
      if(isFollowUp) setFollowUpPrompt(''); else setPrompt('');
      setUploadedImage(null); 
      
      try {
          const res = await fetch(`${BACKEND_URL}/api/build`, { 
              method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('mantu_token')}` }, 
              body: JSON.stringify({ prompt: finalPrompt, image: finalImage, existingFiles: isFollowUp ? generatedFiles : {} }) 
          });
          
          if (!res.ok) throw new Error("API Error.");
          
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
                          const dataStr = part.replace('data: ', '');
                          if(dataStr.trim() === 'keepalive') continue; 
                          const data = JSON.parse(dataStr);
                          if (data.type === 'log') {
                              setTerminalOutput(prev => prev + `\n> [${data.agent}] ${data.details}`);
                              setActionLogs(prev => [...prev, { id: Date.now()+Math.random(), type: 'log', agent: data.agent, status: data.status, details: data.details }]);
                          } else if (data.type === 'file') {
                              // Ensure code isn't corrupted
                              if (data.code && data.code.trim() !== '') {
                                  setGeneratedFiles(prev => {
                                      const updated = { ...prev, [data.filename]: data.code };
                                      if (!activeFile) setActiveFile(data.filename); 
                                      return updated;
                                  });
                              }
                          } else if (data.type === 'done') {
                              setTerminalOutput(prev => prev + `\n> 🎉 Generation Complete!`);
                              setActionLogs(prev => [...prev, { id: Date.now()+Math.random(), type: 'log', agent: 'SYSTEM', status: 'Done', details: 'Successfully built.' }]);
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

  // 🔥 SAFE CSS & CODE INJECTION PREVIEW
  const renderLivePreview = () => {
      const fileKeys = Object.keys(generatedFiles);
      if (fileKeys.length === 0) {
          return `<!DOCTYPE html><html><body style="background:#111; color:#888; display:flex; justify-content:center; align-items:center; height:100vh; font-family:sans-serif;">Waiting for Code Generation...</body></html>`;
      }

      let combinedCss = "";
      fileKeys.filter(k => k.endsWith('.css')).forEach(k => combinedCss += generatedFiles[k] + "\n");

      const jsxFiles = fileKeys.filter(k => {
          if (!k.endsWith('.jsx') && !k.endsWith('.js')) return false;
          if (k.includes('config.js') || k.includes('.config.')) return false; 
          if (k.includes('main.jsx') || k.includes('index.js') || k.includes('index.jsx')) return false; 
          return true;
      });

      jsxFiles.sort((a, b) => a.includes('App.jsx') ? 1 : b.includes('App.jsx') ? -1 : 0); 

      let allJsxCode = "";
      jsxFiles.forEach(key => {
          let code = generatedFiles[key];
          if(!code) return;
          
          // 🔥 SUPER SAFE IMPORT STRIPPING (Fixes the Code-Eater bug)
          code = code.replace(/import\s+[^;]*?from\s+['"][^'"]+['"];?/g, '');
          code = code.replace(/import\s+['"][^'"]+['"];?/g, '');
          
          code = code.replace(/export\s+default\s+function\s+([a-zA-Z0-9_]+)/g, 'function $1');
          code = code.replace(/export\s+default\s+[a-zA-Z0-9_]+;?/g, ''); 
          code = code.replace(/export\s+(const|let|var|function)/g, '$1');
          
          allJsxCode += `\n/* --- ${key} --- */\n` + code;
      });

      const reactImports = `
        <script src="[https://unpkg.com/react@18/umd/react.development.js](https://unpkg.com/react@18/umd/react.development.js)" crossorigin></script>
        <script src="[https://unpkg.com/react-dom@18/umd/react-dom.development.js](https://unpkg.com/react-dom@18/umd/react-dom.development.js)" crossorigin></script>
        <script src="[https://unpkg.com/lucide@latest](https://unpkg.com/lucide@latest)"></script>
        <script src="[https://unpkg.com/lucide-react@latest/dist/umd/lucide-react.js](https://unpkg.com/lucide-react@latest/dist/umd/lucide-react.js)"></script>
        <script src="[https://unpkg.com/@remix-run/router@1.15.3/dist/router.umd.min.js](https://unpkg.com/@remix-run/router@1.15.3/dist/router.umd.min.js)"></script>
        <script src="[https://unpkg.com/react-router@6.22.3/dist/umd/react-router.development.js](https://unpkg.com/react-router@6.22.3/dist/umd/react-router.development.js)"></script>
        <script src="[https://unpkg.com/react-router-dom@6.22.3/dist/umd/react-router-dom.development.js](https://unpkg.com/react-router-dom@6.22.3/dist/umd/react-router-dom.development.js)"></script>
        <script src="[https://unpkg.com/@babel/standalone/babel.min.js](https://unpkg.com/@babel/standalone/babel.min.js)"></script>
        <script src="[https://cdn.tailwindcss.com](https://cdn.tailwindcss.com)"></script>
        <script>
            window.React = React;
            Object.keys(React).forEach(key => window[key] = React[key]);
            if(window.lucideReact) { Object.keys(window.lucideReact).forEach(key => window[key] = window.lucideReact[key]); }
        </script>
        <style>${combinedCss} html, body, #root { width: 100%; min-height: 100vh; margin: 0; padding: 0; }</style>
      `;

      let executeReact = `
        <script type="text/babel" data-presets="react,env">
          window.onerror = function(msg) {
              const root = document.getElementById('root');
              if(root) root.innerHTML = '<div style="color:#ff6b6b; padding:20px; background:#222;"><b>Runtime Error:</b><br/>' + msg + '</div>';
              return false;
          };
          try {
              ${allJsxCode}
              const rootElement = document.getElementById('root');
              if(rootElement && typeof App !== 'undefined') {
                  const root = ReactDOM.createRoot(rootElement);
                  root.render(<App />);
              }
          } catch(err) {
              const root = document.getElementById('root');
              if(root) root.innerHTML = '<div style="color:#ff6b6b; padding:20px; background:#222;"><b>Compilation Error:</b><br/>' + err.message + '</div>';
          }
        </script>
      `;

      return `<!DOCTYPE html><html lang="en"><head>${reactImports}</head><body><div id="root"></div>${executeReact}</body></html>`;
  };

  const handlePublish = async () => {}; // Shortened for brevity
  const activeCode = generatedFiles[activeFile] || '';
  const lines = Array.from({length: Math.max(activeCode.split('\n').length, 1)}, (_, i) => i + 1);
  const handleCodeScroll = (e) => { if (lineNumbersRef.current) lineNumbersRef.current.scrollTop = e.target.scrollTop; };

  return (
    <div className="h-[100dvh] w-full flex flex-col font-sans overflow-hidden bg-[#050505] text-white relative">
      <style dangerouslySetInnerHTML={{__html: globalStyles}} />
      <div className="w-full bg-blue-900/20 border-b border-blue-900/50 text-blue-400 text-[10px] font-mono py-1.5 flex overflow-hidden whitespace-nowrap shrink-0 z-30">
           <div className="animate-marquee inline-block">🚀 AI Engine routing: 1st AWS GPU, 2nd Groq, 3rd Gemini... &nbsp; | &nbsp; ⚡ Mantu React Compiler Active...</div>
      </div>

      <nav className="h-14 flex items-center justify-between px-6 border-b border-[#1f1f23] bg-[#0a0a0c]/80 backdrop-blur-md shrink-0 z-20">
        <div className="text-xl font-extrabold flex items-center gap-2 cursor-pointer" onClick={() => setView('home')}><MantuLogo/> <span className="tracking-tight">mantu_ai</span></div>
        <div className="flex items-center gap-4 text-sm font-medium">
           {view === 'home' && Object.keys(generatedFiles).length > 0 && (<button onClick={() => setView('editor')} className="text-xs font-bold text-white bg-blue-600 px-4 py-1.5 rounded-full hover:bg-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.4)] mr-2 transition">Resume Editor →</button>)}
           {currentUser ? (
               <div className="flex items-center gap-4">
                   <button onClick={handleLogout} className="text-xs text-red-400 hover:text-red-300 ml-2 font-bold transition">Logout</button>
               </div>
           ) : (<button onClick={() => setIsAuthModalOpen(true)} className="text-xs font-bold text-black bg-white px-5 py-1.5 rounded-full hover:bg-gray-200 transition">Log In / Sign Up</button>)}
        </div>
      </nav>

      {view === 'home' ? (
        <div className="flex-1 flex flex-col items-center pt-20 p-4 overflow-y-auto relative z-10 custom-scrollbar">
            <div className="absolute inset-0 pointer-events-none z-[-1] overflow-hidden"><div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f23_1px,transparent_1px),linear-gradient(to_bottom,#1f1f23_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30"></div></div>
            <div className="inline-block px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-[10px] font-bold tracking-widest mb-6"><SparkleIcon className="inline mr-2"/> REACT BUILDER ENGINE</div>
            <h1 className="text-5xl md:text-7xl font-black mb-6 text-center tracking-tighter">React Apps in <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600">Seconds</span></h1>
            
            <div className="w-full max-w-3xl bg-[#0d0d12]/80 backdrop-blur-xl border border-[#2b2b36] rounded-2xl flex flex-col shadow-2xl transition-all duration-300 focus-within:border-blue-500 hover:border-[#3b3b46] relative p-1 mt-10">
                <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="e.g. Build a SaaS Dashboard with React and Tailwind..." className="w-full bg-transparent border-none outline-none p-5 resize-none min-h-[140px] text-lg text-white placeholder-gray-600" onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); triggerBuild(prompt, false); } }} />
                <div className="flex items-center justify-between p-3 border-t border-[#1f1f23]">
                    <div className="flex gap-4 px-2 text-gray-500">
                        <button onClick={()=>toggleListening('new')} className={`hover:text-white transition ${isListening?'text-red-500 animate-pulse':''}`}><MicIcon/></button>
                    </div>
                    <button onClick={() => triggerBuild(prompt, false)} disabled={isGenerating} className="bg-white text-black hover:bg-gray-200 px-8 py-2.5 rounded-xl font-extrabold flex items-center gap-2 transition shadow-[0_0_20px_rgba(255,255,255,0.2)]">{isGenerating ? <span className="animate-spin">🌀</span> : <SparkleIcon/>} {isGenerating ? 'Building...' : 'Generate UI'}</button>
                </div>
            </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col overflow-hidden">
            <div className="h-12 bg-[#0d0d12] border-b border-[#1f1f23] flex items-center justify-between px-4 shrink-0 overflow-x-auto custom-scrollbar">
                <div className="flex gap-1 bg-[#1a1a24] p-1 rounded-lg shrink-0">
                    <button onClick={()=>setActiveTab('preview')} className={`px-4 py-1 text-xs font-bold rounded flex items-center gap-2 transition ${activeTab === 'preview' ? 'bg-[#2b2b36] text-white shadow' : 'text-gray-400 hover:text-white'}`}><PlayIcon/> Live Preview</button>
                    <button onClick={()=>setActiveTab('code')} className={`px-4 py-1 text-xs font-bold rounded flex items-center gap-2 transition ${activeTab === 'code' ? 'bg-[#2b2b36] text-white shadow' : 'text-gray-400 hover:text-white'}`}><CodeIcon/> React Code</button>
                </div>
                <div className="flex gap-2 shrink-0">
                    <button onClick={() => setIsConsoleOpen(!isConsoleOpen)} className={`px-3 py-1.5 text-xs font-bold rounded flex items-center gap-2 transition ${isConsoleOpen ? 'bg-[#2b2b36] text-white' : 'bg-[#1a1a24] text-gray-300 hover:bg-[#2b2b36]'}`}><TerminalIcon/> Logs</button>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                <div className="w-80 bg-[#0a0a0c] border-r border-[#1f1f23] flex flex-col shrink-0 relative hidden md:flex">
                    <div className="p-3 border-b border-[#1f1f23] shrink-0"><h2 className="text-[10px] font-bold text-yellow-500 uppercase tracking-widest flex items-center gap-2"><SparkleIcon/> ACTION TIMELINE</h2></div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-20 custom-scrollbar">
                        {actionLogs.map((log, index) => (
                            <div key={index} className="flex gap-3">
                                {log.type === 'user' ? (
                                    <div className="bg-[#1a1a24] border border-[#2b2b36] rounded-lg p-3 text-sm text-gray-300 w-full shadow-sm"><div className="text-[10px] text-blue-400 font-bold mb-1.5 flex items-center gap-1.5 uppercase tracking-wide"><MicIcon/> User Prompt</div><div className="leading-relaxed">{log.text}</div></div>
                                ) : (
                                    <><div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${log.status==='Error'?'bg-red-500': log.status==='Done' || log.status==='Success'?'bg-green-500':'bg-blue-500 animate-pulse'}`}></div><div className="flex-1"><div className="font-bold text-gray-500 text-[10px] uppercase tracking-wider">{log.agent}</div><div className={`font-bold text-xs ${log.status==='Error'?'text-red-500': log.status==='Done' || log.status==='Success'?'text-green-500':'text-blue-500'}`}>{log.status}</div><div className="text-gray-400 text-xs mt-1 leading-relaxed">{log.details}</div></div></>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex-1 flex flex-col bg-[#1e1e1e] w-full">
                    <div className="flex overflow-x-auto bg-[#181818] border-b border-[#2d2d2d] shrink-0 custom-scrollbar">{Object.keys(generatedFiles).map(file => (<button key={file} onClick={() => setActiveFile(file)} className={`px-4 py-2.5 text-[12px] font-mono whitespace-nowrap flex items-center gap-2 transition-colors ${activeFile === file ? 'bg-[#1e1e1e] text-blue-400 border-t-2 border-t-blue-500' : 'text-[#969696] hover:bg-[#2a2a2a] hover:text-[#cccccc]'}`}>📄 {file}</button>))}</div>
                    <div className="flex-1 overflow-hidden relative">
                        {activeTab === 'code' ? (
                            <div className="flex h-full w-full bg-[#1e1e1e] text-[#d4d4d4] font-mono text-[13px] overflow-hidden"><div ref={lineNumbersRef} className="w-12 bg-[#1e1e1e] border-r border-[#333333] text-[#858585] flex flex-col items-end pr-3 py-4 select-none overflow-hidden" style={{lineHeight: '21px'}}>{lines.map(l => <div key={l}>{l}</div>)}</div><textarea ref={codeTextareaRef} value={activeCode} onChange={(e) => setGeneratedFiles(prev => ({ ...prev, [activeFile]: e.target.value }))} onScroll={handleCodeScroll} className="flex-1 bg-transparent text-[#9cdcfe] p-4 outline-none resize-none whitespace-pre overflow-auto custom-scrollbar" style={{lineHeight: '21px', tabSize: 4}} spellCheck="false" /></div>
                        ) : (<div className="w-full h-full bg-white flex items-center justify-center">{Object.keys(generatedFiles).length > 0 ? (<iframe srcDoc={renderLivePreview()} className="w-full h-full border-none" sandbox="allow-scripts allow-same-origin" title="preview" />) : (<div className="text-gray-400 flex flex-col items-center gap-3"><SparkleIcon/> <span>{isGenerating ? 'Architecting UI...' : 'No preview available.'}</span></div>)}</div>)}
                    </div>
                </div>
            </div>
        </div>
      )}

      {view === 'editor' && (
          <div className={`w-full transition-all duration-300 z-40 bg-[#0a0a0c] border-t border-[#1f1f23] shrink-0 ${isConsoleOpen ? 'h-56' : 'h-8'}`}>
              <div className="flex items-center justify-between px-4 h-8 cursor-pointer hover:bg-[#1a1a24] transition" onClick={() => setIsConsoleOpen(!isConsoleOpen)}><div className="text-[10px] font-bold text-gray-400 flex items-center gap-2 uppercase"><TerminalIcon/> DEPLOYMENT LOGS</div><button className="text-gray-500 hover:text-white transition">{isConsoleOpen ? '▼' : '▲'}</button></div>
              {isConsoleOpen && (<div className="p-4 pt-2 h-48 overflow-y-auto font-mono text-[11px] text-green-500 custom-scrollbar"><pre className="whitespace-pre-wrap leading-relaxed">{terminalOutput}</pre><div ref={consoleEndRef} /></div>)}
          </div>
      )}
    </div>
  );
}

export default function App() { return <ErrorBoundary><MantuEngineApp /></ErrorBoundary>; }
