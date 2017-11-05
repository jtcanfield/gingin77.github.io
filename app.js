let spans = document.getElementsByClassName('hamburger')

function menuOpen () {
  document.getElementById('side_bar').style.width = '20vw'
  document.getElementById('main').style.marginLeft = '20vw'
  for (let i = 0; i < spans.length; i++) {
    spans[i].style.visibility = 'hidden'
  }
}

function menuClose () {
  document.getElementById('side_bar').style.width = '0'
  document.getElementById('main').style.marginLeft = '0'
  for (let i = 0; i < spans.length; i++) {
    spans[i].style.visibility = 'visible'
  }
}

// document.getElementById('nav')
// let hamburgerMenu =
// hamburger.addEventListener(click, toggleSideBar())
