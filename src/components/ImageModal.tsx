import { MdClose } from "react-icons/md";

interface ModalProps {
  imageUrl: string | null;
  onClose: () => void;
}

export const Modal: React.FC<ModalProps> = ({ imageUrl, onClose }) => {
  if (!imageUrl) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className=" relative bg-white p-4 rounded-lg shadow-lg max-w-2xl max-h-[70vh] w-[60%] h-auto flex flex-col items-center">
        <div
          className="absolute top-3 right-4 cursor-pointer"
          onClick={onClose}
        >
          <MdClose />
        </div>

        <img
          src={imageUrl}
          alt="Product"
          className="max-w-full max-h-[60vh] object-contain rounded-lg"
        />
      </div>
    </div>
  );
};
