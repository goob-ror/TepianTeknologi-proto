# TepianTeknologi E-Commerce Platform

![TepianTeknologi Logo](public/logo/TepianTeknologi-Logo.png)

A modern e-commerce platform built with Laravel 12, React 19, TypeScript, and Tailwind CSS v4. This platform provides a complete solution for technology product sales with admin dashboard, order management, payment processing, and more.

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
- **React 19 + TypeScript**: Type-safe frontend development with latest React features
- **Inertia.js**: SPA experience without API complexity
- **Tailwind CSS v4**: Modern utility-first CSS framework with latest features
- **MySQL Database**: Robust relational database management
- **PDF Generation**: Transaction proof documents
- **File Upload**: Image handling with validation
- **Testing**: Comprehensive test suite with Pest

## 📋 System Requirements

Before installing this project, ensure your system meets the following requirements:

### Required Software
- **PHP**: ^8.2 (with required extensions)
- **Node.js**: ^18.0 or higher (LTS recommended)
- **NPM**: ^9.0 or higher (comes with Node.js)
- **Composer**: ^2.0 or higher
- **Git**: Latest version

### PHP Extensions Required
- BCMath PHP Extension
- Ctype PHP Extension
- cURL PHP Extension
- DOM PHP Extension
- Fileinfo PHP Extension
- JSON PHP Extension
- Mbstring PHP Extension
- OpenSSL PHP Extension
- PCRE PHP Extension
- PDO PHP Extension
- Tokenizer PHP Extension
- XML PHP Extension
- GD PHP Extension (for image processing)
- SQLite3 PHP Extension (if using SQLite)

### Required Database
- **MySQL**: ^8.0 (primary database)

### Optional but Recommended
- **Redis**: ^6.0 (for caching and sessions)
- **Supervisor**: For queue management in production

## 🛠️ Installation & Setup

### Step 1: Verify System Requirements

Before starting, verify that your system has all required software installed:

```bash
# Check PHP version (should be 8.2 or higher)
php --version

# Check Node.js version (should be 18.0 or higher)
node --version

# Check NPM version (should be 9.0 or higher)
npm --version

# Check Composer version (should be 2.0 or higher)
composer --version

# Check Git version
git --version
```

If any of these are missing or outdated, install/update them:

**For Windows:**
- Download PHP from [php.net](https://www.php.net/downloads.php)
- Download MySQL from [mysql.com](https://dev.mysql.com/downloads/mysql/) or use XAMPP
- Download Node.js from [nodejs.org](https://nodejs.org/) (LTS version recommended)
- Download Composer from [getcomposer.org](https://getcomposer.org/download/)
- Download Git from [git-scm.com](https://git-scm.com/download/win)

**For macOS:**
```bash
# Using Homebrew
brew install php@8.2 mysql node composer git

# Start MySQL service
brew services start mysql

# Secure MySQL installation
mysql_secure_installation
```

**For Ubuntu/Debian:**
```bash
# Update package list
sudo apt update

# Install PHP 8.2 and extensions
sudo apt install php8.2 php8.2-cli php8.2-common php8.2-mysql php8.2-zip php8.2-gd php8.2-mbstring php8.2-curl php8.2-xml php8.2-bcmath

# Install MySQL Server
sudo apt install mysql-server
sudo mysql_secure_installation

# Install Node.js (using NodeSource repository)
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Composer
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer

# Install Git
sudo apt install git
```

### Step 2: Clone the Repository

```bash
# Clone the repository
git clone https://github.com/your-username/TepianTeknologi-proto.git

# Navigate to project directory
cd TepianTeknologi-proto

# Verify you're in the correct directory
pwd
ls -la
```

### Step 3: Install PHP Dependencies

```bash
# Install Composer dependencies
composer install

# If you encounter memory issues, try:
composer install --no-dev --optimize-autoloader

# Verify installation
composer show
```

### Step 4: Install Node.js Dependencies

```bash
# Clear npm cache (recommended)
npm cache clean --force

# Install Node.js dependencies
npm install

# If you encounter permission issues on Linux/macOS:
sudo npm install

# Alternative: Use npm ci for faster, reliable installs
npm ci

# Verify installation
npm list --depth=0
```

### Step 5: Environment Configuration

```bash
# Copy environment file (Windows)
copy .env.example .env

# Copy environment file (Linux/macOS)
cp .env.example .env

# Generate application key
php artisan key:generate

# Verify the key was generated
php artisan config:show app.key
```

### Step 6: Configure Environment Variables

Open the `.env` file in your preferred text editor and configure the following:

```env
# Application Settings
APP_NAME="TepianTeknologi"
APP_ENV=local
APP_KEY=base64:your-generated-key-will-be-here
APP_DEBUG=true
APP_URL=http://localhost:8000

# Locale Settings
APP_LOCALE=en
APP_FALLBACK_LOCALE=en
APP_FAKER_LOCALE=en_US

# Database Configuration (MySQL)
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=tepian_teknologi
DB_USERNAME=root
DB_PASSWORD=your_mysql_password

# Session & Cache Configuration
SESSION_DRIVER=database
SESSION_LIFETIME=120
CACHE_STORE=database
QUEUE_CONNECTION=database

# File Storage
FILESYSTEM_DISK=local

# Mail Configuration (for production)
MAIL_MAILER=log
MAIL_FROM_ADDRESS="noreply@tepianteknologi.com"
MAIL_FROM_NAME="${APP_NAME}"

# Vite Configuration
VITE_APP_NAME="${APP_NAME}"
```

### Step 7: Database Setup

#### Create MySQL Database

**For XAMPP Users (Windows):**
1. Start XAMPP Control Panel
2. Start Apache and MySQL services
3. Click "Admin" next to MySQL to open phpMyAdmin
4. Create database `tepian_teknologi` with utf8mb4_unicode_ci collation
5. Use `root` user with no password (default XAMPP setup)

**For Standard MySQL Installation:**
```bash
# Connect to MySQL as root
mysql -u root -p

# Create database and user (run these commands in MySQL prompt)
```

```sql
-- Create database
CREATE DATABASE tepian_teknologi CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create user (replace 'your_password' with a secure password)
CREATE USER 'tepian_user'@'localhost' IDENTIFIED BY 'your_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON tepian_teknologi.* TO 'tepian_user'@'localhost';

-- Apply changes
FLUSH PRIVILEGES;

-- Exit MySQL
EXIT;
```

#### Update Environment Configuration

Update your `.env` file with the database credentials:

**For XAMPP (Windows):**
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=tepian_teknologi
DB_USERNAME=root
DB_PASSWORD=
```

**For Standard MySQL Installation:**
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=tepian_teknologi
DB_USERNAME=tepian_user
DB_PASSWORD=your_password
```

#### Run Migrations and Seeders

```bash
# Test database connection
php artisan tinker
>>> DB::connection()->getPdo();
>>> exit

# Run database migrations
php artisan migrate

# If you want to start fresh (drops all tables and recreates them)
php artisan migrate:fresh

# Seed database with sample data
php artisan db:seed

# Verify database setup
php artisan migrate:status

# Check if tables were created
mysql -u tepian_user -p tepian_teknologi -e "SHOW TABLES;"
```

### Step 8: Storage and Permissions Setup

```bash
# Create symbolic link for file uploads
php artisan storage:link

# Set proper permissions (Linux/macOS)
chmod -R 775 storage
chmod -R 775 bootstrap/cache

# For Windows, ensure the web server has write access to:
# - storage/ directory
# - bootstrap/cache/ directory
# - database/ directory (if using SQLite)

# Verify storage link
ls -la public/storage
```

### Step 9: Build Frontend Assets

```bash
# Install and build assets for development
npm run dev

# For production build
npm run build

# Verify build completed successfully
ls -la public/build/
```

## 🚀 Running the Application

### Step 10: Start the Development Server

You have several options to run the application:

#### Option A: Quick Start (Recommended)
```bash
# Start all services with one command
composer run dev
```

This single command will start:
- Laravel development server (http://localhost:8000)
- Queue worker for background jobs
- Vite development server for hot reloading and asset compilation

#### Option B: Manual Start (Multiple Terminals)
If you prefer more control or the quick start doesn't work:

**Terminal 1 - Laravel Server:**
```bash
# Start Laravel development server
php artisan serve

# Server will be available at: http://localhost:8000
# To use a different port:
php artisan serve --port=8080
```

**Terminal 2 - Vite Development Server:**
```bash
# Start Vite for hot reloading and asset compilation
npm run dev

# This enables hot module replacement (HMR) for React components
```

**Terminal 3 - Queue Worker (Optional but recommended):**
```bash
# Start queue worker for background jobs
php artisan queue:work

# For development with auto-restart on code changes:
php artisan queue:listen
```

#### Option C: Production Mode

For production deployment:

```bash
# Build optimized assets for production
npm run build

# Clear and cache configuration
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Start with production server (Apache/Nginx)
# Configure your web server to point to /public directory
```

### Step 11: Verify Installation

Open your browser and navigate to `http://localhost:8000`. You should see:

1. **Homepage**: The TepianTeknologi e-commerce homepage
2. **Admin Access**: Navigate to `/admin/dashboard` (default credentials below)
3. **User Registration**: Test user registration at `/register`

**Default Admin Credentials:**
- **Email**: admin@example.com
- **Password**: password

**Test the following features:**
- Browse products in the catalog
- Add items to cart
- Register a new user account
- Login to admin dashboard
- Create a test product
- Process a test order

### Troubleshooting Common Issues

#### Issue 1: Port Already in Use
```bash
# Check what's using port 8000
netstat -tulpn | grep :8000

# Use a different port
php artisan serve --port=8080
```

#### Issue 2: Permission Denied Errors
```bash
# Linux/macOS - Fix permissions
sudo chown -R $USER:www-data storage bootstrap/cache
chmod -R 775 storage bootstrap/cache

# Windows - Run command prompt as Administrator
```

#### Issue 3: Database Connection Issues
```bash
# Verify database file exists (SQLite)
ls -la database/database.sqlite

# Check database configuration
php artisan config:show database.connections.sqlite

# Reset database if needed
php artisan migrate:fresh --seed
```

#### Issue 4: NPM/Node Issues
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Update Node.js if version is too old
```

#### Issue 5: Composer Issues
```bash
# Clear Composer cache
composer clear-cache

# Update Composer
composer self-update

# Reinstall dependencies
rm -rf vendor composer.lock
composer install
```

## 📁 Project Structure

```
TepianTeknologi-proto/
├── app/                           # Laravel Application Code
│   ├── Http/
│   │   ├── Controllers/           # HTTP Controllers
│   │   │   ├── Auth/             # Authentication controllers
│   │   │   ├── admin/            # Admin panel controllers
│   │   │   └── Settings/         # User settings controllers
│   │   ├── Middleware/           # HTTP Middleware
│   │   └── Requests/             # Form request validation
│   ├── Models/                   # Eloquent Models
│   │   ├── User.php             # User model
│   │   ├── Product.php          # Product model
│   │   ├── Pesanan.php          # Order model
│   │   └── ...                  # Other models
│   ├── enum/                    # PHP Enums
│   └── Providers/               # Service providers
├── bootstrap/                   # Bootstrap Files
│   └── cache/                  # Framework cache files
├── config/                     # Configuration Files
│   ├── app.php                # Application configuration
│   ├── database.php           # Database configuration
│   └── ...                    # Other config files
├── database/                   # Database Files
│   ├── factories/             # Model factories for testing
│   ├── migrations/            # Database migrations
│   └── seeders/              # Database seeders
├── public/                    # Public Web Directory
│   ├── build/                # Compiled assets (generated)
│   ├── images/               # Static images
│   │   ├── product/         # Product images
│   │   └── logo/            # Logo files
│   ├── icons/               # UI icons and favicons
│   ├── storage/             # Symlink to storage/app/public
│   └── index.php            # Application entry point
├── resources/                 # Frontend Resources
│   ├── js/                   # JavaScript/TypeScript Code
│   │   ├── components/       # Reusable React components
│   │   │   ├── ui/          # UI components (buttons, forms, etc.)
│   │   │   ├── Navigation.tsx
│   │   │   └── ...
│   │   ├── pages/           # Page components
│   │   │   ├── auth/        # Authentication pages
│   │   │   ├── admin/       # Admin panel pages
│   │   │   └── ...
│   │   ├── layouts/         # Layout components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── utils/           # Utility functions
│   │   ├── types/           # TypeScript type definitions
│   │   └── app.tsx          # Main React application
│   ├── css/                 # Stylesheets
│   │   └── app.css         # Main stylesheet
│   └── views/               # Blade templates (minimal usage)
├── routes/                   # Route Definitions
│   ├── web.php             # Web routes
│   ├── auth.php            # Authentication routes
│   └── settings.php        # Settings routes
├── storage/                  # Application Storage
│   ├── app/                # Application files
│   │   ├── public/         # Publicly accessible files
│   │   └── private/        # Private files
│   ├── framework/          # Framework cache and sessions
│   └── logs/               # Application logs
├── tests/                   # Test Files
│   ├── Feature/            # Feature tests
│   ├── Unit/               # Unit tests
│   └── TestHelpers.php     # Test helper functions
├── vendor/                  # Composer Dependencies
├── .env.example            # Environment variables template
├── composer.json           # PHP dependencies
├── package.json            # Node.js dependencies
├── vite.config.ts          # Vite configuration
├── tailwind.config.js      # Tailwind CSS configuration
└── README.md               # This file
```

## 📦 Key Dependencies

### Backend (PHP/Laravel)
- **Laravel Framework**: ^12.0 - Core framework
- **Inertia.js Laravel**: ^2.0 - Server-side adapter for Inertia.js
- **Laravel DomPDF**: ^3.1 - PDF generation
- **Ziggy**: ^2.4 - Route generation for JavaScript

### Frontend (JavaScript/TypeScript)
- **React**: ^19.0.0 - UI library with latest features
- **TypeScript**: ^5.7.2 - Type safety
- **Vite**: ^6.0 - Build tool and dev server
- **Tailwind CSS**: ^4.0.0 - Utility-first CSS framework
- **Inertia.js React**: ^2.0.0 - Client-side adapter
- **Radix UI**: Various components for accessible UI
- **Lucide React**: ^0.475.0 - Icon library
- **SweetAlert2**: ^11.21.0 - Beautiful alerts
- **Recharts**: ^2.15.3 - Charts and data visualization

### Development Tools
- **Pest**: ^3.8 - Testing framework
- **Laravel Pint**: ^1.18 - Code style fixer
- **ESLint**: ^9.17.0 - JavaScript linting
- **Prettier**: ^3.4.2 - Code formatting

## 🧪 Testing

The project includes a comprehensive test suite using Pest PHP testing framework.

### Running Tests

```bash
# Run all tests
composer run test

# Alternative: Run tests directly with Pest
./vendor/bin/pest

# Run tests with verbose output
./vendor/bin/pest --verbose

# Run specific test file
./vendor/bin/pest tests/Feature/Auth/AuthenticationTest.php

# Run specific test group
./vendor/bin/pest --filter="AuthenticationTest"

# Run tests with coverage (requires Xdebug)
./vendor/bin/pest --coverage

# Run tests and stop on first failure
./vendor/bin/pest --stop-on-failure
```

### Test Categories

**Feature Tests:**
- Authentication and authorization
- User registration and login
- Product management
- Order processing
- Payment proof upload
- Admin dashboard functionality

**Unit Tests:**
- Model relationships
- Helper functions
- Business logic

### Writing Tests

Tests are located in the `tests/` directory:
- `tests/Feature/` - Integration tests
- `tests/Unit/` - Unit tests
- `tests/TestHelpers.php` - Helper functions

Example test structure:
```php
<?php

test('user can register with valid data', function () {
    $response = $this->post('/register', [
        'name' => 'Test User',
        'phone' => '081234567890',
        'email' => 'test@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('dashboard'));
});
```

## 📦 Production Deployment

### Prerequisites for Production

**Server Requirements:**
- **Operating System**: Ubuntu 20.04+ / CentOS 8+ / Amazon Linux 2
- **PHP**: 8.2+ with all required extensions
- **Web Server**: Nginx (recommended) or Apache 2.4+
- **Database**: MySQL 8.0+ or PostgreSQL 13+ (SQLite not recommended for production)
- **Memory**: Minimum 2GB RAM (4GB+ recommended)
- **Storage**: Minimum 10GB free space

### Step-by-Step Production Deployment

#### 1. Server Setup

**Install Required Software (Ubuntu/Debian):**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install PHP 8.2 and extensions
sudo apt install software-properties-common
sudo add-apt-repository ppa:ondrej/php
sudo apt update
sudo apt install php8.2 php8.2-fpm php8.2-mysql php8.2-pgsql php8.2-sqlite3 \
    php8.2-gd php8.2-curl php8.2-zip php8.2-xml php8.2-mbstring \
    php8.2-bcmath php8.2-intl php8.2-redis

# Install Nginx
sudo apt install nginx

# Install MySQL
sudo apt install mysql-server
sudo mysql_secure_installation

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Composer
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer
```

#### 2. Deploy Application Code

```bash
# Create application directory
sudo mkdir -p /var/www/tepianteknologi
cd /var/www/tepianteknologi

# Clone repository
sudo git clone https://github.com/your-username/TepianTeknologi-proto.git .

# Set ownership
sudo chown -R www-data:www-data /var/www/tepianteknologi

# Install PHP dependencies (production optimized)
sudo -u www-data composer install --optimize-autoloader --no-dev --no-interaction

# Install Node.js dependencies and build assets
sudo -u www-data npm ci --only=production
sudo -u www-data npm run build
```

#### 3. Environment Configuration

```bash
# Copy and configure environment file
sudo -u www-data cp .env.example .env
sudo -u www-data php artisan key:generate

# Edit environment file for production
sudo nano .env
```

**Production .env Configuration:**
```env
APP_NAME="TepianTeknologi"
APP_ENV=production
APP_KEY=base64:your-generated-key
APP_DEBUG=false
APP_URL=https://your-domain.com

# Database (MySQL example)
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=tepian_teknologi
DB_USERNAME=tepian_user
DB_PASSWORD=secure_password

# Cache and Sessions (Redis recommended)
CACHE_STORE=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis

# Redis Configuration
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

# Mail Configuration
MAIL_MAILER=smtp
MAIL_HOST=your-smtp-server.com
MAIL_PORT=587
MAIL_USERNAME=your-email@domain.com
MAIL_PASSWORD=your-email-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="noreply@your-domain.com"
MAIL_FROM_NAME="${APP_NAME}"

# File Storage (for production, consider S3)
FILESYSTEM_DISK=local

# Security
SESSION_SECURE_COOKIE=true
SESSION_SAME_SITE=strict
```

#### 4. Database Setup

```bash
# Create database and user (MySQL)
sudo mysql -u root -p
```

```sql
CREATE DATABASE tepian_teknologi CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'tepian_user'@'localhost' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON tepian_teknologi.* TO 'tepian_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

```bash
# Run migrations and seeders
sudo -u www-data php artisan migrate --force
sudo -u www-data php artisan db:seed --force
```

#### 5. Set Permissions

```bash
# Set proper ownership and permissions
sudo chown -R www-data:www-data /var/www/tepianteknologi
sudo chmod -R 755 /var/www/tepianteknologi
sudo chmod -R 775 /var/www/tepianteknologi/storage
sudo chmod -R 775 /var/www/tepianteknologi/bootstrap/cache

# Create storage link
sudo -u www-data php artisan storage:link
```

#### 6. Optimize for Production

```bash
# Cache configuration, routes, and views
sudo -u www-data php artisan config:cache
sudo -u www-data php artisan route:cache
sudo -u www-data php artisan view:cache

# Clear any development caches
sudo -u www-data php artisan cache:clear
```

#### 7. Web Server Configuration

**Nginx Configuration (`/etc/nginx/sites-available/tepianteknologi`):**
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    root /var/www/tepianteknologi/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.php;

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

```bash
# Enable site and restart Nginx
sudo ln -s /etc/nginx/sites-available/tepianteknologi /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 8. SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Verify auto-renewal
sudo certbot renew --dry-run
```

#### 9. Process Management (Supervisor)

```bash
# Install Supervisor
sudo apt install supervisor

# Create worker configuration
sudo nano /etc/supervisor/conf.d/tepianteknologi-worker.conf
```

**Supervisor Configuration:**
```ini
[program:tepianteknologi-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/tepianteknologi/artisan queue:work --sleep=3 --tries=3 --max-time=3600
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
user=www-data
numprocs=2
redirect_stderr=true
stdout_logfile=/var/www/tepianteknologi/storage/logs/worker.log
stopwaitsecs=3600
```

```bash
# Start Supervisor
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start tepianteknologi-worker:*
```

### Docker Deployment (Alternative)

If you prefer containerized deployment:

```bash
# Install Docker and Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Using Laravel Sail for production
./vendor/bin/sail up -d --build

# Or create custom production Dockerfile
```

### Monitoring and Maintenance

```bash
# Monitor application logs
tail -f /var/www/tepianteknologi/storage/logs/laravel.log

# Monitor Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# Monitor queue workers
sudo supervisorctl status

# Update application
cd /var/www/tepianteknologi
sudo -u www-data git pull origin main
sudo -u www-data composer install --optimize-autoloader --no-dev
sudo -u www-data npm run build
sudo -u www-data php artisan migrate --force
sudo -u www-data php artisan config:cache
sudo -u www-data php artisan route:cache
sudo -u www-data php artisan view:cache
sudo supervisorctl restart tepianteknologi-worker:*
```

## 🔧 Configuration

### Key Configuration Files

- `config/app.php` - Application settings
- `config/database.php` - Database configuration
- `config/filesystems.php` - File storage settings
- `vite.config.ts` - Frontend build configuration
- `tailwind.config.js` - Tailwind CSS configuration

### Default Accounts

**Admin Account (change in production):**
- **Email**: admin@example.com
- **Password**: password
- **Role**: admin

**Test User Account:**
- **Email**: user@example.com
- **Password**: password
- **Role**: user

> ⚠️ **Security Warning**: Change these default credentials immediately in production!

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

## 🐛 Comprehensive Troubleshooting Guide

### Installation Issues

#### Issue 1: PHP Version or Extensions Missing
**Symptoms**: Composer install fails, "PHP extension required" errors

**Solutions**:
```bash
# Check PHP version
php --version

# Check installed extensions
php -m

# Install missing extensions (Ubuntu/Debian)
sudo apt install php8.2-{extension-name}

# Install missing extensions (Windows with XAMPP)
# Edit php.ini and uncomment required extensions
```

#### Issue 2: Node.js/NPM Version Issues
**Symptoms**: "npm ERR!" messages, build failures

**Solutions**:
```bash
# Check versions
node --version
npm --version

# Update Node.js to LTS version
# Windows: Download from nodejs.org
# macOS: brew install node
# Linux: Use NodeSource repository

# Clear npm cache
npm cache clean --force

# Update npm
npm install -g npm@latest
```

#### Issue 3: Composer Memory Limit
**Symptoms**: "Fatal error: Allowed memory size exhausted"

**Solutions**:
```bash
# Increase memory limit temporarily
php -d memory_limit=2G /usr/local/bin/composer install

# Or set in php.ini
memory_limit = 2G
```

### Runtime Issues

#### Issue 4: Permission Errors
**Symptoms**: "Permission denied", file write errors

**Solutions**:
```bash
# Linux/macOS
sudo chown -R $USER:www-data storage bootstrap/cache
chmod -R 775 storage bootstrap/cache

# Windows (run as Administrator)
icacls storage /grant Everyone:F /T
icacls bootstrap\cache /grant Everyone:F /T
```

#### Issue 5: Database Connection Issues
**Symptoms**: "Database connection failed", migration errors

**Solutions**:
```bash
# Check database configuration
php artisan config:show database.connections.mysql

# Test database connection
php artisan tinker
>>> DB::connection()->getPdo();

# Verify MySQL service is running
sudo systemctl status mysql

# Test MySQL connection directly
mysql -u tepian_user -p tepian_teknologi -e "SELECT 1;"

# Check if database exists
mysql -u root -p -e "SHOW DATABASES LIKE 'tepian_teknologi';"

# Verify user permissions
mysql -u root -p -e "SHOW GRANTS FOR 'tepian_user'@'localhost';"

# Reset MySQL password if needed
sudo mysql -u root -p
ALTER USER 'tepian_user'@'localhost' IDENTIFIED BY 'new_password';
FLUSH PRIVILEGES;
```

#### Issue 6: Asset Build Issues
**Symptoms**: Vite build fails, CSS/JS not loading

**Solutions**:
```bash
# Clear all caches and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install

# Check for port conflicts
netstat -tulpn | grep :5173

# Build with verbose output
npm run build -- --debug

# For Windows path issues
npm config set script-shell "C:\\Program Files\\git\\bin\\bash.exe"
```

#### Issue 7: Queue Jobs Not Processing
**Symptoms**: Jobs stuck in queue, background tasks not running

**Solutions**:
```bash
# Restart queue workers
php artisan queue:restart

# Check failed jobs
php artisan queue:failed

# Retry failed jobs
php artisan queue:retry all

# Monitor queue in real-time
php artisan queue:work --verbose
```

#### Issue 8: Storage Link Issues
**Symptoms**: Uploaded files not accessible, 404 errors for images

**Solutions**:
```bash
# Remove existing link and recreate
rm public/storage
php artisan storage:link

# Verify link exists
ls -la public/storage

# Check storage permissions
chmod -R 775 storage/app/public
```

#### Issue 9: Session/Authentication Issues
**Symptoms**: Users logged out randomly, session data lost

**Solutions**:
```bash
# Clear all caches
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Check session configuration
php artisan config:show session

# Verify session storage permissions
chmod -R 775 storage/framework/sessions
```

#### Issue 10: Environment Configuration Issues
**Symptoms**: Config values not updating, wrong environment detected

**Solutions**:
```bash
# Clear config cache
php artisan config:clear

# Verify environment
php artisan env

# Check for syntax errors in .env
php artisan config:show app
```

### Performance Issues

#### Issue 11: Slow Page Load Times
**Solutions**:
```bash
# Enable caching
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Optimize Composer autoloader
composer install --optimize-autoloader

# Enable OPcache in php.ini
opcache.enable=1
opcache.memory_consumption=128
```

#### Issue 12: High Memory Usage
**Solutions**:
```bash
# Monitor memory usage
php artisan tinker
>>> memory_get_usage(true);

# Optimize database queries
php artisan debugbar:publish

# Use eager loading for relationships
# In models: $with = ['relation'];
```

### Development Environment Issues

#### Issue 13: Hot Reload Not Working
**Solutions**:
```bash
# Check Vite configuration
cat vite.config.ts

# Restart Vite dev server
npm run dev

# Clear browser cache
# Chrome: Ctrl+Shift+R
# Firefox: Ctrl+F5
```

#### Issue 14: TypeScript Errors
**Solutions**:
```bash
# Check TypeScript configuration
npx tsc --noEmit

# Update type definitions
npm update @types/react @types/react-dom

# Clear TypeScript cache
rm -rf node_modules/.cache
```

### Production Issues

#### Issue 15: 500 Internal Server Error
**Solutions**:
```bash
# Check Laravel logs
tail -f storage/logs/laravel.log

# Check web server logs
# Nginx: tail -f /var/log/nginx/error.log
# Apache: tail -f /var/log/apache2/error.log

# Verify file permissions
find . -type f -exec chmod 644 {} \;
find . -type d -exec chmod 755 {} \;
chmod -R 775 storage bootstrap/cache
```

#### Issue 16: SSL/HTTPS Issues
**Solutions**:
```bash
# Verify SSL certificate
openssl s_client -connect your-domain.com:443

# Check certificate expiration
echo | openssl s_client -servername your-domain.com -connect your-domain.com:443 2>/dev/null | openssl x509 -noout -dates

# Renew Let's Encrypt certificate
sudo certbot renew
```

### Getting Help

If you're still experiencing issues:

1. **Check Laravel Documentation**: [laravel.com/docs](https://laravel.com/docs)
2. **Search GitHub Issues**: Look for similar problems in the repository
3. **Laravel Community**: [laracasts.com](https://laracasts.com), [laravel.io](https://laravel.io)
4. **Stack Overflow**: Tag your questions with `laravel`, `react`, `inertiajs`
5. **Create an Issue**: If you found a bug, create a detailed issue report

**When reporting issues, include**:
- Operating system and version
- PHP version (`php --version`)
- Node.js version (`node --version`)
- Error messages (full stack trace)
- Steps to reproduce the issue
- What you expected to happen

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

**Made by SecangkirKopi**