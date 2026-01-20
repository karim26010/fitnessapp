import React, { useState } from 'react';
import { Lock, User, CheckSquare, Square, ArrowRight } from 'lucide-react';
import { Button } from './Button';
import { Input } from './Input';

interface AuthPageProps {
  onLogin: (u: string, p: string) => Promise<void>;
  onSignup: (u: string, e: string, p: string) => Promise<void>;
  isSignup: boolean;
  setIsSignup: (val: boolean) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onLogin, onSignup, isSignup, setIsSignup }) => {
  const [username, setUsername] = useState('karim26010');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password123');
  const [agreed, setAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      alert("Please agree to the Terms and Conditions.");
      return;
    }
    setIsLoading(true);
    if (isSignup) {
      await onSignup(username, email, password);
    } else {
      await onLogin(username, password);
    }
    setIsLoading(false);
  };

  const glassInputClass = "!bg-white/5 !border !border-white/10 !text-white placeholder:!text-slate-500 focus:!bg-black/20 focus:!border-primary-500/50";

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-[100px] -translate-y-1/2 animate-pulse-slow"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] translate-y-1/2 animate-pulse-slow"></div>

      <div className="w-full max-w-[480px] glass-card rounded-3xl p-8 md:p-12 shadow-2xl relative z-10 animate-slide-up">

        {/* Header Icon */}
        <div className="flex justify-center mb-8">
          <div className="h-16 w-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary-400 shadow-[0_0_15px_rgba(139,92,246,0.15)]">
            <Lock size={28} />
          </div>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
            {isSignup ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className="text-slate-400 text-sm">
            {isSignup
              ? 'Join us to track your fitness journey'
              : 'Sign in to keep your nutrition and workouts in one place'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            icon={User}
            placeholder="Enter your username"
            required
            autoComplete="username"
            className={glassInputClass}
          />

          {isSignup && (
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              autoComplete="email"
              className={glassInputClass}
            />
          )}

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={Lock}
            placeholder="••••••••••••••"
            required
            autoComplete={isSignup ? "new-password" : "current-password"}
            className={glassInputClass}
          />

          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setAgreed(!agreed)}>
            <div className={`text-slate-400 transition-colors ${agreed ? 'text-primary-500' : ''}`}>
              {agreed ? <CheckSquare size={20} /> : <Square size={20} />}
            </div>
            <span className="text-sm text-slate-400 select-none">
              I agree to the <span className="text-primary-400 hover:text-primary-300 hover:underline transition-colors">Privacy Notice and Terms of Conditions</span>.
            </span>
          </div>

          <Button
            type="submit"
            fullWidth
            isLoading={isLoading}
            className="group shadow-primary-500/25"
          >
            <span className="mr-2">{isSignup ? 'Sign Up' : 'Sign In'}</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Button>

          {!isSignup && (
            <div className="flex justify-between text-sm mt-4">
              <button type="button" className="text-primary-400 hover:text-primary-300 hover:underline transition-colors">Forgot Password?</button>
              <button type="button" className="text-primary-400 hover:text-primary-300 hover:underline transition-colors">Forgot Username?</button>
            </div>
          )}
        </form>

        <div className="my-8 relative flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <span className="relative bg-[#0b101d] px-4 text-sm text-slate-500 rounded-full">Or continue with</span>
        </div>

        <button
          type="button"
          className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl py-3.5 flex items-center justify-center transition-all duration-200 group"
        >
          <svg className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Continue with Google
        </button>

        <div className="mt-8 text-center text-sm text-slate-400">
          {isSignup ? 'Already have an account?' : "Don't have an account?"}
          <button
            onClick={() => setIsSignup(!isSignup)}
            className="text-primary-400 font-medium hover:underline transition-colors ml-1"
          >
            {isSignup ? 'Sign In' : 'Sign Up'}
          </button>
        </div>
      </div>
    </div>
  );
};