define([
  'underscore',
  'backbone',
  'models/plant'
], function(_, Backbone, Plant){
	var Plants = Backbone.Collection.extend({
	    model: Plant,
	    defaults: {
	    	total: 0,
	    }, 
	    comparator: function(property){
			return property.attributes.name;
		},
		url: '/controller/plants',
		initialize: function () {
			//this.listenTo( this, "sync", this.manageRelations);
			//this.on( "change:allies")
			//this.on( "change:enemies")
		},
		numPages: function(){
			var total = this.total;
			if (total){
				var pages = parseInt(total / MAX_PER_PAGE);
				if (total % MAX_PER_PAGE > 0)
					pages++;
				return pages;
			}
			return 1;
		},
		manageRelations: function( args ){
			console.log('companions');
			console.log( args );
		}
	});
  
  	return Plants;
});