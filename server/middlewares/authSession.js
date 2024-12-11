export const isAuthorized = (req, res, next) => {
  if (req.session && req.session.userId) {
    next();
  } else {
    return res
      .status(403)
      .json({ success: false, msg: "You're not authorized..!" });
  }
};
