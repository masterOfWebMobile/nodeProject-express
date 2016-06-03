/*-------------------------------------------------------------------------------------------------------------------*\
|
| A model for the "twitter_history" db object.
|
\*-------------------------------------------------------------------------------------------------------------------*/
'use strict';

var BaseAnalyticsModel = require( './BaseAnalyticsModel' );

module.exports = BaseAnalyticsModel.extend({
	tableName: 'twitter_history',
	visible: [
		'id',
		'searchkey_id',
		'source_id',
		'source_creation_date',
		'source_user_id',
		'text',
		'fav_count',
		'user_followers_count',
		'retweet_count',
		'is_retweet',
		'original_source_user_id',
		'original_source_user_followers_count',
		'creation_date',
		'twitter_user_id',
		'original_user_id'
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
