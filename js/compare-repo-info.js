export async function getGeneralRepoInfo() {
  try {
    let { apiData, oldStaticData } = await getData();
    let gitHubApiData = mapGitHubData(apiData)

    // sort inputs to identify new requests to perform & data to preserve
    let newRepos                   = findNewRepos(gitHubApiData, oldStaticData)
    let unchangedRepos             = findUnchangedRepos(gitHubApiData, oldStaticData)
    let updatedRepoLanguageObjects = findupdatedRepoLanguageObjects(oldStaticData, unchangedRepos)

    // identify urls to send fetch requests to
    let newRepoUrls     = getUrls(newRepos);
    let updatedRepoUrls = getUrls(updatedRepoLanguageObjects);
    let urlsToFetch     = organizeUrls(newRepoUrls, updatedRepoUrls);

    // preserve data from unchanged repos
    let tourifyStats      = findTourifyStats(oldStaticData);
    let allUnchangedRepos = keepTourifyStats(unchangedRepos, tourifyStats);

    // select general data state from updated repos
    let updatedRepos = selectGeneralData(gitHubApiData, updatedRepoLanguageObjects);

    let newAndUpdatedRepoBaseInfo = updatedRepos.concat(newRepos);

    return {
      unchangedRepos:            allUnchangedRepos,
      newAndUpdatedRepoBaseInfo: newAndUpdatedRepoBaseInfo,
      urlsToFetch:               urlsToFetch
    }
  } catch (e) {
    console.log(`I'm the message for getGeneralRepoInfo: ${e}`);
  }
}

async function getData() {
  try {
    const paths = [
      "https://api.github.com/users/gingin77/repos?per_page=100&page=1",
      "static_data/saved_repo_data_06022018.json"
    ];

    let resolved = await Promise.all(paths.map(path => d3.json(path)))
      .then(([apiData, oldStaticData]) => {
        return {
          apiData: apiData,
          oldStaticData: oldStaticData
        };
      });

    return resolved
  } catch (e) {
    console.log(`I'm the message for getData: ${e}`);
  }
}

function mapGitHubData(apiData) {
  let arrayOfRepoObjects = [];

  apiData.map(repo => {
    let r = {};

    r.repo_name              = repo.name;
    r.primary_repo_lang      = repo.language;
    r.url_for_all_repo_langs = repo.languages_url;
    r.created_at             = repo.created_at;
    r.pushed_at              = repo.pushed_at;

    arrayOfRepoObjects.push(r);
  });

  return arrayOfRepoObjects;
}

function findNewRepos(gitHubApiData, oldStaticData) {
  let unMatchedObjs = [];
  let existingRepos = oldStaticData.map(obj => obj.repo_name);

  gitHubApiData.forEach(function(repo) {
    if (existingRepos.indexOf(repo.repo_name) === -1) {
      unMatchedObjs.push(repo);
    }
  });
  return unMatchedObjs;
}

function findUnchangedRepos(gitHubApiData, oldStaticData) {
  let matchingRepoInfo = [];
  oldStaticData.forEach(function(saved) {
    gitHubApiData.filter(function(api) {
      if (
        new Date(saved.pushed_at).toString() ===
        new Date(api.pushed_at).toString()
      ) {
       matchingRepoInfo.push(saved);
      }
    });
  });
  return matchingRepoInfo;
}

function findupdatedRepoLanguageObjects(oldStaticData, unchangedRepos) {
  let updatedRepoLanguageObjects = [];
  oldStaticData.forEach(saved => {
    if (unchangedRepos.indexOf(saved) === -1) {
      updatedRepoLanguageObjects.push(saved);
    }
  });
  return updatedRepoLanguageObjects;
}

function selectGeneralData(gitHubApiData, repoLanguageObjects) {
  let updatedRepoNames = repoLanguageObjects.map(obj => obj.repo_name);
  updatedRepoNames = elimateDuplicates(updatedRepoNames).filter(name => name != "tourify_rr");

  return updatedRepoNames.map(name => {
    return gitHubApiData.find(repo => repo.repo_name === name);
  });
}

function getUrls(repos) {
  return repos.map(obj => obj.url_for_all_repo_langs);
}

function removeOrgUrl(upDtdUrls) {
  return upDtdUrls.filter(
    obj => obj !== "https://api.github.com/repos/Tourify/tourify_rr/languages"
  );
}

function elimateDuplicates(arr) {
  let obj = {};
  arr.forEach(i => (obj[i] = 0));

  return Object.keys(obj);
}

function organizeUrls(newRepoUrls, updatedRepoUrls) {
  let urlsMinusTourify   = removeOrgUrl(updatedRepoUrls);
  let urlsWithDuplicates = newRepoUrls.concat(urlsMinusTourify);

  return elimateDuplicates(urlsWithDuplicates);
}

function findTourifyStats(oldStaticData) {
  return oldStaticData.filter(
    obj =>
      obj.url_for_all_repo_langs ===
      "https://api.github.com/repos/Tourify/tourify_rr/languages"
  );
}

function keepTourifyStats(unchangedRepos, tourifyStats) {
  return unchangedRepos.concat(tourifyStats);
}