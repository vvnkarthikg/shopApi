//In postman the token should be passed in headers with a key named authorization

//value should be in format of :

//Bearer token  (word Bearer is compulsory, followed by token without any quotation marks)

const jwt = require('jsonwebtoken');

module.exports = (req,res,next)=>{

    try{
        const token = req.headers.authorization.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
          }

        jwt.verify(token ,
            process.env.JWT_KEY,(err,decoded)=>{

                if(err){
                    return res.status(401).json({message:'Invalid token'});
                }

                if(!decoded.isAdmin){
                    return res.status(401).json({message:'You are not an admin'});
                }

                req.userData = decoded;
                next();
            }
        );
    }
    catch(err){
        return res.status(401).json({
            message:'Auth failed'
        });
    }

}