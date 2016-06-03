/*-------------------------------------------------------------------------------------------------------------------*\
|
| Returns a connected Bookshelf instance for each different datastore.
|
\*-------------------------------------------------------------------------------------------------------------------*/
'use strict';

var config = require( 'config' ),
	Bookshelf = require( 'bookshelf' ),
	datastores = config.get( 'datastores' );


function initBookshelfInstance( dbConfig ) {
	var knex = require( 'knex' )({
		client: 'pg',
		connection: "postgres://" +
		dbConfig.username + ":" + dbConfig.password +
		"@" + dbConfig.host + ":" + dbConfig.port + "/" + dbConfig.name,

		debug: dbConfig.debug
	});

	var bookshelf = Bookshelf( knex );

	/*
	 * Allows us to control what fields are included when .toJSON() is called
	 * on each model.
	 *
	 * See https://github.com/tgriesser/bookshelf/wiki/Plugin:-Visibility
	 * and https://github.com/tgriesser/bookshelf/blob/master/plugins/visibility.js
	 *
	 */
	bookshelf.plugin('visibility');

	/*
	 * Allow "Virtual" columns.
	 * https://github.com/tgriesser/bookshelf/wiki/Plugin:-Virtuals
	 */
	bookshelf.plugin('virtuals');


	/*
	 * Avoid circular dependencies by using a plugin registry.
	 * https://github.com/tgriesser/bookshelf/wiki/Plugin:-Model-Registry
	 */
	//bookshelf.plugin('registry').

	return bookshelf;
}

/**
 * getConnectedStore
 *
 * returns a bookshelf instance based upon the "key"
 *
 * @returns {Bookshelf}
 */
function getConnectedStore( key ) {
	if ( connectedStores[ key ] ) {
		return connectedStores[ key ];
	} else {
		console.log( 'Error: ' + key + ' datastore not found' );
		return undefined;
	}
}

// configure each store.
var connectedStores = {};
for ( var i in datastores ) {
	connectedStores[ i ] = initBookshelfInstance( datastores[ i ] );
}

module.exports = getConnectedStore;
