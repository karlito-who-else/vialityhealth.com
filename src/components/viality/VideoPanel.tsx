"use client";

export function VideoPanel({ src, type }: { src: string; type?: string | null }) {
  const isVideo = type?.startsWith("video/");
  return (
    <div className="relative flex-1 overflow-hidden" data-component="VideoPanel">
      {isVideo ? (
        <video
          src={src}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <img
          src={src}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 100% 100% at 50% 50%, transparent 45%, var(--color-video-overlay) 100%)",
        }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-2/5 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, var(--color-video-overlay-strong) 0%, transparent 100%)",
        }}
      />
    </div>
  );
}
