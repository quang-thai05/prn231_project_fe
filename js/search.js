const icon = document.querySelector(".icon")
const search = document.querySelector(".search")
const mysearch = document.querySelector("#mysearch")
const clear = document.querySelector(".clear")

icon.onclick = () => search.classList.toggle('active')

clear.onclick = () => mysearch.value = ''