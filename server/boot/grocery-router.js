'use strict';

var request        = require('request');
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;
// var loopback = require('loopback');


module.exports = function(app) {

  var router  = app.loopback.Router();

  router.get('/change-the-name/grocery/:groceryId', function(req, res, next){ 
    var groceryId = req.params.groceryId;
  	var Grocery = app.models.Grocery;
  	Grocery.findById(groceryId, {}, function(err, model){
  		model.updateAttribute('title', 'Ultimate Grocery List #' + new Date().toString());
      res.redirect('/auth/account');
  	});

  });

  router.post('/addtopurchased', function(req, res, next){
    // console.log(req.body);
  	var Grocery        = app.models.Grocery;
    var ingredientsArr = req.body.ingredients;
   	var groceryId      = req.body.groceryId;

    Grocery.makePurchased(groceryId, ingredientsArr, function(){});

    // Grocery.clearPurchased(groceryId, function(){});
    // res.redirect('/auth/account');

  });

  router.post('/clearpurchased', function(req, res, next){
    // console.log(req.body);
    var Grocery        = app.models.Grocery;
    var groceryId      = req.body.groceryId;

    Grocery.clearPurchased(groceryId, function(){});
    res.redirect('/auth/account');

  });

	router.get('/remove-from-purchased/:groceryId/:ingId', function(req, res, next){

		var Grocery = app.models.Grocery;

		// console.log( req.user.id );		

	 	var ingId     = req.params.ingId;
 		var groceryId = req.params.groceryId;

		Grocery.withPurchased(groceryId, ingredients, function(err, model){

			var data = model.toJSON();
      console.log(data.purchased);
      
      if( !data.purchased ){ return true; } //:todo test this
      
      let forDeletion = ingredients;

	    let arr = data.favorites;

	    arr = arr.filter(item => !forDeletion.includes(item))
	      // !!! Read below about array.includes(...) support !!!

	      console.log(arr);

	      model.updateAttribute('purchasedIds', arr);
	      console.log(model);

  		});




  });


 //:todo add relations and display whole information about 
 //:todo make it more protected from view
 router.get('/view/grocery/:groceryId', ensureLoggedIn('/auth/account'), 
  function(req, res, next){

    // console.log( req.params.groceryId );
    // console.log( req.user.id );

    var Grocery   = app.models.Grocery;
    var groceryId = req.params.groceryId;
    // var userId    = req.user.id;

    // console.log(groceryId);
    // console.log(userId);


    Grocery.fetchById(groceryId, function(err, grocery){

    	// console.log(grocery);

    	// console.log(grocery.departments);

    	res.render('pages/grocery', {
    		  title: 'Grocery: ' + grocery.id,
	        data: grocery, //:todo change names, punk!
	        // url: req.url,
	        messages: {},
	        departments: grocery.departmentsList
	      });  

    });

    // Grocery.findById(req.params.groceryId, {}, function(err, grocery){
      
    //   console.log(grocery.departments);

  

    // });





 });

  app.use(router);

};