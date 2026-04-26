import { useStore } from '../store';

export function GlobalPromptModal() {
  const { promptState, closePrompt } = useStore();

  if (!promptState || !promptState.isOpen) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const values: Record<string, string> = {};
    promptState.fields.forEach(f => {
      values[f.name] = fd.get(f.name) as string;
    });
    promptState.onSubmit(values);
    closePrompt();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-[400px] overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="px-4 py-3 border-b border-gray-100 font-bold text-gray-800">
          {promptState.title}
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-4 space-y-4">
            {promptState.fields.map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                <input
                  type="text"
                  name={field.name}
                  defaultValue={field.defaultValue}
                  placeholder={field.placeholder}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  autoFocus={promptState.fields[0].name === field.name}
                />
              </div>
            ))}
          </div>
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={closePrompt}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded shadow-sm"
            >
              确认
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
