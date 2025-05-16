import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";

const DropzoneImageItem = ({ img, idx, onDrop, onToggle }) => {
  const [preview, setPreview] = useState("");
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);
        onDrop([file]); // Pass file to parent
      }
    },
    accept: {
      "image/*": [],
    },
    multiple: false,
  });
  // const { getRootProps, getInputProps } = useDropzone({
  //   onDrop,
  //   accept: {
  //     "image/*": [],
  //   },
  //   multiple: false,
  // });

  // Cleanup blob URL
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  // Determine which image to show
  const imageSrc = preview
    ? preview
    : img.previewUrl
    ? import.meta.env.VITE_OPEN_APIURL + img.previewUrl
    : null;

  return (
    <div className="border p-3 rounded-md shadow-sm space-y-2">
      <div
        {...getRootProps()}
        className="cursor-pointer border p-2 rounded-md bg-gray-100 text-center"
      >
        <input {...getInputProps()} />
        {imageSrc ? (
          <img
            src={imageSrc}
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
