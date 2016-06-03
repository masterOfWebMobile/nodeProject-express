'use strict';

import { Router } from 'express';

export default Router()
	.use( '/analytics', require( './analytics' ) )
	.get( '/*', function( req, res ) {
		res.status( 404 );
		res.json({
			errorList: [
				{
					code: '404',
					content: 'API route not found'
				}
			],
			path: req.path
		});
	});
