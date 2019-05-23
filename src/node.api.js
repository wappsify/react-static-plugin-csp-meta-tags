import cheerio from 'cheerio';
import getHash from './helpers/getHash';
import { defaultOptions } from './helpers/options';
import checkValid from './helpers/checkValid';
import createAttrString from './helpers/createAttrString';
import createPolicyObject from './helpers/createPolicyObject';
import fs from 'fs';

export default options => ({
  beforeDocumentToFile: (html, { stage, config: { paths } }) => {
    if (stage === 'prod') {
      // merge options with defaultOptions, so all optional fields are also covered
      options = {
        ...defaultOptions,
        ...options
      };

      const $ = cheerio.load(html);

      if (!checkValid(options, $)) {
        return html;
      }

      // gogo, find all inline tags in need of hashing
      const shas = {};

      const inlineScriptTags = $('script:not([src])');
      shas['script-src'] = inlineScriptTags
        .map((_, elem) => getHash($(elem, options.hashingMethod).html()))
        .get();
      const inlineStyleTags = $('style:not([href])');
      shas['style-src'] = inlineStyleTags
        .map((_, elem) => getHash($(elem, options.hashingMethod).html()))
        .get();

      // now, find all the external scripts, we want to hash those aswell
      const scriptTags = $('script[src]');
      shas['script-src'].push(
        ...scriptTags
          .map((_, elem) => {
            const { src } = elem.attribs;
            const { ASSETS: assetsPath } = paths;
            try {
              const filepath = `${assetsPath}${src}`;
              const file = fs.readFileSync(filepath, 'utf8');

              return getHash(file, options.hashingMethod);
            } catch (error) {
              console.error(error);
            }
          })
          .get()
      );

      const metaTag = cheerio.load(
        '<meta http-equiv="Content-Security-Policy">'
      )('meta');

      metaTag.prependTo($('head'));

      const policy = createPolicyObject(options.policy, shas);
      metaTag.attr('content', createAttrString(policy));

      return $.html();
    }
  }
});
