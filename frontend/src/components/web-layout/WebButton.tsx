import React, {useState} from 'react';
import {
    LucideIcon,
    ShoppingCart,
    ShoppingBasket,
    // Heart,
    Share2
} from 'lucide-react';

import {useCartStore} from "@/stores/cart-store";

interface WebButtonProps {
    children?: React.ReactNode;
    onClick?: (e?: React.MouseEvent) => void;
    variant?:
        'shareStoreHeader' | 'shoppingCar' | 'secondary' | 'outline' | 'buy' | 'buy-disabled' /*| 'wishlist' | 'wishlist-active'*/
        | 'shoppinglist' | 'shoppinglist-active' | 'shareProduct' |'shareProduct-active';
    size?: 'sm' | 'md' | 'lg';
    icon?: LucideIcon;
    disabled?: boolean;
    className?: string;
    productId?: string;
}

const WebButton: React.FC<WebButtonProps> =({
    children,
    onClick,
    variant = 'shareStore',
    size = 'md',
    icon: Icon,
    disabled = false,
    className='',
    productId
}) => {
    const baseClasses = 'inline-flex items-center gap-2 font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zatobox-300';

    // To share the same design between buttons
    const BUTTON_VARIANTS = {
        HEADER_SHARE: 'bg-transparent text-zatobox-500 hover:bg-zatobox-600 hover:text-white',
        HEADER_CART: 'bg-zatobox-500 text-white hover:bg-zatobox-600'
    }

    const BUTTONS_ESPECIAL_CARDS = (isActive: boolean) =>
            isActive
                ? 'text-zatobox-500 bg-zatobox-200 hover:bg-zatobox-300'
                : 'text-gray-600 hover:bg-zatobox-200 focus:ring-zatobox-300';

    const variantClasses = {
        shareStoreHeader: BUTTON_VARIANTS.HEADER_SHARE,
        shoppingCar: BUTTON_VARIANTS.HEADER_CART,
        secondary: 'bg-gray-200 text-gray-600 hover:bg-gray-300 focus:ring-gray-300',
        outline: 'bg-transparent border border-gray-300 text-gray-600 hover:bg-gray-100 focus:ring-gray-300',
        buy: 'bg-zatobox-500 text-white hover:bg-zatobox-600 focus:ring-zatobox-500',
        'buy-disabled': 'bg-gray-400 text-white cursor-not-allowed',
        // for futures plans - add item on wish list for future purchases
        // wishlist: 'bg-white text-gray-600 hover:bg-gray-100 shadow-md',
        // 'wishlist-active': 'bg-red-500 text-white hover:bg-red-600',
        shoppinglist: BUTTONS_ESPECIAL_CARDS(false),
        'shoppinglist-active': BUTTONS_ESPECIAL_CARDS(true),
        shareProduct: BUTTONS_ESPECIAL_CARDS(false),
        'shareProduct-active': BUTTONS_ESPECIAL_CARDS(true)
    };

    const sizeClasses = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base'
    };

    const specialButtonSizes = {
        sm: 'p-1.5',
        md: 'p-2',
        lg: 'p-3'
    };

    /* configurations special buttons
    * like wishlist are for futere plans, so just uncomment
    */
    // const isWishlist = variant === 'wishlist' || variant === 'wishlist-active';
    const isShoppingList = variant === 'shoppinglist' || variant === 'shoppinglist-active';
    const isShareProduct = variant === 'shareProduct' || variant === 'shareProduct-active';
    const isSpecialButton =  isShoppingList /*|| isWishlist*/ || isShareProduct;

    const finalSizeClasses = isSpecialButton ? specialButtonSizes[size] : sizeClasses[size];
    const finalBaseClasses = isSpecialButton ?
        'inline-flex items-center justify-center font-medium rounded-full transition-all duration-200' :
        baseClasses;

    const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';

    /* Auto-define:
    * Icon
    * Action onClick
    */
    let finalIcon = Icon;
    if (!Icon) {
        if (variant === 'buy' || variant === 'shoppingCar') finalIcon = ShoppingCart;
        // if (variant === 'wishlist' || variant === 'wishlist-active') finalIcon = Heart;
        if (variant === 'shoppinglist' || variant === 'shoppinglist-active') finalIcon = ShoppingBasket;
        if (variant === 'shareProduct' || variant === 'shareProduct-active' || variant === 'shareStoreHeader') finalIcon = Share2;
    }

    // Performs the sharing action
    const handleShare = async (title: string ='', description: string='', customUrl?: string) => {
        const url = customUrl || window.location.href;

        if(navigator.share){
            try {
                await navigator.share({
                    title: title,
                    text: description || `Check out ${title}`,
                    url: url
                });
                return;
            } catch (err) {}
        }
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            const textArea = document.createElement('textarea');
            textArea.value = url;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    }

    // Automatically detects the content based on the URL
    const getShareContent = () => {
        const pathname = window.location.pathname;
        const pathParts = pathname.split('/');
        const slug = pathParts[2];

        if(variant === 'shareProduct' && productId){
            const productUrl = `${window.location.origin}/link/${slug}/product-detail/${productId}`;
            return {
                title: 'Check out this amazing product!',
                description: `I found this amazing product on ${slug}. Check it out!`,
                url: productUrl
            }
        }

        return {
            title: 'Check out this store!',
            description: `I found the ${slug}, a amazing store!`,
            url: window.location.href
        }
    }

    const [setCopied] = useState(false);
    const { getTotalItems, openDrawer} = useCartStore();
    const cartItemCount = getTotalItems();

    const handleClick = (e?: React.MouseEvent) => {
        e?.stopPropagation()
        if(variant === 'buy'){
            console.log('Buy action triggered')

        } else if(variant === 'shoppinglist' || variant === 'shoppinglist-active'){
            console.log('Shopping list action triggered')
            // const handleShoppingListClick = (product)=> {
            //     setSelectedProduct(product);
            //     setIsDrawerOpen(true);
            //     setShoppingListDrawer((prevCart) => {
            //
            //     })
            // }
        } else if(variant === 'shareProduct' || variant === 'shareProduct-active' || variant === 'shareStore'){
            const {title, description, url} = getShareContent();
            handleShare(title, description, url);
        } else if(variant === 'shoppingCar'){
            console.log('Cart clicked - opening drawer');
            openDrawer();
        }

        // Call the custom onclick if provided
        if (onClick) {
            onClick(e);
        }
    };

    return (
        <button
            onClick={handleClick}
            aria-label = {variant === 'shoppingCar' ? `Shopping cart with ${cartItemCount} items` : undefined}
            disabled={disabled || variant === 'buy-disabled'}
            className={`${finalBaseClasses} ${variantClasses[variant]} ${finalSizeClasses} ${disabledClasses} ${className} relative`}
        >
            {finalIcon && React.createElement(finalIcon, {
                className:`w-4 h-4 ${/*variant === 'wishlist-active' ||*/ variant === 'shoppinglist-active' || variant === 'shareProduct-active' ? 'fill-current' : ''}`
            })}
            {variant === 'shoppingCar' && cartItemCount && cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-white text-zatobox-500 text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemCount > 99 ? '99+' : cartItemCount}
                </span>
            )}

            {children}
        </button>
    );
};

export default WebButton;