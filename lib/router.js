// Copyright 2010 Matthew Wood
//
// Licensed under the Apache License, Version 2.0

var sys = require('sys');
var url = require('url');

var Router = exports.Router = function() {
  this._routes = [];
};

Router.prototype.add_route = function(route_spec, callback, options) {
  options = options || {};
  options.pattern = options.pattern || {};  
  options.type = options.type || {};  

  var param_keys = [];
  var regexp_components = route_spec.split('/').map(function(path_component) {
    if (path_component.charAt(0) == ':') {
      var key = path_component.slice(1);
      param_keys.push(key);

      var pattern;
      if (pattern = options['pattern'][key]) {
        return pattern;
      } else {
        return "([^/]*)";
      }
    } else {
      return path_component;
    }
  });
 
  var regexp = '^' + regexp_components.join('/') + '/?$';
  this._routes.push({
    pattern: new RegExp(regexp),
    params: param_keys,
    callback: callback,
    type: options.type
  });
};

function inflate(value, constructor) {
  if (constructor != undefined) {
    constructor.call(undefined, value);
  }

  return value;
}

Router.prototype.exec = function (req, res, target) {
  var uri = url.parse(req.url, true);
  var path = uri.pathname;
  sys.log('[route] ' + path);

  for(var i = 0; i < this._routes.length; i++) {
    var route = this._routes[i];
    var match = path.match(route.pattern);
    if (match) {
      var params = [];
      for(var j = 0; j < route.params.length; j++) {
        var key  = route.params[j];
        params[key] = inflate(match[1 + j], route.type[key]);
      }

      for(var key in uri.query) {
        params[key] = inflate(uri.query[key], route.type[key]);
      }

      return route.callback.call(target, {
        request: req,
        response: res,
        params: params
      });
    }  
  };
  
  res.writeHead(404, 'No matching route');
  res.end();
}
