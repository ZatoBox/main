'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getProductByUserId } from '@/services/api.service';
import type { Layout, Product } from '@/types';
import { layoutAPI } from '@/services/api.service';
import Link from 'next/link';
import ProductImageGallery from '@/components/web-layout/product-detail/ProductImageGallery';
import ProductInfo from '@/components/web-layout/product-detail/ProductInfo';
import { mapPolarProductToProduct } from '@/utils/polar.utils';

export default function ProductLinkPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const productId = params?.id as string;
  // const {user} = useAuth();

  const [layout, setLayout] = useState<Layout | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const layoutResponse = await layoutAPI.getBySlug(slug);
        if (layoutResponse.success) {
          setLayout(layoutResponse.layout);

          try {
            const productsResponse = await getProductByUserId(
              layoutResponse.layout.owner_id,
              productId
            );
            if (productsResponse.success && productsResponse.product) {
              const mapped = mapPolarProductToProduct(
                productsResponse.product
              ) as Product;
              setProduct(mapped);
            } else {
              setProduct(null);
            }
          } catch (productError) {
            console.warn('Could not load product:', productError);
            setProduct(null);
          }
        } else {
          setError('Store not found');
        }
      } catch (err: any) {
        console.error('Error loading page:', err);
        setError('Error loading the page');
      } finally {
        setLoading(false);
      }
    };

    if (slug && productId) {
      fetchData();
    }
  }, [slug, productId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading Store...</p>
        </div>
      </div>
    );
  }

  if (error || !layout) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Product not found
          </h1>
          <p className="text-gray-600">
            {error || 'This product does not exist or was removed.'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <nav className="mb-6 text-sm">
        <div className="flex items-center space-x-2">
          <Link
            href={`/link/${slug}`}
            className="text-gray-400 hover:underline"
          >
            Home
          </Link>
          <span className="text-gray-400">{'>'}</span>
          <span className="text-gray-400">{product?.name}</span>
        </div>
      </nav>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/2">
          <ProductImageGallery
            images={product?.images || []}
            productName={product?.name || ''}
          ></ProductImageGallery>
        </div>
        <div className="w-full md:w-1/2">
          <ProductInfo
            productName={product?.name || ''}
            price={product?.price || 0}
            description={product?.description || ''}
            stock={product?.stock || 0}
            minStock={product?.min_stock || 0}
          ></ProductInfo>
        </div>
      </div>
    </main>
  );
}
