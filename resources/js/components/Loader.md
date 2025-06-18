# Loader Component Documentation

A reusable loader component system that matches the design system styling for Tepian Teknologi.

## Components Available

### 1. Main Loader Component
```tsx
import Loader from '@/components/Loader';

<Loader 
  size="medium"           // 'small' | 'medium' | 'large'
  overlay={false}         // boolean - shows full screen overlay
  text="Memuat..."        // string - loading text
  className=""            // string - additional CSS classes
  style={{}}              // CSSProperties - additional styles
/>
```

### 2. Preset Loaders

#### PageLoader - Full screen overlay loader
```tsx
import { PageLoader } from '@/components/Loader';

<PageLoader text="Memuat halaman..." />
```

#### SectionLoader - For loading sections within a page
```tsx
import { SectionLoader } from '@/components/Loader';

<SectionLoader text="Memuat produk..." />
```

#### ButtonLoader - Small loader for buttons
```tsx
import { ButtonLoader } from '@/components/Loader';

<button disabled>
  <ButtonLoader />
  Memproses...
</button>
```

#### InlineLoader - Inline loader with text
```tsx
import { InlineLoader } from '@/components/Loader';

<InlineLoader text="Menyimpan..." />
```

## Hook Usage

### useLoader Hook
```tsx
import { useLoader } from '@/hooks/useLoader';

function MyComponent() {
  const { isLoading, startLoading, stopLoading, withLoading } = useLoader();

  const handleSubmit = async () => {
    await withLoading(async () => {
      // Your async operation
      await submitData();
    });
  };

  return (
    <div>
      {isLoading && <SectionLoader />}
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}
```

## Page Integration Examples

### Basic Page Loading
```tsx
import { useState, useEffect } from 'react';
import { PageLoader } from '@/components/Loader';

export default function MyPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <PageLoader text="Memuat halaman..." />;
  }

  return <div>Page content</div>;
}
```

### Conditional Section Loading
```tsx
function ProductList() {
  const [products, setProducts] = useState([]);
  const { isLoading, withLoading } = useLoader();

  const loadProducts = async () => {
    await withLoading(async () => {
      const data = await fetchProducts();
      setProducts(data);
    });
  };

  return (
    <div>
      {isLoading ? (
        <SectionLoader text="Memuat produk..." />
      ) : (
        <div>
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
```

## Styling Features

- **Design System Integration**: Uses CSS variables from your design system
- **Responsive Sizes**: Small (30px), Medium (50px), Large (70px)
- **Smooth Animations**: Spinning loader with pulse text animation
- **Brand Colors**: Primary color spinner with gray text
- **Fade-in Effect**: Smooth appearance animation

## Customization

### Custom Styling
```tsx
<Loader 
  style={{
    backgroundColor: 'rgba(0,0,0,0.1)',
    padding: '20px',
    borderRadius: '10px'
  }}
  className="my-custom-loader"
/>
```

### Custom Text Styling
The loader automatically uses your design system variables:
- `--main-font` for font family
- `--primary-color` for spinner color
- `--grey-text` for text color
- `--font-size-*` for text sizes
- `--font-weight-medium` for text weight

## Browser Support

- ✅ Chrome/Edge (Webkit animations)
- ✅ Firefox (CSS animations)
- ✅ Safari (Webkit animations)
- ✅ Mobile browsers

## Performance Notes

- Lightweight component with minimal DOM impact
- CSS animations for smooth performance
- No external dependencies beyond React
- Optimized for frequent use across pages
