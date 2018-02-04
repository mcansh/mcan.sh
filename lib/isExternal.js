const checkDomain = url => {
  const fullURL =
    url.indexOf('//') === 0 ? window.location.protocol + url : url;

  return fullURL
    .toLowerCase()
    .replace(/([a-z])?:\/\//, '$1')
    .split('/')[0];
};

const isExternal = url => {
  if (typeof window !== 'undefined') {
    return (
      (url.indexOf(':') > -1 || url.indexOf('//') > -1) &&
      checkDomain(window.location.href) !== checkDomain(url)
    );
  }
  return false;
};

export default isExternal;
