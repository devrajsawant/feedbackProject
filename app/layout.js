import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import Link from 'next/link';
import { Toaster } from 'react-hot-toast';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Toaster />
        <MantineProvider>
            {children}
        </MantineProvider>
      </body>
    </html>
  );
}
