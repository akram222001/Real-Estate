export const API_BASE = import.meta.env.VITE_API_BASE;

// export const apiGet = async (url, options = {}) => {
//   const res = await fetch(`${API_BASE}${url}`, {
//     headers: { "Content-Type": "application/json" },
//     ...options,
//   });

//   if (!res.ok) throw new Error("API Error");
//   return res.json();
// };