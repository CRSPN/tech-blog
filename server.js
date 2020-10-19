const path = require('path');
const express = require('express');
const routes = require('./controllers');
const sequelize = require('./config/connection');

const session = require('express-session');
const helpers = require('./utils/helpers');

const app = express();
const PORT = process.env.PORT || 3005;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const exphbs = require('express-handlebars');
const hbs = exphbs.create({ helpers });
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars')

const SequelizeStore = require('connect-session-sequelize')(session.Store);

const sess = {
  secret: "tool man",
  cookie: {
      maxAge: 30 * 60000,
      sameSite: 'strict'
  },
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize
  })
};

app.use(session(sess));

app.use(routes);

sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => 
  console.log(`API server now on port ${PORT}!`));
});