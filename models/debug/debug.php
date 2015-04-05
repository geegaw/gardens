<?php

class debug{
	
	static function printr( $w, $die=false ){
		echo '<pre>'; print_r($w); echo '</pre>';
		if ($die) die;
	}
	
	static function h1( $w, $die=false ){
		echo '<h1>'.$w.'</h1>';
		if ($die) die;
	}
}
