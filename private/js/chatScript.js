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

const upContainer = document.querySelector(".up .container");
upContainer.style.height = document.querySelector(".up").clientHeight;

const friendBtn = document.querySelector(".btn-friends");
friendBtn.addEventListener("click", (e) => {
    window.location.href = "/friends";
});

const findBtn = document.querySelector(".form-friends__find-btn");
if(findBtn)
    findBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        const response = await fetch("friends/find", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
                },
            body: JSON.stringify({
                login: document.forms["form-friends"].elements["form-friends__login"].value
            })
        });


        const jsonResp = await response.json();
        const li = document.createElement("li");
        
        const friendsList = document.querySelector(".frieds__list");
        for(let li of friendsList.querySelectorAll("li")) {
            li.remove();
        }

        if(response.ok) {
            const span = document.createElement("span");
            span.textContent = jsonResp.login;
            span.className = "friends__name";
            li.append(span);
            const button = document.createElement("button");
            button.className = "friends__message";
            button.textContent = "Написать";
            li.append(button);
        } else {
            li.textContent = jsonResp.message;
        }

        friendsList.append(li);
    });

document.addEventListener("click", (e) => {
    const target = e.target;
});

const preloader = document.querySelector(".preloader");
preloader.remove();

const socket = io();
document.addEventListener("click", (e) => {
    if(!(e.target.tagName == "BUTTON" && e.target.classList.contains("friends__message"))) return;
    
    socket.emit("joinroom", e.target.previousElementSibling.textContent);
    socket.on("message", (data) => console.log(data));
});