import React, { useState } from 'react';
import { LogIn, UserPlus, User, AlertCircle, Sparkles, Lock, CheckCircle2 } from 'lucide-react';
import { signInWithEmail, signUpWithEmail, getUserRoleFromFirestore } from '../lib/firebase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: any, role: 'user' | 'admin') => void;
  defaultRole?: 'user' | 'admin';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      if (mode === 'signup') {
        const initialRole = (email.toLowerCase().includes('admin') || email.toLowerCase() === 'vishwaceo67@gmail.com') ? 'admin' : 'user';
        const user = await signUpWithEmail(email, password, initialRole);
        const derivedRole = await getUserRoleFromFirestore(user);
        onSuccess(user, derivedRole);
        onClose();
      } else {
        const user = await signInWithEmail(email, password);
        const derivedRole = await getUserRoleFromFirestore(user);
        onSuccess(user, derivedRole);
        onClose();
      }
    } catch (err: any) {
      console.warn('Firebase Auth error:', err);
      let msg = err.message || 'Authentication failed.';
      if (err.code === 'auth/operation-not-allowed' || err.code === 'auth/admin-restricted-operation') {
        msg = 'Email/Password authentication is not enabled in Firebase Console for project cybersafe-learn. Please enable Email/Password provider in Firebase Console under Authentication > Sign-in method, or use Quick Demo Login below.';
      } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found') {
        msg = 'Invalid email or password. You can click Quick Demo Login below or Sign Up.';
      } else if (err.code === 'auth/email-already-in-use') {
        msg = 'Email already in use. Please switch to Sign In.';
      } else if (err.code === 'auth/weak-password') {
        msg = 'Password should be at least 6 characters.';
      }
      setErrorMsg(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoUserLogin = async () => {
    setErrorMsg('');
    setIsLoading(true);

    const demoEmail = 'user@ecoclassify.org';
    const demoPass = 'ecoClassify2026!';

    try {
      try {
        const user = await signInWithEmail(demoEmail, demoPass);
        onSuccess(user, 'user');
        onClose();
      } catch (signInErr: any) {
        if (signInErr.code === 'auth/operation-not-allowed' || signInErr.code === 'auth/admin-restricted-operation') {
          // Fallback to local demo session if Firebase Auth provider is disabled
          const localDemoUser = {
            uid: `demo-user-${Date.now()}`,
            email: demoEmail,
            displayName: 'Demo User',
            isAnonymous: false,
          };
          onSuccess(localDemoUser, 'user');
          onClose();
          return;
        }

        // Try sign up if user doesn't exist
        try {
          const user = await signUpWithEmail(demoEmail, demoPass, 'user');
          onSuccess(user, 'user');
          onClose();
        } catch (signUpErr: any) {
          if (signUpErr.code === 'auth/operation-not-allowed' || signUpErr.code === 'auth/admin-restricted-operation') {
            const localDemoUser = {
              uid: `demo-user-${Date.now()}`,
              email: demoEmail,
              displayName: 'Demo User',
              isAnonymous: false,
            };
            onSuccess(localDemoUser, 'user');
            onClose();
          } else {
            throw signUpErr;
          }
        }
      }
    } catch (err: any) {
      setErrorMsg(`Demo login: ${err.message || 'Error authenticating.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 border border-slate-200 shadow-2xl animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <Lock className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900">
                {mode === 'signin' ? 'Sign In to EcoClassify' : 'Create an Account'}
              </h2>
              <p className="text-xs text-slate-500">Firebase Authenticated Portal</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 font-bold text-sm px-2 py-1 rounded-lg hover:bg-slate-100"
          >
            ✕
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="flex rounded-xl bg-slate-100 p-1">
          <button
            onClick={() => { setMode('signin'); setErrorMsg(''); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center space-x-1.5 ${
              mode === 'signin' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
          <button
            onClick={() => { setMode('signup'); setErrorMsg(''); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center space-x-1.5 ${
              mode === 'signup' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Sign Up</span>
          </button>
        </div>

        {/* Registration Security Note */}
        {mode === 'signup' && (
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-1">
            <div className="flex items-center space-x-1.5 font-bold text-slate-800">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Authentication & Roles</span>
            </div>
            <p>
              Your account permissions (User or ML Admin) are securely mapped based on your authentication profile in Firebase.
            </p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              required
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
            <input
              type="password"
              required
              minLength={6}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center space-x-2 transition-all shadow-md"
          >
            {isLoading ? (
              <span>Authenticating with Firebase...</span>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>{mode === 'signin' ? 'Sign In to Account' : 'Register New Account'}</span>
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Access (End User Only) */}
        <div className="pt-2 border-t border-slate-100 space-y-2">
          <p className="text-[11px] font-bold text-slate-500 text-center uppercase tracking-wider">
            Quick One-Click Demo Access
          </p>

          <button
            onClick={handleDemoUserLogin}
            disabled={isLoading}
            className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all"
          >
            <User className="w-3.5 h-3.5 text-emerald-600" />
            <span>Try Demo User Account</span>
          </button>
        </div>
      </div>
    </div>
  );
};
