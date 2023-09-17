const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const User = require('./model/user')
const deletedUser = require('./model/deleteduser')
const Feedback = require('./model/feedback')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const fs  = require('fs');
const ejs = require('ejs')

const JWT_SECRET = 'sdjkfh8923yhjdksbfma@#*(&@*!^#&@bhjb2qiuhesdbhjdsfg839ujkdhfjk'

mongoose.connect('mongodb+srv://susmi:1234@cluster0.uuoast1.mongodb.net/?retryWrites=true&w=majority', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true
})

const app = express()
app.set('view engine','ejs');
app.use('/', express.static(path.join(__dirname, 'static')))
app.use(bodyParser.json())

app.post('/api/change-password', async (req, res) => {
	const { token, newpassword: plainTextPassword } = req.body

	if (!plainTextPassword || typeof plainTextPassword !== 'string') {
		return res.json({ status: 'error', error: 'Invalid password' })
	}

	if (plainTextPassword.length < 5) {
		return res.json({
			status: 'error',
			error: 'Password too small. Should be atleast 6 characters'
		})
	}

	try {
		const user = jwt.verify(token, JWT_SECRET)

		const _id = user.id

		const password = await bcrypt.hash(plainTextPassword, 10)

		await User.updateOne(
			{ _id },
			{
				$set: { password }
			}
		)
		res.json({ status: 'ok' })
	} catch (error) {
		console.log(error)
		res.json({ status: 'error', error: ';))' })
	}
})

app.get("/change-password", (req, res)=>{
	const data = fs.readFileSync("C:\\Users\\susmi\\Downloads\\helpdesk\\node-auth-youtube-master\\static\\change-password.html", "UTF-8")
	res.send(data);
})


app.post('/api/deleteuser', async (req, res) => {
	const { token, newpassword: plainTextPassword } = req.body

	if (!plainTextPassword || typeof plainTextPassword !== 'string') {
		return res.json({ status: 'error', error: 'Invalid password' })
	}

	if (plainTextPassword.length < 5) {
		return res.json({
			status: 'error',
			error: 'Password too small. Should be atleast 6 characters'
		})
	}

	try {
		const user = jwt.verify(token, JWT_SECRET)

		const _id = user.plainTextPassword
		
		const users = await User.findOne({ _id }).lean()
		// console.log(users);

		// const password = await bcrypt.hash(plainTextPassword, 10)
	
		// if (await bcrypt.compare(password, users.password))

		const response = await deletedUser.create({
			plainTextPassword
		})
		console.log('User deleted successfully: ', response)

			var ab = await User.deleteOne(
				{ "username" : plainTextPassword }
			)
			
			res.json({ status: 'ok' })
		    
		
	} catch (error) {
		console.log(error)
		res.json({ status: 'error', error: 'Error' })
	}
})

app.get("/deleteuser", (req, res)=>{
	const data = fs.readFileSync("C:\\Users\\susmi\\Downloads\\helpdesk\\node-auth-youtube-master\\static\\deleteuser.html", "UTF-8")
	res.send(data);
})

app.post('/api/login', async (req, res) => {
	const { username, password } = req.body
	const user = await User.findOne({ username }).lean()

	if (!user) {
		return res.json({ status: 'error', error: 'Invalid username/password' })
	}

	if (username=='admin') {
		if (await bcrypt.compare(password, user.password)) {
			// the username, password combination is successful
	
			const token = jwt.sign(
				{
					id: user._id,
					username: user.username
				},
				JWT_SECRET
			)
			return res.json({ status: 'okadmin', data: token })
	
		}
	}
	if (await bcrypt.compare(password, user.password)) {
		// the username, password combination is successful

		const token = jwt.sign(
			{
				id: user._id,
				username: user.username
			},
			JWT_SECRET
		)
		return res.json({ status: 'ok', data: token })

	}

	res.json({ status: 'error', error: 'Invalid username/password' })
})

app.get("/login", (req, res)=>{
	const data = fs.readFileSync("C:\\Users\\susmi\\Downloads\\helpdesk\\node-auth-youtube-master\\static\\login.html", "UTF-8")
	res.send(data);
})

app.post('/api/register', async (req, res) => {
	const { username, password: plainTextPassword } = req.body

	if (!username || typeof username !== 'string') {
		return res.json({ status: 'error', error: 'Invalid username' })
	}

	if (!plainTextPassword || typeof plainTextPassword !== 'string') {
		return res.json({ status: 'error', error: 'Invalid password' })
	}

	if (plainTextPassword.length < 5) {
		return res.json({
			status: 'error',
			error: 'Password too small. Should be atleast 6 characters'
		})
	}

	const password = await bcrypt.hash(plainTextPassword, 10)

	try {
		const response = await User.create({
			username,
			password
		})
		console.log('User created successfully: ', response)
	} catch (error) {
		if (error.code === 11000) {
			// duplicate key
			return res.json({ status: 'error', error: 'Username already in use' })
		}
		throw error
	}

	res.json({ status: 'ok' })
})
app.get("/event", (req, res)=>{
	// const data = fs.readFileSync("C:\\Users\\ManojKumar\\Desktop\\Sem 5\\CAT 2\\Web tech\\node-auth-youtube-master\\static\\event.html", "UTF-8")
	res.sendFile("C:\\Users\\susmi\\Downloads\\helpdesk\\node-auth-youtube-master\\static\\event.html");
})

app.get("/feedback", (req, res)=>{
	// const data = fs.readFileSync("C:\\Users\\ManojKumar\\Desktop\\Sem 5\\CAT 2\\Web tech\\node-auth-youtube-master\\static\\event.html", "UTF-8")
	res.sendFile("C:\\Users\\susmi\\Downloads\\helpdesk\\node-auth-youtube-master\\static\\feedback.html");
})

app.post('/api/feedback', async (req, res) => {
	const { name, email,phone,msg } = req.body

	try {
		const response = await Feedback.create({
			name,
			email,
			phone,
			msg
		})
		console.log('Feedback sent successfully: ', response)
	} catch (error) {
		throw error
	}

	res.json({ status: 'ok' })
})

app.get("/tour", (req, res)=>{
	// const data = fs.readFileSync("C:\\Users\\ManojKumar\\Desktop\\Sem 5\\CAT 2\\Web tech\\node-auth-youtube-master\\static\\event.html", "UTF-8")
	app.use(express.static("tour"));
})

app.get("/faq", (req, res)=>{
	// const data = fs.readFileSync("C:\\Users\\ManojKumar\\Desktop\\Sem 5\\CAT 2\\Web tech\\node-auth-youtube-master\\static\\event.html", "UTF-8")
	res.sendFile("C:\\Users\\susmi\\Downloads\\helpdesk\\node-auth-youtube-master\\static\\faq.html");
})

app.get("/queries", (req, res)=>{
	// const data = fs.readFileSync("C:\\Users\\ManojKumar\\Desktop\\Sem 5\\CAT 2\\Web tech\\node-auth-youtube-master\\static\\event.html", "UTF-8")
	res.sendFile("C:\\Users\\susmi\\Downloads\\helpdesk\\node-auth-youtube-master\\static\\q&a.html");
})

app.get("/aboutus", (req, res)=>{
	// const data = fs.readFileSync("C:\\Users\\ManojKumar\\Desktop\\Sem 5\\CAT 2\\Web tech\\node-auth-youtube-master\\static\\event.html", "UTF-8")
	// res.sendFile("C:\\Users\\ManojKumar\\Desktop\\Sem 5\\CAT 2\\Web tech\\node-auth-youtube-master\\static\\About Us section\\index.html");
	app.use(express.static("Aboutus"));
})

app.get("/admin", (req, res)=>{
	Feedback.find({},function(err,feedback){
		Feedback.count({},function(err,countf){
			User.find({},function(err,user){
				User.count({},function(err,countu){
					deletedUser.count({},function(err,dcountu){
		res.render("C:\\Users\\susmi\\Downloads\\helpdesk\\node-auth-youtube-master\\static\\admin.ejs",{feedback,countf,user,countu,dcountu})
	})
				})
			})
		})
	})
})

app.listen(9999, () => {
	console.log('Server up at 9999')
})
