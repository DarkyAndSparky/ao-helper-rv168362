App.SetReady = function(){
	if ( App.isReady == true ){
		Locale.Init();
		Prefs.Load();
	}
	App.isReady = true;
}

App.Break = function(){
	var APP_BREAK_COMMAND = 'app:0';
	window.navigate( APP_BREAK_COMMAND );
}

//--------------------------------------------------------------------------------
function MessageProc(ar) {
    var data = ar.toArray();
    var eventType = data[0];
    var eventData = data.slice(1);
    
	if ( Prefs.TranslateMessage(eventType, eventData) ) return;
	if ( Locale.TranslateMessage(eventType, eventData) ) return;
	if ( InitialCheck.TranslateMessage(eventType, eventData) ) return;
	if ( Patching.TranslateMessage(eventType, eventData) ) return;	
	if ( Repair.TranslateMessage(eventType, eventData) ) return;	
	if ( Downloader.TranslateMessage(eventType, eventData) ) return;
	if ( FastCheck.TranslateMessage(eventType, eventData) ) return;
	if ( FullCheck.TranslateMessage(eventType, eventData) ) return;
	if ( Game.TranslateMessage(eventType, eventData) ) return;
    
    
    switch(eventType) {
        case 'AppReady': {
			App.SetReady();
			var JAVA_SCRIPT_READY = 'app:666';
			window.navigate( JAVA_SCRIPT_READY );			
			break;        
        }
        
        case 'OnWindowActiveStateChanged': {
			var isWindowActive = data[1];
			var isMinimazed = data[2];
			OnWindowActiveStateChanged( isWindowActive, isMinimazed );
			break;			
		}
		
		case 'Launcher.OnFrameLoad':{
			var name = data[1];
			Launcher.OnFrameLoad( name );
			break;
		}
		
		case 'Launcher.OnDiskSpaceError': {
			Launcher.OnDiskSpaceError();
			break;
		}
   
       default: {
            //alert(eventType);
		}        
	}
}

//----------------------------------------------------------------------------------------
Launcher.OnFrameLoad = function( name ){
	switch ( name )
	{
		case 'newsFrame': {
			$('#news-ajax-indicator').hide();    
			$('#news').css('visibility', 'visible');
			
			setButtonEnabled('news');
			if (!$('#toolbar div div.active').not('#toolbar div#news div.active').length) {
				setActiveTab('news');
			}
			
			var patchUrl = getText('patchnotesURL') + App.tempVersion + '&rnd=' + Math.floor(Math.random() * 10000) + '#ver' + App.currentVersion;
			$('#patchnotes')[0].src = patchUrl;
			$('#license')[0].src = getText('licenseURL') + App.tempVersion;
			$('#serverstatus')[0].src = getText('serverstatusURL') + App.tempVersion;
		}
		break;
		
		case 'patchnotesFrame': {
			setButtonEnabled('patchnotes');		
		}
		break;
		
		case 'licenseFrame': {
			setButtonEnabled('license');		
		}
		break;
		
		case 'serverstatusFrame': {
			setButtonEnabled('serverstatus');
		}
		break;
	}
}


//----------------------------------------------------------------------------------------
function OnFullCheckBtn() {
	FullCheck.OnFullCheckBtn();
}

Launcher.OnDiskSpaceError = function(){
    App.exitFlag = true;
	hideButton('peersinfo');
	$('#progressbar').hide();
	$('#status-size').html('');    
    
    hideButton('super-cancel');
    hideButton('update');
    showButton('exit');
	$('#status-file').html( getDynamicText('NoDiskSpaceMsg') );
	myMessagePush({ title: getText('DownloadErrorTitle'), text: getText('DiskSpaceError'), status: 'error' });
	App.Break();
}

