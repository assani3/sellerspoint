// utils/apiFetch.js
export const apiFetch = async (url, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/113 Safari/537.36',
    ...options.headers
  };

  const finalOptions = {
    ...options,
    headers
  };

  return await fetch(url, finalOptions);
};
