const requireUncached = require('require-uncached');

import mainTemplate from './src/templates/main.html!text'
import rp from "request-promise"
import 'svelte/ssr/register'
import sync from 'csv-parse/lib/sync'
import fs from 'fs'
import scatter from 'interactive-scatterplots'

const Table = requireUncached('../src/components/interactive-table/render.html')

const data = sync(fs.readFileSync('src/server/cleaned.csv'), { columns : true })
	.sort((a, b) => ['Track', 'Football', 'Tennis'].indexOf(a.sport) >= 0 ? 1 : -1)

const plot = scatter.plot(data, 'endorsements', 'salary', {
	width : 500,
	height : 500,
	xFormat: d => (d/1000000).toFixed(1),
	yFormat: d => (d/1000000).toFixed(1),
	padding : 50,
	xExtent: [0, 100*1000000],
	yExtent: [0, 100*1000000],
	//xStops : [25, 50, 75].map( n => n*1000000),
	//yStops : [25, 50, 75].map( n => n*1000000),
	classCircles : d => 'bolt-circle bolt-circle--' + d.sport.toLowerCase(),
	maxR: 10,
	r: d => d.sport === 'Track' ? 1 : .5,
	defaultStyles: true

})

export async function render() {
	// let tableData = JSON.parse(await rp("https://interactive.guim.co.uk/docsdata-test/17swcJIV-bGKvWApff2aRsazCOWK66lAZIVW9fUMAy6A.json")).sheets.tableDataSheet;
    
 //    let html = Table.render({
 //    	tableTitle: "This is a test table",
 //        tableData: tableData,
 //        serverside: true,
 //        collapseMobile: true,
 //        truncate: 10
 //    });

    return mainTemplate + plot;
}
