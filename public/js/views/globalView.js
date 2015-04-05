define([
  'jquery',
  'underscore',
  'backbone',
], function($, _, Backbone){
	var GlobalView = Backbone.View.extend({
		el: $('body'),
		initialize: function(router){
			$('.hide').hide().removeClass('hide');
			this.router = router;
		},
		events: {
			'click #mainNav a': 'handleNav',
	    },
	    handleNav: function(e){
	    	//e.preventDefault();
	    },
	});

	return GlobalView;
});