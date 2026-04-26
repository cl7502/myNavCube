import * as Dialog from '@radix-ui/react-dialog';
import { useStore } from '../store';
import { useState } from 'react';
import { api } from '../lib/api';

export function UserModal({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  const { user, setUser } = useStore();
  const [name, setName] = useState(user?.name || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [password, setPassword] = useState('');

  const handleSave = async () => {
    try {
      await api.put('/api/user/info', { name, avatar, password });
      setUser({ ...user!, name, avatar });
      onOpenChange(false);
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <Dialog.Content className="w-[400px] bg-white rounded-xl shadow-2xl z-50 overflow-hidden outline-none">
            <div className="bg-gray-100 px-4 py-3 flex justify-between items-center border-b border-gray-200">
              <Dialog.Title className="text-sm font-bold">个人信息</Dialog.Title>
              <button className="text-gray-400 hover:text-black transition" onClick={() => onOpenChange(false)}>✕</button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">账号登录名 (不可改)</label>
                <input type="text" disabled value={user?.username} className="w-full border border-gray-200 rounded p-2 text-sm bg-gray-50 text-gray-500" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">姓名</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full border border-gray-200 rounded p-2 text-sm outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">头像URL</label>
                <input type="text" value={avatar} onChange={e => setAvatar(e.target.value)} className="w-full border border-gray-200 rounded p-2 text-sm outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">修改密码 (留空则不修改)</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full border border-gray-200 rounded p-2 text-sm outline-none focus:border-blue-500" />
              </div>
            </div>
            
            <div className="bg-gray-50 p-3 flex justify-end gap-2 border-t border-gray-200">
              <button className="px-4 py-1.5 border border-gray-300 bg-white hover:bg-gray-100 transition rounded text-xs text-gray-700 font-medium" onClick={() => onOpenChange(false)}>取消</button>
              <button className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 transition text-white rounded text-xs font-medium" onClick={handleSave}>保存修改</button>
            </div>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
