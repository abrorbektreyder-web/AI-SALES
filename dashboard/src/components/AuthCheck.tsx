'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function AuthCheck({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const publicPaths = ['/login', '/register', '/api/auth/login', '/api/auth/register', '/'];
    const isPublicPath = publicPaths.includes(pathname);

    const token = localStorage.getItem('token');
    const userString = localStorage.getItem('user');

    if (!isPublicPath) {
      if (!token || token === 'null' || token === 'undefined') {
        console.warn(`[AuthCheck] Unauthorized access to ${pathname}. Redirecting to /login...`);
        setAuthorized(false);
        router.push('/login');
      } else {
        setAuthorized(true);
      }
    } else {
      // Login/Register sahifalarida agar token bo'lsa, dashboardga redirect (ixtiyoriy)
      setAuthorized(true);
    }
  }, [pathname, router]);

  // Agar unauthorized bo'lsa (va public path bo'lmasa) hech narsa ko'rsatmaymiz (yoki spinner)
  const publicPaths = ['/login', '/register', '/'];
  if (!authorized && !publicPaths.includes(pathname)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#09090b] text-white/40">
        <div className="flex flex-col items-center gap-4">
          <div className="size-8 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
          <p className="text-sm font-medium">Tekshirilmoqda...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
