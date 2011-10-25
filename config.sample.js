var config = {
	user: {
		nick: '',
		user: '',
		real: ''
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