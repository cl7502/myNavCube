import { useState, useRef, useEffect } from 'react';
import { useStore, UserSettings, Tag } from '../store';
import { Rows3, Globe, Plus, Settings, X, ExternalLink } from 'lucide-react';
import * as Icons from 'lucide-react';
import * as Slider from '@radix-ui/react-slider';
import clsx from 'clsx';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import { useTranslation } from '../i18n';
import { motion, AnimatePresence } from 'motion/react';

function renderTagIcon(tag: Tag, size: number) {
  const icon = tag.icon_url;
  const iconColor = tag.icon_color || '#6b7280';
  
  if (!icon) return <Globe size={size} color={iconColor} />;
  
  if (icon.startsWith('http') || icon.startsWith('data:image')) {
    return <img src={icon} alt="" className="w-full h-full object-contain" />;
  }
  if (icon.startsWith('<svg')) {
    return <div dangerouslySetInnerHTML={{ __html: icon }} className="w-full h-full" />;
  }
  if (icon.startsWith('dicebear:')) {
    const parts = icon.split(':');
    const style = parts[1] || 'avataaars';
    const seed = parts[2] || 'seed1';
    return <img src={`https://api.dicebear.com/9.x/${style}/svg?seed=${seed}`} alt="" className="w-full h-full" />;
  }
  if (icon.startsWith('avataaars:')) {
    const parts = icon.split(':');
    return <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${parts[1]}`} alt="" className="w-full h-full" />;
  }
  if (icon.includes(':')) {
    const [prefix, name] = icon.split(':');
    return <img src={`https://api.iconify.design/${prefix}/${name}.svg?width=${size * 4}&height=${size * 4}&color=${encodeURIComponent(iconColor)}`} alt="" className="w-full h-full" />;
  }
  const IconComp = (Icons as any)[icon];
  return IconComp ? <IconComp size={size} color={iconColor} /> : <Globe size={size} color={iconColor} />;
}

export function MainContent() {
  const { isEditMode, setEditMode, settings, setSettings, categories, tags, selectedCategoryId, setEditingTag } = useStore();
  const [layoutPanelOpen, setLayoutPanelOpen] = useState(false);
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const layoutRef = useRef<HTMLDivElement>(null);
     
  const t = useTranslation(settings.language);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (layoutRef.current && !layoutRef.current.contains(e.target as Node)) {
        setLayoutPanelOpen(false);
        setActivePanel(null);
      }
    };
    if (layoutPanelOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [layoutPanelOpen]);

  const handleStyleChange = (key: keyof UserSettings['tagLayout'], val: any) => {
    const newConfig = { ...settings.tagLayout, [key]: val };
    const newSettings = { ...settings, tagLayout: newConfig };
    setSettings({ tagLayout: newConfig });
    import('../lib/api').then(({api}) => api.put('/api/user/settings', { 
      language: settings.language,
      data: newSettings
    }).catch(()=>null));
  };

  const renderPanel = () => {
    switch (activePanel) {
      case 'tag':
        return (
          <div className="space-y-2 text-xs p-2">
            <label className="flex flex-col"><span className="mb-1">宽度 ({settings.tagLayout.width}px)</span>
              <Slider.Root className="relative flex items-center select-none touch-none w-full h-4" value={[settings.tagLayout.width]} max={400} min={80} step={1} onValueChange={(v) => handleStyleChange('width', v[0])}>
                <Slider.Track className="bg-gray-200 relative grow rounded-full h-[2px]"><Slider.Range className="absolute bg-blue-500 rounded-full h-full" /></Slider.Track>
                <Slider.Thumb className="block w-3 h-3 bg-white shadow border border-gray-300 rounded-full outline-none focus:ring-2" />
              </Slider.Root>
            </label>
            <label className="flex flex-col"><span className="mb-1">高度 ({settings.tagLayout.height}px)</span>
              <Slider.Root className="relative flex items-center select-none touch-none w-full h-4" value={[settings.tagLayout.height]} max={200} min={30} step={1} onValueChange={(v) => handleStyleChange('height', v[0])}>
                <Slider.Track className="bg-gray-200 relative grow rounded-full h-[2px]"><Slider.Range className="absolute bg-blue-500 rounded-full h-full" /></Slider.Track>
                <Slider.Thumb className="block w-3 h-3 bg-white shadow border border-gray-300 rounded-full outline-none" />
              </Slider.Root>
            </label>
            <label className="flex flex-col"><span className="mb-1">边框粗细 ({settings.tagLayout.borderThickness}px)</span>
              <input type="number" value={settings.tagLayout.borderThickness} onChange={(e) => handleStyleChange('borderThickness', Number(e.target.value))} className="border rounded px-2 py-1 text-xs" />
            </label>
            <label className="flex flex-col"><span className="mb-1">边框颜色</span>
              <div className="flex gap-1"><input type="color" value={settings.tagLayout.borderColor} onChange={(e) => handleStyleChange('borderColor', e.target.value)} className="w-6 h-6 rounded cursor-pointer" /><span className="text-xs text-gray-500">{settings.tagLayout.borderColor}</span></div>
            </label>
          </div>
        );
      case 'spacing':
        return (
          <div className="space-y-2 text-xs p-2">
            <label className="flex flex-col"><span className="mb-1">横向间距 ({settings.tagLayout.spacingX}px)</span>
              <input type="number" value={settings.tagLayout.spacingX} onChange={(e) => handleStyleChange('spacingX', Number(e.target.value))} className="border rounded px-2 py-1 text-xs" />
            </label>
            <label className="flex flex-col"><span className="mb-1">纵向间距 ({settings.tagLayout.spacingY}px)</span>
              <input type="number" value={settings.tagLayout.spacingY} onChange={(e) => handleStyleChange('spacingY', Number(e.target.value))} className="border rounded px-2 py-1 text-xs" />
            </label>
          </div>
        );
      case 'icon':
        return (
          <div className="space-y-2 text-xs p-2">
            <label className="flex flex-col"><span className="mb-1">图标大小 ({settings.tagLayout.iconSize}px)</span>
              <Slider.Root className="relative flex items-center select-none touch-none w-full h-4" value={[settings.tagLayout.iconSize]} max={48} min={8} step={1} onValueChange={(v) => handleStyleChange('iconSize', v[0])}>
                <Slider.Track className="bg-gray-200 relative grow rounded-full h-[2px]"><Slider.Range className="absolute bg-blue-500 rounded-full h-full" /></Slider.Track>
                <Slider.Thumb className="block w-3 h-3 bg-white shadow border border-gray-300 rounded-full outline-none" />
              </Slider.Root>
            </label>
          </div>
        );
      case 'text':
        return (
          <div className="space-y-2 text-xs p-2">
            <label className="flex flex-col"><span className="mb-1">标签名称 ({settings.tagLayout.textSize}px)</span>
              <input type="number" value={settings.tagLayout.textSize} onChange={(e) => handleStyleChange('textSize', Number(e.target.value))} className="border rounded px-2 py-1 text-xs" />
            </label>
            <label className="flex flex-col"><span className="mb-1">标签描述 ({settings.tagLayout.descSize}px)</span>
              <input type="number" value={settings.tagLayout.descSize} onChange={(e) => handleStyleChange('descSize', Number(e.target.value))} className="border rounded px-2 py-1 text-xs" />
            </label>
            <label className="flex flex-col"><span className="mb-1">标签URL ({settings.tagLayout.urlSize}px)</span>
              <input type="number" value={settings.tagLayout.urlSize} onChange={(e) => handleStyleChange('urlSize', Number(e.target.value))} className="border rounded px-2 py-1 text-xs" />
            </label>
          </div>
        );
      case 'count':
        return (
          <div className="space-y-2 text-xs p-2">
            <label className="flex flex-col"><span className="mb-1">每行最多 ({settings.tagLayout.tagsPerRow}个)</span>
              <Slider.Root className="relative flex items-center select-none touch-none w-full h-4" value={[settings.tagLayout.tagsPerRow || 0]} max={20} min={0} step={1} onValueChange={(v) => handleStyleChange('tagsPerRow', v[0])}>
                <Slider.Track className="bg-gray-200 relative grow rounded-full h-[2px]"><Slider.Range className="absolute bg-blue-500 rounded-full h-full" /></Slider.Track>
                <Slider.Thumb className="block w-3 h-3 bg-white shadow border border-gray-300 rounded-full outline-none" />
              </Slider.Root>
            </label>
            <label className="flex flex-col"><span className="mb-1">每列最多 ({settings.tagLayout.tagsPerColumn}个)</span>
              <Slider.Root className="relative flex items-center select-none touch-none w-full h-4" value={[settings.tagLayout.tagsPerColumn || 0]} max={20} min={0} step={1} onValueChange={(v) => handleStyleChange('tagsPerColumn', v[0])}>
                <Slider.Track className="bg-gray-200 relative grow rounded-full h-[2px]"><Slider.Range className="absolute bg-blue-500 rounded-full h-full" /></Slider.Track>
                <Slider.Thumb className="block w-3 h-3 bg-white shadow border border-gray-300 rounded-full outline-none" />
              </Slider.Root>
            </label>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <section className={clsx("flex-1 flex flex-col overflow-hidden", settings.theme === 'dark' ? 'bg-gray-900' : 'bg-[#F9FAFB]')}>
      <div className={clsx("h-10 border-b flex items-center px-4 justify-between shrink-0", settings.theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300')}>
        <div className="flex items-center gap-2">
          {isEditMode && (
            <div className="flex items-center gap-1 text-xs relative" ref={layoutRef}>
<button 
                    className={clsx("px-2 py-1 border rounded flex items-center gap-1", settings.theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50')}
                    onClick={() => {
                       useStore.getState().openAddTag(selectedCategoryId || 'root');
                    }}
                >
                    <Plus size={12}/><span>{t('addTag')}</span>
                 </button>
                 <div className="h-4 w-px bg-gray-200 mx-0.5"></div>
                 
<button 
                    className={clsx("px-2 py-1 border rounded flex items-center gap-1", settings.theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50')}
                    onClick={() => { setLayoutPanelOpen(!layoutPanelOpen); setActivePanel(null); }}
                  >
                    <Settings size={12}/> 排版
                  </button>
                  <AnimatePresence>
                    {layoutPanelOpen && (
                      <div className="flex items-center gap-0.5 border border-gray-200 rounded px-1 bg-white">
                        {['tag', 'spacing', 'icon', 'text', 'count'].map((panel) => (
                          <div key={panel} className="relative">
                            <button 
                              className={clsx("px-2 py-1 text-xs rounded hover:bg-blue-50 whitespace-nowrap", activePanel === panel ? 'bg-blue-50 text-blue-600' : 'text-gray-600')} 
                              onClick={() => setActivePanel(activePanel === panel ? null : panel)}
                            >
                              {panel === 'tag' && '标签'}
                              {panel === 'spacing' && '标签间距'}
                              {panel === 'icon' && '图标'}
                              {panel === 'text' && '文字'}
                              {panel === 'count' && '标签数量'}
                            </button>
                            <AnimatePresence>
                              {activePanel === panel && (
                                <motion.div
                                  initial={{ opacity: 0, y: -5 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -5 }}
                                  transition={{ duration: 0.15 }}
                                  className="absolute left-0 top-full mt-1.5 bg-white border border-gray-200 rounded-lg shadow-xl z-50 min-w-[200px]"
                                >
                                  <div className="p-2">
                                    {renderPanel()}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        ))}
                      </div>
                    )}
                  </AnimatePresence>
               </div>
          )}
        </div>
        <div className="flex items-center gap-2 text-[10px] text-gray-400">
           <span className="bg-gray-100 px-2 py-0.5 rounded">拖拽排序已启用</span>
           <span className="bg-gray-100 px-2 py-0.5 rounded">所见即所得</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 relative">
         {settings.layout === 'horizontal' ? <HorizontalLayout /> : <VerticalLayout />}
      </div>
    </section>
  );
}

function HorizontalLayout() {
   const { tags, categories, selectedCategoryId, settings, isEditMode, setEditingTag } = useStore();
   const t = useTranslation(settings.language);
   
   const renderCat = (catId: string, depth: number) => {
     const subCats = categories.filter(c => c.parent_id === catId).sort((a,b) => a.position_order - b.position_order);
     const myTags = tags.filter(t => t.category_id === catId).sort((a,b) => a.position_order - b.position_order);
     const catInfo = categories.find(c => c.id === catId);

     if (!isEditMode && myTags.length === 0 && subCats.length === 0 && catId !== 'root') return null;

     return (
       <div key={catId} className="mb-6 pl-2" style={{ marginLeft: depth > 0 ? '24px' : '0' }}>
{catInfo && depth > 0 && (
             <div className="flex items-center gap-2 mb-3 group">
               <div className="w-1 h-3 rounded-sm" style={{ backgroundColor: catInfo.icon_color || '#3b82f6' }}></div>
               <h3 className="text-[12px] font-bold text-gray-700">{catInfo.name}</h3>
{isEditMode && (
                <button 
                  className="opacity-0 group-hover:opacity-100 p-0.5 text-gray-400 hover:text-blue-600 rounded bg-gray-100 hover:bg-blue-50 transition" 
                  title="在此分类下添加标签"
                  onClick={() => {
                      useStore.getState().openAddTag(catId);
                  }}
                >
                  <Plus size={12} />
                </button>
              )}
            </div>
         )}
         
         <Droppable droppableId={`drop-tag-horiz-${catId}`} direction="horizontal" type="TAG" isDropDisabled={!isEditMode}>
           {(provided) => (
             <div 
               ref={provided.innerRef} 
               {...provided.droppableProps} 
               className={`grid ${myTags.length > 0 ? 'mb-4' : ''} ${isEditMode && myTags.length === 0 ? 'min-h-[40px]' : ''}`} 
               style={{ 
                 gap: `${settings.tagLayout.spacingY}px ${settings.tagLayout.spacingX}px`,
                 gridTemplateColumns: `repeat(${settings.tagLayout.tagsPerRow || 5}, max-content)`
               }}
             >
{myTags.map((tag, i) => (
                    <TagCard key={tag.id} tag={tag} isEditMode={isEditMode} layout={settings.tagLayout} index={i} colorBlock="blue-500" onEdit={setEditingTag} />
                 ))}
                {provided.placeholder}
             </div>
           )}
         </Droppable>
         

         
         <div className={depth > 0 ? "border-l border-gray-100 pl-2" : ""}>
            {subCats.map(sc => renderCat(sc.id, depth + 1))}
         </div>
       </div>
     );
   }

   const rootTags = tags.filter(t => t.category_id === (selectedCategoryId || 'root'));
   const rootCats = categories.filter(c => c.parent_id === (selectedCategoryId || 'root'));
   const isEmptyRoot = rootTags.length === 0 && rootCats.length === 0;

   return (
     <div className={clsx("w-full max-w-6xl mx-auto relative", settings.theme === 'dark' ? 'text-gray-300' : 'text-gray-600')}>
       {isEmptyRoot && !isEditMode && (
           <div className="flex-1 flex flex-col items-center justify-center text-sm text-gray-400 italic py-20 px-4 text-center">
              <div className={clsx("p-4 rounded-full mb-4", settings.theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100')}><Globe size={32} className="text-gray-300" /></div>
              {t('emptyDesc')}
           </div>
       )}
       {renderCat(selectedCategoryId || 'root', 0)}
     </div>
   );
}

function VerticalLayout() {
   const { tags, categories, selectedCategoryId, settings, isEditMode, setEditingTag } = useStore();
   const t = useTranslation(settings.language);
   const rootLevelCats = categories.filter(c => c.parent_id === selectedCategoryId).sort((a,b) => a.position_order - b.position_order);
   const rootTags = tags.filter(t => t.category_id === selectedCategoryId).sort((a,b) => a.position_order - b.position_order);
   const selectedCat = categories.find(c => c.id === selectedCategoryId);

const renderSubVert = (catId: string, showHeader: boolean = true) => {
       const subCats = categories.filter(c => c.parent_id === catId).sort((a,b) => a.position_order - b.position_order);
       const myTags = tags.filter(t => t.category_id === catId).sort((a,b) => a.position_order - b.position_order);
       const catInfo = categories.find(c => c.id === catId);
       
       if (!isEditMode && myTags.length === 0 && subCats.length === 0) return null;
       
       const hasContent = myTags.length > 0 || subCats.some(sc => {
         const scTags = tags.filter(t => t.category_id === sc.id);
         return scTags.length > 0;
       });
       if (!hasContent && !isEditMode) return null;

       const tagsPerColumn = settings.tagLayout.tagsPerColumn || 0;
       const tagChunks: Tag[][] = [];
       const effectiveTagsPerColumn = tagsPerColumn || myTags.length;
       for (let i = 0; i < myTags.length; i += effectiveTagsPerColumn) {
         tagChunks.push(myTags.slice(i, i + effectiveTagsPerColumn));
       }

return (
          <div key={catId} className={`flex flex-col ${myTags.length > 0 ? 'mb-3' : 'mb-1'}`}>
               {showHeader && catInfo && (
                 <div className={`flex items-center gap-2 ${myTags.length > 0 ? 'mb-2' : 'mb-0.5'} ml-1 group`}>
                   <div className="w-1 h-2.5 rounded-sm" style={{ backgroundColor: catInfo.icon_color || '#3b82f6' }}></div>
                   <div className="text-[11px] font-semibold text-gray-500">{catInfo.name}</div>
{isEditMode && (
                     <button 
                       className="opacity-0 group-hover:opacity-100 p-0.5 text-gray-400 hover:text-blue-600 rounded bg-gray-100 hover:bg-blue-50 transition" 
                       title="在此分类下添加标签"
                       onClick={() => {
                           useStore.getState().openAddTag(catId);
                       }}
                     >
                       <Plus size={10} />
                     </button>
                  )}
               </div>
            )}
            {tagChunks.length > 0 ? (
              <div className="flex gap-4 flex-wrap">
                {tagChunks.map((chunk, chunkIndex) => (
                  <Droppable key={`${catId}-chunk-${chunkIndex}`} droppableId={`drop-tag-vert-${catId}-${chunkIndex}`} type="TAG" isDropDisabled={!isEditMode}>
                    {(provided) => (
                      <div ref={provided.innerRef} {...provided.droppableProps} className={`grid ${isEditMode && chunk.length === 0 ? 'min-h-[40px]' : ''}`}
                        style={{ 
                          gap: `${settings.tagLayout.spacingY}px ${settings.tagLayout.spacingX}px`,
gridTemplateColumns: `repeat(${effectiveTagsPerColumn}, max-content)`
                        }}>
                        {chunk.map((tag, i) => <TagCard key={tag.id} tag={tag} isEditMode={isEditMode} layout={settings.tagLayout} index={chunkIndex * effectiveTagsPerColumn + i} colorBlock="green-500" onEdit={setEditingTag} />)}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                ))}
              </div>
            ) : (
              isEditMode && (
                <Droppable droppableId={`drop-tag-vert-${catId}-0`} type="TAG" isDropDisabled={!isEditMode}>
                  {(provided) => (
<div ref={provided.innerRef} {...provided.droppableProps} className="min-h-[40px] mb-2"
                      style={{ 
                        gap: `${settings.tagLayout.spacingY}px ${settings.tagLayout.spacingX}px`,
                        gridTemplateColumns: `repeat(${effectiveTagsPerColumn || 5}, max-content)`
                      }}>
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              )
            )}
            


{subCats.length > 0 && (
              <div className={`pl-3 border-l border-gray-100 ml-1.5 ${myTags.length > 0 ? 'pt-1' : 'pt-0.5'}`}>
                {subCats.map(sc => renderSubVert(sc.id))}
              </div>
            )}
         </div>
       );
    };

   // For vertical layout, if selected category has NO children at all, show a placeholder
   const isEmptyRoot = rootTags.length === 0 && rootLevelCats.length === 0;

   return (
     <div className="flex gap-6 overflow-x-auto h-full w-full max-w-none pb-4 relative">
       {isEmptyRoot && isEditMode && (
           <div className="flex-1 flex items-center justify-center text-sm text-gray-400 italic border-2 border-dashed border-gray-200 rounded-xl m-4">
              此分类目前为空在纵向排版中。您可以从顶栏“添加标签”以向该分类直接添加标签。
           </div>
       )}
       {isEmptyRoot && !isEditMode && (
           <div className="flex-1 flex flex-col items-center justify-center text-sm text-gray-400 italic pt-20 px-4 text-center">
              <div className="bg-gray-100 p-4 rounded-full mb-4"><Rows3 size={32} className="text-gray-300" /></div>
              {t('emptyCatDesc')}
           </div>
       )}
{/* 1st Column: the root tags directly under the selected cat */}
        {rootTags.length > 0 && (
           <div className="flex flex-col min-w-[260px] shrink-0 border-r border-gray-200 pr-5" style={{ minWidth: settings.tagLayout.width ? Math.max(260, (settings.tagLayout.width + settings.tagLayout.spacingX) * settings.tagLayout.tagsPerRow) : 260 }}>
<div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-4 rounded-sm" style={{ backgroundColor: selectedCat?.icon_color || '#6b7280' }}></div>
                <h2 className="text-sm font-bold text-gray-700">{selectedCat ? selectedCat.name : t('rootLevel')}</h2>
              </div>
{(() => {
                const tagsPerColumn = settings.tagLayout.tagsPerColumn || 0;
                const effectiveTagsPerColumn = tagsPerColumn || rootTags.length || 5;
                const rootTagChunks: Tag[][] = [];
                for (let i = 0; i < rootTags.length; i += effectiveTagsPerColumn) {
                  rootTagChunks.push(rootTags.slice(i, i + effectiveTagsPerColumn));
                }
                return (
                  <div className="flex gap-4 flex-wrap">
                    {rootTagChunks.map((chunk, chunkIndex) => (
                      <Droppable key={`root-chunk-${chunkIndex}`} droppableId={`drop-tag-vert-root-col-${chunkIndex}`} type="TAG" isDropDisabled={!isEditMode}>
                        {(provided) => (
                          <div ref={provided.innerRef} {...provided.droppableProps} className="grid gap-2 min-h-[100px]"
                            style={{ 
                              gap: `${settings.tagLayout.spacingY}px ${settings.tagLayout.spacingX}px`,
                              gridTemplateColumns: `repeat(${effectiveTagsPerColumn}, max-content)`
                            }}>
                             {chunk.map((tag, i) => <TagCard key={tag.id} tag={tag} isEditMode={isEditMode} layout={settings.tagLayout} index={chunkIndex * effectiveTagsPerColumn + i} colorBlock="gray-500" onEdit={setEditingTag} />)}
                             {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    ))}
                  </div>
                );
              })()}
           </div>
        )}
        {/* Other Columns: First level child categories */}
        {rootLevelCats.map(c => (
           <div key={c.id} className="flex flex-col min-w-[260px] shrink-0 border-r border-gray-200 pr-5" style={{ minWidth: settings.tagLayout.width ? Math.max(260, (settings.tagLayout.width + settings.tagLayout.spacingX) * (settings.tagLayout.tagsPerColumn || 5)) : 260 }}>
<div className={`flex items-center gap-2 ${isEditMode || tags.some(t => t.category_id === c.id) ? 'mb-3' : 'mb-1'} group`}>
                 <div className="w-1 h-4 rounded-sm" style={{ backgroundColor: c.icon_color || '#3b82f6' }}></div>
                 <h2 className="text-sm font-bold text-gray-800">{c.name}</h2>
{isEditMode && (
                    <button 
                      className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-blue-600 rounded bg-gray-100 hover:bg-blue-50 transition" 
                      title="在此分类下添加标签"
                      onClick={() => {
                          useStore.getState().openAddTag(c.id);
                      }}
                    >
                      <Plus size={12} />
                    </button>
                 )}
             </div>
             {renderSubVert(c.id, false)}
          </div>
       ))}
     </div>
   );
}

function TagCard({ tag, isEditMode, layout, index, colorBlock, onEdit, ...rest }: { tag: Tag; isEditMode: boolean; layout: any; index: number; colorBlock: string; onEdit?: (tag: Tag) => void; [key: string]: unknown }) {
  const cardBorderL = layout.borderThickness === 1 ? undefined : layout.borderThickness;
    
  return (
<Draggable draggableId={`tag-${tag.id}`} index={index} isDragDisabled={!isEditMode}>
      {(provided) => (
        <div 
          ref={provided.innerRef} 
          {...provided.draggableProps} 
          {...provided.dragHandleProps} 
          className={clsx(
            "bg-white border rounded-lg p-2 flex items-center gap-3 shadow-sm transition-all group overflow-hidden border-l-4",
            isEditMode ? "hover:border-blue-300 hover:shadow-md cursor-move" : "hover:shadow-md cursor-pointer",
            colorBlock === 'blue-500' ? 'border-l-blue-400' : 
            colorBlock === 'green-500' ? 'border-l-green-400' : 'border-l-gray-400'
          )}
          style={{ borderWidth: cardBorderL, borderColor: layout.borderColor, width: layout.width, minHeight: layout.height }}
          onClick={() => { 
            if (!isEditMode) {
              const targetUrl = tag.url_external || tag.url;
              if (targetUrl) window.open(targetUrl.startsWith('http') ? targetUrl : `https://${targetUrl}`, '_blank');
            }
          }}
          onDoubleClick={(e) => { e.stopPropagation(); if(isEditMode && onEdit) onEdit(tag); }}
        >
          <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded" style={{ color: tag.icon_color || layout.iconColor || '#6b7280' }}>
            {renderTagIcon(tag, layout.iconSize || 16)}
          </div>
          <div className="flex-1 min-w-0 flex flex-col justify-center gap-0.5">
            <div className="font-bold truncate leading-tight" style={{ fontSize: layout.textSize, color: tag.text_color || '#374151' }}>{tag.title}</div>
            {tag.show_description && tag.description && <div className="truncate leading-tight" style={{ fontSize: layout.descSize, fontFamily: layout.descFont, color: layout.descColor }}>{tag.description}</div>}
            {tag.show_url && tag.url && (
              <div 
                className="truncate leading-tight opacity-80 cursor-pointer hover:text-blue-600"
                style={{ fontSize: layout.urlSize, fontFamily: layout.urlFont, color: layout.urlColor }}
                onClick={(e) => { e.stopPropagation(); if(tag.url) window.open(tag.url.startsWith('http') ? tag.url : `https://${tag.url}`, '_blank'); }}
              >
                {tag.url.replace(/^https?:\/\//, '')}
              </div>
            )}
            {tag.show_url_external && tag.url_external && (
              <div 
                className="truncate leading-tight opacity-80 cursor-pointer hover:text-blue-600 flex items-center gap-1"
                style={{ fontSize: layout.urlSize, fontFamily: layout.urlFont, color: layout.urlColor }}
                onClick={(e) => { e.stopPropagation(); window.open(tag.url_external!.startsWith('http') ? tag.url_external : `https://${tag.url_external}`, '_blank'); }}
              >
                <ExternalLink size={layout.urlSize} />{tag.url_external.replace(/^https?:\/\//, '')}
              </div>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
}
