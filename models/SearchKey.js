/*-------------------------------------------------------------------------------------------------------------------*\
|
| A model for the "searchkeys" db object.
|
\*-------------------------------------------------------------------------------------------------------------------*/
'use strict';

var BaseAnalyticsModel = require( './BaseAnalyticsModel' );
var TwitterHistory = require( './TwitterHistory' );
var InstagramHistory = require( './InstagramHistory' );

module.exports = BaseAnalyticsModel.extend({ // jshint ignore:line
	tableName: 'searchkeys',
	visible: [
		'id',
		'searchkey',
		'startdate',
		'finishdate',
		'active',
		'searchintwitter',
		'searchininstagram',
		'searchinfacebook',
		'creation_date'
	],

	// Define Relationships
	twitterHistory: function() {
		return this.hasMany( TwitterHistory, 'searchkey_id' );
	},

	instagramHistory: function() {
		return this.hasMany( InstagramHistory, 'searchkey_id' );
	},


	/**
	 * Virtual columns.
	 *
	 * Note: These are included in the resulting toJSON() output, regardless of their
	 * presence in the 'visible' array in the model definition.
	 *
	 * Also Note: These are run on the Bookshelf objects, not JSON.
	 */
	virtuals: {}
});
