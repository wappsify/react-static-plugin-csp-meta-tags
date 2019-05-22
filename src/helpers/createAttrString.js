export default policy => {
  const sources = [];

  Object.keys(policy).forEach(source => {
    sources.push(`${source} ${policy[source].join(' ')}`);
  });

  return sources.join('; ');
};
