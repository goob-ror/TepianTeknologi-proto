import { useState } from 'react';
import { Product } from '../types';
import { getProductImage, isNewProduct, formatPrice, getEffectivePrice, getDiscountPercentage } from '../utils/productUtils';

interface RelatedProductsProps {
  products: Product[];
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 5;

  // Calculate pagination
  const totalPages = Math.ceil(products.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = products.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div
      className="catalog-related"
      style={{
        margin: '20px 0 0 0',
        width: '100%',
        backgroundColor: 'var(--secondary-color)',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}
    >
      <div
        className="product-related"
        style={{ padding: '20px' }}
      >
        <h1
          style={{
            fontSize: 'var(--font-size-large)',
            fontWeight: 'var(--font-weight-semibold)',
            color: 'var(--grey-text)',
            marginBottom: '20px'
          }}
        >
          Produk Terkait :
        </h1>

        <div
          className="track-products"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '15px',
            overflowX: 'auto',
            padding: '10px 0'
          }}
        >
          {currentProducts.map((product) => {
            const discountPercentage = getDiscountPercentage(product);
            const effectivePrice = getEffectivePrice(product);
            const isNew = isNewProduct(product);

            return (
              <div
                key={product.id}
                className="products"
                style={{
                  backgroundColor: 'var(--secondary-color)',
                  textAlign: 'left',
                  border: '#D9D9D9 solid 1px',
                  width: '180px',
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
                      margin: '0 0 10px 0'
                    }}
                  />

                  {discountPercentage > 0 && (
                    <div
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
                        fontSize: '10px',
                        padding: '2px',
                        fontWeight: 'var(--font-weight-regular)',
                        margin: '0'
                      }}>{discountPercentage}%</h2>
                    </div>
                  )}

                  <h1
                    style={{
                      fontSize: 'var(--font-size-small)',
                      color: 'var(--grey-text)',
                      margin: '15px 0 30px 0',
                      padding: '0 15px 0 15px',
                      fontWeight: 'var(--font-weight-semibold)',
                      width: '100%',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    {product.nama_produk}
                    {isNew && (
                      <div
                        className="terbaru-tag"
                        style={{
                          backgroundColor: 'var(--primary-color)',
                          color: 'var(--light-text)',
                          padding: '4px 6px',
                          fontSize: '10px',
                          fontWeight: 'var(--font-weight-regular)',
                          borderRadius: '4px'
                        }}
                      >
                        NEW
                      </div>
                    )}
                  </h1>

                  {product.is_diskon && product.harga_diskon && (
                    <p
                      className="diskon-price"
                      style={{
                        color: '#FA766A',
                        fontSize: '12px',
                        textDecoration: 'line-through',
                        margin: 0,
                        padding: '0 10px'
                      }}
                    >
                      {formatPrice(parseFloat(product.harga))}
                    </p>
                  )}

                  <p
                    style={{
                      color: 'var(--primary-color)',
                      fontSize: 'var(--font-size-small)',
                      fontWeight: 'var(--font-weight-semibold)',
                      margin: 0,
                      padding: '0 15px 15px 15px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      marginTop: 'auto'
                    }}
                  >
                    {formatPrice(effectivePrice)}
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
            );
          })}
        </div>

        {totalPages > 1 && (
          <div
            className="related-pagination"
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '10px',
              marginTop: '20px'
            }}
          >
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #D9D9D9',
                  backgroundColor: currentPage === page ? 'var(--primary-color)' : 'var(--secondary-color)',
                  color: currentPage === page ? 'var(--light-text)' : 'var(--grey-text)',
                  cursor: 'pointer',
                  borderRadius: '4px',
                  fontSize: 'var(--font-size-small)',
                  fontWeight: 'var(--font-weight-semibold)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  if (currentPage !== page) {
                    e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentPage !== page) {
                    e.currentTarget.style.backgroundColor = 'var(--secondary-color)';
                  }
                }}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
