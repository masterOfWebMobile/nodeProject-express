/*-------------------------------------------------------------------------------------------------------------------*\
|
| Base server file for setting up an Express/React app.
|
\*-------------------------------------------------------------------------------------------------------------------*/
'use strict';

var express = require( 'express' ),
	config = require( 'config' ),
	clientSessions = require( 'client-sessions' ),
	favicon = require( 'serve-favicon' ),
	Path = require( 'path' ),
	compression = require( 'compression' ),
	bodyParser = require( 'body-parser' ),
	debug = require( 'debug' )( 'server:info' );

if ( !process.env.NODE_ENV ) {
	process.env.NODE_ENV = 'development';
}

debug( 'NODE_ENV: [' + process.env.NODE_ENV + ']' );
debug( 'Starting Express Server' );
debug( 'Config:' );
debug( config );

require( 'node-jsx' ).install();
require( 'babel/register' )();

var server = module.exports = express();
server.locals = {
	config: config,
	rootDirectory: Path.join( __dirname, '../' ),
	package: require( '../package.json' )
};

// webpack proxy server - hot reload, etc.
if ( process.env.NODE_ENV === 'development' ) {
	require( '../webpack/server' );
	var proxy = require( 'http-proxy' ).createProxyServer();

	server
		.all( '/build/*', function( req, res ) {
			proxy.web( req, res, {
				target: config.get( 'webpack.contentBase' )
			});
		});
}

server
	.set( 'query parser', 'extended' )
	.use( clientSessions( config.get( 'session' ) ) )
	.use( bodyParser.json() )
	.use( compression() )
	.use( function( req, res, next ) {
		req.locals = server.locals;
		next();
	})
	.use( '/heartbeat', require( './heartbeat' ) )
	.use( '/assets', express.static( Path.join( __dirname, '../', '/app/assets/' ), config.get( 'serveStatic' ) ) )
	.use( '/assets', function( req, res, next ) {
		res.status( '404' )
		res.send( 'Static Fail: File not Found' );
	})
	.use( '/build', express.static( Path.join( __dirname, '../', '/build/' ), config.get( 'serveStatic' ) ) )
	.use( '/build', function( req, res, next ) {
		res.status( '404' )
		res.send( 'Static Fail: File not Found' );
	})
	.use( favicon( Path.join( __dirname, '../', '/app/assets/favicon.ico' ) ) )
	.use( favicon( Path.join( __dirname, '../', '/app/assets/favicon.png' ) ) )
	.use( '/api/1.0', require( './routes/api/1.0' ) )
	.use( '/', require( './isomorphicReact' ) )
	.listen( config.get( 'port' ), function() {
		debug( 'Listening on port %d', config.get( 'port' ) );
		if ( process.send ) {
			process.send( 'online' );
		}
	});
