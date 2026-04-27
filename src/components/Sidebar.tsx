import { useState, useEffect, useRef, type MouseEvent } from 'react';
import { useStore, Category } from '../store';
import { ChevronRight, ChevronDown, Plus, MoreVertical, LayoutGrid, PanelLeftClose, PanelLeftOpen, ZoomIn, ZoomOut } from 'lucide-react';
import * as Icons from 'lucide-react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import { useTranslation } from '../i18n';

export function Sidebar() {
  const { categories, selectedCategoryId, setSelectedCategory, isSidebarExpanded, setSidebarExpanded, isEditMode, settings, setSettings, openAddCategory } = useStore();
  const [width, setWidth] = useState(settings.sidebarWidth || 250);
  const [scale, setScale] = useState(settings.sidebarScale || 1);
  const isDraggingRef = useRef(false);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
     
  const t = useTranslation(settings.language);

  const saveWidth = (newWidth: number) => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      const newSettings = { ...settings, sidebarWidth: newWidth };
      setSettings({ sidebarWidth: newWidth });
      import('../lib/api').then(({api}) => api.put('/api/user/settings', { language: settings.language, data: newSettings }).catch(()=>null));
    }, 300);
  };

  const saveScale = (newScale: number) => {
    const newSettings = { ...settings, sidebarScale: newScale };
    setSettings({ sidebarScale: newScale });
    import('../lib/api').then(({api}) => api.put('/api/user/settings', { language: settings.language, data: newSettings }).catch(()=>null));
  };

  const handleZoomIn = () => {
    const newScale = Math.min(scale + 0.1, 1.5);
    setScale(newScale);
    saveScale(newScale);
  };

  const handleZoomOut = () => {
    const newScale = Math.max(scale - 0.1, 0.6);
    setScale(newScale);
    saveScale(newScale);
  };

  const startDrag = (e: MouseEvent) => {
    isDraggingRef.current = true;
    document.body.style.cursor = 'col-resize';
  };

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      let newWidth = e.clientX;
      if (newWidth < 150) newWidth = 150;
      if (newWidth > 600) newWidth = 600;
      setWidth(newWidth);
      saveWidth(newWidth);
    };
    const onMouseUp = () => {
      isDraggingRef.current = false;
      document.body.style.cursor = 'default';
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [settings]);

  useEffect(() => {
    if (settings.sidebarWidth && settings.sidebarWidth !== width) {
      setWidth(settings.sidebarWidth);
    }
  }, [settings.sidebarWidth]);

  useEffect(() => {
    if (settings.sidebarScale && settings.sidebarScale !== scale) {
      setScale(settings.sidebarScale);
    }
  }, [settings.sidebarScale]);

  const buildTree = (cats: Category[], parentId: string | null): Category[] => {
    return cats.filter(c => c.parent_id === parentId).sort((a,b) => a.position_order - b.position_order);
  };

  const renderTree = (cats: Category[], parentId: string | null) => {
    const children = buildTree(cats, parentId);
    if (children.length === 0) return null;

    return (
      <div className="pl-4">
        {children.map((child, index) => (
           <CategoryItem key={child.id} category={child} index={index} allCats={cats} renderTree={renderTree} />
        ))}
      </div>
    );
  };

  if (!isSidebarExpanded) {
    return (
      <aside className="w-14 bg-white border-r border-gray-300 flex flex-col items-center py-3 shrink-0 relative z-10 transition-all">
         <button onClick={() => setSidebarExpanded(true)} className="p-1.5 hover:bg-gray-100 rounded text-gray-500 hover:text-blue-600 transition-colors" title="展开导航栏">
            <PanelLeftOpen size={18} />
         </button>
      </aside>
    );
  }

return (
    <aside style={{ width: `${width}px` }} className="h-full bg-white border-r border-gray-300 flex shrink-0 relative flex-col z-10">
      <div className="p-3 border-b border-gray-100 flex justify-between items-center shrink-0">
        <span className="text-xs font-bold text-gray-600 uppercase tracking-wider flex items-center gap-1">分类导航</span>
        <div className="flex items-center gap-1">
          <button onClick={handleZoomOut} className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-blue-600 transition-colors" title="缩小" disabled={scale <= 0.6}>
            <ZoomOut size={14} />
          </button>
          <button onClick={handleZoomIn} className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-blue-600 transition-colors" title="放大" disabled={scale >= 1.5}>
            <ZoomIn size={14} />
          </button>
          <button onClick={() => setSidebarExpanded(false)} className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-blue-600 transition-colors" title="收起导航栏">
             <PanelLeftClose size={16} />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-2 py-2 text-xs" style={{ fontSize: `${scale}rem` }}>
        <Droppable droppableId="sidebar" type="TAG" isCombineEnabled={false}>
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps} className="min-h-full space-y-1">
              {/* Root Cat manually handled */}
              {categories.find(c => c.id === 'root') && (
                <div 
                  className={`flex items-center justify-between p-1.5 rounded-sm cursor-pointer group ${selectedCategoryId === 'root' ? 'bg-blue-50 text-blue-700 font-medium' : 'hover:bg-gray-50 text-gray-700'}`}
                  onClick={() => setSelectedCategory('root')}
                >
                   <div className="flex items-center gap-2">
                     <LayoutGrid size={14} className={selectedCategoryId === 'root' ? 'text-blue-600' : 'text-gray-400'} />
                     {t('allCategories')}
                   </div>
                   <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
<button type="button" className="p-1 text-gray-400 hover:text-blue-600 rounded hover:bg-blue-100" 
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              openAddCategory('root');
                            }}
                            onMouseDown={e => e.stopPropagation()}
                            onTouchStart={e => e.stopPropagation()}
                         >
                           <Plus size={12} />
                        </button>
                     </div>
                </div>
              )}
              {renderTree(categories, 'root')}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
      
      {/* Resizer */}
      <div className="absolute right-0 top-0 bottom-0 w-1 group cursor-col-resize hover:bg-blue-400 active:bg-blue-600 transition" onMouseDown={startDrag}>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="bg-white border border-gray-300 rounded shadow py-1 px-0.5 text-gray-400 pointer-events-none">
            <MoreVertical size={10} className="opacity-50" />
          </button>
        </div>
      </div>
    </aside>
  );
}

function CategoryItem({ category, index, allCats, renderTree }: any) {
  const { selectedCategoryId, setSelectedCategory, isEditMode, settings } = useStore();
  const [expanded, setExpanded] = useState(category.is_expanded);
  const t = useTranslation(settings.language);
  
return (
    <Draggable draggableId={`cat-${category.id}`} index={index} isDragDisabled={!isEditMode}>
      {(provided) => {
        let IconComp: any = null;
        let isCustomSvg = false;
        let isImage = false;
        let iconUrl: string | null = null;
        if (category.icon) {
          if (category.icon.startsWith('<svg')) {
            isCustomSvg = true;
          } else if (category.icon.startsWith('http') || category.icon.startsWith('data:image')) {
            isImage = true;
            iconUrl = category.icon;
          } else if (category.icon.startsWith('dicebear:')) {
            const parts = category.icon.split(':');
            iconUrl = `https://api.dicebear.com/9.x/${parts[1]}/svg?seed=${parts[2]}`;
          } else if (category.icon.startsWith('openpeeps:')) {
            const parts = category.icon.split(':');
            iconUrl = `https://api.openpeeps.org/v3/peeps?type=${parts[1]}&id=${parts[2]}`;
          } else if (category.icon.startsWith('avataaars:')) {
            const parts = category.icon.split(':');
            iconUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${parts[1]}`;
          } else if (category.icon.includes(':')) {
            const [prefix, name] = category.icon.split(':');
            iconUrl = `https://api.iconify.design/${prefix}/${name}.svg?width=16&height=16&color=${encodeURIComponent(category.icon_color || '#3b82f6')}`;
          } else {
             IconComp = (Icons as any)[category.icon];
           }
        }
        
        return (
        <div ref={provided.innerRef} {...provided.draggableProps} className="flex flex-col mt-0.5 relative">
          <Droppable droppableId={`cat-${category.id}`} type="TAG" isDropDisabled={!isEditMode}>
            {(dropProvided, dropSnapshot) => (
               <div 
                 ref={dropProvided.innerRef} 
                 {...dropProvided.droppableProps}
                 className={`flex items-center justify-between group p-1 pl-2 rounded-sm cursor-pointer border border-transparent transition-all ${selectedCategoryId === category.id ? 'bg-blue-50 text-blue-700 font-medium' : 'hover:bg-gray-50 text-gray-600'} ${dropSnapshot.isDraggingOver ? 'bg-green-50 border-green-400 border-dashed' : ''}`}
                 onClick={() => setSelectedCategory(category.id)}
onDoubleClick={() => {
                      useStore.getState().setEditingCategory(category);
                  }}
              >
<div className="flex items-center gap-1.5 flex-1 min-w-0" {...provided.dragHandleProps} >
                    <div className="p-0.5 hover:bg-gray-200 rounded shrink-0 cursor-pointer" onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}>
                      {buildHasChildren(allCats, category.id) ? (
                        <ChevronRight size={12} className={expanded ? 'rotate-90 transition-transform' : 'transition-transform'} />
                      ) : <span className="w-[12px]"></span>}
                    </div>
                    
{category.icon ? (
                      <div className="shrink-0 flex items-center justify-center w-4 h-4" style={{ color: category.icon_color || 'inherit' }}>
                         {isCustomSvg && <div dangerouslySetInnerHTML={{ __html: category.icon }} className="w-full h-full [&>svg]:w-full [&>svg]:h-full" />}
                         {(isImage || iconUrl) && <img src={iconUrl!} className="w-full h-full object-contain" alt="" />}
                         {IconComp && <IconComp size={14} />}
                      </div>
                    ) : null}
                    
                    <span className="truncate select-none" style={{ color: category.text_color || 'inherit' }}>{category.name}</span>
                  </div>
                 
                 <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
<button type="button" className="p-1 text-gray-400 hover:text-blue-600 rounded hover:bg-blue-100" 
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            useStore.getState().openAddCategory(category.id);
                          }}
                          onMouseDown={e => e.stopPropagation()}
                          onTouchStart={e => e.stopPropagation()}
                       >
                         <Plus size={12} />
                      </button>
                   </div>
                   {dropProvided.placeholder && <div className="hidden" style={{display:'none'}}>{dropProvided.placeholder}</div>}
              </div>
            )}
          </Droppable>
          {expanded && buildHasChildren(allCats, category.id) && (
            <div className="ml-4 border-l border-gray-200 mt-0.5">
               {renderTree(allCats, category.id)}
            </div>
          )}
        </div>
      )}}
    </Draggable>
  );
}

function buildHasChildren(cats: Category[], parentId: string) {
  return cats.some(c => c.parent_id === parentId);
}
