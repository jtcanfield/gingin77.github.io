let sideBar = document.getElementById('side_bar')
let main = document.getElementById('main')
let hamburger = document.getElementById('hamburger')

function menuOpen () {
  sideBar.setAttribute('style', 'width:180px;')
  // 'max-width: 200px; width:24vw; min-width: 160px;'
  main.style.marginLeft = '180px'
  hamburger.style.visibility = 'hidden'
}

function menuClose () {
  sideBar.setAttribute('style', 'width:0')
  main.style.marginLeft = '0'
  hamburger.style.visibility = 'visible'
}


// for (let i = 0; i < spans.length; i++) {
//   spans[i].style.visibility = 'hidden'
// }

// for (let i = 0; i < spans.length; i++) {
//   spans[i].style.visibility = 'visible'
// }
