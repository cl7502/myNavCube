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

const getThemeColors = (theme: string) => {
  switch(theme) {
    case 'dark':
      return { bg: '#1f2937', border: '#374151', text: '#f3f4f6', textSecondary: '#9ca3af', accent: '#60a5fa', buttonBg: '#374151' };
    case 'superhuman':
      return { bg: '#ffffff', border: '#dcd7d3', text: '#292827', textSecondary: '#714cb6', accent: '#cbb7fb', buttonBg: '#e9e5dd' };
    case 'airtable':
      return { bg: '#ffffff', border: '#e0e2e6', text: '#181d26', textSecondary: '#333333', accent: '#1b61c9', buttonBg: '#f8fafc' };
    default:
      return { bg: '#ffffff', border: '#e5e7eb', text: '#111827', textSecondary: '#6b7280', accent: '#2563eb', buttonBg: '#f3f4f6' };
  }
};

const colors = getThemeColors(settings.theme);

  return (
    <header className="h-12 border-b flex items-center justify-between px-4 z-20 shrink-0" 
      style={{ 
        backgroundColor: colors.bg,
        borderColor: colors.border,
        boxShadow: settings.theme === 'superhuman' ? 'none' : '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
      }}>
      <div className="flex items-center gap-3">
        <button 
          className="w-8 h-8 rounded flex items-center justify-center text-white font-bold transition"
          style={{ backgroundColor: settings.theme === 'airtable' ? '#1b61c9' : settings.theme === 'superhuman' ? '#cbb7fb' : '#2563eb' }}
          onClick={() => setSidebarExpanded(!isSidebarExpanded)}
        >
          <Menu size={16} />
        </button>
        <div className="flex items-baseline gap-2">
          <span className="text-base font-bold tracking-tight font-sans leading-none" 
            style={{ color: colors.text }}>
            myNavCube</span>
          <span className="text-[11px] font-mono tracking-tight" 
            style={{ color: colors.textSecondary }}>
            v1.2.0-stable</span>
        </div>
      </div>

<div className="flex items-center gap-4">
        {/* Languages, Themes, Layouts */}
<select 
          className="text-xs border py-1 px-2 rounded outline-none cursor-pointer"
          style={{ 
            backgroundColor: 'transparent',
            borderColor: colors.border,
            color: colors.text
          }}
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
          className="text-xs border py-1 px-2 rounded outline-none cursor-pointer"
          style={{ 
            backgroundColor: 'transparent',
            borderColor: colors.border,
            color: colors.text
          }}
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
          <option value="superhuman">Superhuman</option>
          <option value="airtable">Airtable</option>
        </select>
        
<select 
          className="text-xs border py-1 px-2 rounded outline-none cursor-pointer"
          style={{ 
            backgroundColor: 'transparent',
            borderColor: colors.border,
            color: colors.text
          }}
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
        <div className="flex items-center gap-2 h-8 relative group" 
          style={{ borderColor: colors.border, borderLeftWidth: '1px', borderLeftStyle: 'solid', paddingLeft: '16px' }}>
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
