import { useEffect, useState } from 'react';
import { api } from './lib/api';
import { useStore } from './store';
import { Login } from './components/Login';
import { TopBar } from './components/TopBar';
import { Sidebar } from './components/Sidebar';
import { MainContent } from './components/MainContent';
import { GlobalPromptModal } from './components/GlobalPromptModal';
import { CategoryModal } from './components/CategoryModal';
import { DragDropContext } from '@hello-pangea/dnd';

export default function App() {
  const { user, setUser, setSettings, setCategories, setTags, selectedCategoryId } = useStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      if (!localStorage.getItem('token')) {
        setLoading(false);
        return;
      }
      try {
        const { user, settings } = await api.get('/api/user/info');
        setUser(user);
        if (settings && settings.data) {
           setSettings(JSON.parse(settings.data));
        }

        const { categories, tags } = await api.get('/api/data');
        setCategories(categories.length > 0 ? categories : [{id: 'root', name: '所有 (Root)', parent_id: null, position_order: 0, is_expanded: true, icon: '', icon_color:'', text_color: ''}]);
        setTags(tags);
        const lastCat = localStorage.getItem('last_selected_category');
        if (lastCat && categories.find(c => c.id === lastCat)) {
           useStore.getState().setSelectedCategory(lastCat);
        } else if (categories.length > 0) {
           useStore.getState().setSelectedCategory('root');
        }
      } catch (err) {
        localStorage.removeItem('token');
      }
      setLoading(false);
    };
    init();
  }, [setUser, setSettings, setCategories, setTags]);

  useEffect(() => {
    if (selectedCategoryId) {
       localStorage.setItem('last_selected_category', selectedCategoryId);
    }
  }, [selectedCategoryId]);

  const onDragEnd = async (result: any) => {
    const { source, destination, draggableId, type, combine } = result;
    
    if (draggableId.startsWith('cat-')) {
       if (!useStore.getState().isEditMode) return;
       const draggedId = draggableId.replace('cat-', '');
       if (combine) {
          const targetId = combine.draggableId.replace('cat-', '');
          const newCats = useStore.getState().categories.map(c => 
            c.id === draggedId ? { ...c, parent_id: targetId } : c
          );
          setCategories(newCats);
          try {
             await api.put(`/api/categories/${draggedId}`, newCats.find(c => c.id === draggedId));
          } catch(e) {}
       } else if (destination) {
          // Reordering not fully implemented for tree yet, just handle basic movement later
       }
    } else if (draggableId.startsWith('tag-')) {
       if (!useStore.getState().isEditMode) return;
       const tagId = draggableId.replace('tag-', '');
       
       let targetCat = 'root';
       if (combine) {
          targetCat = combine.draggableId.replace('cat-', '');
       } else if (destination) {
          if (destination.droppableId.startsWith('drop-tag-horiz-')) {
            targetCat = destination.droppableId.replace('drop-tag-horiz-', '');
          } else if (destination.droppableId.startsWith('drop-tag-vert-root-col')) {
            targetCat = useStore.getState().selectedCategoryId || 'root';
          } else if (destination.droppableId.startsWith('drop-tag-vert-')) {
            targetCat = destination.droppableId.replace('drop-tag-vert-', '');
          }
       } else {
         return;
       }
       
       // Handle sorting/reordering within same category can be added here
       
       const newTags = useStore.getState().tags.map(t => 
         t.id === tagId ? { ...t, category_id: targetCat } : t
       );
       setTags(newTags);
       
       try {
          await api.put(`/api/tags/${tagId}`, newTags.find(t => t.id === tagId));
       } catch (err) {
          console.error('Failed to save tag move', err);
       }
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;

  if (!user) return <Login />;

  return (
    <div className="flex flex-col h-screen w-full font-sans text-gray-900 bg-[#F4F5F7] overflow-hidden">
      <TopBar />
      <DragDropContext onDragEnd={onDragEnd}>
        <main className="flex-1 flex overflow-hidden">
          <Sidebar />
          <MainContent />
        </main>
      </DragDropContext>
      <GlobalPromptModal />
      <CategoryModal />
    </div>
  );
}
