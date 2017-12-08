let repoPrimryLang = []
let arOfRepoObjs = []
let existingArray = []

drawScatterPlot()

d3.json('static_data/updatedCompObj_12_2.json', function (error, data) {
  if (error) {
    return console.warn(error)
  }
  existingArray = data
  keepOrgRepoObjs(existingArray)
  evalIfArrysNotNull(arOfRepoObjs, existingArray)
})

d3.json('https://api.github.com/users/gingin77/repos?per_page=100&page=1', function (error, dataObj) {
  if (error) {
    return console.warn(error)
  }
  dataObj.map(function (item) {
    let langObj = {}
    langObj.repo_name = item.name
    langObj.primary_repo_lang = item.language
    langObj.url_for_all_repo_langs = item.languages_url
    langObj.created_at = item.created_at
    langObj.pushed_at = item.pushed_at

    arOfRepoObjs.push(langObj)

    repoPrimryLang.push(item.language)
  })
  evalIfArrysNotNull(arOfRepoObjs, existingArray)
})

function evalIfArrysNotNull () {
  if (arOfRepoObjs.length !== 0 && existingArray.length !== 0) {
    findNewRepos(arOfRepoObjs, existingArray)
    findDateMatchedRepos(arOfRepoObjs, existingArray)
  }
}

let newRepoUrlsToFetch = []
let existingObjsToKeep = []
let orgObjs = []
let existingObjsToKeepWiOrgObjs = []
let updatedRepoUrlsToFetch = []

let keptOrgObjsComplete = false
let findNewReposComplete = false
let getURLsForUpdtdReposComplete = false

let combinedArr = []

function findNewRepos (newArray, existingArray) {
  let unMatchedObjs = []
  let existingRepos = existingArray.map(obj => obj.repo_name)
  newArray.forEach(function (obj) {
    if (existingRepos.indexOf(obj.repo_name) === -1) {
      unMatchedObjs.push(obj)
    }
  })
  newRepoUrlsToFetch = unMatchedObjs.map((obj) => obj.url_for_all_repo_langs)
  findNewReposComplete = true
  compileURLsToFetch(newRepoUrlsToFetch, updatedRepoUrlsToFetch)
}

function findDateMatchedRepos (newArray, existingArray) {
  let matchedObjs = []
  existingArray.forEach(function (existObj) {
    newArray.filter(function (newArObj) {
      if (new Date(existObj.pushed_at).toString() === new Date(newArObj.pushed_at).toString()) {
        matchedObjs.push(existObj)
      }
    })
  })
  existingObjsToKeep = matchedObjs
  combineOrgAndExisToKeep(orgObjs, existingObjsToKeep)
  getURLsForUpdtdRepos(matchedObjs)
}

function keepOrgRepoObjs (existingArray) {
  orgObjs = existingArray.filter(obj => obj.url_for_all_repo_langs === 'https://api.github.com/repos/Tourify/tourify_rr/languages')
  combineOrgAndExisToKeep(orgObjs, existingObjsToKeep)
}

function combineOrgAndExisToKeep (orgObjs, existingObjsToKeep) {
  if (orgObjs.length !== 0 && existingObjsToKeep.length !== 0) {
    existingObjsToKeepWiOrgObjs = existingObjsToKeep.concat(orgObjs)
    keptOrgObjsComplete = true
  }
}

function getURLsForUpdtdRepos (matchedObjs) {
  let updatedObjsToFetch = []
  existingArray.forEach(function (existObj) {
    if (matchedObjs.indexOf(existObj) === -1) {
      updatedObjsToFetch.push(existObj)
    }
  })
  let upDtdUrls = updatedObjsToFetch.map((obj) => obj.url_for_all_repo_langs)
  let upDtdUrlsMinusOrgs = removeOrgUrl(upDtdUrls)
  updatedRepoUrlsToFetch = elimateDuplicates(upDtdUrlsMinusOrgs)
  getURLsForUpdtdReposComplete = true
  compileURLsToFetch(newRepoUrlsToFetch, updatedRepoUrlsToFetch)
}

function removeOrgUrl (upDtdUrls) {
  upDtdUrls = upDtdUrls.filter(obj => obj !== 'https://api.github.com/repos/Tourify/tourify_rr/languages')
  return upDtdUrls
}

function elimateDuplicates (arr) {
  let outPut = []
  let obj = {}
  arr.forEach(i => obj[i] = 0)
  for (item in obj) { outPut.push(item) }
  return outPut
}

function compileURLsToFetch (newRepoUrlsToFetch, updatedRepoUrlsToFetch) {
  if (findNewReposComplete === true && getURLsForUpdtdReposComplete === true) {
    combinedArr = newRepoUrlsToFetch.concat(updatedRepoUrlsToFetch)
    splitArryToURLs(combinedArr)
  }
}

function splitArryToURLs (array) {
  array.forEach(function (item) {
    let url = item
    getLanguageBytes(url)
  })
}

let langBytesAryofObjs = []
function getLanguageBytes (url) {
  fetch(url)
    .then(function (response) {
      if (response.status !== 200) {
        console.log(response.status)
        return
      }
      response.json().then(function (data) {
        let repoInfo = {}
        repoInfo.url_for_all_repo_langs = url
        repoInfo.all_lang_bytes_for_repo = data
        langBytesAryofObjs.push(repoInfo)

        evalLangBytArrStatus(langBytesAryofObjs)
      })
    })
    .catch(function (err) {
      console.log('Fetch Error :-S', err)
    })
}

function evalLangBytArrStatus () {
  if (langBytesAryofObjs.length === combinedArr.length) {
    buildComprehensiveObj(arOfRepoObjs, langBytesAryofObjs)
  }
}

let comprehensiveObjArr = []
function buildComprehensiveObj (array1, array2) {
  let comprehensiveObj = {}
  array1.map(function (array1item) {
    let compare = array1item.url_for_all_repo_langs
    array2.map(function (array2item) {
      if (compare === array2item.url_for_all_repo_langs) {
        comprehensiveObj = {
          repo_name: array1item.repo_name,
          url_for_all_repo_langs: array1item.url_for_all_repo_langs,
          primary_repo_lang: array1item.primary_repo_lang,
          created_at: array1item.created_at,
          pushed_at: array1item.pushed_at,
          all_lang_bytes_for_repo: array2item.all_lang_bytes_for_repo
        }
        comprehensiveObjArr.push(comprehensiveObj)
      }
    })
  })
  transformLangObj(comprehensiveObjArr)
}

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
  makeBytesFirst(comprehensiveObjArr)
}

let newDataObjsArr = []
function makeBytesFirst (myData) {
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
  combineNewWithExistingObjs(newDataObjsArr, existingObjsToKeepWiOrgObjs)
}

let updatedCompObj = []
let combineNewWithExistComplete = false

function combineNewWithExistingObjs (newDataObjsArr, existingObjsToKeepWiOrgObjs) {
  if (keptOrgObjsComplete === true) {
    updatedCompObj = existingObjsToKeepWiOrgObjs.concat(newDataObjsArr)
    combineNewWithExistComplete = true
    drawScatterPlot()
  } else {
    console.log('combineNewWithExistingObjs condition was NOT met')
  }
}

function drawScatterPlot () {
  evaluateIfSVG()

  function evaluateIfSVG () {
    let existingSVG = document.getElementById('for_svg')
    if (existingSVG.hasChildNodes()) {
      existingSVG.innerHTML = ''
    }
  }

  d3.json('static_data/updatedCompObj_12_2.json', function (error, data) {
    if (error) {
      return console.warn(error)
    }

    let myData = []
    evalDataSetForD3(data, combineNewWithExistComplete)

    function evalDataSetForD3 (data, combineNewWithExistComplete) {
      if (combineNewWithExistComplete) {
        myData = updatedCompObj
        console.log('myData = updatedCompObj')
      } else {
        myData = data
        console.log('myData = data')
      }
    }

    let sortbyDate = d3.nest()
      .key(function (d) {
        return d.pushed_at
      })
      .sortKeys(d3.ascending)
      .entries(myData)

    let minDate = new Date(sortbyDate[0].key),
      maxDate = new Date(sortbyDate[sortbyDate.length - 1].key),
      xMin = new Date(minDate).addWeeks(-1),
      xMax = new Date(maxDate).addWeeks(1)

    function stringToDate (d) {
      return new Date(d)
    }

    let margin = {
        top: 10,
        right: 56,
        bottom: 40,
        left: 8
      },
      width = 600 - margin.left,
      height = 340 - margin.top - margin.bottom

    let xScale = d3.scaleTime().domain([xMin, xMax]).range([margin.right, width - margin.left]),
      xValue = function (d) { return xScale(stringToDate(d.pushed_at)) },
      xAxis = d3.axisBottom(xScale).ticks(d3.timeWeek.every(2)).tickFormat(d3.timeFormat('%b %e'))

    let yScale = d3.scaleLinear().domain([0, 76000]).range([height - 2, 0]),
      yValue = function (d) { return yScale(d.count) },
      yAxis = d3.axisLeft(yScale).tickFormat(d3.format('0.2s'))

    let svg = d3.select('#for_svg')
      .append('svg')
      .attr('width', width + margin.left)
      .attr('height', height + margin.top + margin.bottom)

    let g = svg.selectAll('g')

    svg.append('g')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis)
      .append('text')
      .attr('class', 'label')
      .attr('x', (width / 2) + 20)
      .attr('y', 40)
      .text('Date of Most Recent Commit')

    svg.append('g')
      .attr('transform', 'translate(' + margin.right + ', 0)')
      .call(yAxis)
      .append('text')
      .attr('class', 'label')
      .attr('transform', 'rotate(-90)')
      .attr('y', (-1 * margin.right + 6))
      .attr('x', 0 - (height / 2))
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .text('Number of Bytes Stored')

    let blue = '#457DB7',
      rubyred = '#991B67',
      purple = '#A99CCD',
      peach = '#E6AC93',
      grey = '#8F8F90',
      colorValue = function (d) { return d.language },
      colorScale = d3.scaleOrdinal()
        .domain(['JavaScript', 'Ruby', 'CSS', 'HTML', 'CoffeeScript', 'Shell', 'Null'])
        .range([blue, rubyred, purple, peach, grey, grey, grey])

    let tooltip = d3.select('body')
      .append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0)

    svg.selectAll('dot')
      .data(myData)
      .enter()
      .append('circle')
      .attr('r', 4.5)
      .attr('cx', xValue)
      .attr('cy', yValue)
      .style('fill', function (d) { return colorScale(colorValue(d)) })
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
      .domain(['JS', 'Ruby', 'CSS', 'HTML', 'Misc'])
      .range([blue, rubyred, purple, peach, grey])

    let legend = svg.selectAll('.legend')
      .data(lcolor.domain())
      .enter()
      .append('g')
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
  })
}
