var express = require('express');
var router = express.Router();
var cheerio = require('cheerio');
var http = require('http');
var querystring = require('querystring');
var request = require('request');
var rp = require('request-promise');
var users = require('./users');
var modelsUsers= require('../models/users');
/* GET home page. */
router.get('/',ensureAuthenticated, function(req, res, next) {
    res.render('index', { title: 'The Solution Bank' });
});





/* Wait a minute*/
router.get('/codechef',function (req,res,next) {
    if(req.isAuthenticated()){
        res.render('codechef');
    }
    else{
        res.redirect('/users/login');
    }
})

router.post('/result',function (req,res,next) {
    console.log("hello");
    console.log(req.body);
})

/*SEND CODE TO COMPLIE */
router.post('/codechef', function(req, res, next) {
    /*
     API_KEY FOR HACKERRANK
     hackerrank|681256-1210|787975c1092d26cc22e1ef93d65ba8481e2a93f0
    */

    if(req.isAuthenticated()) {
        sendToHackerrank(req,res,next);
    }
    else {
        req.flash('error_msg', "You are not Logged In");
        res.redirect("/users/login");
    }
});



function sendToHackerrank(req,res,next){
    console.log("CALLED\n");
    var test=["hello"];
    console.log(req.body.code);
    var jsonToSend = querystring.stringify({
        'format': 'json',
        'source': req.body.code,
        'lang': 2,
        'wait': 'true',
        'callback_url': '',
        'api_key': 'hackerrank|681256-1210|787975c1092d26cc22e1ef93d65ba8481e2a93f0',
        'testcases': JSON.stringify(test)
    });

    // request option
    var HRoptions = {
        hostname: 'api.hackerrank.com',
        port: 80,
        path: '/checker/submission.json',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(jsonToSend)
        }
    };

    // request object
    var HRrequest = http.request(HRoptions, function(HRresponse) {
        HRresponse.setEncoding('utf8');
        HRresponse.on('data', function (data) {
            try {
                returnContent = data;
            } catch (e) {
                returnContent = "Error: " + e;
            }
        }).on('end', function () {
            console.log("==============================================================");
            console.log("Response:");
            console.log(JSON.parse(returnContent).result);
            res.json(JSON.parse(returnContent).result.stdout);
        });
    });

    // req error
    HRrequest.on('error', function(e) {
        returnContent = "Error: " + e.message;
        //res.json(returnContent);
        res.json(returnContent);
    });

    HRrequest.write(jsonToSend);

    HRrequest.end();
}



function ensureAuthenticated(req,res,next) {
  if(req.isAuthenticated()){
    next();
  }
  else{
  req.flash('error_msg',"You are not Logged In");
  res.redirect("/users/login");
  }
}


module.exports = router;




