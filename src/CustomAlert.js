import React, { useState, useImperativeHandle, forwardRef } from 'react';

const CustomAlert = forwardRef((props, ref) => {
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState('success'); // default type

  useImperativeHandle(ref, () => ({
    triggerAlert(msg, alertType = 'success') {
      setMessage(msg);
      setType(alertType);
      setShow(true);
      setTimeout(() => setShow(false), 3000); // auto-hide
    }
  }));

  return (
    <div
      className="position-fixed top-0 start-50 translate-middle-x mt-5  transition-opacity"
      style={{
         zIndex: 9999, 
        opacity: show ? 1 : 0,
        transition: 'opacity 0.5s ease-in-out',
        minWidth: '300px',
        maxWidth: '500px',
        pointerEvents: show ? 'auto' : 'none',
       
      }}
    >
      <div
        className={`border shadow bg-white fw-semibold px-4 py-3 mb-0 text-center ${
          type === 'success' ? 'text-success ' : 'text-danger'
        }`}
        role="alert"
        style={{ fontSize: '0.9rem' ,borderRadius:"15px" }}
      >
        {message}
      </div>
    </div>
  );
});

export default CustomAlert;
