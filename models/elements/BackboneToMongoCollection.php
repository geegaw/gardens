<?php

class BackboneToMongoCollection extends Nodes{
	
	public function get( $q=null, $fields=null, $orderBy=null, $offset=0, $limit=null, $distinct=null ){
		$bson =  parent::get( $q, $fields, $orderBy, $offset, $limit, $distinct );
		foreach ( $bson as $obj ){
			$node = new BackboneToMongoModel( $this->collection );
			$node->read( $obj );
			$this->append( $node );
		}
	}
}
