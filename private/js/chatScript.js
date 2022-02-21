document.addEventListener("click", async (e) => {
    const elem = e.target;
    if(!elem.classList.contains("logout")) return false;

    const response = await fetch("./authorization/logout");

    if(response.ok) {
        localStorage.removeItem("name");
        window.location.href = "/";
    }
});

const divName = document.querySelector(".nav__name");
divName.textContent = localStorage.getItem("name");

const preloader = document.querySelector(".preloader");
preloader.remove();