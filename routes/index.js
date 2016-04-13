var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', ensureAuthenticated,function(req, res, next) {
  res.render('index');
});

function ensureAuthenticated(req,res,next)
{
    if(req.isAuthenticated()){
        return next();
    }else{
        req.flash('error_msg','您尚未登录');
        res.redirect('/users/login');
    }
}

module.exports = router;
