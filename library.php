<html>
  <head>
  <link href='http://fonts.googleapis.com/css?family=Armata' rel='stylesheet' type='text/css'>
  <link href="static/css/wedep.css" type="text/css" rel="stylesheet">
    <script src="static/js/jquery.js"></script>
    <script src="static/js/wedep.js"></script>
    <script src="static/js/library.js"></script>

    <link rel="icon" type="image/png" href="static/img/fav.png">
    <title>wedep - slang genome</title>
  </head>

  	<body>
      <nav id="top_nav">
        <ul>
          <li><a href="index.html">Contribute</li>
          <li ><a id="current_page" href="library.php">Browse</a></li>
        </ul>
      </nav>
        <?php
          $mysqli = new MySQLi('vergil.u.washington.edu', 'root', 'amputations1.', 'wedep', 54344);
          //check duplicate name  
        //  print "\ncontentes of FILES array:\n";
          //print_r($_FILES);
          
          //upload code
          if(is_uploaded_file($_FILES["pic"]["tmp_name"]) && isset($_POST["word"])
                                  && isset($_POST["rule"]) && isset($_POST["example"])){
            //initialize variables
            $word = mysql_escape_string($_POST["word"]);
            $rule = $_POST["rule"];
            $example = $_POST["example"];

            //check duplicate name
            $rows = $mysqli->query("SELECT * FROM slang WHERE word = '" . $word ."'");
            if($rows->num_rows > 0){
              $image = $word . "_" . $rows->num_rows;
            }else{
              $image = $word;
            }  
            $rows->close(); 
            move_uploaded_file($_FILES["pic"]["tmp_name"], "static/usr_photos/$image.jpg");

            /*$q = "INSERT INTO `users`(`username`, `password`) VALUES ('".$username."', '".$password."')";
            $mysqli->query("INSERT INTO slang (word, type, example, image) VALUES (
              '" . $word . "',
              '" . $rule . "',
              '" . $example . "',
              '" . $image . "')
            ");
            */
            if (!$mysqli->query("INSERT INTO slang (word, type, example, image) VALUES (
              '" . $mysqli->real_escape_string($word) . "',
              '" . $rule . "',
              '" . $mysqli->real_escape_string($example) . "',
              '" . $mysqli->real_escape_string($image) . "')")) {
                echo "Table insertion failed: (" . $mysqli->errno . ") " . $mysqli->error;
            }

            
          }
          $db_rows = $mysqli->query("SELECT * FROM slang ORDER BY upload_time DESC");
        ?>
    
  		<div id="library_holder">
        <div id="main">
          <h1>wedep</h1>
          <!-- <img src="static/img/logo.png" /> -->
        </div>
        <div id="spacer"></div>
        <?php for ($row_no = 0; $row_no < $db_rows->num_rows; $row_no++) {
          $db_rows->data_seek($row_no);
          $row = $db_rows->fetch_assoc();
        ?>
    			<div class="lib_piece">
    				<div class="lib_photo">
    					<img height="500" src="static/usr_photos/<?=$row['image'] ?>.jpg">
    				</div>
    				<div class="lib_text">
    					<h2 class="lib_slangtitle"><?=$row['word'] ?></h2>
    					<p class="lib_slangdef"><?=$row['example'] ?></p>
    				</div>
    			</div>
        <?php } 
          $db_rows->close();
          $mysqli->close();
        ?>
  		</div>
    </body>
</html>
