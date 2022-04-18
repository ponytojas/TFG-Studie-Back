const isMobile = (userAgent) => {
  const toMatch = [
    /Android/i,
    /webOS/i,
    /iPhone/i,
    /iPad/i,
    /iPod/i,
    /BlackBerry/i,
    /Windows Phone/i
  ];

  return toMatch.some((toMatchItem) => userAgent.match(toMatchItem));
}

module.exports = isMobile;