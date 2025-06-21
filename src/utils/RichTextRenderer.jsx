import DOMPurify from "dompurify";

const RichTextRenderer = ({ html }) => {
  if (!html) return null;

  // Sanitize the HTML first
  const cleanHtml = DOMPurify.sanitize(html);

  return (
    <div className="rich-text-container">
      <style>{`
        .rich-text-container {
          color: #333;
          font-family: inherit;
          line-height: 1.6;
          font-size: 16px;
        }
        .rich-text-container h1 {
          font-size: 2em;
          font-weight: bold;
          margin: 0 0 0.5em 0;
          color: #111;
          border-bottom: 1px solid #eee;
          padding-bottom: 0.3em;
        }
        .rich-text-container h2 {
          font-size: 1.75em;
          font-weight: bold;
          margin: 0.9em 0 0.45em 0;
          color: #111;
        }
        .rich-text-container h3 {
          font-size: 1.5em;
          font-weight: bold;
          margin: 0.8em 0 0.4em 0;
          color: #111;
        }
        .rich-text-container h4 {
          font-size: 1.25em;
          font-weight: bold;
          margin: 0.7em 0 0.35em 0;
          color: #111;
        }
        .rich-text-container p {
          margin: 0.75em 0;
          color: #333;
        }
        .rich-text-container ul {
          margin: 0.75em 0;
          padding-left: 1em;
          list-style-type: none;
        }
        .rich-text-container ol {
          margin: 0.75em 0;
          padding-left: 1.5em;
        }
        .rich-text-container li {
          margin: 0.5em 0;
          position: relative;
          padding-left: 1.2em;
        }
        .rich-text-container ul li::before {
          content: "•";
          color: #333;
          font-weight: bold;
          display: inline-block;
          padding-left: 1.2em;
          width: 1em;
          margin-left: -1.25em;
          position: absolute;
          left: 0;
        }
        .rich-text-container a {
          color: #2563eb;
          text-decoration: underline;
        }
        .rich-text-container a:hover {
          color: #1d4ed8;
        }
        .rich-text-container strong,
        .rich-text-container b {
          font-weight: bold;
          color: inherit;
        }
        .rich-text-container em,
        .rich-text-container i {
          font-style: italic;
          color: inherit;
        }
      `}</style>
      <div dangerouslySetInnerHTML={{ __html: cleanHtml }} />
    </div>
  );
};

export default RichTextRenderer;
