import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import { PageLoader } from '../components/Loader';

export default function About() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate page loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <PageLoader text="Memuat halaman tentang kami..." />;
  }

  return (
    <>
      <Head title="Tentang -">
        <link rel="icon" href="/favicon.png" type="image/png" />
      </Head>
      <div className="min-h-screen" style={{ backgroundColor: '#EFEFEF', fontFamily: 'var(--main-font)' }}>
        <Navigation />

        <main 
          className="about-main"
          style={{
            padding: '40px 20px',
            backgroundColor: 'var(--secondary-color)',
            fontFamily: 'var(--main-font)',
            minHeight: '100px'
          }}
        >
          <section 
            className="about-content"
            style={{
              maxWidth: '800px',
              margin: '0 auto',
              backgroundColor: 'var(--secondary-color)',
              padding: '40px',
              color: 'var(--grey-text)'
            }}
          >
            <div 
              className="about-title-wrapper"
              style={{
                textAlign: 'center',
                marginBottom: '32px'
              }}
            >
              <h1 
                className="about-title"
                style={{
                  fontSize: 'var(--font-size-xxlarge)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--dark-text)',
                  display: 'inline-block',
                  fontFamily: 'var(--main-font)',
                  position: 'relative'
                }}
              >
                Abo<span 
                  className="highlight"
                  style={{
                    position: 'relative',
                    display: 'inline-block'
                  }}
                >
                  ut Us
                  <span
                    style={{
                      content: '""',
                      position: 'absolute',
                      bottom: '-6px',
                      left: '0',
                      width: '100%',
                      height: '4px',
                      backgroundColor: 'var(--primary-color)',
                      borderRadius: '2px',
                      display: 'block'
                    }}
                  />
                </span>
              </h1>
            </div>
            
            <hr 
              className="line-separator"
              style={{
                margin: '4rem 0',
                border: 'none',
                borderTop: '1px solid #9c9c9c',
                width: '100%'
              }}
            />

            <div className="about-section">
              <h3
                style={{
                  fontSize: 'var(--font-size-large)',
                  fontWeight: 'var(--font-weight-semibold)',
                  margin: '36px 0 24px',
                  color: 'var(--grey-text)',
                  borderLeft: '4px solid var(--primary-color)',
                  paddingLeft: '10px'
                }}
              >
                Tentang Kami
              </h3>
              <p 
                className="visi-misi-paragraph"
                style={{
                  fontSize: 'var(--font-size-medium)',
                  lineHeight: '1.6',
                  color: 'var(--grey-text)',
                  marginBottom: '16px',
                  fontWeight: 'var(--font-weight-regular)',
                  marginLeft: '16px'
                }}
              >
                Tepian Teknologi adalah website yang menjual peralatan jaringan,
                komputer dan peralatan teknologi lainnya. Kami juga bekerjasama
                dengan beberapa brand jaringan ternama seperti tplink, mikrotik,
                satelindo, dll yang menandakan keaslian setiap barang yang
                tersimpan. Untuk saat ini toko ini juga menyediakan pesanan
                terlengkap dan terpercaya untuk area kota dan luar negeri dengan
                pelayanan terintegrasi dan transparan. Toko ini berlokasi di
                Samarinda, Kalimantan Timur, Indonesia.
              </p>
            </div>

            <hr 
              className="line-separator"
              style={{
                margin: '4rem 0',
                border: 'none',
                borderTop: '1px solid #9c9c9c',
                width: '100%'
              }}
            />

            <div className="about-section">
              <h3
                style={{
                  fontSize: 'var(--font-size-large)',
                  fontWeight: 'var(--font-weight-semibold)',
                  margin: '36px 0 24px',
                  color: 'var(--grey-text)',
                  borderLeft: '4px solid var(--primary-color)',
                  paddingLeft: '10px'
                }}
              >
                Visi & Misi
              </h3>
              <p 
                className="visi-misi-paragraph"
                style={{
                  fontSize: 'var(--font-size-medium)',
                  lineHeight: '1.6',
                  color: 'var(--grey-text)',
                  marginBottom: '16px',
                  fontWeight: 'var(--font-weight-regular)',
                  marginLeft: '16px'
                }}
              >
                <strong style={{ fontWeight: 'var(--font-weight-bold)' }}>Visi </strong>
                Lorem ipsum dolor sit amet, consectetur
                adipisicing elit. Sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua.
              </p>
              <p 
                className="visi-misi-paragraph"
                style={{
                  fontSize: 'var(--font-size-medium)',
                  lineHeight: '1.6',
                  color: 'var(--grey-text)',
                  marginBottom: '16px',
                  fontWeight: 'var(--font-weight-regular)',
                  marginLeft: '16px'
                }}
              >
                <strong style={{ fontWeight: 'var(--font-weight-bold)' }}>Misi </strong>
                Ut enim ad minim veniam, quis nostrud
                exercitation ullamco laboris nisi ut aliquip ex ea commodo
                consequat.
              </p>
            </div>

            <hr 
              className="line-separator"
              style={{
                margin: '4rem 0',
                border: 'none',
                borderTop: '1px solid #9c9c9c',
                width: '100%'
              }}
            />

            <div className="about-section">
              <h3
                style={{
                  fontSize: 'var(--font-size-large)',
                  fontWeight: 'var(--font-weight-semibold)',
                  margin: '36px 0 24px',
                  color: 'var(--grey-text)',
                  borderLeft: '4px solid var(--primary-color)',
                  paddingLeft: '10px'
                }}
              >
                Keunggulan
              </h3>
              <ol
                style={{
                  fontSize: 'var(--font-size-medium)',
                  lineHeight: '1.6',
                  color: 'var(--grey-text)',
                  marginBottom: '16px',
                  fontWeight: 'var(--font-weight-regular)',
                  listStyle: 'decimal',
                  listStylePosition: 'outside',
                  paddingLeft: '20px',
                  marginLeft: '1em'
                }}
              >
                <li>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed do
                  eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </li>
                <li>
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
                  nisi ut aliquip ex ea commodo consequat.
                </li>
                <li>
                  Duis aute irure dolor in reprehenderit in voluptate velit esse
                  cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                  cupidatat non proident.
                </li>
              </ol>
            </div>

            <hr 
              className="line-separator"
              style={{
                margin: '4rem 0',
                border: 'none',
                borderTop: '1px solid #9c9c9c',
                width: '100%'
              }}
            />

            <div 
              className="about-cta"
              style={{
                textAlign: 'center',
                marginTop: '40px'
              }}
            >
              <p
                style={{
                  fontSize: 'var(--font-size-large)',
                  fontWeight: 'var(--font-weight-medium)',
                  color: 'var(--dark-text)',
                  marginBottom: '16px'
                }}
              >
                Hubungkan dengan <strong 
                  className="admin-link"
                  style={{
                    color: 'var(--primary-color)',
                    fontWeight: 'var(--font-weight-bold)'
                  }}
                >Admin</strong> untuk
                Produk yang Anda Cari atau Login untuk Melihat!
              </p>
              <div 
                className="about-buttons"
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '12px',
                  flexWrap: 'wrap'
                }}
              >
                <button 
                  className="btn-outline"
                  style={{
                    padding: '7px 16px',
                    fontSize: '0.95rem',
                    borderRadius: '6px',
                    fontWeight: 'var(--font-weight-semibold)',
                    cursor: 'pointer',
                    border: '2px solid var(--primary-color)',
                    backgroundColor: 'transparent',
                    color: 'var(--primary-color)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontFamily: 'var(--main-font)'
                  }}
                >
                  SignUp/Login
                </button>
                <button
                  style={{
                    padding: '7px 16px',
                    fontSize: '0.95rem',
                    borderRadius: '6px',
                    fontWeight: 'var(--font-weight-semibold)',
                    cursor: 'pointer',
                    border: 'none',
                    backgroundColor: 'var(--primary-color)',
                    color: 'var(--light-text)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontFamily: 'var(--main-font)'
                  }}
                >
                  <img 
                    src="/logo/WhatsApp-White-Logo.png" 
                    alt="WhatsApp"
                    style={{
                      width: '18px',
                      height: '18px'
                    }}
                  />
                  Hubungkan Sekarang
                </button>
              </div>
            </div>
          </section>
        </main>

        <footer style={{
          backgroundColor: 'var(--primary-color)',
          padding: '20px',
          color: 'var(--light-text)'
        }}>
          <div
            className="text-center"
            style={{
              fontFamily: 'var(--main-font)',
              fontWeight: 'var(--font-weight-small)'
            }}
          >
            <p style={{ fontSize: 'large' }}>&copy; 2025 Tepian Teknologi</p>
          </div>
        </footer>
      </div>
    </>
  );
}
