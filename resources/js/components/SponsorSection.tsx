

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

  return (
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
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 40px',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {sponsors.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="sponsor-row"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%'
            }}
          >
            {row.map((sponsor, index) => (
              <div
                key={index}
                className="sponsor-item"
                style={{
                  width: '200px',
                  height: '200px',
                  padding: '25px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'var(--color-white)',
                  transition: 'all 0.3s ease'
                }}
              >
                <img
                  src={sponsor.image}
                  alt={sponsor.name}
                  style={{
                    width: '200px',
                    height: '100px',
                    objectFit: 'contain',
                    display: 'block',
                    margin: '0 auto',
                    filter: 'grayscale(100%)',
                    transition: 'filter 0.3s ease'
                  }}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
