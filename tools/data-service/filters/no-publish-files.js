// Generated by CoffeeScript 1.7.1
(function() {
  var func_changefile;

  func_changefile = __F('changefile');

  module.exports = function(req, res, next) {
    return func_changefile.getAll(1, 10000, {
      is_publish: 0
    }, "id desc", function(error, files) {
      res.locals.files = files;
      return next();
    });
  };

}).call(this);
