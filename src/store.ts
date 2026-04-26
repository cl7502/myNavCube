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
  tagLayout: {
    width: number;
    height: number;
    borderThickness: number;
    textSize: number;
    iconSize: number;
    iconColor: string;
    descSize: number;
    descFont: string;
    descColor: string;
    urlSize: number;
    urlFont: string;
    urlColor: string;
    spacingX: number;
    spacingY: number;
    tagsPerRow: number;
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
  description: string;
  icon_url: string;
  position_order: number;
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
}

const defaultSettings: UserSettings = {
  language: 'zh',
  theme: 'default',
  layout: 'vertical',
  tagLayout: {
    width: 200,
    height: 60,
    borderThickness: 1,
    textSize: 14,
    iconSize: 24,
    iconColor: '#000000',
    descSize: 12,
    descFont: 'Inter',
    descColor: '#666666',
    urlSize: 10,
    urlFont: 'Inter',
    urlColor: '#999999',
    spacingX: 10,
    spacingY: 10,
    tagsPerRow: 5
  }
};

export const useStore = create<AppState>((set) => ({
  user: null,
  settings: defaultSettings,
  categories: [],
  tags: [],
  isEditMode: false,
  selectedCategoryId: 'root',
  isSidebarExpanded: true,
  promptState: null,
  editingCategory: null,
  
  setUser: (user) => set({ user }),
  setSettings: (newSettings) => set((state) => ({ settings: { ...state.settings, ...newSettings } })),
  setCategories: (categories) => set({ categories }),
  setTags: (tags) => set({ tags }),
  setEditMode: (isEditMode) => set({ isEditMode }),
  setSelectedCategory: (selectedCategoryId) => set({ selectedCategoryId }),
  setSidebarExpanded: (isSidebarExpanded) => set({ isSidebarExpanded }),
  openPrompt: (title, fields, onSubmit) => set({ promptState: { isOpen: true, title, fields, onSubmit } }),
  closePrompt: () => set({ promptState: null }),
  setEditingCategory: (editingCategory) => set({ editingCategory })
}));
