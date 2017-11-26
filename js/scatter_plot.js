// let inPageData =

d3.json('static_data/compObj_46_repos.json', function (data) {
  console.log(data)
  function strToDtSingle (d) {
    return new Date(d)
  }

  let myData = data
  // let myData = inPageData
  console.log(myData)
  transformLangObj(myData)

  function transformLangObj (myData) {
    myData.map(function (obj) {
      let lObj = obj.all_lang_bytes_for_repo
      let nArr = []
      Object.keys(lObj).forEach(key => {
        let nKVP = {
          language: key,
          count: lObj[key]
        }
        nArr.push(nKVP)
      })
      obj.all_lang_bytes_for_repo = nArr
    })
  }

  let langBytesFirst = makeBytesFirst(myData)

  function makeBytesFirst (myData) {
    let newDataObjsArr = []
    myData.map(function (repObj) {
      let bytObj = repObj.all_lang_bytes_for_repo
      let newDataObj = {}
      if (bytObj.length !== 0) {
        bytObj.map(function (langByteObj) {
          newDataObj = {
            'language': langByteObj.language,
            'count': langByteObj.count,
            'repo_name': repObj.repo_name,
            'pushed_at': repObj.pushed_at,
            'primary_repo_lang': repObj.primary_repo_lang,
            'url_for_all_repo_langs': repObj.url_for_all_repo_langs
          }
          newDataObjsArr.push(newDataObj)
        })
      } else {
        newDataObj = {
          'language': 'Null',
          'count': 0,
          'repo_name': repObj.repo_name,
          'pushed_at': repObj.pushed_at,
          'primary_repo_lang': 'na',
          'url_for_all_repo_langs': repObj.url_for_all_repo_langs
        }
        newDataObjsArr.push(newDataObj)
      }
    })
    return newDataObjsArr
  }

  let sortbyDate = d3.nest()
    .key(function (d) {
      return d.pushed_at
    })
    .sortKeys(d3.ascending)
    .entries(langBytesFirst)

  let minDate = new Date(sortbyDate[0].key),
    maxDate = new Date(sortbyDate[sortbyDate.length - 1].key),
    xMax = new Date(maxDate).addWeeks(1),
    xMin = new Date(minDate).addWeeks(-1)

  let margin = {
      top: 10,
      right: 56,
      bottom: 40,
      left: 16
    },
    width = 600 - margin.left,
    height = 380 - margin.top - margin.bottom

  // setup x
  let xScale = d3.scaleTime().domain([xMin, xMax]).range([margin.right, width - margin.left]),
    xValue = function (d) { return xScale(strToDtSingle(d.pushed_at)) },
    xAxis = d3.axisBottom(xScale).ticks(d3.timeWeek.every(2)).tickFormat(d3.timeFormat('%b %e'))

  // setup y
  let yScale = d3.scaleLinear().domain([0, 82000]).range([height - 2, 0]),
    yValue = function (d) { return yScale(d.count) },
    yAxis = d3.axisLeft(yScale).tickFormat(d3.format('0.2s'))

  // Add the svg canvas
  let svg = d3.select('#for_svg')
    .append('svg')
    .attr('width', width + margin.left)
    .attr('height', height + margin.top + margin.bottom)

  let g = svg.selectAll('g')

  // Add the x Axis
  svg.append('g')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)
    .append('text')
    .attr('class', 'label')
    .attr('x', (width / 2) + 20)
    .attr('y', 40)
    .text('Date of Most Recent Commit')

  // Add the y Axis
  svg.append('g')
    .attr('transform', 'translate(' + margin.right + ', 0)')
    .call(yAxis)
    .append('text')
    .attr('class', 'label')
    .attr('transform', 'rotate(-90)')
    .attr('y', (-1 * margin.right))
    .attr('x', 0 - (height / 2))
    .attr('dy', '1em')
    .style('text-anchor', 'middle')
    .text('Number of Bytes Stored')

  // setup dot colors
  let blue = '#457DB7',
      rubyred = '#991B67',
      purple = '#A99CCD',
      peach = '#E6AC93',
      grey = '#8F8F90',
      cValue = function (d) { return d.language },
      color = d3.scaleOrdinal()
        .domain(['JavaScript', 'Ruby', 'CSS', 'HTML', 'CoffeeScript', 'Shell', 'Null'])
        .range([blue, rubyred, purple, peach, grey, grey, grey])


  // assign tooltip
  let tooltip = d3.select('body').append('div')
    .attr('class', 'tooltip')
    .style('opacity', 0)

  // draw dots
  svg.selectAll('dot')
    .data(langBytesFirst)
    .enter().append('circle')
    .attr('r', 3.5)
    .attr('cx', xValue)
    .attr('cy', yValue)
    .style('fill', function (d) { return color(cValue(d)) })
    .on('mouseover', function (d) {
      tooltip.transition()
        .duration(200)
        .style('opacity', 1)
      tooltip.html(d.language + '<br/>' + d.repo_name)
        .style('left', (d3.event.pageX + 4) + 'px')
        .style('top', (d3.event.pageY - 12) + 'px')
    })
    .on('mouseout', function (d) {
      tooltip.transition()
        .duration(200)
        .style('opacity', 0)
    })

  let lcolor = d3.scaleOrdinal()
    .domain(['JavaScript', 'Ruby', 'CSS', 'HTML', 'CoffeeScript/Shell'])
    .range([blue, rubyred, purple, peach, grey])

  let legend = svg.selectAll('.legend')
    .data(lcolor.domain())
    .enter().append('g')
    .attr('class', 'legend')
    .attr('transform', function (d, i) {
      return 'translate(4,' + i * 18 + ')'
    })

  legend.append('rect')
    .attr('x', margin.right + 4)
    .attr('width', 14)
    .attr('height', 14)
    .style('fill', lcolor)

  legend.append('text')
    .attr('class', 'legend_label')
    .attr('x', margin.right + 22)
    .attr('y', 7)
    .attr('dy', '.35em')
    .style('text-anchor', 'start')
    .text(function (d) { return d })


  // Set up variables to define outline properties
  let maxCount = d3.max(langBytesFirst, function (d) { return d.count }),
    otLrName = langBytesFirst.filter(obj => obj.count === maxCount)[0].repo_name,
    otLrLang = langBytesFirst.filter(obj => obj.count === maxCount)[0].language,
    otLrDate = new Date (langBytesFirst.filter(obj => obj.count === maxCount)[0].pushed_at),
    dateFormatter = d3.timeFormat('%B %e')
    countFormatter = d3.format(',.3r')

  let captionTarget = document.getElementById('for_svg')
  let svgOutlierNote = document.createElement('div')
  svgOutlierNote.classList.add('div_svg_caption')
  svgOutlierNote.innerHTML = `
    <p class="c_above caption">There was a single outlier datapoint that is not shown in the scatter plot above. The ${otLrLang} counts for the project, ${otLrName} (the code for this site) are too far outside the range of databytes stored for the other project languages. To see other language data points for this project, look at data aligned with ${dateFormatter(otLrDate)}.
    </p>
    <p class="c_above caption">
    The ${otLrLang} byte count for ${otLrName} is around ${countFormatter(maxCount)} bytes.
     </p>`
  captionTarget.appendChild(svgOutlierNote)
})
