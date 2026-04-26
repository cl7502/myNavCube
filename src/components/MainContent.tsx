import { useStore, UserSettings } from '../store';
import { Pencil, Eye, Rows3, Globe, Plus, Settings } from 'lucide-react';
import * as Popover from '@radix-ui/react-popover';
import * as Slider from '@radix-ui/react-slider';
import clsx from 'clsx';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import { useTranslation } from '../i18n';

export function MainContent() {
  const { isEditMode, setEditMode, settings, setSettings, categories, tags, selectedCategoryId } = useStore();
  
  const t = useTranslation(settings.language);

  const handleStyleChange = (key: keyof UserSettings['tagLayout'], val: any) => {
    const newConfig = { ...settings.tagLayout, [key]: val };
    setSettings({ tagLayout: newConfig });
    import('../lib/api').then(({api}) => api.put('/api/user/info', { settings: { ...settings, tagLayout: newConfig } }).catch(()=>null));
  };

  return (
    <section className={clsx("flex-1 flex flex-col overflow-hidden", settings.theme === 'dark' ? 'bg-gray-900' : 'bg-[#F9FAFB]')}>
      <div className={clsx("h-10 border-b flex items-center px-4 justify-between shrink-0", settings.theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300')}>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setEditMode(!isEditMode)}
            className={clsx("px-3 py-1 rounded text-[11px] font-medium flex items-center gap-1 transition", isEditMode ? "bg-amber-100 text-amber-700 hover:bg-amber-200" : "bg-blue-600 text-white hover:bg-blue-700")}
          >
            {isEditMode ? <><Pencil size={12}/>{t('editMode')}</> : <><Eye size={12}/>{t('viewMode')}</>}
          </button>
          
          <div className={clsx("h-6 w-px mx-1", settings.theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300')}></div>

          {isEditMode && (
             <div className="flex items-center gap-2 text-xs">
                <button 
                   className={clsx("px-2 py-1 border rounded flex items-center gap-1", settings.theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50')}
                   onClick={() => {
                      useStore.getState().openPrompt(
                        t('addTag'),
                        [
                          { name: 'title', label: t('tagName'), placeholder: '请输入标签名称' },
                          { name: 'url', label: t('tagUrl'), defaultValue: 'https://' }
                        ],
                        (values) => {
                          if(values.title && values.url) {
                             const id = 'tag_' + Date.now();
                             const newTag = { id, category_id: selectedCategoryId || 'root', title: values.title, url: values.url, description: '', icon_url:'', position_order: 0 };
                             useStore.getState().setTags([...useStore.getState().tags, newTag]);
                             import('../lib/api').then(({api}) => api.post('/api/tags', newTag));
                          }
                        }
                      );
                   }}
                >
                    <Plus size={12}/><span>添加标签</span>
                </button>
                <div className="h-4 w-px bg-gray-200 mx-0.5"></div>
                <Popover.Root>
                  <Popover.Trigger asChild>
                    <button className="px-2 py-1 bg-white border border-gray-200 rounded hover:bg-gray-50 flex items-center gap-1 text-gray-600"><Settings size={12}/> 排版细节</button>
                  </Popover.Trigger>
                  <Popover.Portal>
                    <Popover.Content className="w-[450px] bg-white p-4 rounded-xl shadow-xl border border-gray-200 z-50 transform origin-top-left flex flex-col space-y-4">
                       <div className="font-bold text-sm text-gray-800">排版属性设置</div>
                       <div className="space-y-3 text-xs text-gray-600">
                         <label className="flex flex-col"><span className="mb-1">宽 ({settings.tagLayout.width}px)</span>
                           <Slider.Root className="relative flex items-center select-none touch-none w-full h-4" value={[settings.tagLayout.width]} max={400} min={100} step={1} onValueChange={(v) => handleStyleChange('width', v[0])}>
                              <Slider.Track className="bg-gray-200 relative grow rounded-full h-[2px]"><Slider.Range className="absolute bg-blue-500 rounded-full h-full" /></Slider.Track>
                              <Slider.Thumb className="block w-3 h-3 bg-white shadow border border-gray-300 rounded-full outline-none focus:ring-2" />
                           </Slider.Root>
                         </label>
                         <label className="flex flex-col"><span className="mb-1">高 ({settings.tagLayout.height}px)</span>
                           <Slider.Root className="relative flex items-center select-none touch-none w-full h-4" value={[settings.tagLayout.height]} max={200} min={30} step={1} onValueChange={(v) => handleStyleChange('height', v[0])}>
                              <Slider.Track className="bg-gray-200 relative grow rounded-full h-[2px]"><Slider.Range className="absolute bg-blue-500 rounded-full h-full" /></Slider.Track>
                              <Slider.Thumb className="block w-3 h-3 bg-white shadow border border-gray-300 rounded-full outline-none" />
                           </Slider.Root>
                         </label>
                         <div className="grid grid-cols-2 gap-4">
                            <label className="flex flex-col"><span className="mb-1">边距粗细 ({settings.tagLayout.borderThickness}px)</span>
                              <input type="number" value={settings.tagLayout.borderThickness} onChange={(e) => handleStyleChange('borderThickness', Number(e.target.value))} className="border rounded px-1 py-0.5 text-xs text-black" />
                            </label>
                            <label className="flex flex-col"><span className="mb-1">标题大小 (px)</span>
                              <input type="number" value={settings.tagLayout.textSize} onChange={(e) => handleStyleChange('textSize', Number(e.target.value))} className="border rounded px-1 py-0.5 text-xs text-black" />
                            </label>
                            <label className="flex flex-col"><span className="mb-1">图标大/小 (px)</span>
                              <input type="number" value={settings.tagLayout.iconSize} onChange={(e) => handleStyleChange('iconSize', Number(e.target.value))} className="border rounded px-1 py-0.5 text-xs text-black" />
                            </label>
                            <label className="flex flex-col"><span className="mb-1">图标颜色</span>
                              <div className="flex gap-1"><input type="color" value={settings.tagLayout.iconColor} onChange={(e) => handleStyleChange('iconColor', e.target.value)} className="w-5 h-5" /><span className="leading-tight">{settings.tagLayout.iconColor}</span></div>
                            </label>
                            
                            <label className="flex flex-col"><span className="mb-1">描述大小 (px)</span>
                              <input type="number" value={settings.tagLayout.descSize} onChange={(e) => handleStyleChange('descSize', Number(e.target.value))} className="border rounded px-1 py-0.5 text-xs text-black" />
                            </label>
                            <label className="flex flex-col"><span className="mb-1">描述颜色</span>
                              <div className="flex gap-1"><input type="color" value={settings.tagLayout.descColor} onChange={(e) => handleStyleChange('descColor', e.target.value)} className="w-5 h-5" /><span className="leading-tight">{settings.tagLayout.descColor}</span></div>
                            </label>
                            
                            <label className="flex flex-col"><span className="mb-1">URL大小 (px)</span>
                              <input type="number" value={settings.tagLayout.urlSize} onChange={(e) => handleStyleChange('urlSize', Number(e.target.value))} className="border rounded px-1 py-0.5 text-xs text-black" />
                            </label>
                            <label className="flex flex-col"><span className="mb-1">URL颜色</span>
                              <div className="flex gap-1"><input type="color" value={settings.tagLayout.urlColor} onChange={(e) => handleStyleChange('urlColor', e.target.value)} className="w-5 h-5" /><span className="leading-tight">{settings.tagLayout.urlColor}</span></div>
                            </label>

                            <label className="flex flex-col"><span className="mb-1">横向间距 (px)</span>
                              <input type="number" value={settings.tagLayout.spacingX} onChange={(e) => handleStyleChange('spacingX', Number(e.target.value))} className="border rounded px-1 py-0.5 text-xs text-black" />
                            </label>
                            <label className="flex flex-col"><span className="mb-1">纵向间距 (px)</span>
                              <input type="number" value={settings.tagLayout.spacingY} onChange={(e) => handleStyleChange('spacingY', Number(e.target.value))} className="border rounded px-1 py-0.5 text-xs text-black" />
                            </label>
                         </div>
                         <label className="flex flex-col"><span className="mb-1">每行数量 ({settings.tagLayout.tagsPerRow}个)</span>
                           <Slider.Root className="relative flex items-center select-none touch-none w-full h-4" value={[settings.tagLayout.tagsPerRow]} max={20} min={1} step={1} onValueChange={(v) => handleStyleChange('tagsPerRow', v[0])}>
                              <Slider.Track className="bg-gray-200 relative grow rounded-full h-[2px]"><Slider.Range className="absolute bg-blue-500 rounded-full h-full" /></Slider.Track>
                              <Slider.Thumb className="block w-3 h-3 bg-white shadow border border-gray-300 rounded-full outline-none" />
                           </Slider.Root>
                         </label>
                       </div>
                    </Popover.Content>
                  </Popover.Portal>
                </Popover.Root>
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
   const { tags, categories, selectedCategoryId, settings, isEditMode } = useStore();
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
              <div className="w-1 h-3 bg-blue-400 opacity-75 rounded-sm"></div>
              <h3 className="text-[12px] font-bold text-gray-700">{catInfo.name}</h3>
              {isEditMode && (
                <button 
                  className="opacity-0 group-hover:opacity-100 p-0.5 text-gray-400 hover:text-blue-600 rounded bg-gray-100 hover:bg-blue-50 transition" 
                  title="在此分类下添加标签"
                  onClick={() => {
                      useStore.getState().openPrompt(
                        '在此分类下添加标签',
                        [
                          { name: 'title', label: '标签名称', placeholder: '请输入标签名称' },
                          { name: 'url', label: '标签URL', defaultValue: 'https://' }
                        ],
                        (values) => {
                          if (values.title && values.url) {
                              const id = 'tag_' + Date.now();
                              const newTag = { id, category_id: catId, title: values.title, url: values.url, description: '', icon_url:'', position_order: 0 };
                              useStore.getState().setTags([...useStore.getState().tags, newTag]);
                              import('../lib/api').then(({api}) => api.post('/api/tags', newTag));
                          }
                        }
                      );
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
                   <TagCard key={tag.id} tag={tag} isEditMode={isEditMode} layout={settings.tagLayout} index={i} colorBlock="blue-500" />
                ))}
                {provided.placeholder}
             </div>
           )}
         </Droppable>
         
         {isEditMode && myTags.length === 0 && subCats.length === 0 && (
            <div className="text-xs text-gray-400 italic mb-4 bg-gray-50 border border-dashed border-gray-200 p-3 rounded-lg text-center">
               {t('emptyCatDesc')}
            </div>
         )}
         
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
   const { tags, categories, selectedCategoryId, settings, isEditMode } = useStore();
   const t = useTranslation(settings.language);
   const rootLevelCats = categories.filter(c => c.parent_id === selectedCategoryId).sort((a,b) => a.position_order - b.position_order);
   const rootTags = tags.filter(t => t.category_id === selectedCategoryId).sort((a,b) => a.position_order - b.position_order);

   const renderSubVert = (catId: string) => {
      const subCats = categories.filter(c => c.parent_id === catId).sort((a,b) => a.position_order - b.position_order);
      const myTags = tags.filter(t => t.category_id === catId).sort((a,b) => a.position_order - b.position_order);
      const catInfo = categories.find(c => c.id === catId);
      
      if (!isEditMode && myTags.length === 0 && subCats.length === 0) return null;

      return (
        <div key={catId} className="flex flex-col mb-4">
           {catInfo && (
              <div className="flex items-center gap-2 mb-2 ml-1 group">
                 <div className="w-1 h-2.5 bg-green-400 opacity-60 rounded-sm"></div>
                 <div className="text-[11px] font-semibold text-gray-500">{catInfo.name}</div>
                 {isEditMode && (
                    <button 
                      className="opacity-0 group-hover:opacity-100 p-0.5 text-gray-400 hover:text-blue-600 rounded bg-gray-100 hover:bg-blue-50 transition" 
                      title="在此分类下添加标签"
                      onClick={() => {
                          useStore.getState().openPrompt(
                            '在此分类下添加标签',
                            [
                              { name: 'title', label: '标签名称', placeholder: '请输入标签名称' },
                              { name: 'url', label: '标签URL', defaultValue: 'https://' }
                            ],
                            (values) => {
                              if (values.title && values.url) {
                                  const id = 'tag_' + Date.now();
                                  const newTag = { id, category_id: catId, title: values.title, url: values.url, description: '', icon_url:'', position_order: 0 };
                                  useStore.getState().setTags([...useStore.getState().tags, newTag]);
                                  import('../lib/api').then(({api}) => api.post('/api/tags', newTag));
                              }
                            }
                          );
                      }}
                    >
                      <Plus size={10} />
                    </button>
                 )}
              </div>
           )}
           <Droppable droppableId={`drop-tag-vert-${catId}`} type="TAG" isDropDisabled={!isEditMode}>
             {(provided) => (
               <div ref={provided.innerRef} {...provided.droppableProps} className={`grid ${myTags.length > 0 ? 'mb-2' : ''} ${isEditMode && myTags.length === 0 ? 'min-h-[40px] mb-2' : ''}`}
                 style={{ 
                   gap: `${settings.tagLayout.spacingY}px ${settings.tagLayout.spacingX}px`,
                   gridTemplateColumns: `repeat(${settings.tagLayout.tagsPerRow || 5}, max-content)`
                 }}>
                 {myTags.map((tag, i) => <TagCard key={tag.id} tag={tag} isEditMode={isEditMode} layout={settings.tagLayout} index={i} colorBlock="green-500" />)}
                 {provided.placeholder}
               </div>
             )}
           </Droppable>
           
           {isEditMode && myTags.length === 0 && subCats.length === 0 && (
               <div className="text-[10px] text-gray-400 italic mb-2 bg-gray-50 border border-dashed border-gray-200 p-2 rounded text-center mx-1">
                  空分类
               </div>
           )}

           {subCats.length > 0 && (
             <div className="pl-3 border-l border-gray-100 ml-1.5 pt-1">
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
               <div className="w-1 h-4 bg-gray-400 rounded-sm"></div>
               <h2 className="text-sm font-bold text-gray-700">{t('rootLevel')}</h2>
             </div>
             <Droppable droppableId={`drop-tag-vert-root-col`} type="TAG" isDropDisabled={!isEditMode}>
               {(provided) => (
                 <div ref={provided.innerRef} {...provided.droppableProps} className="grid gap-2 min-h-[100px]"
                   style={{ 
                     gap: `${settings.tagLayout.spacingY}px ${settings.tagLayout.spacingX}px`,
                     gridTemplateColumns: `repeat(${settings.tagLayout.tagsPerRow || 5}, max-content)`
                   }}>
                    {rootTags.map((tag, i) => <TagCard key={tag.id} tag={tag} isEditMode={isEditMode} layout={settings.tagLayout} index={i} colorBlock="gray-500" />)}
                    {provided.placeholder}
                 </div>
               )}
             </Droppable>
          </div>
       )}
       {/* Other Columns: First level child categories */}
       {rootLevelCats.map(c => (
          <div key={c.id} className="flex flex-col min-w-[260px] shrink-0 border-r border-gray-200 pr-5" style={{ minWidth: settings.tagLayout.width ? Math.max(260, (settings.tagLayout.width + settings.tagLayout.spacingX) * settings.tagLayout.tagsPerRow) : 260 }}>
             <div className="flex items-center gap-2 mb-4 group">
                <div className="w-1 h-4 bg-blue-600 rounded-sm"></div>
                <h2 className="text-sm font-bold text-gray-800">{c.name}</h2>
                {isEditMode && (
                    <button 
                      className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-blue-600 rounded bg-gray-100 hover:bg-blue-50 transition" 
                      title="在此分类下添加标签"
                      onClick={() => {
                          useStore.getState().openPrompt(
                            '在此分类下添加标签',
                            [
                              { name: 'title', label: '标签名称', placeholder: '请输入标签名称' },
                              { name: 'url', label: '标签URL', defaultValue: 'https://' }
                            ],
                            (values) => {
                              if (values.title && values.url) {
                                  const id = 'tag_' + Date.now();
                                  const newTag = { id, category_id: c.id, title: values.title, url: values.url, description: '', icon_url:'', position_order: 0 };
                                  useStore.getState().setTags([...useStore.getState().tags, newTag]);
                                  import('../lib/api').then(({api}) => api.post('/api/tags', newTag));
                              }
                            }
                          );
                      }}
                    >
                      <Plus size={12} />
                    </button>
                 )}
             </div>
             {renderSubVert(c.id)}
          </div>
       ))}
     </div>
   );
}

function TagCard({ tag, isEditMode, layout, index, colorBlock }: any) {
  // Extract custom color logic or keep default
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
            isEditMode ? "border-gray-200 hover:border-blue-300 hover:shadow-md cursor-move" : "border-gray-200 hover:shadow-md cursor-pointer",
            colorBlock === 'blue-500' ? 'border-l-blue-400' : 
            colorBlock === 'green-500' ? 'border-l-green-400' : 'border-l-gray-400'
          )}
          style={{ borderWidth: cardBorderL, width: layout.width, minHeight: layout.height }}
          onClick={() => { if(!isEditMode && tag.url) window.open(tag.url.startsWith('http') ? tag.url : `https://${tag.url}`, '_blank') }}
        >
          <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded" style={{ color: layout.iconColor, fontSize: layout.iconSize }}>
            {tag.icon_url ? <img src={tag.icon_url} className="w-5 h-5" /> : <Globe size={layout.iconSize || 16} />}
          </div>
          <div className="flex-1 min-w-0 flex flex-col justify-center gap-0.5">
            <div className="font-bold truncate text-gray-800 leading-tight" style={{ fontSize: layout.textSize }}>{tag.title}</div>
            {tag.description && <div className="truncate leading-tight" style={{ fontSize: layout.descSize, fontFamily: layout.descFont, color: layout.descColor }}>{tag.description}</div>}
            {tag.url && <div className="truncate leading-tight opacity-80" style={{ fontSize: layout.urlSize, fontFamily: layout.urlFont, color: layout.urlColor }}>{tag.url.replace(/^https?:\/\//, '')}</div>}
          </div>
        </div>
      )}
    </Draggable>
  );
}
