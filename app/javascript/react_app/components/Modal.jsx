import React from "react";
import { createPortal } from "react-dom";

const Modal = ({ show, children, onClose }) => {
  const { current: modalRoot } = React.useRef(document.getElementById("modal-root"));
  const { current: el } = React.useRef(document.createElement("div"));

  React.useEffect(() => {
    modalRoot.appendChild(el);

    return () => {
      modalRoot.removeChild(el);
    };
  }, []);

  return createPortal(
    <div className={show ? undefined : "hidden"}>
      <div className="fixed inset-0 min-h-screen flex justify-center items-center z-20">
        <div className="relative p-5 rounded-lg bg-white sm:my-8 sm:align-middle sm:max-w-lg sm:w-full z-20">
          <a
            className="absolute top-2 right-2"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onClose(e);
            }}
          >
            x
          </a>
          <div>{children}</div>
        </div>
      </div>

      <div className="fixed inset-0 opacity-20 bg-black z-10"></div>
    </div>,
    el,
  );
};

export default Modal;
