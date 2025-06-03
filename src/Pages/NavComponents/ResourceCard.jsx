import PropTypes from "prop-types";

const ResourceCard = ({
  imageUrl,
  title,
  onDownload,
  downloadLabel = "DOWNLOAD",
  className = "",
}) => (
  <div className={`flex flex-col h-full ${className}`}>
    <div className="flex flex-col flex-grow items-center p-4">
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-40 object-contain mb-4"
      />
      <div className="border-b w-full mb-2"></div>
      <h3 className="text-center capitalize text-sm mb-2 flex-grow">{title}</h3>
    </div>
    <a
      onClick={onDownload}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-[#e62245] cursor-pointer hover:bg-[#d41d3f] text-white text-sm font-semibold py-1 w-full text-center rounded block transition-colors"
    >
      {downloadLabel}
    </a>
  </div>
);

ResourceCard.propTypes = {
  imageUrl: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  onDownload: PropTypes.func.isRequired,
  downloadLabel: PropTypes.string,
  className: PropTypes.string,
};

export default ResourceCard;
