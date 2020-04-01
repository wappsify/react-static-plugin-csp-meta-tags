import cheerio from "cheerio";
import getHash from "./helpers/getHash";
import { defaultOptions } from "./helpers/options";
import checkValid from "./helpers/checkValid";
import createAttrString from "./helpers/createAttrString";
import createPolicyObject from "./helpers/createPolicyObject";
import fs from "fs";

export default options => ({
  beforeDocumentToFile: (html, { stage, config: { paths, assetsPath } }) => {
    if (stage === "prod") {
      // merge options with defaultOptions, so all optional fields are also covered
      options = {
        ...defaultOptions,
        ...options,
      };

      const $ = cheerio.load(html);

      if (!checkValid(options, $)) {
        return html;
      }

      // gogo, find all inline tags in need of hashing
      const shas = {};

      const inlineScriptTags = $("script:not([src])");
      shas["script-src"] = inlineScriptTags
        .map((_, elem) => `'${getHash($(elem).html(), options.hashingMethod)}'`)
        .get();
      const inlineStyleTags = $("style:not([href])");
      shas["style-src"] = inlineStyleTags
        .map((_, elem) => `'${getHash($(elem).html(), options.hashingMethod)}'`)
        .get();

      if (options.hashExternal) {
        // now, find all the external scripts, we want to hash those aswell
        const scriptTags = $("script[src]");
        shas["script-src"].push(
          ...scriptTags
            .map((_, elem) => {
              let { src } = elem.attribs;
              // if an assetsPath is set, remove it from the src attribute
              // because right now we want to open the file locally
              if (assetsPath) {
                src = src.replace(assetsPath, "/");
              }

              const { ASSETS } = paths;
              try {
                const filepath = `${ASSETS}${src}`;
                const file = fs.readFileSync(filepath, "utf8");
                const hash = getHash(file, options.hashingMethod);

                // add integrity attribute to script tags
                $(elem).attr("integrity", hash);

                // if crossorigin is set in options, add as attribute
                if (typeof options.crossorigin === "string") {
                  $(elem).attr("crossorigin", options.crossorigin);
                }

                return `'${hash}'`;
              } catch (error) {
                console.error(error);
              }
            })
            .get()
        );

        // find link preload tags, remove them (preload does not work with SRI)
        $(`link[rel='preload'][as='script']`).remove();
      }

      const metaTag = cheerio.load(
        `<meta http-equiv="Content-Security-Policy${
          options.reportOnly ? "-Report-Only" : ""
        }">`
      )("meta");

      metaTag.prependTo($("head"));

      const policy = createPolicyObject(options.policy, shas);
      metaTag.attr("content", createAttrString(policy));

      return $.html();
    }
  },
});
