var express = require('express');
var router = express.Router();
var User = require('../models/user');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

/* Register. */
router.get('/register', function(req, res, next) {
  res.render('register');
});
/* Login. */
router.get('/login', function(req, res, next) {
  res.render('login');
});

/* Register user*/
router.post('/register', function(req, res, next) {
  var name = req.body.name;
  var username = req.body.username;
  var email = req.body.email;
  var password = req.body.password;
  var password2 =req.body.password2;
  
  //check
  console.log(name);
  //useing express validate
  req.checkBody('name','用户名不可为空').notEmpty();
  req.checkBody('email','电子邮箱不可为空').notEmpty();
  req.checkBody('email','电子邮箱错误').isEmail();
  req.checkBody('username','昵称不可为空').notEmpty();
  req.checkBody('password','密码不可为空').notEmpty();
  req.checkBody('password2','密码不匹配').equals(req.body.password2);

  var errors = req.validationErrors();
  
  if(errors){
       console.log('there are errors');
       res.render('register',{
           errors:errors
       })
  }else{
      var newUser = new User({
          name:name,
          email:email,
          username:username,
          password:password
      });
      
      User.createUser(newUser,function name(err,user) {
          if(err) throw err;
          console.log(user);
      })
      
      req.flash('sucess_msg','您已经成功注册！');
      res.redirect('/users/login');
  }
});


passport.use(new LocalStrategy(
  function(username, password, done) {
     User.getUserByUsername(username,function(err,user){
         if(err) throw err;
         if(!user){
             return done(null,false,{message:'Unknown User'});
         }
         User.comparePassword(password,user.password,function (err,isMatch) {
             if(err) throw err;
             if(isMatch){
                 return done(null,user);
             }else{
                 return done(null,false,{message:"密码错误！"})
             }
         })
     });
  }
));
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserByUserID(id, function(err, user) {
    done(err, user);
  });
});


//登录
router.post('/login',
  passport.authenticate('local',{successRedirect:'/',failureRedirect:'/users/login',failureFlash:true}),
  function(req, res) {
     res.redirect('/'); 
  });

//登出
router.get('/logout',function (req,res) {
    req.logout();
    req.flash('sucess_msg','你已经登出');
    res.redirect('/users/login');
})
module.exports = router;
