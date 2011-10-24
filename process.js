message_parse = function(nick, chan, un) {
	var options = {
		host: 'ws.audioscrobbler.com',
		port: 80,
		path: '/2.0/?method=user.getrecenttracks&api_key=' + config.api_key + '&format=json&user=' + un
	};

	var req = http.get(options, function(res) {
		var body = '';
		res.on('data', function(chunk) {
			body += chunk;
		}).on('end', function() {
			try {
				body = JSON.parse(body);
				var t = body.recenttracks.track[0];
				var iswas = (t['@attr'] === undefined) ? 'was' : 'is';
				var message = body.recenttracks['@attr'].user + ' ' + iswas + ' listening to '
					+ t.artist['#text'] + ' - ' + t.name + ' from the album ' + t.album['#text'] + '.';
				irc.raw('PRIVMSG ' + chan + ' :' + message);
			} catch (err) {
				console.log('ERROR: ' + err);
			}
		});
	});
	
	req.on('error', function(e) {
		console.log('ERROR: ' + e.message);
	});
}