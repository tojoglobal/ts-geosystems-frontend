import React from "react";
import PropTypes from "prop-types";

const RichTextRenderer = ({ html }) => {
  if (!html) return null;

  return (
    <div
      className="prose prose-sm sm:prose-base prose-gray max-w-none [&_ul]:pl-5 [&_ul]:list-disc"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

RichTextRenderer.propTypes = {
  html: PropTypes.string.isRequired,
};

export default RichTextRenderer;
