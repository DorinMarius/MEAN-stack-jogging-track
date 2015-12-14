module.exports = function(JogRecord) {
  JogRecord.beforeRemote('create', function(context, user, next) {
    var req = context.req;
    req.body.userId = req.accessToken.userId;
    next();
  });
};
