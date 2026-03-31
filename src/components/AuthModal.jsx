import React, { useState } from 'react';

// Close Icon for Modal
const CloseIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;

export default function AuthModal({ isOpen, onClose, onSuccess, backendUrl }) {
    const [authMode, setAuthMode] = useState('login'); 
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const endpoint = authMode === 'login' ? '/api/login' : '/api/signup';
        const body = authMode === 'login' ? { email, password } : { name, email, password };
        
        try {
            const res = await fetch(`${backendUrl}${endpoint}`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
            });
            const data = await res.json();
            if (data.success) {
                onSuccess(data.token, data.user);
            } else {
                alert("Error: " + data.error);
            }
        } catch(err) {
            alert("Network Error! Is the backend running?");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <div className="bg-[#111116] border border-[#2b2b2b] w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl animate-fade-in-up">
                <div className="p-6 pb-2 border-b border-[#2b2b2b] flex justify-between items-center relative">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
                    </h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-white transition"><CloseIcon/></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
                    {authMode === 'signup' && (
                        <div>
                            <label className="text-xs text-gray-400 font-bold mb-1.5 block">Full Name</label>
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Mantu Patra" className="w-full bg-[#0A0A0E] border border-[#2b2b2b] rounded-lg p-3 text-sm text-white outline-none focus:border-blue-500 transition" />
                        </div>
                    )}
                    <div>
                        <label className="text-xs text-gray-400 font-bold mb-1.5 block">Email Address</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="cto@mantu.ai" className="w-full bg-[#0A0A0E] border border-[#2b2b2b] rounded-lg p-3 text-sm text-white outline-none focus:border-blue-500 transition" />
                    </div>
                    <div>
                        <label className="text-xs text-gray-400 font-bold mb-1.5 block">Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" className="w-full bg-[#0A0A0E] border border-[#2b2b2b] rounded-lg p-3 text-sm text-white outline-none focus:border-blue-500 transition" />
                    </div>
                    
                    <button type="submit" disabled={loading} className="mt-2 w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white py-3 rounded-lg font-bold text-sm shadow-[0_0_15px_rgba(37,99,235,0.3)] transition">
                        {loading ? 'Processing...' : (authMode === 'login' ? 'Log In' : 'Sign Up')}
                    </button>
                    
                    <div className="text-center mt-2 text-xs text-gray-500">
                        {authMode === 'login' ? "Don't have an account? " : "Already have an account? "}
                        <button type="button" onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')} className="text-blue-400 font-bold hover:underline">
                            {authMode === 'login' ? 'Sign Up' : 'Log In'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
