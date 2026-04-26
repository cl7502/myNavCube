import { useState } from 'react';
import { api } from '../lib/api';
import { useStore } from '../store';

export function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (isRegister) {
        await api.post('/api/auth/register', { username, password });
        setIsRegister(false);
      } else {
        const { token } = await api.post('/api/auth/login', { username, password });
        localStorage.setItem('token', token);
        window.location.reload();
      }
    } catch (err: any) {
      setError(JSON.parse(err.message).error || 'An error occurred');
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-[#F4F5F7] font-sans">
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 w-full max-w-sm">
        <h2 className="text-xl font-bold mb-5 text-center text-gray-800">{isRegister ? '注册' : '登录'} myNavCube</h2>
        {error && <div className="text-red-500 mb-4 text-xs text-center font-medium bg-red-50 py-1.5 rounded">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">用户名</label>
            <input 
              type="text" 
              className="w-full border border-gray-300 rounded p-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required 
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">密码</label>
            <input 
              type="password" 
              className="w-full border border-gray-300 rounded p-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required 
            />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white rounded p-2 text-sm font-bold hover:bg-blue-700 transition-colors mt-2 shadow-sm">
            {isRegister ? '注册账号' : '立即登录'}
          </button>
        </form>
        <div className="mt-4 text-center border-t border-gray-100 pt-3">
          <button 
            onClick={() => setIsRegister(!isRegister)}
            className="text-xs text-gray-500 hover:text-blue-600 transition-colors font-medium"
          >
            {isRegister ? '已有账号？去登录' : '没有账号？去注册'}
          </button>
        </div>
      </div>
    </div>
  );
}
