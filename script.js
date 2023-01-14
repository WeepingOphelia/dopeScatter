
const jsonurl = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json'

const WIDTH = 900;
const HEIGHT = 600;
const PAD = 50;

const chart = {
  w: WIDTH - 2 * PAD,
  h: HEIGHT - 2 * PAD,
  origin: { x: PAD, y: HEIGHT - PAD},
}

const mouseOver = (event, d) => {

  if (d.Doping != '') {

  }

  tooltip
    .style('opacity', 1)
    .attr('data-year', new Date (d.Year, 0))
    .html(
      d.Name + '<br>' +
      '<span class="tt-year">' + d.Year + '</span><br><br>' +
      (d.Doping ? '<span class="tt-td">' : '<span class="tt-time">') + d.Time + '</span>' +
      (d.Doping ? '<br><br><br>' + d.Doping + '<br><br><br><a href="' + d.URL + '">Source</a>' : '<br><br>')
      
    )

}

const mouseOut = (event, d) => {
  tooltip
    .transition()
    .style('opacity',0)
}


d3.select('body')
  .append('h1')
  .attr('id','title')
  .text('Velocipede Competition Pharmacology')

d3.select('body')
  .append('div')
  .attr('id','chart-div')

const svg = d3.select('#chart-div')
  .append('svg')
  .attr('id','chart')
  .attr('width', WIDTH)
  .attr('height', HEIGHT)

const tooltip = d3.select('#chart-div')
  .append('div')
  .attr('id','tooltip')
  .attr('class','tooltip')
  .text('TOOLTIP TEST')

d3.json(jsonurl)
  .then(ref => {

    const years = ref.map(d => new Date(d.Year, 0))
    const times = ref.map(d => new Date(d.Seconds * 1000))

    const maxYear = d3.max(years)
    const minYear = d3.min(years)

    const minTime = new Date(1970, 0, 1, -5, 36)
    const maxTime = new Date(1970, 0, 1, -5, 40)
    
    const xScale = d3.scaleTime()
      .domain([minYear, maxYear])
      .range([0, chart.w])

    const yScale = d3.scaleTime()
      .domain([minTime, maxTime])
      .range([chart.h, 0])

    const scaledYears = years.map(d => chart.origin.x + xScale(d))
    const scaledTimes = times.map(d => PAD + yScale(d))

    const xAxis = d3.axisBottom(xScale)

    const yAxis = d3.axisLeft(yScale)
      .tickFormat(d3.timeFormat('%M:%S'))
  
    svg.selectAll('circle')
      .data(ref)
      .enter()
      .append('circle')
      .attr('id', (d, i) => i)
      .attr('data-xvalue', (d, i) => years[i])
      .attr('data-yvalue', (d, i) => times[i])
      .attr('class','dot')
      .attr('fill', d => (d.Doping ? 'indianred' : 'cornflowerblue'))
      .attr('r','6')
      .attr('cx', (d, i) => scaledYears[i])
      .attr('cy', (d, i) => scaledTimes[i])
      .on('mouseover', mouseOver)
      .on('mouseout', mouseOut)

    svg.append('g')
      .attr('transform', 'translate(' + chart.origin.x + ',' + chart.origin.y + ')')
      .attr('id','x-axis')
      .call(xAxis)

    svg.append('g')
      .attr('transform', 'translate(' + chart.origin.x + ',' + PAD + ')')
      .attr('id','y-axis')
      .call(yAxis)

    const legend = svg.append('g')
      .attr('id','legend');

    legend
      .selectAll('rect')
      .data(['cornflowerblue', 'indianred'])
      .enter()
      .append('rect')
      .attr('x', (d, i) => chart.w / 2)
      .attr('y', (d, i) => (chart.h - PAD / 2) + (i * PAD / 2))
      .attr('rx', 4)
      .attr('width', 20)
      .attr('height', 20)
      .style('fill', d => d);


    legend
      .selectAll('text')
      .data(['cornflowerblue', 'indianred'])
      .enter()
      .append('text')
      .attr('class', 'legend-text')
      .attr('x', (d, i) => chart.w / 2 + PAD / 2)
      .attr('y', (d, i) => (chart.h - PAD * .3) + i * (PAD / 2))
      .attr('dy', '.35em')
      .style('text-anchor', 'start')
      .text(d => {
        if (d == 'indianred') {
          return 'Doping allegations';
        } else {
          return 'Clean';
        }
      })

  })