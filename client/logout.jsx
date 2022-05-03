export function logout() {
  localStorage.clear();
  // you can also like localStorage.removeItem('Token');
  window.location.href = "/";
}