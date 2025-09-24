import { NextRequest, NextResponse } from 'next/server';
import { polarAPI } from '@/utils/polar.utils';
import { AuthService } from '@/../backend/auth/service';
import { cookies } from 'next/headers';

function getBearerFromHeader(req: NextRequest): string | undefined {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) return undefined;
  return authHeader.split(' ')[1];
}

async function getCurrentUser(req: NextRequest) {
  const cookieStore = await cookies();
  const cookieToken = cookieStore.get('zatobox_token')?.value;
  const headerToken = getBearerFromHeader(req);
  const authToken = cookieToken || headerToken;
  if (!authToken) throw new Error('Missing authentication token');

  const authService = new AuthService();
  const user = await authService.verifyToken(authToken);
  const profile = await authService.getProfileUser(String(user.id));
  const polarApiKey = profile.user?.polar_api_key || '';
  if (!polarApiKey) throw new Error('Missing Polar API key for user');
  return {
    userId: user.id,
    userEmail: user.email,
    polarApiKey,
    polarOrganizationId: profile.user?.polar_organization_id || '',
  };
}

async function getOwnerUser(ownerId: string) {
  const authService = new AuthService();
  const profile = await authService.getProfileUser(ownerId);
  if (!profile.success || !profile.user) {
    throw new Error('Owner user not found');
  }
  const polarApiKey = profile.user.polar_api_key || '';
  if (!polarApiKey) throw new Error('Missing Polar API key for owner user');
  return {
    userId: profile.user.id,
    userEmail: profile.user.email,
    polarApiKey,
    polarOrganizationId: profile.user.polar_organization_id || '',
  };
}

export async function POST(req: NextRequest) {
  try {
    const { userId, items, successUrl, metadata, ownerId } = await req.json();

    let polarApiKey, polarOrganizationId;
    if (ownerId) {
      const ownerData = await getOwnerUser(ownerId);
      polarApiKey = ownerData.polarApiKey;
      polarOrganizationId = ownerData.polarOrganizationId;
    } else {
      const userData = await getCurrentUser(req);
      polarApiKey = userData.polarApiKey;
      polarOrganizationId = userData.polarOrganizationId;
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Invalid cart data' },
        { status: 400 }
      );
    }

    const finalUserId =
      userId ||
      `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const totalPrice = items.reduce((sum: number, item: any) => {
      const itemPrice = item.productData?.prices?.[0]?.price_amount || 0;
      return sum + itemPrice * item.quantity;
    }, 0);

    const cartDescription = items
      .map(
        (item: any) =>
          `${item.productData?.name || 'Producto'} (x${item.quantity})`
      )
      .join(', ');

    const allImages = items.reduce((images: any[], item: any) => {
      if (item.productData?.medias) {
        images.push(...item.productData.medias);
      }
      return images;
    }, []);

    const isGuestUser = !userId || finalUserId.startsWith('guest_');

    const combinedMetadata = {
      user_id: finalUserId,
      user_type: isGuestUser ? 'guest' : 'registered',
      cart_total: totalPrice.toString(),
      item_count: items.length.toString(),
      items: JSON.stringify(
        items.map((item: any) => ({
          name: item.productData?.name,
          quantity: item.quantity,
          price: item.productData?.prices?.[0]?.price_amount,
          polarProductId: item.polarProductId,
          metadata: item.productData?.metadata,
        }))
      ),
      ...metadata,
    };

    const cartProduct = await polarAPI.createProduct(polarApiKey, {
      name: `Order #${Math.floor(Math.random() * 1000000)}`,
      description: `Products: ${cartDescription}`,
      prices: [
        {
          amount_type: 'fixed',
          price_amount: totalPrice,
          price_currency: 'usd',
        },
      ],
      metadata: combinedMetadata,
      medias: allImages.slice(0, 5),
    });

    const checkoutData = {
      product_id: cartProduct.id,
      success_url:
        successUrl ||
        `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/success`,
      metadata: {
        user_id: finalUserId,
        cart_product_id: cartProduct.id,
        ...metadata,
      },
    };

    const checkout = await fetch('https://api.polar.sh/v1/checkouts', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${polarApiKey}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(checkoutData),
    });

    if (!checkout.ok) {
      const errorText = await checkout.text();
      throw new Error(`Polar checkout error: ${errorText}`);
    }

    const checkoutResponse = await checkout.json();

    return NextResponse.json({
      success: true,
      checkout_url: checkoutResponse.url,
      checkout_id: checkoutResponse.id,
      cart_product_id: cartProduct.id,
    });
  } catch (error: any) {
    console.error('Polar checkout error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create checkout' },
      { status: 500 }
    );
  }
}
