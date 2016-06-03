/*-------------------------------------------------------------------------------------------------------------------*\
|
| Enables the serving of isomorphic react.
|
\*-------------------------------------------------------------------------------------------------------------------*/
'use strict';

var React = require( 'react' ),
	Router = require( 'react-router' ),
	config = require( 'config'),
	Path = require( 'path' ),
	uuid = require( 'uuid' ),
	routes = require( '../app/routes' ),
	HtmlDocument = require( './HtmlDocument' ),
	Parse = require( 'parse' ).Parse,
	Constants = require( '../app/Constants' );

var fetchData = require( '../app/utils/fetchData' );
var cache = require( '../app/utils/cache' );

function renderApp( req, res, next, callback ) {

	Parse.initialize( Constants.Parse.applicationId, Constants.Parse.key );

	if ( !req.session.token ) {
		req.session.token = uuid.v4();
	}

	var router = Router.create({
		routes: routes,
		location: req.url,
		onAbort: function( redirect ) {
			callback({ redirect });
		},
		onError: function( err ) {
			console.log( 'Routing Error' );
			console.log( err );
		}
	});

	router.run(( Handler, state ) => {
		var isNotFound = state.routes.some( function( route ) {
  			return route.isNotFound;
		});

		if ( isNotFound ) {
			callback( { notFound: true }, generateHtmlDocument( req, Handler ) );
		} else {
			fetchData( req.session.token, state ).then(( data ) => {
				callback( null, generateHtmlDocument( req, Handler, req.session.token, data ) );
			});
		}
	});
}

function generateHtmlDocument( req, Handler, token, data ) {
	let clientData = { token, data: cache.clean( token ) };
	let applicationName = "Brand Portal-" + req.locals.package.version;
	return '<!doctype html>' +
		React.renderToString(
			<HtmlDocument
				environment={process.env.NODE_ENV}
				applicationName={applicationName}
				title={config.get( 'html.title' )}
				componentHTML={ React.renderToString( <Handler data={data} /> )}
				state={ '__DATA__ = ' + JSON.stringify( clientData ) }
				main={config.get( 'js.main' )}
				googleAnalyticsScript={`(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)})(window,document,'script','//www.google-analytics.com/analytics.js','ga');ga('create', '${ config.get( 'analytics.googleId' ) }', 'auto');ga('send', 'pageview');`}
			/>
		);
}

module.exports = function( req, res, next ) {
	renderApp( req, res, next, ( error, html ) => {
		if ( !error ) {
			res
				.set( 'Content-Type', 'text/html' )
				.send( html );
		} else if ( error.redirect ) {
			res.redirect( 303, error.redirect.to );
		} else if ( error.notFound ) {
			res
				.status( 404 )
				.set( 'Content-Type', 'text/html' )
				.send( html );
		}
	});
};
