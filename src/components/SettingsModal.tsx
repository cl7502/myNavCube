import * as Dialog from '@radix-ui/react-dialog';
import * as Tabs from '@radix-ui/react-tabs';
import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { useStore } from '../store';

export function SettingsModal({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  const { settings } = useStore();
  const [tables, setTables] = useState<string[]>([]);
  const [selectedTable, setSelectedTable] = useState('');
  const [tableData, setTableData] = useState<any[]>([]);

  useEffect(() => {
    if (open) {
      api.get('/api/admin/tables').then(res => {
        setTables(res.tables);
        if (res.tables.length > 0) setSelectedTable(res.tables[0]);
      });
    }
  }, [open]);

  useEffect(() => {
    if (selectedTable) {
      api.get(`/api/admin/tables/${selectedTable}`).then(res => {
        setTableData(res.data);
      });
    }
  }, [selectedTable]);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
<Dialog.Content className="w-[800px] h-[600px] rounded-xl shadow-2xl overflow-hidden flex flex-col z-50 outline-none"
            style={{ 
              backgroundColor: settings.theme === 'dark' ? '#1f2937' : '#ffffff',
              border: settings.theme === 'superhuman' ? '1px solid #dcd7d3' : settings.theme === 'dark' ? '1px solid #374151' : 'none'
            }}>
            <div className="px-4 py-3 flex justify-between items-center border-b shrink-0"
              style={{ 
                backgroundColor: settings.theme === 'dark' ? '#374151' : settings.theme === 'superhuman' ? '#e9e5dd' : '#f3f4f6',
                borderColor: settings.theme === 'dark' ? '#4b5563' : '#e5e7eb'
              }}>
              <span className="text-sm font-bold" style={{ color: settings.theme === 'dark' ? '#f3f4f6' : '#1f2937' }}>系统设置 - 管理面板</span>
              <button className="text-gray-400 hover:text-black transition" onClick={() => onOpenChange(false)}>✕</button>
            </div>
            
            <Tabs.Root defaultValue="data" className="flex flex-1 overflow-hidden">
              <Tabs.List className="w-32 bg-gray-50 border-r border-gray-200 flex flex-col text-[11px] font-medium shrink-0">
                <Tabs.Trigger value="data" className="p-3 text-left hover:bg-gray-100 text-gray-600 data-[state=active]:bg-white data-[state=active]:border-r-2 data-[state=active]:border-r-blue-500 data-[state=active]:text-blue-600 outline-none">数据管理</Tabs.Trigger>
                <Tabs.Trigger value="style" className="p-3 text-left hover:bg-gray-100 text-gray-600 data-[state=active]:bg-white data-[state=active]:border-r-2 data-[state=active]:border-r-blue-500 data-[state=active]:text-blue-600 outline-none">风格细节</Tabs.Trigger>
              </Tabs.List>
              
              <Tabs.Content value="data" className="flex-1 p-6 flex flex-col min-w-0 overflow-hidden bg-white">
                <div className="mb-4 text-xs font-bold text-gray-500 flex items-center justify-between shrink-0">
                  <div className="flex items-center">
                    当前数据表: 
                    <select 
                      className="ml-2 border border-gray-300 rounded px-2 py-1 bg-white font-normal text-black" 
                      value={selectedTable} 
                      onChange={e => setSelectedTable(e.target.value)}
                    >
                      {tables.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
                <div className="flex-1 border border-gray-200 rounded overflow-hidden overflow-y-auto relative">
                  <table className="w-full text-[10px]">
                    <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                      <tr>
                        <th className="p-2 text-left font-medium text-gray-600 tracking-wider whitespace-nowrap">ID</th>
                        {tableData[0] && Object.keys(tableData[0]).filter(k => k !== 'id').map(k => (
                          <th key={k} className="p-2 text-left font-medium text-gray-600 tracking-wider whitespace-nowrap">{k}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                      {tableData.map((row, i) => (
                        <tr key={i} className="hover:bg-gray-50">
                          <td className="p-2 whitespace-nowrap max-w-[150px] truncate">{row.id || '-'}</td>
                          {Object.entries(row).filter(([k]) => k !== 'id').map(([k, val]: any, j) => (
                            <td key={j} className="p-2 whitespace-nowrap max-w-[150px] truncate text-gray-700" title={String(val)}>{String(val)}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Tabs.Content>
              
              <Tabs.Content value="style" className="flex-1 p-6 overflow-auto bg-white">
                <div className="text-gray-500 text-sm">预留风格细节设置页面。</div>
              </Tabs.Content>
            </Tabs.Root>
            
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
