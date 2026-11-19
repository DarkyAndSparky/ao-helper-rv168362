//--------------------------------------------------------------------------------------
Downloader.OnStart = function(){
    $('#progressbar').show();
    changeProcents(0);
    showButton('peersinfo');
}

//--------------------------------------------------------------------------------------
Downloader.OnConnecting = function(){
	var text = getText('connectionWaitingMsg');
	$('#peers-state').html(text);	
}

//--------------------------------------------------------------------------------------
Downloader.OnChecking = function(){
	var text = getText('checkInCachMsg');
	$('#peers-state').html(text);
}

//--------------------------------------------------------------------------------------
Downloader.OnProgress = function(progress, loaded, total, downloadRate, uploadRate, uploaded) {
	var p = progress;
	if (total) {
		p = (parseInt(loaded / total * 1000) / 10).toString();
	}
	changeProcents(p);

	if ( App.patchVersion != "" )	
	    $('#status-file').html( getDynamicText('patchLoadingMsg') + App.patchVersion );
    else
	    $('#status-file').html( getDynamicText('ripDataLoadingMsg') );
	        
    $('#status-size').html( fineSize(total, 0) );
    
	var text = getText('loadedMsg') + peerSizeKb(loaded) + getText('sizeFormMsg') + peerSizeKb(total) + getText('sizeKB');
    $('#peers-body').show();
	
	$('#peers-state').html(text);
    $('#peers-download-rate').html(peerSizeKb(downloadRate, 1) + getText('rateMsg') );
    $('#peers-upload-rate').html(peerSizeKb(uploadRate, 1) + getText('rateMsg'));
    $('#peers-uploaded').html(peerSizeKb(uploaded) + getText('sizeKB') );	
}

//--------------------------------------------------------------------------------------
Downloader.OnPeersInfo = function(peers){
    var text = '<table cellspacing="0" cellpadding="0">';  
    if (peers) {    
		var inter = ''; 
        for (var i = 0; i < peers.length; i += 5) {
            text += '<tr' + inter + '><td class="col1"><div>' + peers[i + 0].replace(/ /gi, '') + '</div></td><td class="col2"><div>' + peerSizeKb(peers[i + 1], 1) + '</div></td><td class="col3"><div>' + peerSizeKb(peers[i + 2], 1) + '</div></td><td class="col4"><div>' + peerSizeKb(peers[i + 3], 1) + '</div></td><td class="col5"><div>' + peerSizeKb(peers[i + 4], 1) + '</div></td></tr>';
            if (inter) {
				inter = '';
            }
            else {
				inter = ' class="inter"';
            }
        }
    }       
    text += '</table>';
    $('#peers-body').html(text);
}

//--------------------------------------------------------------------------------------
Downloader.OnPeersLost = function () {
    $('#status-file').html( getDynamicText('connectionSearchMsg') );
    $('#status-size').html('');
    $('#peers-body').html('<table cellspacing="0" cellpadding="0"></table>');
}

//--------------------------------------------------------------------------------------
Downloader.OnComplete = function () {
	$('#status-size').html('');
	changeProcents(100);
	setActiveTab( App.lastActiveButton );
	hideButton('peersinfo');
}

//--------------------------------------------------------------------------------------
Downloader.TranslateMessage = function ( eventType, eventData ) {
	switch(eventType) {
		case 'Downloader.OnProgress': {
            var progress = parseInt(eventData[0]);
            var loaded = parseInt(eventData[1]);
            var total = parseInt(eventData[2]);
            var downloadRate = eventData[3];
            var uploadRate = eventData[4];            
            var uploaded = eventData[5];                        
            Downloader.OnProgress(progress, loaded, total, downloadRate, uploadRate, uploaded);		
			return true;
		}
			
		case 'Downloader.OnPeersInfo': {
			var peers = eventData;
			Downloader.OnPeersInfo(peers);
			return true;
		}
			
		case 'Downloader.OnPeersLost': {
			Downloader.OnPeersLost();
			return true;
		}
		
		case 'Downloader.OnChecking':{
			Downloader.OnChecking();
			return true;		
		}
		
		case 'Downloader.OnConnecting':{
			Downloader.OnConnecting();
			return true;
		}
	}
}