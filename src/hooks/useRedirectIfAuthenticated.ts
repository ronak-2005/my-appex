import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';


export default function useRedirectIfAuthenticated() {
    const router = useRouter();
    const [loading, setLoading] = useState(true); // 👈 Add this
  
    useEffect(() => {
      const check = async () => {
        try {
          const res = await fetch('/api/check-auth', {
            credentials: 'include',
          });
  
          if (res.ok) {
            // ✅ Already logged in → redirect to /start
            router.replace('/start');
          }
        } catch (err) {
          console.error('Auth check failed:', err);
        } finally {
          setLoading(false); // ✅ Done checking
        }
      };
  
      check();
    }, [router]);
  
    return loading;
  }