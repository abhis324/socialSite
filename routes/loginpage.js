var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var app = express()
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user')

app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json())

passport.use(new LocalStrategy(
  function(username, password, done) {
    console.log("i m in")
    Customer.findOne({ username: username }, function(err, user) {
      //console.log(user)
      if (err) { console.log("err region") ; return done(err); }
      if (!user) {
        console.log("user region")
        return done(null, false, { message: 'Incorrect username.' });
      }
      if(bcrypt.compareSync(password, user.password) == false){
        console.log("password region")
        console.log(user.password + " " + password)
        return done(null, false, { message: 'Incorrect password.' });
      }
      console.log("all done")
      return done(null, user);
    });
  }
));

router.get('/', function(req, res, next) {
  res.render('pages/loginpage');
});
// 
// router.post('/login', function(req, res, next) {
//   passport.authenticate('local', function(err, user, info) {
//     console.log("wow")
//     if (err) { console.log("err woww ") ; return next(err); }
//     if (!user) { return res.redirect('/customer'); }
//     req.logIn(user, function(err) {
//       if (err) {console.log("errrrr wwwww "+ err); return next(err); }
//       console.log("kaha h error" + user)
//       return res.redirect('/');
//     });
//   })(req, res, next);
// });

router.post('/login', async (req,res)=> {
  //console.log(req.body.name)
  let promise = new Promise(function(resolve,reject){
    req.session.username = req.body.username;
    globalName = req.body.username;
    console.log("this is the username" , req.body)
    resolve(1);
  })
  await promise
  console.log(req.session)
  res.redirect('/posts');
})

var x;

async function wow()
{
  let promise = User.find({}).then(function(result){
    //console.log("found");
    x = result.filter(obj => obj.name !== globalName)
    //console.log(result);
  })
  await promise
  return promise;
}

router.get('/posts', async (req,res)=>{
  let users = await wow()
  res.render('pages/showrequests', {x: x} );
})

var userId;

async function areWeFriends(param)
{
  let promise = User.find({_id: userId}).then((result)=>{
    if ( result.friends.find(obj => obj == param) )
    {
      return 0;
    }
    else {
      return 1;
    }
  })
}

async function isMyRequestPending(param)
{
  let promise = User.find({_id: param}).then((result)=>{
    if ( result.receivedFriendRequests.find(obj => obj == userId) )
    {
      return 0;
    }
    else {
      return 1;
    }
  })
}

async function didIacceptUrRequest(param)
{
  let promise = User.find({_id: userId}).then((result)=>{
    if ( result.sentFriendRequests.find(obj => obj == param) )
    {
      return 0;
    }
    else {
      return 1;
    }
  })
}

async function sendingFriendRequest(param)
{
  await User.find({_id: userId}).then(function(data){
    data.sentFriendRequests.push(param);
  })
  await User.find({_id: param}).then(function(data){
    data.receivedFriendRequests.push(userId);
  })
  return 1;
}

router.post('/friendRequest', async (req,res)=>{
  let check1 = await areWeFriends(req.body.friendId);
  if (!check1){ res.send("cannot send friend request") }
  let check2 = await isMyRequestPending(req.body.friendId);
  if (!check2){ res.send("cannot send friend request") }
  let check3 = await didIacceptUrRequest(req.body.friendId);
  if (!check3){res.send("cannot send friend request")}
  else
  {
      await sendingFriendRequest(req.body.friendId);
      res.send("friend request send successfully");
  }
})

module.exports = router;
