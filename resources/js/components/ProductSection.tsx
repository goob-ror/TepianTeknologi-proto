

interface ProductSectionProps {
  title: string;
  type: 'terlaris' | 'diskon' | 'terbaru';
}

export default function ProductSection({ title, type }: ProductSectionProps) {
  const renderDiscountSection = () => (
    <section
      className="diskon"
      style={{
        maxWidth: '1200px',
        margin: '40px auto',
        padding: '30px',
        backgroundColor: 'var(--secondary-color)',
        fontFamily: 'var(--main-font)',
        display: 'grid',
        gridTemplateColumns: '1fr',
        gridTemplateRows: 'auto auto auto',
        gap: '20px',
        gridTemplateAreas: '"header" "banner" "products"'
      }}
    >
      <div
        className="diskon-top-row"
        style={{
          gridArea: 'header',
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <div
          className="diskon-header"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px',
            textAlign: 'center'
          }}
        >
          <h1 style={{
            fontSize: 'var(--font-size-xxlarge)',
            fontWeight: 'var(--font-weight-semibold)',
            color: 'var(--grey-text)',
            margin: '0'
          }}>Spesial!</h1>
          <h2 style={{
            fontSize: 'var(--font-size-xxlarge)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--primary-color)',
            margin: '0'
          }}>DISKON</h2>
          <hr style={{
            width: '200px',
            border: 'none',
            borderTop: '2px solid #D9D9D9',
            margin: '10px 0'
          }} />
        </div>
        <button
          style={{
            position: 'absolute',
            right: '0',
            top: '20%',
            transform: 'translateY(-50%)',
            backgroundColor: 'var(--primary-color)',
            color: 'white',
            border: 'none',
            padding: '5px 20px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Lihat Selengkapnya   &gt;
        </button>
      </div>

      <div
        className="diskon-banner"
        style={{
          gridArea: 'banner',
          width: '100%',
          height: '300px',
          overflow: 'hidden',
          borderRadius: '10px'
        }}
      >
        <img
          src="/images/Discount-Poster.png"
          alt="Banner Diskon"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
      </div>

      <div
        className="diskon-products"
        style={{
          gridArea: 'products',
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gap: '20px'
        }}
      >
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div
            key={item}
            className={`diskon-${item}`}
            style={{
              backgroundColor: 'var(--secondary-color)',
              textAlign: 'left',
              border: '#D9D9D9 solid 1px',
              width: '170px',
              margin: '0 auto',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative'
            }}
          >
            <a
              href="#"
              style={{
                textDecoration: 'none',
                color: 'inherit',
                display: 'block',
                width: '100%'
              }}
            >
              <img
                src="/icons/product.png"
                alt=""
                style={{
                  width: '100%',
                  objectFit: 'contain',
                  margin: '0'
                }}
              />
              <div
                className="diskon-tag"
                style={{
                  position: 'absolute',
                  top: '0',
                  left: '0',
                  backgroundColor: 'var(--primary-color)',
                  color: 'var(--light-text)',
                  padding: '1px 1px'
                }}
              >
                <h2 style={{
                  fontSize: '14px',
                  padding: '2px',
                  fontWeight: 'var(--font-weight-regular)',
                  margin: '0'
                }}>30%</h2>
              </div>
              <h1 style={{
                fontSize: 'var(--font-size-medium)',
                color: 'var(--grey-text)',
                margin: '5px 0 15px 0',
                padding: '0 10px 0 10px',
                fontWeight: 'var(--font-weight-semibold)',
                width: '100%',
                textAlign: 'left'
              }}>Nama Product</h1>
              <p
                className="diskon-price"
                style={{
                  color: '#FA766A',
                  fontSize: '14px',
                  textDecoration: 'line-through',
                  margin: '0',
                  padding: '0 10px'
                }}
              >Rp. 234.567</p>
              <p style={{
                color: 'var(--primary-color)',
                fontSize: 'var(--font-size-medium)',
                fontWeight: 'var(--font-weight-semibold)',
                textDecoration: 'none',
                margin: '0',
                padding: '0 10px 10px 10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%'
              }}>
                Rp. 123.456
                <span>
                  <img
                    src="/icons/shopping-cart.png"
                    className="price-cart"
                    style={{
                      width: '19.69px',
                      height: '17px'
                    }}
                    alt="Cart"
                  />
                </span>
              </p>
            </a>
          </div>
        ))}
      </div>
    </section>
  );

  const renderRegularSection = () => (
    <section
      className={type}
      style={{
        maxWidth: '1200px',
        margin: '40px auto',
        padding: '30px',
        backgroundColor: 'var(--secondary-color)',
        fontFamily: 'var(--main-font)',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gridTemplateRows: 'auto auto auto',
        gap: '20px',
        gridTemplateAreas: '"header header" "olt ont" "products products"'
      }}
    >
      <h1 style={{
        display: 'inline-block',
        fontSize: '24px',
        fontWeight: 'var(--font-weight-bold)',
        color: 'var(--grey-text)',
        margin: '10px 0 10px 0',
        gridArea: 'header',
        justifySelf: 'start'
      }}>{title}</h1>

      <hr style={{
        gridArea: 'header',
        width: '200px',
        border: 'none',
        borderTop: '2px solid #D9D9D9',
        alignSelf: 'end',
        justifySelf: 'start'
      }} />

      <button style={{
        backgroundColor: 'var(--primary-color)',
        color: 'white',
        border: 'none',
        padding: '5px 20px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '14px',
        gridArea: 'header',
        justifySelf: 'end',
        alignSelf: 'center'
      }}>
        Lihat Selengkapnya   &gt;
      </button>

      <div
        className={`${type}-olt`}
        style={{
          gridArea: 'olt',
          display: 'flex',
          backgroundColor: 'var(--secondary-color)',
          alignItems: 'center',
          gap: '20px',
          minHeight: '181px',
          border: '#D9D9D9 solid 1px'
        }}
      >
        <button style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          background: 'none',
          border: 'none',
          padding: '0',
          cursor: 'pointer',
          textAlign: 'left',
          alignItems: 'center',
          gap: '20px'
        }}>
          <img
            src="/icons/product.png"
            alt=""
            style={{
              width: '181px',
              height: '181px',
              flexShrink: '0'
            }}
          />
          <div
            className={`${type}-content`}
            style={{
              flex: '1',
              padding: '5px 20px 10px 5px'
            }}
          >
            <h1 style={{
              fontSize: 'var(--font-size-xlarge)',
              color: 'var(--grey-text)',
              margin: '0 0 20px 0',
              fontWeight: 'var(--font-weight-semibold)'
            }}>{type === 'terlaris' ? 'Terlaris' : 'Terbaru'} di OLT</h1>
            <p style={{
              fontSize: '16px',
              color: 'var(--grey-text)',
              margin: '0 0 30px 0',
              fontWeight: 'var(--font-weight-regular)'
            }}>Nama Product</p>
            <div
              className="price"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                gap: '10px'
              }}
            >
              <p style={{
                color: 'var(--primary-color)',
                fontSize: '16px',
                fontWeight: 'bold',
                margin: '0',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                Rp. 123.456
                <span>
                  <img
                    src="/icons/shopping-cart.png"
                    className="price-cart"
                    style={{
                      width: '19.69px',
                      height: '17px'
                    }}
                    alt="Cart"
                  />
                </span>
              </p>
              <a
                href="#"
                style={{
                  color: 'var(--grey-text)',
                  textDecoration: 'none',
                  fontSize: '14px'
                }}
              >Lihat</a>
            </div>
          </div>
        </button>
      </div>

      <div
        className={`${type}-ont`}
        style={{
          gridArea: 'ont',
          display: 'flex',
          backgroundColor: 'var(--secondary-color)',
          alignItems: 'center',
          gap: '20px',
          minHeight: '181px',
          border: '#D9D9D9 solid 1px'
        }}
      >
        <button style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          background: 'none',
          border: 'none',
          padding: '0',
          cursor: 'pointer',
          textAlign: 'left',
          alignItems: 'center',
          gap: '20px'
        }}>
          <img
            src="/icons/product.png"
            alt=""
            style={{
              width: '181px',
              height: '181px',
              flexShrink: '0'
            }}
          />
          <div
            className={`${type}-content`}
            style={{
              flex: '1',
              padding: '5px 20px 10px 5px'
            }}
          >
            <h1 style={{
              fontSize: 'var(--font-size-xlarge)',
              color: 'var(--grey-text)',
              margin: '0 0 20px 0',
              fontWeight: 'var(--font-weight-semibold)'
            }}>{type === 'terlaris' ? 'Terlaris' : 'Terbaru'} di ONT</h1>
            <p style={{
              fontSize: '16px',
              color: 'var(--grey-text)',
              margin: '0 0 30px 0',
              fontWeight: 'var(--font-weight-regular)'
            }}>Nama Product</p>
            <div
              className="price"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                gap: '10px'
              }}
            >
              <p style={{
                color: 'var(--primary-color)',
                fontSize: '16px',
                fontWeight: 'bold',
                margin: '0',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                Rp. 123.456
                <span>
                  <img
                    src="/icons/shopping-cart.png"
                    className="price-cart"
                    style={{
                      width: '19.69px',
                      height: '17px'
                    }}
                    alt="Cart"
                  />
                </span>
              </p>
              <a
                href="#"
                style={{
                  color: 'var(--grey-text)',
                  textDecoration: 'none',
                  fontSize: '14px'
                }}
              >Lihat</a>
            </div>
          </div>
        </button>
      </div>

      <div
        className={`${type}-products`}
        style={{
          gridArea: 'products',
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gap: '20px'
        }}
      >
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div
            key={item}
            className={`${type}-${item}`}
            style={{
              backgroundColor: 'var(--secondary-color)',
              textAlign: 'left',
              border: '#D9D9D9 solid 1px',
              width: '170px',
              margin: '0 auto',
              display: 'flex',
              flexDirection: 'column',
              position: type === 'terbaru' ? 'relative' : 'initial'
            }}
          >
            <a
              href="#"
              style={{
                textDecoration: 'none',
                color: 'inherit',
                display: 'block',
                width: '100%'
              }}
            >
              <img
                src="/icons/product.png"
                alt=""
                style={{
                  width: '100%',
                  objectFit: 'contain',
                  margin: '0'
                }}
              />
              <h1 style={{
                fontSize: 'var(--font-size-medium)',
                color: 'var(--grey-text)',
                margin: type === 'terbaru' ? '5px 0 15px 0' : '5px 0 8px 0',
                padding: '0 10px 0 10px',
                fontWeight: 'var(--font-weight-semibold)',
                width: '100%',
                textAlign: 'left',
                display: type === 'terbaru' ? 'flex' : 'block',
                alignItems: type === 'terbaru' ? 'center' : 'initial',
                gap: type === 'terbaru' ? '8px' : 'initial'
              }}>
                Nama Product
                {type === 'terbaru' && (
                  <div
                    className="terbaru-tag"
                    style={{
                      backgroundColor: 'var(--primary-color)',
                      color: 'var(--light-text)',
                      padding: '2px 6px',
                      fontSize: '14px',
                      fontWeight: 'var(--font-weight-regular)',
                      borderRadius: '4px'
                    }}
                  >NEW</div>
                )}
              </h1>
              <p style={{
                color: 'var(--primary-color)',
                fontSize: 'var(--font-size-medium)',
                fontWeight: 'var(--font-weight-semibold)',
                margin: '0',
                padding: '0 10px 10px 10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%'
              }}>
                Rp. 123.456
                <span>
                  <img
                    src="/icons/shopping-cart.png"
                    className="price-cart"
                    style={{
                      width: '19.69px',
                      height: '17px'
                    }}
                    alt="Cart"
                  />
                </span>
              </p>
            </a>
          </div>
        ))}
      </div>
    </section>
  );

  return type === 'diskon' ? renderDiscountSection() : renderRegularSection();
}
