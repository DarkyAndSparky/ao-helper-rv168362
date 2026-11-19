App.SetPauseTrue = function(){
    window.navigate('app:1234');
}


App.SetPauseFalse = function(){
    window.navigate('app:4321');
}

Game.Run = function(){
	var LAUNCHER_RUN_COMMAND = 'app:90';
    window.navigate(LAUNCHER_RUN_COMMAND);	
}

App.SetReady = function(){
	if ( App.isReady == true ){
		Locale.Init();
		Patcher.Run();
	}
	App.isReady = true;
}

//--------------------------------------------------------------------------------
function MessageProc(ar) {
    var data = ar.toArray();
    var eventType = data[0];
    var eventData = data.slice(1);
    
	if ( Locale.TranslateMessage(eventType, eventData) ) return;
	if ( Patcher.TranslateMessage(eventType, eventData) ) return;	
	if ( Complete.TranslateMessage(eventType, eventData) ) return;	
	
    switch(eventType) {
        case 'AppReady': {
			App.SetReady();
			break;        
        }
        
        case 'OnWindowActiveStateChanged': {
			var isWindowActive = data[1];
			var isMinimazed = data[2];
			OnWindowActiveStateChanged( isWindowActive, isMinimazed );
			break;			
		}
		
		case 'SyncVersion.OnFrameLoad':{
			var name = data[1];
			SyncVersion.OnFrameLoad( name );
		}
		break;		
   
       default: {
            //alert(eventType);
		}        
	}	
}


//----------------------------------------------------------------------------------------
SyncVersion.OnFrameLoad = function(name){
	switch ( name )
	{
		case 'newsFrame': {
			$('#news').css('visibility', 'visible');
			setButtonEnabled('news');
		}
		break;
		
		case 'patchnotesFrame': {
			$('#news-ajax-indicator').hide();    
			$('#patchnotes').css('visibility', 'visible');
			setButtonEnabled('patchnotes');
			setActiveTab('patchnotes');
			$('#news')[0].src = getText('newsURL') + App.tempVersion;
			$('#license')[0].src = getText('licenseURL') + App.tempVersion;
		}
		break;
		
		case 'licenseFrame': {
			setButtonEnabled('license');
		}
		break;
	}
}
