const jwt = require('jsonwebtoken');
const { default: mongoose } = require("mongoose");
const userModel = require('../models/userModel');
const booksModel = require('../models/booksModel');

//----------------------------------------authentication----------------------------------------------------*/

const authentication = async(req,res,next) =>{
    try {
        let token = req.headers["x-api-key"];
        if (!token) token = req.headers["x-Api-Key"];

        if (!token) return res.status(400).send({ status: false, massage: "token must be present" });

        let decodedToken = jwt.verify(token, "group_31_functionUp", {ignoreExpiration: true});

        if (!decodedToken){
            return res.status(400).send({ status: false, massage: "token is invalid" })
        }       

        let exp = decodedToken.exp
        let iatNow = Math.floor(Date.now() / 1000)
        if(exp<iatNow) {
            return res.status(401).send({status:false,massage:'session expired, please login again'})
        }

        req.decodedToken = decodedToken;

        next()

    }catch (err) {
        console.log(err.massage)
        res.status(500).send({ status: false, massage: err.message })
    }
}
//--------------------------------------authentication end----------------------------------------------------*/

//----------------------------------------authorization----------------------------------------------------*/

let authorization = async (req, res, next) => {
    try{
        let userId = req.body.userId
        let bookId = req.params.bookId
        const decodedToken = req.decodedToken

        if(!userId){
            return res.status(403).send({ status: false, message: `user Id is must be present !!!!!!!` });

        } else if(mongoose.Types.ObjectId.isValid(userId) == false) {
          return res.status(400).send({ status: false, message: "userId  is not valid !!!!!!" });

        } else if (decodedToken.UserLogin != userId) {
            return res.status(403).send({ status: false, message: `unauthorized access` });

         } 
         
         //else if(!bookId){
        //     return res.status(403).send({ status: false, message: `book Id is must be present !!!!!!!` });

        // } else if(mongoose.Types.ObjectId.isValid(bookId) == false) {
        //     return res.status(400).send({ status: false, message: "book id  is not valid !!!!!!" });

        // }

        // let bookById = await booksModel.findOne({_id: bookId,isDeleted: false, deletedAt: null})

        // if(!bookById){
        //     return res.status(403).send({ status: false, message: `book Id is not found  !!!!!!!` });

        // } else if (decodedToken.UserLogin != bookById.userId) {
        //     return res.status(403).send({ status: false, message: `unauthorized access` });

        // }
        next();

    }catch(err){
        console.log(err.massage)
        res.status(500).send({status: false, massage: err.massage})
    }
}

module.exports = { authentication, authorization }

//------------------------------------authorization end ----------------------------------------------------*/