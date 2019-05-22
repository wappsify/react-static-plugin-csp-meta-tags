const defaultPolicy = {
  'base-uri': ["'self'"],
  'object-src': ["'none'"],
  'script-src': ["'unsafe-inline'", "'self'", "'unsafe-eval'"],
  'style-src': ["'unsafe-inline'", "'self'", "'unsafe-eval'"]
};

export const defaultOptions = {
  overwriteExisting: false,
  hashingMethod: 'sha256',
  policy: defaultPolicy
};