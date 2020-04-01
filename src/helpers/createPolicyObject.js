import flatten from "lodash.flatten";

export default (optionsPolicy, shas) => {
  Object.keys(shas).forEach(key => {
    optionsPolicy[key] = flatten([optionsPolicy[key], shas[key]]);
  });
  // turn all keys into arrays
  Object.keys(optionsPolicy).forEach(key => {
    if (typeof optionsPolicy[key] === "string") {
      optionsPolicy[key] = [optionsPolicy[key]];
    }
  });
  return optionsPolicy;
};
