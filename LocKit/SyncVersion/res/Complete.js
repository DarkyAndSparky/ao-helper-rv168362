//--------------------------------------------------------------------------------------
Complete.SetState = function(){
	var SET_COMPLETE_STATE = 'app:9';
	window.navigate( SET_COMPLETE_STATE );
}

//--------------------------------------------------------------------------------------
Complete.RunLauncher = function(){
	var msg = getText('syncCompeteMsg');
	autoConfirm( msg, Game.Run );
}

//--------------------------------------------------------------------------------------
Complete.RequestDropInstalledPatches = function( patches ){
	var msg = getText('DropInstalledPatches');
	msg += "<br />";
	for( var index = 0; index < patches.length; ++index ){
	    var patchDir = patches[index];
	    msg += "<br />" + patchDir;
	}
	msg += "<br />";
	var dlgTitle = getText('windowTitle');	
	autoMessagePush( { title: dlgTitle, text: msg, OK: Complete.DropInstalledPaches, Cancel: Complete.SkipDrop, status: 'question' } );
}

//--------------------------------------------------------------------------------------
Complete.DropInstalledPaches = function(){
    myMessageHide();
	var DROP_INSTALLED_PATCHES_COMMAND = 'app:900';	
	window.navigate( DROP_INSTALLED_PATCHES_COMMAND );		
}

//--------------------------------------------------------------------------------------
Complete.SkipDrop = function(){
    myMessageHide();
    Complete.RunLauncher();
}


//--------------------------------------------------------------------------------------
Complete.TranslateMessage = function ( eventType, eventData ) {
	switch(eventType) {
		case 'Complete.RequestDropInstalledPatches': {
		    var patches = eventData;
            Complete.RequestDropInstalledPatches( patches );
			return true;
		}
		
		case 'Complete.OnInstalledPatchesDropped': {
		    Complete.RunLauncher();
		    return true;
		}
    }
}


