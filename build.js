var stealTools = require("steal-tools");

stealTools.export({
	steal: {
		config: __dirname + "/package.json!npm"
	},
	options: {
		verbose: true,
		// sourceMaps: true,
		// sourceMapsContent: true
	},
	outputs: {
		"+cjs": {},
		"+amd": {},
		"+global-js": {},
		'+global-css': {}
	}
}).catch(function (e) {

	setTimeout(function () {
		throw e;
	}, 1);

});