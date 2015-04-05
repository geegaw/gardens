define([
  'underscore',
  'backbone',
  'models/garden'
], function(_, Backbone, Garden){
	var Gardens = Backbone.Collection.extend({
	    model: Garden,
	    defaults: {
	    	total: 0,
	    }, 
	    comparator: function(property){
			return property.attributes.name;
		},
		url: '/controller/gardens',
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
	});
  
  	return Gardens;
});