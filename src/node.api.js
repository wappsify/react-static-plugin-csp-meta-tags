import cheerio from 'cheerio';
import getHash from './helpers/getHash';
import { defaultOptions } from './helpers/options';
import checkValid from './helpers/checkValid';
import createAttrString from './helpers/createAttrString';
import createPolicyObject from './helpers/createPolicyObject';

export default options => ({
  beforeDocumentToFile: (html, { stage }) => {
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

      const scriptTags = $('script:not([src])');
      shas['script-src'] = scriptTags
        .map((idx, elem) => getHash($(elem, options.hashingMethod).html()))
        .get();
      const styleTags = $('style:not([href])');
      shas['style-src'] = styleTags
        .map((idx, elem) => getHash($(elem, options.hashingMethod).html()))
        .get();

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
