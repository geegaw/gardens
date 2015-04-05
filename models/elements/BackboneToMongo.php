<?php 

class BackboneToMongo{
	
	public $id;
	public $data;
	
	private $collection;
	
	
	
	public function __construct( $collection ){
		$this->collection = $collection;
		$this->data = null;
	}
	
	public function get(){
		$this->initData();
		if ( $this->id ){
			if ( $this->id != 'new' )
				$this->data->getByID();
		}
		else{
			$this->data->get();
		}
	}
	
	public function save(){
		$this->initData();
		return $this->data->save();
	}
	
	public function del(){
		$this->initData();
		return $this->data->del();
	}
	
	public function read( $bson ){
		$this->initData();
		return $this->data->read( $bson );
	}
	
	public function prepare(){
		$this->initData();
		return $this->data->prepare();
	}
	
	private function initData(){
		if (!$this->data){
			if ( $this->id ){
				$this->data = new BackboneToMongoModel( $this->collection );
				if ( $this->id != 'new' ){
					$this->data->setID($this->id);
				}
			}
			else{
				$this->data = new BackboneToMongoCollection( $this->collection );
			}
		}
	}
	
}
