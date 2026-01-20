import { useEffect, useState, useRef } from 'react';

type ArcGalleryHeroProps = {
  images: string[];
  startAngle?: number;
  endAngle?: number;
  radiusLg?: number;
  radiusMd?: number;
  radiusSm?: number;
  cardSizeLg?: number;
  cardSizeMd?: number;
  cardSizeSm?: number;
  className?: string;
};

const ArcGalleryHero = ({
  images,
  startAngle = -110,
  endAngle = 110,
  radiusLg = 340,
  radiusMd = 280,
  radiusSm = 200,
  cardSizeLg = 120,
  cardSizeMd = 100,
  cardSizeSm = 80,
  className = '',
}: ArcGalleryHeroProps) => {
  const [dimensions, setDimensions] = useState({
    radius: radiusLg,
    cardSize: cardSizeLg,
  });
  const [rotation, setRotation] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setDimensions({ radius: radiusSm, cardSize: cardSizeSm });
      } else if (width < 1024) {
        setDimensions({ radius: radiusMd, cardSize: cardSizeMd });
      } else {
        setDimensions({ radius: radiusLg, cardSize: cardSizeLg });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [radiusLg, radiusMd, radiusSm, cardSizeLg, cardSizeMd, cardSizeSm]);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setRotation(prev => prev + e.deltaY * 0.1);
  };

  const count = Math.max(images.length, 2);
  const step = (endAngle - startAngle) / (count - 1);

  return (
    <section className={`relative overflow-hidden bg-background min-h-screen flex flex-col ${className}`}>
      <div
        ref={galleryRef}
        className="relative mx-auto cursor-grab active:cursor-grabbing"
        style={{
          width: '100%',
          height: dimensions.radius * 1.2,
        }}
        onWheel={handleWheel}
      >
        <div className="absolute left-1/2 bottom-0 -translate-x-1/2">
          {images.map((src, i) => {
            const angle = startAngle + step * i + rotation * 0.2;
            const angleRad = (angle * Math.PI) / 180;
            const x = Math.cos(angleRad) * dimensions.radius;
            const y = Math.sin(angleRad) * dimensions.radius;
            const isHovered = hoveredIndex === i;

            return (
              <div
                key={i}
                className="absolute opacity-0 animate-fade-in-up"
                style={{
                  width: dimensions.cardSize,
                  height: dimensions.cardSize,
                  left: `calc(50% + ${x}px)`,
                  bottom: `${y}px`,
                  transform: `translate(-50%, 50%)`,
                  animationDelay: `${i * 100}ms`,
                  animationFillMode: 'forwards',
                  zIndex: isHovered ? count + 10 : count - i,
                  transition: 'z-index 0.3s, filter 0.3s',
                }}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div
                  className="relative rounded-2xl shadow-xl overflow-hidden ring-1 ring-border bg-card w-full h-full"
                  style={{ 
                    transform: `rotate(${angle / 4}deg) ${isHovered ? 'scale(1.15)' : 'scale(1)'}`,
                    transition: 'transform 0.3s ease-out',
                  }}
                >
                  {isHovered && (
                    <>
                      <div 
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          boxShadow: '0 0 30px 8px rgba(139, 92, 246, 0.6), 0 0 60px 15px rgba(139, 92, 246, 0.4)',
                          borderRadius: '1rem',
                          animation: 'pulse 2s ease-in-out infinite',
                        }}
                      />
                      <div 
                        className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl"
                      >
                        <div 
                          className="absolute -top-1/4 left-1/2 -translate-x-1/2 w-3/4 h-1/2 opacity-60"
                          style={{
                            background: 'radial-gradient(ellipse, rgba(200, 200, 255, 0.6) 0%, transparent 60%)',
                            filter: 'blur(20px)',
                            animation: 'smoke 4s ease-in-out infinite',
                          }}
                        />
                      </div>
                    </>
                  )}
                  <img
                    src={src}
                    alt=""
                    className="block w-full h-full object-cover"
                    draggable={false}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="relative z-10 flex-1 flex items-center justify-center px-6 pb-20">
        <div className="text-center max-w-2xl px-6 opacity-0 animate-fade-in" style={{ animationDelay: '800ms', animationFillMode: 'forwards' }}>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground drop-shadow-lg">
            От идеи до Reels за 5 минут
          </h1>
          <p className="mt-4 text-lg text-muted-foreground drop-shadow-md">
            Создавайте профессиональный видео-контент с AI-аватарами для TikTok, Reels и YouTube Shorts
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="w-full sm:w-auto px-6 py-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
              Попробовать бесплатно
            </button>
            <button className="w-full sm:w-auto px-6 py-3 rounded-full border border-border hover:bg-accent hover:text-accent-foreground transition-all duration-200">
              Посмотреть примеры
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes smoke {
          0%, 100% { 
            transform: translateY(0) scale(1);
            opacity: 0.6;
          }
          50% { 
            transform: translateY(-20px) scale(1.1);
            opacity: 0.3;
          }
        }
      `}</style>
    </section>
  );
};

export default ArcGalleryHero;
