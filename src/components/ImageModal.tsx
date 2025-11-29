import { MdClose } from "react-icons/md";

interface ModalProps {
  onClose: () => void;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ onClose, children }) => {
  console.log("modal");
  return (
    <div className="fixed inset-0 flex backdrop-blur-xs bg-black/40 items-center justify-center">
      <div className=" relative bg-white px-12 py-12 rounded-lg shadow-lg max-w-4xl max-h-[70vh] w-fit h-fit flex flex-col items-center">
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
