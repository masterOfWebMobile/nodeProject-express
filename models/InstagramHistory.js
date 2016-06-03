/*-------------------------------------------------------------------------------------------------------------------*\
|
| A model for the "instagram_history" db object.
|
\*-------------------------------------------------------------------------------------------------------------------*/
'use strict';

var BaseAnalyticsModel = require( './BaseAnalyticsModel' );

module.exports = BaseAnalyticsModel.extend({
	tableName: 'instagram_history',
	visible: [
		'id',
		'searchkey_id',
		'source_id',
		'source_creation_date',
		'source_user_id',
		'text',
		'likes_count',
		'user_followers_count',
		'creation_date',
		'instagram_user_id'
	],

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
