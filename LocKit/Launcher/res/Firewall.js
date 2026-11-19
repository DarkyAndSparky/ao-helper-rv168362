var Firewall = {};

Firewall.isReady = false;

Firewall.SetReady = function(){
	if ( Firewall.isReady == true ){
		FWLocale.Load();
	}
	Firewall.isReady = true;
}

FWLocale.Load = function() {
	var LOCALE_LOAD_COMMAND = 'app:10';
	window.navigate( LOCALE_LOAD_COMMAND );
}

FWLocale.OnLoad = function( newLocale ) {
	FWLocale.OnLoadLocale( newLocale );
}

Firewall.Accept = function(){
	var UPDATE_FIREWALL_COMMAND = 'app:77';
	window.navigate( UPDATE_FIREWALL_COMMAND );
}

Firewall.Cancel = function(){
	window.navigate('app:1002');
}


//--------------------------------------------------------------------------
$(document).ready(function() {
	backgroundImageCache();
    disableContextMenu();
	
	$('a[href^="http"]').click( function() {
		 openLinkAtDefaultBrowser(this.href);
		 return false;
	});
	

	//if ( !isIE5 )
	{
		$('#message').draggable({containment:[-390, -10, 730, 575], handle: '#message-title', cursor: 'move'});	
	}

	$('#set-focus').focus();

	setButtonEvent('close');
	setButtonEvent('fwaccept');
	setButtonEvent('fwcancel');
	setButtonEvent('fwok');	
	setButtonEvent('fwexit');	

	$('#button-close').click(function() {
		Firewall.Cancel();
		return false;
	});			
	
	$('#button-fwaccept').click(function() {
		Firewall.Accept();
	});

	$('#button-fwcancel').click(function() {
		Firewall.Cancel();
	});
	
	$('#button-fwok').click(function() {
		Firewall.Accept();
	});	

	$('#button-fwexit').click(function() {
		Firewall.Cancel();
	});		
	

	// disable select all

	$('div, span, p, li, a, img, body').each(function() {
		$(this).attr('unselectable', 'on');
	});

	$(document).keydown(function(e) {
		if (e.ctrlKey && e.keyCode == 'A'.charCodeAt(0)) {
			if (window.getSelection) {
				window.getSelection().removeAllRanges();
			}
			else if (document.selection && document.selection.clear) {
					document.selection.clear();
			}
			return false;
		}
	});	
	
	Firewall.SetReady();
});


//--------------------------------------------------------------------------------
function MessageProc(ar) {
    var data = ar.toArray();
    var eventType = data[0];
    var eventData = data.slice(1);
    
    switch(eventType) {
        case 'AppReady': {
			Firewall.SetReady();
			var JAVA_SCRIPT_READY = 'app:666';
			window.navigate( JAVA_SCRIPT_READY );			
			break;        
        }
        
        case 'FWLocale.OnLoad': {
   			var newLocale = eventData;
   			FWLocale.OnLoad( newLocale );
			break;
        }        
    }
}