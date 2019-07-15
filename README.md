# react-static-plugin-csp-meta-tags

This plugin adds a CSP meta tag to your html files, adding hashes for inline script and style tags.
You also have the option to pass a custom policy in, which will be merged with the auto generated.

## Installation

In an existing react-static site run:

```bash
$ yarn add -D react-static-plugin-csp-meta-tags
```

Then add the plugin to your `static.config.js`:

```javascript
export default {
  plugins: [
    [
      'react-static-plugin-csp-meta-tags',
      {
        // example configuration
        overwriteExisting: true,
        hashingMethod: 'sha512'
      }
    ]
  ]
};
```

## Default policy

The default policy currently looks like this:

```javascript
{
  'base-uri': ["'self'"],
  'object-src': ["'none'"],
  'script-src': ["'unsafe-inline'", "'self'", "'unsafe-eval'"],
  'style-src': ["'unsafe-inline'", "'self'", "'unsafe-eval'"]
}
```

You can pass in your own policy and overwrite the default one.

## Options

In your `static.config.js`, you may optionally pass configuration options to the plugin.

### `overwriteExisting: boolean`

Default value: `false`

Set to true to overwrite a, for whatever reason, already existing CSP meta tag.

### `hashExternal: boolean`

Default value: `false`

Set to true to create hashes not just for inline script tags, but for external script files as well.

### `hashingMethod: 'sha256' | 'sha384' | 'sha512'`

Default value: `sha256`

### `policy: object`

With this you can pass in your own custom policy, which will overwrite the default policy. Note that you can pass in either a string or an array of strings to each key in the policy object.

### `crossorigin: 'anonymous' | 'use-credentials'`

Default value: `undefined`

You may pass in an optional crossorigin attribute for the scripts tags which will have `integrity` attributes appended to them. This is useful if your site is behind Basic Authorization, for example. By default, no `crossorigin` attribute is added at all!
