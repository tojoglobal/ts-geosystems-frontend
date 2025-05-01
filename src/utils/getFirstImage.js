// utils/getFirstImage.js
export const getFirstImage = (image_urls) => {
  try {
    const parsed = JSON.parse(image_urls);
    return parsed[0] || null;
  } catch {
    return null;
  }
};
