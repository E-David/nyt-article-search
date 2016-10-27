var NYT_API_KEY = "a30a58a6e722476eb77532b42ca43c9b" // Your api code here to be used in URL

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
var searchNode = document.querySelector(".search")

var doSearch = function(eventObject) {
	if(eventObject.keyCode === 13) {
		var inputNode = eventObject.target,
			searchVal = inputNode.value

		location.hash = "search/" + searchVal
		inputNode.value = ""
	}
}

searchNode.addEventListener("keydown", doSearch)

var ListView = Backbone.View.extend({
	el: document.querySelector(".news-container"),
	_render: function(){
		var articles = this.collection.models
		console.log(articles)
		var htmlString = ""
		for(var i = 0; i < articles.length; i++){
			var articleModel = articles[i]
			var headline = articleModel.get("headline").name ? articleModel.get("headline").name : articleModel.get("headline").main
			
			htmlString += "<a href='"
			htmlString += "<h3>" + headline + "</h3>"
		}
		this.el.innerHTML = htmlString

	},
	initialize: function(){
		console.log("making a new view")
		this.collection.on("sync",this._render.bind(this))
	}
})

//CONTROLLER
// create a Backbone Router Constructor (First letter Capitilized - ex. Controller).
var Controller = Backbone.Router.extend({ // Use this exact syntax. Accesses "Router" Constructor specific to Backbone and uses extend method from Router constructor
 	routes: { // Create "routes object" as a property of the extended Controller object. "Routes" matches the hash pattern to a specified method
		"home": "handleHome", // when the url contains #home it will invoke the handleHome method
		"search/:term": "handleSearch", //when the url contains #search/"any_term_here" it will invoke the handleSearch method. ":term" is a generic placeholder for any input on the url
		"detail/:articleID": "handleDetail",
		"*default": "handleDefault" //when the url contains any hash pattern not found (indicated by *) invoke the handleDefault method
	},
	handleHome: function(){
		console.log("Welcome home") // simple test to ensure handleHome is invoked (not required)
		var articleCollection = new ArticleCollection(), // this creates an instance of the ArticleCollection constructor
			view = new ListView({
				collection: articleCollection
			})

		articleCollection.fetch({
			data: {
				"api-key": NYT_API_KEY
			}
		})
	},
	handleSearch: function(term){ // this method was not completed in class
		 var articleCollection = new ArticleCollection(), // this creates an instance of the ArticleCollection constructor
			view = new ListView({
				collection: articleCollection
			})

		articleCollection.fetch({
			data: {
				"api-key": NYT_API_KEY,
				"q": term
			}
		})// simple test to ensure handleSearch is invoked with a given term (not required)
	},
	handleDetail: function(articleID){
		console.log(articleID)
	},
	handleDefault: function(){ // this method handles an a hash not specified in the "routes" property on line 50
		location.hash = "home" // changes hash to home which invokes the handleHome (because the home hash invokes handleHome in routes (see line 50))
	},
	initialize: function(){ // initialize
		Backbone.history.start()
	}
})

var controller = new Controller() // creates a new instance so our Controller Constructor works.
