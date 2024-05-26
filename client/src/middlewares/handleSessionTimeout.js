export const handleSessionTimeout = (storeAPI) => (next) => (action) => {
  console.log("Middleware triggered: ", action);
  if (action.payload?.status === 401) {
    console.log("Session expired. Logging out...");
    storeAPI.dispatch(logout());
  }
  return next(action);
};
