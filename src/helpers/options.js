const defaultPolicy = {
  "base-uri": ["'self'"],
  "object-src": ["'none'"],
  "script-src": ["'unsafe-inline'", "'self'", "'unsafe-eval'"],
  "style-src": ["'unsafe-inline'", "'self'", "'unsafe-eval'"],
};

export const defaultOptions = {
  overwriteExisting: false,
  hashExternal: false,
  hashingMethod: "sha256",
  policy: defaultPolicy,
  crossorigin: undefined,
  reportOnly: false,
};
