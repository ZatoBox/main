import { NextRequest, NextResponse } from 'next/server';
import { BTCPayService } from '@/backend/payments/btcpay/service';
import { withAuth } from '@/app/api/middleware/auth';

let cachedCookie: string | null = null;
let cookieExpiry: number = 0;

async function getAdminCookie() {
  if (cachedCookie && Date.now() < cookieExpiry) {
    return cachedCookie;
  }

  const email = process.env.BTCPAY_EMAIL;
  const password = process.env.BTCPAY_PASSWORD;
  const baseUrl = process.env.BTCPAY_URL;

  if (!email || !password || !baseUrl) {
    throw new Error('BTCPay admin credentials not configured');
  }

  let loginUrl = `${baseUrl}/login`;

  try {
    const initialRes = await fetch(loginUrl);

    if (!initialRes.ok) {
      if (initialRes.status === 404) {
        console.log('/login returned 404, trying /Account/Login...');
        loginUrl = `${baseUrl}/Account/Login`;
        const fallbackRes = await fetch(loginUrl);
        if (!fallbackRes.ok) {
          throw new Error(
            `Failed to load login page: ${fallbackRes.status} ${fallbackRes.statusText}`
          );
        }
        return await performLogin(
          fallbackRes,
          loginUrl,
          email,
          password,
          baseUrl
        );
      }
      throw new Error(
        `Failed to load login page: ${initialRes.status} ${initialRes.statusText}`
      );
    }

    return await performLogin(
      initialRes,
      initialRes.url,
      email,
      password,
      baseUrl
    );
  } catch (error) {
    console.error('BTCPay Login Error:', error);
    throw error;
  }
}

async function performLogin(
  initialRes: Response,
  loginUrl: string,
  email: string,
  password: string,
  baseUrl: string
) {
  let cookies: string[] = [];
  if (typeof initialRes.headers.getSetCookie === 'function') {
    cookies = initialRes.headers.getSetCookie();
  } else {
    const c = initialRes.headers.get('set-cookie');
    if (c) cookies.push(c);
  }
  const cookieHeaderValue = cookies.join('; ');

  const html = await initialRes.text();

  const match = html.match(
    /<input name="__RequestVerificationToken" type="hidden" value="([^"]+)"/
  );
  const token = match ? match[1] : null;

  if (!token) {
    console.error('Failed to extract CSRF token from BTCPay login page');
  }

  const actionMatch = html.match(/<form[^>]+action="([^"]+)"/);
  if (actionMatch && actionMatch[1]) {
    const action = actionMatch[1];
    if (action.startsWith('http')) {
      loginUrl = action;
    } else if (action.startsWith('/')) {
      loginUrl = `${baseUrl}${action}`;
    } else {
      const urlObj = new URL(loginUrl);
      loginUrl = `${urlObj.origin}${action}`;
    }
  }

  const params = new URLSearchParams();
  params.append('Email', email);
  params.append('Password', password);
  if (token) {
    params.append('__RequestVerificationToken', token);
  }
  params.append('RememberMe', 'true');

  const loginRes = await fetch(loginUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Cookie: cookieHeaderValue,
      Origin: baseUrl,
      Referer: loginUrl,
    },
    body: params,
    redirect: 'manual',
  });

  if (loginRes.status !== 302) {
    const text = await loginRes.text();

    console.log('--- BTCPay Login Failure HTML ---');
    console.log('---------------------------------');

    const errorMatch =
      text.match(/<div class="text-danger"[^>]*>([^<]+)<\/div>/) ||
      text.match(/<div class="alert alert-danger"[^>]*>([^<]+)<\/div>/) ||
      text.match(/<li>([^<]+)<\/li>/);

    const errorMsg = errorMatch
      ? errorMatch[1].trim()
      : 'Unknown login error (Status ' + loginRes.status + ')';

    console.error('BTCPay Login failed:', errorMsg);
    throw new Error(`BTCPay Login failed: ${errorMsg}`);
  }

  let newCookies: string[] = [];
  if (typeof loginRes.headers.getSetCookie === 'function') {
    newCookies = loginRes.headers.getSetCookie();
  } else {
    const c = loginRes.headers.get('set-cookie');
    if (c) newCookies.push(c);
  }

  const allCookies = [...cookies, ...newCookies].join('; ');

  cachedCookie = allCookies;
  cookieExpiry = Date.now() + 1000 * 60 * 60;
  return cachedCookie;
}

const handler = async (
  req: NextRequest,
  userId: string,
  context: { params: any }
) => {
  try {
    const params = await context.params;
    const path = params.path || [];
    const pathStr = path.join('/');

    if (path[0] === 'stores') {
      const storeId = path[1];
      if (storeId) {
        const btcpayService = new BTCPayService(
          process.env.BTCPAY_URL!,
          process.env.BTCPAY_API_KEY!,
          userId
        );
        const userStore = await btcpayService.getUserStore(userId);

        if (!userStore || userStore.btcpay_store_id !== storeId) {
          return new NextResponse('Unauthorized Access to Store', {
            status: 403,
          });
        }
      }
    } else {
      const blocked = ['users', 'server', 'settings', 'api'];
      if (blocked.includes(path[0].toLowerCase())) {
        return new NextResponse('Unauthorized Path', { status: 403 });
      }
    }

    let cookie = await getAdminCookie();

    const targetUrl = `${process.env.BTCPAY_URL}/${pathStr}${req.nextUrl.search}`;

    const headers: Record<string, string> = {
      Cookie: cookie || '',
      'User-Agent': 'ZatoBox-Proxy',
    };

    const response = await fetch(targetUrl, {
      method: req.method,
      headers: headers,
      body:
        req.method !== 'GET' && req.method !== 'HEAD'
          ? await req.blob()
          : undefined,
      redirect: 'manual',
    });

    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get('location');
      if (location) {
        if (location.includes('/Account/Login')) {
          console.log('Proxy: Redirected to login, refreshing cookie...');
          cachedCookie = null;
          const newCookie = await getAdminCookie();
          headers['Cookie'] = newCookie || '';

          const retryResponse = await fetch(targetUrl, {
            method: req.method,
            headers: headers,
            body:
              req.method !== 'GET' && req.method !== 'HEAD'
                ? await req.blob()
                : undefined,
            redirect: 'manual',
          });

          if (
            retryResponse.headers.get('location')?.includes('/Account/Login')
          ) {
            return new NextResponse('Authentication Failed', { status: 401 });
          }

          return processResponse(retryResponse, req);
        }

        let newLocation = location;
        if (location.startsWith('/')) {
          newLocation = `/api/payments/btcpay-proxy${location}`;
        } else if (location.includes(process.env.BTCPAY_URL!)) {
          newLocation = location.replace(
            process.env.BTCPAY_URL!,
            '/api/payments/btcpay-proxy'
          );
        }
        return NextResponse.redirect(new URL(newLocation, req.url), {
          status: 302,
        });
      }
    }

    return processResponse(response, req);
  } catch (error: any) {
    console.error('Proxy Error:', error);
    return new NextResponse('Proxy Error: ' + error.message, { status: 500 });
  }
};

async function processResponse(response: Response, req: NextRequest) {
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('text/html')) {
    let text = await response.text();
    text = text.replace(
      /(href|src|action)="\/([^"]*)"/g,
      '$1="/api/payments/btcpay-proxy/$2"'
    );

    const baseUrl = process.env.BTCPAY_URL!.replace(/\/$/, '');
    const regex = new RegExp(baseUrl, 'g');
    text = text.replace(regex, '/api/payments/btcpay-proxy');

    return new NextResponse(text, {
      status: response.status,
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } else {
    return new NextResponse(response.body, {
      status: response.status,
      headers: {
        'Content-Type': contentType || 'application/octet-stream',
      },
    });
  }
}

export const GET = withAuth(handler);
export const POST = withAuth(handler);
