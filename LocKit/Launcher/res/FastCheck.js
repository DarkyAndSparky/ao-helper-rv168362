
FastCheck.Run = function(){
	showSystemMessage( getDynamicText('FastChekRun'), true );
	var FAST_CHECK_RUN_COMMAND = 'app:40';
	window.navigate( FAST_CHECK_RUN_COMMAND );
}

FastCheck.OnSuccess = function(){
    hideSystemMessage();    
	App.isFullCheckerRun = false;
	$('#status-file').html( getDynamicText('ReadyToPlay') );
	setButtonNormal('ripfiles');
	Game.SetReady();	
}

FastCheck.OnFail = function(){
	App.exitFlag = true;
    hideSystemMessage();
	var msg = getDynamicText('FastCheckFailMsg');	
	autoConfirm( msg, FullCheck.Run );		
}

//--------------------------------------------------------------------------------------
FastCheck.TranslateMessage = function ( eventType, eventData ) {
	switch(eventType) {
		case 'FastCheck.OnSuccess': {
			FastCheck.OnSuccess();
			return true;
		}
		
		case 'FastCheck.OnFail': {
			FastCheck.OnFail();
			return true;
		}		
	}
}
