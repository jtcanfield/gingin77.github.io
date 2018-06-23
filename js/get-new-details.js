// send new fetch requests, then reorganize fetched data
export async function getNewRepoDetails(urls, repos) {
  try {
    let newDetailsFromGitHub = await mapUrls(requestUrls);
    let newAndOldDetailsCombined = await combineNewAndOldDetails(repos, newDetailsFromGitHub);
    console.log(newAndOldDetailsCombined);

  } catch (e) {
    console.log(e);
  }
}

async function mapUrls(urls) {
  let details = []
  urls.forEach(url => {
    d3.json(url).then(data => {
      let repoInfo = {};
      repoInfo.url_for_all_repo_langs = url;
      repoInfo.all_lang_bytes_for_repo = data;
      details.push(repoInfo);
    });
  });
  return details
}

function combineNewAndOldDetails(general, specific) {
  console.log(specific)
  console.log(general)
  let generalAndSpecificCombined = {}
  let arrayOfObjects             = []

  general.map(function (g) {
    specific.map(function (s) {
      console.log(s)
      if (g.url_for_all_repo_langs === s.url_for_all_repo_langs) {
        generalAndSpecificCombined = {
          repo_name:               g.repo_name,
          url_for_all_repo_langs:  g.url_for_all_repo_langs,
          primary_repo_lang:       g.primary_repo_lang,
          created_at:              g.created_at,
          pushed_at:               g.pushed_at,
          all_lang_bytes_for_repo: s.all_lang_bytes_for_repo
        }
        arrayOfObjects.push(generalAndSpecificCombined)
      }
    })
  })
  return arrayOfObjects;
}

function transformLangObj(myData) {
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
  // makeBytesFirst(comprehensiveObjArr)
}

let newDataObjsArr = []

function makeBytesFirst(myData) {
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
}