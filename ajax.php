<?php
	if($_POST['username'] == "testing" && $_POST['password'] == "testing"){
		$return = true;
	} else {
		$return = false;
	}
	echo json_encode(array('return'=>$return));
?>