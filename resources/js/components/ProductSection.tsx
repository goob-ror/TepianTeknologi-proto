
import { Product } from '../types';
import { getProductImage, isNewProduct, formatPrice } from '../utils/productUtils';
import { Link } from '@inertiajs/react';

// Utility function to truncate product names
const truncateProductName = (name: string, maxLength: number = 30): string => {
  if (name.length <= maxLength) return name;
  return name.substring(0, maxLength) + '...';
};

interface ProductSectionProps {
  title: string;
  type: 'terlaris' | 'diskon' | 'terbaru';
  products: Product[];
}



export default function ProductSection({ title, type, products }: ProductSectionProps) {
  // Ensure products is always an array
  const safeProducts = Array.isArray(products) ? products : [];
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
        <Link
          href="/katalog"
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
            fontSize: '14px',
            textDecoration: 'none',
            display: 'inline-block'
          }}
        >
          Lihat Selengkapnya   &gt;
        </Link>
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
        {safeProducts.slice(0, 6).map((product, index) => (
          <div
            key={product.id}
            className={`diskon-${index + 1}`}
            style={{
              backgroundColor: 'var(--secondary-color)',
              textAlign: 'left',
              border: '#D9D9D9 solid 1px',
              width: '170px',
              height: '280px',
              margin: '0 auto',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative'
            }}
          >
            <a
              href={`/detail-produk/${product.id}`}
              style={{
                textDecoration: 'none',
                color: 'inherit',
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                height: '100%'
              }}
            >
              <img
                src={getProductImage(product)}
                alt={product.nama_produk}
                style={{
                  width: '100%',
                  height: '140px',
                  objectFit: 'contain',
                  margin: '0'
                }}
              />
              {product.is_diskon && (
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
                  }}>
                    {product.diskon_persen || Math.round(((parseFloat(product.harga) - parseFloat(product.harga_diskon || product.harga)) / parseFloat(product.harga)) * 100)}%
                  </h2>
                </div>
              )}
              <div style={{ flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <h1 style={{
                  fontSize: 'var(--font-size-medium)',
                  color: 'var(--grey-text)',
                  margin: '10px 0 5px 0',
                  padding: '0 10px',
                  fontWeight: 'var(--font-weight-semibold)',
                  textAlign: 'left',
                  lineHeight: '1.3',
                  wordWrap: 'break-word',
                  overflow: 'hidden'
                }}>{truncateProductName(product.nama_produk, 30)}</h1>
                <div style={{ marginTop: 'auto', paddingBottom: '10px' }}>
                  {product.is_diskon && product.harga_diskon && (
                    <p
                      className="diskon-price"
                      style={{
                        color: '#FA766A',
                        fontSize: '14px',
                        textDecoration: 'line-through',
                        margin: '0 0 5px 0',
                        padding: '0 10px'
                      }}
                    >{formatPrice(product.harga)}</p>
                  )}
                  <p style={{
                    color: 'var(--primary-color)',
                    fontSize: 'var(--font-size-medium)',
                    fontWeight: 'var(--font-weight-semibold)',
                    textDecoration: 'none',
                    margin: '0',
                    padding: '0 10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%'
                  }}>
                    {product.is_diskon && product.harga_diskon ? formatPrice(product.harga_diskon) : formatPrice(product.harga)}
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
                </div>
              </div>
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

      <Link
        href="/katalog"
        style={{
          backgroundColor: 'var(--primary-color)',
          color: 'white',
          border: 'none',
          padding: '5px 20px',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '14px',
          gridArea: 'header',
          justifySelf: 'end',
          alignSelf: 'center',
          textDecoration: 'none',
          display: 'inline-block'
        }}
      >
        Lihat Selengkapnya   &gt;
      </Link>

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
        <a
          href={safeProducts.length > 0 ? `/detail-produk/${safeProducts[0].id}` : '#'}
          style={{
            display: 'flex',
            width: '100%',
            height: '100%',
            textDecoration: 'none',
            color: 'inherit',
            cursor: 'pointer',
            textAlign: 'left',
            alignItems: 'center',
            gap: '20px'
          }}
        >
          <img
            src={safeProducts.length > 0 ? getProductImage(safeProducts[0]) : '/icons/product.png'}
            alt={safeProducts.length > 0 ? safeProducts[0].nama_produk : 'Product'}
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
            }}>
              {type === 'terlaris'
                ? `Terlaris di ${safeProducts.length > 0 && safeProducts[0].category ? safeProducts[0].category.nama_kategori : 'Kategori'}`
                : `Terbaru di ${safeProducts.length > 0 && safeProducts[0].category ? safeProducts[0].category.nama_kategori : 'Kategori'}`
              }
            </h1>
            <p style={{
              fontSize: '16px',
              color: 'var(--grey-text)',
              margin: '0 0 30px 0',
              fontWeight: 'var(--font-weight-regular)'
            }}>{safeProducts.length > 0 ? truncateProductName(safeProducts[0].nama_produk, 40) : 'Nama Product'}</p>
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
                {safeProducts.length > 0 ? formatPrice(safeProducts[0].harga) : 'Rp. 123.456'}
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
              <span
                style={{
                  color: 'var(--grey-text)',
                  textDecoration: 'none',
                  fontSize: '14px'
                }}
              >Lihat</span>
            </div>
          </div>
        </a>
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
        <a
          href={safeProducts.length > 1 ? `/detail-produk/${safeProducts[1].id}` : '#'}
          style={{
            display: 'flex',
            width: '100%',
            height: '100%',
            textDecoration: 'none',
            color: 'inherit',
            cursor: 'pointer',
            textAlign: 'left',
            alignItems: 'center',
            gap: '20px'
          }}
        >
          <img
            src={safeProducts.length > 1 ? getProductImage(safeProducts[1]) : '/icons/product.png'}
            alt={safeProducts.length > 1 ? safeProducts[1].nama_produk : 'Product'}
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
            }}>
              {type === 'terlaris'
                ? `Terlaris di ${safeProducts.length > 1 && safeProducts[1].category ? safeProducts[1].category.nama_kategori : 'Kategori'}`
                : `Terbaru di ${safeProducts.length > 1 && safeProducts[1].category ? safeProducts[1].category.nama_kategori : 'Kategori'}`
              }
            </h1>
            <p style={{
              fontSize: '16px',
              color: 'var(--grey-text)',
              margin: '0 0 30px 0',
              fontWeight: 'var(--font-weight-regular)'
            }}>{safeProducts.length > 1 ? truncateProductName(safeProducts[1].nama_produk, 40) : 'Nama Product'}</p>
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
                {safeProducts.length > 1 ? formatPrice(safeProducts[1].harga) : 'Rp. 123.456'}
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
              <span
                style={{
                  color: 'var(--grey-text)',
                  textDecoration: 'none',
                  fontSize: '14px'
                }}
              >Lihat</span>
            </div>
          </div>
        </a>
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
        {safeProducts.slice(2, 8).map((product, index) => (
          <div
            key={product.id}
            className={`${type}-${index + 1}`}
            style={{
              backgroundColor: 'var(--secondary-color)',
              textAlign: 'left',
              border: '#D9D9D9 solid 1px',
              width: '170px',
              height: '280px',
              margin: '0 auto',
              display: 'flex',
              flexDirection: 'column',
              position: isNewProduct(product) ? 'relative' : 'initial'
            }}
          >
            <a
              href={`/detail-produk/${product.id}`}
              style={{
                textDecoration: 'none',
                color: 'inherit',
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                height: '100%'
              }}
            >
              <img
                src={getProductImage(product)}
                alt={product.nama_produk}
                style={{
                  width: '100%',
                  height: '140px',
                  objectFit: 'contain',
                  margin: '0'
                }}
              />
              <div style={{ flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <h1 style={{
                  fontSize: 'var(--font-size-medium)',
                  color: 'var(--grey-text)',
                  margin: '10px 0 5px 0',
                  padding: '0 10px',
                  fontWeight: 'var(--font-weight-semibold)',
                  textAlign: 'left',
                  lineHeight: '1.3',
                  wordWrap: 'break-word',
                  overflow: 'hidden',
                  display: isNewProduct(product) ? 'flex' : 'block',
                  alignItems: isNewProduct(product) ? 'flex-start' : 'initial',
                  gap: isNewProduct(product) ? '8px' : 'initial',
                  flexWrap: isNewProduct(product) ? 'wrap' : 'initial'
                }}>
                  <span>{truncateProductName(product.nama_produk, 30)}</span>
                  {isNewProduct(product) && (
                    <div
                      className="terbaru-tag"
                      style={{
                        backgroundColor: 'var(--primary-color)',
                        color: 'var(--light-text)',
                        padding: '2px 6px',
                        fontSize: '12px',
                        fontWeight: 'var(--font-weight-regular)',
                        borderRadius: '4px',
                        flexShrink: 0
                      }}
                    >NEW</div>
                  )}
                </h1>
                <div style={{ marginTop: 'auto', paddingBottom: '10px' }}>
                  <p style={{
                    color: 'var(--primary-color)',
                    fontSize: 'var(--font-size-medium)',
                    fontWeight: 'var(--font-weight-semibold)',
                    margin: '0',
                    padding: '0 10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%'
                  }}>
                    {formatPrice(product.harga)}
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
                </div>
              </div>
            </a>
          </div>
        ))}
      </div>
    </section>
  );

  return type === 'diskon' ? renderDiscountSection() : renderRegularSection();
}
