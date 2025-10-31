import React, { useState, useEffect } from 'react';
import './ImagePreview.scss';

const ImagePreview = ({ images = [], thumbClassName = 'img-placeholder' }) => {
  const [open, setOpen] = useState(false);
  const [src, setSrc] = useState(null);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && open) setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const openModal = (s) => {
    setSrc(s);
    setOpen(true);
  };

  const close = () => {
    setOpen(false);
    setSrc(null);
  };

  return (
    <>
      <div className="image-preview-grid">
        {images && images.length ? (
          images.map((s, i) => (
            <div key={i} className={thumbClassName}>
              <img
                src={s}
                alt={`image-${i}`}
                onClick={() => openModal(s)}
                style={{ cursor: 'pointer', maxWidth: '100%', maxHeight: '100%' }}
              />
            </div>
          ))
        ) : (
          <>
            <div className={`${thumbClassName} empty`} />
            <div className={`${thumbClassName} empty`} />
            <div className={`${thumbClassName} empty`} />
          </>
        )}
      </div>

      {open && src && (
        <div className="ip-overlay" onClick={close} role="dialog" aria-modal="true">
          <div className="ip-content" onClick={(e) => e.stopPropagation()}>
            <img src={src} alt="preview" className="ip-image" />
            <button className="ip-close" onClick={close} aria-label="Close preview">Close</button>
          </div>
        </div>
      )}
    </>
  );
};

export default ImagePreview;
