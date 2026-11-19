var isIE5 = (navigator.userAgent.indexOf ("MSIE 5") != -1) ? true : false;
var isIE6 = (navigator.userAgent.indexOf ("MSIE 6") != -1) ? true : false;

function openLinkAtDefaultBrowser(href) {
	 window.navigate('OPEN_HREF:' + href);
}

//--------------------------------------------------------------------------

var App = {};

App.exitFlag = false;
App.exitConfirm = false;
App.isFullCheckerRun = false;
App.lastActiveButton = null;
App.currentVersion = '';
App.tempVersion = '?jsv=2';
App.isReady = false;

//-------------------------------------------------------------------------------------
App.OnCancel = function () {
    if (App.exitFlag) {
        App.Exit();
    }
    else if (!App.exitConfirm) {
        App.exitConfirm = true;
        myConfirm( getText('exitConfirmMsg'), App.Exit );
    }
}

App.Exit = function() {
    window.navigate('app:1002');
}

App.Minimize = function() {
    window.navigate('app:2001');
}

//---- OnWindowActiveStateChanged ----------------------------------------------
function OnWindowActiveStateChanged( isWindowActive, isMinimazed ){
	if (isWindowActive == '1')	{
		$('body, #container').removeClass('noactive');
	}
	else	{
		$('body, #container').addClass('noactive');
	}
}

//-------------- System message-------------------------------
function OnGameStartError(errorCode) {
	var errMsg = (GameStartError[currentLocale])[errorCode];
	myMessagePush({title: '', text: errMsg, status: 'error'});		
}

function ShowNetErrorMessage(errorCode) {
	var errMsg = (NetError[currentLocale])[errorCode];
	myMessagePush({title: getText('NetErrorMessage'), text: errMsg, status: 'error'});		
}

function ShowServerErrorMessage(errorCode) {
	var errMsg = (ServerErrorMsg[currentLocale])[errorCode];    
	myMessagePush({title: getText('ServerErrorMessage'), text: errMsg, status: 'error' });
}

//-------------------------------------------------------------------------------------
function changeProcents(progress) {
	var el = $('#progressbar-big-line div.line');
	if (progress < 100) {
		el.removeClass('stop');	
	}
	else {
		el.addClass('stop');
		$('#progressbar-big-line div.light').hide();
	}
	$('#progressbar-big-line div.light').css('left', progress + '%');
	el.css('width', progress + '%');
}

//-------------------------------------------------------------------------------------
function changeProcents2(currentProgress, totalProgress) {
	var el = $('#progressbar-big-line div.line');
	var elSmall = $('#progressbar-small-line div.line');
	
	if (currentProgress < 100) {
		el.removeClass('stop');	
	}
	else {
		el.addClass('stop');
		$('#progressbar-big-line div.light').hide();
	}
	$('#progressbar-big-line div.light').css('left', currentProgress + '%');
	el.css('width', currentProgress + '%');

	if (totalProgress < 100) {
		elSmall.removeClass('stop');	
	}
	else {
		elSmall.addClass('stop');
		$('#progressbar-small-line div.light').hide();
	}
	$('#progressbar-small-line div.light').css('left', totalProgress + '%');
	elSmall.css('width', totalProgress + '%');
	
}

//--------------------------------------------------------------------------
$(document).keyup( function(e) {
	if (e.keyCode == 27 || e.keyCode == 115 ) { // VK_ESC || Alt+F4
		if ($('#message:visible').length) {
			$('#button-cancel').click();
		}
		else {			
			App.OnCancel();
		}
	}
	
	if (e.keyCode == 13) { // VK_ENTER
		if ($('#message:visible').length) {
			$('#button-ok').click();
		}
	}
});

//--------------------------------------------------------------------------
$(document).ready(function() {
	backgroundImageCache();
    disableContextMenu();
	
	$('a[href^="http"]').click( function() {
		 openLinkAtDefaultBrowser(this.href);
		 return false;
	});
	

	if ( !isIE5 ){
		$('#message').draggable({containment:[-390, -10, 730, 575], handle: '#message-title', cursor: 'move'});	
	}

	$('#set-focus').focus();

	setButtonEvent('close');
	setButtonEvent('down');
	setButtonEvent('registration');
	setButtonEvent('forum');
	setButtonEvent('account');

	setButtonEvent('abort');
	setButtonEvent('retry');		
	setButtonEvent('skip');	

	setButtonEvent('ok');
	setButtonEvent('cancel');
	setButtonEvent('lang');
	
	setButtonEvent('peersinfo');

	// toolbar buttons	
	setButtonEvent('news');
	setButtonEvent('patchnotes');
	setButtonEvent('prefs');
	setButtonEvent('ripfiles');		
	setButtonEvent('license');
	setButtonEvent('server');
	setButtonDisabled('server');
	setButtonDisabled('ripfiles');
	setButtonDisabled('license');
	setButtonDisabled('news');	

	// big buttons	
	setButtonEvent('play');
	setButtonEvent('super-ok');
	setButtonEvent('super-cancel');
	setButtonEvent('exit');
	setButtonEvent('update');
	
	setButtonEnabled('super-cancel');
	
	if ( $('#prefs').length && !isIE5 ) {
		setButtonEvent('prefs-cancel');	
		setButtonEvent('prefs-apply');	
		setButtonEvent('prefs-reset');		
	}
	else {
		setButtonDisabled('prefs');	
	}
	
	$('#logo-link').click(function() {
		openLinkAtDefaultBrowser( getText('logoURL') );
	});	
	
	$('#button-account').click(function() {
		openLinkAtDefaultBrowser( getText('accountURL') );
	});

	$('#button-registration').click(function() {
		openLinkAtDefaultBrowser( getText('registrationURL') );
	});

	$('#button-forum').click(function() {
		openLinkAtDefaultBrowser( getText('forumURL') );
	});
	
	$('#button-news').click(function() {
		if (isButtonDisabled(this))	return false;
		setActiveTab('news');
	});
	
	$('#button-patchnotes').click(function() {
		if (isButtonDisabled(this))	return false;
		setActiveTab('patchnotes');
	});
	
	$('#button-prefs').click(function() {
		if (isButtonDisabled(this))	return false;
		setActiveTab('prefs');
	});			
	
	$('#button-license').click(function() {
		if (isButtonDisabled(this))	return false;
		setActiveTab('license');
	});

	$('#button-ripfiles').click(function() {
		if (isButtonDisabled(this))	return false;
		OnFullCheckBtn();
		return false;
	});
	
	$('#button-play').click(function() {
		Game.Run();
		return false;
	});
	
	$('#button-super-ok').click(function() {
		Game.Run();
		return false;
	});		
	
	$('#button-super-cancel').click(function() {
		App.OnCancel();
		return false;
	});	
	
	$('#button-exit').click(function() {
		App.OnCancel();
		return false;
	});
	
	$('#button-update').click(function() {
		Patching.OnUpdateBtnClick();
		return false;
	});	
	
	$('#button-serverstatus').click(function() {
		if (isButtonDisabled(this))	return false;
		setActiveTab('serverstatus');	
		return false;
	});	
	
	$('#button-peersinfo').click(function() {
		setButtonActive('peersinfo');		
		$('#update-ie5').hide();
	});	
	
	$('#button-down').click(function() {
		App.Minimize();
		return false;
	});	
	
	$('#button-close').click(function() {
		App.OnCancel();
		return false;
	});	
	
	$('#button-lang').click(function() {
		if ($('#selector-lang:visible').length) {
			return true;
		}
		else {
			SelectorLang.show();
			return false;
		}
	});		
		
	var d = new Date();
	var year = parseInt($('#window-year').text());
	var yearReal = d.getFullYear();
	if (yearReal > 2009) {
		$('#window-year').text(yearReal);
	}
	
	
	// disable select all

	$('div, span, li, a, img, body').each(function() {
		$(this).attr('unselectable', 'on');
	});

	$(document).keydown(function(e) {
		if (e.ctrlKey && e.keyCode == 'A'.charCodeAt(0)) {
			if (window.getSelection) {
				window.getSelection().removeAllRanges();
			}
			else if (document.selection && document.selection.clear) {
					document.selection.clear();
			}
			return false;
		}
	});	
	
	App.SetReady();
});
