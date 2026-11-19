Game.SetReady = function(){
	var GAME_SET_READY_COMMAND = 'app:70';
	window.navigate( GAME_SET_READY_COMMAND );	
}

Game.OnReady = function(){
    App.exitFlag = true;
    hideButton('super-cancel');
	showButton('play');
}

Game.Run = function(){
	var GAME_RUN_COMMAND = 'app:700';
	window.navigate( GAME_RUN_COMMAND );	
}

Game.OnPreRun = function(){
	showSystemMessage( getDynamicText('GameRunMsg'), true );
}

function NeedRepairByGameError( errorCode )
{
	if ( errorCode == '-3' ) return true;		
	if ( errorCode == '-4' ) return true;
	if ( errorCode == '-5' ) return true;
	if ( errorCode == '-9' ) return true;
	if ( errorCode == '-10' ) return true;
			
	return false;
}

Game.OnStartError = function ( errorCode ) {
	hideSystemMessage();
	
	var needRepairByGameError = NeedRepairByGameError( errorCode );
	if ( needRepairByGameError == false )
	{
		OnGameStartError( errorCode );	
	}
	else
	{
		var gameError = (GameStartError[currentLocale])[errorCode];
		if ( gameError )
		{
			var msg = wrapDynamicText( gameError );	
			autoConfirm( msg, FullCheck.Run );
		}	
	}
}
//--------------------------------------------------------------------------------------
Game.TranslateMessage = function ( eventType, eventData ) {
	switch(eventType) {
		case 'Game.OnReady': {
			Game.OnReady();
			return true;
		}
		
		case 'Game.OnPreRun': {
			Game.OnPreRun();
			return true;
		}
		
		case 'Game.OnStartError':{
			var errorCode = eventData;
			Game.OnStartError(errorCode);
			return true;
		}		
	}
}