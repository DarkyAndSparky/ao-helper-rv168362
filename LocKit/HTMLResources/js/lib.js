function backgroundImageCache() {
	var res = document.uniqueID && document.compatMode && !window.XMLHttpRequest && document.execCommand;
	try {
		if (!!res) {
			res('BackgroundImageCache', false, true);
		}
	}
	catch(oh) {};
}

function formatNumber(text, precision, separator, separatorFloat) {
	if (typeof separator == 'undefined')	var separator = ' ';

	var divisor = 3;
	var num = text;
	
	if (text.constructor === Number) {
		num = num.toString();
	}
	else {
		num = num.replace(/,/, '.');
		if (num.indexOf('.') === 0)	num = '0' + num;
	}
	
	var result = '';
	var dot = num.indexOf('.');

	if (dot != -1) {
		if (typeof precision != 'undefined') {
			result = num.slice(dot, dot + precision + 1);
		}
		else {
			result = num.slice(dot);
		}
		
		result = result.replace(/\./, (separatorFloat) ? separatorFloat : ',');
		num = num.substr(0, dot);
	}

	for (var i = num.length - divisor; i >= 0; i -= divisor) {
		result = separator + num.slice(i, i + divisor) + result;
	}
	
	if (i >= (1 - divisor) && i < 0) {
		result = num.slice(0, i + divisor) + result;
	}
	
	return result;
}

function formatBytes(n) {
	var b = parseInt(n).toString();	
	var res = '';
	var sp = '';
	var n = 1;
	
	for (var i = b.length - 1; i >= 0; i--) {
		sp = '';
		if (n == 3) {
			n = 1;
			if (i)	sp = '&#160;';
		}
		else {
			n++;
		}
		res = sp + b.charAt(i) + res;
	}
	return res;
}

function fineSize(n, precision) {
	var kb = 1024;
	var mb = kb * kb;
	var gb = mb * mb;
	
	if (typeof precision == 'undefined') {
		precision = 0;
	}
	
	var pr = Math.pow(10, precision);

	var text = '';
	if (n < kb) {
		text = n + getDynamicText('sizeB');
	}
	else if (n >= kb && n < mb) {
		text = Math.floor(n / kb * pr) / pr + getDynamicText('sizeKB');
	}
	else if (n >= mb && n < gb) {
		text = Math.floor(n / mb * pr) / pr + getDynamicText('sizeMB');
	}
	else {
		text = Math.floor(n / gb * pr) / pr + getDynamicText('sizeGB');
	}

	return text.replace(/\./, ',');
}

function fineSizeBS(n, precision) {
	var kb = 1024;
	var mb = kb * kb;
	var gb = mb * mb;
	
	if (typeof precision == 'undefined') {
		precision = 0;
	}
	
	var pr = Math.pow(10, precision);

	var text = '';
	if (n < kb) {
		text = n + getDynamicText('sizeBSec');
	}
	else if (n >= kb && n < mb) {
		text = Math.floor(n / kb * pr) / pr + getDynamicText('sizeKbSec');
	}
	else if (n >= mb && n < gb) {
		text = Math.floor(n / mb * pr) / pr + getDynamicText('sizeMbSec');
	}
	else {
		text = Math.floor(n / gb * pr) / pr + getDynamicText('sizeGbSec');
	}

	return text.replace(/\./, ',');
}

function peerSizeKb(n, precision) {
	if (typeof precision == 'undefined') {
		precision = 0;
	}
	
	var pr = Math.pow(10, precision);

	return formatNumber(Math.floor(n / 1024 * pr) / pr, precision);
}

function disableContextMenu() {
	$(document).mousedown(function(e) {
		if (e.which == 3)	return false;
		return true;
	}).bind('contextmenu', function() {return false;});
}
