# TepianTeknologi E-Commerce Platform

![TepianTeknologi Logo](public/logo/TepianTeknologi-Logo.png)

A modern e-commerce platform built with Laravel 12, React, TypeScript, and Tailwind CSS v4. This platform provides a complete solution for technology product sales with admin dashboard, order management, payment processing, and more.

## 🚀 Features

### Customer Features
- **Product Catalog**: Browse products with advanced filtering and search
- **Shopping Cart**: Add/remove items with localStorage persistence
- **Order Management**: Place orders with WhatsApp integration
- **Payment System**: Upload payment proofs with validation
- **Order History**: Track order status and download transaction proofs
- **Responsive Design**: Mobile-first design with Tailwind CSS

### Admin Features
- **Dashboard**: Real-time analytics and sales charts
- **Product Management**: CRUD operations with image upload
- **Order Management**: Process orders, validate payments
- **User Management**: Manage customer accounts
- **Payment Validation**: Review and approve payment proofs
- **Reports**: Generate CSV/Excel exports for orders

### Technical Features
- **Laravel 12**: Latest PHP framework with modern features
- **React + TypeScript**: Type-safe frontend development
- **Inertia.js**: SPA experience without API complexity
- **Tailwind CSS v4**: Modern utility-first CSS framework
- **SQLite/MySQL**: Flexible database options
- **PDF Generation**: Transaction proof documents
- **File Upload**: Image handling with validation
- **Testing**: Comprehensive test suite with Pest

## 📋 Requirements

- **PHP**: ^8.2
- **Node.js**: ^18.0
- **Composer**: ^2.0
- **NPM/Yarn**: Latest version

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/TepianTeknologi-proto.git
cd TepianTeknologi-proto
```

### 2. Install PHP Dependencies

```bash
composer install
```

### 3. Install Node.js Dependencies

```bash
npm install
```

### 4. Environment Configuration

```bash
# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate
```

### 5. Configure Environment Variables

Edit `.env` file with your settings:

```env
APP_NAME="TepianTeknologi"
APP_ENV=local
APP_KEY=base64:your-generated-key
APP_DEBUG=true
APP_URL=http://localhost:8000

# Database Configuration (SQLite default)
DB_CONNECTION=sqlite
# For MySQL, uncomment and configure:
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=tepian_teknologi
# DB_USERNAME=root
# DB_PASSWORD=

# Session & Cache
SESSION_DRIVER=database
CACHE_STORE=database
QUEUE_CONNECTION=database

# File Storage
FILESYSTEM_DISK=local
```

### 6. Database Setup

```bash
# Create SQLite database (if using SQLite)
touch database/database.sqlite

# Run migrations
php artisan migrate

# Seed database with sample data
php artisan db:seed
```

### 7. Storage Setup

```bash
# Create storage link for file uploads
php artisan storage:link

# Set proper permissions
chmod -R 775 storage
chmod -R 775 bootstrap/cache
```

### 8. Build Assets

```bash
# Development build
npm run dev

# Production build
npm run build
```

## 🚀 Running the Application

### Development Mode

```bash
# Start all services (recommended)
composer run dev
```

This command starts:
- Laravel development server (http://localhost:8000)
- Queue worker for background jobs
- Vite development server for hot reloading

### Manual Start

```bash
# Terminal 1: Start Laravel server
php artisan serve

# Terminal 2: Start Vite dev server
npm run dev

# Terminal 3: Start queue worker (optional)
php artisan queue:work
```

### Production Mode

```bash
# Build assets for production
npm run build

# Start with production server (Apache/Nginx)
# Configure your web server to point to /public directory
```

## 📁 Project Structure

```
TepianTeknologi-proto/
├── app/                    # Laravel application code
│   ├── Http/Controllers/   # Controllers
│   ├── Models/            # Eloquent models
│   └── ...
├── database/              # Database files
│   ├── migrations/        # Database migrations
│   ├── seeders/          # Database seeders
│   └── database.sqlite   # SQLite database
├── public/               # Public assets
│   ├── images/          # Product images
│   ├── icons/           # UI icons
│   └── storage/         # Uploaded files
├── resources/           # Frontend resources
│   ├── js/             # React/TypeScript code
│   │   ├── components/ # Reusable components
│   │   ├── pages/      # Page components
│   │   └── layouts/    # Layout components
│   ├── css/           # Stylesheets
│   └── views/         # Blade templates
├── routes/            # Route definitions
├── storage/           # Application storage
├── tests/            # Test files
└── vendor/           # Composer dependencies
```

## 🧪 Testing

```bash
# Run all tests
composer run test

# Run specific test file
php artisan test tests/Feature/PaymentProofUploadTest.php

# Run with coverage
php artisan test --coverage
```

## 📦 Deployment

### Production Deployment Steps

1. **Server Requirements**
   - PHP 8.2+ with required extensions
   - Web server (Apache/Nginx)
   - Database (MySQL/PostgreSQL recommended for production)
   - Node.js for building assets

2. **Deploy Code**
   ```bash
   git clone https://github.com/your-username/TepianTeknologi-proto.git
   cd TepianTeknologi-proto
   composer install --optimize-autoloader --no-dev
   npm install && npm run build
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   php artisan key:generate
   # Configure production environment variables
   ```

4. **Database Setup**
   ```bash
   php artisan migrate --force
   php artisan db:seed --force
   ```

5. **Permissions**
   ```bash
   chmod -R 755 storage bootstrap/cache
   chown -R www-data:www-data storage bootstrap/cache
   ```

6. **Web Server Configuration**
   - Point document root to `/public` directory
   - Configure URL rewriting for Laravel

### Docker Deployment (Optional)

```bash
# Using Laravel Sail
./vendor/bin/sail up -d
```

## 🔧 Configuration

### Key Configuration Files

- `config/app.php` - Application settings
- `config/database.php` - Database configuration
- `config/filesystems.php` - File storage settings
- `vite.config.ts` - Frontend build configuration
- `tailwind.config.js` - Tailwind CSS configuration

### Admin Account

Default admin credentials (change in production):
- **Username**: admin
- **Password**: password

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Contact: [your-email@example.com]

## 🔍 API Documentation

### Authentication
The application uses Laravel's built-in session authentication.

### Key Endpoints
- `GET /` - Home page
- `GET /katalog` - Product catalog
- `GET /admin/dashboard` - Admin dashboard
- `POST /admin/orders/{order}/upload-payment-proof` - Upload payment proof
- `GET /admin/orders/{order}/transaction-proof` - Download transaction proof

## 🐛 Troubleshooting

### Common Issues

**1. Permission Errors**
```bash
sudo chmod -R 775 storage bootstrap/cache
sudo chown -R $USER:www-data storage bootstrap/cache
```

**2. Database Connection Issues**
- Check `.env` database configuration
- Ensure database exists and is accessible
- Run `php artisan migrate:status` to check migrations

**3. Asset Build Issues**
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

**4. Queue Jobs Not Processing**
```bash
php artisan queue:restart
php artisan queue:work
```

**5. Storage Link Issues**
```bash
php artisan storage:link
```

### Performance Optimization

**Production Optimizations**
```bash
# Cache configuration
php artisan config:cache

# Cache routes
php artisan route:cache

# Cache views
php artisan view:cache

# Optimize autoloader
composer install --optimize-autoloader --no-dev
```

## 📊 Database Schema

### Key Tables
- `users` - User accounts (customers & admins)
- `products` - Product catalog
- `kategoris` - Product categories
- `brands` - Product brands
- `pesanan` - Orders
- `detail_pesanan` - Order items
- `pembayaran` - Payment records
- `pengiriman` - Shipping information

### Relationships
- User → Orders (One to Many)
- Order → Order Items (One to Many)
- Order → Payment (One to One)
- Order → Shipping (One to One)
- Product → Category (Many to One)
- Product → Brand (Many to One)

## 🔐 Security Features

- **CSRF Protection**: All forms protected with CSRF tokens
- **SQL Injection Prevention**: Eloquent ORM with parameter binding
- **XSS Protection**: Input sanitization and output escaping
- **File Upload Validation**: Image type and size restrictions
- **Rate Limiting**: Login attempt limitations
- **Session Security**: Secure session configuration

## 🌐 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📱 Mobile Responsiveness

The application is fully responsive and optimized for:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🔄 Version History

### v1.0.0 (Current)
- Initial release
- Complete e-commerce functionality
- Admin dashboard
- Payment processing
- Order management

## 🚀 Future Enhancements

- [ ] Email notifications
- [ ] SMS integration
- [ ] Advanced analytics
- [ ] Multi-language support
- [ ] API for mobile app
- [ ] Advanced search filters
- [ ] Inventory management
- [ ] Shipping integration
- [ ] Customer reviews
- [ ] Wishlist functionality

## 🙏 Acknowledgments

- Laravel Framework
- React & TypeScript
- Tailwind CSS
- Inertia.js
- All contributors and open-source libraries used

---

**Made with ❤️ by TepianTeknologi Team**
