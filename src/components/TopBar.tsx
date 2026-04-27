import { useStore } from '../store';
import { Settings, LogOut, Code, User as UserIcon, PaintBucket, Menu } from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { SettingsModal } from './SettingsModal';
import { UserModal } from './UserModal';
import { useState } from 'react';
import { useTranslation } from '../i18n';

export function TopBar() {
  const { user, settings, setSettings, isSidebarExpanded, setSidebarExpanded } = useStore();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);
  
  const t = useTranslation(settings.language);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload();
  };

  return (
    <header className="h-12 border-b border-gray-300 bg-white flex items-center justify-between px-4 z-20 shadow-sm shrink-0">
      <div className="flex items-center gap-3">
        <button 
          className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold hover:bg-blue-700 transition"
          onClick={() => setSidebarExpanded(!isSidebarExpanded)}
        >
          <Menu size={16} />
        </button>
        <div className="flex items-baseline gap-2">
          <span className="text-base font-bold tracking-tight font-sans text-gray-900 leading-none">myNavCube</span>
          <span className="text-[11px] text-gray-500 font-mono tracking-tight">v1.2.0-stable</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Languages, Themes, Layouts */}
<select 
          className="text-xs border border-gray-200 bg-transparent py-1 px-2 rounded hover:bg-gray-50 outline-none cursor-pointer"
          value={settings.language}
          onChange={(e) => {
             const newSettings = { ...settings, language: e.target.value };
             setSettings({ language: e.target.value });
             import('../lib/api').then(({api}) => api.put('/api/user/settings', { language: e.target.value, data: newSettings }).catch(()=>null));
          }}
        >
          <option value="zh">中文 (简体)</option>
          <option value="en">English</option>
        </select>
        
        <select 
          className="text-xs border border-gray-200 bg-transparent py-1 px-2 rounded hover:bg-gray-50 outline-none cursor-pointer"
          value={settings.theme}
          onChange={(e) => {
             const newSettings = { ...settings, theme: e.target.value };
             setSettings({ theme: e.target.value });
             import('../lib/api').then(({api}) => api.put('/api/user/settings', { language: settings.language, data: newSettings }).catch(()=>null));
          }}
        >
          <option value="default">{t('themeDefault')}</option>
          <option value="light">{t('themeLight')}</option>
          <option value="dark">{t('themeDark')}</option>
        </select>
        
        <select 
          className="text-xs border border-gray-200 bg-transparent py-1 px-2 rounded hover:bg-gray-50 outline-none cursor-pointer"
          value={settings.layout}
          onChange={(e) => {
             const newSettings = { ...settings, layout: e.target.value as any };
             setSettings({ layout: e.target.value as any });
             import('../lib/api').then(({api}) => api.put('/api/user/settings', { language: settings.language, data: newSettings }).catch(()=>null));
          }}
        >
          <option value="vertical">{t('layoutVertical')}</option>
          <option value="horizontal">{t('layoutHorizontal')}</option>
        </select>

        {/* User Dropdown */}
        <div className="flex items-center gap-2 border-l border-gray-200 pl-4 h-8 relative group">
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold outline-none border border-transparent hover:border-blue-300 shadow-sm transition overflow-hidden">
                {user?.avatar ? (
                user.avatar.startsWith('dicebear:') ? 
                  <img src={`https://api.dicebear.com/9.x/${user.avatar.split(':')[1]}/svg?seed=${user.avatar.split(':')[2]}`} className="w-full h-full object-cover" /> :
                user.avatar.startsWith('openpeeps:') ?
                  <img src={`https://api.dicebear.com/9.x/open-peeps/svg?seed=${user.avatar.split(':')[1]}`} className="w-full h-full object-cover" /> :
                user.avatar.startsWith('avataaars:') ?
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.avatar.split(':')[1]}`} className="w-full h-full object-cover" /> :
                  <img src={user.avatar} className="w-full h-full object-cover" />
              ) : <span>{user?.name?.[0]?.toUpperCase() || <UserIcon size={14}/>}</span>}
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content className="min-w-[160px] bg-white border border-gray-200 shadow-xl rounded-lg p-0 z-50 mr-4 overflow-hidden mt-1">
                <div className="p-3 border-b border-gray-100 bg-gray-50 flex flex-col">
                  <span className="text-sm font-bold text-gray-800">{user?.name || user?.username || 'User'}</span>
                  <span className="text-[10px] text-gray-500 mt-0.5">Developer Account</span>
                </div>
                <DropdownMenu.Item className="p-2 text-xs hover:bg-blue-50 cursor-pointer border-b border-gray-100 outline-none flex items-center gap-2" onClick={() => setIsUserOpen(true)}>
                  <UserIcon size={14} /> <span>{t('profile')}</span>
                </DropdownMenu.Item>
                <DropdownMenu.Item className="p-2 text-xs hover:bg-blue-50 cursor-pointer border-b border-gray-100 outline-none flex items-center gap-2" onClick={() => setIsSettingsOpen(true)}>
                  <Settings size={14} /> <span>{t('settings')}</span>
                </DropdownMenu.Item>
                <DropdownMenu.Item className="p-2 text-xs hover:bg-red-50 text-red-600 cursor-pointer outline-none flex items-center gap-2" onClick={handleLogout}>
                  <LogOut size={14} /> <span>{t('logout')}</span>
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
      </div>

      <SettingsModal open={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
      <UserModal open={isUserOpen} onOpenChange={setIsUserOpen} />
    </header>
  );
}
