import * as Dialog from '@radix-ui/react-dialog';
import { useStore, Tag } from '../store';
import { useState, useEffect } from 'react';
import { X, Trash2, Globe } from 'lucide-react';
import { api } from '../lib/api';

export function TagModal() {
  const { editingTag, setEditingTag, tags, setTags, categories, settings } = useStore();
  
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [iconUrl, setIconUrl] = useState('');

  useEffect(() => {
    if (editingTag) {
      setTitle(editingTag.title || '');
      setUrl(editingTag.url || '');
      setDescription(editingTag.description || '');
      setIconUrl(editingTag.icon_url || '');
    }
  }, [editingTag]);

  const onSave = async () => {
    if (!editingTag) return;
    const updatedTag = { ...editingTag, title, url, description, icon_url: iconUrl };
    const newTags = tags.map(t => t.id === editingTag.id ? updatedTag : t);
    setTags(newTags);
    setEditingTag(null);
    try {
       await api.put(`/api/tags/${editingTag.id}`, updatedTag);
    } catch(err) {
       console.error("Failed to save tag");
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

  const selectedCategory = categories.find(c => c.id === editingTag?.category_id);

  return (
    <Dialog.Root open={!!editingTag} onOpenChange={(open) => !open && setEditingTag(null)}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50 transition-opacity" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl w-full max-w-md z-50 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <Dialog.Title className="text-lg font-bold text-gray-800">
              编辑标签 {selectedCategory ? `- ${selectedCategory.name}` : ''}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="text-gray-400 hover:text-gray-600 outline-none"><X size={18} /></button>
            </Dialog.Close>
          </div>
          
          <div className="p-4 space-y-4 flex-1 overflow-y-auto">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">标签名称</label>
              <input 
                type="text" 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
                className="w-full px-3 py-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none" 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">标签URL</label>
              <input 
                type="text" 
                value={url} 
                onChange={e => setUrl(e.target.value)} 
                placeholder="https://"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none" 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">描述（可选）</label>
              <input 
                type="text" 
                value={description} 
                onChange={e => setDescription(e.target.value)} 
                className="w-full px-3 py-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none" 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">图标URL（可选）</label>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded bg-gray-50">
                  {iconUrl ? <img src={iconUrl} className="w-5 h-5 object-contain" /> : <Globe size={16} className="text-gray-400" />}
                </div>
                <input 
                  type="text" 
                  value={iconUrl} 
                  onChange={e => setIconUrl(e.target.value)} 
                  placeholder="https://example.com/icon.png"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none" 
                />
              </div>
            </div>
          </div>
          
          <div className="p-4 border-t border-gray-100 flex justify-between bg-gray-50">
            <button onClick={onDelete} className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded flex items-center gap-1">
              <Trash2 size={14} />删除
            </button>
            <div className="flex gap-2">
              <Dialog.Close asChild>
                <button className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-200 rounded">取消</button>
              </Dialog.Close>
              <button onClick={onSave} className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded shadow-sm">保存</button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}