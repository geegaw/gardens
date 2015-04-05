<?php 
define ('DIR', dirname(__FILE__));
require DIR.'/conf/config.php';

$inc = array(
	'debug',
	'core',
	'tools',
	'elements',
);

foreach ($inc as $include){
	$models = glob( DIR.'/models/'.$include.'/*.php'  );
	foreach ($models as $model) require $model;
}

$cmsMongo = new customMongo( 'garden' );
if ( !$cmsMongo->status->success() ){
	echo '<div class="error fullWidth">'.$cmsMongo->status->msg.'</div>';
}

if ( strpos( $_SERVER['REQUEST_URI'] , 'controller') ){
	$controller = new GardenRESTController();
	$controller->dispatch();
}
else {
	include 'includes/main.php';
}
