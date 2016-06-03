'use strict';

import { Router } from 'express';
import SearchKey from '../../../../models/SearchKey';

var _ = require('lodash');
var moment = require('moment');

var router = Router();

router.get( '/:campaignId', function( req, res ) {
	SearchKey.forge()
		.query( function( qb ) {
			qb.where( 'campaign_id', req.params.campaignId );
		})
		.fetch({withRelated: [ 'twitterHistory', 'instagramHistory' ]})
		.then( function( model ) {

			console.log( 'Use the data here to display the analytics' );
			console.log( model );

			var twitterHistory = model.related( 'twitterHistory' );
			console.log( twitterHistory );

			var instagramHistory = model.related( 'instagramHistory' );
			console.log( instagramHistory );

			if ( model ) {
				var result = model.toJSON();
				result.twitterHistory = twitterHistory.toJSON();
				result.instagramHistory = instagramHistory.toJSON();

				// [ TODO ] depending on the chart requested, make calculations in a service... and return that data....
				// [ NOTE ] - definitely do not return this entire object...
				res.json ( result );
			} else {
				res.json({});
			}
		})
		.catch( function( err ) {
			console.log( 'Error: ' + err );
			res.status( 500 )
				res.send({ status: 'FAIL', message: err.toString() });

		});
});

function getChartData(destination, source, type){
	var result = {};
	switch(type){
		case 'daily_active_posts':
			result = _.sortBy(_.map(_.countBy(source, function(model){
					return moment(model.source_creation_date).format("YYYY-MM-DD");
				}), function(v,k){
					return { date: k, count: v};
				}), 'date');

			break;
		case 'daily_impressions':
			result = _.sortBy(_.map(_.groupBy(source, function(model){
					return moment(model.source_creation_date).format("YYYY-MM-DD");
				}), function(v,k){
					var impressions = _.sum(v, function(m) {
					  return m.user_followers_count;
					});
					return { date: k, count: impressions};
				}), 'date');
			break;
		default: 
			break;
	}
	if(result && !_.isEmpty(result)){
		destination.push( { name: type, values: result});	
	}
}

router.get( '/:campaignId/chart', function( req, res ) {
	var startDate = moment(req.query.start_date || new Date());
	var endDate = moment(req.query.end_date || new Date()).add(1, 'day');
	var chart_types = _.reject( (req.query.types || '').split(','), function(s) { return s == '' || s.length == 0 });

	if(_.isEmpty(chart_types)){
		res.json({});
	}else{
		SearchKey.forge()
			.query( function( qb ) {
				qb.where( 'campaign_id', req.params.campaignId );
			})
			.fetch({withRelated: [ 'twitterHistory', 
				{ 
					'twitterHistory': function(qb) { 
						qb.where('twitter_history.source_creation_date', '>=', startDate.format("YYYY-MM-DD")).andWhere('twitter_history.source_creation_date', '<', endDate.format("YYYY-MM-DD")); 
					}
				}, 'instagramHistory', 
				{
					'instagramHistory': function(qb) { 
						qb.where('instagram_history.source_creation_date', '>=', startDate.format("YYYY-MM-DD")).andWhere('instagram_history.source_creation_date', '<', endDate.format("YYYY-MM-DD")); 
					}
				}
			]})
			.then( function( model ) {			

				if ( model ) {
					var result = model.toJSON();
					var twitter_history = model.related('twitterHistory').toJSON();
					var instagram_history = model.related('instagramHistory').toJSON();
					var history = twitter_history.concat(instagram_history);
					result.charts = [];
					_.forEach(chart_types, function(type){
						getChartData(result.charts, history, type);
					});
					// [ TODO ] depending on the chart requested, make calculations in a service... and return that data....
					// [ NOTE ] - definitely do not return this entire object...
					res.json ( result );
				} else {
					res.json({});
				}
			})
			.catch( function( err ) {
				console.log( 'Error: ' + err );
				res.status( 500 )
					res.send({ status: 'FAIL', message: err.toString() });

			});
	}
});

export default router;
