//Create a helper to get the current logged-in user and their role
export const getCurrentUser = () => {
  const userStr = sessionStorage.getItem('sellerspoint_user') || localStorage.getItem('sellerspoint_user');
  return userStr ? JSON.parse(userStr) : null;
};

export const getUserRole = () => {
  const user = getCurrentUser();
  return user?.role || null;
};

export const isAdmin = () => getUserRole() === 'admin';
export const isSeller = () => getUserRole() === 'seller';
export const isBuyer = () => getUserRole() === 'buyer';
