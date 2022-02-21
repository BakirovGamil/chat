const loginBtn = document.querySelector(".loginBtn");
if(loginBtn) {
    loginBtn.onclick = async function(e) {
        e.preventDefault();
        const user = {
            login: document.forms[0].elements["login"].value,
            password: document.forms[0].elements["password"].value,
        };

        const response = await fetch("/authorization/login", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(user),
        });

        const result = await response.json();
        addNote(result.message, response.ok);
        if(response.ok) {
            localStorage.setItem("name", result.name);
            window.location.href = "/chat.html";
        }
    };
}
    
const regBtn = document.querySelector(".regBtn");
if(regBtn) {
    regBtn.onclick = async function(e) {
        e.preventDefault();
        const user = {
            login: document.forms[0].elements["login"].value,
            password: document.forms[0].elements["password"].value,
        };

        const response = await fetch("/authorization/registration", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(user),
        });

        const result = await response.json();
        addNote(result.message, response.ok);
        setTimeout(() => {
            if(response.ok) {
                window.location.href = "/";
            }
        }, 2000);  
    };
}

function addNote(message, status) {
    const prevNote = document.querySelector(".note");
    if(prevNote) {
        clearTimeout();
        prevNote.remove();
    }

    const note = document.createElement("div");
    const form = document.forms[0];
    const formRect = form.getBoundingClientRect();

    note.className = status? "note n-success": "note n-danger";
    note.textContent = message;
    note.style.width = form.offsetWidth + "px";
    document.body.prepend(note);

    note.style.top = formRect.top - note.offsetHeight - 10 + "px";
    note.style.left = formRect.left + "px";

    setTimeout(function() {
        note.remove();
    }, 10000);
}