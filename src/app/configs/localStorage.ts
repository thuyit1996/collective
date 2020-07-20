
export const localStorageService = {
  setLocalStorageByKey(key, value) {
    localStorage.setItem(key, value);
  },

  getByKey(key) {
    return localStorage.getItem(key);
  },

  removeLocalStorageByKey(key) {
    localStorage.removeItem(key);
  },

  clearLocalStorage() {
    localStorage.clear();
  }
};
