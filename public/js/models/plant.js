define([
  'underscore',
  'backbone',
], function(_, Backbone){
	var Plant = Backbone.Model.extend({
	    defaults: {
	    	name: '',
	    	sunlight_high: null,
	    	sunlight_low: null,
	    	ph_high: null,
	    	ph_low: null,
	    	companions: [],
	    	allies: [],
	    	enemies: [],
	    },
	    idAttribute: 'id',
	    url: function(){
	    	var url = '/controller/plants';
	    	if (this.id)
	    		url+= '/'+this.id;
	    	else
	    		url+= '/new';  
	    	return url;
	    },
	    initialize: function () {
	    	this.relations = [];
	    	this.on( "sync", this.manageRelations, this);
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
		addCompanion: function( id ){
			this.addRelation( 'companions', id );
		},
		removeCompanion: function( id ){
			this.removeRelation( 'companions', id );
		},
		addAlly: function( id ){
			this.addRelation( 'allies', id );
		},
		removeAlly: function( id ){
			this.removeRelation( 'allies', id );
		},
		addEnemy: function( id ){
			this.addRelation( 'enemies', id );
		},
		removeEnemy: function( id ){
			this.removeRelation( 'enemies', id );
		},
		
		addRelation: function(type, id, exteriorCall){
			if ( id == this.id )
				throw new exception( 'can not relate to self' );
			var relations = this.get(type);
			relations.push( id );
			this.set({ type: relations });
			
			if ( !exteriorCall ){
				var relation = this.collection.get( id );
				relation.addRelation( type, this.id, true );
				if ( _.indexOf( this.relations, id ) == -1 )
					this.relations.push( id );
			}
		},
		
		removeRelation: function(type, id, exteriorCall){
			if ( id == this.id )
				throw new exception( 'can not relate to self' );
			var relations = this.get(type);
			var index = _.indexOf(relations, id);
			relations.splice( index, 1 );
			this.set({ type: relations });
			
			if ( !exteriorCall ){
				var relation = this.collection.get( id );
				relation.removeRelation( type, this.id, true );
				if ( _.indexOf( this.relations, id ) == -1 )
					this.relations.push( id );
			}
		},
		manageRelations: function(args, resp, opts){
			var self = this;
			if ( self.relations.length ){
				_.each( self.relations, function(id){
					var relation = self.collection.get( id );
					relation.save(); 
				});
				self.relations = [];
			}
		},
		
	});
  
  	return Plant;
});