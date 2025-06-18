

export default function BreakContact() {
  return (
    <div
      className="break-contact"
      style={{
        maxWidth: '600px',
        margin: '40px auto',
        padding: '10px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px'
      }}
    >
      <h1 style={{
        color: 'var(--grey-text)',
        fontFamily: 'var(--main-font)',
        fontSize: 'var(--font-size-xxlarge)',
        fontWeight: 'var(--font-weight-semibold)',
        textAlign: 'center',
        margin: '0'
      }}>
        Hubungkan Dengan <span style={{ color: 'var(--primary-color)' }}>Admin</span> Untuk Produk Yang Anda Cari!
      </h1>
      <button
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          backgroundColor: 'var(--primary-color)',
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: 'var(--font-size-medium)',
          fontWeight: 'var(--font-weight-semibold)',
          transition: 'background-color 0.3s ease'
        }}
        onMouseEnter={(e) => {
          const target = e.target as HTMLButtonElement;
          target.style.backgroundColor = '#285eff';
        }}
        onMouseLeave={(e) => {
          const target = e.target as HTMLButtonElement;
          target.style.backgroundColor = 'var(--primary-color)';
        }}
      >
        <img
          src="/logo/WhatsApp-White-Logo.png"
          alt="WhatsApp"
          style={{
            width: '24px',
            height: '24px',
            objectFit: 'contain'
          }}
        />
        Hubungkan Sekarang
      </button>
    </div>
  );
}
