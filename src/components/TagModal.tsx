import * as Dialog from '@radix-ui/react-dialog';
import { useStore, Tag } from '../store';
import { useState, useEffect, useCallback, useRef, type MouseEvent } from 'react';
import { X, Trash2, Globe, ExternalLink, Ban } from 'lucide-react';
import * as Icons from 'lucide-react';
import * as Tabs from '@radix-ui/react-tabs';
import { api } from '../lib/api';

const presetColors = [
  '#374151', '#6b7280', '#9ca3af', '#1f2937', '#111827',
  '#dc2626', '#ea580c', '#f59e0b', '#84cc16', '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e',
  '#000000', '#ffffff', '#fef2f2', '#fef3c7', '#ecfccb', '#ccfbf1', '#cffafe', '#e0f2fe', '#dbeafe', '#e0e7ff', '#eef2ff', '#fae8ff', '#ffe4e6'
];

const commonIcons = [
  'Globe', 'Star', 'Heart', 'Zap', 'Book', 'Briefcase', 'Coffee', 'Code', 'Cpu', 'Database', 
  'FileText', 'Folder', 'Home', 'Image', 'Link', 'Map', 'MessageSquare', 'Music', 'Paperclip', 
  'Play', 'Search', 'Settings', 'ShoppingBag', 'Smile', 'Sun', 'Tag', 'Terminal', 'Tool', 
  'TrendingUp', 'Truck', 'Tv', 'Umbrella', 'User', 'Video', 'Watch', 'Wifi', 'Mail', 'Calendar',
  'CreditCard', 'Gift', 'Key', 'Lock', 'Package', 'Phone', 'Printer', 'Share2', 'Shield', 'Tool'
];

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
];

function IconifySearch({ onSelect, searchQuery }: { onSelect: (icon: string) => void; searchQuery: string }) {
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const searchIcons = useCallback(async () => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`https://api.iconify.design/search?query=${encodeURIComponent(searchQuery)}&limit=30`);
      const data = await res.json();
      setResults(data.icons || []);
    } catch (e) {
      console.error('Failed to search iconify:', e);
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    const timer = setTimeout(searchIcons, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, searchIcons]);

  return (
    <div className="h-36 overflow-y-auto border border-gray-200 rounded p-2">
      {loading ? (
        <div className="flex items-center justify-center h-full text-gray-400 text-sm">搜索中...</div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-6 gap-1">
          {results.map((iconName) => (
            <button
              key={iconName}
              onClick={() => onSelect(iconName)}
              className="p-1.5 flex items-center justify-center rounded border border-gray-200 hover:bg-blue-50 hover:border-blue-400"
              title={iconName}
            >
              <img
                src={`https://api.iconify.design/${iconName.split(':')[0]}/${iconName.split(':')[1]}.svg?width=18&height=18`}
                alt={iconName}
                className="w-4 h-4"
              />
            </button>
          ))}
        </div>
      ) : searchQuery ? (
        <div className="flex items-center justify-center h-full text-gray-400 text-sm">未找到图标</div>
      ) : (
        <div className="flex items-center justify-center h-full text-gray-400 text-sm">输入关键词搜索</div>
      )}
    </div>
  );
}

function DiceBearSelector({ onSelect, searchQuery }: { onSelect: (icon: string) => void; searchQuery: string }) {
  const [style, setStyle] = useState('avataaars');
  const seeds = searchQuery.trim() 
    ? [searchQuery.trim(), ...Array.from({ length: 11 }, (_, i) => `seed${i + 1}`)]
    : Array.from({ length: 12 }, (_, i) => `seed${i + 1}`);

  return (
    <div className="space-y-2">
      <select
        value={style}
        onChange={(e) => setStyle(e.target.value)}
        className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:outline-none"
      >
        {diceBearStyles.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
      <div className="h-36 overflow-y-auto border border-gray-200 rounded p-2">
        <div className="grid grid-cols-4 gap-1">
          {seeds.map((seed, idx) => (
            <button
              key={`${seed}-${idx}`}
              onClick={() => onSelect(`dicebear:${style}:${seed}`)}
              className="p-1.5 flex items-center justify-center rounded border border-gray-200 hover:bg-blue-50 hover:border-blue-400"
            >
              <img src={`https://api.dicebear.com/9.x/${style}/svg?seed=${seed}`} alt={seed} className="w-6 h-6" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function AvataaarsSelector({ onSelect, searchQuery }: { onSelect: (icon: string) => void; searchQuery: string }) {
  const filteredOptions = searchQuery.trim()
    ? [...avataaarsOptions, { name: searchQuery.trim(), seed: searchQuery.trim() }]
    : avataaarsOptions;

  return (
    <div className="h-36 overflow-y-auto border border-gray-200 rounded p-2">
      <div className="grid grid-cols-3 gap-1">
        {filteredOptions.map((opt) => (
          <button
            key={opt.seed}
            onClick={() => onSelect(`avataaars:${opt.seed}`)}
            className="p-1.5 flex flex-col items-center justify-center rounded border border-gray-200 hover:bg-blue-50 hover:border-blue-400"
          >
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${opt.seed}`} alt={opt.name} className="w-6 h-6" />
            <span className="text-[9px] text-gray-500 mt-0.5">{opt.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

const tagIconLibraryIcons: Record<string, string[]> = {
  lucide: [
    'globe','star','heart','zap','book','briefcase','coffee','code','cpu','database',
    'file-text','folder','home','image','link','map','message-square','music','paperclip','play','search',
    'settings','shopping-bag','sun','tag','terminal','tool','trending-up','truck','tv','umbrella','user',
    'video','watch','wifi','mail','calendar','credit-card','key','lock','phone','printer','share2','shield',
    'bell','bookmark','check-circle','clipboard','clock','cloud','compass','copy','edit','eye','file','flag',
    'hash','headphones','inbox','layers','layout','list','loader','mic','monitor','moon','mouse','move',
    'navigation','pause','pie-chart','power','repeat','save','send','server','skip-back','sliders','smartphone',
    'speaker','square','stack','target','thumbs-up','timer','trash','upload','wallet','wind',
    'x-circle','activity','airplane','anchor','archive','arrow-down','arrow-left','arrow-right','arrow-up',
    'baby','backpack','battery','bed','box','bug','building','bus','car','chat','check','chevron-down',
    'clipboard-check','cloud-lightning','cloud-rain','code-editor','columns','filter','flag','folder-open'
  ],
  iconoir: [
    'globe','star','heart','lightning','book','briefcase','coffee','code','database','file-text',
    'folder','home','image','link','map','message-circle','music','paperclip','play','search',
    'settings','shopping-bag','sun','tag','terminal','tool','trending-up','truck','tv','umbrella',
    'user','video','watch','wifi','mail','calendar','credit-card','key','lock','phone','printer','share',
    'shield','bell','bookmark','check-circle','clipboard','clock','cloud','edit','eye','file','flag',
    'hash','headphones','inbox','layers','list','mic','monitor','moon','mouse','move','music',
    'navigation','pause','pie-chart','power','repeat','save','send','server','skip-back','sliders','smartphone',
    'speaker','square','stack','target','thumbs-up','timer','trash','tree-structure','upload','wallet',
    'wind','x-circle','youtube','activity','airplane','anchor','archive','arrow-bend-double-up','arrow-down',
    'arrow-left','arrow-right','arrow-up','arrows-in','arrows-out','award','axe','baby','backpack'
  ],
  ph: [
    'globe-star','star','heart','lightning','book','briefcase','coffee','code','cpu','database',
    'file-text','folder','home','image','link','map','chats-circle','music-notes','paperclip','play',
    'magnifying-glass','gear','shopping-bag','smiley','sun','tag','terminal','wrench','trend-up','truck',
    'tv','umbrella','user','video-camera','watch','wifi-high','envelope','calendar','credit-card','key',
    'lock','phone','printer','share-network','shield-check','bell','bookmark-simple','calendar-check',
    'check-circle','clipboard','clock','cloud','pencil','eye','file','flag','hash','headphones','inbox',
    'layers','grid-four','list','microphone','monitor','moon','mouse','arrows-left-right','music-notes-simple',
    'pause','chart-pie','power','repeat','rewind','floppy-disk','paper-plane-tilt','server',
    'skip-back','skip-forward','sliders-horizontal','device-mobile','speaker-high','square','stack','target',
    'thumbs-up','timer','trash','tree-structure','upload','wallet','wind','x-circle','youtube-logo'
  ],
  hi2: [
    'globe-alt','star','heart','bolt','book-open','briefcase','coffee','code-bracket','cpu-chip','circle-stack',
    'document-text','folder','home','photo','link','map','chat-bubble-left-right','musical-note',
    'paper-clip','play','magnifying-glass','cog','shopping-bag','face-smile','sun','tag',
    'command-line','wrench','arrow-trending-up','truck','tv','umbrella','user','video-camera','clock',
    'wifi','envelope','calendar','credit-card','key','lock-closed','cube','phone','printer','share',
    'shield-check','bell','bookmark','calendar-check','check-circle','clipboard','cloud','pencil','eye',
    'document','flag','number','headphones','inbox','layers','square-3-stack-3d','list-bullet','microphone',
    'computer-desktop','moon','computer-mouse','arrows-right-left','compass','pause','chart-pie','power','arrow-path',
    'backward','floppy-disk','paper-airplane','server','forward','bars-3','device-phone-mobile','speaker-wave',
    'square','stack','cursor-arrow-rays','hand-thumbs-up','timer','trash','chevron-up','wallet',
    'wind','x-circle','youtube','academic-cap','adjustments-horizontal','beaker','bell-alert'
  ]
};

function TagIconLibrarySelector({ prefix, iconSet, onSelect, currentIcon, searchQuery }: { prefix: string; iconSet: string; onSelect: (icon: string) => void; currentIcon: string; searchQuery: string }) {
  const icons = tagIconLibraryIcons[iconSet] || [];
  const filteredIcons = searchQuery.trim()
    ? icons.filter(name => name.toLowerCase().includes(searchQuery.toLowerCase()))
    : icons.slice(0, 60);

  const [brokenIcons, setBrokenIcons] = useState<Set<string>>(new Set());

  const getIconifyPrefix = (p: string) => {
    switch(p) {
      case 'lucide': return 'lucide';
      case 'iconoir': return 'iconoir';
      case 'phosphor': return 'ph';
      case 'heroicons': return 'hi2';
      default: return p;
    }
  };

  const iconifyPrefix = getIconifyPrefix(prefix);

  return (
    <div className="h-36 overflow-y-auto border border-gray-200 rounded p-2">
      <div className="grid grid-cols-8 gap-1">
        {filteredIcons.map((iconName) => {
          const normalizedName = iconName.replace(/ /g, '-');
          return (
            <button
              key={iconName}
              onClick={() => onSelect(`${prefix}:${normalizedName}`)}
              className={`p-1.5 flex items-center justify-center rounded border ${currentIcon === `${prefix}:${normalizedName}` ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}
              title={iconName}
            >
              {brokenIcons.has(iconName) ? (
                <span className="w-4 h-4 text-gray-300 text-xs">?</span>
              ) : (
                <img
                  src={`https://api.iconify.design/${iconifyPrefix}/${normalizedName}.svg?width=16&height=16`}
                  alt={iconName}
                  className="w-4 h-4"
                  onError={() => setBrokenIcons(prev => new Set(prev).add(iconName))}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function renderIconPreview(icon: string, color: string = '#6b7280') {
  if (!icon) return <Globe size={20} color={color} />;
  
  if (icon.startsWith('http') || icon.startsWith('data:image')) {
    return <img src={icon} alt="preview" className="w-5 h-5" />;
  }
  if (icon.startsWith('<svg')) {
    return <div dangerouslySetInnerHTML={{ __html: icon }} className="w-5 h-5" />;
  }
  if (icon.startsWith('dicebear:')) {
    const parts = icon.split(':');
    const style = parts[1] || 'avataaars';
    const seed = parts[2] || 'seed1';
    return <img src={`https://api.dicebear.com/9.x/${style}/svg?seed=${seed}`} alt="preview" className="w-5 h-5" />;
  }
  if (icon.startsWith('avataaars:')) {
    const parts = icon.split(':');
    return <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${parts[1]}`} alt="preview" className="w-5 h-5" />;
  }
  if (icon.includes(':')) {
    const [prefix, name] = icon.split(':');
    return <img src={`https://api.iconify.design/${prefix}/${name}.svg?width=20&height=20&color=${encodeURIComponent(color)}`} alt="preview" className="w-5 h-5" />;
  }
  const IconComp = (Icons as any)[icon];
  return IconComp ? <IconComp size={18} color={color} /> : <Globe size={20} color={color} />;
}

export function TagModal() {
  const { editingTag, setEditingTag, tags, setTags, categories, settings, addingTag, closeAddTag } = useStore();
  const isAdding = !!addingTag;
  
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [urlExternal, setUrlExternal] = useState('');
  const [description, setDescription] = useState('');
  const [iconUrl, setIconUrl] = useState('');
  const [showDescription, setShowDescription] = useState(false);
  const [showUrl, setShowUrl] = useState(false);
  const [showUrlExternal, setShowUrlExternal] = useState(false);
  const [iconTab, setIconTab] = useState('iconify');
  const [iconSearch, setIconSearch] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [iconColor, setIconColor] = useState('#6b7280');
  const [textColor, setTextColor] = useState('#374151');
  const [titleFont, setTitleFont] = useState('Inter');
  const [titleColor, setTitleColor] = useState('#1f2937');
  const [urlFont, setUrlFont] = useState('Inter');
  const [urlColor, setUrlColor] = useState('#6b7280');
  const [urlExternalFont, setUrlExternalFont] = useState('Inter');
  const [urlExternalColor, setUrlExternalColor] = useState('#6b7280');
  const [descriptionFont, setDescriptionFont] = useState('Inter');
  const [descriptionColor, setDescriptionColor] = useState('#6b7280');
  const [openFontPanel, setOpenFontPanel] = useState<string | null>(null);
  const titlePanelRef = useRef<HTMLDivElement>(null);
  const urlPanelRef = useRef<HTMLDivElement>(null);
  const urlExternalPanelRef = useRef<HTMLDivElement>(null);
  const descriptionPanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!openFontPanel) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      let refToCheck = null;
      if (openFontPanel === 'title') refToCheck = titlePanelRef;
      else if (openFontPanel === 'url') refToCheck = urlPanelRef;
      else if (openFontPanel === 'urlExternal') refToCheck = urlExternalPanelRef;
      else if (openFontPanel === 'description') refToCheck = descriptionPanelRef;

      if (refToCheck?.current && !refToCheck.current.contains(target)) {
        setOpenFontPanel(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openFontPanel]);

  const fontOptions = [
    'Inter', 'Arial', 'Helvetica', 'Times New Roman', 'Georgia',
    'Courier New', 'Verdana', 'Tahoma', 'Trebuchet MS', 'Impact', 'Palatino', 'Garamond'
  ];

  useEffect(() => {
    if (editingTag) {
      setTitle(editingTag.title || '');
      setUrl(editingTag.url || '');
      setUrlExternal(editingTag.url_external || '');
      setDescription(editingTag.description || '');
      setIconUrl(editingTag.icon_url || '');
      setShowDescription(editingTag.show_description || false);
      setShowUrl(editingTag.show_url || false);
      setShowUrlExternal(editingTag.show_url_external || false);
      setCategoryId(editingTag.category_id || '');
      setIconColor(editingTag.icon_color || '#6b7280');
      setTextColor(editingTag.text_color || '#374151');
      setTitleFont(editingTag.title_font || 'Inter');
      setTitleColor(editingTag.title_color || '#1f2937');
      setUrlFont(editingTag.url_font || 'Inter');
      setUrlColor(editingTag.url_color || '#6b7280');
      setUrlExternalFont(editingTag.url_external_font || 'Inter');
      setUrlExternalColor(editingTag.url_external_color || '#6b7280');
      setDescriptionFont(editingTag.description_font || 'Inter');
      setDescriptionColor(editingTag.description_color || '#6b7280');
      if (editingTag.icon_url) {
        if (editingTag.icon_url.includes(':')) setIconTab('iconify');
        else if (editingTag.icon_url.startsWith('http') || editingTag.icon_url.startsWith('data:')) setIconTab('url');
        else setIconTab('lucide');
      }
    } else if (addingTag) {
      setTitle('');
      setUrl('');
      setUrlExternal('');
      setDescription('');
      setIconUrl('');
      setShowDescription(false);
      setShowUrl(false);
      setShowUrlExternal(false);
      setIconTab('iconify');
      setCategoryId(addingTag.categoryId);
      setIconColor('#6b7280');
      setTextColor('#374151');
      setTitleFont('Inter');
      setTitleColor('#1f2937');
      setUrlFont('Inter');
      setUrlColor('#6b7280');
      setUrlExternalFont('Inter');
      setUrlExternalColor('#6b7280');
      setDescriptionFont('Inter');
      setDescriptionColor('#6b7280');
    }
  }, [editingTag, addingTag]);

const onSave = async () => {
    if (!title.trim()) return;
    if (!categoryId) return;

    if (isAdding) {
      const id = 'tag_' + Date.now();
      const newTag = {
        id,
        category_id: categoryId,
        title: title.trim(),
        title_font: titleFont,
        title_color: titleColor,
        url: url || '',
        url_font: urlFont,
        url_color: urlColor,
        url_external: urlExternal || '',
        url_external_font: urlExternalFont,
        url_external_color: urlExternalColor,
        description: description || '',
        description_font: descriptionFont,
        description_color: descriptionColor,
        icon_url: iconUrl || '',
        icon_color: iconColor,
        text_color: textColor,
        position_order: 0,
        show_description: showDescription,
        show_url: showUrl,
        show_url_external: showUrlExternal
      };
      setTags([...tags, newTag]);
      closeAddTag();
      try {
        await api.post('/api/tags', newTag);
      } catch(err) {
        console.error("Failed to add tag");
      }
    } else if (editingTag) {
      const updatedTag = {
        ...editingTag,
        category_id: categoryId,
        title,
        title_font: titleFont,
        title_color: titleColor,
        url,
        url_font: urlFont,
        url_color: urlColor,
        url_external: urlExternal,
        url_external_font: urlExternalFont,
        url_external_color: urlExternalColor,
        description,
        description_font: descriptionFont,
        description_color: descriptionColor,
        icon_url: iconUrl,
        icon_color: iconColor,
        text_color: textColor,
        show_description: showDescription,
        show_url: showUrl,
        show_url_external: showUrlExternal
      };
      const newTags = tags.map(t => t.id === editingTag.id ? updatedTag : t);
      setTags(newTags);
      setEditingTag(null);
      try {
        await api.put(`/api/tags/${editingTag.id}`, updatedTag);
      } catch(err) {
        console.error("Failed to save tag");
      }
    }
  };

  const onDelete = async () => {
    if (!editingTag) return;
    if (!confirm('确定要删除这个标签吗？')) return;
    const newTags = tags.filter(t => t.id !== editingTag.id);
    setTags(newTags);
    setEditingTag(null);
    try {
       await api.delete(`/api/tags/${editingTag.id}`);
    } catch(err) {
       console.error("Failed to delete tag");
    }
  };

  const selectedCategory = categories.find(c => c.id === (editingTag?.category_id || addingTag?.categoryId));

  const handleClose = () => {
    if (isAdding) {
      closeAddTag();
    } else {
      setEditingTag(null);
    }
  };

  return (
    <Dialog.Root open={!!editingTag || !!addingTag} onOpenChange={(open) => !open && handleClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50 transition-opacity" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg shadow-xl w-full max-w-lg z-50 overflow-hidden flex flex-col max-h-[85vh]"
          style={{ 
            backgroundColor: settings.theme === 'dark' ? '#1f2937' : '#ffffff',
            border: settings.theme === 'superhuman' ? '1px solid #dcd7d3' : settings.theme === 'dark' ? '1px solid #374151' : 'none'
          }}>
          <div className="p-4 border-b flex items-center justify-between shrink-0" 
            style={{ borderColor: settings.theme === 'dark' ? '#374151' : '#f3f4f6' }}>
            <Dialog.Title className="text-lg font-bold"
              style={{ color: settings.theme === 'dark' ? '#f3f4f6' : '#1f2937' }}>
              {isAdding ? '添加标签' : '编辑标签'} {selectedCategory ? `- ${selectedCategory.name}` : ''}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="text-gray-400 hover:text-gray-600 outline-none"><X size={18} /></button>
            </Dialog.Close>
          </div>
          
          <div className="p-4 space-y-3 flex-1 overflow-y-auto">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700 w-16 shrink-0">名称</label>
              <div className="relative" ref={titlePanelRef}>
                <button
                  type="button"
                  onClick={() => setOpenFontPanel(openFontPanel === 'title' ? null : 'title')}
                  className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50 mr-2"
                  style={{ fontFamily: titleFont, color: titleColor }}
                >
                  Aa
                </button>
                {openFontPanel === 'title' && (
                  <div className="absolute left-0 top-8 z-10 bg-white border border-gray-200 rounded shadow-lg p-3 w-64">
                    <div className="mb-2">
                      <label className="block text-xs text-gray-500 mb-1">字体</label>
                      <select
                        value={titleFont}
                        onChange={(e) => setTitleFont(e.target.value)}
                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                        style={{ fontFamily: titleFont }}
                      >
                        {fontOptions.map(f => (
                          <option key={f} value={f} style={{ fontFamily: f }}>{f}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">颜色</label>
                      <div className="flex items-center gap-2 mb-2">
                        <input type="color" value={titleColor} onChange={(e) => setTitleColor(e.target.value)} className="w-6 h-6 rounded cursor-pointer" />
                        <input type="text" value={titleColor} onChange={(e) => setTitleColor(e.target.value)} className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded" />
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {presetColors.slice(0, 10).map((c) => (
                          <button
                            key={c}
                            onClick={() => setTitleColor(c)}
                            className={`w-4 h-4 rounded border ${titleColor === c ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-200'}`}
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
                style={{ fontFamily: titleFont, color: titleColor }}
              />
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700 w-16 shrink-0">分类</label>
              <select 
                value={categoryId}
                onChange={e => setCategoryId(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none text-sm"
              >
                <option value="">选择分类</option>
                {categories.filter(c => c.id !== 'root').map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700 w-16 shrink-0">内网URL</label>
              <div className="relative" ref={urlPanelRef}>
                <button
                  type="button"
                  onClick={() => setOpenFontPanel(openFontPanel === 'url' ? null : 'url')}
                  className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50 mr-2"
                  style={{ fontFamily: urlFont, color: urlColor }}
                >
                  Aa
                </button>
                {openFontPanel === 'url' && (
                  <div className="absolute left-0 top-8 z-10 bg-white border border-gray-200 rounded shadow-lg p-3 w-64">
                    <div className="mb-2">
                      <label className="block text-xs text-gray-500 mb-1">字体</label>
                      <select
                        value={urlFont}
                        onChange={(e) => setUrlFont(e.target.value)}
                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                        style={{ fontFamily: urlFont }}
                      >
                        {fontOptions.map(f => (
                          <option key={f} value={f} style={{ fontFamily: f }}>{f}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">颜色</label>
                      <div className="flex items-center gap-2 mb-2">
                        <input type="color" value={urlColor} onChange={(e) => setUrlColor(e.target.value)} className="w-6 h-6 rounded cursor-pointer" />
                        <input type="text" value={urlColor} onChange={(e) => setUrlColor(e.target.value)} className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded" />
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {presetColors.slice(0, 10).map((c) => (
                          <button
                            key={c}
                            onClick={() => setUrlColor(c)}
                            className={`w-4 h-4 rounded border ${urlColor === c ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-200'}`}
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <input
                type="text"
                value={url}
                onChange={e => setUrl(e.target.value)}
                placeholder="https://"
                className="flex-1 px-3 py-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
                style={{ fontFamily: urlFont, color: urlColor }}
              />
              <label className="flex items-center gap-1.5 cursor-pointer whitespace-nowrap">
                <input
                  type="checkbox"
                  checked={showUrl}
                  onChange={e => setShowUrl(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-xs text-gray-500">显示</span>
              </label>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700 w-16 shrink-0">外网URL</label>
              <div className="relative" ref={urlExternalPanelRef}>
                <button
                  type="button"
                  onClick={() => setOpenFontPanel(openFontPanel === 'urlExternal' ? null : 'urlExternal')}
                  className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50 mr-2"
                  style={{ fontFamily: urlExternalFont, color: urlExternalColor }}
                >
                  Aa
                </button>
                {openFontPanel === 'urlExternal' && (
                  <div className="absolute left-0 top-8 z-10 bg-white border border-gray-200 rounded shadow-lg p-3 w-64">
                    <div className="mb-2">
                      <label className="block text-xs text-gray-500 mb-1">字体</label>
                      <select
                        value={urlExternalFont}
                        onChange={(e) => setUrlExternalFont(e.target.value)}
                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                        style={{ fontFamily: urlExternalFont }}
                      >
                        {fontOptions.map(f => (
                          <option key={f} value={f} style={{ fontFamily: f }}>{f}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">颜色</label>
                      <div className="flex items-center gap-2 mb-2">
                        <input type="color" value={urlExternalColor} onChange={(e) => setUrlExternalColor(e.target.value)} className="w-6 h-6 rounded cursor-pointer" />
                        <input type="text" value={urlExternalColor} onChange={(e) => setUrlExternalColor(e.target.value)} className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded" />
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {presetColors.slice(0, 10).map((c) => (
                          <button
                            key={c}
                            onClick={() => setUrlExternalColor(c)}
                            className={`w-4 h-4 rounded border ${urlExternalColor === c ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-200'}`}
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <input
                type="text"
                value={urlExternal}
                onChange={e => setUrlExternal(e.target.value)}
                placeholder="https://"
                className="flex-1 px-3 py-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
                style={{ fontFamily: urlExternalFont, color: urlExternalColor }}
              />
              <label className="flex items-center gap-1.5 cursor-pointer whitespace-nowrap">
                <input
                  type="checkbox"
                  checked={showUrlExternal}
                  onChange={e => setShowUrlExternal(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-xs text-gray-500">显示</span>
              </label>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700 w-16 shrink-0">描述</label>
              <div className="relative" ref={descriptionPanelRef}>
                <button
                  type="button"
                  onClick={() => setOpenFontPanel(openFontPanel === 'description' ? null : 'description')}
                  className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50 mr-2"
                  style={{ fontFamily: descriptionFont, color: descriptionColor }}
                >
                  Aa
                </button>
                {openFontPanel === 'description' && (
                  <div className="absolute left-0 top-8 z-10 bg-white border border-gray-200 rounded shadow-lg p-3 w-64">
                    <div className="mb-2">
                      <label className="block text-xs text-gray-500 mb-1">字体</label>
                      <select
                        value={descriptionFont}
                        onChange={(e) => setDescriptionFont(e.target.value)}
                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                        style={{ fontFamily: descriptionFont }}
                      >
                        {fontOptions.map(f => (
                          <option key={f} value={f} style={{ fontFamily: f }}>{f}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">颜色</label>
                      <div className="flex items-center gap-2 mb-2">
                        <input type="color" value={descriptionColor} onChange={(e) => setDescriptionColor(e.target.value)} className="w-6 h-6 rounded cursor-pointer" />
                        <input type="text" value={descriptionColor} onChange={(e) => setDescriptionColor(e.target.value)} className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded" />
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {presetColors.slice(0, 10).map((c) => (
                          <button
                            key={c}
                            onClick={() => setDescriptionColor(c)}
                            className={`w-4 h-4 rounded border ${descriptionColor === c ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-200'}`}
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <input
                type="text"
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
                style={{ fontFamily: descriptionFont, color: descriptionColor }}
              />
              <label className="flex items-center gap-1.5 cursor-pointer whitespace-nowrap">
                <input
                  type="checkbox"
                  checked={showDescription}
                  onChange={e => setShowDescription(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-xs text-gray-500">显示</span>
              </label>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                图标
                {iconUrl && (
                  <span className="ml-2 font-normal text-gray-500">
                    (预览: <span className="inline-flex items-center">{renderIconPreview(iconUrl, iconColor)}</span>)
                  </span>
                )}
              </label>
              <input
                type="text"
                value={iconSearch}
                onChange={(e) => setIconSearch(e.target.value)}
                placeholder="搜索图标..."
                className="w-full px-3 py-1.5 mb-2 border border-gray-300 rounded text-sm focus:outline-none"
              />
              <Tabs.Root value={iconTab} onValueChange={setIconTab} className="border border-gray-200 rounded text-xs">
                <Tabs.List className="flex border-b border-gray-200 bg-gray-50 overflow-x-auto">
                  <Tabs.Trigger value="iconify" className="px-2 py-1.5 font-medium text-gray-600 hover:text-gray-900 data-[state=active]:bg-white data-[state=active]:text-blue-600 whitespace-nowrap">
                    Iconify
                  </Tabs.Trigger>
                  <Tabs.Trigger value="lucide" className="px-2 py-1.5 font-medium text-gray-600 hover:text-gray-900 data-[state=active]:bg-white data-[state=active]:text-blue-600 whitespace-nowrap">
                    Lucide
                  </Tabs.Trigger>
                  <Tabs.Trigger value="iconoir" className="px-2 py-1.5 font-medium text-gray-600 hover:text-gray-900 data-[state=active]:bg-white data-[state=active]:text-blue-600 whitespace-nowrap">
                    Iconoir
                  </Tabs.Trigger>
                  <Tabs.Trigger value="phosphor" className="px-2 py-1.5 font-medium text-gray-600 hover:text-gray-900 data-[state=active]:bg-white data-[state=active]:text-blue-600 whitespace-nowrap">
                    Phosphor
                  </Tabs.Trigger>
                  <Tabs.Trigger value="heroicons" className="px-2 py-1.5 font-medium text-gray-600 hover:text-gray-900 data-[state=active]:bg-white data-[state=active]:text-blue-600 whitespace-nowrap">
                    Heroicons
                  </Tabs.Trigger>
                  <Tabs.Trigger value="url" className="px-2 py-1.5 font-medium text-gray-600 hover:text-gray-900 data-[state=active]:bg-white data-[state=active]:text-blue-600 whitespace-nowrap">
                    图片
                  </Tabs.Trigger>
                </Tabs.List>
                
                <div className="p-2">
                  <Tabs.Content value="iconify">
                    <IconifySearch onSelect={setIconUrl} searchQuery={iconSearch} />
                  </Tabs.Content>
                  
                  <Tabs.Content value="lucide">
                    <TagIconLibrarySelector prefix="lucide" iconSet="lucide" onSelect={setIconUrl} currentIcon={iconUrl} searchQuery={iconSearch} />
                  </Tabs.Content>

                  <Tabs.Content value="iconoir">
                    <TagIconLibrarySelector prefix="iconoir" iconSet="iconoir" onSelect={setIconUrl} currentIcon={iconUrl} searchQuery={iconSearch} />
                  </Tabs.Content>

                  <Tabs.Content value="phosphor">
                    <TagIconLibrarySelector prefix="phosphor" iconSet="phosphor" onSelect={setIconUrl} currentIcon={iconUrl} searchQuery={iconSearch} />
                  </Tabs.Content>

                  <Tabs.Content value="heroicons">
                    <TagIconLibrarySelector prefix="heroicons" iconSet="heroicons" onSelect={setIconUrl} currentIcon={iconUrl} searchQuery={iconSearch} />
                  </Tabs.Content>

                  <Tabs.Content value="url">
                    <input 
                      type="text" 
                      value={iconUrl} 
                      onChange={e => setIconUrl(e.target.value)} 
                      placeholder="https://example.com/icon.png"
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none" 
                    />
                    {iconUrl && (
                      <div className="mt-2 flex items-center justify-center p-2 border border-gray-200 rounded bg-gray-50">
                        <img src={iconUrl} alt="preview" className="w-8 h-8 object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                      </div>
                    )}
                  </Tabs.Content>
                </div>
              </Tabs.Root>
              <div className="mt-3 grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">图标颜色</label>
                  <div className="flex items-center gap-2 mb-2">
                    <input type="color" value={iconColor} onChange={e => setIconColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer" />
                    <input type="text" value={iconColor} onChange={e => setIconColor(e.target.value)} className="flex-1 w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none" />
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {presetColors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setIconColor(color)}
                        className={`w-4 h-4 rounded border ${iconColor === color ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-200'}`}
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">文字颜色</label>
                  <div className="flex items-center gap-2 mb-2">
                    <input type="color" value={textColor} onChange={e => setTextColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer" />
                    <input type="text" value={textColor} onChange={e => setTextColor(e.target.value)} className="flex-1 w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none" />
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {presetColors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setTextColor(color)}
                        className={`w-4 h-4 rounded border ${textColor === color ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-200'}`}
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-4 border-t border-gray-100 flex justify-between bg-gray-50 shrink-0">
            {!isAdding && (
              <button onClick={onDelete} className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded flex items-center gap-1">
                <Trash2 size={14} />删除
              </button>
            )}
            <div className="flex gap-2 ml-auto">
              <Dialog.Close asChild>
                <button className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-200 rounded">取消</button>
              </Dialog.Close>
              <button onClick={onSave} className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded shadow-sm">{isAdding ? '添加' : '保存'}</button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}