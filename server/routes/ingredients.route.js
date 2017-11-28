const router =  require('express').Router();
var EssentialIng = require('./../models/DiyDetailsSchema.js');
var db = require('./../connections/dbconnect.js');
db.on('error', console.error.bind(console, 'connection error:'));
const passport = require('passport');
const users = require('../models/registerForm');
const retailerSchema = require('../models/retailerSchema');
let sendMail = require('./sendMail.js');
db.once('open', function() {
  console.log('connected to DB!');
});

router.post('/userIngredientDetails', (req,res)=>{
  let val = JSON.parse(req.query.details);
  let a = new EssentialIng(val);
  console.log('before saving : ',val);
  a.save( (err, reply)=>{
    if (err) {
      console.log('err in saving : ',err);
    }
    else {
      console.log('res from saving : ', reply);
    }
    res.send('data saved succesfully');
  });
  console.log(req.query.details.url);
});

router.post('/login',passport.authenticate('local'),(req,res)=>{
  console.log("req.user ",req.user);
  if(res){
    // console.log(req.user);
    res.send(req.user);
  }
});

router.get('/checkVerification', (req,res)=>{
  //let val =JSON.parse(req.query.UserDetails);
        console.log(req.query.username);
        users.find({username:req.query.username},function(err,user){
        if(err){
            res.send(err);
        }
        // user already exists
        if(user){
          console.log(user);
          res.send({user});
        }
        else{
          res.send("User not registered");
        }
      })
    });

router.post('/logout', function(req, res){
    // req.flash('success_msg', 'You are logged out');
    console.log("you are logging out ",req.query.email);
    res.send(req.query.email);
});

router.post('/register', (req,res)=>{
          let code = Math.floor(100000 + Math.random() * 900000);
          let receiver = req.query.email;
           users.findOne({'email':receiver},function(err,user){
            if(err){
                res.send("Error");
            }
            // user already exsist
            if(user){
                res.send("User already registered");
            } else {
                let newUser= new users();
                //set the user's credentials
                newUser.name = req.query.name;
                newUser.email = req.query.email;
                newUser.password =req.query.password;
                newUser.username = req.query.username;
                newUser.value = req.query.value;
                newUser.verificationCode = code;
                newUser.Subscribers=req.query.Subscribers;
                newUser.YouTubeId=req.query.YouTubeId;
                newUser.verificationStatus = false;
                console.log(newUser,"USER sCHEMA");
                newUser.save(function(err,reply) {
                          if (err) {
                              res.send('Error in registration');
                          } else {
                            sendMail.send({
                            	to:receiver,
                            	subject:'Welcome to DIY Portal',
                              html:'<center><h1>Welcome to DIY Supplies Ordering Portal</h1>'+
                              '<br><h3>Hey, thanks for signing up!</h3><br>'+
                              '<p> You are just one click away from activating your account</p><br>'+
                              '<p>This is your activation code <b>'+code+'</b></p><br><br></center><p</p><br>'
                            });
                            res.send({status:'User details saved successfully',email:receiver});
                          }
                        });
                      }
                    });
});
router.post('/registerRetailer', (req,res)=>{
          let code = Math.floor(100000 + Math.random() * 900000);
          let receiver = req.query.email;
           users.findOne({'email':receiver},function(err,user){
            if(err){
                res.send("Error");
            }
            // user already exsist
            if(user){
                res.send("User already registered");
            } else {
                let newUser= new users();
                //set the user's credentials
                newUser.name = req.query.name;
                newUser.email = req.query.email;
                newUser.password =req.query.password;
                newUser.username = req.query.username;
                newUser.value = req.query.value;
                newUser.Subscribers=req.query.Subscribers;
                newUser.YouTubeId=req.query.YouTubeId;
                newUser.verificationCode = code;
                newUser.verificationStatus = false;
                console.log(newUser,"USER sCHEMA");
                newUser.save(function(err,reply) {
                          if (err) {
                              res.send('Error in registration');
                          } else {
                            sendMail.send({
                            	to:receiver,
                            	subject:'Welcome to DIY Portal',
                              html:'<center><h1>Welcome to DIY Supplies Ordering Portal</h1>'+
                              '<br><h3>Hey, thanks for signing up!</h3><br>'+
                              '<p> You are just one click away from activating your account</p><br>'+
                              '<p>This is your activation code <b>'+code+'</b></p><br><br></center><p</p><br>'
                            });
                            res.send({status:'User details saved successfully',email:receiver});
                          }
                        });
                      }
                    });
});
router.post('/verify', (req,res)=>{
  //let val =JSON.parse(req.query.UserDetails);
        console.log(req.query.email);
        users.find({email:req.query.email},function(err,user){
        if(err){
            res.send(err);
        }
        // user already exists
        if(user){
          console.log(user);
          res.send({user});
        }
        else{
          res.send("User not registered");
        }
      })
    });

    router.post('/resendCode', (req,res)=>{
      //let val =JSON.parse(req.query.UserDetails);
              let code = Math.floor(100000 + Math.random() * 900000);
              console.log(code);
              let receiver = req.query.email;
              console.log(receiver);
              users.updateOne({
                  "email": receiver
              }, {
                  $set: {
                      "verificationCode": code
                  }
              }, function(err, results) {
                if (err) {
                    res.send('Error in registration');
                } else {
                  sendMail.send({
                    to:receiver,
                    subject:'Welcome to DIY Portal',
                    html:'<center><h1>Welcome to DIY Supplies Ordering Portal</h1>'+
                    '<br><h3>Hey, thanks for signing up!</h3><br>'+
                    '<p> You are just one click away from activating your account</p><br>'+
                    '<p>This is your activation code <b>'+code+'</b></p><br><br></center><p</p><br>'
                  });
                  res.send({status:'User details saved successfully',email:receiver});
                }
              });
            });

              router.post('/verificationStatus', (req,res)=>{
                        let receiver = req.query.email;
                        console.log("receiver"+receiver);
                        users.updateOne({
                            "email": receiver
                        }, {
                            $set: {
                                "verificationStatus": true
                            }
                        }, function(err, results) {
                          if (err) {
                              res.send('Error in verification');
                          } else {
                              res.send('Verified successfully');
                          }
                        });

                      });
router.post('/addStore', (req, res) =>{
  console.log(' -------------- inn ');
    var countryName = req.query.country;
    var regionName = req.query.region;
    var storeName = req.query.store;
    var response="";
    console.log(countryName,"contry"+regionName);

    retailerSchema.find({
    'region': regionName,
    'country': countryName
  }, function(err, docs) {
    if (err){
      throw err;
      }
      else{

        if(docs.length==0){
          var newretail = new retailerSchema();
          newretail.country = countryName;
          newretail.region = regionName;
          newretail.store.push(storeName);
          newretail.save(function(err, reply){
            if(err){
              reponse=err;
              res.send(reponse);
            }
            else{
              console.log('response from saving new retail details to db ', reply);
              reponse="Saved successfully";
              res.send(reponse);
            }
          });
        }
        else{
          var arr = docs[0].store;
          console.log(arr,"arr");
          console.log(storeName,"storeName");

          for(var i=0; i<arr.length; i++){
            var arrayStore = arr[i];
            if(arrayStore == storeName){
              var status = 'Exist';
              break;
            }
          }

          if(status=='Exist'){
            reponse="Already exist";
            res.send(reponse);

          }
          else{
            arr.push(storeName);
            console.log(arr,"after push");
          }

          retailerSchema.findOneAndUpdate({
            'region': regionName,
            'country': countryName,

          }, {
            $set: {
              'store': arr
            }
          }, function(err) {
            if(err){
            reponse=err;
            res.send(reponse);

            }
            else{
              reponse="Updated successfully";
              res.send(reponse);

             }
            ////console.log(err);
          });
        //  }
        }

      }

  })
})
router.post('/getStore' ,(req,res)=>{
  var country = req.query.country;
    var region = req.query.region;
    console.log(country,"country");
    console.log(region,"region");
    retailerSchema.findOne({ country: country, region:region }, function(err, details) {
      if (err) {
        console.log(err);
        res.send(err);
      } else {
        console.log("storelist",details);
        res.send({details});
      }
    });
});
router.post('/deleteStore' ,(req,res)=>{
  var country = req.query.country;
  var region = req.query.region;
  var store=req.query.store;
  retailerSchema.findOne({ country: country, region: region }, function(err, details) {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      console.log("aaaa",details);
      var arr2=details.store;
      arr2.splice(arr2.indexOf(store),1);
      console.log(arr2,"arr2");
      retailerSchema.findOneAndUpdate({
        'region': region,
        'country': country,

      }, {
        $set: {
          'store': arr2
        }
      }, function(err) {
        if(err){
          res.send(err);
        }
        else{
          res.send("Updated successfully");
         }
        ////console.log(err);
      });
    }
  });
});
module.exports = router;
