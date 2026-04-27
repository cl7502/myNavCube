import * as Dialog from '@radix-ui/react-dialog';
import { useStore } from '../store';
import { useState, useEffect, type ChangeEvent } from 'react';
import { api } from '../lib/api';
import * as Tabs from '@radix-ui/react-tabs';

const diceBearStyles = ['adventurer', 'avataaars', 'big-ears', 'big-smile', 'bottts', 'croodles', 'fun-emoji', 'lorelei', 'micah', 'miniavs', 'notionists', 'open-peeps', 'personas', 'pixel-art', 'shapes'];

const avataaarsOptions = [
  { name: 'Felix', seed: 'Felix' },
  { name: 'Lucy', seed: 'Lucy' },
  { name: 'Light', seed: 'Light' },
  { name: 'Medium', seed: 'Medium' },
  { name: 'Dark', seed: 'Dark' },
  { name: 'Auburn', seed: 'Auburn' },
  { name: 'Black', seed: 'Black' },
  { name: 'Blonde', seed: 'Blonde' },
  { name: 'Brown', seed: 'Brown' },
  { name: 'Red', seed: 'Red' },
  { name: 'White', seed: 'White' },
  { name: 'Pink', seed: 'Pink' },
  { name: 'Blue', seed: 'Blue' },
  { name: 'Green', seed: 'Green' },
  { name: 'Purple', seed: 'Purple' },
  { name: 'Orange', seed: 'Orange' },
];

function DiceBearSelector({ onSelect }: { onSelect: (icon: string) => void }) {
  const [style, setStyle] = useState('adventurer');
  const seeds = Array.from({ length: 30 }, (_, i) => `seed${i + 1}`);

  return (
    <div className="space-y-2">
      <select
        value={style}
        onChange={(e) => setStyle(e.target.value)}
        className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
      >
        {diceBearStyles.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
      <div className="h-40 overflow-y-auto border border-gray-200 rounded p-2">
        <div className="grid grid-cols-5 gap-1">
          {seeds.map((seed) => (
            <button
              key={seed}
              onClick={() => onSelect(`dicebear:${style}:${seed}`)}
              className="p-1 flex items-center justify-center rounded border border-gray-200 hover:bg-blue-50 hover:border-blue-400"
            >
              <img src={`https://api.dicebear.com/9.x/${style}/svg?seed=${seed}`} alt={seed} className="w-8 h-8" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function OpenPeepsSelector({ onSelect }: { onSelect: (icon: string) => void }) {
  const seeds = Array.from({ length: 30 }, (_, i) => `seed${i + 1}`);

  return (
    <div className="h-40 overflow-y-auto border border-gray-200 rounded p-2">
      <div className="grid grid-cols-5 gap-1">
        {seeds.map((seed) => (
          <button
            key={seed}
            onClick={() => onSelect(`openpeeps:${seed}`)}
            className="p-1 flex items-center justify-center rounded border border-gray-200 hover:bg-blue-50 hover:border-blue-400"
          >
            <img src={`https://api.dicebear.com/9.x/open-peeps/svg?seed=${seed}`} alt={seed} className="w-10 h-10" />
          </button>
        ))}
      </div>
    </div>
  );
}

function AvataaarsSelector({ onSelect }: { onSelect: (icon: string) => void }) {
  return (
    <div className="h-40 overflow-y-auto border border-gray-200 rounded p-2">
      <div className="grid grid-cols-4 gap-1">
        {avataaarsOptions.map((opt) => (
          <button
            key={opt.seed}
            onClick={() => onSelect(`avataaars:${opt.seed}`)}
            className="p-1 flex flex-col items-center justify-center rounded border border-gray-200 hover:bg-blue-50 hover:border-blue-400"
          >
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${opt.seed}`} alt={opt.name} className="w-10 h-10" />
            <span className="text-[9px] text-gray-500 mt-0.5">{opt.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export function UserModal({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  const { user, setUser, settings } = useStore();
  const [name, setName] = useState(user?.name || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [password, setPassword] = useState('');
  const [avatarTab, setAvatarTab] = useState('dicebear');

  useEffect(() => {
    if (open) {
      setName(user?.name || '');
      setAvatar(user?.avatar || '');
      setPassword('');
      if (user?.avatar) {
        if (user.avatar.startsWith('dicebear:')) setAvatarTab('dicebear');
        else if (user.avatar.startsWith('openpeeps:')) setAvatarTab('openpeeps');
        else if (user.avatar.startsWith('avataaars:')) setAvatarTab('avataaars');
        else if (user.avatar.startsWith('http') || user.avatar.startsWith('data:')) setAvatarTab('url');
        else setAvatarTab('upload');
      }
    }
  }, [open, user]);

  const handleSave = async () => {
    try {
      await api.put('/api/user/info', { name, avatar, password });
      setUser({ ...user!, name, avatar });
      onOpenChange(false);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const renderAvatarPreview = () => {
    if (!avatar) return null;
    
    if (avatar.startsWith('http') || avatar.startsWith('data:image')) {
      return <img src={avatar} alt="preview" className="w-12 h-12 rounded-full object-cover" />;
    }
    if (avatar.startsWith('dicebear:')) {
      const parts = avatar.split(':');
      return <img src={`https://api.dicebear.com/9.x/${parts[1]}/svg?seed=${parts[2]}`} alt="preview" className="w-12 h-12" />;
    }
    if (avatar.startsWith('openpeeps:')) {
      const parts = avatar.split(':');
      return <img src={`https://api.dicebear.com/9.x/open-peeps/svg?seed=${parts[1]}`} alt="preview" className="w-12 h-12" />;
    }
    if (avatar.startsWith('avataaars:')) {
      const parts = avatar.split(':');
      return <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${parts[1]}`} alt="preview" className="w-12 h-12" />;
    }
    return null;
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setAvatar(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <Dialog.Content className="w-[420px] rounded-xl shadow-2xl z-50 overflow-hidden outline-none max-h-[90vh] flex flex-col"
            style={{ 
              backgroundColor: settings.theme === 'dark' ? '#1f2937' : '#ffffff',
              border: settings.theme === 'superhuman' ? '1px solid #dcd7d3' : settings.theme === 'dark' ? '1px solid #374151' : 'none'
            }}>
            <div className="px-4 py-3 flex justify-between items-center border-b shrink-0"
              style={{ 
                backgroundColor: settings.theme === 'dark' ? '#374151' : settings.theme === 'superhuman' ? '#e9e5dd' : '#f3f4f6',
                borderColor: settings.theme === 'dark' ? '#4b5563' : '#e5e7eb'
              }}>
              <Dialog.Title className="text-sm font-bold"
                style={{ color: settings.theme === 'dark' ? '#f3f4f6' : '#1f2937' }}>个人信息</Dialog.Title>
              <button className="text-gray-400 hover:text-black transition" onClick={() => onOpenChange(false)}>✕</button>
            </div>
            
            <div className="p-6 space-y-4 overflow-y-auto flex-1">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">账号登录名 (不可改)</label>
                <input type="text" disabled value={user?.username} className="w-full border border-gray-200 rounded p-2 text-sm bg-gray-50 text-gray-500" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">姓名</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full border border-gray-200 rounded p-2 text-sm outline-none focus:border-blue-500" />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-2">
                  头像
                  {avatar && <span className="ml-2">(预览: {renderAvatarPreview()})</span>}
                </label>
                <Tabs.Root value={avatarTab} onValueChange={setAvatarTab} className="border border-gray-200 rounded">
                  <Tabs.List className="flex border-b border-gray-200 bg-gray-50">
                    <Tabs.Trigger value="upload" className="px-2 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 flex-1 text-center">
                      上传
                    </Tabs.Trigger>
                    <Tabs.Trigger value="dicebear" className="px-2 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 flex-1 text-center">
                      DiceBear
                    </Tabs.Trigger>
                    <Tabs.Trigger value="openpeeps" className="px-2 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 flex-1 text-center">
                      Open Peeps
                    </Tabs.Trigger>
                    <Tabs.Trigger value="avataaars" className="px-2 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 flex-1 text-center">
                      Avataaars
                    </Tabs.Trigger>
                    <Tabs.Trigger value="url" className="px-2 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 flex-1 text-center">
                      URL
                    </Tabs.Trigger>
                  </Tabs.List>
                  
                  <div className="p-3">
                    <Tabs.Content value="upload">
                      <div className="space-y-2">
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={handleFileChange}
                          className="w-full text-sm text-gray-500 file:mr-2 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                        {avatar && avatar.startsWith('data:') && (
                          <img src={avatar} alt="preview" className="w-16 h-16 rounded-full object-cover mx-auto" />
                        )}
                      </div>
                    </Tabs.Content>
                    
                    <Tabs.Content value="dicebear">
                      <DiceBearSelector onSelect={setAvatar} />
                    </Tabs.Content>
                    
                    <Tabs.Content value="openpeeps">
                      <OpenPeepsSelector onSelect={setAvatar} />
                    </Tabs.Content>
                    
                    <Tabs.Content value="avataaars">
                      <AvataaarsSelector onSelect={setAvatar} />
                    </Tabs.Content>
                    
                    <Tabs.Content value="url">
                      <input 
                        type="text" 
                        value={avatar} 
                        onChange={e => setAvatar(e.target.value)}
                        placeholder="https://example.com/avatar.jpg"
                        className="w-full border border-gray-200 rounded p-2 text-sm outline-none focus:border-blue-500" 
                      />
                    </Tabs.Content>
                  </div>
                </Tabs.Root>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">修改密码 (留空则不修改)</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full border border-gray-200 rounded p-2 text-sm outline-none focus:border-blue-500" />
              </div>
            </div>
            
            <div className="bg-gray-50 p-3 flex justify-end gap-2 border-t border-gray-200 shrink-0">
              <button className="px-4 py-1.5 border border-gray-300 bg-white hover:bg-gray-100 transition rounded text-xs text-gray-700 font-medium" onClick={() => onOpenChange(false)}>取消</button>
              <button className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 transition text-white rounded text-xs font-medium" onClick={handleSave}>保存修改</button>
            </div>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
}