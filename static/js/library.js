$(document).ready(function(){
  //appearance  code

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
});//dubaa