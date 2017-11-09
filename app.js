document.onreadystatechange = function () {
  var state = document.readyState
  console.log(state)
  if (state === 'interactive') {
    document.getElementById('loader').classList.add('fadeIn')
    document.getElementById('contents').classList.add('fadeOut')
  } else if (state === 'complete') {
    setTimeout(function () {
      document.getElementById('interactive')
      document.getElementById('loader').classList.remove('fadeIn')
      document.getElementById('loader').classList.add('fadeOut')
      showContents()
    }, 500)
  }
}

function showContents () {
  setTimeout(function () {
    document.getElementById('contents').classList.remove('fadeOut')
    document.getElementById('contents').classList.add('fadeIn')
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
