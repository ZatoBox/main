'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import WebHero from '@/components/web-layout/WebHero';
import WebCardsContainer from '@/components/web-layout/WebCardsContainer';
import WebCards from '@/components/web-layout/WebCards';
import WebFooter from '@/components/web-layout/WebFooter';
import { layoutAPI } from "@/services/web-api";
import { getActiveProducts } from "@/services/api.service";
import { useAuth } from "@/context/auth-store";
import type {Layout, Product} from '@/types';
import WebShoppingList from '@/components/web-layout/WebShoppingList';

export default function ZatoLinkPage() {
    const params = useParams();
    const slug = params?.slug as string;
    const { user } = useAuth();

    // state to manage data
    const [layout, setLayout] = useState<Layout | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredProducts = useMemo(() => {
        if (!searchTerm.trim()) return products;

        return products.filter(product =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
        )
    }, [products, searchTerm])

    const isOwner = !!(user && layout && user.id === layout.owner_id);

    // search data when load page
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                const layoutResponse = await layoutAPI.getBySlug(slug);
                if (layoutResponse.success){
                    setLayout(layoutResponse.layout)

                    try {
                        const productsResponse = await getActiveProducts();
                        if (productsResponse.success) {
                            setProducts(productsResponse.products);
                        }
                    }catch (productError){
                        console.warn('Could not load products:', productError)
                    }
                } else {
                    setError('Store not found')
                }
            } catch (err: any) {
                console.error('Error loading page:', err);
                setError('Error loading the page');
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            fetchData();
        }
    }, [slug]);

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
                    <h1 className="text-2xl font-bold text-red-600 mb-4">Store not found</h1>
                    <p className="text-gray-600">{error || 'This store does not exist or was removed.'}</p>
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
        <div className="min-h-screen bg-background">
            <WebHero
                title={layout.hero_title || 'My Store'}
                description={layout.web_description || ''}
                isOwner={isOwner}
            />

            {/*Product List*/}
            <main className="max-w-7xl mx-auto px-4 py-8">
                {products.length === 0 ? (
                    <div className="text-center py-12">
                        <p className={"text-muted-foreground text-lg"}>No product available at the moment</p>
                    </div>
                ) : (
                    <WebCardsContainer
                        searchValue={searchTerm}
                        onSearchChange={setSearchTerm}
                        placeholder="Search products..."
                    >
                        {filteredProducts.length === 0 ? (
                            <div className="col-span-full text-center py-12">
                                <p className="text-gray-500 text-lg">
                                    No products found for "{searchTerm}"
                                </p>
                            </div>
                        ) : (
                            filteredProducts.map((product) => (
                                <WebCards
                                    key={product.id}
                                    productId={product.id} // for navegation
                                    storeSlug={slug}
                                    title={product.name}
                                    description={product.description || ''}
                                    price={product.price}
                                    image={product.images?.[0]}
                                    stock={product.stock}
                                    onBuyClick={() => {
                                    alert(`Product: ${product.name} - $${product.price.toFixed(2)}`);
                                    }}
                                />
                            ))
                        )}
                    </WebCardsContainer>
                )}
                <WebShoppingList/>
            </main>

            <WebFooter/>
        </div>
        );
    }

