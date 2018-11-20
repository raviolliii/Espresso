let CMD = "Meta";
let J = "j";
let keys = {};
let bar = false;
let urlBar;

let icon = "<i class='fas fa-coffee'></i>"
let input = `<input id = 'urlBarInput' type = 'text'></input>`;
let options = {
	content: icon + input,
	style: "toast",
	timeout: 0,
	htmlAllowed: true,
	onClose: reset 
};

function reset() {
	keys = {};
	bar = false;
    urlBar.value = "";
    document.getElementById("snackbar-container").innerHTML = "";
}

function validKeyCombo() {
    return keys[CMD] && keys[J] && !bar;
}

function inputHandler(e) {
	if (e.keyCode === 13) {
		let text = urlBar.value.trim();
		reset();
        if (text) {
            chrome.runtime.sendMessage({ 
                type: "new tab", 
                content: text 
            });
        }       
	}
    if (e.keyCode === 27) {
        reset();
    }
}

function keyHandler(e) {
	let state = e.type === "keydown";
	keys[e.key] = state;

	if (validKeyCombo()) {
		$.snackbar(options);
		bar = true;
		urlBar = document.getElementById("urlBarInput");
		urlBar.focus();
		urlBar.addEventListener("keydown", inputHandler);
	}
}


document.body.addEventListener("keydown", keyHandler);
document.body.addEventListener("keyup", keyHandler);



