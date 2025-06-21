import React from "react";
import DOMPurify from "dompurify";

const RichTextRenderer = ({ html, isTableCell = false }) => {
  if (!html) return null;

  // Sanitize the HTML first
  const cleanHtml = DOMPurify.sanitize(html);

  // Base styles that apply everywhere
  const baseStyles = `
    .rich-text-content {
      color: #333;
      font-family: inherit;
      line-height: 1.6;
      font-size: 16px;
      padding-left: 0.5em;
    }
    .rich-text-content h1 {
      font-size: ${isTableCell ? "1.5em" : "2em"};
      font-weight: bold;
      margin: 0 0 0.5em 0;
      color: #111;
      ${
        !isTableCell
          ? "border-bottom: 1px solid #eee; padding-bottom: 0.3em;"
          : ""
      }
    }
    .rich-text-content h2 {
      font-size: ${isTableCell ? "1.3em" : "1.75em"};
      font-weight: bold;
      margin: 0.9em 0 0.45em 0;
      color: #111;
    }
    .rich-text-content h3 {
      font-size: ${isTableCell ? "1.1em" : "1.5em"};
      font-weight: bold;
      margin: 0.8em 0 0.4em 0;
      color: #111;
    }
    .rich-text-content h4 {
      font-size: 1.25em;
      font-weight: bold;
      margin: 0.7em 0 0.35em 0;
      color: #111;
    }
    .rich-text-content p {
      margin: 0.75em 0;
      color: #333;
    }
    .rich-text-content ul {
      margin: 0.75em 0;
      padding-left: 1em;
      list-style-type: none;
    }
    .rich-text-content ol {
      margin: 0.75em 0;
      padding-left: 1.5em;
    }
    .rich-text-content li {
      margin: 0.5em 0;
      position: relative;
      padding-left: 1.25em;
    }
    .rich-text-content ul li::before {
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
    .rich-text-content a {
      color: #2563eb;
      text-decoration: underline;
    }
    .rich-text-content a:hover {
      color: #1d4ed8;
    }
    .rich-text-content strong,
    .rich-text-content b {
      font-weight: bold;
      color: inherit;
    }
    .rich-text-content em,
    .rich-text-content i {
      font-style: italic;
      color: inherit;
    }
    .rich-text-content table {
      width: 100%;
      border-collapse: collapse;
      margin: 1em 0;
    }
    .rich-text-content table td {
      padding: 0.5em;
      border: 1px solid #ddd;
    }
  `;

  return (
    <>
      <style>{baseStyles}</style>
      <div
        className={`rich-text-content ${
          isTableCell ? "table-cell-content" : ""
        }`}
        dangerouslySetInnerHTML={{ __html: cleanHtml }}
      />
    </>
  );
};

export default RichTextRenderer;
// const RichTextRenderer = ({ html }) => {
//   if (!html) return null;

//   return (
//     <div
//       className="prose prose-sm sm:prose-base max-w-none text-black bg-white p-4 rounded shadow [&_ul]:pl-5 [&_ul]:list-disc [&_strong]:text-black [&_b]:text-black"
//       dangerouslySetInnerHTML={{ __html: html }}
//     />
