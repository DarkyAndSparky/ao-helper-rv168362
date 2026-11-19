//--------------------------------------------------------------------------------------
Patcher.Run = function(){
	var PATCHER_RUN_COMMAND = 'app:80';
	window.navigate( PATCHER_RUN_COMMAND );
}

Patcher.OnCommandFileError = function(){
    App.exitFlag = true;
	var errMsg = getText('SyncVersionCmdError');
	myMessagePush({ title: getText('syncErrorCaption'), text: errMsg, status: 'error' });	
}

Patcher.OnRun = function(patchCount){
    $('#progressbar').show();
    showButton('super-cancel');
}

var currentpatchname = "";

Patcher.OnPatchBegin = function(patchIndex, patchName){
	currentpatchname = patchName;
    $('#progressbar').show();
	var msg = getText('applyPatchMsg') + patchName;
	$('#status-file').text( msg );
    showButton('super-cancel');
}

Patcher.OnProgress = function(progress, progressTotal){
	changeProcents2( progress, progressTotal );
}

Patcher.OnPatchEnd = function(patchIndex){
}

Patcher.OnSuccess = function() {
	App.exitFlag = true;
	$('#progressbar').hide();
	hideButton('super-cancel');
	showButton('super-ok');
	
	App.currentVersion = currentpatchname;
	
    $('#status-file').text( getText('patchInstaledMsg') + App.currentVersion );	

	Complete.SetState();
}

Patcher.OnFail = function(errorCode) {
    App.exitFlag = true;
    $('#progressbar').hide();
	hideButton('super-cancel');
	showButton('exit');
	var errMsg = (PatchErrorMsg[currentLocale])[errorCode];
	myMessagePush({ title: getText('syncErrorCaption'), text: errMsg, status: 'error' });	
}

Patcher.AbortFile = function(){
	var PATCHER_ELOCK_ABORT_COMMAND = 'app:666';
	window.navigate( PATCHER_ELOCK_ABORT_COMMAND );
}

Patcher.RetryFile = function(){
	var PATCHER_ELOCK_RETRY_COMMAND = 'app:800';	
	window.navigate( PATCHER_ELOCK_RETRY_COMMAND );		
}

Patcher.SkipFile = function(){
	var PATCHER_ELOCK_SKIP_COMMAND = 'app:8';	
	window.navigate( PATCHER_ELOCK_SKIP_COMMAND );		
}

Patcher.OnLockedFile = function( fromFile, toFile ){
	var errMsg = getText('lockedFileMsg') + "<br />" + fromFile + "<br />" + toFile + "<br />";
	AbortDbl( errMsg, Patcher.AbortFile, Patcher.RetryFile, Patcher.SkipFile );
}

//--------------------------------------------------------------------------------------
Patcher.TranslateMessage = function ( eventType, eventData ) {
	switch(eventType) {
		case 'Patcher.OnCommandFileError': {
			Patcher.OnCommandFileError();
			return true;
		}
		
		case 'Patcher.OnRun': {
			var patchCount = eventData;
			Patcher.OnRun(patchCount);
			return true;
		}		
		
		case 'Patcher.OnPatchBegin': {
			var patchIndex = eventData[0];
			var patchName = eventData[1];
			Patcher.OnPatchBegin(patchIndex, patchName);
			return true;
		}
		
        case 'Patcher.OnProgress': {
            var progress = eventData[0];
            var progressTotal = eventData[1];
            Patcher.OnProgress( progress, progressTotal );
            return true;
        }
        
		case 'Patcher.OnPatchEnd': {
			var patchIndex = eventData[0];
			Patcher.OnPatchEnd(patchIndex);
			return true;
		}        
        
        case 'Patcher.OnSuccess': {
            Patcher.OnSuccess();
            return true;
        }
        
        case 'Patcher.OnFail': {
			var errorCode = eventData;
            Patcher.OnFail(errorCode);
            return true;
        }        
        
        case 'Patcher.OnLockedFile': {
			var fromFile = eventData[0];
			var toFile = eventData[1];
            Patcher.OnLockedFile( fromFile, toFile );
            return true;
        }                
	}
}
