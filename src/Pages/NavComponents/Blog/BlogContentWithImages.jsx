import React from "react";

const BlogContentWithImages = ({ blog, middleImages }) => {
  const renderContentWithImages = () => {
    if (!blog?.content) return "";

    // Optional: Strip HTML tags from blog content
    const plainText = blog.content.replace(/<[^>]+>/g, "");
    const words = plainText.split(/\s+/);

    const chunks = [];
    const chunkSize = 100;
    let imageIndex = 0;

    for (let i = 0; i < words.length; i += chunkSize) {
      const chunkWords = words.slice(i, i + chunkSize).join(" ");
      chunks.push(`<p>${chunkWords}</p>`);

      // Insert two middle images side by side (if available)
      if (imageIndex < middleImages.length) {
        const img1 = middleImages[imageIndex];
        const img2 = middleImages[imageIndex + 1];

        chunks.push(`
          <div class="flex text-[16px] font-semibold flex-wrap gap-4 justify-center my-6">
            ${
              img1
                ? `<img 
              src="${import.meta.env.VITE_OPEN_APIURL}${img1.filePath}" 
              alt="middle" 
              class="rounded-md w-full sm:w-[48%] max-w-[350px]" 
            />`
                : ""
            }
            ${
              img2
                ? `<img 
              src="${import.meta.env.VITE_OPEN_APIURL}${img2.filePath}" 
              alt="middle" 
              class="rounded-md w-full sm:w-[48%] max-w-[350px]" 
            />`
                : ""
            }
          </div>
        `);

        imageIndex += 2; // move to next pair
      }
    }

    return chunks.join("");
  };

  return (
    <div
      className="space-y-3 text-sm blog-content mb-4"
      dangerouslySetInnerHTML={{ __html: renderContentWithImages() }}
    />
  );
};

export default BlogContentWithImages;
