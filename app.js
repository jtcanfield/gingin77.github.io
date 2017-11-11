window.addEventListener('resize', adjustIfNeeded)
let viewportWidth = window.innerWidth

let loader = document.getElementById('loader')
let contents = document.getElementById('contents')

document.onreadystatechange = function () {
  var state = document.readyState
  if (viewportWidth > 500) {
    if (state === 'interactive') {
      loader.classList.add('fadeIn')
      contents.classList.add('fadeOut')
    } else if (state === 'complete') {
      setTimeout(function () {
        loader.classList.remove('fadeIn')
        loader.classList.add('fadeOut')
        showContents()
        loader.remove()
      }, 500)
    }
  } else {
    adjustForSmallVP()
    loader.remove()
  }
}

function adjustIfNeeded () {
  viewportWidth = window.innerWidth
  if (viewportWidth <= 500) {
    loader.remove()
    adjustForSmallVP()
  } else {
    console.log('no adjustment needed')
  }
}

function showContents () {
  setTimeout(function () {
    contents.classList.remove('fadeOut')
    contents.classList.add('fadeIn')
  }, 100)
}

function adjustForSmallVP () {
  rmElsForMob()
  adjPhotoMob()
  addFooterStysMob()
  modResMob()
}

function modResMob () {
  let parent = document.getElementsByTagName('ul')[0]
  let resume = document.getElementsByTagName('dt')[0]
  resume.innerHTML = '<a href="public/G.Hench_Resume_Nov.pdf" download>Resume <i class="fa fa-file-pdf-o" aria-hidden="true"></i></a>'
  parent.appendChild(resume)
  let dlEl = document.getElementsByTagName('dl')[0]
  if (dlEl !== undefined) {
    dlEl.remove()
  }
}

function rmElsForMob () {
  let elsToRemove = document.getElementsByClassName('removeOnMobile')
  for (let i = elsToRemove.length - 1; i >= 0; i--) {
    elsToRemove[i].remove()
  }
}

function addFooterStysMob () {
  let footerEl = document.getElementById('footer')
  footerEl.classList.add('footer_mobile')
}

function adjPhotoMob () {
  let imageHolder = document.getElementById('image_holder')
  imageHolder.classList.remove('image_holder')
  imageHolder.classList.add('image_holder_mob')
}

let sideBar = document.getElementById('side_bar')
let main = document.getElementById('main')
let hamburger = document.getElementById('hamburger')
let footer = document.getElementById('footer')

function menuOpen () {
  sideBar.setAttribute('style', 'width:180px;')
  main.style.marginLeft = '180px'
  footer.style.marginLeft = '180px'
  hamburger.style.visibility = 'hidden'
}

function menuClose () {
  sideBar.setAttribute('style', 'width:0')
  main.style.marginLeft = '0'
  footer.style.marginLeft = '0'
  hamburger.style.visibility = 'visible'
}
