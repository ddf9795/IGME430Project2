const multer = require('multer');
const controllers = require('./controllers');
const mid = require('./middleware');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __dirname);
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}`);
  },
});

const upload = multer({ storage });

const router = (app) => {
  app.get('/getSkellies', mid.requiresLogin, mid.requireSameAccount, controllers.Skellie.getSkellies);
  app.get('/getPersonalSkellies', mid.requiresLogin, mid.requireSameAccount, controllers.Skellie.getPersonalSkellies);
  app.get('/getSkellie', mid.requiresLogin, mid.requireSameAccount, controllers.Skellie.getSkellie);

  app.post('/addBio', mid.requiresSecure, mid.requiresLogin, mid.requireSameAccount, controllers.Skellie.addBio);
  app.post('/addWhitelistUser', mid.requiresSecure, mid.requiresLogin, mid.requireSameAccount, controllers.Skellie.addUser);
  app.post('/addComment', mid.requiresSecure, mid.requiresLogin, mid.requireSameAccount, controllers.Skellie.addComment);

  app.post('/deleteSkellie', mid.requiresSecure, mid.requiresLogin, mid.requireSameAccount, controllers.Skellie.deleteSkellie);
  app.post('/deleteBio', mid.requiresSecure, mid.requiresLogin, mid.requireSameAccount, controllers.Skellie.deleteBio);
  app.post('/deleteWhitelistUser', mid.requiresSecure, mid.requiresLogin, mid.requireSameAccount, controllers.Skellie.deleteUser);

  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);

  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);

  app.get('/logout', mid.requiresLogin, controllers.Account.logout);

  app.post('/changePassword', mid.requiresSecure, mid.requiresLogout, controllers.Account.changePassword);

  app.get('/maker', mid.requiresLogin, controllers.Skellie.makerPage);
  app.post('/maker', mid.requiresSecure, mid.requiresLogin, upload.single('img'), controllers.Skellie.makeSkellie);

  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);

  app.get('/skellie', mid.requiresSecure, mid.requiresLogin, controllers.Skellie.skelliePage);

  app.get('/skellieList', mid.requiresSecure, mid.requiresLogin, controllers.Skellie.skellieListPage);
  app.get('/search', mid.requiresSecure, mid.requiresLogin, controllers.Skellie.searchPage);

  app.get('*', controllers.Account.notFoundPage);
};

module.exports = router;
