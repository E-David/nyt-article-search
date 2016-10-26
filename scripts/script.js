var NYT_API = "a30a58a6e722476eb77532b42ca43c9b", // Your api code here to be used in URL
	containerNode = document.querySelector(".container") // Select container div

// //helper functions  - SAMPLE CODE ONLY, NOT USED IN PROJECT
// var makeParamString = function(inputObj){
// 	var paramString = '?'
// 	for(var key in inputObj){
// 		paramString += key + '='
// 		paramString += inputObj[key] + '&'  
// 	}
// 	paramString = paramString.slice(0,-1)
// 	return paramString
// }

// var makeUrl = function(object){
// 	return baseUrl + makeParamString(object)
// }
// END SAMPLE CODE

//MODELS
// create a Backbone Collection Constructor (First letter Capitilized - ex. ArticleCollection).
var ArticleCollection = Backbone.Collection.extend({  // Use this exact syntax. Accesses "Collection" Constructor specific to Backbone and uses extend method from Collection constructor
	url: "https://api.nytimes.com/svc/search/v2/articlesearch.json", // URL is a property on the Collection Constructor (which is an object) so use : not =
	parse: function(rawResponse){ // the parse method is specific to Backbone and creates a direct link to the nested property on our fetched object where our main data can be found
		var parsedResponse = rawResponse.response.docs // for example our desired array of data can be found on the docs property of the response property of the rawResponse object
		return parsedResponse; // returns the specified data location
	}
})

//VIEWS
var displayHomepage = function(collection){
	var models = collection.models, // models is a property of the collection object (fetched from the parsed location)
	htmlString = "<div class='article-container'>" // opens the article container div

	console.log(models[0]) // simple test to visualize a single model from the data (not required)
	for(var i = 0; i < models.length; i++){ // loop-de-loop :D

		var headline = models[i].get("headline").main ? models[i].get("headline").main : models[i].get("headline").name
		// ternary statment ( if the .main property exists ? headline becomes .main : else headline becomes .name )
		
		htmlString += "<div class='article'>" //  opens the individual article div
		htmlString += 	"<h3>" + headline + "</h3>" // add the headline as an h3
		htmlString += "</div>" // closes the individual article div
	}
	htmlString += "</div>" // closes the article container div
	containerNode.innerHTML = htmlString // writes the results to our containerNode
}

//CONTROLLER
// create a Backbone Router Constructor (First letter Capitilized - ex. Controller).
var Controller = Backbone.Router.extend({ // Use this exact syntax. Accesses "Router" Constructor specific to Backbone and uses extend method from Router constructor
 	routes: { // Create "routes object" as a property of the extended Controller object. "Routes" matches the hash pattern to a specified method
		"home": "handleHome", // when the url contains #home it will invoke the handleHome method
		"search/:term": "handleSearch", //when the url contains #search/"any_term_here" it will invoke the handleSearch method. ":term" is a generic placeholder for any input on the url
		"*default": "handleDefault" //when the url contains any hash pattern not found (indicated by *) invoke the handleDefault method
	},
	handleHome: function(){
		console.log("Welcome home") // simple test to ensure handleHome is invoked (not required)
		var articleCollection = new ArticleCollection(), // this creates an instance of the ArticleCollection constructor
			promise = articleCollection.fetch() // invokes Backbone fetch method which requests data from url in ArticleCollection constructor seen above (line 21) assigns return value to variable promise
		
		// below is the shortcut version of promise.then(dataHandler) where dataHandler was previously a standalone function; now we're replacing dataHandler with an anonymous function
		promise.then(function(){ // when the data is returned respond by invoking an anonymous function ( a function not assigned to a variable like `var myFunc = function(){}` )
			displayHomepage(articleCollection) // with the fetched data (now in our articleCollection object) invoke displayHomepage
		})
	},
	handleSearch: function(term){ // this method was not completed in class
		console.log("Searching for " + term) // simple test to ensure handleSearch is invoked with a given term (not required)
	},
	handleDefault: function(){ // this method handles an a hash not specified in the "routes" property on line 50
		location.hash = "home" // changes hash to home which invokes the handleHome (because the home hash invokes handleHome in routes (see line 50))
	},
	initialize: function(){ // initialize
		Backbone.history.start()
	}
})

var controller = new Controller() // creates a new instance so our Controller Constructor works.
