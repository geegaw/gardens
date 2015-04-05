<?php

class BackboneToMongoModel extends Node{
	
	public function prepare(){
		$bson = array();
		if ( $this->data ){
			$bson = array( 'data' => $this->data);
		}
		return parent::prepare() + $bson;
	}
	
	public function read( $bson ){
		parent::read( $bson );
		$this->data = isset( $bson['data'] ) ? $bson['data'] : array();
	}
}
