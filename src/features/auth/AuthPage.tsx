import React, { useState } from'react';
import { useNavigate } from'react-router-dom';
import { useForm } from'react-hook-form';
import { zodResolver } from'@hookform/resolvers/zod';
import { z } from'zod';
import { useAuthStore } from'../../store/authStore';
import { useToast } from'../../components/Toast';
import { cn } from'../../lib/utils';
import { Eye, EyeOff } from'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Invalid email address').max(254),
  password: z.string().min(1,'Password is required')
});

const registerSchema = z.object({
  name: z.string().max(50).optional(),
  email: z.string().email('Invalid email address').max(254),
  password: z.string()
    .min(8,'Must be at least 8 characters')
    .regex(/[A-Z]/,'Must contain an uppercase letter')
    .regex(/[0-9]/,'Must contain a number')
});

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const loginFn = useAuthStore(s => s.login);
  const navigate = useNavigate();
  const { toast } = useToast();

  const schema = isLogin ? loginSchema : registerSchema;
  type FormData = z.infer<typeof schema>;

  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<FormData>({
    resolver: zodResolver(schema)
  });

  const passwordValue = watch('password') ||'';

  const onSubmit = async (data: any) => {
    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email, password: data.password, name: data.name })
      });
      
      const result = await res.json();
      
      if (!res.ok) {
        throw new Error(result.detail || 'Authentication failed');
      }

      loginFn({ id: result.id, email: result.email, name: result.name || result.email.split('@')[0], token: result.token });
      toast({ type:'success', message: isLogin ?'Welcome back!' :'Account created!' });
      navigate('/dashboard');
    } catch (err: any) {
      toast({ type:'error', message: err.message });
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    reset();
  };

  const getStrength = (pw: string) => {
    if (!pw) return 0;
    let s = 0;
    if (pw.length >= 8) s++;
    if (/[A-Z]/.test(pw)) s++;
    if (/[0-9]/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    return s; // 0 to 4
  };

  const strength = isLogin ? 0 : getStrength(passwordValue);

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 w-full animate-in fade-in">
      <div className="w-full max-w-[360px] bg-white  rounded-2xl border border-gray-200  p-6 sm:p-8 shadow-sm">
        <h1 className="text-[20px] font-medium text-gray-900  mb-6 text-center">
          {isLogin ?'Welcome back' :'Create an account'}
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {!isLogin && (
            <div>
              <label className="block text-[12px] text-gray-500 mb-1.5 focus-within:text-[#1a73e8]">Name (optional)</label>
              <input 
                {...(register as any)('name')}
                placeholder="Jane Doe"
                className="w-full h-[40px] px-3 bg-white  border border-gray-300  rounded-lg text-[13px] outline-none focus:border-[#1a73e8] transition-colors"
              />
              {(errors as any).name && <div className="text-[11px] text-[#d93025] mt-1">{(errors as any).name.message as string}</div>}
            </div>
          )}

          <div>
            <label className="block text-[12px] text-gray-500 mb-1.5 focus-within:text-[#1a73e8]">Email</label>
            <input 
              {...register('email')}
              type="email"
              placeholder="you@example.com"
              className="w-full h-[40px] px-3 bg-white  border border-gray-300  rounded-lg text-[13px] outline-none focus:border-[#1a73e8] transition-colors"
            />
            {errors.email && <div className="text-[11px] text-[#d93025] mt-1">{errors.email.message as string}</div>}
          </div>

          <div>
            <label className="block text-[12px] text-gray-500 mb-1.5 focus-within:text-[#1a73e8]">Password</label>
            <div className="relative">
              <input 
                {...register('password')}
                type={showPassword ?"text":"password"}
                placeholder="••••••••"
                className="w-full h-[40px] px-3 pr-10 bg-white  border border-gray-300  rounded-lg text-[13px] outline-none focus:border-[#1a73e8] transition-colors"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 :text-gray-300"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            
            {!isLogin && (
              <div className="mt-2 mb-1 flex gap-1 h-1">
                {[1, 2, 3, 4].map(level => {
                  let colorClass ="bg-gray-100";
                  if (level <= strength) {
                    if (strength <= 2) colorClass ="bg-[#fde293]"; // amber
                    else if (strength === 3) colorClass ="bg-[#81c995]"; // teal light
                    else colorClass ="bg-[#34a853]"; // teal pure
                  }
                  return <div key={level} className={cn("h-full flex-1 rounded-full transition-colors duration-300", colorClass)} />
                })}
              </div>
            )}
            {errors.password && <div className="text-[11px] text-[#d93025] mt-1">{errors.password.message as string}</div>}
          </div>

          <button 
            type="submit"
            className="w-full h-[40px] mt-2 bg-[#1a73e8] hover:bg-[#1967d2] text-white font-medium rounded-full text-[13px] transition-colors shadow-sm"
          >
            {isLogin ?'Sign in' :'Create account'}
          </button>
        </form>

        <div className="mt-6 text-center text-[13px] text-gray-500">
          {isLogin ?"Don't have an account?":"Already have an account?"}{''}
          <button onClick={toggleMode} className="text-[#1967d2]  font-medium hover:underline">
            {isLogin ?'Register' :'Log in'}
          </button>
        </div>
      </div>
    </div>
  );
}
