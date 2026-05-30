
import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../App';
import { useNavigate } from 'react-router-dom';
import { mockUsers } from '../constants';

export const LoginPage: React.FC = () => {
  const context = useContext(AppContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!context) return null;
  const { currentUser, login } = context;

  useEffect(() => {
    if (currentUser) navigate(currentUser.role === 'admin' ? '/admin' : '/');
  }, [currentUser, navigate]);

  const handleAdminDemoLogin = () => {
      const admin = mockUsers.find(u => u.role === 'admin') || mockUsers[0];
      login({...admin, role: 'admin'});
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-dark-mode-bg font-sans">
        <div className="w-full max-w-4xl bg-white dark:bg-dark-mode-card-bg rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-gray-100 dark:border-gray-800 animate-fade-in-up">
            <div className="md:w-1/2 bg-gray-900 text-white p-12 flex flex-col justify-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-teal/20 rounded-full blur-3xl -mr-20 -mt-20" />
                <h1 className="text-5xl font-black mb-4 z-10 tracking-tighter">Welldone.</h1>
                <p className="text-xl text-gray-400 z-10 font-light leading-relaxed">Redefining health and connection for the modern age.</p>
            </div>
            <div className="md:w-1/2 p-12 flex flex-col justify-center">
                <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-8">Welcome Back</h2>
                <div className="space-y-4">
                    <button onClick={() => login(mockUsers[0])} className="w-full py-4 bg-brand-teal text-white rounded-2xl font-black text-lg shadow-xl transition-transform hover:scale-[1.02]">Login as Member</button>
                    <button onClick={handleAdminDemoLogin} className="w-full py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl font-black text-lg shadow-xl border-4 border-gray-900 dark:border-white transition-transform hover:scale-[1.02] flex items-center justify-center gap-3">
                        <i className="fas fa-shield-alt"></i> Demo Admin Access
                    </button>
                </div>
                <p className="mt-8 text-center text-xs text-gray-400 font-bold uppercase tracking-widest">Connect your story today.</p>
            </div>
        </div>
    </div>
  );
};
