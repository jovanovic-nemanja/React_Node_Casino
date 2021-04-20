const {adminUser,sessionmodel,usersessionmodel} = require("../../models/users_model");
const BASECONTROL = require("../../controller/basecontroller");
const Usercontrol = require("../../controller/userscontroller");
const Config = require("../../config/index.json")
const expires = Config.session.expiretime;
const auth = {
    
    // checks if the user is logged in, if not, redirect to the 
    // unauthorized route
    isLoggedIn: async (req, res, next)=> {

        var hash = decodeURIComponent(req.headers.authorization);
        var decod = BASECONTROL.decrypt(hash);
        if(decod){
            decod = JSON.parse(decod);
            let user = await BASECONTROL.BfindOne(adminUser,{_id : decod._id});
            if(user && user.status === "allow"){
                req.user = user;
                let last = await BASECONTROL.BfindOne(usersessionmodel,{hash:hash});
                if(last){
                    let passtime = (new Date().valueOf() - parseInt(last.inittime))/1000;
                    if(passtime > expires){
                        await BASECONTROL.BfindOneAndDelete(usersessionmodel,{hash:hash});
                        return res.json({session : true});
                    }else{
                        let up =  await BASECONTROL.BfindOneAndUpdate(usersessionmodel,{hash:hash},{inittime:new Date().valueOf()});
                    }
                }else{
                    let row = {
                        hash:hash,
                        inittime:new Date().valueOf(),
                        email :user.email,
                    }
                    await BASECONTROL.data_save(row,usersessionmodel);
                }
                next();
            }else{
                return res.json({session : true});
            }
        }else{
            return res.json({session : true});
        }
    },

    // middleware function to log out the user
    logoutUser: (req, res, next)=> {
        console.log('logged out successfully')
        next();
    },

}

module.exports = auth;
