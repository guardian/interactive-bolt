import * as d3 from 'd3'

const $ = sel => document.querySelector(sel)
const $$ = sel => [].slice.apply(document.querySelectorAll(sel))

let playing = false
let autoplay = false

const reactionTimes = [

	{
		'name' : 'Usain Bolt',
		'country' : 'JAM',
		'rt' : 0.146
	},{
		'name' : 'Tyson Gay',
		'country' : 'USA',
		'rt' : 0.144
	},{
		'name' : 'Asafa Powell',
		'country' : 'JAM',
		'rt' : 0.134
	},{
		'name' : 'Daniel Bailey',
		'country' : 'ATG',
		'rt' : 0.129
	},{
		'name' : 'Richard Thompson',
		'country' : 'TRI',
		'rt' : 0.119
	},{
		'name' : 'Dwain Chambers',
		'country' : 'GB',
		'rt' : 0.121
	},{
		'name' : 'Marc Burns',
		'country' : 'TRI',
		'rt' : 0.165
	},{
		'name' : 'Darvis Patton',
		'country' : 'USA',
		'rt' : 0.149
	}
]

const rtEl = $('.bolt-rt')
const rt = d3.select(rtEl)
const width = rtEl.clientWidth || rtEl.getBoundingClientRect().width
const height = rtEl.clientHeight || rtEl.getBoundingClientRect().height
const padding = {
	left: 0,
	top: 16,
	right: 0,
	bottom: 8
}

const xScale = d3.scaleLinear()
	.domain([0, 0.17])
	.range([padding.left, width-padding.right])

let line = null
let runners = null
let runnersFilled = null
let theTimes = null

const smartTimeout = (f, delay) => {
	timeouts.push(window.setTimeout(f, delay))
}


const rsg = $('.bolt-rt-countdown')

const pathGen = d3.line()
	.x(d => xScale(d.rt))
	.y(d => (height-padding.top-padding.bottom)/8)

window.addEventListener('scroll', () => {

	if(!autoplay && rtEl.getBoundingClientRect().top < window.innerHeight/2){

		autoplay = true
		playAnimation(20)
	}

})

const drawRt = () => {

	const hatch = rt
		.append('pattern')
		.attr('id', 'bolt-rt-hatch')
		.attr('patternUnits', 'userSpaceOnUse')
		.attr('width', 4)
		.attr('height', 4)

	hatch
		.append('path')
		.attr('d', "M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2")
		.style('stroke', '#dcdcdc')
		.style('stroke-width', 1)

	const falseStart = rt
		.append('rect')
		.attr('x', padding.left)
		.attr('y', padding.top)
		.attr('width', xScale(0.1) - xScale(0))
		.attr('height', height - padding.top - padding.bottom)
		.attr('class', 'bolt-rt-false')

	const grid = rt
		.selectAll('.bolt-rt-grid')
		.data([0, 0.05, 0.1, 0.15])
		.enter()
		.append('g')
		.attr('transform', d => 'translate(' + xScale(d) + ', 0)')
		.attr('class', 'bolt-rt-grid')

	grid
		.append('text')
		.attr('x', 0)
		.attr('y', 12)
		.text((d, i) => {
			return ['0', '0.05s', '0.1s', '0.15s'][i]
		})
		.attr('class', (d, i) => i === 0 ? 'bolt-rt-grid__label bolt-rt-grid__label--left' : 'bolt-rt-grid__label')

	grid
		.append('line')
		.attr('x1', 0)
		.attr('x2', 0)
		.attr('y1', padding.top)
		.attr('y2', height - padding.bottom)
		.attr('class', (d, i) => d === 0 ? 'bolt-rt-grid__line' : 'bolt-rt-grid__line')

	const lanes = rt
		.selectAll('.bolt-rt-lane')
		.data(reactionTimes)
		.enter()
		.append('g')
		.attr('transform', (d, i) => 'translate(0, ' + i*(height - padding.top - padding.bottom)/8 + ')')
		.attr('class', 'bolt-rt-lane')

	runners = lanes
		// .append('circle')
		// .attr('cx', d => xScale(0))
		// .attr('cy', (width-2*padding)/16)
		// .attr('r', 3)
		// .attr('class', '.bolt-rt-result')

		.append('line')

		.attr('x1', xScale(0))
		.attr('x2', xScale(0))
		.attr('y1', (height - padding.top - padding.bottom)/8 + 2)
		.attr('y2', (height - padding.top - padding.bottom)/8 + 2)
		.attr('class', (d, i) => d.name === 'Usain Bolt' ? 'bolt-rt-runner bolt-rt-tail bolt-rt-tail--usain' : 'bolt-rt-runner bolt-rt-tail')

	runnersFilled = lanes
		.append('line')
		.attr('x1', d => xScale(d.rt))
		.attr('x2', d => xScale(d.rt))
		.attr('y1', (height - padding.top - padding.bottom)/8 + 2)
		.attr('y2', (height - padding.top - padding.bottom)/8 + 2)
		.attr('class', 'bolt-rt-runner bolt-rt-filled')

	const names = lanes
		.append('text')
		.attr('x', padding.left + 6)
		.attr('y', (height - padding.top - padding.bottom)/8 - 6 + 2)
		.text(d => d.name + ' (' + d.country + ')')
		.attr('class', d => d.name === 'Usain Bolt' ? 'bolt-rt-name bolt-rt-name--usain' : 'bolt-rt-name')

	theTimes = lanes
		.append('text')
		.attr('x', d => xScale(d.rt))
		.attr('y', (height - padding.top - padding.bottom)/8 - 6 + 2)
		.text(d => d.rt.toFixed(3))
		.attr('class', d => d.name === 'Usain Bolt' ? 'bolt-rt-time bolt-rt-time--usain' : 'bolt-rt-time')
		.attr('fill-opacity', 0)

	// const legend = rt
	// 	.append('g')
	// 	.attr('transform', 'translate(' + padding.left + ', ' + (height - padding.bottom) + ')')
	// 	.attr('class', 'bolt-rt-legend')

	// legend
	// 	.append('rect')
	// 	.attr('x', 0)
	// 	.attr('y', 10)
	// 	.attr('width', 12)
	// 	.attr('height', 12)
	// 	.attr('class', 'bolt-rt-legend__sq')

	// legend 
	// 	.append('text')
	// 	.attr('x', 18)
	// 	.attr('y', 20	)
	// 	.text('false start')
	// 	.attr('class', 'bolt-rt-legend__label')

}


const reset = () => {

	timeouts.forEach(t => clearTimeout(t))
	timeouts = []

	rsg.classList.remove('bolt-rt--animated')
	rsg.classList.remove('bolt-rt--hidden')
	rsg.innerHTML = '3'

	runners
		.transition()
		.duration(0)
		.attr('x1', xScale(0))
		.attr('x2', xScale(0))

	theTimes
		.attr('fill-opacity', 0)
}

const replay = $('.bolt-rt-replay')
const realtime = $('.bolt-rt-realtime')

const slomo = $('.bolt-rt-slomo')

replay.addEventListener('click', () => playAnimation(20))
realtime.addEventListener('click', () => playAnimation(1))

let timeouts = []

const playAnimation = slowFactor => {

	reset()

	if(slowFactor !== 1) { 
		slomo.innerHTML = slowFactor + 'x slower'
	} else {
		slomo.innerHTML = 'real-time'
	}

	//rsg.classList.add('bolt-rt-animated')

	smartTimeout( () => {
		
		rsg.classList.add('bolt-rt--animated')
		setTimeout(() => rsg.classList.remove('bolt-rt--animated'), 300)
		setTimeout(() => rsg.innerHTML = '2', 300)
		smartTimeout( () => {
			//rsg.classList.remove('bolt-rt-animated')

			rsg.classList.add('bolt-rt--animated')
			smartTimeout(() => rsg.classList.remove('bolt-rt--animated'), 300)
			smartTimeout(() => rsg.innerHTML = '1', 300)
			//rsg.classList.add('bolt-rt-animated')

			smartTimeout( () => {

				rsg.classList.add('bolt-rt--animated')
				smartTimeout(() => {
					rsg.classList.remove('bolt-rt--animated')
				}, 300)
				smartTimeout(() => rsg.innerHTML = '0', 300)
				//rsg.classList.add('bolt-rt-shrunk')

				smartTimeout(() => {

					runners
						.transition()
						//.attr('d', pathGen([{ rt : 0 }, { rt : 0.2 }]))
						//.attr('x2', d => xScale(0.2))
						.attr('x2', d => xScale(d.rt))
						.duration(d => d.rt*1000*slowFactor)
						.ease(d3.easeLinear)

				}, 300)


				smartTimeout(() => {

					theTimes
					.transition()
					.attr('fill-opacity', 1)
					.duration(500)

				}, 0.17*1000*slowFactor)
			}, 2000)
		}, 2000)
	}, 500)
}


drawRt()

