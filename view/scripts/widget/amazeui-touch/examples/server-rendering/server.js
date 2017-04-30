'use strict';

import express from 'express';
import hbs from 'express-handlebars';
import serveStatic from 'serve-static';

import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import React from 'react';
import {renderToString} from 'react-dom/server';
import {
  match,
  RouterContext,
} from 'react-router';
import routes from './shared/routes';
import webpackConfig from './webpack.config.dev';

const app = express();
const compiler = webpack(webpackConfig);

app.engine('html', hbs({extname: 'html'}));
app.set('view engine', 'html');
app.set('views', './server/views');
app.locals.settings['x-powered-by'] = false;

app.use(serveStatic('./public'));

app.use(webpackDevMiddleware(compiler, {
  publicPath: webpackConfig.output.publicPath,
  stats: {
    colors: true
  }
}));

app.use(webpackHotMiddleware(compiler, {
  log: console.log
}));

app.get('*', (req, res) => {
  match({
    routes,
    location: req.url
  }, (error, redirectLocation, renderProps) => {
    if (error) {
      res.status(500).send(error.message)
    } else if (redirectLocation) {
      res.redirect(302, redirectLocation.pathname + redirectLocation.search)
    } else if (renderProps) {
      // You can also check renderProps.components or renderProps.routes for
      // your "not found" component or route respectively, and send a 404 as
      // below, if you're using a catch-all route.
      res.render('layout', {
        reactHtml: renderToString(<RouterContext {...renderProps} />)
      });
    } else {
      res.status(404).send('Not found');
    }
  })
});

const server = app.listen(2046, function () {
  const port = server.address().port;

  console.log('Example app listening at http://localhost:%s', port);
});
