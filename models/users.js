var mongoose =require("mongoose");
var bcrypt=require("bcryptjs");

var userSchema = mongoose.Schema({
   name:{
       type: String,
       index: true
   },
    password:{
       type:String
    },
    email:{
       type:String,
        unique: true,
        index:true
    },
    cypher_username:{
       type:String,
        unique: true,
        index:true
    }
});

var User =module.exports =mongoose.model('contest',userSchema);

module.exports.createUser = function (newUser,callback) {
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            if(err){
                console.log("here line 42,modles/users.js")
            }
            else {
                // Store hash in your password DB.
                newUser.password = hash;
                newUser.save(callback);

            }
        });
    });
}

module.exports.getUserByUserName= function (username,callback) {
    var query={cypher_username:username};
    User.findOne(query,callback);
}

module.exports.getUserById= function (id,callback) {
    User.findById(id,callback);
}

module.exports.addCodeChefData=function (email,codechefData,callback) {
    var query={email:email};
    var update={codechef:codechefData};
    User.findOneAndUpdate(query,update,{upsert:true},callback);
}

module.exports.comparePassword=function (candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword,hash,function (err, isMatch) {
        if(err)
            throw err;
        callback(null,isMatch);
    })
}