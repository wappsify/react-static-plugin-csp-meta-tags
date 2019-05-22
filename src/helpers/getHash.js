import crypto from 'crypto';

export default (str, method = 'sha256') => {
  const hashed = crypto
    .createHash(method)
    .update(str, 'utf8')
    .digest('base64');

  return `'sha256-${hashed}'`;
};
