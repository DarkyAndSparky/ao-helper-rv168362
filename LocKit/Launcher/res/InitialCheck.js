InitialCheck.Run = function() {
	var INITINAL_CHECK_COMMAND = 'app:80';
	window.navigate( INITINAL_CHECK_COMMAND );
}

InitialCheck.OnNeedRepair = function(){
	hideSystemMessage();
	FullCheck.Run();
}

InitialCheck.OnReadyToUpdate = function(){
	hideSystemMessage();
	Patching.Run();
}

InitialCheck.OnCheckRequest = function(){
	showSystemMessage( getDynamicText('CheckRequest'), true );
}

//--------------------------------------------------------------------------------------
InitialCheck.TranslateMessage = function ( eventType, eventData ) {
	switch(eventType) {
		case 'InitialCheck.OnNeedRepair':{
			InitialCheck.OnNeedRepair();
			return true;
		}

		case 'InitialCheck.OnReadyToUpdate':{
			InitialCheck.OnReadyToUpdate();
			return true;
		}

		case 'InitialCheck.OnCheckRequest':{
			InitialCheck.OnCheckRequest();
			return true;
		}
	}
}