define([
  'jquery',
  'underscore',
  'backbone',
  'toolkit',
  'collections/gardens',
  'models/garden',
  'text!templates/gardens.html',
  'text!templates/common/list.html',
  'plugins/jquery.activeform',
], function($, _, Backbone, GardenToolkit, Gardens, Garden, gardens, list){
	var GardensView = Backbone.View.extend({
		initialize: function(router){
			_.bindAll(this, 'renderGardens', 'getFormGarden');
			
			document.title = 'Gardens';
			this.gardens = new Gardens();
			
			this.relationTypes = [
				'companions',
				'allies',
				'enemies'  
			];
		},
		render: function(){
			var self = this;
			var tmpl = _.template( gardens );
			$('#main').html( tmpl() );
			this.setElement( $('#gardens') );
			this.$form = this.$('form').activeForm();
			self.gardens.fetch().done( self.renderGardens );
		},
		renderGardens: function(){
			if ( this.gardens.models.length ){
				var tmpl = _.template( list );
				$('#gardens .list').html( tmpl({ classname: 'garden', collection: this.gardens.toJSON() }) );
			}
		},
		events: {
			'click .form .save'						: 'saveModel',
			'click .form .cancel'					: 'closeForm',
			'click .list .edit'						: 'editModel',
			'click .list .del'						: 'deleteModel',
			'click .relationship .add'				: 'addRelation',
			'click .relations .del'					: 'removeRelation',
		},
		closeForm: function(e){
			if (e) e.preventDefault();
			this.$form.reset();
			this.$form.data({id:''});
		},
		saveModel: function(e){
			if (e) e.preventDefault();
			var self = this;
			var data = GardenToolkit.formToAssoc( this.$form );
			var garden = this.getFormGarden();
			garden.set( data );
			var isNew = garden.isNew(); 
			garden.save().done(function(resp){
				self.closeForm(e);
				if (isNew)
					self.gardens.add( Garden );
				self.renderGardens();
			});
		},
		editModel: function(e){
			this.closeForm(e);
			var self = this;
			var $this = $( e.target );
			var $parent = $this.parents( '.garden:first' );
			var id = $parent.data().id;
			var model = this.gardens.get( id );
			
			GardenToolkit.assocToForm( this.$form, model.toJSON() );
			this.$form.data({id:id});
		},
		deleteModel: function(e){
			if (e) e.preventDefault();
			var self = this;
			var $this = $( e.target );
			var $parent = $this.parents( '.Garden:first' );
			var id = $parent.data().id;
			var model = this.gardens.get( id );
		
			model.destroy().success(function(){
				self.gardens.remove( id );
				self.renderGardens();
			});
		},
		getFormGarden: function(){
			if ( this.$form.data().id )
				return this.gardens.get( this.$form.data().id );
			return new Garden();
		},
	});

	return GardensView;
});