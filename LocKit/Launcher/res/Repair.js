
Repair.Run = function(){
	var RIP_REQUEST_COMMAND = 'app:60';
	window.navigate( RIP_REQUEST_COMMAND );	
}

Repair.RepairGameVersion = function(){
	var REPAIR_GAME_VERSION_COMMAND = 'app:6';
	window.navigate( REPAIR_GAME_VERSION_COMMAND );	
}

Repair.ShowRipFiles = function(files) {
    var fileStates = [];
    fileStates[0] = getDynamicText('ripErrorOK');
    fileStates[3] = getDynamicText('ripErrorNotFound');
    fileStates[4] = getDynamicText('ripErrorBroken');
    fileStates[5] = getDynamicText('ripErrorBroken');    
    var totalSize = 0;        
    var delim = 4;
    var classState = '';
    var text = '<table cellspacing="0" cellpadding="0">';
    var inter = '';
    for (var i = 0; i < files.length; i += delim) {
        var file = files[i].replace(/\/|\\/g, '/&shy;');
        var stateID = files[i + 2];
        
        if (stateID == 3) {
			classState = 'not-found-error';
		}
		else {
			classState = 'crc-error';
		}
		
        text += '<tr' + inter + '><td class="col1"><div>' + file + '</div></td><td class="col2"><div>' + formatBytes(files[i + 1]) +  '</div></td><td class="col3"><div class="' + classState + '">' + fileStates[stateID] + '</div></td></tr>';
        totalSize += parseInt(files[i + 1]);
        
        if (inter) {
			inter = '';
        }
        else {
			inter = ' class="inter"';
        
        }
    }
    text += '</table>';
    
    $('#ripfiles-num-files').html(Math.floor(files.length / delim));
    $('#ripfiles-common-size').html(fineSize(totalSize, 1));
    $('#ripfiles-body').html(text).show();
}


Repair.OnRequest = function() {
}

Repair.OnAnswer = function() {
	Repair.DownloadPip();
}

Repair.OnServerError = function(errorCode) {
	//alert('Repair.OnServerError');
    Patching.OnError();
    ShowNetErrorMessage(errorCode);
}

Repair.OnLogicError = function(errorCode) {
	//alert('Repair.OnLogicError');
    Patching.OnError();
    ShowServerErrorMessage(errorCode);
}

Repair.OnError = function (){
	//alert('Repair.OnError');
    App.exitFlag = true;
    hideSystemMessage();    
	App.isFullCheckerRun = false;
	myMessagePush({title: getText('updateMsgCaption'), text: getText('DownloadError'), status: 'error' });    
}

Repair.DownloadPip = function() {
	var RIP_DOWNLOAD_COMMAND = 'app:600';
	window.navigate( RIP_DOWNLOAD_COMMAND );
}

Repair.OnDownloadStart = function(){
	App.patchVersion = "";
	$('#peers-title').html( getDynamicText('ripDataLoadingMsg') );	
	Downloader.OnStart()
}

Repair.OnDownloadComplete = function(){
	Downloader.OnComplete();
	Repair.ApplyRip();
}

Repair.ApplyRip = function(){
	var RIP_APPLY_COMMAND = 'app:6000';
	window.navigate( RIP_APPLY_COMMAND );
}

Repair.OnApply = function(){
	$('#progressbar').hide();
	$('#status-file').html(getDynamicText('DownloadComplete') + App.patchVersion );    		
}

Repair.OnRepairProgress = function(progress){
}

Repair.OnSuccess = function(files) {
	Repair.OnFinished(files);
	$('#status-file').html( getDynamicText('updateCompleteSuccessMsg') );
	myMessagePush({title: getText('updateMsgCaption'), text: getText('updateCompleteSuccessMsg'), status: 'warning' });
	Game.SetReady();	
}

Repair.OnFail = function( files, errorCode ) {
	Repair.OnFinished(files);
	showButton('exit');
	$('#status-file').html( getDynamicText('updateCompleteMsg') );
	var msg;
	if ( errorCode == 1 )
	    msg = getText('DiskSpaceError');
    else
    if ( errorCode == 2 )
	    msg = getText('errorRepairLocked');
	else
        msg = getText('errorInUpdateMsg'); 	    
        
	myMessagePush({title: getText('updateMsgCaption'), text: msg, status: 'error'});        
}

Repair.OnFinished = function(files) {
	Repair.ShowRipFiles(files);
    setActiveTab('ripfiles');
    App.exitFlag = true;
	App.isFullCheckerRun = false;    
    $('#progressbar').hide();
	hideButton('super-cancel');
}

Repair.AbortFile = function(){
	var REPAIR_ELOCK_ABORT_COMMAND = 'app:8000';
	window.navigate( REPAIR_ELOCK_ABORT_COMMAND );
}

Repair.RetryFile = function(){
	var REPAIR_ELOCK_RETRY_COMMAND = 'app:800';	
	window.navigate( REPAIR_ELOCK_RETRY_COMMAND );		
}

Repair.SkipFile = function(){
    Repair.AbortFile();
}

Repair.OnLockedFile = function( fromFile, toFile ){
	var errMsg = getText('lockedFileMsg') + "<br />" + fromFile + "<br />" + toFile + "<br />";
	AbortDbl( errMsg, Repair.AbortFile, Repair.RetryFile, Repair.SkipFile );
}

//--------------------------------------------------------------------------------------
Repair.TranslateMessage = function ( eventType, eventData ) {
	switch(eventType) {
		case 'Repair.OnRequest': {
			Repair.OnRequest();
			return true;
		}
		
		case 'Repair.OnGameVersionRepaired':{
			FullCheck.Run();
			return true;
		}

		case 'Repair.OnSaveError':{
			//alert("Repair.OnSaveError");
			return true;
		}		
		
		case 'Repair.OnAnswer': {
			Repair.OnAnswer();
			return true;
		}
		
		case 'Repair.OnServerError': {
			var errorCode = eventData;
			Repair.OnServerError( errorCode );
			return true;
		}
		
		case 'Repair.OnLogicError': {
			var errorCode = eventData;
			Repair.OnLogicError( errorCode );
			return true;
		}
		
		case 'Repair.OnDownloadStart': {
			Repair.OnDownloadStart();
			return true;
		}
		
		case 'Repair.OnDownloadComplete': {
			Repair.OnDownloadComplete();
			return true;
		}
		
        case 'Repair.OnApply': {
			Repair.OnApply();
			return true;
		}

        case 'Repair.OnProgress': {
            var progress = eventData;
            Repair.OnRepairProgress(progress);
            return true;
		}

        case 'Repair.OnSuccess': {
            var files = eventData;
            Repair.OnSuccess(files);
            return true;
		}

        case 'Repair.OnFail': {
			var errorCode = eventData[0];
            var files = eventData.slice(1);
            Repair.OnFail(files, errorCode );
            return true;            
		}
		
		case 'Repair.OnError':{
			Repair.OnError();
			return true;
		}
		
        case 'Repair.OnLockedFile': {
			var fromFile = eventData[0];
			var toFile = eventData[1];
            Repair.OnLockedFile( fromFile, toFile );
            return true;            
		}		
	}
}
