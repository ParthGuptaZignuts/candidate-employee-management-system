export default defineNuxtRouteMiddleware((to, from) => {
  if (process.client) {
    // get the token from the localstorage
    const token = localStorage.getItem("authToken");
    const isAuthenticated = token !== null;
    // restrict access to use /login
    if (to.path === "/jobs") {
      if (!isAuthenticated) {
        return navigateTo("/");
      }
    }
    // redirect authenticated user to '/' if he tries to access '/login' route
    if(isAuthenticated) {
        if (to.path === "/") {
          return navigateTo("/jobs");
        }
    }
  }
});
