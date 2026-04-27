import { create } from 'zustand';

export interface User {
  id: number;
  username: string;
  name: string;
  avatar: string;
}

export interface UserSettings {
  language: string;
  theme: string;
  layout: 'horizontal' | 'vertical';
  sidebarWidth: number;
  sidebarScale: number;
 tagLayout: {
    width: number;
    height: number;
    borderThickness: number;
    borderColor: string;
    textSize: number;
    iconSize: number;
    descSize: number;
    descFont: string;
    descColor: string;
    urlSize: number;
    urlFont: string;
    urlColor: string;
    spacingX: number;
    spacingY: number;
    tagsPerRow: number;
    tagsPerColumn: number;
  };
}

export interface Category {
  id: string;
  parent_id: string | null;
  name: string;
  icon: string;
  icon_color: string;
  text_color: string;
  position_order: number;
  is_expanded: boolean;
}

export interface Tag {
  id: string;
  category_id: string;
  title: string;
  url: string;
  url_external: string;
  description: string;
  icon_url: string;
  icon_color: string;
  text_color: string;
  position_order: number;
  show_description: boolean;
  show_url: boolean;
  show_url_external: boolean;
}

export interface PromptState {
  isOpen: boolean;
  title: string;
  fields: { name: string; label: string; defaultValue?: string; placeholder?: string }[];
  onSubmit: (values: Record<string, string>) => void;
}

interface AppState {
  user: User | null;
  settings: UserSettings;
  categories: Category[];
  tags: Tag[];
  isEditMode: boolean;
  selectedCategoryId: string | null;
  isSidebarExpanded: boolean;
  promptState: PromptState | null;
  editingCategory: Category | null;
  editingTag: Tag | null;
  addingCategory: { parentId: string | null; name: string } | null;
   
  setUser: (user: User | null) => void;
  setSettings: (settings: Partial<UserSettings>) => void;
  setCategories: (categories: Category[]) => void;
  setTags: (tags: Tag[]) => void;
  setEditMode: (mode: boolean) => void;
  setSelectedCategory: (id: string | null) => void;
  setSidebarExpanded: (expanded: boolean) => void;
  openPrompt: (title: string, fields: PromptState['fields'], onSubmit: (values: Record<string, string>) => void) => void;
  closePrompt: () => void;
setEditingCategory: (cat: Category | null) => void;
  setEditingTag: (tag: Tag | null) => void;
  openAddCategory: (parentId: string | null, name?: string) => void;
  closeAddCategory: () => void;
  addingTag: { categoryId: string } | null;
  openAddTag: (categoryId: string) => void;
  closeAddTag: () => void;
}

const defaultSettings: UserSettings = {
  language: 'zh',
  theme: 'default',
  layout: 'vertical',
  sidebarWidth: 250,
  sidebarScale: 1,
 tagLayout: {
    width: 200,
    height: 60,
    borderThickness: 1,
    borderColor: '#e5e7eb',
    textSize: 14,
    iconSize: 24,
    descSize: 12,
    descFont: 'Inter',
    descColor: '#666666',
    urlSize: 10,
    urlFont: 'Inter',
    urlColor: '#999999',
    spacingX: 10,
    spacingY: 10,
    tagsPerRow: 0,
    tagsPerColumn: 0
  }
};

export const useStore = create<AppState>((set) => ({
  user: null,
  settings: defaultSettings,
  categories: [],
  tags: [],
  isEditMode: true,
  selectedCategoryId: 'root',
  isSidebarExpanded: true,
  promptState: null,
  editingCategory: null,
  editingTag: null,
  addingCategory: null,
   
  setUser: (user) => set({ user }),
  setSettings: (newSettings) => set((state) => ({ settings: { ...state.settings, ...newSettings } })),
  setCategories: (categories) => set({ categories }),
  setTags: (tags) => set({ tags }),
  setEditMode: (isEditMode) => set({ isEditMode }),
  setSelectedCategory: (selectedCategoryId) => set({ selectedCategoryId }),
  setSidebarExpanded: (isSidebarExpanded) => set({ isSidebarExpanded }),
  openPrompt: (title, fields, onSubmit) => set({ promptState: { isOpen: true, title, fields, onSubmit } }),
  closePrompt: () => set({ promptState: null }),
  setEditingCategory: (editingCategory) => set({ editingCategory }),
  setEditingTag: (editingTag) => set({ editingTag }),
openAddCategory: (parentId, name = '') => set({ addingCategory: { parentId, name } }),
  closeAddCategory: () => set({ addingCategory: null }),
  addingTag: null,
  openAddTag: (categoryId) => set({ addingTag: { categoryId } }),
  closeAddTag: () => set({ addingTag: null })
}));
