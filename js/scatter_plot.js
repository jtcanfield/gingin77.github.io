let repoPrimryLang = []
let arOfRepoObjs = []
let existingArray = []

// Call function to draw scatter plot which will use data stored within the app
drawScatterPlot()

// Retrieve data and initiate comparison with data requested from external API
d3.json('static_data/updatedCompObj_12_2.json', function (error, data) {
  if (error) {
    return console.warn(error)
  }
  existingArray = data
  evalIfArrysNotNull(arOfRepoObjs, existingArray)
})

// Request data from single endpoint in GitHub API, arrange data into object and compare new data objects with existing data objects
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

// Function evaluates whether both arrays have contents
function evalIfArrysNotNull () {
  if (arOfRepoObjs.length !== 0 && existingArray.length !== 0) {
    findNewRepos(arOfRepoObjs, existingArray)
    findUpdatedRepos(arOfRepoObjs, existingArray)
  }
}

let newRepoUrlsToFetch = []
let existingObjsToKeep = []
let updatedRepoUrlsToFetch = []

let findNewReposComplete = false
let getURLsForUpdtdReposComplete = false

let combinedArr = []

// Check to see is the first request retrieved new Repos that are NOT in existing dataset
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

// Check to see if push dates differ; if the dates do not differ, 1) store objects with matching dates to existingObjsToKeep AND 2) Call the function getURLsForUpdtdRepos and pass the array, 'matchedObjs'
function findUpdatedRepos (newArray, existingArray) {
  let matchedObjs = []
  existingArray.forEach(function (existObj) {
    newArray.filter(function (newArObj) {
      if (new Date(existObj.pushed_at).toString() === new Date(newArObj.pushed_at).toString()) {
        matchedObjs.push(existObj)
      }
    })
  })
  existingObjsToKeep = matchedObjs
  getURLsForUpdtdRepos(matchedObjs)
}

// To enrich for objects from updated repos, keep objects from the existing array that do NOT exist in the array passed to the function, the matchedObjs array
function getURLsForUpdtdRepos (arr) {
  let updatedObjsToFetch = []
  existingArray.forEach(function (existObj) {
    if (arr.indexOf(existObj) === -1) {
      updatedObjsToFetch.push(existObj)
    }
  })
  let UpdtdUrls = updatedObjsToFetch.map((obj) => obj.url_for_all_repo_langs)
  updatedRepoUrlsToFetch = elimateDuplicates(UpdtdUrls)
  getURLsForUpdtdReposComplete = true
  compileURLsToFetch(newRepoUrlsToFetch, updatedRepoUrlsToFetch)
}

function elimateDuplicates (arr) {
  let outPut = []
  let obj = {}
  arr.forEach(i => obj[i] = 0)
  for (item in obj) { outPut.push(item) }
  return outPut
}

// Combine URLs for new repos and URLs with new pushed_at dates into a single array
function compileURLsToFetch (newRepoUrlsToFetch, updatedRepoUrlsToFetch) {
  if (findNewReposComplete === true && getURLsForUpdtdReposComplete === true) {
    combinedArr = newRepoUrlsToFetch.concat(updatedRepoUrlsToFetch)
    splitArryToURLs(combinedArr)
  }
}

// Pass urls from array to next fetch function one at a time
function splitArryToURLs (array) {
   for (let i = 0; i < array.length; i++) {
     let url = array[i]
     getLanguageBytes(url)
   }
 }

// As the language byte data for each repo is retreived, it all goes into the array, langBytesAryofObjs
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

// combinedArr is the array with all URLs to fetch. Once the array to hold new repo language data is the same size as 'combinedArr', then the next function can be called
function evalLangBytArrStatus () {
  if (langBytesAryofObjs.length === combinedArr.length) {
    buildComprehensiveObj(arOfRepoObjs, langBytesAryofObjs)
  }
}

// The next array and function integrate data from the first request (which gets data about all project repos) with data from the request that gets language byte data for each unique repo
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

// Use language and count as keys, instead of " 'language': 'count' " as the key:value pairs
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

// Restructure array of objects. Instead of one object per repository, establish one object for every set of language byte counts for each reposity
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
  // console.log(newDataObjsArr)
  // console.log(`newDataObjsArr length: ${newDataObjsArr.length}`)
  combineNewWithExistingObjs(newDataObjsArr, existingObjsToKeep)
}

// Once the newly requested data has been processed using the functions above, these new objects need to be combined with the existing data objects (upadated repos were already removed earlier on)
let updatedCompObj = []
let combineNewWithExistComplete = false

function combineNewWithExistingObjs (newDataObjsArr, existingObjsToKeep) {
  updatedCompObj = existingObjsToKeep.concat(newDataObjsArr)
  combineNewWithExistComplete = true
  drawScatterPlot()
}

// Finally, after the new data has been processed and then added into an array with the existing data objects, a single array of objects can be passed to d3 so that the scatter plot can be rendered
function drawScatterPlot () {
  evaluateIfSVG()

  // Since the function is called twice (once at very beginning before requests are sent to the API and again after the new data has been combined with the existing data, it is necessary to check whether the SVG has already been added to the DOM)
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

    // if new data is available (in the variable 'updatedCompObj'), it will be used in place of the existing data stored as 'data' and coming from the static_data/langBytesFirst.json
    function evalDataSetForD3 (data, combineNewWithExistComplete) {
      if (combineNewWithExistComplete) {
        myData = updatedCompObj
      } else {
        myData = data
      }
    }

    function strToDtSingle (d) {
      return new Date(d)
    }

    let sortbyDate = d3.nest()
      .key(function (d) {
        return d.pushed_at
      })
      .sortKeys(d3.ascending)
      .entries(myData)

    let minDate = new Date(sortbyDate[0].key),
      maxDate = new Date(sortbyDate[sortbyDate.length - 1].key),
      xMax = new Date(maxDate).addWeeks(1),
      xMin = new Date(minDate).addWeeks(-1)

    let margin = {
        top: 10,
        right: 56,
        bottom: 40,
        left: 8
      },
      width = 600 - margin.left,
      height = 340 - margin.top - margin.bottom

    // setup x
    let xScale = d3.scaleTime().domain([xMin, xMax]).range([margin.right, width - margin.left]),
      xValue = function (d) { return xScale(strToDtSingle(d.pushed_at)) },
      xAxis = d3.axisBottom(xScale).ticks(d3.timeWeek.every(2)).tickFormat(d3.timeFormat('%b %e'))

    // setup y
    let yScale = d3.scaleLinear().domain([0, 72000]).range([height - 2, 0]),
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
      .attr('y', (-1 * margin.right + 6))
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
    let tooltip = d3.select('body')
      .append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0)

    // draw dots
    svg.selectAll('dot')
      .data(myData)
      .enter()
      .append('circle')
      .attr('r', 4.5)
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
