<?php

include 'ESMSWS.php';


$username = 'esmsusr_25';
$password = '#2025Nitfsms';

$session = createSession('',$username,$password,'');
var_dump($session);


	$message = "Test";
	$recipients='0762240099,077XXXXXX,076XXXXXX';
	$alias = 'QATest';

echo sendMessages($session,$alias,$message,explode(",",$recipients),0);

closeSession($session);





?>