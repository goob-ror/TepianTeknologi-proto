export default function BenefitSection() {
  return (
    <div 
      className="benefit-section w-full m-0 py-5 border-b border-gray-300"
      style={{
        backgroundColor: 'var(--secondary-color)'
      }}
    >
      <div 
        className="benefit-content flex flex-row items-center justify-around w-auto h-auto mx-auto px-25 gap-2.5"
        style={{
          fontFamily: 'var(--main-font)',
          fontSize: 'var(--font-size-medium)',
          fontWeight: 'var(--font-weight-regular)',
          padding: '0 100px'
        }}
      >
        <div className="benefit-diskon text-center flex-1">
          <h1 
            className="flex items-center justify-center gap-2.5 m-0 h-12.5"
            style={{
              fontSize: 'var(--font-size-xlarge)',
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--grey-text)'
            }}
          >
            Spesial <span style={{ color: 'var(--primary-color)', fontWeight: 'var(--font-weight-bold)' }}>DISKON!</span>
          </h1>
        </div>
        
        <div className="benefit-ongkir text-center flex-1 border-l-2 border-gray-300">
          <h1 
            className="flex items-center justify-center gap-2.5 m-0 h-12.5"
            style={{
              fontSize: 'var(--font-size-xlarge)',
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--grey-text)'
            }}
          >
            <span>
              <img src="/logo/ongkir-logo.png" className="w-12.5 h-12.5 object-contain" alt="Ongkir" />
            </span>
            Gratis Ongkir
          </h1>
        </div>
        
        <div className="benefit-services text-center flex-1 border-l-2 border-gray-300">
          <h1 
            className="flex items-center justify-center gap-2.5 m-0 h-12.5"
            style={{
              fontSize: 'var(--font-size-xlarge)',
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--grey-text)'
            }}
          >
            <span>
              <img src="/logo/services-logo.png" className="w-12.5 h-12.5 object-contain" alt="Services" />
            </span>
            24/7 Services
          </h1>
        </div>
        
        <div className="benefit-offers text-center flex-1 border-l-2 border-gray-300">
          <h1 
            className="flex items-center justify-center gap-2.5 m-0 h-12.5"
            style={{
              fontSize: 'var(--font-size-xlarge)',
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--grey-text)'
            }}
          >
            <span>
              <img src="/logo/specialoffer-logo.png" className="w-12.5 h-12.5 object-contain" alt="Special Offers" />
            </span>
            Special Offers
          </h1>
        </div>
        
        <div className="benefit-payment text-center flex-1 border-l-2 border-gray-300">
          <h1 
            className="flex items-center justify-center gap-2.5 m-0 h-12.5"
            style={{
              fontSize: 'var(--font-size-xlarge)',
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--grey-text)'
            }}
          >
            Online <span style={{ color: 'var(--primary-color)', fontWeight: 'var(--font-weight-bold)' }}>Payment!</span>
          </h1>
        </div>
      </div>
    </div>
  );
}
