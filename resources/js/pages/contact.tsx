import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import { PageLoader } from '../components/Loader';
import GoogleMap from '../components/GoogleMap';

export default function Contact() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate page loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <PageLoader text="Memuat halaman kontak..." />;
  }

  return (
    <>
      <Head title="Kontak -">
        <link rel="icon" href="/favicon.png" type="image/png" />
      </Head>
      <div
        className="min-h-screen flex flex-col"
        style={{
          fontFamily: 'var(--main-font)',
          color: 'var(--grey-text)',
          backgroundColor: 'var(--secondary-color)'
        }}
      >
        <Navigation />

        <main
          className="contact-main flex-1"
          style={{
            padding: '2rem'
          }}
        >
          <section
            className="contact-content"
            style={{
              maxWidth: '1200px',
              margin: '0 auto'
            }}
          >
            <div
              className="contact-title-wrapper"
              style={{
                textAlign: 'center',
                marginBottom: '1rem'
              }}
            >
              <h1
                className="contact-title"
                style={{
                  fontSize: 'var(--font-size-xxlarge)',
                  fontWeight: 'var(--font-weight-bold)',
                  color: '#444'
                }}
              >
                Cont<span
                  className="highlight"
                  style={{
                    color: '#444'
                  }}
                >act Us</span>
              </h1>
            </div>

            <div
              className="contact-info-container"
              style={{
                display: 'flex',
                gap: '2rem',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '2rem',
                marginTop: '3rem'
              }}
            >
              <div
                className="contact-map"
                style={{
                  flex: '1 1 400px',
                  maxWidth: '500px'
                }}
              >
                <GoogleMap
                  latitude={-0.48587588415613114}
                  longitude={117.11514410184907}
                  style={{
                    height: '350px'
                  }}
                />
              </div>

              <div
                className="contact-details"
                style={{
                  flex: '2 1 320px',
                  minWidth: '260px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.2rem'
                }}
              >
                <div
                  className="contact-item"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem'
                  }}
                >
                  <span
                    className="contact-icon"
                    style={{
                      background: 'var(--primary-color)',
                      color: 'var(--light-text)',
                      borderRadius: '50%',
                      width: '36px',
                      height: '36px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <img
                      src="/logo/2.png"
                      alt="Contact"
                      style={{
                        width: '22px',
                        height: '22px'
                      }}
                    />
                  </span>
                  <div>
                    <strong>Contact</strong><br />
                    0541 7802095 | +62-851-7163-9082
                  </div>
                </div>

                <hr
                  style={{
                    border: 'none',
                    borderTop: '1px solid #9c9c9c',
                    margin: '0.75rem 0'
                  }}
                />

                <div
                  className="contact-item"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem'
                  }}
                >
                  <span
                    className="contact-icon"
                    style={{
                      background: 'var(--primary-color)',
                      color: 'var(--light-text)',
                      borderRadius: '50%',
                      width: '36px',
                      height: '36px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <img
                      src="/logo/1.png"
                      alt="Email"
                      style={{
                        width: '22px',
                        height: '22px'
                      }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  </span>
                  <div>
                    <strong>Email</strong><br />
                    iconplus@gmail.com
                  </div>
                </div>

                <hr
                  style={{
                    border: 'none',
                    borderTop: '1px solid #9c9c9c',
                    margin: '0.75rem 0'
                  }}
                />

                <div
                  className="contact-item"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem'
                  }}
                >
                  <span
                    className="contact-icon"
                    style={{
                      background: 'var(--primary-color)',
                      color: 'var(--light-text)',
                      borderRadius: '50%',
                      width: '36px',
                      height: '36px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <img
                      src="/logo/Pin-Map-White.png"
                      alt="Alamat"
                      style={{
                        width: '22px',
                        height: '22px'
                      }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  </span>
                  <div>
                    <strong>Alamat</strong><br />
                    Jl. MT Haryono PERUM Bukit Moria Ruko RCI NO 29 Samarinda,
                    Kalimantan Timur
                  </div>
                </div>

                <hr
                  style={{
                    border: 'none',
                    borderTop: '1px solid #9c9c9c',
                    margin: '0.75rem 0'
                  }}
                />
              </div>
            </div>

            <hr
              style={{
                border: 'none',
                borderTop: '1px solid #9c9c9c',
                margin: '0.75rem 0'
              }}
            />

            <div
              className="contact-cta"
              style={{
                textAlign: 'center',
                marginTop: '2rem',
                fontSize: 'var(--font-size-large)'
              }}
            >
              <p
                style={{
                  marginBottom: '1.2rem'
                }}
              >
                Hubungkan dengan <strong
                  className="admin-link"
                  style={{
                    color: 'var(--primary-color)',
                    cursor: 'pointer'
                  }}
                >Admin</strong> untuk
                Produk yang Anda Cari atau Login untuk Melihat!
              </p>

              <div
                className="contact-buttons"
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

        <footer
          className="footer"
          style={{
            textAlign: 'center',
            padding: '1.5rem',
            backgroundColor: 'var(--primary-color)',
            fontSize: 'var(--font-size-medium)',
            color: 'var(--light-text)'
          }}
        >
          <p>&copy; 2025 Tepian Teknologi</p>
        </footer>
      </div>
    </>
  );
}
