
export default function SponsorSection() {
  const sponsors = [
    [
      { name: 'Ruijie', image: '/sponsors/ruijie.webp' },
      { name: 'Ruijie Reyee', image: '/sponsors/ruijie-reyee.webp' },
      { name: 'TP-Link', image: '/sponsors/tp-link.webp' },
      { name: 'Starlink', image: '/sponsors/starlink.webp' },
      { name: 'Mikrotik', image: '/sponsors/mikrotik.webp' },
    ],
    [
      { name: 'Lintasmaya', image: '/sponsors/lintasmaya.webp' },
      { name: 'Hikvision', image: '/sponsors/hikvision.webp' },
      { name: 'Citraweb', image: '/sponsors/citraweb.webp' },
      { name: 'CData', image: '/sponsors/cdata.webp' },
      { name: 'Ubiquiti', image: '/sponsors/ubiquiti.webp' },
    ],
  ];

  // Duplicate sponsors for seamless infinite loop
  const duplicatedSponsors = sponsors.map(row => [...row, ...row, ...row]);

  return (
    <>
      <style>{`
        @keyframes slideLeft {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }

        @keyframes slideRight {
          0% {
            transform: translateX(-33.333%);
          }
          100% {
            transform: translateX(0);
          }
        }

        .sponsor-track {
          display: flex;
          animation-duration: 20s;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          width: fit-content;
        }

        .sponsor-track-left {
          animation-name: slideLeft;
        }

        .sponsor-track-right {
          animation-name: slideRight;
        }

        .sponsor-item {
          position: relative;
          width: 200px;
          height: 200px;
          padding: 25px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--color-white);
          transition: all 0.3s ease;
          flex-shrink: 0;
          margin-right: 20px;
        }

        .sponsor-item:hover {
          transform: translateY(-5px);
        }

        .sponsor-item img {
          width: 200px;
          height: 100px;
          object-fit: contain;
          display: block;
          margin: 0 auto;
          transition: filter 0.3s ease;
          filter: grayscale(100%);
        }

        .sponsor-item:hover img {
          filter: none;
        }

        .sponsor-row-container {
          overflow: hidden;
          width: 100%;
          margin-bottom: 20px;
        }

        .sponsor-row-container:last-child {
          margin-bottom: 0;
        }
      `}</style>
      <section
        className="sponsor"
        style={{
          width: '100%',
          padding: '60px 0',
          backgroundColor: 'var(--secondary-color)',
          fontFamily: 'var(--main-font)'
        }}
      >
        <div
          className="sponsor-container"
          style={{
            maxWidth: '100%',
            margin: '0 auto',
            padding: '0 40px',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {duplicatedSponsors.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className="sponsor-row-container"
            >
              <div
                className={`sponsor-track ${rowIndex === 0 ? 'sponsor-track-left' : 'sponsor-track-right'}`}
              >
                {row.map((sponsor, index) => (
                  <div
                    key={`${sponsor.name}-${index}`}
                    className="sponsor-item"
                  >
                    <img
                      src={sponsor.image}
                      alt={sponsor.name}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
