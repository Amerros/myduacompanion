import React from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../integrations/supabase/client';

const Login: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
        <h1 className="font-serif-display text-3xl text-center text-slate-800 mb-8">
          Welcome to My Dua Companion
        </h1>
        <Auth
          supabaseClient={supabase}
          providers={[]} // You can add 'google', 'github', etc. here if desired
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#10b981', // Emerald-500
                  brandAccent: '#059669', // Emerald-600
                  brandButtonText: 'white',
                  defaultButtonBackground: '#f1f5f9', // Slate-100
                  defaultButtonBackgroundHover: '#e2e8f0', // Slate-200
                  defaultButtonBorder: '#e2e8f0', // Slate-200
                  inputBackground: '#f1f5f9', // Slate-100
                  inputBorder: '#e2e8f0', // Slate-200
                  inputBorderHover: '#94a3b8', // Slate-400
                  inputBorderFocus: '#10b981', // Emerald-500
                  inputText: '#1e293b', // Slate-800
                },
              },
            },
          }}
          theme="light"
          redirectTo={window.location.origin} // Redirects to the app's root after auth
        />
      </div>
    </div>
  );
};

export default Login;