const LOCAL_BACKEND_ORIGIN = 'http://localhost:5050';
const DEFAULT_RENDER_BACKEND_ORIGIN = 'https://askaksha-project.onrender.com';

const trimTrailingSlash = (value = '') => value.replace(/\/+$/, '');

const isLocalHostname = () => {
  if (typeof window === 'undefined') {
    return false;
  }

  return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
};

const buildRuntimeUrls = () => {
  const localHost = isLocalHostname();

  const envApiUrl = trimTrailingSlash(import.meta.env.VITE_API_URL || '');
  const envSocketUrl = trimTrailingSlash(import.meta.env.VITE_SOCKET_URL || '');

  const envBackendOrigin = envSocketUrl || (envApiUrl ? envApiUrl.replace(/\/api$/, '') : '');

  const backendOrigin = localHost
    ? LOCAL_BACKEND_ORIGIN
    : (envBackendOrigin || DEFAULT_RENDER_BACKEND_ORIGIN);

  const apiBaseUrl = localHost
    ? `${LOCAL_BACKEND_ORIGIN}/api`
    : (envApiUrl || `${backendOrigin}/api`);

  const socketUrl = localHost
    ? LOCAL_BACKEND_ORIGIN
    : (envSocketUrl || backendOrigin);

  return {
    backendOrigin,
    apiBaseUrl,
    socketUrl,
  };
};

export const runtimeUrls = buildRuntimeUrls();

export const API_BASE_URL = runtimeUrls.apiBaseUrl;
export const SOCKET_URL = runtimeUrls.socketUrl;
export const DEFAULT_BACKEND_ORIGIN = runtimeUrls.backendOrigin;
