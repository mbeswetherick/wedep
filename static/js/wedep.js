(function () {

  // state machine for the floating gray box
  // necessary for it moving around with clicks
  var state = {
    slang_def : 0,
    type_def : 1,
    slang_example : 2,
    photo : 3,
    submit: 4
  };

  var currState = state.slang_def;
  var firstTime;
  var typeDefClicks;
  var exampleFirstTime;


  //these are the underlined randomly generated words of varying colors.
  var randomColors = ['rgb(251, 71, 74)','rgb(0, 168, 198)','rgb(247, 176, 52)','rgb(47, 104, 173)','rgb(0, 163, 178)'];
  var randomColorIndex = 0;

  $(document).ready(function(){
    //appearance  code
    firstTime = true;
    exampleFirstTime = true;
    typeDefClicks = 0;
    $("#slang_def").focus();
    initialHide();
    handleEvents();
  });

  function slangDefClick(){
    if(currState != state.slang_def){
      shortAni("373px", "what's a weird slang word you use?"); 
      currState = state.slang_def;
    }
  }

  function slangDefKeyStroke(){
    if(this.value.length > 1 && firstTime){
      firstTime = false;
      shortAni("488px", "k, sweet. What type of word is this?");
       $("#type_def").fadeIn();
      currState = state.type_def;
    }
  }

  function typeDefChange(){
    if(currState == state.type_def){
      shortAni("591px", "great, now use it in a sentence");
      currState = state.slang_example;
      $("#slang_example").fadeIn();
      $("#slang_example").focus();
      typeDefClicks++;
    }
  }

  
  function typeDefClick(){
    if(typeDefClicks == 0){
      typeDefClicks++;
      if(currState != state.type_def){
        shortAni("488px", "k, sweet. What type of word is this?");
        currState = state.type_def;
        
      }
    }
    typeDefClicks = 0;
  }

  function exampleClick(){
    if(currState != state.slang_example){
      shortAni("591px", "great, now use it in a sentence"); 
      currState = state.slang_example;
    }
  }

  function slangExampleKeyStroke(){
    if(this.value.length > 3 && exampleFirstTime){
      exampleFirstTime = false;
      shortAni("700px", "select a sweet photo to capture this word");
      $("#photo").fadeIn();
      currState = state.photo;
    }
  }

  function photoClick(){
    $("#submit_button").fadeIn();
    shortAni("814px", "ok, yay! you can submit your slang now");
    currState = state.submit;
  }

  function grabSlang() {
    $.ajax({
      url: "getSlang.php",
      
    }).done(function(result) {
      $lib_piece = $('div').addClass('lib_piece');
    });
  }

  // calls for the random sentence
  function grabRandom (){
    $.ajax('././grammar.php').done(function (result){
      createRandom(JSON.parse(result));
    });
     animateIndicator('random');
  }

  // creates the random sentences and 
  // the photos associated with it
  function createRandom (slang){
    animateIndicator('random');
    $('#creation').hide();
    $('#onboard').hide();
    $('.lib_piece').remove();
    $('.randomSlang').remove();
    $('#randomAgain').remove();
    $('#randomPhotoHolder').remove();
    $('#stew_holder').append('<div id="randomPhotoHolder">');
    $p = $("<p>").addClass('randomSlang');
    for(var i = 0; i < slang.slangPlusImg.length; i++){
      var entry = slang.slangPlusImg[i];
      var word = entry[0];
      //if there is a photo
      if(entry[1]){
        word = $('<span>').addClass('userRandom').html(entry[0]);
        word.css('border-bottom-color', randomColors[randomColorIndex]);
        $img = $('<img height="200">').addClass('randomPhoto').attr('src','static/usr_photos/' + entry[1] + '.jpg');
        $img.css('border-bottom-color', randomColors[randomColorIndex]);
        $('#randomPhotoHolder').append($img);


        randomColorIndex++;
        //reset colorIndex to start of array
        if(randomColorIndex == randomColors.length)
          randomColorIndex = 0;
      }
      //add the word with a space 
      $p.append(word).append(" ");
    }
    
    $("#stew_holder").append($p.hide().fadeIn());
    $again = $("<a id='randomAgain'>again</a>");
    $again.click(grabRandom);
    $("#stew_holder").append($again);
  }

  function handleEvents(){
    $("#slang_def").keyup(slangDefKeyStroke);
    $("#slang_def").click(slangDefClick);
    $("#type_def").click(typeDefClick);
    $("#type_def").change(typeDefChange);
    $("#slang_example").click(exampleClick);
    $("#slang_example").keyup(slangExampleKeyStroke);
    $("#photo").change(photoClick);
    $('#browse').click(grabPieces);
    $('#contribute').click(restoreHome);
    $('#random').click(grabRandom);
    $('#randomAgain').click(grabRandom);
    $('#submit_button').click(submitPhoto);

    
  }

  // restores the state of the home screen
  function restoreHome() {
    animateIndicator('contribute')

    $('.randomSlang').remove();
    $('.lib_piece').remove();
    $('#randomAgain').remove();
    $('#randomPhotoHolder').remove();
    $('#creation').fadeIn();
    $('#onboard').fadeIn();

  }

  // submits a photo to the database
  function submitPhoto() {
    var fd = new FormData(document.getElementById("slangInfo"));
    $.ajax({
      url: "././getSlang.php",
      type: "POST",
      data: fd,
      processData: false,  
      contentType: false  
    }).done(function (result) {
      $('#creation').fadeOut();
      libraryTopAdjust();
      handlePiecesCreation(result);
    });
  }


  function libraryTopAdjust() {
    animateIndicator('browse');

    $spacer = $('<div>').attr('id', 'spacer');
    $stew_holder = $('#stew_holder');
  }

  // creates all of the slang, photos, and sentences
  function handlePiecesCreation(result){
    pieces = JSON.parse(result);
    $('#creation').hide();
    $('#onboard').hide();
    $('.lib_piece').remove();
    if ($('#spacer').length == 0)
      $stew_holder.append($spacer);

    for (var i = 0; i < pieces.length; i++) {
      var piece = pieces[i];

      $lib_piece = $('<div></div>')
      $lib_piece.addClass('lib_piece');
      $lib_photo = $('<div>');
      $lib_photo.addClass('lib_photo');
      $img = $('<img>');
      $img.attr('height', '500');
      $img.attr('src', 'static/usr_photos/' + piece.image + '.jpg');
      $lib_photo.append($img);
      $lib_piece.append($lib_photo);

      $lib_text = $('<div>').addClass('lib_text');
      $h2 = $('<h2>').addClass('lib_slangtitle').html(piece.word); //add content
      $p = $('<p>').addClass('lib_slangdef').html(piece.example); // add contetn
      $lib_text.append($h2).append($p);
      $lib_piece.append($lib_text);

      $stew_holder.append($lib_piece.hide().fadeIn());
    }
    resizeSlang();

  }

  // grabs the slang from the database
  function grabPieces() {
    $('.lib_piece').remove();
    $('.randomSlang').remove();
    $('#randomAgain').remove();
    $('#randomPhotoHolder').remove();
    libraryTopAdjust();
    $.ajax('././getSlang.php').done(function (result){
      handlePiecesCreation(result)
    });
  }

  // animates the slider on the top bar
  function animateIndicator(option) {
    if (option == 'browse'){
      $('#indicator').animate({
        left: '224px',
        width: '68px'
      });
    } else if(option == 'contribute'){
      $('#indicator').animate({
        left: '130px',
        width: '91px'
      });
    } else {
      $('#indicator').animate({
        left: '329px',
        width: '80px'
      });
    }
  }

  // resizes type depending on how big the word is
  function resizeSlang() {
    $('h2').each(function(){
      if(($(this).text().length > 7)){
        $(this).css('font-size', '36pt');
      }
    });
    $('p').each(function(){
      if(($(this).text().length > 50)){
        $(this).css('font-size', '14pt');
      }
      if(($(this).text().length > 60)){
        $(this).css('font-size', '13pt');
      }
    });
  }

  function initialHide(){
    $("#type_def").hide();
    $("#slang_example").hide();
    $("#photo").hide();
    $("#submit_button").hide();
  }

  // shorthand for the gray animator.
  // give it a y-pixel location and words 
  // to put in the box
  function shortAni(px, text){
    $("#onboard").animate({
         "top": px
    }, "slow");
    $("#chill").text(text); 
  }
})();
