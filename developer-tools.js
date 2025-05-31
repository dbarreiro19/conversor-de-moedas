const developerTools = [
    {name: "Flaticon", link: "", title: ""},
    {name: "Freepik", link: "", title: ""},
    {name: "Google Fonts", link: "", title: ""},
    {name: "Coolors", link: "", title: ""},
    {name: "AwesomeAPI", link: "", title: ""},
    {name: "VSCode", link: "", title: ""},
    {name: "Google Chrome", link: "", title: ""},
    {name: "ColorZilla", link: "", title: ""},
    {name: "Git", link: "", title: ""},
    {name: "GitHub", link: "", title: ""}
]

for (let x = 0; x < developerTools.length; x++) {
    const a = document.createElement("a")
    a.textContent = developerTools[x].name
    a.setAttribute("href", developerTools[x].link)
    a.setAttribute("title", developerTools[x].title)
    a.setAttribute("target", "_blank")
    document.getElementById("developer-tools").appendChild(a)
}