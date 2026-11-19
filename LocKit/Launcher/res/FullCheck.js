//---------------------------- Полная проверка версии --------------------------------------
FullCheck.Run = function() {
	var FULL_CHECK_RUN_COMMAND = 'app:50';
	window.navigate( FULL_CHECK_RUN_COMMAND );	
}

//------------------------------------------------------------------------------------------
FullCheck.OnFullCheckBtn = function() {
	if ( App.isFullCheckerRun == false ) {
		var msg = getText('startCheckQuestion');
		myConfirm( msg, function() {
			App.isFullCheckerRun = true;
			App.exitFlag = false;
			setActiveTab('ripfiles');
			hideButton('play');
			showButton('super-cancel');
			FullCheck.Run();
		});
	}
	else
		setActiveTab('ripfiles');    		
}

//------------------------------------------------------------------------------------------
FullCheck.OnStart = function () {
    hideSystemMessage();    
    $('#progressbar').show();
    if ( App.isFullCheckerRun == false ) {
    	App.isFullCheckerRun = true;
		setButtonEnabled('ripfiles');    	
   	}
    $('#status-file').html( getDynamicText('consistencyCheckMsg') );
    $('#ripfiles-num-files').html('');
    $('#ripfiles-common-size').html('');
    $('#ripfiles-body').html('<table cellpadding="0" cellspacing="0"></table>');	
}

FullCheck.OnProgress = function(progress) {
	changeProcents(progress);
}

FullCheck.OnSuccess = function () {
    App.exitFlag = true;
    $('#progressbar').hide();
    hideButton('super-cancel');
    showButton('play');
    $('#status-file').html( getDynamicText('consistensyOkMsg') );

	App.isFullCheckerRun = false;    
	setButtonNormal('ripfiles');	
	Game.SetReady();	
}

FullCheck.OnComplete = function (ripFiles) {
	setActiveTab('ripfiles');
	Repair.ShowRipFiles(ripFiles);	
	Repair.Run();
}

FullCheck.OnSystemCrash = function (ripFiles) {
    App.exitFlag = true;
    $('#progressbar').hide();
    hideButton('super-cancel');
    setActiveTab('ripfiles');
    showButton('exit');
    Repair.ShowRipFiles(ripFiles);   
    myMessagePush({ title: getText('SystemErrorTitle'), text: getText('SystemError'), status: 'error' });
}

FullCheck.OnFailGameVersion = function () {
	App.exitFlag = true;
    hideSystemMessage();
	var msg = getDynamicText('FastCheckFailMsg');	
	autoConfirm( msg, Repair.RepairGameVersion );		
}



//--------------------------------------------------------------------------------------
FullCheck.TranslateMessage = function ( eventType, eventData ) {
	switch(eventType) {
		case 'FullCheck.OnStart': {
			FullCheck.OnStart();
			return true;
		}
		
		case 'FullCheck.OnProgress': {
			var progress = eventData;
			FullCheck.OnProgress(progress);
			return true;
		}
		
		case 'FullCheck.OnSuccess': {
			FullCheck.OnSuccess();
			return true;
		}	
		
		case 'FullCheck.OnComplete': {
			FullCheck.OnComplete( eventData );
			return true;
		}	
		
		case 'FullCheck.OnSystemCrash': {
			FullCheck.OnSystemCrash( eventData );
			return true;
		}		
		
		case 'FullCheck.OnFailGameVersion': {
			FullCheck.OnFailGameVersion();
			return true;
		}	
	}
}

