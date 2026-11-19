Locale.langs = [];
FWLocale.langs = [];

var currentLocale = null;

function setLocale(locale) {
	var oldLocale = currentLocale;
    currentLocale = locale;
    $('body').attr('class', currentLocale);
    $('#select-lang').val(currentLocale);
    updateLocale(oldLocale);
}

function getText(id) {
	var str = '';
	if (typeof Locale[currentLocale] != 'undefined') {
		var lang = Locale[currentLocale];
		if (typeof lang[id] != 'undefined') {
			str = lang[id];
		}
	}
	
	return str;
}

function getDynamicText(id) {
	return '<span class="dynamic-text" unselectable="on">' + getText(id) + '</span>';
}

function wrapDynamicText(text) {
	return '<span class="dynamic-text" unselectable="on">' + text + '</span>';
}

function updateLocale(oldLocale) {
	$('#update-ie5').html( getText('updateIE5Message') );
	
	$('#button-account').attr('href', getText('accountURL'));
	$('#button-registration').attr('href', getText('registrationURL'));
	$('#button-forum').attr('href', getText('forumURL'));
	$('#button-patchnotes').attr('title', getText('patchnotesTitle'));
	$('#button-server').attr('title', getText('serverTitle'));
	$('#button-prefs').attr('title', getText('prefsTitle'));
	$('#button-license').attr('title', getText('licenseTitle'));
	$('#button-ripfiles').attr('title', getText('versionTitle'));
	$('#button-news').attr('title', getText('newsTitle'));					
	$('#button-peersinfo').attr('title', getText('peersInfoTitle'));
	$('#button-serverstatus').attr('title', getText('serverstatusTitle'));	
	$('#button-lang').attr('title', getText('selectLang'));
	
	$('#button-prefs-cancel').attr('title', getText('prefsCancelTitle'));
	$('#button-prefs-reset').attr('title', getText('prefsResetTitle'));
	$('#button-prefs-apply').attr('title', getText('prefsApplyTitle'));
		
	$('#copyright-nival').html( getText('copyrightNival') );
	
	$('#launcher #window-title').html( getText('windowTitle') + ' ' + App.currentVersion );
	$('#syncversion #window-title').text( getText('patchVersionMsg'));	

	$('#peers-head th.col1').html(getText('peerIP'));	
	$('#peers-head th.col2').html(getText('peerLoaded'));	
	$('#peers-head th.col3').html(getText('peerLoadRate'));	
	$('#peers-head th.col4').html(getText('peerDownloaded'));	
	$('#peers-head th.col5').html(getText('peerDownloadRate'));	

	$('#peers-state').html( getText('peersState'));
	$('#peers-total td.col1').html( getText('peersTotalLoadRate'));
	$('#peers-total td.col2').html( getText('peersTotalDownloadRate'));
	$('#peers-total td.col3').html( getText('peersTotalDownloaded'));
		
	$('#ripfiles-title').html( getText('ripfilesTitle'));
	$('#ripfiles-head th.col1 div').html( getText('ripName'));
	$('#ripfiles-head th.col2 div').html( getText('ripSize'));
	$('#ripfiles-head th.col3 div').html( getText('ripState'));
	
	$('#ripfiles-data td.row1').html( getText('ripsTotalCount'));
	$('#ripfiles-data td.row2').html( getText('ripsTotalSize'));
	
	$('#prefs-title').html( getText('prefsTitle'));

	$('#prefs-gfx li.title').html( getText('prefsGfxTitle'));
	$('#prefs-sound li.title').html( getText('prefsSoundTitle'));
	$('#prefs-game li.title').html( getText('prefsGameTitle'));

	$('#prefs-gfx-fullscreen-text').html( getText('prefsGfxFullscreen'));
	$('#prefs-gfx-screen-text').html( getText('prefsGfxScreen'));
	$('#prefs-gfx-quality-text').html(getText('prefsGfxQuality'));

	$('#prefs-sound-unmute-text').html(getText('prefsSoundUnmute'));
	
	$('#prefs-game-movement-mouse-text').html(getText('prefsGameMovementMouse'));
	
	updateDynamicText(oldLocale);
	updateDynamicTitle(oldLocale, '#prefs-gfx');
}

function updateDynamicText(oldLocale) {
	if (oldLocale === null)	return;
	$('span.dynamic-text').each(function() {
		var p;
		var oldL = Locale[oldLocale];
		var curL = Locale[currentLocale];
		for (p in oldL) {
			if (this.innerHTML == oldL[p]) {
				this.innerHTML = curL[p];
				break;
			}
		}
	});
}

function updateDynamicTitle(oldLocale, query) {
	if (oldLocale === null)	return;
	if (typeof query == 'undefined')	query = 'body';
	$('span.dynamic-text[title], div[title]', query).each(function() {
	//alert(this);
		var p;
		var oldL = Locale[oldLocale];
		var curL = Locale[currentLocale];
		for (p in oldL) {
			if (this.title == oldL[p]) {
				this.title = curL[p];
				break;
			}
		}
	});
}

//---------------------------------------------------------------------------------
function ReloadFrames(){
	if (!isIE5){
		$('#news-ajax-indicator').show();
	}
	$('#news').css('visibility', 'hidden');
	
	setButtonDisabled('news');
	setButtonDisabled('patchnotes');
	setButtonDisabled('license');
	setButtonDisabled('serverstatus');
	
	if ( !isIE5 ) {
		if ($('body')[0].id == 'launcher') {	
			$('#news')[0].src = getText('newsURL') + App.tempVersion +'&rnd=' + Math.floor(Math.random() * 10000);
		}
		else {
			var patchUrl = getText('patchnotesURL') + App.tempVersion +'&rnd=' + Math.floor(Math.random() * 10000) + '#ver' + App.currentVersion;
			$('#patchnotes')[0].src = patchUrl;					
		}
	}	
}

//---------------------------------------------------------------------------------
var SelectorLang = {
	id: '#selector-lang',
	onchange: function(lang) {},
	init: function() {
		$(this.id).parent().click(function() {
			SelectorLang.hide();
		});
		
		$(document).click(function() {
			SelectorLang.hide();
		});
		
		var f = $(this.id);
		var text = '<ul>';
		for (var i = 0; i < Locale.langs.length; i++) {
			text += '<li alt="' + Locale.langs[i].value + '" title="' + Locale.langs[i].title + '">' + Locale.langs[i].title + '</li>';
		}
		text += '</ul>';
		f.html(text);

		$('li', f).mouseover(function() {
			$(this).addClass('hover');
		}).mouseout(function() {
			$(this).removeClass('hover');
		}).click(function() {
			$(this.id + ' li').removeClass('selected');
			var lang = $(this).addClass('selected').attr('alt');
			SelectorLang.hide();
			SelectorLang.onchange(lang);
			
			return false;
		});
	},
	show: function() {
		setButtonActive('lang');
		$(this.id).fadeIn('fast');
	},
	hide: function() {
		setButtonNormal('lang');
		$(this.id).fadeOut('fast');
	},
	setLang: function(lang) {
		$(this.id + ' li').removeClass('selected').filter('[alt="' + lang + '"]').addClass('selected');
	}
}


//--------------------------------------------------------------------------------------
Locale.Load = function() {
	var LOCALE_LOAD_COMMAND = 'app:10';
	window.navigate( LOCALE_LOAD_COMMAND );					
}

//--------------------------------------------------------------------------------------
Locale.Save = function( locale ) {
	var LOCALE_SAVE_COMMAD = 'app:100@';
	window.navigate( LOCALE_SAVE_COMMAD + locale );	
}

//--------------------------------------------------------------------------------------
Locale.Init = function () {
	if (Locale.langs.length > 1) { 
		SelectorLang.init();
		SelectorLang.onchange = function(lang) {
			if (currentLocale != lang)
				Locale.Save( lang )
		}
	}
	else {
		$('#toolbar').addClass('without-support-lang');
		$('#container-selector-lang').hide();
	}
	
	Locale.Load();	
}

//--------------------------------------------------------------------------------------
Locale.OnLoad = function ( newLocale ) {
	if ( newLocale != currentLocale ) {
		var isPresent = false;
		for(var i = 0; i < Locale.langs.length; i++) {
			if (Locale.langs[i].value == newLocale) {
				isPresent = true;
				break;
			}
		}			

		if ( isPresent ) {
			setLocale( newLocale );
			ReloadFrames();			
		}
		else
			Locale.Save(Locale.langs[0].value)
	}
}

Locale.SetMainSite = function( newMainState ) {}

//--------------------------------------------------------------------------------------
Locale.TranslateMessage = function ( eventType, eventData ) {
	switch(eventType) {
        case 'Locale.OnLoad': {
					var newLocale = eventData;
					Locale.OnLoad( newLocale );
					return true;
			  }	
			  case 'Locale.SetMainSite': {
					var mainSite = eventData;
					Locale.SetMainSite( mainSite );
					return true;
			  }	
	}
}
