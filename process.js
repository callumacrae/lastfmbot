message_parse = function(un, chan) {
	if (users[un] !== undefined) {
		un = users[un];
	}
	
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

set_user = function(nick, un, chan) {
	users[nick] = un;
	irc.raw('PRIVMSG ' + chan + ' :' + nick + ' is now associated with last.fm account ' + un);
}