const path = require('path')
const groups = require(path.resolve('./groups.json'))
const globalMode = process.env.VUE_APP_ENV || ''
const INCLUDE = 1;
const EXCLUDE = 0;

function GRANT (grant_groups, include, mode) {
	include = include === 0 ? 0: 1
	mode = mode || globalMode
	if (typeof grant_groups === 'string') grant_groups = [grant_groups];
	for (let index  = 0; index < grant_groups.length; index++) {
		const ele = grant_groups[index]
		if (!groups.hasOwnProperty(ele)) throw new Error(`Group[${ele}] can not be found`);
		
		const allowedModes = groups[ele]

		if (include == 1 && allowedModes.indexOf(mode) >= 0) return true;

		if (include == 0 && allowedModes.indexOf(mode) >= 0) return false;

	}
	return include == 1 ? false : true
}

function processTemplate (template, startTag, endTag) {
	startTag = startTag || '<!--'
	endTag = endTag || '-->' 
	const results = [];
	const startTagLength = startTag.length
	const endTagLength = endTag.length

	let nextPosition = 0;

	while(true) {
		let foundPosition = template.indexOf(startTag + '{{BEGIN GRANT', nextPosition)
		if (foundPosition === -1) break;

		let foundEnd = template.indexOf('}}' + endTag, nextPosition)
		if (foundEnd === -1) throw new Error('GRANT ERROR(BEGIN GRANT ERROR), At: ' + template)

		
		
		let grandEnd = template.indexOf(startTag + '{{END GRANT}}' + endTag, foundEnd)
		if (grandEnd === -1) throw new Error('GRANT ERROR(NO END GRANT), At: ' + template)

		let command = template.substr(foundPosition + 8 + startTagLength, foundEnd - foundPosition - 8 - startTagLength)

		let contents = template.substr(foundEnd + 2 + endTagLength, grandEnd - foundEnd - 2 - endTagLength);

		results.push(template.substr(nextPosition, foundPosition - nextPosition));
		
		const grantd = (new Function("MODE", "GRANT", "INCLUDE", "EXCLUDE", 'return ' + command))(globalMode, GRANT, INCLUDE, EXCLUDE)
		if (grantd === true) {
			results.push(contents);
		}

		nextPosition = grandEnd + 13 + startTagLength + endTagLength

	}
	if (nextPosition < template.length) {
		results.push(template.substr(nextPosition))
	}
	return results.join('')

}
module.exports = (template) => {

	if (!globalMode) return template;

	template = processTemplate(template)
	template = processTemplate(template, '/* ', ' */')

	return template
}