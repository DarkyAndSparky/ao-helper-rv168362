var currentLocale = null;

FWLocale.SetLocale = function(locale) {
    currentLocale = locale;
    $('body').attr('class', currentLocale);
    FWLocale.updateLocale();    
}

FWLocale.OnLoadLocale = function( newLocale ) {
	if ( newLocale != currentLocale ) {
		var isPresent = false;
		for(var i = 0; i < FWLocale.langs.length; i++) {
			if (FWLocale.langs[i].value == newLocale) {
				isPresent = true;
				break;
			}
		}			
		
		if ( isPresent ) {
			FWLocale.SetLocale( newLocale );
		}
		else
			FWLocale.SetLocale( FWLocale.langs[0].value );
	}
}


function getText(id)  {
	var str = '';
	if (typeof FWLocale[currentLocale] != 'undefined') {
		var lang = FWLocale[currentLocale];
		if (typeof lang[id] != 'undefined') {
			str = lang[id];
		}
	}
	return str;
}


FWLocale.updateLocale = function () {
	$('#attention').html( getText('attention') );
	$('#mainHeader').html( getText('mainHeaderText') );
	$('#mainBody').html( getText('mainBodyText') );	
	$('#liA').html( getText('liAText') );	
	$('#liB').html( getText('liBText') );	
	$('#liC').html( getText('liCText') );				
	$('#mainFotter').html( getText('mainFotterText') );
	$('#post_window').html( getText('post') );	
}

