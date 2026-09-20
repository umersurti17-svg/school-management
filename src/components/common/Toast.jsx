import { Toaster } from 'react-hot-toast';

export default function Toast() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          borderRadius: '12px',
          background: '#1F2937',
          color: '#F9FAFB',
          fontSize: '14px',
        },
        success: {
          iconTheme: {
            primary: '#16A34A',
            secondary: '#F9FAFB',
          },
        },
        error: {
          iconTheme: {
            primary: '#DC2626',
            secondary: '#F9FAFB',
          },
        },
      }}
    />
  );
}
