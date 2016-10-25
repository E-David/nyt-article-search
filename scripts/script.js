var NYT_API = "a30a58a6e722476eb77532b42ca43c9b",
	containerNode = document.querySelector(".container")

//helper functions
var makeParamString = function(inputObj){
 	var paramString = '?'
    for(var key in inputObj){
        paramString += key + '='
    	paramString += inputObj[key] + '&'  
    }
    paramString = paramString.slice(0,-1)
    return paramString
}

var makeUrl = function(object){
	return baseUrl + makeParamString(object)
}

//MODELS
var ArticleCollection = Backbone.Collection.extend({
	url: "https://api.nytimes.com/svc/search/v2/articlesearch.json",
	parse: function(rawResponse){
		var parsedResponse = rawResponse.response.docs
		return parsedResponse;
	}
})

//VIEWS
var displayHomepage = function(collection){
	var models = collection.models,
		htmlString = "<div class='article-container'>"

	console.log(models[0])
	for(var i = 0; i < models.length; i++){

		htmlString += "<div class='article'>"
		htmlString += 	"<h3>" + 
						models[i].get("headline").main ? models[i].get("headline").main : models[i].get("headline").name + 
						"</h3>"
		htmlString += "</div>"
	}
		htmlString += "</div>"
	containerNode.innerHTML = htmlString
}

//CONTROLLER
var Controller = Backbone.Router.extend({
	routes: {
		"home": "handleHome",
		"search/:term": "handleSearch",
		"*default": "handleDefault"
	},
	handleHome: function(){
		console.log("Welcome home")
		var articleCollection = new ArticleCollection(),
			promise = articleCollection.fetch()
			promise.then(function(){
				displayHomepage(articleCollection)
			})
	},
	handleSearch: function(term){
		console.log("Searching for " + term)
	},
	handleDefault: function(){
		location.hash = "home"
	},
	initialize: function(){
		Backbone.history.start()
	}
})

var controller = new Controller()