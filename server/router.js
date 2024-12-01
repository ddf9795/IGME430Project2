const multer = require('multer');
const controllers = require('./controllers');
const mid = require('./middleware');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '/hosted/uploads');
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}`);
  },
});

const upload = multer({ storage });

const router = (app) => {
  app.get('/getSkellies', mid.requiresLogin, controllers.Skellie.getSkellies);
  app.get('/getPersonalSkellies', mid.requiresLogin, controllers.Skellie.getPersonalSkellies);
  app.get('/getSkellie', mid.requiresLogin, controllers.Skellie.getSkellie);

  app.get('/searchSkellies', mid.requiresLogin, controllers.Skellie.searchSkellies);
  app.get('/searchPersonalSkellies', mid.requiresLogin, controllers.Skellie.searchPersonalSkellies);

  app.post('/addBio', mid.requiresSecure, mid.requiresLogin, controllers.Skellie.addBio);

  app.post('/deleteSkellie', mid.requiresSecure, mid.requiresLogin, controllers.Skellie.deleteSkellie);

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
};

module.exports = router;
