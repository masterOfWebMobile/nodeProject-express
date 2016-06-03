/*-------------------------------------------------------------------------------------------------------------------*\
|
| Checks the status of the server.
|
\*-------------------------------------------------------------------------------------------------------------------*/
'use strict';

var objectPath = require( 'object-path' );

module.exports = function( req, res, next ) {
	var statusString;
	var allSystemsGo = true;

	if ( allSystemsGo ) {
		statusString = 'OK';
	} else {
		res.status( 500 );
		statusString = 'ERROR';
	}

	res.set( 'Cache-Control', 'private, max-age=0, no-cache' );
	res.json({
		status: statusString,
		version: objectPath.get( req, 'locals.package.version' )
	});
};
