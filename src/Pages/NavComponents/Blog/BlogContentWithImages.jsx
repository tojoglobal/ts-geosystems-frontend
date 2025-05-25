const BlogContentWithImages = ({ blog, middleImages }) => {
  const renderContentWithImages = () => {
    if (!blog?.content) return "";

    const plainText = blog.content.replace(/<[^>]+>/g, "");
    const words = plainText.split(/\s+/);

    const chunks = [];
    const chunkSize = 100;
    let imageIndex = 0;

    for (let i = 0; i < words.length; i += chunkSize) {
      const chunkWords = words.slice(i, i + chunkSize).join(" ");
      chunks.push(`<p>${chunkWords}</p>`);

      if (imageIndex < middleImages.length) {
        const img1 = middleImages[imageIndex];
        const img2 = middleImages[imageIndex + 1];

        chunks.push(`
          <div class="flex flex-col md:flex-row gap-3 justify-center my-6">
            ${
              img1
                ? `<img 
                    src="${import.meta.env.VITE_OPEN_APIURL}${img1.filePath}" 
                    alt="middle" 
                    class="rounded-sm w-full md:w-[350px] h-[200px] object-cover" 
                  />`
                : ""
            }
            ${
              img2
                ? `<img 
                    src="${import.meta.env.VITE_OPEN_APIURL}${img2.filePath}" 
                    alt="middle" 
                    class="rounded-sm w-full md:w-[350px] h-[200px] object-cover" 
                  />`
                : ""
            }
          </div>
        `);

        imageIndex += 2;
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
