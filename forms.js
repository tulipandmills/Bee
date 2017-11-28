var Forms = {
	new:{
		html:`<input type="text" name="title" />
		<input type="submit" name="noTitle" value="Do not use a title" onClick="getElementsByName('title')[0].value='';" />`,
		title:'New item'
	},
	belongsTo:{
		html:'<select name="belongsTo">[[options]]</select>',
		title:'Select belong to'
	},
	selectType:{
		html:'<select name="itemType">[[options]]</select>',
		title:'Select type'
	},
	addProperty:{
		html:'<select name="propertyType">[[options]]</select>',
		title:'What do you want to add? A...'
	},
	success:{
		message:'Done'
	}
}

module.exports = Forms;// JavaScript Document