//---------------------------- Проверка наличия обновления ---------------------------------
var updateBtnState = 0;

Patching.Run = function() {
	var PATCHES_REQUEST_COMMAND = 'app:30';
	window.navigate( PATCHES_REQUEST_COMMAND );
}

Patching.OnRequest = function(currentVersion) {
	App.currentVersion = currentVersion;
	$('#launcher #window-title').html( getText('windowTitle') + ' ' + App.currentVersion );
	showSystemMessage( getDynamicText('RequestVersionUpdate'), true );
}

Patching.OnAnswer = function( patches ) {
	var n = patches.length-1;
	var patchName = patches[n];
	updateBtnState = 0;
    hideSystemMessage();
    hideButton('super-cancel');
    showButton('update');
   	App.patchVersion = patchName;
	$('#status-file').html( getDynamicText('patchAvailableMsg') + App.patchVersion );   	
	var msg = getDynamicText('NewVersionAvailable') + patchName;	
	autoConfirm( msg, Patching.DownloadPatch );
}

Patching.OnResponce = function() {
	FastCheck.Run();
}

Patching.OnServerError = function(errorCode) {
    Patching.OnError();
    ShowNetErrorMessage(errorCode);
}

Patching.OnLogicError = function(errorCode) {
    Patching.OnError();
    ShowServerErrorMessage(errorCode);
}

Patching.OnTorrentError = function() {
    Patching.OnError();
    hideButton('update');
    showButton('exit');    
    myMessagePush({title: getText('updateMsgCaption'), text: getText('DownloadError'), status: 'error' });    
}

Patching.OnError = function (){
    App.exitFlag = true;
    hideSystemMessage();    
    hideButton('super-cancel');
    showButton('play');
	App.isFullCheckerRun = false;
	setButtonNormal('ripfiles');
}

Patching.DownloadPatch = function() {
    myMessageHide();    
    
	var PATCHES_DOWNLOAD_COMMAND = 'app:300';
	window.navigate( PATCHES_DOWNLOAD_COMMAND );
}

Patching.OnDownloadStart = function(){
	updateBtnState = 1;
    showButton('super-cancel');
    hideButton('update');
	$('#peers-title').html( getDynamicText('patchLoadingMsg') + App.patchVersion );	
	Downloader.OnStart()
}

Patching.OnDownloadComplete = function(){
	Downloader.OnComplete();
	$('#status-file').html(getDynamicText('DownloadComplete') + App.patchVersion );    	
    hideButton('super-cancel');
    showButton('update');
    autoConfirm( getText('updateReadyMsg'), Patching.ApplyPatches );
}

Patching.ApplyPatches = function(){
	var PATCHES_APPLY_COMMAND = 'app:3000';
	window.navigate( PATCHES_APPLY_COMMAND );
}


Patching.OnUpdateBtnClick = function(){
	if ( updateBtnState == 0 )
		Patching.DownloadPatch();
	else
		Patching.ApplyPatches();
}

//--------------------------------------------------------------------------------------
Patching.TranslateMessage = function ( eventType, eventData ) {
	switch(eventType) {
		case 'Patching.OnRequest': {
			var currentVersion = eventData;
			Patching.OnRequest(currentVersion);
			return true;
		}
		
		case 'Patching.OnAnswer': {
			var patches = eventData;
			Patching.OnAnswer( patches );
			return true;
		}
		
		case 'Patching.OnResponce': {
			Patching.OnResponce();
			return true;
		}	
		
		case 'Patching.OnServerError': {
			var errorCode = eventData;
			Patching.OnServerError( errorCode );
			return true;
		}
		
		case 'Patching.OnLogicError': {
			var errorCode = eventData;
			Patching.OnLogicError( errorCode );
			return true;
		}
		
		case 'Patching.OnTorrentError': {
			Patching.OnTorrentError();
			return true;		        
		}
		
		case 'Patching.OnDownloadStart': {
			Patching.OnDownloadStart();
			return true;
		}
		
		case 'Patching.OnDownloadComplete': {
			Patching.OnDownloadComplete();
			return true;
		}
	}
}

