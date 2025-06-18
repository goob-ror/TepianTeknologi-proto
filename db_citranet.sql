
CREATE DATABASE IF NOT EXISTS db_citranet;
USE db_citranet;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(30) NOT NULL UNIQUE,
    nama_lengkap VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    no_hp VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email)
);

CREATE TABLE kategori_produk (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama_kategori VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE brand_produk (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama_brand VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE produk (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama_produk VARCHAR(150) NOT NULL,
    deskripsi TEXT,
    harga DECIMAL(12,2) NOT NULL CHECK (harga >= 0),
    stok INT NOT NULL DEFAULT 0 CHECK (stok >= 0),
    gambar VARCHAR(255),
    kategori_id INT NOT NULL,
    brand_id INT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (kategori_id) REFERENCES kategori_produk(id) ON DELETE RESTRICT,
    FOREIGN KEY (brand_id) REFERENCES brand_produk(id) ON DELETE RESTRICT,
    INDEX idx_kategori (kategori_id),
    INDEX idx_brand (brand_id),
    INDEX idx_harga (harga),
    INDEX idx_active (is_active)
);

CREATE TABLE pesanan (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    nama_penerima VARCHAR(100) NOT NULL,
    alamat TEXT NOT NULL,
    no_hp_penerima VARCHAR(20),
    catatan TEXT,
    status ENUM('menunggu', 'dibayar', 'dikirim', 'selesai', 'dibatalkan') DEFAULT 'menunggu',
    total_harga DECIMAL(12,2) NOT NULL CHECK (total_harga >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
    INDEX idx_user (user_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
);

CREATE TABLE detail_pesanan (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pesanan_id INT NOT NULL,
    produk_id INT NOT NULL,
    jumlah INT NOT NULL CHECK (jumlah > 0),
    harga_satuan DECIMAL(12,2) NOT NULL CHECK (harga_satuan >= 0),
    subtotal DECIMAL(12,2) GENERATED ALWAYS AS (jumlah * harga_satuan) STORED,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pesanan_id) REFERENCES pesanan(id) ON DELETE CASCADE,
    FOREIGN KEY (produk_id) REFERENCES produk(id) ON DELETE RESTRICT,
    INDEX idx_pesanan (pesanan_id),
    INDEX idx_produk (produk_id),
    UNIQUE KEY unique_pesanan_produk (pesanan_id, produk_id)
);

CREATE TABLE pembayaran (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pesanan_id INT NOT NULL,
    metode VARCHAR(100) NOT NULL,
    bukti_transfer VARCHAR(255),
    status ENUM('menunggu_validasi', 'valid', 'tidak_valid') DEFAULT 'menunggu_validasi',
    jumlah_bayar DECIMAL(12,2) NOT NULL CHECK (jumlah_bayar >= 0),
    tanggal_bayar TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    validated_at TIMESTAMP NULL,
    validated_by INT NULL,
    catatan_validasi TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (pesanan_id) REFERENCES pesanan(id) ON DELETE CASCADE,
    FOREIGN KEY (validated_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_pesanan (pesanan_id),
    INDEX idx_status (status),
    INDEX idx_tanggal_bayar (tanggal_bayar)
);

CREATE TABLE pengiriman (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pesanan_id INT NOT NULL,
    nomor_resi VARCHAR(100),
    jasa_kirim VARCHAR(100) NOT NULL,
    status_kirim ENUM('belum_dikirim', 'dikirim', 'dalam_perjalanan', 'sampai') DEFAULT 'belum_dikirim',
    tanggal_kirim TIMESTAMP NULL,
    tanggal_sampai TIMESTAMP NULL,
    biaya_kirim DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (pesanan_id) REFERENCES pesanan(id) ON DELETE CASCADE,
    INDEX idx_pesanan (pesanan_id),
    INDEX idx_status (status_kirim),
    INDEX idx_resi (nomor_resi)
);
