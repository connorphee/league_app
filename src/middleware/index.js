import Match from "../models/match";
const middleware = {
  isLoggedIn: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash("error", "You must be signed in to do that!");
    res.redirect("/login");
  },
  checkUserMatch: (req, res, next) => {
    if (req.isAuthenticated()) {
      Match.findById(req.params.commentId, (err, match) => {
        if (match.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash("error", "You don't have permission to do that!");
          res.redirect("/" + req.params.id);
        }
      });
    } else {
      req.flash("error", "You need to be signed in to do that!");
      res.redirect("login");
    }
  }
};

export default middleware;
