const BlogContentWithImages = ({ blog, middleImages }) => {
  const splitContentIntoChunks = (text, images) => {
    let result = [];
    let remainingText = text;
    let imageIndex = 0;

    // First split by paragraphs
    const paragraphs = remainingText
      .split("\n\n")
      .filter((p) => p.trim().length > 0);

    for (const paragraph of paragraphs) {
      let words = paragraph.split(/\s+/);
      let currentChunk = [];
      let wordCount = 0;

      for (let i = 0; i < words.length; i++) {
        currentChunk.push(words[i]);
        wordCount++;

        // Check if we've reached ~90 words and at a sentence end
        if (wordCount >= 90 && words[i].endsWith(".")) {
          // Add the current chunk
          result.push(`<p class="mb-6">${currentChunk.join(" ")}</p>`);

          // Add image pair if available
          if (imageIndex < images.length) {
            result.push(renderImagePair(images, imageIndex));
            imageIndex += 2;
          }

          // Reset for next chunk
          currentChunk = [];
          wordCount = 0;
        }
      }

      // Add any remaining words in the paragraph
      if (currentChunk.length > 0) {
        result.push(`<p class="mb-6">${currentChunk.join(" ")}</p>`);
      }
    }

    // Add any remaining images at the end
    while (imageIndex < images.length) {
      result.push(renderImagePair(images, imageIndex));
      imageIndex += 2;
    }

    return result.join("");
  };

  const renderContentWithImages = () => {
    if (!blog?.content) {
      // If no content but images exist, show just the images
      if (middleImages?.length > 0) {
        let result = [];
        for (let i = 0; i < middleImages.length; i += 2) {
          result.push(renderImagePair(middleImages, i));
        }
        return result.join("");
      }
      return "";
    }

    // Process content with natural breaks
    return splitContentIntoChunks(blog.content, middleImages);
  };

  const renderImagePair = (images, index) => {
    const img1 = images[index];
    const img2 = images[index + 1];

    return `
      <div class="flex flex-col md:flex-row gap-3 justify-center my-8">
        ${
          img1
            ? `<img 
                src="${import.meta.env.VITE_OPEN_APIURL}${img1.filePath}" 
                alt="Blog content image ${index + 1}" 
                class="rounded-sm w-full md:w-[calc(50%-0.375rem)] h-[210px] object-cover" 
              />`
            : ""
        }
        ${
          img2
            ? `<img 
                src="${import.meta.env.VITE_OPEN_APIURL}${img2.filePath}" 
                alt="Blog content image ${index + 2}" 
                class="rounded-sm w-full md:w-[calc(50%-0.375rem)] h-[210px] object-cover" 
              />`
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
