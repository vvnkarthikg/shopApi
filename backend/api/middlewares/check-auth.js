//In postman the token should be passed in headers with a key named authorization

//value should be in format of :

//Bearer token       (word bearer is compulsory, followed by token without any quotation marks)



const jwt = require('jsonwebtoken');

module.exports = (req,res,next) =>{

    try{
        const token = req.headers.authorization.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
          }

         jwt.verify(token,
            process.env.JWT_KEY,(err,decoded)=>{

                if (err) {
                    return res.status(401).json({ message: 'Invalid token' });
                  }

                  req.userData = decoded;
                  
                next();

            });
            
    }
    catch(error){
        return res.status(401).json({
            message: 'Auth failed'
        });
    }
};