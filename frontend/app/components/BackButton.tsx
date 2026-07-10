'use client';

import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

interface BackButtonProps {
  fallbackUrl?: string;
  title?: string;
  className?: string;
}

export default function BackButton({ 
  fallbackUrl = '/', 
  title = 'Retour',
  className = ''
}: BackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push(fallbackUrl);
    }
  };

  return (
    <button
      onClick={handleBack}
      className={className}
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        color: '#2563eb',
        fontSize: '1rem',
        padding: '0.5rem 0',
        fontFamily: 'inherit',
        transition: 'color 0.2s',
        textDecoration: 'none'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = '#1d4ed8';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = '#2563eb';
      }}
      title={title}
    >
      <FontAwesomeIcon icon={faArrowLeft} />
      {title}
    </button>
  );
}
