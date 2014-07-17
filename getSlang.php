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

          $json = array();
          for ($row_no = 0; $row_no < $db_rows->num_rows; $row_no++) {
            $db_rows->data_seek($row_no);
            $row = $db_rows->fetch_assoc();
            $json[] = $row;
          }
          echo json_encode($json);
?>