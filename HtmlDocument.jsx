/*-------------------------------------------------------------------------------------------------------------------*\
|
| Base server file for setting up an Express/React app.
|
\*-------------------------------------------------------------------------------------------------------------------*/
'use strict';

import React from 'react';

class HtmlDocument extends React.Component {

	static propTypes = {
		title: React.PropTypes.string,
		componentHTML: React.PropTypes.string,
		state: React.PropTypes.string,
		applicationName: React.PropTypes.string,
		main: React.PropTypes.string,
		googleAnalyticsScript: React.PropTypes.string
	}

	renderScripts() {
		return [
			<script dangerouslySetInnerHTML={{__html: this.props.googleAnalyticsScript }} />,
		];
	}

//					<link rel="stylesheet" href="/assets/styles/styles.css" />
//					<link rel="stylesheet" href="/assets/styles/styles-responsive.css" />


	render() {
		return (
			<html>
				<head>
					<meta charSet="utf=8" />
					<meta name="application-name" content={this.props.applicationName} />
					<title>{this.props.title}</title>
					<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
					<link rel="icon" type="image/png" href="favicon.png" />
				</head>
				<body>
					<div id="app" dangerouslySetInnerHTML={{__html: this.props.componentHTML}} />
					<script dangerouslySetInnerHTML={{__html: this.props.state}} />
					<script src={this.props.main}></script>
					{ this.props.environment === 'production' ? this.renderScripts() : null }
				</body>
			</html>
		);
	}
}

module.exports = HtmlDocument;
