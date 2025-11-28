import React, { useRef, useState } from "react";

interface Props {
  value?: string | null;
  name?: string | null;
  onChange?: (file: File | null) => void;
}

export const AvatarUploader: React.FC<Props> = ({
  value,
  name = null,
  onChange,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string | null>(value || null);

  const onFile = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    onChange?.(file);
  };

  const getInitials = (n?: string | null) => {
    if (!n) return null;
    const parts = n.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (
      parts[0].charAt(0) + parts[parts.length - 1].charAt(0)
    ).toUpperCase();
  };

  const initials = getInitials(name);

  return (
    <div className="flex items-center gap-4">
      <div className="h-24 w-24 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
        {preview ? (
          <img
            src={preview}
            alt="avatar preview"
            className="h-full w-full object-cover"
          />
        ) : initials ? (
          <div className="h-24 w-24 rounded-full bg-indigo-600 text-white flex items-center justify-center text-2xl font-medium">
            {initials}
          </div>
        ) : (
          <svg
            className="h-12 w-12 text-gray-400"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M21 21c0-4.418-3.582-8-8-8H11c-4.418 0-8 3.582-8 8"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
      <div className="flex flex-col">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => onFile(e.target.files?.[0])}
        />
        <button
          className="px-3 py-1 bg-indigo-600 text-white rounded"
          onClick={() => inputRef.current?.click()}
        >
          Upload
        </button>
        <button
          className="px-3 py-1 mt-2 border rounded"
          onClick={() => {
            setPreview(null);
            onChange?.(null);
          }}
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default AvatarUploader;
