/*-------------------------------------------------------------------------------------------------------------------*\
|
| A base model for all our oejbects
|
\*-------------------------------------------------------------------------------------------------------------------*/
'use strict';


var _ = require( 'lodash' ),
	str = require( 'underscore.string' );

var bookshelf = require( '../bookshelfConnected' )( 'analytics' );

/**
 * Base model defines parse/format which gives us
 * nice camelCase attribute names.
 */
module.exports = bookshelf.Model.extend({
/*

	// [ NOTE ] - we were having issues with how the data was defined in postgres..  for now just take the data as given

	parse: function( attrs ) {
		return _.reduce( attrs, function(memo, val, key) {
			memo[ str.camelize( key ) ] = val;
			return memo;
		}, {});
	},
	format: function ( attrs ) {
		return _.reduce( attrs, function (memo, value, key) {
			memo[ str.underscored( key ) ] = value;
			return memo;
		}, {});
	}
*/
});
