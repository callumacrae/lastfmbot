var fs = require('fs'),
	http = require('http'),
	IRC = require('irc'),
	config = require('./config');

if (process.argv[2]) {
	config.server.addr = process.argv[2];
}
if (process.argv[3]) {
	config.chans = [process.argv[3]];
}
if (process.argv[4]) {
	config.user.nick = process.argv[4];
}

eval(fs.readFileSync('./process.js', 'utf8'));

global.irc = new IRC(config);
irc.on(/^:([^ !]+)![^!@]+@[^@ ]+ PRIVMSG (#[^ ]+) :\.np(?: ([a-zA-Z0-9_\-]+))?$/, function(info) {
	if (info[3] === undefined) {
		info[3] = info[1];
	}
	info.splice(0, 1);
	message_parse.apply(null, info);
});

irc.on(/^:nub![^!@]+@[^@ ]+ PRIVMSG (#[^ ]+) :\.flush?$/, function(info) {
	eval(fs.readFileSync('./process.js', 'utf8'));
	console.log('Flushed.');
});