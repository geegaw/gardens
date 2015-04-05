define([
  'jquery',
  'underscore',
  'backbone',
  'views/globalView'
], function($, _, Backbone, GlobalView){
  
  var urls = [ 
  	'home', 
  	'plants', 
  	'gardens' 
  ];
  
  var routes = {};
  _.each(urls, function(url){
  	routes[ url ] = url+'Init';
  });
  routes[ '*actions' ] = 'defaultAction';
  var GardenRouter = Backbone.Router.extend({
    routes: routes
  });
  var self = this;
  			
  var initialize = function(){
  	var gardenRouter = new GardenRouter();
  	var globalView = new GlobalView(gardenRouter);
  	gardenRouter.on({
  		'route:defaultAction': function(actions){
  			require(['text!templates/404.html'], function(pagenotfound){
				var tmpl = _.template( pagenotfound );
				$('#main').html( tmpl() );
			});
	   	},
	   	'route:homeInit': function(actions){
  			require(['views/home/home'], function(HomeView){
  				var homeView = new HomeView(GardenRouter);
			});
	   	},
	   	'route:plantsInit': function(actions){
  			require(['views/plants'], function(PlantsView){
  				var plantsView = new PlantsView(GardenRouter);
  				plantsView.render();
			});
	   	},
	   	'route:gardensInit': function(actions){
  			require(['views/gardens'], function(GardensView){
  				var gardensView = new GardensView(GardenRouter);
  				gardensView.render();
			});
	   	},

	});
  
  	//Backbone.history.start();
    Backbone.history.start({pushState: true});
  };
  
  return {
    initialize: initialize
  };
});