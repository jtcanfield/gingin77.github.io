// send requests for language details for new and updated repos,
// then reorganize fetched data

export async function getNewRepoDetails(urls, repos) {
  try {
    let newDetailsFromGitHub         = await requestLanguageDetailsFromGitHub(urls);
    let generalRepoInfoandNewDetails = combine(repos, newDetailsFromGitHub);
    let arrayOfRepoObjects           = getTransformedCombinationObject(generalRepoInfoandNewDetails);
    let arrayOfLanguageObjects       = makeOneObjectForEveryRepoLanguage(arrayOfRepoObjects);
    
    return arrayOfLanguageObjects;
  } catch (e) {
    console.log(e);
  }
}

async function requestLanguageDetailsFromGitHub(urls) {
  const details = await Promise.all(
    urls.map(url => d3.json(url).then(data => {
      return {
        url_for_all_repo_langs: url,
        all_lang_bytes_for_repo: data
      }
    }))
  )

  return details
}

function combine(general, specific) {
  let generalRepoInfoandNewDetails = general.map(g => {
    let details = specific.filter(s => {
     return s.url_for_all_repo_langs == g.url_for_all_repo_langs
    })

    return {
      repo_name:               g.repo_name,
      url_for_all_repo_langs:  details[0].url_for_all_repo_langs,
      primary_repo_lang:       g.primary_repo_lang,
      created_at:              g.created_at,
      pushed_at:               g.pushed_at,
      all_lang_bytes_for_repo: details[0].all_lang_bytes_for_repo
    }
  })

  return generalRepoInfoandNewDetails;
}

function getTransformedCombinationObject(generalRepoInfoandNewDetails) {
  let transformed = generalRepoInfoandNewDetails.map(repo => {
      let arrayOfLanguageObjects = [];

      Object.keys(repo.all_lang_bytes_for_repo).forEach(key => {
        let newKeyValuePairs = {
          language: key,
          count: repo.all_lang_bytes_for_repo[key]
        };
        arrayOfLanguageObjects.push(newKeyValuePairs);
      });
      repo.all_lang_bytes_for_repo = arrayOfLanguageObjects;

      return repo;
    }
  );

  return transformed;
}

function makeOneObjectForEveryRepoLanguage(arrayOfRepoObjects) {
  const arrayOfLanguageObjects = []

  arrayOfRepoObjects.map(repObj => {
    let bytObj = repObj.all_lang_bytes_for_repo

    if (bytObj.length !== 0) {
      bytObj.map(langByteObj => {
        arrayOfLanguageObjects.push({
          language:               langByteObj.language,
          count:                  langByteObj.count,
          repo_name:              repObj.repo_name,
          pushed_at:              repObj.pushed_at,
          primary_repo_lang:      repObj.primary_repo_lang,
          url_for_all_repo_langs: repObj.url_for_all_repo_langs
        })
      })
    } else {
      arrayOfLanguageObjects.push({
        language:               'Null',
        count:                  0,
        repo_name:              repObj.repo_name,
        pushed_at:              repObj.pushed_at,
        primary_repo_lang:      'na',
        url_for_all_repo_langs: repObj.url_for_all_repo_langs
      })
    }
  })

  return arrayOfLanguageObjects;
}