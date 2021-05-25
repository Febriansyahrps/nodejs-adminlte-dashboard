var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/',function(req,res,next){
	res.render('main/login',{title:"Login Page"});
});
router.post('/',function(req,res,next){
	session_store=req.session;
	req.assert('password', 'ERROR').notEmpty();
	var errors = req.validationErrors();
	if (!errors) {
		req.getConnection(function(err,connection){
			v_pass = req.sanitize( 'password' ).escape().trim(); 
			v_username = req.sanitize( 'username' ).escape().trim();
			
			var query = connection.query('select * from user where username="'+v_username+'" and password="'+v_pass+'"',function(err,rows)
			{
				if(err)
				{

					var errornya  = ("Error Selecting : %s ",err.code );  
					console.log(err.code);
					req.flash('msg_error', errornya); 
					res.redirect('/login'); 
				}else
				{
					if(rows.length <=0)
					{

						req.flash('msg_error', "Wrong email address or password. Try again."); 
						res.redirect('/login');
					}
					else
					{	
						session_store.is_login = true;
						res.redirect('/user');
					}
				}

			});
		});
	}
	else
	{
		errors_detail = "Sory there are error<ul>";
		for (i in errors) 
		{ 
			error = errors[i]; 
			errors_detail += '<li>'+error.msg+'</li>'; 
		} 
		errors_detail += "</ul>"; 
		console.log(errors_detail);
		req.flash('msg_error', errors_detail); 
		res.redirect('/'); 
	}
});
router.get('/logout', function(req, res)
{ 
	req.session.destroy(function(err)
	{ 
		if(err)
		{ 
			console.log(err); 
		} 
		else 
		{ 
			res.redirect('/'); 
		} 
	}); 
});
module.exports = router;