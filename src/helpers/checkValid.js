export default ({ overwriteExisting, hashingMethod }, $) => {
  // check if meta tag already exists, bail if we should not overwrite
  if (
    !overwriteExisting &&
    $('meta[http-equiv="Content-Security-Policy"]').length
  ) {
    console.warn(
      "Content-Security-Policy meta tag already exists! Will not try to overwrite"
    );
    return false;
  }

  // check if hashing method is correct
  if (!["sha256", "sha384", "sha512"].includes(hashingMethod)) {
    console.warn(
      `Supplied hashingMethod ${hashingMethod} is not a valid method! Falling back to sha256`
    );
    hashingMethod = "sha256";
  }

  return true;
};
