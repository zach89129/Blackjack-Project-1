import Image from "next/image";

interface CardProps {
  image?: string;
  faceDown?: boolean;
  alt?: string;
}

export function Card({ image, faceDown = false, alt = "Playing card" }: CardProps) {
  if (faceDown || !image) {
    return (
      <div
        className="flex h-28 w-20 shrink-0 items-center justify-center rounded-lg border-2 border-white/20 bg-gradient-to-br from-casino-red to-red-900 shadow-card sm:h-36 sm:w-28"
        aria-label="Face-down card"
      >
        <div className="h-16 w-12 rounded border border-gold/30 bg-gradient-to-br from-gold/20 to-gold/5 sm:h-20 sm:w-16" />
      </div>
    );
  }

  return (
    <Image
      src={image}
      alt={alt}
      width={140}
      height={196}
      unoptimized
      className="h-28 w-auto shrink-0 rounded-lg shadow-card transition-transform duration-300 hover:-translate-y-1 sm:h-36"
      draggable={false}
    />
  );
}
