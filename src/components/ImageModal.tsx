import { MdClose } from "react-icons/md";

interface ModalProps {
  onClose: () => void;
  children: React.ReactNode
}

export const Modal: React.FC<ModalProps> = ({ onClose, children }) => {
  return (
    <div className="fixed hei inset-0 flex items-center justify-center bg-teal-600 bg-opacity-50 blur-2 ">
      <div className=" relative bg-white px-8 py-10 rounded-lg shadow-lg max-w-4xl max-h-[70vh] w-[60%] h-full flex flex-col items-center">
        <div
          className="absolute top-3 right-4 cursor-pointer"
          onClick={onClose}
        >
          <MdClose />
        </div>

        {children}
      </div>
    </div>
  );
};
