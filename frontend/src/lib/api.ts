const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");
export async function api<T>(path:string, options:RequestInit={}) {
  const token=localStorage.getItem("token");
  const isForm=options.body instanceof FormData;
  const response=await fetch(`${API_URL}${path}`,{...options,headers:{...(isForm?{}:{"Content-Type":"application/json"}),...(token?{Authorization:`Bearer ${token}`}:{ }),...options.headers}});
  const data=await response.json().catch(()=>({}));
  if(!response.ok) throw new Error(data.error||data.message||"Request failed");
  return data as T;
}
