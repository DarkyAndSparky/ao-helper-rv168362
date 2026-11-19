//------------------------------- system message --------------------------------------
function showSystemMessage(text, anim) {
	if (anim) {
		$('#system-message-anim').show();
	}
	else {
		$('#system-message-anim').hide();
	}
	
	$('#system-message-text').html(text);
	$('#system-message-bg').show();

	var w = $('body').width();
	$('#system-message').show().css('left', + ((w - $('#system-message').width()) / 2) + 'px');
}

function hideSystemMessage() {
	$('#system-message').hide();
	$('#system-message-bg').hide();
}


//---------------- myMessage --------------------------------
var myMessage = {count: 0, array: []}

function myConfirm(text, yes) {
	if (isIE5) {
		if (window.confirm(text)) {
			yes();
		}
		App.exitConfirm = false;
	}
    else {
    	myMessagePush({title: '', text: text, OK: yes, Cancel: myMessageHide, status: 'question' });
   }
}

function AbortDbl(text, AbortMethod, RetryMethod, SkipMethod ) {
	if (isIE5) {
		if (window.confirm(text)) {
			RetryMethod();
		}
		App.exitConfirm = false;
	}
    else {
    	myMessagePush({title: '', text: text, Abort: AbortMethod, Retry: RetryMethod, Skip: SkipMethod, status: 'question' });
   }
}


function myMessageShow(isAuto) {
	var obj = myMessage.array[myMessage.count - 1];
	var cl = obj.status || 'warning';
	
	if (typeof isAuto != 'undefined') {
		cl = 'timing';
		$('#message-control').attr('class', 'smart');
	}
	
	$('#message-icon div').attr('class', cl);

	var msgTitle = obj.title;	
	if (!msgTitle){
		if ( typeof isAuto == 'undefined') {
			msgTitle = getText('confirmMsg');
		}
		else {
			switch( cl ){
			case 'error':
				msgTitle = getText('msgErrorState');
				break;
			case 'warning':
				msgTitle = getText('msgWarningState');
				break;
			case 'question':
				msgTitle = getText('msgQuestionState');
				break;
			}
		}
	}
	$('#message-title').html(msgTitle);
	
	obj.text = obj.text.replace(/\{1\}/gi, getText('supportURL'));
	obj.text = obj.text.replace(/\{2\}/gi, getText('repairURL'));
	obj.text = obj.text.replace(/\{3\}/gi, getText('requirementURL'));
	
	$('#message-text').html(obj.text);

	$('#message-text a[href^="http"]').click( function() {
		 openLinkAtDefaultBrowser(this.href);
		 return false;
	});

	$('#button-abort, #button-retry, #button-ok, #button-cancel, #button-shut').unbind('click');
	
	if (obj.OK) {
		$('#button-ok').click(obj.OK).click(myMessageHide);	
	}
	else {
		$('#button-ok').click(myMessageHide);
	}
	showButton('ok');
	
	if (obj.Cancel) {
		$('#button-cancel').click(obj.Cancel).click(myMessageHide);
		showButton('cancel');
		$('#button-cancel, #image-cancel').css('bottom', '0');		
		$('#button-ok, #image-ok').css('left', '');
		$('#button-shut').click(obj.Cancel).click(myMessageHide);
	}
	else {
		hideButton('cancel');			
		$('#button-cancel, #image-cancel').css('bottom', '-3000px');

		$('#button-ok, #image-ok').css('left', '321px');
		if (obj.OK)	$('#button-shut').click(obj.OK);
		else	$('#button-shut').click(myMessageHide);
	}	
	
	if (obj.Abort) {
		hideButton('ok');	
		showButton('abort');
		$('#button-abort').click(obj.Abort).click(myMessageHide);
	}
	else {
		hideButton('abort');		
	}	
	
	if (obj.Retry) {
		showButton('retry');	
		$('#button-retry').click(obj.Retry).click(myMessageHide);
	}
	else {
		hideButton('retry');		
	}
	
	if (obj.Skip) {
		showButton('skip');	
		$('#button-skip').click(obj.Skip).click(myMessageHide);
		
		$('#button-shut').click(obj.Skip).click(myMessageHide);
		
		hideButton('cancel');			
		$('#button-cancel, #image-cancel').css('bottom', '-3000px');		
	}
	else {
		hideButton('skip');		
	}		
	
	$('#message').css({top:'225px', left:'150px'}).show();
	$('#message-bg').show();
	
	if (typeof isAuto != 'undefined') {
		$('#message-timing').show();	
		if (hTimer) {
			clearTimeout(hTimer);
			hTimer = null;
		}		
		timeCounter = 0;	
		hTimer = setTimeout(timerTick, 100);	
	}
}

function myMessageHide() {
    App.exitConfirm = false;
	$('#message-control').removeAttr('class');

    if (hTimer) {
        clearTimeout(hTimer);
        hTimer = null;
    }
	
    $('#message-timing').hide();
	
	myMessage.count--;
	if ( myMessage.count > 0 ) {
	    myMessageShow();
	}
	else {
		myMessage.count = 0;
		$('#message').hide();
		$('#message-bg').hide();
	}
}

//-----------------------------------------------------------------------------
function myMessagePush(obj) {
	myMessage.array[myMessage.count++] = obj;
	myMessageShow();
}

function autoMessagePush(obj) {
	myMessage.array[myMessage.count++] = obj;
	myMessageShow(true);
}

function autoConfirm(text, yes) {
    if (isIE5) {
		if (window.confirm(text)) {
			yes();
		}
		App.exitConfirm = false;
	}
    else {
    	autoMessagePush( { title: '', text: text, OK: yes, Cancel: myMessageHide, status: 'question' } );
    }
}


//-----------------------------------------------------------------------------
var hTimer = null;
var timeCounter = 0;
var TIME_LIMITE = 100;

function timerTick() {
    timeCounter++;
    if (timeCounter > TIME_LIMITE) {
        myMessageHide();    
        $('#button-ok').click();
    }
    else {
        $('#message-timing').html(Math.ceil((TIME_LIMITE - timeCounter )/10));
        hTimer = setTimeout(timerTick, 100);
    }
}
