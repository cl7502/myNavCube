import * as Dialog from '@radix-ui/react-dialog';
import { useStore, Category } from '../store';
import { useState, useEffect, useCallback } from 'react';
import * as Icons from 'lucide-react';
import { api } from '../lib/api';
import * as Tabs from '@radix-ui/react-tabs';

const commonIcons = [
  'Globe', 'Star', 'Heart', 'Zap', 'Book', 'Briefcase', 'Coffee', 'Code', 'Cpu', 'Database', 'FileText', 'Folder', 'Home', 'Image', 'Link', 'Map', 'MessageSquare', 'Music', 'Paperclip', 'Play', 'Search', 'Settings', 'ShoppingBag', 'Smile', 'Sun', 'Tag', 'Terminal', 'Tool', 'TrendingUp', 'Truck', 'Tv', 'Umbrella', 'User', 'Video', 'Watch', 'Wifi'
];

const presetColors = [
  '#374151', '#6b7280', '#9ca3af', '#1f2937', '#111827',
  '#dc2626', '#ea580c', '#f59e0b', '#84cc16', '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e',
  '#000000', '#ffffff', '#fef2f2', '#fef3c7', '#ecfccb', '#ccfbf1', '#cffafe', '#e0f2fe', '#dbeafe', '#e0e7ff', '#eef2ff', '#fae8ff', '#ffe4e6'
];

const diceBearStyles = ['adventurer', 'adventurer-neutral', 'avataaars', 'big-ears', 'big-smile', 'bottts', 'bottts-neutral', 'croodles', 'croodles-neutral', 'fun-emoji', 'icons', 'identicon', 'initials', 'lorelei', 'lorelei-neutral', 'micah', 'miniavs', 'notionists', 'notionists-neutral', 'open-peeps', 'personas', 'pixel-art', 'pixel-art-neutral', 'shapes', 'thumbs'];



const avataaarsOptions = [
  { name: 'Default Male', seed: 'Felix' },
  { name: 'Default Female', seed: 'Lucy' },
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
      const res = await fetch(`https://api.iconify.design/search?query=${encodeURIComponent(searchQuery)}&limit=50`);
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
    <div className="h-48 overflow-y-auto border border-gray-200 rounded p-2">
      {loading ? (
        <div className="flex items-center justify-center h-full text-gray-400 text-sm">搜索中...</div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-8 gap-1">
          {results.map((iconName) => (
            <button
              key={iconName}
              onClick={() => onSelect(iconName)}
              className="p-2 flex items-center justify-center rounded border border-gray-200 hover:bg-blue-50 hover:border-blue-400"
              title={iconName}
            >
              <img
                src={`https://api.iconify.design/${iconName.split(':')[0]}/${iconName.split(':')[1]}.svg?width=20&height=20`}
                alt={iconName}
                className="w-5 h-5"
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
  const [style, setStyle] = useState('adventurer');
  const seeds = searchQuery.trim() 
    ? [searchQuery.trim(), ...Array.from({ length: 29 }, (_, i) => `seed${i + 1}`)]
    : Array.from({ length: 30 }, (_, i) => `seed${i + 1}`);

  return (
    <div className="space-y-2">
      <select
        value={style}
        onChange={(e) => setStyle(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none text-sm"
      >
        {diceBearStyles.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
      <div className="h-48 overflow-y-auto border border-gray-200 rounded p-2">
        <div className="grid grid-cols-6 gap-2">
          {seeds.map((seed, idx) => (
            <button
              key={`${seed}-${idx}`}
              onClick={() => onSelect(`dicebear:${style}:${seed}`)}
              className="p-2 flex items-center justify-center rounded border border-gray-200 hover:bg-blue-50 hover:border-blue-400"
            >
              <img
                src={`https://api.dicebear.com/9.x/${style}/svg?seed=${seed}`}
                alt={seed}
                className="w-8 h-8"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function OpenPeepsSelector({ onSelect, searchQuery }: { onSelect: (icon: string) => void; searchQuery: string }) {
  const seeds = searchQuery.trim()
    ? [searchQuery.trim(), ...Array.from({ length: 29 }, (_, i) => `seed${i + 1}`)]
    : Array.from({ length: 30 }, (_, i) => `seed${i + 1}`);

  return (
    <div className="h-48 overflow-y-auto border border-gray-200 rounded p-2">
      <div className="grid grid-cols-5 gap-2">
        {seeds.map((seed, idx) => (
          <button
            key={`${seed}-${idx}`}
            onClick={() => onSelect(`openpeeps:${seed}`)}
            className="p-2 flex items-center justify-center rounded border border-gray-200 hover:bg-blue-50 hover:border-blue-400"
          >
            <img
              src={`https://api.dicebear.com/9.x/open-peeps/svg?seed=${seed}`}
              alt={seed}
              className="w-10 h-10"
            />
          </button>
        ))}
      </div>
    </div>
  );
}

function AvataaarsSelector({ onSelect, searchQuery }: { onSelect: (icon: string) => void; searchQuery: string }) {
  const filteredOptions = searchQuery.trim()
    ? [...avataaarsOptions, { name: searchQuery.trim(), seed: searchQuery.trim() }]
    : avataaarsOptions;

  return (
    <div className="space-y-2">
      <div className="h-48 overflow-y-auto border border-gray-200 rounded p-2">
        <div className="grid grid-cols-4 gap-2">
          {filteredOptions.map((opt) => (
            <button
              key={opt.seed}
              onClick={() => onSelect(`avataaars:${opt.seed}`)}
              className="p-2 flex flex-col items-center justify-center rounded border border-gray-200 hover:bg-blue-50 hover:border-blue-400"
            >
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${opt.seed}`}
                alt={opt.name}
                className="w-12 h-12"
              />
              <span className="text-[10px] text-gray-500 mt-1">{opt.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function CategoryModal() {
  const { editingCategory, setEditingCategory, addingCategory, closeAddCategory, categories, setCategories } = useStore();
   
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('');
  const [iconColor, setIconColor] = useState('#3b82f6');
  const [textColor, setTextColor] = useState('#374151');
  const [activeTab, setActiveTab] = useState('lucide');
  const [searchQuery, setSearchQuery] = useState('');

  const isAdding = !!addingCategory;
  const isOpen = !!editingCategory || !!addingCategory;

  useEffect(() => {
    if (editingCategory) {
      setName(editingCategory.name || '');
      setIcon(editingCategory.icon || '');
      setIconColor(editingCategory.icon_color || '#3b82f6');
      setTextColor(editingCategory.text_color || '#374151');
      if (editingCategory.icon) {
        if (editingCategory.icon.startsWith('dicebear:')) setActiveTab('dicebear');
        else if (editingCategory.icon.startsWith('openpeeps:')) setActiveTab('openpeeps');
        else if (editingCategory.icon.startsWith('avataaars:')) setActiveTab('avataaars');
        else if (editingCategory.icon.includes(':')) setActiveTab('iconify');
        else setActiveTab('lucide');
      }
    } else if (addingCategory) {
      setName(addingCategory.name || '');
      setIcon('');
      setIconColor('#3b82f6');
      setTextColor('#374151');
      setActiveTab('lucide');
    }
  }, [editingCategory, addingCategory]);

  const onSave = async () => {
    if (isAdding) {
      if (!name.trim()) return;
      const id = 'cat_' + Date.now();
      const newCat: Category = {
        id,
        name: name.trim(),
        parent_id: addingCategory!.parentId,
        icon,
        icon_color: iconColor,
        text_color: textColor,
        position_order: 0,
        is_expanded: true
      };
      setCategories([...categories, newCat]);
      closeAddCategory();
      try {
        await api.post('/api/categories', newCat);
      } catch(err) {
        console.error("Failed to add category");
      }
    } else if (editingCategory) {
      const newCats = categories.map(c => 
        c.id === editingCategory.id ? { ...c, name, icon, icon_color: iconColor, text_color: textColor } : c
      );
      setCategories(newCats);
      setEditingCategory(null);
      try {
         await api.put(`/api/categories/${editingCategory.id}`, newCats.find(c => c.id === editingCategory.id));
      } catch(err) {
         console.error("Failed to save category");
      }
    }
  };

  const handleClose = () => {
    if (isAdding) {
      closeAddCategory();
    } else {
      setEditingCategory(null);
    }
  };

  const renderIconPreview = () => {
    if (!icon) return null;
    
    if (icon.startsWith('http') || icon.startsWith('data:image')) {
      return <img src={icon} alt="preview" className="w-8 h-8" />;
    }
    if (icon.startsWith('<svg')) {
      return <div dangerouslySetInnerHTML={{ __html: icon }} className="w-8 h-8" />;
    }
    if (icon.startsWith('dicebear:')) {
      const parts = icon.split(':');
      return <img src={`https://api.dicebear.com/9.x/${parts[1]}/svg?seed=${parts[2]}`} alt="preview" className="w-8 h-8" />;
    }
    if (icon.startsWith('openpeeps:')) {
      const parts = icon.split(':');
      return <img src={`https://api.dicebear.com/9.x/open-peeps/svg?seed=${parts[1]}`} alt="preview" className="w-8 h-8" />;
    }
    if (icon.startsWith('avataaars:')) {
      const parts = icon.split(':');
      return <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${parts[1]}`} alt="preview" className="w-8 h-8" />;
    }
    if (icon.includes(':')) {
      const [prefix, name] = icon.split(':');
      return <img src={`https://api.iconify.design/${prefix}/${name}.svg?width=24&height=24&color=${encodeURIComponent(iconColor)}`} alt="preview" className="w-8 h-8" />;
    }
    const IconComp = (Icons as any)[icon];
    return IconComp ? <IconComp size={24} style={{ color: iconColor }} /> : null;
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50 transition-opacity" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl w-full max-w-md z-50 overflow-hidden flex flex-col max-h-[90vh]">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between shrink-0">
            <Dialog.Title className="text-lg font-bold text-gray-800">{isAdding ? '新增分类' : '编辑分类'}</Dialog.Title>
            <Dialog.Close asChild>
              <button className="text-gray-400 hover:text-gray-600 outline-none"><Icons.X size={18} /></button>
            </Dialog.Close>
          </div>
          
          <div className="p-4 space-y-4 flex-1 overflow-y-auto">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">分类名称</label>
              <input 
                type="text" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                className="w-full px-3 py-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none" 
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">文本颜色</label>
                <div className="flex items-center gap-2 mb-2">
                  <input type="color" value={textColor} onChange={e => setTextColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer" />
                  <input type="text" value={textColor} onChange={e => setTextColor(e.target.value)} className="flex-1 w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none" />
                </div>
                <div className="flex flex-wrap gap-1">
                  {presetColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setTextColor(color)}
                      className={`w-5 h-5 rounded border ${textColor === color ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-200'}`}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">图标颜色</label>
                <div className="flex items-center gap-2 mb-2">
                   <input type="color" value={iconColor} onChange={e => setIconColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer" />
                   <input type="text" value={iconColor} onChange={e => setIconColor(e.target.value)} className="flex-1 w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none" />
                </div>
                <div className="flex flex-wrap gap-1">
                  {presetColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setIconColor(color)}
                      className={`w-5 h-5 rounded border ${iconColor === color ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-200'}`}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                图标选择
                {icon && (
                  <span className="ml-2 text-xs font-normal text-gray-500">
                    (预览: <span className="inline-flex items-center">{renderIconPreview()}</span>)
                  </span>
                )}
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索图标..."
                className="w-full px-3 py-2 mb-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none text-sm"
              />
              <Tabs.Root value={activeTab} onValueChange={setActiveTab} className="border border-gray-200 rounded">
                <Tabs.List className="flex border-b border-gray-200 bg-gray-50">
                  <Tabs.Trigger value="lucide" className="px-3 py-2 text-xs font-medium text-gray-600 hover:text-gray-900 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 flex-1 text-center">
                    Lucide
                  </Tabs.Trigger>
                  <Tabs.Trigger value="iconify" className="px-3 py-2 text-xs font-medium text-gray-600 hover:text-gray-900 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 flex-1 text-center">
                    Iconify
                  </Tabs.Trigger>
                  <Tabs.Trigger value="dicebear" className="px-3 py-2 text-xs font-medium text-gray-600 hover:text-gray-900 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 flex-1 text-center">
                    DiceBear
                  </Tabs.Trigger>
                  <Tabs.Trigger value="openpeeps" className="px-3 py-2 text-xs font-medium text-gray-600 hover:text-gray-900 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 flex-1 text-center">
                    Open Peeps
                  </Tabs.Trigger>
                  <Tabs.Trigger value="avataaars" className="px-3 py-2 text-xs font-medium text-gray-600 hover:text-gray-900 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 flex-1 text-center">
                    Avataaars
                  </Tabs.Trigger>
                </Tabs.List>
                
                <div className="p-3">
                  <Tabs.Content value="lucide">
                    <div className="grid grid-cols-6 gap-2">
                      <button 
                        onClick={() => setIcon('')} 
                        className={`p-2 flex items-center justify-center rounded border ${icon === '' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}
                        title="No Icon"
                      >
                        <Icons.Ban size={16} className="text-gray-400" />
                      </button>
                      {commonIcons.filter(iconName => 
                        !searchQuery || iconName.toLowerCase().includes(searchQuery.toLowerCase())
                      ).map(iconName => {
                         const IconComp = (Icons as any)[iconName];
                         return (
                            <button 
                              key={iconName}
                              onClick={() => setIcon(iconName)}
                              className={`p-2 flex items-center justify-center rounded border ${icon === iconName ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}
                              title={iconName}
                            >
                              {IconComp && <IconComp size={16} />}
                            </button>
                         )
                      })}
                    </div>
                  </Tabs.Content>
                  
                  <Tabs.Content value="iconify">
                    <IconifySearch onSelect={setIcon} searchQuery={searchQuery} />
                  </Tabs.Content>
                  
                  <Tabs.Content value="dicebear">
                    <DiceBearSelector onSelect={setIcon} searchQuery={searchQuery} />
                  </Tabs.Content>
                  
                  <Tabs.Content value="openpeeps">
                    <OpenPeepsSelector onSelect={setIcon} searchQuery={searchQuery} />
                  </Tabs.Content>
                  
                  <Tabs.Content value="avataaars">
                    <AvataaarsSelector onSelect={setIcon} searchQuery={searchQuery} />
                  </Tabs.Content>
                </div>
              </Tabs.Root>
              <div className="mt-2 text-xs text-gray-500">
                自定义 SVG / 图片 URL：
                <input 
                  type="text" 
                  value={icon} 
                  onChange={e => setIcon(e.target.value)}
                  placeholder="<svg>... 或者 https://..."
                  className="w-full px-2 py-1 mt-1 border border-gray-300 rounded focus:outline-none" 
                />
              </div>
            </div>

          </div>
          
          <div className="p-4 border-t border-gray-100 flex justify-end gap-2 bg-gray-50 shrink-0">
             <Dialog.Close asChild>
                <button className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-200 rounded">取消</button>
             </Dialog.Close>
             <button onClick={onSave} className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded shadow-sm">保存</button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}