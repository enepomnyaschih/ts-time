/*
Simple command line parser for NodeJS applications.

MIT License

Copyright (c) 2019 Egor Nepomnyaschih

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

// Option definition: [longName: string, shortName: string, description: string, valuesOrDefault?: string[] | string | number]

function pad(text, len) {
	return text + new Array(len - text.length + 1).join(" ");
}

function toCamelCase(text) {
	return text.replace(/-[a-z]/g, a => a[1].toUpperCase());
}

module.exports.parseCliArguments = (args, supportedOptions) => {
	let currentOption = null;
	const result = {};

	const save = (option, value) => {
		const name = toCamelCase(option[0]);
		if (result.hasOwnProperty(name)) {
			throw new Error(`Duplicating option: --${option[0]}`);
		}
		if (Array.isArray(option[3]) && option[3].indexOf(value) === -1) {
			throw new Error(`Value "${value}" is not supported by --${option[0]} option`);
		}
		result[name] = value;
		currentOption = null;
	};

	const test = (prefix, syntax, regexp, arg) => {
		const matches = regexp.exec(arg);
		if (!matches) {
			return false;
		}
		const [match, name, value] = matches,
			option = supportedOptions.find(option => option[syntax] === name);
		if (!option) {
			throw new Error(`Unrecognized option: ${prefix}${name}`);
		}
		const valuesOrDefault = option[3];
		if (value) {
			save(option, value);
		} else if (valuesOrDefault !== undefined) {
			currentOption = option;
		} else {
			save(option, true);
		}
		return true;
	};

	args.forEach(arg => {
		if (currentOption) {
			if (arg.startsWith("-")) {
				throw new Error(`Option --${currentOption[0]} requires a value`);
			}
			save(currentOption, arg);
			return;
		}
		if (!test("-", 1, /^-([a-z])(.*)$/, arg) && !test("--", 0, /^--([a-z-]+)(?:=(.+))?$/, arg)) {
			throw new Error(`Unexpected argument: ${arg}`);
		}
	});

	if (currentOption) {
		throw new Error(`Option --${currentOption[0]} requires a value`);
	}

	supportedOptions.forEach(option => {
		const name = toCamelCase(option[0]),
			valuesOrDefault = option[3];
		if (!result.hasOwnProperty(name) && valuesOrDefault !== undefined) {
			result[name] = Array.isArray(valuesOrDefault) ? valuesOrDefault[0] : valuesOrDefault;
		}
	});

	return result;
};

module.exports.showCliHelp = (command, supportedOptions, log = console.log) => {
	log("Usage");
	log(`  ${command} [options]`);
	log();

	log("Options");

	const longestOption = Math.max.apply(this, supportedOptions.map(([longName]) => longName.length));

	supportedOptions.forEach(([longName, shortName, description, valuesOrDefault]) => {
		const valuesText = valuesOrDefault === undefined ? ""
			: Array.isArray(valuesOrDefault) ? ": " + valuesOrDefault.join(", ")
			: ` (defaults to ${valuesOrDefault})`;
		log(`  --${pad(longName, longestOption)} -${shortName}  ${description}${valuesText}`);
	});
};
