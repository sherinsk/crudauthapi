var express=require('express')
const bodyParser = require('body-parser');
const mongoose=require('mongoose')
var  jwt=require('jsonwebtoken')
const cors=require('cors')

mongoose.connect('mongodb://localhost:27017/newapi')
app=express()

app.use(bodyParser.json());
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: true}))
app.use(cors({origin:'http://localhost:3000',methods:'GET,HEAD,PUT,PATCH,POST,DELETE',}))


users=require('./routes/medicine.js')
user=require('./models/auth_user.js')


app.use('/user',authenticateToken,users)

const revokedTokens = {};
secretKey='sherinsk'

function authenticateToken(req, res, next) {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ message: 'Token is missing' });
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }

        // decoded contains the payload of the JWT (e.g., { email })
        req.user = decoded;
        console.log(req.user.email)
        next();
    });
}


app.get('/login',(req,res)=>{
	res.json({loginRoute:'success'})
})


app.get('/signup',(req,res)=>{
	res.json({signupRoute:'success'})})



app.post('/signup',async(req,res)=>{

	email=req.body.email
	pwd1=req.body.pwd1
	pwd2=req.body.pwd2

	errors=[]

	const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
	const existuser=await user.find({email:email})

	if(existuser.length>0)
	{
		errors.push('User already exists')
	}
	if(!(emailRegex.test(email)))
	{
		errors.push('Enter a valid email address')
	}
	if(pwd1.length<8)
	{
		errors.push('passwords must be atleast 8 characters long')
	}
	if(pwd1!==pwd2)
	{
		errors.push('password do not match')
	}

	if(errors.length>0)
	{
		res.json({error:errors})
	}
	else
	{
		msg=new user({email:email,password:pwd1})
		msg.save()
		res.json({Signup:'Success'})
		
	}

})


app.post('/login', async (req, res) => {
    email = req.body.email;
    pwd = req.body.password;
    lerrors = [];

    // Assuming `user` is a mongoose model
    const luser = await user.find({ $and: [{ email: email }, { password: pwd }] });

    if (luser.length == 1) {
        // Generate JWT token with email included in the payload
        const token = jwt.sign({ email: luser[0].email }, secretKey, { expiresIn: '24h' });
        res.json({ login: 'Success', token });
    } else {
        lerrors.push('Invalid Credentials');
        res.json({ error: lerrors });
    }
});



app.get('/logout',(req,res)=>{
	const { token } = req.headers;

    // Add the token to the revokedTokens (blacklist)
    revokedTokens[token] = true;

    res.json({ message: 'Logout successful' });

})

app.listen(8080)