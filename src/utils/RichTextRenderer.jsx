const RichTextRenderer = ({ html }) => {
  if (!html) return null;

  return (
    <div
      className="prose prose-sm sm:prose-base max-w-none text-black bg-white p-4 rounded shadow [&_ul]:pl-5 [&_ul]:list-disc [&_strong]:text-black [&_b]:text-black"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default RichTextRenderer;
