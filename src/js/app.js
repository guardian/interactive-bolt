import * as d3 from 'd3'

const $ = sel => document.querySelector(sel)
const $$ = sel => [].slice.apply(document.querySelectorAll(sel))

const cdEl = $('.bolt-countdown')
const endless = $('.bolt-scroller')

const scroller = $('.bolt-scroller')
const raceDistance = $('.bolt-scroller').clientHeight

const usain = $('.bolt-usain')

let points = []

let cdStart = null
let start = null
let started = false
let finished = false

let counter = 1

const startCounting = () => {

	const then = new Date()

	usain.style.transform = 'translateY(' + window.innerHeight*2 + 'px)'

	window.addEventListener('scroll', e => {

		if(finished) return

		if(started === false) {
			started = true
			start = new Date()
		}

		// const offsetTop = cdEl.getBoundingClientRect().top + window.pageYOffset

		// console.log(window.innerHeight + window.pageYOffset - offsetTop)

		// if(scroller.getBoundingClientRect().bottom < window.innerHeight) {
		// 	cdEl.innerHTML = 'Finish'
		// 	finished = true
		// 	//console.log(points)
		// 	alert('reaction time: ' + ((start - cdStart - 2000)/1000).toFixed(3) + ', ' + points.length + ' swipes, total time: ' + ((new Date() - then)/1000).toFixed(3))
		// 	drawChart(points)
		// }

		// points.push({ 'dt' : (new Date() - then), 'dy' : scroller.getBoundingClientRect().bottom })


	})

	scroller.addEventListener('click', e => {
		if(started === false) {
	 		started = true
	 		start = new Date()
	 	}

	 	counter += 1

	 	points.push({ 'dt' : (new Date() - then), 'dy' : counter })

	 	if(counter >= 50) {
	 		cdEl.innerHTML = 'Finish'
	 		//console.log(points)
	 		alert('reaction time: ' + ((start - cdStart - 2000)/1000).toFixed(3) + ', ' + points.length + ' clicks, total time: ' + ((new Date() - then)/1000).toFixed(3))
	 		drawChart(points)

	 	}

	})

	console.log('started')

}

const countDown = () => {

	cdStart = new Date()

	setTimeout(() => {
		cdEl.innerHTML = 'Set'
		setTimeout(() => {
			cdEl.innerHTML = 'Go'
			endless.style.background = 'linear-gradient(#f6f6f6, #005689)';
			startCounting()
		}, 1000)
	}, 1000)

}

const drawChart = () => {
	const svgEl = $('.bolt-result')
	const svg = d3.select(svgEl)
	const width = svgEl.clientWidth
	const height = svgEl.clientHeight

	const xScale = d3.scaleLinear()
		.domain(d3.extent(points.map( p => p.dt )))
		.range([0, width])

	const yScale = d3.scaleLinear()
		.domain(d3.extent(points.map( p => p.dy )))
		.range([height, 0])

	const line = d3.line()
		.x(d => xScale(d.dt))
		.y(d => yScale(d.dy))

	svg
		.append('path')
		.datum(points)
		.attr('d', line)
		.attr('class', 'bolt-result__line')


}

countDown()