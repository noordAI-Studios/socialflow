import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, CirclePlay, Volume2, VolumeX } from 'lucide-react';
import { isVideo } from '../utils/helpers';

export const MediaCarousel = ({ images, alt, fullHeight = false }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [muted, setMuted] = useState(true); // état global pour la vidéo actuelle
  const [isPlaying, setIsPlaying] = useState(true); // play/pause overlay
  const videoRef = useRef(null);

  if (!images || images.length === 0) return null;

  const goToNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setIsPlaying(true);
    setMuted(true);
  };

  const goToPrevious = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setIsPlaying(true);
    setMuted(true);
  };

  const goToSlide = (index, e) => {
    e.stopPropagation();
    setCurrentIndex(index);
    setIsPlaying(true);
    setMuted(true);
  };

  const currentMedia = images[currentIndex];
  const mediaUrl = typeof currentMedia === 'object'
    ? (currentMedia.imageData || currentMedia.imageUrl)
    : currentMedia;

  const isCurrentVideo = typeof currentMedia === 'object'
    ? currentMedia.mediaType === 'video' || isVideo(mediaUrl)
    : isVideo(mediaUrl);

  const containerClass = fullHeight
    ? 'w-full h-full bg-gray-700 relative group'
    : 'aspect-video bg-gray-700 overflow-hidden relative group';

  // toggle play/pause
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  // toggle mute/unmute
  const toggleMute = (e) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setMuted(videoRef.current.muted);
  };

  return (
    <div className={containerClass}>
      {isCurrentVideo ? (
        <div className="relative w-full h-full">
          <video
            ref={videoRef}
            src={mediaUrl}
            className="w-full h-full object-cover"
            autoPlay
            loop
            muted={muted}
            playsInline
            onClick={(e) => {
              e.stopPropagation();
              togglePlay();
            }}
          />

          {/* Bouton volume */}
          <button
            onClick={toggleMute}
            className="
              absolute bottom-3 right-3
              bg-black/50 hover:bg-black/70
              backdrop-blur-sm
              text-white rounded-full
              w-9 h-9 flex items-center justify-center
              opacity-0 group-hover:opacity-100
              transition-opacity duration-200
              z-10
            "
          >
            {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
        </div>
      ) : (
        <img
          src={mediaUrl}
          alt={`${alt} - Image ${currentIndex + 1}`}
          className="w-full h-full object-cover"
          onError={(e) => { e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"/>'; }}
        />
      )}

      {/* Flèches / indicateurs */}
      {images.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
          >
            <ChevronRight size={20} />
          </button>

          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => goToSlide(index, e)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? 'bg-white w-6'
                    : 'bg-white/50 hover:bg-white/75'
                }`}
              />
            ))}
          </div>

          <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs z-10">
            {currentIndex + 1} / {images.length}
          </div>
        </>
      )}
    </div>
  );
};
