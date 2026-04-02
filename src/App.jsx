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
            <pre className="bg-[#050505] p-4 rounded-lg text-left text-xs text-red-400 overflow-x-auto whitespace-pre-wrap font-mono border border-[#1f1f23]">
              {this.state.errorInfo?.toString() || "Unknown fatal error occurred."}
            </pre>
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
const GlobeIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>;

// ==========================================
// 🚀 GLOBAL CSS
// ==========================================
const globalStyles = `
@keyframes marquee { 0% { transform: translateX(100vw); } 100% { transform: translateX(-100%); } } 
.animate-marquee { animation: marquee 30s linear infinite; display: inline-block; padding-left: 100%; } 
.custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; } 
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; } 
.custom-scrollbar::-webkit-scrollbar-thumb { background: #2b2b36; border-radius: 4px; } 
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #3b3b46; }
@keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } } 
.animate-slide-in-right { animation: slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
`;

// ==========================================
// 👑 MAIN APPLICATION CORE
// ==========================================
function MantuEngineApp() {
  const BACKEND_URL = "https://visora-code.onrender.com"; 
  
  // --- STATES ---
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
  
  const [isListening, setIsListening] = useState(false); // 🔥 THIS WAS MISSING BEFORE!
  
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [publishMethod, setPublishMethod] = useState('github'); 
  const [awsInstanceType, setAwsInstanceType] = useState('cpu'); 
  const [awsTargetIp, setAwsTargetIp] = useState(""); 
  const [awsAuthKey, setAwsAuthKey] = useState(""); 
  const [githubToken, setGithubToken] = useState("");
  const [repoName, setRepoName] = useState("");
  const [customDomain, setCustomDomain] = useState(""); 
  
  const [isEnvModalOpen, setIsEnvModalOpen] = useState(false);
  const [projectEnv, setProjectEnv] = useState([{ key: '', value: '' }]);
  const [deployedUrl, setDeployedUrl] = useState(null); 

  // --- REFS ---
  const consoleEndRef = useRef(null);
  const fileInputRef = useRef(null); 
  const codeTextareaRef = useRef(null);
  const lineNumbersRef = useRef(null);
  const recognitionRef = useRef(null);

  // --- EFFECTS ---
  useEffect(() => {
      if (isConsoleOpen && consoleEndRef.current) {
          consoleEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
  }, [terminalOutput, isConsoleOpen]);

  useEffect(() => {
      try {
          const storedUser = localStorage.getItem('mantu_user');
          const token = localStorage.getItem('mantu_token');
          if (storedUser && token) {
              const parsedUser = JSON.parse(storedUser);
              setCurrentUser(parsedUser);
              fetchCloudProjects(parsedUser.id, token);
          }
      } catch (error) {
          localStorage.removeItem('mantu_user');
          localStorage.removeItem('mantu_token');
      }
  }, []);

  // --- FUNCTIONS ---
  const fetchCloudProjects = async (userId, token) => {
      try {
          const res = await fetch(`${BACKEND_URL}/api/get-projects?userId=${userId}`, { headers: { 'Authorization': `Bearer ${token}` }});
          const data = await res.json();
          if (data && data.success && Array.isArray(data.data)) setProjects(data.data);
      } catch (err) {}
  };

  const handleAuthSuccess = (token, user) => {
      localStorage.setItem('mantu_token', token); 
      localStorage.setItem('mantu_user', JSON.stringify(user));
      setCurrentUser(user); 
      setIsAuthModalOpen(false);
      setTerminalOutput(prev => prev + `\n> 🔓 Access Granted. Welcome, ${user.name}.`);
      fetchCloudProjects(user.id, token);
  };

  const handleLogout = () => {
      localStorage.removeItem('mantu_token'); 
      localStorage.removeItem('mantu_user');
      setCurrentUser(null); setProjects([]); setView('home');
      setTerminalOutput("> Logged out successfully.");
  };

  const saveCurrentProject = async () => {
      if (!currentUser) return setIsAuthModalOpen(true);
      if (Object.keys(generatedFiles).length === 0) return alert("No code generated yet!");
      setTerminalOutput(prev => prev + `\n> ⏳ Syncing project to Mantu DB...`);
      setIsConsoleOpen(true);
      try {
          const res = await fetch(`${BACKEND_URL}/api/save-project`, {
              method: 'POST', 
              headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('mantu_token')}` },
              body: JSON.stringify({ userId: currentUser.id, title: prompt.substring(0, 30) || 'Untitled App', files: generatedFiles })
          });
          const data = await res.json();
          if (data.success) {
              setTerminalOutput(prev => prev + `\n> 💾 SUCCESS: Project saved to Cloud!`);
              fetchCloudProjects(currentUser.id, localStorage.getItem('mantu_token'));
          } else setTerminalOutput(prev => prev + `\n> ❌ Save Error: ${data.error}`);
      } catch (err) { setTerminalOutput(prev => prev + `\n> ❌ Network Error while saving.`); }
  };

  const loadProject = (proj) => {
      if(proj && proj.files) {
          setGeneratedFiles(proj.files); 
          setPrompt(proj.title);
          setActiveFile(Object.keys(proj.files)[0] || "");
          setView('editor'); 
          setIsHistoryModalOpen(false);
          setTerminalOutput(`> 📂 Restored Project Workspace: ${proj.title}`);
      }
  };

  const handleImageUpload = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => setUploadedImage(event.target.result);
      reader.readAsDataURL(file);
  };

  const toggleListening = (targetInput) => {
      if (isListening) { 
          recognitionRef.current?.stop(); 
          setIsListening(false); 
          return; 
      }
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) return alert("Voice Typing is not supported in this browser.");
      
      const recognition = new SpeechRecognition();
      recognition.continuous = true; 
      recognition.interimResults = true;
      let initialPrompt = targetInput === 'followUp' ? followUpPrompt : prompt;
      
      recognition.onresult = (e) => {
          let trans = ''; 
          for (let i = 0; i < e.results.length; i++) trans += e.results[i][0].transcript;
          if (targetInput === 'followUp') setFollowUpPrompt(initialPrompt + (initialPrompt ? ' ' : '') + trans);
          else setPrompt(initialPrompt + (initialPrompt ? ' ' : '') + trans);
      };
      
      recognition.onerror = () => setIsListening(false); 
      recognition.onend = () => setIsListening(false);
      recognitionRef.current = recognition; 
      recognition.start(); 
      setIsListening(true);
  };

  const triggerBuild = async (text, isFollowUp = false) => {
      if (!text.trim() && !uploadedImage) return;
      if (!currentUser) return setIsAuthModalOpen(true); 

      setIsGenerating(true); setView('editor'); setActiveTab('preview'); setIsConsoleOpen(true); setDeployedUrl(null);
      if (!isFollowUp) setGeneratedFiles({});
      
      const newLogs = [...actionLogs, { id: Date.now(), type: 'user', text: text || "[Image Uploaded as Reference]" }];
      newLogs.push({ id: Date.now()+1, type: 'log', agent: 'MANTU OS', status: 'Active', details: 'Architecting Fullstack App...' });
      setActionLogs(newLogs);
      setTerminalOutput(prev => prev + `\n> Initiating AI Engines...\n> Building React + Python Structure...`);
      
      const finalPrompt = text;
      const finalImage = uploadedImage;
      if(isFollowUp) setFollowUpPrompt(''); else setPrompt('');
      setUploadedImage(null); 
      
      try {
          const res = await fetch(`${BACKEND_URL}/api/build`, { 
              method: 'POST', 
              headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('mantu_token')}` }, 
              body: JSON.stringify({ prompt: finalPrompt, image: finalImage, existingFiles: isFollowUp ? generatedFiles : {} }) 
          });
          
          if (!res.ok) throw new Error("Server Error or API Timeout.");
          
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
                          const dataStr = part.replace('data: ', '');
                          if(dataStr.trim() === 'keepalive') continue; 
                          const data = JSON.parse(dataStr);
                          
                          if (data.type === 'log') {
                              setTerminalOutput(prev => prev + `\n> [${data.agent}] ${data.details}`);
                              setActionLogs(prev => [...prev, { id: Date.now()+Math.random(), type: 'log', agent: data.agent, status: data.status, details: data.details }]);
                          } else if (data.type === 'file') {
                              let cleanCode = String(data.code).replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/```[a-zA-Z]*\n?/g, '').replace(/```/g, '').trim();
                              setGeneratedFiles(prev => {
                                  const updated = { ...prev, [data.filename]: cleanCode };
                                  if (!activeFile) setActiveFile(data.filename); 
                                  return updated;
                              });
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

  const renderLivePreview = () => {
      const fileKeys = Object.keys(generatedFiles);
      if (fileKeys.length === 0) {
          return `<!DOCTYPE html><html><body style="background:#111; color:#888; display:flex; justify-content:center; align-items:center; height:100vh; font-family:sans-serif;">Architecting Fullstack Application...</body></html>`;
      }

      let combinedCss = "";
      fileKeys.filter(k => k.endsWith('.css')).forEach(k => combinedCss += generatedFiles[k] + "\n");

      const jsxFiles = fileKeys.filter(k => (k.endsWith('.jsx') || k.endsWith('.js')) && k.includes('frontend/'));
      jsxFiles.sort((a, b) => a.includes('App.jsx') ? 1 : b.includes('App.jsx') ? -1 : 0); 

      let allJsxCode = "";
      jsxFiles.forEach(key => {
          if(key.includes('main.jsx') || key.includes('index.js')) return; 
          let code = generatedFiles[key];
          
          code = code.replace(/import\s+[\s\S]*?from\s+['"].*?['"];?/g, '');
          code = code.replace(/import\s+['"].*?['"];?/g, '');
          code = code.replace(/export\s+default\s+function/g, 'function');
          code = code.replace(/export\s+(const|let|var|function)/g, '$1');
          
          allJsxCode += `\n/* --- ${key} --- */\n` + code;
      });

      const envObj = {}; 
      projectEnv.forEach(e => { if (e.key.trim()) envObj[e.key.trim()] = e.value.trim(); });

      const reactImports = `
        <script>window.mantuEnv = ${JSON.stringify(envObj)}; window.process = { env: window.mantuEnv };</script>
        <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
        <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
        <script src="https://unpkg.com/babel-standalone@6/babel.min.js"></script>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>${combinedCss}</style>
      `;

      let executeReact = `
        <script type="text/babel" data-type="module">
          window.addEventListener('error', (e) => {
              const root = document.getElementById('root');
              if(root) root.innerHTML = '<div style="color:#ff6b6b; padding:20px; background:#222; border-radius:8px; margin:20px; font-family:monospace;"><b>Preview Compilation Error:</b><br/>' + e.message + '</div>';
          });
          ${allJsxCode}
          const rootElement = document.getElementById('root');
          if(rootElement && typeof App !== 'undefined') {
              const root = ReactDOM.createRoot(rootElement);
              root.render(<App />);
          }
        </script>
      `;

      return `<!DOCTYPE html><html><head>${reactImports}</head><body class="bg-white"><div id="root"></div>${executeReact}</body></html>`;
  };

  const handlePemUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setAwsAuthKey(ev.target.result);
    reader.readAsText(file);
  };

  const handlePublish = async () => {
    if(!currentUser) return setIsAuthModalOpen(true);
    
    if (publishMethod === 'aws' && (!awsTargetIp || !awsAuthKey)) return alert("Provide AWS IP and Auth Key.");
    if (publishMethod === 'github' && (!githubToken || !repoName)) return alert("Provide GitHub Token and Repo Name.");
    if (publishMethod === 'domain' && !customDomain) return alert("Provide a valid domain name.");

    setIsPublishModalOpen(false); setIsConsoleOpen(true); setDeployedUrl(null);
    setTerminalOutput(`\n> 🚀 Initiating Deployment Sequence [${publishMethod.toUpperCase()}]...`);
    
    try {
        let payload = {};
        if (publishMethod === 'aws') payload = { targetIp: awsTargetIp, authKey: awsAuthKey };
        else if (publishMethod === 'github') payload = { githubToken: githubToken, repoName: repoName };
        else if (publishMethod === 'domain') payload = { customDomain };
        else if (publishMethod === 'cloud') { payload = { compiledHtml: renderLivePreview() }; }

        const endpoint = publishMethod === 'domain' ? 'setup-domain' : `publish-${publishMethod}`;
        const res = await fetch(`${BACKEND_URL}/api/${endpoint}`, {
            method: 'POST', 
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('mantu_token')}` },
            body: JSON.stringify(payload)
        });
        
        const data = await res.json();
        if(data.success) {
            setTerminalOutput(prev => prev + `\n> ✅ Success: ${data.message || 'Deployed!'}`);
            if (data.url) { 
                setDeployedUrl(data.url); setTerminalOutput(prev => prev + `\n> 🔗 URL: ${data.url}`); 
            }
        } else setTerminalOutput(prev => prev + `\n> ⚠️ Error: ${data.error || data.message}`);
    } catch(e) { setTerminalOutput(prev => prev + `\n> ❌ Network Error.`); }
  };

  const activeCode = generatedFiles[activeFile] || '';
  const lines = Array.from({length: Math.max(activeCode.split('\n').length, 1)}, (_, i) => i + 1);
  const handleCodeScroll = (e) => { if (lineNumbersRef.current) lineNumbersRef.current.scrollTop = e.target.scrollTop; };

  // ==========================================
  // 🖥️ UI RENDER LAYER
  // ==========================================
  return (
    <div className="h-[100dvh] w-full flex flex-col font-sans overflow-hidden bg-[#050505] text-white relative">
      <style dangerouslySetInnerHTML={{__html: globalStyles}} />
      
      {isAuthModalOpen && <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onSuccess={handleAuthSuccess} backendUrl={BACKEND_URL} />}

      <div className="w-full bg-blue-900/20 border-b border-blue-900/50 text-blue-400 text-[10px] font-mono py-1.5 flex overflow-hidden whitespace-nowrap shrink-0 z-30">
           <div className="animate-marquee inline-block">🚀 User_92 deployed Python Backend to Vercel... &nbsp; | &nbsp; ⚡ Mantu React Compiler Active... &nbsp; | &nbsp; 🧠 Enterprise Fullstack Engine...</div>
      </div>

      <nav className="h-14 flex items-center justify-between px-6 border-b border-[#1f1f23] bg-[#0a0a0c]/80 backdrop-blur-md shrink-0 z-20">
        <div className="text-xl font-extrabold flex items-center gap-2 cursor-pointer" onClick={() => setView('home')}><MantuLogo/> <span className="tracking-tight">mantu_ai</span></div>
        <div className="flex items-center gap-4 text-sm font-medium">
           {view === 'home' && Object.keys(generatedFiles).length > 0 && (<button onClick={() => setView('editor')} className="text-xs font-bold text-white bg-blue-600 px-4 py-1.5 rounded-full hover:bg-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.4)] mr-2 transition">Resume Editor →</button>)}
           {currentUser ? (
               <div className="flex items-center gap-4">
                   <div className="hidden md:flex items-center gap-2 text-[11px] font-bold bg-green-500/10 text-green-500 border border-green-500/20 px-3 py-1 rounded-full"><SparkleIcon/> Credits: {currentUser.credits || 10}</div>
                   <button onClick={() => setIsHistoryModalOpen(true)} className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition"><HistoryIcon/> <span className="hidden sm:block">History</span></button>
                   <div className="flex items-center gap-2 text-gray-300 border-l border-[#2b2b36] pl-4 ml-2"><UserIcon/> <span className="text-xs font-bold">{currentUser.name}</span></div>
                   <button onClick={handleLogout} className="text-xs text-red-400 hover:text-red-300 ml-2 font-bold transition">Logout</button>
               </div>
           ) : (<button onClick={() => setIsAuthModalOpen(true)} className="text-xs font-bold text-black bg-white px-5 py-1.5 rounded-full hover:bg-gray-200 transition">Log In / Sign Up</button>)}
        </div>
      </nav>

      {view === 'home' ? (
        <div className="flex-1 flex flex-col items-center pt-20 p-4 overflow-y-auto relative z-10 custom-scrollbar">
            <div className="absolute inset-0 pointer-events-none z-[-1] overflow-hidden"><div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f23_1px,transparent_1px),linear-gradient(to_bottom,#1f1f23_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30"></div><div className="absolute top-[10%] left-[20%] w-[30%] h-[30%] bg-blue-600/20 blur-[120px] rounded-full animate-pulse"></div><div className="absolute bottom-[20%] right-[20%] w-[30%] h-[30%] bg-purple-600/20 blur-[120px] rounded-full animate-pulse" style={{animationDelay: '2s'}}></div></div>
            <div className="inline-block px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-[10px] font-bold tracking-widest mb-6"><SparkleIcon className="inline mr-2"/> ENTERPRISE ARCHITECTURE</div>
            <h1 className="text-5xl md:text-7xl font-black mb-6 text-center tracking-tighter">Python + React in <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600">Seconds</span></h1>
            <p className="text-gray-400 mb-10 max-w-xl text-center text-sm md:text-base leading-relaxed">Turn ideas or images into live Fullstack Apps. Mantu AI generates Python FastAPI and React Vite structures.</p>
            
            <div className="w-full max-w-3xl bg-[#0d0d12]/80 backdrop-blur-xl border border-[#2b2b36] rounded-2xl flex flex-col shadow-2xl transition-all duration-300 focus-within:border-blue-500 focus-within:shadow-[0_0_30px_rgba(59,130,246,0.2)] hover:border-[#3b3b46] relative p-1">
                {uploadedImage && (
                    <div className="absolute top-4 right-4 z-10">
                        <div className="relative border border-[#2b2b36] rounded-lg overflow-hidden w-20 h-20 shadow-lg">
                            <img src={uploadedImage} alt="Reference UI" className="w-full h-full object-cover opacity-80" />
                            <button onClick={() => setUploadedImage(null)} className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-1 hover:bg-red-500 transition"><CloseIcon/></button>
                        </div>
                    </div>
                )}
                <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="e.g. Build a Python API with a React Dashboard..." className="w-full bg-transparent border-none outline-none p-5 resize-none min-h-[140px] text-lg text-white placeholder-gray-600" onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); triggerBuild(prompt, false); } }} />
                <div className="flex items-center justify-between p-3 border-t border-[#1f1f23]">
                    <div className="flex gap-4 px-2 text-gray-500">
                        <button onClick={()=>toggleListening('new')} className={`hover:text-white transition ${isListening?'text-red-500 animate-pulse':''}`}><MicIcon/></button>
                        <button onClick={() => fileInputRef.current.click()} className="hover:text-white transition" title="Upload Image"><ImageIcon/></button>
                        <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={handleImageUpload} />
                    </div>
                    <button onClick={() => triggerBuild(prompt, false)} disabled={isGenerating} className="bg-white text-black hover:bg-gray-200 px-8 py-2.5 rounded-xl font-extrabold flex items-center gap-2 transition shadow-[0_0_20px_rgba(255,255,255,0.2)]">{isGenerating ? <span className="animate-spin">🌀</span> : <SparkleIcon/>} {isGenerating ? 'Building...' : 'Generate App'}</button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12 w-full max-w-3xl z-10">
                {[ {icon: '📈', title: 'Crypto Dashboard', desc: 'NPM React workspace'}, {icon: '🛒', title: 'E-Commerce Store', desc: 'Vite + React structure'}, {icon: '🎬', title: 'Video SaaS App', desc: 'Enterprise architecture'} ].map((card, i) => (
                    <div key={i} onClick={() => setPrompt(`Build a ${card.title} with ${card.desc.toLowerCase()}`)} className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-xl cursor-pointer hover:-translate-y-1 hover:bg-white/10 hover:border-blue-500/50 transition-all duration-300">
                        <div className="text-2xl mb-3">{card.icon}</div><div className="font-bold text-sm text-white">{card.title}</div><div className="text-[11px] text-gray-400 mt-1">{card.desc}</div>
                    </div>
                ))}
            </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col overflow-hidden">
            <div className="h-12 bg-[#0d0d12] border-b border-[#1f1f23] flex items-center justify-between px-4 shrink-0 overflow-x-auto custom-scrollbar">
                <div className="flex gap-1 bg-[#1a1a24] p-1 rounded-lg shrink-0">
                    <button onClick={()=>setActiveTab('preview')} className={`px-4 py-1 text-xs font-bold rounded flex items-center gap-2 transition ${activeTab === 'preview' ? 'bg-[#2b2b36] text-white shadow' : 'text-gray-400 hover:text-white'}`}><PlayIcon/> Live UI Preview</button>
                    <button onClick={()=>setActiveTab('code')} className={`px-4 py-1 text-xs font-bold rounded flex items-center gap-2 transition ${activeTab === 'code' ? 'bg-[#2b2b36] text-white shadow' : 'text-gray-400 hover:text-white'}`}><CodeIcon/> Code (Python/React)</button>
                </div>
                <div className="flex gap-2 shrink-0">
                    {deployedUrl && (<a href={deployedUrl} target="_blank" rel="noreferrer" className="px-3 py-1.5 text-xs font-bold bg-green-500/10 text-green-400 border border-green-500/50 hover:bg-green-500/20 rounded flex items-center gap-2 transition"><LinkIcon/> Open App</a>)}
                    <button onClick={saveCurrentProject} className="px-3 py-1.5 text-xs font-bold bg-[#1a1a24] text-blue-400 border border-blue-900/50 hover:bg-blue-900/20 rounded flex items-center gap-2 transition"><CloudIcon/> Save</button>
                    <button onClick={() => setIsConsoleOpen(!isConsoleOpen)} className={`px-3 py-1.5 text-xs font-bold rounded flex items-center gap-2 transition ${isConsoleOpen ? 'bg-[#2b2b36] text-white' : 'bg-[#1a1a24] text-gray-300 hover:bg-[#2b2b36]'}`}><TerminalIcon/> Logs</button>
                    <button onClick={() => setIsEnvModalOpen(true)} className="px-3 py-1.5 text-xs font-bold bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 hover:bg-yellow-500/20 rounded flex items-center gap-2 transition"><LockIcon/> Env Keys</button>
                    <button onClick={() => setIsPublishModalOpen(true)} className="px-4 py-1.5 text-xs font-bold bg-white text-black hover:bg-gray-200 rounded flex items-center gap-2 shadow transition"><CloudIcon/> Deploy App</button>
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
                    <div className="absolute bottom-0 left-0 w-full bg-[#0a0a0c] border-t border-[#1f1f23] p-3">
                        <div className="bg-[#1a1a24] border border-[#2b2b36] rounded-xl flex items-center px-3 py-2.5 focus-within:border-blue-500/50 transition-all shadow-inner">
                            <button onClick={()=>toggleListening('followUp')} className={`text-gray-500 hover:text-white transition mr-2 ${isListening?'text-red-500 animate-pulse':''}`}><MicIcon/></button>
                            <input type="text" value={followUpPrompt} onChange={(e)=>setFollowUpPrompt(e.target.value)} placeholder="Ask for changes..." className="flex-1 bg-transparent border-none outline-none text-xs text-white placeholder-gray-600" onKeyDown={(e) => { if(e.key === 'Enter') triggerBuild(followUpPrompt, true); }} />
                            <button onClick={() => triggerBuild(followUpPrompt, true)} disabled={!followUpPrompt.trim() || isGenerating} className="bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 text-white p-1.5 rounded-lg ml-2 transition shadow"><SendIcon/></button>
                        </div>
                    </div>
                </div>

                <div className="flex-1 flex flex-col bg-[#1e1e1e] w-full">
                    <div className="flex overflow-x-auto bg-[#181818] border-b border-[#2d2d2d] shrink-0 custom-scrollbar">
                        {Object.keys(generatedFiles).map(file => (<button key={file} onClick={() => setActiveFile(file)} className={`px-4 py-2.5 text-[12px] font-mono whitespace-nowrap flex items-center gap-2 transition-colors ${activeFile === file ? 'bg-[#1e1e1e] text-blue-400 border-t-2 border-t-blue-500' : 'text-[#969696] hover:bg-[#2a2a2a] hover:text-[#cccccc]'}`}>📄 {file}</button>))}
                        {Object.keys(generatedFiles).length === 0 && <div className="px-4 py-2.5 text-[11px] font-mono text-[#858585] italic">Waiting for AI generation...</div>}
                    </div>
                    
                    <div className="flex-1 overflow-hidden relative">
                        {activeTab === 'code' ? (
                            <div className="flex h-full w-full bg-[#1e1e1e] text-[#d4d4d4] font-mono text-[13px] overflow-hidden">
                                <div ref={lineNumbersRef} className="w-12 bg-[#1e1e1e] border-r border-[#333333] text-[#858585] flex flex-col items-end pr-3 py-4 select-none overflow-hidden" style={{lineHeight: '21px'}}>{lines.map(l => <div key={l}>{l}</div>)}</div>
                                <textarea ref={codeTextareaRef} value={activeCode} onChange={(e) => setGeneratedFiles(prev => ({ ...prev, [activeFile]: e.target.value }))} onScroll={handleCodeScroll} className="flex-1 bg-transparent text-[#9cdcfe] p-4 outline-none resize-none whitespace-pre overflow-auto custom-scrollbar" style={{lineHeight: '21px', tabSize: 4}} spellCheck="false" />
                            </div>
                        ) : (
                            <div className="w-full h-full bg-white flex items-center justify-center">
                                {Object.keys(generatedFiles).length > 0 ? (<iframe srcDoc={renderLivePreview()} className="w-full h-full border-none" sandbox="allow-scripts allow-same-origin" title="preview" />) : (<div className="text-gray-400 flex flex-col items-center gap-3"><SparkleIcon/> <span>{isGenerating ? 'Architecting Application...' : 'No preview available.'}</span></div>)}
                            </div>
                        )}
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

      {isPublishModalOpen && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
              <div className="bg-[#111116] border border-[#2b2b2b] w-full max-w-4xl rounded-xl overflow-hidden shadow-2xl flex flex-col md:flex-row min-h-[450px]">
                  <div className="w-full md:w-1/3 bg-[#0a0a0c] border-r border-[#1f1f23] flex flex-col">
                      <div className="p-5 border-b border-[#1f1f23] flex items-center gap-2"><CloudIcon /> <h3 className="font-bold text-sm">Deployment Center</h3></div>
                      <div className="p-3 flex flex-col gap-2 flex-1">
                          <button onClick={() => setPublishMethod('github')} className={`p-3 text-left rounded-lg transition ${publishMethod === 'github' ? 'bg-[#1a40af]/20 border border-blue-600 text-blue-500' : 'text-gray-400 hover:bg-[#1a1a24]'}`}><div className="font-bold text-xs flex items-center gap-2"><GithubIcon/> GitHub GitOps</div><div className="text-[10px] mt-1 opacity-70">Deploy Fullstack App</div></button>
                          <button onClick={() => setPublishMethod('cloud')} className={`p-3 text-left rounded-lg transition ${publishMethod === 'cloud' ? 'bg-[#1a40af]/20 border border-blue-600 text-blue-500' : 'text-gray-400 hover:bg-[#1a1a24]'}`}><div className="font-bold text-xs flex items-center gap-2"><CloudIcon/> Live Preview</div><div className="text-[10px] mt-1 opacity-70">Share Frontend UI</div></button>
                          <button onClick={() => setPublishMethod('aws')} className={`p-3 text-left rounded-lg transition ${publishMethod === 'aws' ? 'bg-orange-500/10 border border-orange-500/50 text-orange-500' : 'text-gray-400 hover:bg-[#1a1a24]'}`}><div className="font-bold text-xs flex items-center gap-2"><ServerIcon/> AWS EC2 Auto</div><div className="text-[10px] mt-1 opacity-70">CTO deployment</div></button>
                      </div>
                  </div>
                  <div className="w-full md:w-2/3 bg-[#111116] p-8 flex flex-col relative">
                      <button onClick={() => setIsPublishModalOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white transition"><CloseIcon/></button>

                      {publishMethod === 'github' && (
                          <div className="flex flex-col h-full mt-2">
                              <h4 className="text-white font-bold text-lg mb-4">Fullstack GitOps Deployment</h4>
                              <p className="text-sm text-gray-400 mb-6">Mantu OS will push your <b>Python Backend</b> and <b>React Frontend</b> to GitHub. Once pushed, you can deploy the Monorepo to Vercel directly.</p>
                              <div className="mb-5"><label className="text-xs text-gray-400 font-bold mb-1.5 block uppercase tracking-wider">GitHub Personal Access Token</label><input type="password" value={githubToken} onChange={(e) => setGithubToken(e.target.value)} placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxx" className="w-full bg-[#0A0A0E] border border-[#2b2b2b] rounded-lg p-3 text-sm text-white outline-none focus:border-gray-500 transition" /></div>
                              <div className="mb-6"><label className="text-xs text-gray-400 font-bold mb-1.5 block uppercase tracking-wider">Repository Name</label><input type="text" value={repoName} onChange={(e) => setRepoName(e.target.value)} placeholder="my-fullstack-app" className="w-full bg-[#0A0A0E] border border-[#2b2b2b] rounded-lg p-3 text-sm text-white outline-none focus:border-gray-500 transition" /></div>
                              <button onClick={handlePublish} className="mt-auto w-full bg-blue-600 hover:bg-blue-500 text-white py-3.5 rounded-xl font-bold text-sm shadow-lg transition flex items-center justify-center gap-2"><GithubIcon/> Push to GitHub</button>
                          </div>
                      )}

                      {publishMethod === 'cloud' && (
                          <div className="flex flex-col h-full mt-4 justify-center items-center text-center">
                              <div className="bg-blue-500/10 p-4 rounded-full mb-4 text-blue-500"><CloudIcon /></div>
                              <h4 className="text-white font-black text-xl mb-2">Deploy UI to Cloud</h4>
                              <p className="text-gray-400 text-sm mb-8 max-w-sm">This instantly deploys your Live React Preview to Netlify so you can share the UI immediately.</p>
                              <button onClick={handlePublish} className="w-full max-w-xs bg-blue-600 hover:bg-blue-500 text-white py-3.5 rounded-xl font-bold text-sm transition flex justify-center items-center gap-2"><CloudIcon/> Upload to Cloud</button>
                          </div>
                      )}

                      {publishMethod === 'aws' && (
                          <div className="flex flex-col h-full mt-2">
                              <h4 className="text-white font-bold text-lg mb-6">AWS Configuration</h4>
                              <div className="flex gap-3 mb-6"><button onClick={()=>setAwsInstanceType('cpu')} className={`flex-1 p-3 rounded-lg border flex flex-col items-start transition ${awsInstanceType === 'cpu' ? 'border-orange-500 bg-orange-500/5 text-orange-400' : 'border-[#2b2b2b] text-gray-400 hover:border-gray-600'}`}><div className="flex items-center gap-2 font-bold text-xs"><CpuIcon/> CPU Instance</div></button><button onClick={()=>setAwsInstanceType('gpu')} className={`flex-1 p-3 rounded-lg border flex flex-col items-start relative transition ${awsInstanceType === 'gpu' ? 'border-purple-500 bg-purple-500/5 text-purple-400' : 'border-[#2b2b2b] text-gray-400 hover:border-gray-600'}`}><span className="absolute -top-2 -right-2 bg-purple-600 text-[9px] text-white px-2 py-0.5 rounded-full font-bold">PRO</span><div className="flex items-center gap-2 font-bold text-xs">⚡ GPU Accelerated</div></button></div>
                              <div className="mb-5"><label className="text-xs text-gray-400 font-bold mb-1.5 block uppercase tracking-wider">IPv4 Address</label><input type="text" value={awsTargetIp||""} onChange={(e) => setAwsTargetIp(e.target.value)} placeholder="e.g. 13.234.11.22" className="w-full bg-[#0A0A0E] border border-[#2b2b2b] rounded-lg p-3 text-sm text-white outline-none focus:border-orange-500 transition" /></div>
                              <div className="mb-6"><label className="text-xs text-gray-400 font-bold mb-1.5 block uppercase tracking-wider">SSH Auth Key (.pem)</label><div className="flex gap-2"><input type="password" value={awsAuthKey ? '************************' : ''} readOnly placeholder="Upload .pem certificate" className="flex-1 bg-[#0A0A0E] border border-[#2b2b2b] rounded-lg p-3 text-sm text-gray-500 outline-none" /><label className="bg-[#1a1a24] border border-[#2b2b2b] hover:bg-[#2b2b36] cursor-pointer text-white px-5 py-3 rounded-lg text-xs font-bold flex items-center transition">Browse <input type="file" accept=".pem" onChange={handlePemUpload} className="hidden" /></label></div></div>
                              <button onClick={handlePublish} className="mt-auto w-full bg-orange-600 hover:bg-orange-500 text-white py-3.5 rounded-xl font-bold text-sm shadow-lg transition flex items-center justify-center gap-2"><ServerIcon/> Mount to Server</button>
                          </div>
                      )}
                  </div>
              </div>
          </div>
      )}

      {isEnvModalOpen && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
              <div className="bg-[#111116] border border-[#2b2b2b] w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl">
                  <div className="p-5 border-b border-[#2b2b2b] flex justify-between items-center bg-gradient-to-r from-yellow-500/10 to-transparent">
                      <div><h3 className="text-lg font-bold text-white flex items-center gap-2"><LockIcon className="text-yellow-500"/> Secrets Manager</h3></div>
                      <button onClick={() => setIsEnvModalOpen(false)} className="text-gray-400 hover:text-white bg-[#1a1a24] p-2 rounded-full"><CloseIcon/></button>
                  </div>
                  <div className="p-6 flex flex-col gap-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
                      {projectEnv.map((env, i) => (
                          <div key={i} className="flex gap-2 items-center group">
                              <input type="text" value={env.key||""} onChange={(e) => { const n = [...projectEnv]; n[i].key = e.target.value.toUpperCase(); setProjectEnv(n); }} placeholder="e.g. API_URL" className="w-1/3 bg-[#0A0A0E] border border-[#2b2b2b] rounded-lg p-2.5 text-xs text-white font-mono outline-none focus:border-yellow-500" />
                              <input type="password" value={env.value||""} onChange={(e) => { const n = [...projectEnv]; n[i].value = e.target.value; setProjectEnv(n); }} placeholder="********" className="flex-1 bg-[#0A0A0E] border border-[#2b2b2b] rounded-lg p-2.5 text-xs text-white font-mono outline-none focus:border-yellow-500" />
                              <button onClick={() => setProjectEnv(projectEnv.filter((_, idx) => idx !== i))} className="text-gray-600 hover:text-red-500 p-2 opacity-0 group-hover:opacity-100 transition"><CloseIcon/></button>
                          </div>
                      ))}
                      <button onClick={() => setProjectEnv([...projectEnv, { key: '', value: '' }])} className="text-xs text-yellow-500 font-bold w-max mt-2">+ Add Variable</button>
                  </div>
                  <div className="p-4 border-t border-[#2b2b2b] bg-[#0a0a0c]"><button onClick={() => setIsEnvModalOpen(false)} className="w-full bg-white text-black hover:bg-gray-200 py-3 rounded-xl font-bold text-sm shadow-lg">Save Keys</button></div>
              </div>
          </div>
      )}

      {isHistoryModalOpen && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-end z-50 transition-opacity">
              <div className="bg-[#111116] border-l border-[#2b2b2b] w-full max-w-md h-full flex flex-col shadow-2xl animate-slide-in-right">
                  <div className="p-6 border-b border-[#1f1f23] flex justify-between items-center bg-[#0a0a0c]">
                      <h3 className="text-lg font-bold text-white flex items-center gap-2"><HistoryIcon/> Project History</h3>
                      <button onClick={() => setIsHistoryModalOpen(false)} className="text-gray-400 hover:text-white bg-[#1a1a24] p-2 rounded-full"><CloseIcon/></button>
                  </div>
                  <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
                      {(!projects || projects.length === 0) ? (
                          <div className="text-center text-gray-500 mt-10">No projects saved yet.</div>
                      ) : (
                          projects.map((proj) => (
                              <div key={proj._id} className="bg-[#1a1a24] border border-[#2b2b36] rounded-xl p-4 hover:border-blue-500/50 transition mb-3">
                                  <h4 className="font-bold text-sm text-white truncate pr-4">{proj.title}</h4>
                                  <button onClick={() => loadProject(proj)} className="mt-4 w-full bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white text-xs font-bold py-2 rounded-lg transition">Load Workspace</button>
                              </div>
                          ))
                      )}
                  </div>
              </div>
          </div>
      )}
    </div>
  );
}

// ==========================================
// 🚀 4. EXPORT WITH ERROR BOUNDARY
// ==========================================
export default function App() {
  return (
    <ErrorBoundary>
      <MantuEngineApp />
    </ErrorBoundary>
  );
}
