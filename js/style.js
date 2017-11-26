function openChat() {
	var frame = document.getElementById("chat-frame");
	frame.className = "";
	var chatBtn = document.getElementById("chatBtn");
	chatBtn.className = "hide";
	console.log("open");
}

function closeChat() {
	var frame = document.getElementById("chat-frame");
	frame.className = "hide";
	var chatBtn = document.getElementById("chatBtn");
	chatBtn.className = "";
}