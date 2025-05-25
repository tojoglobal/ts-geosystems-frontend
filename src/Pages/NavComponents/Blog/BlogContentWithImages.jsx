const BlogContentWithImages = ({ blog, middleImages }) => {
  const renderContentWithImages = () => {
    let result = [];

    // If there's content, split it into paragraphs
    if (blog?.content) {
      const paragraphs = blog.content
        .split("\n\n")
        .filter((p) => p.trim().length > 0);

      let imageIndex = 0;
      let paragraphCount = 0;

      paragraphs.forEach((paragraph) => {
        // Add the paragraph with proper spacing
        result.push(`<p class="mb-4">${paragraph}</p>`);
        paragraphCount++;

        // Insert images after every 2 paragraphs or at strategic points
        if (paragraphCount >= 2 && imageIndex < middleImages.length) {
          result.push(renderImagePair(middleImages, imageIndex));
          imageIndex += 2;
          paragraphCount = 0;
        }
      });

      // Add any remaining images at the end of content
      while (imageIndex < middleImages.length) {
        result.push(renderImagePair(middleImages, imageIndex));
        imageIndex += 2;
      }
    }
    // If no content but there are images, show them
    else if (middleImages?.length > 0) {
      for (
        let imageIndex = 0;
        imageIndex < middleImages.length;
        imageIndex += 2
      ) {
        result.push(renderImagePair(middleImages, imageIndex));
      }
    }

    return result.join("");
  };

  // Helper function to render a pair of images
  const renderImagePair = (images, index) => {
    const img1 = images[index];
    const img2 = images[index + 1];

    return `
      <div class="flex flex-col md:flex-row gap-3 justify-center my-6">
      <img src="${import.meta.env.VITE_OPEN_APIURL}${img1.filePath}" 
           class="rounded-sm w-full md:w-[calc(50%-0.375rem)] h-[210px] object-cover" 
           alt="blog image" />
      ${
        img2
          ? `<img src="${import.meta.env.VITE_OPEN_APIURL}${img2.filePath}" 
                   class="rounded-sm w-full md:w-[calc(50%-0.375rem)] h-[210px] object-cover" 
                   alt="blog image" />`
          : ""
      }
    </div>
  `;
  };

  return (
    <div
      className="blog-content"
      dangerouslySetInnerHTML={{ __html: renderContentWithImages() }}
    />
  );
};

export default BlogContentWithImages;
