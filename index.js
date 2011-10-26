var fs = require('fs'),
	http = require('http'),
	IRC = require('irc'),
	config = require('./config'),
	gen_mess, message_parse, set_user;

if (process.argv[2]) {
	config.server.addr = process.argv[2];
}
if (process.argv[3]) {
	config.chans = [process.argv[3]];
}
if (process.argv[4]) {
	config.user.nick = process.argv[4];
}

var users = JSON.parse(fs.readFileSync('./users_cache', 'utf8'));

eval(fs.readFileSync('./process.js', 'utf8'));

global.irc = new IRC(config);
irc.on(/^:([^ !]+)![^!@]+@[^@ ]+ PRIVMSG (#[^ ]+) :\.np(?: ([a-zA-Z0-9_\-]+))?$/, function(info) {
	message_parse(info[3] || info[1], info[2]);
});

irc.on(/^:([^ !]+)![^!@]+@[^@ ]+ PRIVMSG (#[^ ]+) :\.setuser ([a-zA-Z0-9_\-]+)$/, function(info) {
	set_user(info[1], info[3], info[2]);
});

irc.on(new RegExp('^' + config.admin_regex + ' PRIVMSG (#[^ ]+) :\\\.flush?$'), function(info) {
	eval(fs.readFileSync('./process.js', 'utf8'));
	console.log('Flushed.');
});