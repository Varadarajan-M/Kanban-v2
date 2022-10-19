import React from 'react';

const Modal = ({
  open,
  onBackdropClick,
  title,
  children,
  onPrimaryClick,
  onSecondaryClick,
  primaryButton,
  secondaryButton,
}) => {
  const className = `modal modal-sm ${open ? 'active' : ''}`;
  return (
    <div className={className}>
      <span
        className='modal-overlay'
        aria-label='Close'
        onClick={onBackdropClick}
      />
      <div className='modal-container'>
        <div className='modal-header'>
          <span
            className='btn btn-clear text-light mt-2 float-right'
            aria-label='Close'
            onClick={onBackdropClick}
          />
          <div className='modal-title h4 text-light'>{title}</div>
        </div>
        <div className='modal-body' style={{ marginTop: '-18px' }}>
          <div className='content'>{children}</div>
        </div>
        <div
          className='modal-footer d-flex mt-2'
          style={{ justifyContent: 'flex-end', gap: '10px' }}
        >
          <button className='btn primaryBtn' onClick={onPrimaryClick}>
            {primaryButton}
          </button>
          <button className='btn secondaryBtn' onClick={onSecondaryClick}>
            {secondaryButton}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
