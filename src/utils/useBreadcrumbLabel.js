export const useBreadcrumbLabel = (text) => {
  if (!text) return "";

  // Replace hyphens or underscores with spaces
  const spaced = text.replace(/[-_]/g, " ");

  // Capitalize each word
  const capitalized = spaced
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return capitalized;
};
