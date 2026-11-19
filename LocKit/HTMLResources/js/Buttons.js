//------------------------------------------------------------------------------
function setButtonEvent(id) {
	$('#button-' + id).mouseover(function() {
	    var id = '#image-' + this.id.replace(/button\-/, '') + ' div'; 
	    if (!$(id).hasClass('disabled') && !$(id).hasClass('active')) {
		    $(id).attr('class', 'hover');
		}
		return false;
	}).mouseout(function() {
	    var id = '#image-' + this.id.replace(/button\-/, '') + ' div';
	    if (!$(id).hasClass('disabled') && !$(id).hasClass('active')) {
			$(id).attr('class', '');
		}
		return false;
	}).mousedown(function() {
	    var id = '#image-' + this.id.replace(/button\-/, '') + ' div'; 
	    if (!$(id).hasClass('disabled') && !$(id).hasClass('active')) {
		    $(id).attr('class', 'down');
		}
		return false;
	}).mouseup(function() {
        var id = '#image-' + this.id.replace(/button\-/, '') + ' div'; 
	    if (!$(id).hasClass('disabled') && !$(id).hasClass('active')) {
		    $(id).attr('class', '');
		}
		return false;		
	});
}

//------------------------------------------------------------------------------
function isButtonDisabled(el) {
	var query = '#image-' + el.id.replace(/button\-/, '') + ' div.disabled';
	if ($(query).length)	return true;
	return false;
}

//--------------------------------------------------------------------------------
function setPointer(query) {
	if (isIE5) {
		$(query).css('cursor', 'hand');
	}
	else {
		$(query).css('cursor', 'pointer');
	}
}

function unsetPointer(query) {
	$(query).css('cursor', 'default');
}

//------------------------------------------------------------------------------
function showButton(button) {
	$('#image-' + button + ', #button-' + button).show();
}

function hideButton(button) {
	$('#image-' + button + ', #button-' + button).hide();
}

//------------------------------------------------------------------------------
function setButtonEnabled(button) {
    $('#image-' + button + ' div').attr('class', '');
    setPointer('#button-' + button);
}

function setButtonDisabled(button) {
    $('#image-' + button + ' div').attr('class', 'disabled');
    unsetPointer('#button-' + button);
}

function setButtonNormal(button) {
    $('#image-' + button + ' div').attr('class', '');
    setPointer('#button-' + button);
}

function setActiveTab(tab){
	setButtonActive(tab);
	showTab(tab);
}

function setButtonActive(button) {
	if (button == 'lang') return false;
	if (isIE5 && ( button == 'news' || button == 'license' || button == 'patchnotes' || button == 'serverstatus' ) )
		return;
	
	var el = $('div[id^=image] div.active').not('#image-peersinfo div').attr('class', '');
    
    if (!isIE5 && el.length) {
		setPointer('#button-' + el.parent().get(0).id.replace(/image\-/, ''));
	}

	var btn = $('#image-' + button + ' div');
    if ( button != 'peersinfo') {
		App.lastActiveButton = button;    
		btn.attr('class', 'active');
	    unsetPointer('#button-' + button);
	    $('#image-peersinfo div').attr('class', '');
	}
	else 
	{
		if ( btn.hasClass('active')) {
			showTab(App.lastActiveButton);
			$('#image-' + App.lastActiveButton + ' div').attr('class', 'active');			
			btn.attr('class', '');
		}
		else {
			showTab('peers');			
			btn.attr('class', 'active');
		}
	}
}

function showTab(tab) {
	if (isIE5)	{
		$('#peers, #ripfiles, #prefs').not('#' + tab).hide();
		if (tab != 'news' && tab != 'license' && tab != 'patchnotes' && tab != 'serverstatus') $('#' + tab).show();
	}
	else {
		$('#license, #peers, #ripfiles, #news, #patchnotes, #prefs, #serverstatus').not('#' + tab).hide();
		$('#' + tab).show();
	}
}