define([
  'underscore',
  'backbone',
], function(_, Backbone){
	var Garden = Backbone.Model.extend({
	    defaults: {
	    	name: '',
	    },
	    idAttribute: 'id',
	    url: function(){
	    	var url = '/controller/gardens';
	    	if (this.id)
	    		url+= '/'+this.id;
	    	else
	    		url+= '/new';  
	    	return url;
	    },
		parse: function(data, options) {
			if (data._id){
				data.id = data._id.$id;
				delete(data._id);
			}
			if (data.data){
				for ( key in data.data ){
					data[ key ] = data.data[ key ];
				}
				delete(data.data);
			}
	    	return data;
		},
		
	});
  
  	return Garden;
});