import React, { useState } from 'react';
import { Shield, Lock, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LoginProps {
  onNavigate: (tab: string) => void;
}

export const Login: React.FC<LoginProps> = ({ onNavigate }) => {
  const { loginWithFirebase, isFirebaseActive, isAdmin, adminEmail } = useAuth();
  const [password, setPassword] = useState('');
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
          ท่านกำลังใช้งานบัญชีผู้ดูแลระบบ ({adminEmail})
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
      await loginWithFirebase(password);
      onNavigate('admin');
    } catch (err: unknown) {
      const code = err && typeof err === 'object' && 'code' in err && typeof err.code === 'string'
        ? err.code
        : '';
      const message = err instanceof Error ? err.message : '';
      if (code === 'auth/invalid-credential') {
        setErrorMsg('รหัสผ่านไม่ถูกต้อง กรุณาลองอีกครั้ง');
      } else if (code === 'auth/operation-not-allowed') {
        setErrorMsg('ยังไม่ได้เปิดวิธีลงชื่อเข้าใช้ Email/Password ใน Firebase Authentication');
      } else if (code === 'auth/too-many-requests') {
        setErrorMsg('มีการลองเข้าสู่ระบบหลายครั้งเกินไป โปรดลองใหม่ภายหลังหรือรีเซ็ตรหัสผ่าน');
      } else if (code === 'auth/network-request-failed') {
        setErrorMsg('เชื่อมต่อ Firebase ไม่สำเร็จ โปรดตรวจสอบเครือข่ายแล้วลองอีกครั้ง');
      } else {
        setErrorMsg(message || 'การเข้าสู่ระบบล้มเหลว โปรดตรวจสอบการตั้งค่า Firebase และบัญชีผู้ดูแล');
      }
    } finally {
      setLoading(false);
    }
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

        {!isFirebaseActive && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900">
            ยังไม่ได้ตั้งค่า Firebase Authentication จึงไม่สามารถเข้าสู่ระบบได้ โปรดตรวจสอบไฟล์ <code>firebase-applet-config.json</code>
          </div>
        )}

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
              รหัสผ่านผู้ดูแลระบบ (Admin Password)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#9c7d5c] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                autoComplete="current-password"
                autoFocus
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 text-xs text-[#463629] bg-[#fffdf7] border border-[#d7c8b2] rounded-lg focus:outline-none focus:border-[#9c7d5c]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !isFirebaseActive}
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
