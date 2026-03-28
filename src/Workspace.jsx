import React from 'react';
import JSZip from 'jszip'; 
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { MonitorIcon, CodeIcon, PlayIcon, CopyIcon, DownloadIcon, TerminalIcon, CloseIcon, FileIcon } from './Icons';

export default function Workspace({
    activeTab, setActiveTab, generatedFiles, activeFile, setActiveFile,
    previewHtml, terminalOutput, setTerminalOutput, isConsoleOpen, setIsConsoleOpen, 
    handleRunCode, setIsPublishModalOpen, setIsEnvModalOpen
}) {

    // 🔥 THE CODE FORMATTER (Makes AI code look beautiful)
    const formatCode = (code, filename) => {
        if (!code) return "// Awaiting generation...";
        
        let text = String(code).replace(/\\n/g, '\n').replace(/\\"/g, '"');
        text = text.replace(/```[a-zA-Z]*\n?/g, '').replace(/```/g, '');
        
        if (text.split('\n').length <= 3 && text.length > 20) {
            if (filename && (filename.endsWith('.json') || filename.endsWith('.env'))) {
                try { text = JSON.stringify(JSON.parse(text), null, 4); } 
                catch (e) { text = text.replace(/,/g, ',\n  ').replace(/\{/g, '{\n  ').replace(/\}/g, '\n}'); }
            } else {
                text = text
                    .replace(/;/g, ';\n')
                    .replace(/\{/g, ' {\n  ')
                    .replace(/\}/g, '\n}\n')
                    .replace(/(import )/g, '\n$1')
                    .replace(/(export )/g, '\n$1')
                    .replace(/(const )/g, '\n$1')
                    .replace(/(let )/g, '\n$1')
                    .replace(/(return )/g, '\n  $1')
                    .replace(/>/g, '>\n')
                    .replace(/</g, '\n<')
                    .replace(/^\s*[\r\n]/gm, ''); 
            }
        }
        return text.trim();
    };

    // 📋 COPY SINGLE FILE
    const handleCopy = () => { 
        navigator.clipboard.writeText(formatCode(generatedFiles[activeFile], activeFile)); 
        setTerminalOutput("> Code Copied to clipboard!"); 
        setIsConsoleOpen(true); 
    };

    // ⬇️ DOWNLOAD SINGLE FILE
    const handleDownload = () => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(new Blob([formatCode(generatedFiles[activeFile], activeFile)]));
        a.download = activeFile || 'download.txt'; 
        a.click();
    };

    // 🗂️ DOWNLOAD FULL PROJECT ZIP
    const handleDownloadZip = async () => {
        setTerminalOutput("> Compiling ZIP file..."); setIsConsoleOpen(true);
        try {
            const zip = new JSZip();
            Object.entries(generatedFiles).forEach(([filename, content]) => {
                zip.file(filename, formatCode(content, filename));
            });
            const content = await zip.generateAsync({ type: "blob" });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(content);
            a.download = "mantu-cloud-project.zip";
            a.click();
            setTerminalOutput("> 🎉 Project downloaded as ZIP successfully!");
        } catch(e) { setTerminalOutput("> ❌ Error creating ZIP: " + e.message); }
    };

    // 📱 MANTU APK BUILDER (Connects to Python Port 8001)
    const handleBuildAPK = async () => {
        setTerminalOutput("> INITIALIZING APK BUILDER ON AWS...\n> Sending React code to AWS GPU Server...\n> Please wait 1 to 3 minutes for Android Gradle to compile...");
        setIsConsoleOpen(true);
        
        try {
            const saved = localStorage.getItem('mantuSettings');
            const awsIp = saved ? JSON.parse(saved).awsIp : '';
            if(!awsIp) {
                setTerminalOutput("> ❌ ERROR: Please set your AWS IP in Settings (⚙️) first!");
                return;
            }

            const apiUrl = `http://${awsIp}:8001/build-apk`;
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ files: generatedFiles })
            });

            if (!response.ok) throw new Error("AWS Server disconnected or Android Build failed.");

            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = "mantu-app.apk";
            document.body.appendChild(a);
            a.click();
            a.remove();
            
            setTerminalOutput("> 🎉 SUCCESS! \n> APK has been built by AWS and downloaded to your device.\n> Install it on your Android phone to test!");

        } catch (error) {
            setTerminalOutput(`> ❌ APK BUILD ERROR: ${error.message}\n> Check if Port 8001 is open on AWS and apk_server.py is running.`);
        }
    };

    return (
        <div className="flex-1 flex flex-col relative overflow-hidden bg-[#1e1e1e]">
            {/* 🔝 TOP TOOLBAR */}
            <div className="h-[56px] border-b border-[#2b2b2b] flex items-center justify-between px-3 bg-[#111116] shrink-0 overflow-x-auto">
                {/* Left: View Toggles */}
                <div className="flex items-center bg-[#1e1e1e] rounded-md border border-[#2b2b2b] p-0.5 shrink-0">
                    <button onClick={() => setActiveTab('preview')} className={`flex items-center gap-1.5 px-4 py-1.5 rounded text-[11px] font-bold transition-all ${activeTab === 'preview' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-400 hover:text-white'}`}><MonitorIcon /> Live Preview</button>
                    <button onClick={() => setActiveTab('code')} className={`flex items-center gap-1.5 px-4 py-1.5 rounded text-[11px] font-bold transition-all ${activeTab === 'code' ? 'bg-[#2b2b2b] text-white shadow-md' : 'text-gray-400 hover:text-white'}`}><CodeIcon /> View Code</button>
                </div>

                {/* Right: Action Buttons */}
                <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => setIsConsoleOpen(!isConsoleOpen)} className={`flex items-center gap-1 px-3 py-1.5 rounded text-[10px] font-bold border transition-all ${isConsoleOpen ? 'bg-purple-500/20 text-purple-400 border-purple-500/50' : 'bg-transparent text-gray-400 border-[#2b2b2b] hover:text-white'}`}><TerminalIcon /> Console</button>
                    <button onClick={() => setIsEnvModalOpen(true)} className="bg-orange-500/20 text-orange-400 border border-orange-500/50 px-3 py-1.5 rounded text-[10px] font-bold hover:bg-orange-500/40 transition">🔐 Env Keys</button>
                    
                    <div className="h-6 w-px bg-[#2b2b2b] mx-1"></div> {/* Divider */}

                    {/* 🔥 EXPORT & BUILD BUTTONS 🔥 */}
                    <button onClick={handleBuildAPK} className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 px-3 py-1.5 rounded text-[10px] font-bold hover:bg-emerald-500/40 transition flex items-center gap-1">📱 Build APK</button>
                    <button onClick={handleDownloadZip} className="bg-blue-500/20 text-blue-400 border border-blue-500/50 px-3 py-1.5 rounded text-[10px] font-bold hover:bg-blue-500/40 transition flex items-center gap-1"><DownloadIcon /> Download ZIP</button>
                    
                    {/* 🌍 THE NEW PUBLISH BUTTON */}
                    <button onClick={() => setIsPublishModalOpen(true)} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1.5 rounded text-[11px] font-bold flex items-center gap-1 shadow-[0_0_15px_rgba(37,99,235,0.4)] hover:scale-105 transition-all">🌍 Publish App</button>
                    
                    <div className="h-6 w-px bg-[#2b2b2b] mx-1"></div> {/* Divider */}

                    {activeTab === 'code' && (
                        <button onClick={handleDownload} className="text-gray-400 hover:text-white px-2" title="Download Current File"><DownloadIcon /></button>
                    )}
                    <button onClick={handleRunCode} className="bg-green-600/20 text-green-400 border border-green-600/50 px-4 py-1.5 rounded text-[11px] font-bold flex items-center gap-1 hover:bg-green-600/40 transition"><PlayIcon /> Run Sandbox</button>
                </div>
            </div>

            {/* 📁 FILE TABS (Only visible in Code View) */}
            {activeTab === 'code' && Object.keys(generatedFiles).length > 0 && (
                <div className="flex bg-[#0A0A0E] border-b border-[#2b2b2b] overflow-x-auto shrink-0 scrollbar-hide">
                    {Object.keys(generatedFiles).map(file => (
                        <button key={file} onClick={() => setActiveFile(file)} className={`flex items-center gap-2 px-4 py-2.5 text-[11px] font-mono border-b-2 whitespace-nowrap transition-all ${activeFile === file ? 'border-blue-500 text-blue-400 bg-[#1e1e1e]' : 'border-transparent text-gray-500 hover:bg-[#111116] hover:text-gray-300'}`}>
                            <FileIcon /> {file}
                        </button>
                    ))}
                    <button onClick={handleCopy} className="ml-auto px-4 text-gray-500 hover:text-white" title="Copy Current File Code"><CopyIcon/></button>
                </div>
            )}

            {/* 💻 MAIN SCREEN (Live Preview OR Code Editor) */}
            <div className="flex-1 overflow-auto relative">
                {activeTab === 'preview' ? (
                    <div className="w-full h-full bg-white relative">
                        <iframe title="Live View" srcDoc={previewHtml} className="w-full h-full border-none absolute inset-0" sandbox="allow-scripts allow-same-origin allow-forms allow-popups" />
                    </div>
                ) : (
                    <SyntaxHighlighter language="javascript" style={vscDarkPlus} showLineNumbers={true} wrapLines={true} wrapLongLines={false} customStyle={{ margin: 0, padding: '1rem', background: '#1e1e1e', fontSize: '13px', minHeight: '100%' }}>
                        {formatCode(generatedFiles[activeFile], activeFile)}
                    </SyntaxHighlighter>
                )}
            </div>

            {/* 🖥️ BOTTOM TERMINAL CONSOLE */}
            {isConsoleOpen && (
                <div className="h-[180px] bg-[#0A0A0E] border-t border-[#2b2b2b] shrink-0 flex flex-col shadow-[0_-10px_20px_rgba(0,0,0,0.5)]">
                    <div className="h-7 bg-[#111116] border-b border-[#2b2b2b] flex items-center justify-between px-3 text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                        <div className="flex items-center gap-2"><TerminalIcon/> Output Console</div>
                        <button onClick={() => setIsConsoleOpen(false)} className="hover:text-red-400 transition-colors"><CloseIcon/></button>
                    </div>
                    <div className="flex-1 p-3 overflow-auto font-mono text-[12px] text-green-400 whitespace-pre-wrap leading-relaxed">
                        {terminalOutput}
                    </div>
                </div>
            )}
        </div>
    );
}
