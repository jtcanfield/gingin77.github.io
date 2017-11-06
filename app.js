let sideBar = document.getElementById('side_bar')
let main = document.getElementById('main')
let hamburger = document.getElementById('hamburger')
let footer = document.getElementById('footer')
let message = document.getElementById('fixed_message')

function menuOpen () {
  sideBar.setAttribute('style', 'width:180px;')
  // 'max-width: 200px; width:24vw; min-width: 160px;'
  main.style.marginLeft = '180px'
  footer.style.marginLeft = '180px'
  message.style.marginLeft = '90px'
  hamburger.style.visibility = 'hidden'
}

function menuClose () {
  sideBar.setAttribute('style', 'width:0')
  main.style.marginLeft = '0'
  footer.style.marginLeft = '0'
  message.style.marginLeft = '0'
  hamburger.style.visibility = 'visible'
}


// for (let i = 0; i < spans.length; i++) {
//   spans[i].style.visibility = 'hidden'
// }

// for (let i = 0; i < spans.length; i++) {
//   spans[i].style.visibility = 'visible'
// }
