import React, { useState } from 'react';
import { Shield, Lock, Mail, ArrowRight, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LoginProps {
  onNavigate: (tab: string) => void;
}

export const Login: React.FC<LoginProps> = ({ onNavigate }) => {
  const { loginWithFirebase, loginAsDemoAdmin, isFirebaseActive, isAdmin } = useAuth();
  const [email, setEmail] = useState('admin@gmail.com');
  const [password, setPassword] = useState('admin123456');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (isAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 bg-[#ece4d4] rounded-full flex items-center justify-center mx-auto text-[#9c7d5c]">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold font-editorial text-[#463629]">
          เข้าสู่ระบบในฐานะผู้ดูแลแล้ว
        </h2>
        <p className="text-xs text-[#6f5a45]">
          ท่านกำลังใช้งานบัญชีผู้ดูแลระบบ (admin@gmail.com)
        </p>
        <div className="pt-2 flex flex-col gap-2">
          <button
            onClick={() => onNavigate('admin')}
            className="w-full py-2.5 bg-[#9c7d5c] hover:bg-[#856748] text-white rounded-lg text-xs font-semibold"
          >
            ไปที่แผงควบคุมผู้ดูแล (Admin Console)
          </button>
          <button
            onClick={() => onNavigate('home')}
            className="w-full py-2 bg-transparent text-xs text-[#6f5a45] hover:text-[#463629]"
          >
            กลับสู่หน้าหลัก
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      await loginWithFirebase(email, password);
      onNavigate('admin');
    } catch (err: any) {
      setErrorMsg(err.message || 'การเข้าสู่ระบบล้มเหลว ตรวจสอบอีเมลและรหัสผ่าน');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = () => {
    loginAsDemoAdmin();
    onNavigate('admin');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-6">
      
      <button
        onClick={() => onNavigate('home')}
        className="inline-flex items-center gap-1.5 text-xs text-[#6f5a45] hover:text-[#463629] mb-2"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>กลับสู่หน้าหลักสาธารณะ</span>
      </button>

      <div className="bg-white rounded-2xl border border-[#d7c8b2] p-8 shadow-xs space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-10 h-10 bg-[#9c7d5c] text-white rounded-xl flex items-center justify-center mx-auto shadow-xs">
            <Shield className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold font-editorial text-[#463629]">
            เข้าสู่ระบบผู้ดูแลระบบ
          </h1>
          <p className="text-xs text-[#6f5a45]">
            ระบบจำกัดสิทธิ์เฉพาะบัญชีผู้ดูแลระบบที่ได้รับอนุญาตเท่านั้น (Single Admin)
          </p>
        </div>

        {/* Quick Demo Access Bar */}
        <div className="p-3.5 bg-[#ece4d4]/60 rounded-xl border border-[#d7c8b2] space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-[#463629]">ทดสอบระบบใน Development Preview:</span>
            <span className="text-[10px] text-[#9c7d5c] font-mono">admin@gmail.com</span>
          </div>
          <button
            type="button"
            onClick={handleQuickDemo}
            className="w-full py-2 bg-[#9c7d5c] hover:bg-[#856748] text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
          >
            <span>เข้าสู่ระบบทันที (Quick Demo Admin)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Firebase Email/Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-xs font-medium text-[#463629]">
              อีเมลผู้ดูแลระบบ (Admin Email)
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#9c7d5c] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@gmail.com"
                className="w-full pl-9 pr-3 py-2 text-xs text-[#463629] bg-[#fffdf7] border border-[#d7c8b2] rounded-lg focus:outline-none focus:border-[#9c7d5c]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-medium text-[#463629]">
              รหัสผ่าน (Password)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#9c7d5c] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 text-xs text-[#463629] bg-[#fffdf7] border border-[#d7c8b2] rounded-lg focus:outline-none focus:border-[#9c7d5c]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-[#463629] hover:bg-[#34271c] text-white rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
          >
            {loading ? 'กำลังตรวจสอบสิทธิ์...' : 'ยืนยันตัวตนด้วย Firebase Auth'}
          </button>
        </form>

        <div className="text-[11px] text-[#6f5a45]/80 text-center leading-relaxed">
          *ประชาชนและผู้เข้าชมทั่วไปสามารถสืบค้นพิพิธภัณฑ์และหัวเรื่องทั้งหมดได้โดยไม่ต้องลงทะเบียนหรือเข้าสู่ระบบ
        </div>

      </div>

    </div>
  );
};
