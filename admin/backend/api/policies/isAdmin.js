
module.exports = function(req, res, next) {
  if (!req.user.isAdmin) {
    return res.forbidden({message:'You are not performed to provide this action'});
  }
  return next();
};
