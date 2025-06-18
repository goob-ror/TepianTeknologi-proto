import { useState, useEffect } from 'react';

export default function Header() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = [
    '/images/Header-Main.png',
    '/images/Header-Main-2.png'
  ];

  // Auto advance carousel every 20 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 20000);

    return () => clearInterval(interval);
  }, [images.length]);

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <header style={{ backgroundColor: 'var(--secondary-color)', width: '100%' }}>
      <div
        className="header-content"
        style={{
          display: 'grid',
          gridTemplateColumns: '820px 1fr',
          gridTemplateRows: 'repeat(2, 1fr)',
          gridTemplateAreas: '"mh sh1" "mh sh2"',
          gap: '20px',
          justifyContent: 'center',
          alignContent: 'center',
          padding: '20px 0',
          margin: '0 auto',
          maxWidth: '1200px'
        }}
      >
        <div
          className="main-header"
          style={{
            gridArea: 'mh',
            width: '810px',
            height: '322px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
            borderRadius: '10px',
            position: 'relative'
          }}
        >
          <div
            className="carousel-container"
            style={{
              width: '100%',
              height: '100%',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div
              className="carousel-images"
              style={{
                display: 'flex',
                width: '300%',
                height: '100%',
                transition: 'transform 0.5s ease-in-out',
                transform: `translateX(-${currentIndex * (100 / 3)}%)`
              }}
            >
              {images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Main Header ${index + 1}`}
                  style={{
                    width: 'calc(100% / 3)',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'left'
                  }}
                />
              ))}
            </div>
            <div
              className="carousel-dots"
              style={{
                position: 'absolute',
                bottom: '10px',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: '8px'
              }}
            >
              {images.map((_, index) => (
                <span
                  key={index}
                  className={`dot ${index === currentIndex ? 'active' : ''}`}
                  style={{
                    width: '10px',
                    height: '10px',
                    backgroundColor: index === currentIndex ? '#7D7D7D' : '#D9D9D9',
                    borderRadius: '50%',
                    cursor: 'pointer'
                  }}
                  onClick={() => handleDotClick(index)}
                />
              ))}
            </div>
          </div>
        </div>

        <div
          className="side-header-top"
          style={{
            gridArea: 'sh1',
            width: '357.28px',
            height: '150px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
            borderRadius: '10px'
          }}
        >
          <img
            src="/images/Header-Blue.png"
            alt="Side Header Top"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'left'
            }}
          />
        </div>

        <div
          className="side-header-bottom"
          style={{
            gridArea: 'sh2',
            width: '357.28px',
            height: '150px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
            borderRadius: '10px'
          }}
        >
          <img
            src="/images/Header-Red.png"
            alt="Side Header Bottom"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'left'
            }}
          />
        </div>
      </div>
    </header>
  );
}
