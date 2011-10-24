var config = {
	user: {
		nick: 'last-nub',
		user: 'nub',
		real: 'nubs last.fm bot'
	},
	server: {
		addr: 'irc.efnet.org',
		port: 6667
	},
	chans: [
		'#chat'
	],
	admin_regex: ':nub![^!@]+@lynxphp\.com',
	api_key: '' // Your last.fm API key
}

module.exports = config;