import { useDropzone } from "react-dropzone";

const DropzoneImageItem = ({ img, idx, onDrop, onToggle }) => {
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
    },
    multiple: false,
  });

  return (
    <div className="border p-3 rounded-md shadow-sm space-y-2">
      <div
        {...getRootProps()}
        className="cursor-pointer border p-2 rounded-md bg-gray-100 text-center"
      >
        <input {...getInputProps()} />
        {img.previewUrl ? (
          <img
            src={img.previewUrl}
            alt={`Preview ${idx}`}
            className="h-40 mx-auto object-contain"
          />
        ) : (
          <p className="text-gray-500">
            Drag & drop an image or click to select
          </p>
        )}
      </div>
      <div className="flex items-center justify-between text-sm">
        <p>
          Section:{" "}
          <span className="text-teal-400">
            {img?.section
              .replace(/_/g, " ")
              .replace(/\b\w/g, (char) => char.toUpperCase())}
          </span>
        </p>
        <button
          type="button"
          onClick={onToggle}
          className={`px-3 py-1 rounded-md text-white ${
            img.show ? "bg-green-600" : "bg-gray-500"
          }`}
        >
          {img.show ? "Visible" : "Hidden"}
        </button>
      </div>
    </div>
  );
};

export default DropzoneImageItem;
