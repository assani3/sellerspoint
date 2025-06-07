import './logout.css';

const logout = () => {
  sessionStorage.removeItem('sellerspoint_user');
  localStorage.removeItem('sellerspoint_user');
  window.location.href = '/signin'; // redirect to signin page
};

export default logout;
