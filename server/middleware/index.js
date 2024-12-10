const requiresLogin = (req, res, next) => {
  if (!req.session.account) {
    return res.redirect('/');
  }
  return next();
};

const requiresLogout = (req, res, next) => {
  if (req.session.account) {
    return res.redirect('/skellieList');
  }
  return next();
};

const requiresSecure = (req, res, next) => {
  if (req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect(`https://${req.hostname}${req.url}`);
  }
  return next();
};

const requireSameAccount = (req, res, next) => {
  const pairs = req.headers.cookie.split(';');
  const pairs2 = pairs.map((cookie) => cookie.split('='));

  // Create an object with all key-value pairs
  const cookieObj = pairs2.reduce((obj, cookie) => {
    // eslint-disable-next-line no-param-reassign
    obj[decodeURIComponent(cookie[0].trim())] = decodeURIComponent(cookie[1].trim());

    return obj;
  }, {});

  console.log(cookieObj.username);

  if (req.session.account.username !== cookieObj.username) {
    return res.status(403).json({ redirect: '/notFound' });
  }
  return next();
};

const bypassSecure = (req, res, next) => next();

module.exports.requiresLogin = requiresLogin;
module.exports.requiresLogout = requiresLogout;
module.exports.requireSameAccount = requireSameAccount;

if (process.env.NODE_ENV === 'production') {
  module.exports.requiresSecure = requiresSecure;
} else {
  module.exports.requiresSecure = bypassSecure;
}
