define([
  'jquery',
  'underscore',
  'backbone',
  'toolkit',
  'collections/plants',
  'models/plant',
  'text!templates/plants.html',
  'text!templates/plants/list.html',
  'text!templates/plants/select.html',
  'text!templates/plants/relationship.html',
  'plugins/jquery.activeform',
], function($, _, Backbone, GardenToolkit, Plants, Plant, plants, plantsList, plantsSelect, plantRelationship){
	var PlantsView = Backbone.View.extend({
		initialize: function(router){
			_.bindAll(this, 'renderPlants', 'getFormPlant');
			
			document.title = 'Plants';
			this.plants = new Plants();
			
			this.relationTypes = [
				'companions',
				'allies',
				'enemies'  
			];
		},
		render: function(){
			var self = this;
			var tmpl = _.template( plants );
			$('#main').html( tmpl() );
			this.setElement( $('#plants') );
			this.$form = this.$('.form form').activeForm();
			console.log( this.$form );
			self.plants.fetch().done( self.renderPlants );
		},
		renderPlants: function(){
			if ( this.plants.models.length ){
				var tmpl = _.template( plantsList );
				$('#main .list').html( tmpl({ collection: this.plants.toJSON() }) );
				
				tmpl = _.template( plantsSelect );
				$('.form form .relation').html( tmpl({ collection: this.plants.toJSON() }) );
			}
		},
		renderRelationships: function(relationship, model){
			var relations = model.get( relationship );
			var self = this;
			_.each( relations, function( relation ){
				self.renderRelationship(relationship, relation);
			});
		},
		renderRelationship: function(relationship, id){
			var model = this.plants.get( id );
			var tmpl = _.template( plantRelationship );
			$('.form .relations .'+relationship).append( tmpl({ model: model.toJSON() }) );
		},
		events: {
			'click .form form .save'				: 'saveModel',
			'click .form form .cancel'				: 'closeForm',
			'click .list .edit'						: 'editModel',
			'click .list .del'						: 'deleteModel',
			'click .relationship .add'				: 'addRelation',
			'click .relations .del'					: 'removeRelation',
		},
		closeForm: function(e){
			if (e) e.preventDefault();
			this.$form.reset();
			this.$form.data({id:''});
			this.$('.relations ul').html('');
		},
		saveModel: function(e){
			if (e) e.preventDefault();
			var self = this;
			var data = GardenToolkit.formToAssoc( $('.form form ') );
			
			var plant = this.getFormPlant();
			
			plant.set( data );
			var isNew = plant.isNew(); 
			plant.save().done(function(resp){
				self.closeForm(e);
				if (isNew)
					self.plants.add( plant );
				self.renderPlants();
			});
		},
		editModel: function(e){
			this.closeForm(e);
			var self = this;
			var $this = $( e.target );
			var $parent = $this.parents( '.plant:first' );
			var id = $parent.data().id;
			var model = this.plants.get( id );
			
			GardenToolkit.assocToForm( $('.form form '), model.toJSON() );
			_.each(this.relationTypes, function(relation){
				self.renderRelationships( relation, model );
			});
			
			$('.form form ').data({id:id});
		},
		deleteModel: function(e){
			if (e) e.preventDefault();
			var self = this;
			var $this = $( e.target );
			var $parent = $this.parents( '.plant:first' );
			var id = $parent.data().id;
			var model = this.plants.get( id );
		
			model.destroy().success(function(){
				self.plants.remove( id );
				self.renderPlants();
			});
		},
		addRelation: function(e){
			if (e) e.preventDefault();
			var $this = $( e.target );
			var $parent = $this.parents( '.relationship:first' );
			
			var id = $parent.find('.relation').val();
			if (!id){
				GardenToolkit.errorMsg( this.$('errMsg'), 'no relation picked' );
				return;
			}
			
			var type = $parent.find('.type').val();
			if (!type){
				GardenToolkit.errorMsg( this.$('errMsg'), 'no type picked' );
				return;
			}
			
			var plant = this.getFormPlant();
			if ( type == 'companions' )
				plant.addCompanion( id );
			else if ( type == 'allies' )
				plant.addAlly( id );
			else if ( type == 'enemies' )
				plant.addEnemy( id );
			this.renderRelationship( type, id );
		},
		removeRelation: function(e){
			if (e) e.preventDefault();
			var $this = $( e.target );
			var $parent = $this.parents( '.relation:first' );
			var $ul = $parent.parents( 'ul:first' );
			var id = $parent.data().id;
			var plant = this.getFormPlant();
			
			if ( $ul.hasClass( 'companions' ))
				plant.removeCompanion( id );
			else if ( $ul.hasClass( 'allies' ))
				plant.removeAlly( id );
			else if ( $ul.hasClass( 'enemies' ))
				plant.removeEnemy( id );
			$parent.remove();
		},
		getFormPlant: function(){
			if ( $('.form form ').data().id )
				return this.plants.get( $('.form form ').data().id );
			return new Plant();
		},
	});

	return PlantsView;
});