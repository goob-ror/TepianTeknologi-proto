import { useState } from 'react';

interface GoogleMapProps {
  latitude: number;
  longitude: number;
  className?: string;
  style?: React.CSSProperties;
}

export default function GoogleMap({
  latitude,
  longitude,
  className = '',
  style = {}
}: GoogleMapProps) {
  const [mapType, setMapType] = useState<'roadmap' | 'satellite'>('satellite');

  const defaultStyle: React.CSSProperties = {
    width: '100%',
    height: '350px',
    borderRadius: '12px',
    border: '1px solid #eee',
    ...style
  };

  const googleMapsEmbedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d251.95212411804192!2d117.11522296835231!3d-0.48585780383054084!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2df67f00645fb879%3A0xd014ef7a7686810e!2sBackSlash%20Coffe!5e1!3m2!1sen!2sid!4v1750207281582!5m2!1sen!2sid";

  return (
    <div className={className} style={{ position: 'relative' }}>
      <iframe
        src={googleMapsEmbedUrl}
        style={defaultStyle}
        title="Lokasi Tepian Teknologi"
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />      
    </div>
  );
}
