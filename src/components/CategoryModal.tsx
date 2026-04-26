import * as Dialog from '@radix-ui/react-dialog';
import { useStore, Category } from '../store';
import { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import { api } from '../lib/api';

const commonIcons = [
  'Globe', 'Star', 'Heart', 'Zap', 'Book', 'Briefcase', 'Coffee', 'Code', 'Cpu', 'Database', 'FileText', 'Folder', 'Home', 'Image', 'Link', 'Map', 'MessageSquare', 'Music', 'Paperclip', 'Play', 'Search', 'Settings', 'ShoppingBag', 'Smile', 'Sun', 'Tag', 'Terminal', 'Tool', 'TrendingUp', 'Truck', 'Tv', 'Umbrella', 'User', 'Video', 'Watch', 'Wifi'
];

export function CategoryModal() {
  const { editingCategory, setEditingCategory, categories, setCategories } = useStore();
  
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('');
  const [iconColor, setIconColor] = useState('');
  const [textColor, setTextColor] = useState('');

  useEffect(() => {
    if (editingCategory) {
      setName(editingCategory.name || '');
      setIcon(editingCategory.icon || '');
      setIconColor(editingCategory.icon_color || '#3b82f6');
      setTextColor(editingCategory.text_color || '#374151');
    }
  }, [editingCategory]);

  const onSave = async () => {
    if (!editingCategory) return;
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
  };

  return (
    <Dialog.Root open={!!editingCategory} onOpenChange={(open) => !open && setEditingCategory(null)}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50 transition-opacity" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl w-full max-w-md z-50 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <Dialog.Title className="text-lg font-bold text-gray-800">编辑分类</Dialog.Title>
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
                <div className="flex items-center gap-2">
                  <input type="color" value={textColor} onChange={e => setTextColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer" />
                  <input type="text" value={textColor} onChange={e => setTextColor(e.target.value)} className="flex-1 w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">图标颜色</label>
                <div className="flex items-center gap-2">
                   <input type="color" value={iconColor} onChange={e => setIconColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer" />
                   <input type="text" value={iconColor} onChange={e => setIconColor(e.target.value)} className="flex-1 w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">图标选择</label>
              <div className="grid grid-cols-6 gap-2">
                 <button 
                   onClick={() => setIcon('')} 
                   className={`p-2 flex items-center justify-center rounded border ${icon === '' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}
                   title="No Icon"
                 >
                   <Icons.Ban size={16} className="text-gray-400" />
                 </button>
                 {commonIcons.map(iconName => {
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
              <div className="mt-2 text-xs text-gray-500">
                或直接输入SVG路径 / Image URL（如果图标不是系统内置的）：
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
          
          <div className="p-4 border-t border-gray-100 flex justify-end gap-2 bg-gray-50">
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
