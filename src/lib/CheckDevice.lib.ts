export const checkIOS = () => {
  const userAgent = window.navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(userAgent);
};

export const checkMacOS = () => {
  const userAgent = window.navigator.userAgent.toLowerCase();
  return /mac os/.test(userAgent);
};
