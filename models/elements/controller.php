<?php

class GardenRESTException extends Exception{}
class KoolahRESTPermissionException extends Exception{}

class GardenRESTController{
	private $status;
	private $id;
	
	public function __construct(){
		$this->status = new StatusTYPE();
	}
	
	private function parseUrl(){
		$url = koolahToolKit::getParam('REQUEST_URI', $_SERVER);
		if (!$url)
			throw new GardenRESTException( 'no url' );
		
		$url = ltrim( str_replace('/controller', '', $url), '/');
		$parts = explode( '/', $url );
		
		if (!isset($parts[0]))
			throw new GardenRESTException( 'no collection' );
		
		$this->collection = $this->clean( $parts[0] );
		$this->obj = new BackboneToMongo( $this->collection );
		
		if ( count( $parts ) > 1 ){
			$this->id = $this->clean( $parts[1] );
			$this->obj->id = $this->id;
		}
	}
	
	private function clean($str){
		$str = strtolower($str);
		$str = preg_replace('/[^a-zA-Z0-9_]/', '', $str);
		return $str;
	}
	
	public function dispatch(){
		$obj = null;
		try{
			if (!isset($_SERVER['REQUEST_METHOD']))
				throw new GardenRESTException('no request method');

			$method = strtolower($_SERVER['REQUEST_METHOD']);
			if ($method == 'post')
				$method = 'put';
			if (!method_exists($this, $method))
				throw new GardenRESTException('unkown request method: '.$method);
			$this->parseUrl();
			$obj = $this->$method();
						
		}
		catch (GardenRESTException $e){
			$this->status->setFalse( $e->getMessage() );
		}
		catch (KoolahRESTPermissionException $e){
			$this->status = cmsToolKit::permissionDenied( $e->getMessage() );
		}
		$this->renderResponse($obj);
	}
	
	private function get(){
		if ( $this->id &&  $this->id == 'new' )
			return null;
		$this->obj->get();
		
		return $this->obj;
	}
	
	private function put(){
		$data = $this->getStreamData();

		if (isset($data['id']) && $data['id'] && $data['id'] != 'null'){
			$this->obj->id = $data['id'];
			unset($data['id']);
		}
		$this->obj->get();
    	$this->obj->read( array( 'data' => $data ) );
        $status = $this->obj->save();
        if ( !$status->success() )
			throw new GardenRESTException( $status->msg );
        return $this->obj;
	}
	
	private function delete(){
		if ( !$this->id || $this->id == 'new' )
			throw new GardenRESTException('no id passed'); 
		
		$this->obj->get();
		$status = $this->obj->del();
		
		if ( !$status->success() )
			throw new GardenRESTException( $status->msg );
        			
		return null;
	}
	
	private function getStreamData(){
		return json_decode(file_get_contents('php://input'), true);
	}
	
	private function validateObj(){
		if( !isset( $_REQUEST['className']))
			throw new GardenRESTException('Not enough Information passed');
		if ( $_REQUEST['className'] == null )
			throw new GardenRESTException('Not enough Information passed');
			
		$className = $_GET['className'];
		if ( !in_array($className, $this->ajaxAccess) )
			throw new KoolahRESTPermissionException('object access error');
			
		$obj = new $className();
		if ( !$obj->status->success() )
			throw new KoolahRESTPermissionException('object does not exist');
		
		if (!method_exists($obj, 'get') )
			throw new GardenRESTException("$className does not have neccessary methods");
		
		return $obj;
	}
	
	private function renderResponse($result=null){
		$response =	array( 
			'status'=>$this->status->success(), 
			'msg'=>$this->status->msg 
		);
		
		if ($result){
			$response = $result->prepare();	
			if (method_exists($result, 'total')){
				$response = array(
					'nodes' => $response,
					'total' => $result->total,
				); 
			}
		
			
			
		}
		elseif (!$this->status->success())
			header("HTTP/1.1 500 Internal Server Error");
		
		header('Content-type: application/json');  
		echo json_encode($response);  
	}
}
