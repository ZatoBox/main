import { NextRequest, NextResponse } from 'next/server';
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
  const polarOrganizationId = profile.user?.polar_organization_id || '';
  if (!polarApiKey) throw new Error('Missing Polar API key for user');
  if (!polarOrganizationId)
    throw new Error('Missing Polar organization ID for user');

  return {
    userId: user.id,
    userEmail: user.email,
    polarApiKey,
    polarOrganizationId,
  };
}

export async function POST(req: NextRequest) {
  try {
    const { userId, polarApiKey, polarOrganizationId } = await getCurrentUser(
      req
    );

    const webhookUrl = `https://zatobox.io/api/webhooks/polar?user_id=${userId}`;
    const webhookSecret = `zatobox_${userId}_${Date.now()}`;

    const webhookData = {
      url: webhookUrl,
      secret: webhookSecret,
      format: 'raw',
      events: [
        'checkout.created',
        'checkout.updated',
        'order.created',
        'order.paid',
        'subscription.created',
        'subscription.updated',
      ],
      organization_id: polarOrganizationId,
    };

    const response = await fetch('https://api.polar.sh/v1/webhooks/endpoints', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${polarApiKey}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(webhookData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to create webhook: ${errorText}`);
    }

    const webhook = await response.json();

    const authService = new AuthService();
    await authService.updateProfile(String(userId), {
      webhook_endpoint_id: webhook.id,
      webhook_secret: webhookSecret,
      webhook_url: webhookUrl,
    });

    return NextResponse.json({
      success: true,
      webhook: {
        id: webhook.id,
        url: webhookUrl,
        events: webhookData.events,
        organization_id: polarOrganizationId,
      },
      message: 'Webhook configured successfully',
    });
  } catch (error: any) {
    console.error('Webhook setup error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to setup webhook' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { polarApiKey, polarOrganizationId } = await getCurrentUser(req);

    const response = await fetch(
      `https://api.polar.sh/v1/webhooks/endpoints?organization_id=${polarOrganizationId}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${polarApiKey}`,
          Accept: 'application/json',
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to list webhooks: ${errorText}`);
    }

    const webhooks = await response.json();

    return NextResponse.json({
      success: true,
      webhooks: webhooks.items || webhooks,
    });
  } catch (error: any) {
    console.error('Webhook list error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to list webhooks' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { userId, polarApiKey } = await getCurrentUser(req);
    const { endpointId } = await req.json();

    if (!endpointId) {
      return NextResponse.json(
        { success: false, message: 'Endpoint ID is required' },
        { status: 400 }
      );
    }

    const response = await fetch(
      `https://api.polar.sh/v1/webhooks/endpoints/${endpointId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${polarApiKey}`,
          Accept: 'application/json',
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to delete webhook: ${errorText}`);
    }

    const authService = new AuthService();
    await authService.updateProfile(String(userId), {
      webhook_endpoint_id: null,
      webhook_secret: null,
      webhook_url: null,
    });

    return NextResponse.json({
      success: true,
      message: 'Webhook deleted successfully',
    });
  } catch (error: any) {
    console.error('Webhook delete error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to delete webhook' },
      { status: 500 }
    );
  }
}
