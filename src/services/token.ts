const KEY = "token";

export const saveToken = (token: string) => {
  localStorage.setItem(KEY, token);
};

export const getToken = (): string | null => {
  return localStorage.getItem(KEY);
};

export const removeToken = () => {
  localStorage.removeItem(KEY);
};