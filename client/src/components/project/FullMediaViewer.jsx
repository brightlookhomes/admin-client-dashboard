import React, { useState, useEffect } from "react";

export default function FullMediaViewer({ media, onClose }) {
  // Backwards compatibility: Wrap in array if simple url object is passed
  const isGallery = Boolean(media.items);
  const items = isGallery ? media.items : [media];
  
  const [currentIndex, setCurrentIndex] = useState(isGallery && media.startIndex !== undefined ? media.startIndex : 0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const prevMedia = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const nextMedia = () => {
    setCurrentIndex((prev) => (prev < items.length - 1 ? prev + 1 : prev));
  };

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "ArrowLeft") prevMedia();
      if (e.key === "ArrowRight") nextMedia();
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [items.length]);

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    if (isLeftSwipe) {
      nextMedia();
    }
    if (isRightSwipe) {
      prevMedia();
    }
  };

  const current = items[currentIndex];

  const handleDownload = async (e) => {
    e.stopPropagation();
    try {
      const response = await fetch(current.url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const ext = current.url.split('.').pop() || (current.type === "video" ? "mp4" : "jpg");
      const cleanProj = (current.projectName || "Brightlook").replace(/[^a-z0-9]/gi, '_');
      const cleanTitle = (current.title || "Update").replace(/[^a-z0-9]/gi, '_');
      const dateStr = current.date ? new Date(current.date).toLocaleDateString('en-GB').replace(/\//g, '-') : "";
      const finalName = `${cleanProj}_${cleanTitle}_${dateStr}.${ext}`;

      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = finalName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      // Fallback if CORS blocks blob fetch
      const a = document.createElement("a");
      a.href = current.url;
      a.target = "_blank";
      a.download = "download";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <div 
      className="mediaViewerOverlay" 
      onClick={onClose}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div className="mediaViewerTopBar" onClick={(e) => e.stopPropagation()}>
        <div className="mediaViewerIndex">
          {items.length > 1 ? `${currentIndex + 1} / ${items.length}` : ""}
        </div>
        <div className="mediaViewerActions">
          <button className="mediaViewerActionBtn" onClick={handleDownload} title="Download">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
               <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
               <polyline points="7 10 12 15 17 10"></polyline>
               <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
          </button>
          <button className="mediaViewerActionBtn" onClick={onClose} title="Close">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>

      {currentIndex > 0 && (
        <button className="mediaViewerNavBtn prev" onClick={(e) => { e.stopPropagation(); prevMedia(); }}>
          ❮
        </button>
      )}

      <div className="mediaViewerContent" onClick={(e) => e.stopPropagation()}>
        {current.type === "video" ? (
          <video src={current.url} controls autoPlay className="fullMedia" />
        ) : (
          <img src={current.url} alt="Full size" className="fullMedia" />
        )}
      </div>

      {currentIndex < items.length - 1 && (
        <button className="mediaViewerNavBtn next" onClick={(e) => { e.stopPropagation(); nextMedia(); }}>
          ❯
        </button>
      )}
    </div>
  );
}
