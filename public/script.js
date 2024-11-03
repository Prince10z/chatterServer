var resCon = document.createElement('li');
resCon.id = "resCon";
var resultCon = document.getElementById("resultCon");
const joinroombtn = document.getElementById("joinBtn");
var historymsgs = document.getElementById("HistoryMsg");
var socket;
var usernameexist = true;
const room = document.getElementById("roomname");
// typing content & msg Input
var chatroomtitle = document.getElementById("chatroomname");
var typingContent = document.getElementById("typingColumn");
var msgInput = document.getElementById("msg");
var msgicon = document.getElementById("msgicon");
async function hideAuthScreen(show) {
    if (show == false) {
        document.getElementById("AuthContainer").style.display = "none";
    }
}

async function showchatroom(show) {
    if (show == false) {
        document.getElementById("ChatRoom").style.display = "none";
    } else {
        document.getElementById("ChatRoom").style.display = "block";
    }
}
var roomname = "sam";
var username = "Piyush";
var typingTimer;
async function joinroom() {
    var goterror = false;
    roomname = room.value.trim();
    username = document.getElementById('username').value.trim();
    if (usernameexist === true) {
        alert("please enter valid username")
    } else if (roomname == "" || roomname.length < 3) {
        alert("Room name should be of minimum 3 letters")
    } else {
        socket = io();
        await socket.on("connect", () => {
            console.log(`this is connected to socket with socket id ${socket.id}`);
        })
        await socket.on(`error-${socket.id}`, (data) => {
            goterror = true;
            alert(data);
        })
        await socket.on(`result-${socket.id}`, (res) => {
            alert(res);
        })
        await socket.emit("join-room", { roomId: roomname, socketID: socket.id, username: username });

        if (goterror == false) {
            chatroomtitle.innerText = `Chatroom name: ${roomname}`;
            hideAuthScreen(false);
            showchatroom(true);
            socket.on(`${roomname}typing`, (data) => {
                typingContent.innerText = data;
                clearTimeout(typingTimer);

                // Set a new timer to reset typingContent after a period of inactivity
                typingTimer = setTimeout(() => {
                    typingContent.innerText = '';
                }, 2000);
                typingTimer;
            })
            socket.on(roomname, (data) => {
                const receiverdiv = createreciverDiv(data.user, data.message);
                historymsgs.appendChild(receiverdiv);
                receiverdiv.scrollIntoView({ behavior: 'smooth' });
            })
            socket.on(`${roomname}-join`, (data) => {
                const addeduser = createAddingUserDiv(data);
                historymsgs.appendChild(addeduser);
                addeduser.scrollIntoView({ behavior: 'smooth' });
            })


        }
    }
}
function createsenderDiv(data) {
    // Create the main container
    const rightDiv = document.createElement('div');
    rightDiv.classList.add('right-div');

    // Create the message container
    const senderMsgDiv = document.createElement('div');
    senderMsgDiv.classList.add('sendermsg');
    rightDiv.appendChild(senderMsgDiv);

    // Create the message label
    const msgLabelDiv = document.createElement('div');
    msgLabelDiv.classList.add('msgLebel');
    msgLabelDiv.textContent = 'me:';
    senderMsgDiv.appendChild(msgLabelDiv);

    // Create the message text
    const messageText = document.createTextNode(data);
    senderMsgDiv.appendChild(messageText);

    return rightDiv;

}
function createAddingUserDiv(data) {
    const AddUserDiv = document.createElement('div');
    AddUserDiv.classList.add('addedUser-div');

    // Create the message container
    const addedUserMsgDiv = document.createElement('div');
    addedUserMsgDiv.classList.add('addedUsermsg');
    AddUserDiv.appendChild(addedUserMsgDiv);


    // Create the message text
    const messageText = document.createTextNode(data);
    addedUserMsgDiv.appendChild(messageText);

    return AddUserDiv;

}
function createreciverDiv(username, data) {
    const leftDiv = document.createElement('div');
    leftDiv.classList.add('left-div');

    const receiverMsgDiv = document.createElement('div');
    receiverMsgDiv.classList.add('recievermsg');
    leftDiv.appendChild(receiverMsgDiv);

    const msgLabelDiv = document.createElement('div');
    msgLabelDiv.classList.add('msgLebel');
    msgLabelDiv.textContent = username;
    receiverMsgDiv.appendChild(msgLabelDiv);

    const messageText = document.createTextNode(data);
    receiverMsgDiv.appendChild(messageText);

    return leftDiv;

}
joinroombtn.addEventListener("click", () => {
    joinroom()
})
msgInput.addEventListener('keydown', (event) => {
    socket.emit("typing", { groupname: roomname, username: username });
    if (event.key == "Enter") {
        // console.log(event.target.value.trim());

        const innermsg = event.target.value.trim();
        if (innermsg !== "") {
            const senderdiv = createsenderDiv(innermsg);
            historymsgs.appendChild(senderdiv);
            senderdiv.scrollIntoView({ behavior: 'smooth' });
            msgInput.value = "";
            socket.emit("chatmsg", { groupname: roomname, username: username, msg: innermsg });
        }

    }
})
msgicon.addEventListener("click", () => {
    console.log("hey there");
    const innermsg = msgInput.value.trim();
    if (innermsg !== "") {
        const senderdiv = createsenderDiv(innermsg);
        historymsgs.appendChild(senderdiv);
        senderdiv.scrollIntoView({ behavior: 'smooth' });
        msgInput.value = "";
        socket.emit("chatmsg", { groupname: roomname, username: username, msg: innermsg });
    }
})
async function checkingusername(name) {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    const urlencoded = new URLSearchParams();
    urlencoded.append("username",
        name);

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: urlencoded,
        redirect: "follow"
    };

    try {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

        const urlencoded = new URLSearchParams();
        urlencoded.append("username", name);

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: urlencoded,
            redirect: "follow"
        };

        return await fetch("http://localhost:3000/api/checkuser", requestOptions)
            .then((response) => response.text())
            .then(async (result) => {
                // console.log(result);
                result = await JSON.parse(result);
                if (result['status'] === "success") {
                    resCon.style.color = "green";
                    usernameexist = false;
                } else {
                    resCon.style.color = "red";
                    usernameexist = true;
                }
                return result['msg'];
            }
            )
            .catch((error) => {
                // console.error('Error:', error);
                usernameexist = true;
                resCon.style.color = "red";
                return `You are facing an error.`;
            });

    } catch (error) {
        // console.error('Error:', error);
        resCon.style.color = "red";
        return `You are facing an error.`;
    }
}
const userinput = document.getElementById("username");
userinput.addEventListener('input', async (event) => {
    const usernamevalue = event.target.value;
    var result = '';
    if (usernamevalue.trim() === "") {
        usernameexist = true;
        resCon.style.color = "red";
        result = "username is required";
    }
    else if (usernamevalue.trim().length < 3) {
        usernameexist = true;
        resCon.style.color = "red";
        result = "username minimum length of 3 is required";
    } else {
        result = await checkingusername(usernamevalue);
    }

    resCon.textContent = result;
    resultCon.appendChild(resCon);
})