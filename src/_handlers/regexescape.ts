// Regex function for search functionality
export function escapeRegex (string) {
  return string.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};
