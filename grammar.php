<?php

	$mysqli = new MySQLi('vergil.u.washington.edu', 'root', 'amputations1.', 'wedep', 54344);
	$db_rows = $mysqli->query("SELECT word, type, image FROM slang ORDER BY upload_time DESC");
	$rules = array();
	  for ($row_no = 0; $row_no < $db_rows->num_rows; $row_no++) {
	    $db_rows->data_seek($row_no);
	    $row = $db_rows->fetch_assoc();
	    $rules[$row["type"]][] = $row;
	  }
	
	  
	include 'GrammarSolver.php';
	$grammar = new GrammarSolver(file('grammars.txt', FILE_IGNORE_NEW_LINES), $rules);
	$word = $grammar->generate("[s]");
	echo json_encode(array(
		"word" => $word,
		"slangPlusImg" => $grammar->getSlangPlusImg()
		)
	);

	?>