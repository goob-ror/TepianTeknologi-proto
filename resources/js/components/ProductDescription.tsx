import { Product } from '../types';

interface ProductDescriptionProps {
  product: Product;
}

export default function ProductDescription({ product }: ProductDescriptionProps) {
  return (
    <div
      className="detail-product-description"
      style={{
        margin: '20px 0 20px 5px',
        border: '1px solid #D9D9D9',
        backgroundColor: 'var(--secondary-color)',
        width: '1000px'
      }}
    >
      <div
        className="detail-description"
        style={{
          padding: '20px',
          fontFamily: 'var(--main-font)',
          color: 'var(--grey-text)'
        }}
      >
        <h1
          style={{
            fontSize: 'var(--font-size-large)',
            fontWeight: 'var(--font-weight-semibold)',
            margin: '0 0 10px 0'
          }}
        >
          Deskripsi Produk
        </h1>
        <hr
          style={{
            width: '200px',
            border: 'none',
            borderTop: '3px solid #D9D9D9',
            marginBottom: '20px'
          }}
        />
        <p
          className="text-description"
          style={{
            margin: 0,
            lineHeight: '1.6'
          }}
        >
          {product.deskripsi || 'Deskripsi produk belum tersedia.'}
        </p>
      </div>
    </div>
  );
}
