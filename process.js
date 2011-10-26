gen_mess = function(info) {
	var loves = (info.loved) ? '<3 - ' : '';
	return info.user + ' ' + ((info.current) ? 'is' : 'was') + ' listening to ' + info.artist
		+ ' - ' + info.track + ' from the album ' + info.album + ' (' + loves + 'played '
		+ info.plays + ' times)'.replace(/\n\r/g, '');
}

message_parse = function(un, chan) {
	if (users[un] !== undefined) {
		un = users[un];
	}
	
	var options = {
		host: 'ws.audioscrobbler.com',
		port: 80,
		path: '/2.0/?method=user.getrecenttracks&api_key=' + config.api_key + '&format=json&user=' + un
	};
	
	var info = {};

	var req = http.get(options, function(res) {
		var body = '';
		res.on('data', function(chunk) {
			body += chunk;
		}).on('end', function() {
			try {
				body = JSON.parse(body);
				var t = body.recenttracks.track[0];
				info.current = (t['@attr'] !== undefined);
				info.user = body.recenttracks['@attr'].user;
				info.artist = t.artist['#text'];
				info.track = t.name;
				info.album = t.album['#text'];
				
				options.path = '/2.0/?method=track.getinfo&format=json&api_key='
					+ config.api_key + '&artist=' + encodeURIComponent(info.artist)
					+ '&track=' + encodeURIComponent(info.track) + '&username=' + info.user;
				var req2 = http.get(options, function(res) {
					var body2 = '';
					res.on('data', function(chunk) {
						body2 += chunk;
					}).on('end', function() {
						body2 = JSON.parse(body2);
						info.plays = body2.track.userplaycount;
						info.loved = (body2.track.userloved === 1);
						irc.raw('PRIVMSG ' + chan + ' :' + gen_mess(info));
					});
				});
				
				req2.on('error', function(e) {
					console.log('ERROR3: ' + e.message);
				});
			} catch (err) {
				console.log('ERROR2: ' + err);
			}
		});
	});
	
	req.on('error', function(e) {
		console.log('ERROR1: ' + e.message);
	});
}

set_user = function(nick, un, chan) {
	users[nick] = un;
	irc.raw('PRIVMSG ' + chan + ' :' + nick + ' is now associated with last.fm account ' + un);
	fs.writeFile('./users_cache', JSON.stringify(users), function (err) {
		if (err) {
			console.log('ERROR4: ', e)
		} else {
			console.log('Successfully saved users_cache');
		}
	});
}