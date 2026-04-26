const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`
});

export const api = {
  get: async (url: string) => {
    const res = await fetch(url, { headers: getHeaders() });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
  post: async (url: string, body: any) => {
    const res = await fetch(url, { method: 'POST', headers: getHeaders(), body: JSON.stringify(body) });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
  put: async (url: string, body: any) => {
    const res = await fetch(url, { method: 'PUT', headers: getHeaders(), body: JSON.stringify(body) });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
  delete: async (url: string) => {
    const res = await fetch(url, { method: 'DELETE', headers: getHeaders() });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }
};
