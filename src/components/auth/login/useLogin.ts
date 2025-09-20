export const generateRandomHex = (len = 16) => {
  const arr = new Uint8Array(len);
  window.crypto.getRandomValues(arr);
  return Array.from(arr)
    .map((b) => ('0' + b.toString(16)).slice(-2))
    .join('');
};

export const handleSocialLogin = (provider: string) => {
  const domain = (import.meta as any).env?.VITE_AUTH0_DOMAIN;
  const clientId = (import.meta as any).env?.VITE_AUTH0_CLIENT_ID;
  const audience = (import.meta as any).env?.VITE_AUTH0_AUDIENCE;
  const frontend = (import.meta as any).env?.VITE_FRONTEND_URL;
  if (!domain || !clientId || !audience) {
    alert(
      'Falta configuración de Auth0 en las variables de entorno (VITE_...).'
    );
    console.error(
      'Missing VITE_AUTH0_DOMAIN, VITE_AUTH0_CLIENT_ID or VITE_AUTH0_AUDIENCE'
    );
    return;
  }
  const redirectUri = `${frontend.replace(/\/$/, '')}/callback`;
  const responseType = 'token id_token';
  const scope = 'openid profile email';
  const nonce = generateRandomHex(16);
  const state = generateRandomHex(12);
  sessionStorage.setItem('auth0_nonce', nonce);
  sessionStorage.setItem('auth0_state', state);
  const params = new URLSearchParams({
    client_id: clientId,
    response_type: responseType,
    redirect_uri: redirectUri,
    scope,
    audience,
    nonce,
    state,
  });
  const connection = provider === 'google' ? 'google-oauth2' : 'github';
  params.append('connection', connection);
  window.location.href = `https://${domain}/authorize?${params.toString()}`;
};
