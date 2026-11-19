var prefsGfxScreen; // select
var prefsGfxQuality; // select
var prefsSoundUnmute; // checkbox
var prefsGfxFullscreen; // checkbox
var prefsGameMovementMouse; // checkbox

Prefs.Current = {};
Prefs.Default = {};
Prefs.LoadError = false;

Prefs.Init = function () {
	prefsGfxFullscreen = new Checkbox('#prefs-gfx-fullscreen');
	prefsGfxFullscreen.checked(Prefs.Current.isGfxFullscreen);
	prefsGfxFullscreen.onchange = function() {
		refreshPrefsButtons();
		if (this.checked()) {
			prefsGfxScreen.disabled(false);		
		}
		else {
			prefsGfxScreen.disabled(true);		
		}
	}

	prefsSoundUnmute = new Checkbox('#prefs-sound-unmute');
	prefsSoundUnmute.checked(Prefs.Current.isSoundUnmute);
	prefsSoundUnmute.onchange = refreshPrefsButtons;

	prefsGameMovementMouse = new Checkbox('#prefs-game-movement-mouse');
	prefsGameMovementMouse.checked(Prefs.Current.isGameMovementMouse);
	prefsGameMovementMouse.onchange = refreshPrefsButtons;
		
	prefsGfxQuality = new Select('#prefs-gfx-quality',
		 [{value: '0', title: getDynamicText('gfxQualityLow'), hint: getText('prefsHint0') },
		 {value: '1', title: getDynamicText('gfxQualityMiddle'), hint: getText('prefsHint1') },
		 {value: '2', title: getDynamicText('gfxQualityNormal'), hint: getText('prefsHint2') },
		 {value: '3', title: getDynamicText('gfxQualityHi'), hint: getText('prefsHint3') },
		 {value: '4', title: getDynamicText('gfxQualityMax'), hint: getText('prefsHint4') },
		 {value: '5', title: getDynamicText('gfxQualityUltra'), hint: getText('prefsHint5') },
		 {value: '6', title: getDynamicText('gfxQualityAuto'), hint: getText('prefsHint6') } ]);
		 

		 
	prefsGfxQuality.selectedIndex(Prefs.Current.gfxQuality);
	prefsGfxQuality.onchange = refreshPrefsButtons;

	var ar = [];
	for (var i = 0; i < Prefs.Default.gfxScreenList.length; i++) {
		ar.push({value: '' + i, title: Prefs.Default.gfxScreenList[i]});
	}
	prefsGfxScreen = new Select('#prefs-gfx-screen', ar);
	prefsGfxScreen.selectedIndex(Prefs.Current.gfxScreen);
	prefsGfxScreen.onchange = refreshPrefsButtons;
	
	if ( prefsGfxFullscreen.checked() == false ) {
		prefsGfxScreen.disabled(true);	
	}  
	
	els = $('#prefs ul > li:has(".select")');
	els.each(function(i) {
		$(this).css('z-index', els.length - i + 1);
	});
		
	$('#prefs li:has(".checkbox")').click(function() {
		$('.checkbox', this).click();
	});	
	
	$('#button-prefs-reset').click(function() {
		if (isButtonDisabled(this))	return false;
		Prefs.Reset();
	});
	
	$('#button-prefs-apply').click(function() {
		if (isButtonDisabled(this))	return false;
		Prefs.Apply( prefsGameMovementMouse.checked() ? "1": "0"
					, prefsSoundUnmute.checked() ? "1": "0"
					, prefsGfxFullscreen.checked() ? "1": "0"
					, prefsGfxQuality.selectedIndex()
					, prefsGfxScreen.selectedIndex() );
	});

	$('#button-prefs-cancel').click(function() {
		if (isButtonDisabled(this))	return false;
		setPrefs(Prefs.Default);
	});
	
	refreshPrefsButtons();
}

function setPrefs( prefs ){
	prefsGfxFullscreen.checked(prefs.isGfxFullscreen);
	prefsSoundUnmute.checked(prefs.isSoundUnmute);
	prefsGameMovementMouse.checked(prefs.isGameMovementMouse);
	prefsGfxQuality.selectedIndex(prefs.gfxQuality);
	prefsGfxScreen.selectedIndex(prefs.gfxScreen);
}

function isPrefsChanged( prefs ){
	if ( prefsGfxFullscreen.checked() != prefs.isGfxFullscreen
	  || prefsSoundUnmute.checked() != prefs.isSoundUnmute
	  || prefsGameMovementMouse.checked() != prefs.isGameMovementMouse
	  || prefsGfxQuality.selectedIndex() != prefs.gfxQuality
	  || prefsGfxScreen.selectedIndex() != prefs.gfxScreen ) return false;
	return true;		
}

function refreshPrefsButtons() {
	if ( isPrefsChanged( Prefs.Default ) )
		setButtonDisabled('prefs-reset');
	else
		 setButtonNormal('prefs-reset');

	if ( isPrefsChanged( Prefs.Current ) ) { 
		setButtonDisabled('prefs-apply');
		setButtonDisabled('prefs-cancel');
	}
	else {
		setButtonNormal('prefs-apply');	
		setButtonNormal('prefs-cancel');
	}
}

/* Custom select */
function Select(query, options) {
	if (typeof options != 'object')	return false;
	if (!options.length)	return false;
	this.options = options;
	this.options[-1] = {value: '', title: '', hint: ''};
	this.query = query;
	this.value = '';
	this.index = -1;
	this.isDisabled = false;

	var obj = this, text = '';
	$.each(this.options, function(i) {
		var title = '';
		if (typeof obj.options[i].title != 'undefined')	title = obj.options[i].hint;
		text += '<li alt="' + obj.options[i].value + '"><div title="' + title + '">' + obj.options[i].title + '</div></li>';
	});
	
	$(this.query).html('<div class="title"><div><div><span>' + this.options[this.selectedIndex()].title + '</span></div></div></div><div class="container"><div class="container-bottom"><ul>' + text + '</ul></div></div>').hover(function() {
		$(this).find('div.title > div').addClass('hover');}, function() {
			$(this).find('div.title > div').removeClass('hover');
	}).mouseup(function() {
		if ($(this).find('div.title > div').hasClass('disabled'))	return false;
		$(this).find('div.title div div').removeClass('down');
	}).mousedown(function() {
		if ($(this).find('div.title > div').hasClass('disabled')) {
			$(this).find('div.title div div').removeClass('down');
			return false;
		}
		
		$(this).find('div.title div div').addClass('down');
	}).find('.title').click(function() {
		if ($(this).find('div').hasClass('disabled'))	return false;
		
		obj.closeAll($('.select', document).not($(this).parents('.select')));
		var cont = $(obj.query).find('.container');
		if ($(this).hasClass('open')) {
			$(this).removeClass('open');
			cont.hide();
		}
		else {
			$(this).addClass('open');
			cont.show();
		}
		
		return false;
	}).end().find('.container li').click(function() {
		var i = $(this).parent().find(this.tagName).index(this);
		obj.selectedIndex(i);
		obj.close();
		return false;
	}).hover(function() {$(this).addClass('hover');}, function() {$(this).removeClass('hover');});
		
	$(document).click(function() {
		obj.close();
	});
	
	$.each(this.options, function(i) {
		if (obj.options[i].selected)	obj.selectedIndex(i);
	});
	
	return this;	
}

Select.prototype = {
	onchange: function(value) {},
	selectedIndex: function(i) {
		if (typeof i == 'undefined') {
			return this.index;
		}
		
		if (i < -1 || i >= this.options.length) {
			return false;
		}
		
		var el = $(this.query).find('.title span');
		this.value = this.options[i].value;
		this.index = i;
		var li = $(this.query).find('li').eq(i);
		el.html(wrapDynamicText(li.find('div').text()));
		
		var buf = el.parent()[0];
		if ( buf )
		{		
		    if (typeof this.options[i].hint == 'undefined')	{
			    buf.title = '';
		    }
		    else {
		        var item = li.find('div')[0];
		        if ( item )
		        {
			        buf.title = item.title;
			    }
			    else
			    {
			        buf.title = '';
			    }
		    }
		}
		this.onchange(this.value);
			
		return true;
	},
	selectedValue: function(v) {
		if (typeof v == 'undefined') {
			return this.value;
		}

		var f = false, i = -1;
		$.each(this.options, function(n) {
			if (this.value == v) {
				i = n;
				return false;
			}
		});
		
		var el = $(this.query).find('.title span');
		if (i == -1) {
			this.value = '';
			el.html('');
		}
		else {
			this.value = this.options[i].value;
			var li = $(this.query).find('li').eq(i);
			//el.html(this.options[i].title);
			el.html(wrapDynamicText(li.find('div').text()));

			var buf = el.parent()[0];
			if (typeof this.options[i].hint == 'undefined')	{
				buf.title = '';
			}
			else {
				buf.title = li.find('div')[0].title;
			}
		}

		this.value = v;
		this.onchange(this.value);
		
		return true;
	},
	close: function() {
		$(this.query).find('.title').removeClass('open').end().find('.container').fadeOut('fast');
		return this;
	},
	closeAll: function(q) {
		$(q).find('.title').removeClass('open').end().find('.container').fadeOut('fast');
	},
	disabled: function(value) {
		if (typeof value != 'undefined') {
			this.close();
			this.isDisabled = value;
			$(this.query).find('.title').removeClass('open');
			var el = $(this.query).find('.title > div');
			if (value)	el.addClass('disabled');
			else el.removeClass('disabled');
		}
		else {
			return this.isDisabled;
		}
	
		return this;
	}
}

/* Custom checkbox */
function Checkbox(query) {
	var obj = this;
	this.value = false;
	this.query = query;
	
	$(this.query).html('<div><div></div></div>').click(function() {
		if ($(this).find('div:first-child').hasClass('checked'))	obj.checked(false);
		else	obj.checked(true);
		return false;
	}).hover(function() {$(this).find('div:first-child').addClass('hover')},
		function() {$(this).find('div:first-child').removeClass('hover down');
	}).mouseup(function() {
		$(this).find('div:first-child').removeClass('down');
	}).mousedown(function() {
		$(this).find('div:first-child').addClass('down');
	});
		
	return this;	
}

Checkbox.prototype = {
	onchange: function(value) {},
	checked: function(c) {
		if (typeof c == 'undefined') {
			return this.value;
		}	
	
		if (c) {
			$(this.query).find('div:first-child').addClass('checked');
			this.value = true;
		}
		else {
			$(this.query).find('div:first-child').removeClass('checked');
			this.value = false;
		}
		this.onchange(this.value);
		
		return this.value;
	}
}

//--------------------------------------------------------------------------------------
Prefs.Reset = function() {
	var PREFS_RESET_COMMAND = 'app:201';
	window.navigate( PREFS_RESET_COMMAND );
}

Prefs.Apply = function( isGameMovementMouse, isSoundUnmute, isGfxFullscreen, gfxQuality, gfxScreen ) {
	var params = "@" + isGameMovementMouse + ( isSoundUnmute != 0 ? ":0:" : ":1:" ) + isGfxFullscreen +":" + gfxQuality +":" + gfxScreen;
	var PREFS_APPLY_COMMAND = 'app:202';
	window.navigate( PREFS_APPLY_COMMAND + params );
}

Prefs.Load = function () {
	var PREFS_LOAD_COMMAND = 'app:20';
	window.navigate( PREFS_LOAD_COMMAND );   						
}

//--------------------------------------------------------------------------------------
Prefs.OnLoad = function(data){
	Prefs.Current.isGameMovementMouse = ( data[0] == 1 ) ? true : false;
	Prefs.Current.isSoundUnmute = ( data[1] == 1 ) ? false : true;
	Prefs.Current.isGfxFullscreen = ( data[2] == 1 ) ? true : false;
	Prefs.Current.gfxQuality = data[3];
	Prefs.Current.gfxScreen = data[4];
	
	Prefs.Default.isGameMovementMouse = ( data[5] == 1 ) ? true : false;
	Prefs.Default.isSoundUnmute = ( data[6] == 1 ) ? false : true;
	Prefs.Default.isGfxFullscreen = ( data[7] == 1 ) ? true : false;
	Prefs.Default.gfxQuality = data[8];
	Prefs.Default.gfxScreen = data[9];
	
	Prefs.Default.gfxScreenList = [];
	var index = 10;
	while( index < data.length )
	{
		Prefs.Default.gfxScreenList[index-10] = data[index];
		index++;
	}
	Prefs.Init();
}

Prefs.OnReset = function (){
	setPrefs(Prefs.Default);

	Prefs.Current.isGfxFullscreen = Prefs.Default.isGfxFullscreen;
	Prefs.Current.isSoundUnmute = Prefs.Default.isSoundUnmute;
	Prefs.Current.isGameMovementMouse = Prefs.Default.isGameMovementMouse;
	Prefs.Current.gfxQuality = Prefs.Default.gfxQuality;
	Prefs.Current.gfxScreen = Prefs.Default.gfxScreen;

	setButtonDisabled('prefs-reset');
	setButtonDisabled('prefs-apply');
	setButtonDisabled('prefs-cancel');	
}

Prefs.OnApply = function () {
	Prefs.Current.isGfxFullscreen = prefsGfxFullscreen.checked();
	Prefs.Current.isGameMovementMouse = prefsGameMovementMouse.checked();		
	Prefs.Current.isSoundUnmute = prefsSoundUnmute.checked();
	Prefs.Current.gfxQuality = prefsGfxQuality.selectedIndex();
	Prefs.Current.gfxScreen = prefsGfxScreen.selectedIndex();
	refreshPrefsButtons();
}

Prefs.OnError = function(){
	Prefs.Error = true;
	setButtonDisabled('prefs-reset');	
	setButtonDisabled('prefs-apply');
	setButtonDisabled('prefs-cancel');	
	setActiveTab('prefs');		
	myMessagePush({title: getText('prefsGfxTitle'), text: getText('GFXError'), status: 'error'});
}


//--------------------------------------------------------------------------------------
Prefs.TranslateMessage = function ( eventType, eventData ) {
	switch(eventType) {
        case 'Prefs.OnLoad': {
			Prefs.OnLoad( eventData );
			InitialCheck.Run();				
			return true;
        }
        
		case 'Prefs.OnReset': {
			Prefs.OnReset();
			return true;	
		}
		
		case 'Prefs.OnApply': {
			Prefs.OnApply();
			return true;
		}
		
		case 'Prefs.OnError': {
			Prefs.OnError();
			return true;
		}
	}
}
