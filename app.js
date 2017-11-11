//  If media queries, then??
// Items removed on small devices:
// From nav bar, no:
// Home, Connect, logo, check which resume link to keep
// Remove margin left on sections where it gets added....
// let lWidth = window.screen.width

window.addEventListener('resize', adjustIfNeeded)
let viewportWidth = window.innerWidth
console.log('screen width ' + viewportWidth)
if (viewportWidth <= 500) {
  adjustForSmallVP()
} else {
  console.log('no adjustment needed')
}

function adjustIfNeeded () {
  viewportWidth = window.innerWidth
  if (viewportWidth <= 500) {
    adjustForSmallVP()
  } else {
    console.log('no adjustment needed')
  }
}

function adjustForSmallVP () {
  let elsToRemove = document.getElementsByClassName('removeOnMobile')
  console.log(elsToRemove)
  for (let i = elsToRemove.length - 1; i >= 0; i--) {
    elsToRemove[i].remove()
  }
}

let loader = document.getElementById('loader')
let contents = document.getElementById('contents')

document.onreadystatechange = function () {
  var state = document.readyState
  console.log(state)
  if (state === 'interactive') {
    loader.classList.add('fadeIn')
    contents.classList.add('fadeOut')
  } else if (state === 'complete') {
    setTimeout(function () {
      document.getElementById('interactive')
      loader.classList.remove('fadeIn')
      loader.classList.add('fadeOut')
      loader.remove()
      showContents()
    }, 500)
  }
}

function showContents () {
  setTimeout(function () {
    contents.classList.remove('fadeOut')
    contents.classList.add('fadeIn')
  }, 100)
}

let sideBar = document.getElementById('side_bar')
let main = document.getElementById('main')
let hamburger = document.getElementById('hamburger')
let footer = document.getElementById('footer')
// let message = document.getElementById('about_centered')

function menuOpen () {
  sideBar.setAttribute('style', 'width:180px;')
  // 'max-width: 200px; width:24vw; min-width: 160px;'
  main.style.marginLeft = '180px'
  footer.style.marginLeft = '180px'
  // message.style.marginLeft = '90px'
  hamburger.style.visibility = 'hidden'
}

function menuClose () {
  sideBar.setAttribute('style', 'width:0')
  main.style.marginLeft = '0'
  footer.style.marginLeft = '0'
  // message.style.marginLeft = '0'
  hamburger.style.visibility = 'visible'
}


// for (let i = 0; i < spans.length; i++) {
//   spans[i].style.visibility = 'hidden'
// }

// for (let i = 0; i < spans.length; i++) {
//   spans[i].style.visibility = 'visible'
// }
