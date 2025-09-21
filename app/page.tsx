'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProductTable from './dashboard/main';

export default function HomePage() {
const router = useRouter();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [router]);

  return (
    <ProductTable/>
  );
}
