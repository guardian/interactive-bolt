import sync from 'csv-parse/lib/sync'
import csvStringify from 'csv-stringify'
import fs from 'fs'
import scatter from 'guardian/interactive-scatterplots'


const parseNumber = str => {

	const oom = str.endsWith('M') ? 1000000 : 1000
	return parseFloat(str.slice(1))*oom

}

const data = sync(fs.readFileSync('src/server/uncleaned.csv'), { columns : true })
	.map(row => {

		return {
			'name' : row.Name,
			'pay' : parseNumber(row.Pay),
			'salary' : parseNumber(row['Salary/Winnings']),
			'endorsements' : parseNumber(row['Endorsements']),
			'sport' : row.Sport
		}

	})

data.sort((a, b) => a.sport > b.sport ? 1 : -1)
console.log(data.map(d => d.sport))

//csvStringify(data, { header : true }).pipe(fs.createWriteStream('src/server/cleaned.csv'))