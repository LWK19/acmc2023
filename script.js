var script = document.createElement('script');
script.src = 'https://code.jquery.com/jquery-3.6.0.min.js';
document.getElementsByTagName('head')[0].appendChild(script);

////////////////////////////////////////////////////////////////
//API.js

post({"method":"get_time", "token":"y2mibs1670nli594ehw16xd6vx6dwk3s", "timermode":"main"})
//CLOUDFLARE
async function post(payload){
    let url = "https://acmc2023-worker.lwk19.workers.dev/";
    //let url = "http://192.168.184.224:8787/";
            
    var req = await fetch( url, {
        method: "POST",
        headers: {
            "Access-Control-Request-Private-Network": "true",
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Headers': '*',
			'Access-Control-Allow-Methods': 'POST',
			'Access-Control-Allow-Origin': '*',
        },          
        body: JSON.stringify(payload)
    }).then( function (response){
        return response.json()
    }
    ).then(function (data){
        return data;
    })
    console.log(req.status);
}


async function login() {
    usern = document.getElementById("username").value.replace(/\s/g, '');
    pword = document.getElementById("password").value.replace(/\s/g, '');
    var resp = await post({'method':"login", 'id':usern, 'password':pword});
    if (resp.success) {
        //document.cookie = "username=" + usern + ";max-age=7200;path=/";
        //document.cookie = "password=" + pword + ";max-age=7200;path=/";
        document.cookie = "token=" + resp.token + ";max-age=7200;path=/";
        location.href = 'instructions'
    } else{
        if (resp.msg == "Wrong Password") {
            document.getElementById("incorrect").innerHTML = "Incorrect Password";
        } else if (resp.msg == "Wrong Username") {
            document.getElementById("incorrect").innerHTML = "Incorrect Username";
        } else if (resp.msg == "Competition Over") {
            location.href = "finish";
        } else if (resp.msg == "Already Submitted") {
            location.href = "finish";
        } else {
            console.log(resp);
            alert("Response error");
        }
    }  
}
//TODO look at times
async function updateMainTime() {
    var resp = await post({"method":"get_time", "token":getCookie("token"), "timermode":"main"});
    console.log(resp);
    if(resp.success) {
        time = parseInt(resp);
        mainStarts = new Date().getTime() / 1000;
    }else{
        if (resp.msg == "Token Error") {
            location.href = "index";
        } else if (resp.msg == "Error. Start Quiz") {
            location.href = "instructions";
        } else if (resp.msg == "Competition Over") {
            location.href = "finish";
        } else if (resp.msg == "Time Up") {
            alert("Time's Up!");
            location.href = "finish";
        } else if (resp.msg == "Already Submitted") {
            location.href = "finish";
        } else if (resp.msg == "Not Started") {
            location.href = "instructions";
        } else {
            console.log(resp);
            alert("Response error");
        }
    }
}

async function updateTime() {
    var resp = await post("get_time", getCookie("username"), getCookie("password"), "", "", "inst");
    console.log(resp);
    if (resp.msg == "Wrong Password") {
        location.href = "index";
    } else if (resp.msg == "Wrong Username") {
        location.href = "index";
    } else if (resp.msg == "Competition Over") {
        location.href = "finish";
    } else if (resp.msg == "Already Submitted") {
        location.href = "finish";
    } else {
        time = parseInt(resp);
        starts = new Date().getTime() / 1000;
    }
}

async function getTime() {
    var resp = await post("get_time", getCookie("username"), getCookie("password"), "", "", "inst");
    console.log(resp);
    if (resp.msg == "Wrong Password") {
        location.href = "index";
    } else if (resp.msg == "Wrong Username") {
        location.href = "index";
    } else if (resp.msg == "Competition Over") {
        location.href = "finish";
    } else if (resp.msg == "Already Submitted") {
        location.href = "finish";
    } else {
        time = parseInt(resp);
        starts = new Date().getTime() / 1000;
        instructTimer();
    }

}

async function getMainTime() {
    var resp = await post("get_time", getCookie("username"), getCookie("password"), "", "", "main");
    console.log(resp);
    if (resp.msg == "Wrong Password") {
        location.href = "index";
    } else if (resp.msg == "Wrong Username") {
        location.href = "index";
    } else if (resp.msg == "Error. Start Quiz") {
        location.href = "instructions";
    } else if (resp.msg == "Competition Over") {
        location.href = "finish";
    } else if (resp.msg == "Time is Up") {
        alert("Time's Up!");
        location.href = "finish";
    } else if (resp.msg == "Already Submitted") {
        location.href = "finish";
    } else if (resp.msg == "Not Started") {
        location.href = "instructions";
    } else {
        time = parseInt(resp);
        mainStarts = new Date().getTime() / 1000;
        mainTimer();
    }

}

async function start() {
    var resp = await post("start_time", getCookie("username"), getCookie("password"));
    console.log(resp);
    if (resp == "Start Time Recorded") {
        var ans_list = ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""];
        document.cookie = "ans_local=" + JSON.stringify(ans_list) + ";max-age=7200;path=/";
        location.href = 'main';
    }
    else if (resp.msg == "Wrong Password") {
        location.href = "index";
    } else if (resp.msg == "Wrong Username") {
        location.href = "index";
    } else if (resp.msg == "Competition Over") {
        location.href = "finish";
    } else if (resp.msg == "Already Submitted") {
        location.href = "finish";
    } else { alert("Error. Reload and try again."); }
}

async function getName() {
    var resp = await post({"method":"get_name", "token":getCookie("token")});
    if(resp.success){
        document.getElementById("name").innerHTML = resp.reply;
    }else{
        if (resp.msg == "Token Error") {
            location.href = "index";
        } else if (resp.msg == "Competition Over") {
            location.href = "finish";
        } else if (resp.msg == "Already Submitted") {
            location.href = "finish";
        } else {
            console.log(resp);
            alert("Response error");
        }
    }
}

async function saveAns() {
    if (qn < 11) {
        var checked = document.querySelectorAll('input[type=checkbox]:checked');
        if (checked.length == 0) {
            alert("No answer selected");
        } else if (checked.length == 1) {
            ans = checked[0].value;

            var resp = await post({"method":"save_ans", "token":getCookie("token"), "ans":ans, "qn":qn});
            if (resp.success) {
                var ans_list = JSON.parse(getCookie("ans_local"));
                ans_list[qn - 1] = ans;
                document.cookie = "ans_local=" + JSON.stringify(ans_list) + ";max-age=7200;path=/";

                shadeQNum();
                nextQn();
            }else{
                if (resp.msg == "Token Error") {
                    location.href = "index";
                } else if (resp.msg == "Competition Over") {
                    location.href = "finish";
                } else if (resp.msg == "Already Submitted") {
                    location.href = "finish";
                } 
            }
        } else {
            alert("Error. More than 1 option selected");
        }
    } else {
        var ans = document.getElementById('open').value.replace(/\s/g, '');
        if (ans == "") {
            alert("No answer entered");
        } if (resp.success) {
            var ans_list = JSON.parse(getCookie("ans_local"));
            ans_list[qn - 1] = ans;
            document.cookie = "ans_local=" + JSON.stringify(ans_list) + ";max-age=7200;path=/";

            shadeQNum();
            nextQn();
        }else{
            if (resp.msg == "Token Error") {
                location.href = "index";
            } else if (resp.msg == "Competition Over") {
                location.href = "finish";
            } else if (resp.msg == "Already Submitted") {
                location.href = "finish";
            } 
        }
    }
}

async function initQn() {
    var qnlink;
    var resp = await post({"method":"get_qn", "token":getCookie("token")});
    if(resp.success){
        qnlink = JSON.parse(resp.reply);
        for (var i = 0; i < 15; i++) {
            preload(qnlink[i], i);
        }
        changeQn(1);
    }else{
        if (resp.msg == "Token Error") {
            location.href = "index";
        } else if (resp.msg == "Competition Over") {
            location.href = "finish";
        } else if (resp.msg == "Already Submitted") {
            location.href = "finish";
        } 
    }
}

async function shadeQNum() {
    var resp = await post({"method":"get_completed_qn", "token":getCookie("token")});
    if(resp.success) {
        var ansqn = resp.reply.split(',');
        for (var i = 1; i < 16; i++) {
            if (ansqn[i - 1] == "") {
                document.getElementById("q" + i).style.backgroundColor = '';
            } else {
                document.cookie = "ans_local=" + JSON.stringify(ansqn) + ";max-age=7200;path=/";
                document.getElementById("q" + i).style.backgroundColor = "#55E679";
            }
        }
        showAns();
    }else{
        if (resp.msg == "Token Error") {
            location.href = "index";
        }else if (resp.msg == "Competition Over") {
            location.href = "finish";
        } else if (resp.msg == "Already Submitted") {
            location.href = "finish";
        } else {
            console.log(resp);
            alert("Response error");
        }
    }
}

async function finish() {
    var resp = await post({"method":"end_time", "token":getCookie("token")});
    console.log(resp);
    if (resp.success) {
        submit();
    }else{
        if (resp.msg == "Token Error") {
            location.href = "index";
        } else if (resp.msg == "Competition Over") {
            location.href = "finish";
        } else if (resp.msg == "Already Submitted") {
            location.href = "finish";
        } else { 
            alert("Error. Reload and try again."); 
            console.log(resp);
        }
    }
}


//////////////////////////////////////////////////////////////
//shared.js
function str_pad_left(string, pad, length) {
    return (new Array(length + 1).join(pad) + string).slice(-length);
}
function instructTimer() {
    const instructInterval = setInterval(function () {
        var now = new Date().getTime() / 1000;
        var elapsed = now - starts;
        var timeleft = time - elapsed;
        var days = Math.floor(timeleft / 86400);
        var hours = Math.floor(timeleft % 86400 / 3600);
        var mins = Math.floor(timeleft % 3600 / 60);
        var secs = Math.floor(timeleft % 60);
        var str = "";
        if (days > 0) {
            str = days + ':';
        }
        str = str + hours + ':' + str_pad_left(mins, '0', 2) + ':' + str_pad_left(secs, '0', 2);
        document.getElementById("startBtn").innerHTML = str;
        if (timeleft < 1) {
            clearInterval(instructInterval);
            document.getElementById("startBtn").innerHTML = "Start Quiz";
            document.getElementById("startBtn").disabled = false;
        }
    }, 100);
}
function mainTimer() {
    const mainInterval = setInterval(function () {
        var now = new Date().getTime() / 1000;
        var elapsed = now - mainStarts;
        var timeleft = time - elapsed;
        var tsec = 60 * 60;
        var hours = Math.floor(timeleft / 3600);
        var mins = Math.floor(timeleft % 3600 / 60);
        var secs = Math.floor(timeleft % 60);
        document.getElementById("clock").innerHTML = hours + ':' + str_pad_left(mins, '0', 2) + ':' + str_pad_left(secs, '0', 2);
        document.getElementById("progress").style.width = timeleft * 150 / tsec + "px";
        
        if (timeleft < 1) {
            clearInterval(mainInterval);
            location.href = 'finish';
        }
    }, 100);
}
function getQn() {
    document.getElementById("question-img").removeChild(document.getElementById("question-img").lastChild);
    document.getElementById("question-img").appendChild(images[qn - 1]);
}
function changeQn(qn) {
    document.getElementById("question-num").innerHTML = "Question " + qn;
    var checkboxes = document.getElementsByName('opt[]');
    for (var checkbox of checkboxes) {
        checkbox.checked = false;
    }
    showAns();

    getQn();
    if (qn < 11) {
        toggle_visibility('input-mcq', 'show');
        toggle_visibility('input-open', 'hide');
    } else {
        toggle_visibility('input-mcq', 'hide');
        toggle_visibility('input-open', 'show');
    }
}
function nextQn() {
    if (qn < 15) {
        changeQn(qn + 1);
    }
}
function showAns() {
    var ans_list = JSON.parse(getCookie("ans_local"));
    if (qn > 10) {
        document.getElementById('open').value = ans_list[qn - 1];
    } else {
        //check the checkbox corresponds to .value = ans_list[qn-1]
        if (ans_list[qn - 1] != "") {
            document.getElementById("opt" + ans_list[qn - 1]).checked = true;
        }
    }
}
function toggle_visibility(id, cs) {
    if (cs == "show") {
        document.getElementById(id).style.display = 'flex';
    } else if (cs == "hide") {
        document.getElementById(id).style.display = 'none';
    }
}
function submit() {
    document.getElementById('confirmSubmit').classList.remove('visible');
    document.getElementById('confirmSubmit').classList.add('hidden');
    //submit ans
    location.href = 'finish';
}
function enlarge() {
    document.getElementById("lightbox").style.visibility = "visible";
    document.getElementById("img-enlarge").removeChild(document.getElementById("img-enlarge").firstChild);
    document.getElementById("img-enlarge").appendChild(images[qn - 1].cloneNode(true));
}
function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
var images = [];
function preload(url, i) {
    images[i] = new Image();
    images[i].src = url;
    images[i].style = "max-width: 100%;max-height:100%;object-fit:cover;margin:auto";
}


