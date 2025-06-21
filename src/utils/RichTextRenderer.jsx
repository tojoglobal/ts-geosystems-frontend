const RichTextRenderer = ({ html }) => {
  if (!html) return null;

  return (
    <div
      className="text-black sm:prose-base prose-gray max-w-none [&_ul]:pl-5 [&_ul]:list-disc"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
export default RichTextRenderer;
