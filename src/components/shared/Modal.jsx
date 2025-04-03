import React from 'react'

const Modal = ({ children }) => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg max-w-md w-full">
          {children}
        </div>
      </div>
    );
  };
  
  
export default Modal