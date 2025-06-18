
export default function Footer() {
  return (
    <footer style={{
      backgroundColor: 'var(--primary-color)',
      color: 'var(--light-text)',
      fontFamily: 'var(--main-font)',
      padding: '60px 0 20px 0'
    }}>
      <div
        className="footer-content"
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px',
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr',
          gap: '40px',
          borderBottom: '1px solid rgb(255, 255, 255)',
          paddingBottom: '40px',
          marginBottom: '20px'
        }}
      >
        <div className="content-about">
          <h1 style={{
            fontSize: '1.5rem',
            marginBottom: '15px',
            fontWeight: '600'
          }}>Tepian Teknologi</h1>
          <hr style={{
            border: 'none',
            borderTop: '1px solid rgb(255, 255, 255)',
            marginBottom: '20px',
            width: '200px'
          }} />
          <p style={{
            fontSize: '0.9rem',
            lineHeight: '1.6'
          }}>
            Adalah website yang menjual peralatan jaringan, komputer dan peralatan teknologi lainnya.
            Kami juga bekerjasama dengan beberapa brand ternama seperti ruijie, mikrotik, starlink dll,
            yang merupakan teknologi yang sangat membantu untuk era saat ini. kami juga menyediakan
            peralatan terlengkap dan terjangkau, serta memberikan yang terbaik dari segi pelayanan
            maupun garansi. Tepian Teknologi berlokasi di Samarinda, Kalimantan Timur, Indonesia.
          </p>
        </div>

        <div
          className="content-quick-links"
          style={{
            borderLeft: '1px solid rgb(255, 255, 255)',
            paddingLeft: '40px'
          }}
        >
          <h1 style={{
            fontSize: '1.5rem',
            marginBottom: '15px',
            fontWeight: '600'
          }}>Quick</h1>
          <hr style={{
            border: 'none',
            borderTop: '1px solid rgb(255, 255, 255)',
            marginBottom: '20px',
            width: '80px'
          }} />
          <ul style={{
            listStyle: 'none',
            padding: '0',
            margin: '0'
          }}>
            <li>
              <a
                href="#"
                style={{
                  color: 'var(--color-white)',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  lineHeight: '2',
                  transition: 'color 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  const target = e.target as HTMLAnchorElement;
                  target.style.color = 'var(--secondary-color)';
                  target.style.fontWeight = 'bold';
                }}
                onMouseLeave={(e) => {
                  const target = e.target as HTMLAnchorElement;
                  target.style.color = 'var(--color-white)';
                  target.style.fontWeight = 'normal';
                }}
              >
                Kontak
              </a>
            </li>
            <li>
              <a
                href="#"
                style={{
                  color: 'var(--color-white)',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  lineHeight: '2',
                  transition: 'color 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  const target = e.target as HTMLAnchorElement;
                  target.style.color = 'var(--secondary-color)';
                  target.style.fontWeight = 'bold';
                }}
                onMouseLeave={(e) => {
                  const target = e.target as HTMLAnchorElement;
                  target.style.color = 'var(--color-white)';
                  target.style.fontWeight = 'normal';
                }}
              >
                Lokasi
              </a>
            </li>
            <li>
              <a
                href="#"
                style={{
                  color: 'var(--color-white)',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  lineHeight: '2',
                  transition: 'color 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  const target = e.target as HTMLAnchorElement;
                  target.style.color = 'var(--secondary-color)';
                  target.style.fontWeight = 'bold';
                }}
                onMouseLeave={(e) => {
                  const target = e.target as HTMLAnchorElement;
                  target.style.color = 'var(--color-white)';
                  target.style.fontWeight = 'normal';
                }}
              >
                Produk
              </a>
            </li>
            <li>
              <a
                href="#"
                style={{
                  color: 'var(--color-white)',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  lineHeight: '2',
                  transition: 'color 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  const target = e.target as HTMLAnchorElement;
                  target.style.color = 'var(--secondary-color)';
                  target.style.fontWeight = 'bold';
                }}
                onMouseLeave={(e) => {
                  const target = e.target as HTMLAnchorElement;
                  target.style.color = 'var(--color-white)';
                  target.style.fontWeight = 'normal';
                }}
              >
                Sign in/Login
              </a>
            </li>
            <li>
              <a
                href="#"
                style={{
                  color: 'var(--color-white)',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  lineHeight: '2',
                  transition: 'color 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  const target = e.target as HTMLAnchorElement;
                  target.style.color = 'var(--secondary-color)';
                  target.style.fontWeight = 'bold';
                }}
                onMouseLeave={(e) => {
                  const target = e.target as HTMLAnchorElement;
                  target.style.color = 'var(--color-white)';
                  target.style.fontWeight = 'normal';
                }}
              >
                Back to Top
              </a>
            </li>
          </ul>
        </div>

        <div
          className="content-group"
          style={{
            borderLeft: '1px solid rgb(255, 255, 255)',
            paddingLeft: '40px'
          }}
        >
          <h1 style={{
            fontSize: '1.5rem',
            marginBottom: '15px',
            fontWeight: '600'
          }}>Group</h1>
          <hr style={{
            border: 'none',
            borderTop: '1px solid rgb(255, 255, 255)',
            marginBottom: '20px',
            width: '80px'
          }} />
          <ul style={{
            listStyle: 'none',
            padding: '0',
            margin: '0'
          }}>
            <li>
              <a
                href="#"
                style={{
                  color: 'var(--color-white)',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  lineHeight: '2',
                  transition: 'color 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  const target = e.target as HTMLAnchorElement;
                  target.style.color = 'var(--secondary-color)';
                  target.style.fontWeight = 'bold';
                }}
                onMouseLeave={(e) => {
                  const target = e.target as HTMLAnchorElement;
                  target.style.color = 'var(--color-white)';
                  target.style.fontWeight = 'normal';
                }}
              >
                Lintasmaya
              </a>
            </li>
            <li>
              <a
                href="#"
                style={{
                  color: 'var(--color-white)',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  lineHeight: '2',
                  transition: 'color 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  const target = e.target as HTMLAnchorElement;
                  target.style.color = 'var(--secondary-color)';
                  target.style.fontWeight = 'bold';
                }}
                onMouseLeave={(e) => {
                  const target = e.target as HTMLAnchorElement;
                  target.style.color = 'var(--color-white)';
                  target.style.fontWeight = 'normal';
                }}
              >
                Tepian Teknologi
              </a>
            </li>
            <li>
              <a
                href="#"
                style={{
                  color: 'var(--color-white)',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  lineHeight: '2',
                  transition: 'color 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  const target = e.target as HTMLAnchorElement;
                  target.style.color = 'var(--secondary-color)';
                  target.style.fontWeight = 'bold';
                }}
                onMouseLeave={(e) => {
                  const target = e.target as HTMLAnchorElement;
                  target.style.color = 'var(--color-white)';
                  target.style.fontWeight = 'normal';
                }}
              >
                Backlash Coffee
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div
        className="copyright"
        style={{
          textAlign: 'center',
          fontSize: '0.8rem',
          color: 'rgba(255, 255, 255, 0.7)'
        }}
      >
        <p>&copy; 2025 Tepian Teknologi</p>
      </div>
    </footer>
  );
}
