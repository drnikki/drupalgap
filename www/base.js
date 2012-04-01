var baseurl = "";
var nextpage = "#home";


/* When this function is called, the phone has been initialized and is ready to roll */
function onDeviceReady() {

	username = localStorage.phonegapName;
	title = localStorage.phonegapTitle;
	story = localStorage.phonegapStory;
	blat = localStorage.phonegapLat;
	blong = localStorage.phonegapLong;
	baseurl = localStorage.baseUrl;

	if (baseurl){
		$("#baseurl").val(baseurl);	
	}
	
	if (username){
		$("#username").val(username);	
	}
	
	if (title){
		$("#storytitle").val(title);	
	};
	if (story){
		$("#story").val(story);	
	};
	
	if (localStorage.localLogin == 3){
		$("#logoutli").show();
		$("#loginli").hide();
	}else{

		$("#footout").hide();
	};

	    $.mobile.changePage("#home");
			
}

function saveSettings()
{
	baseurl = $("#baseurl").val();
	localStorage.baseUrl = baseurl;
	localStorage.view = $("#view").val();
	localStorage.display = $("#display").val();
	alert("settings saved");
}


function loginout()
{
	if (localStorage.localLogin != 3){
		$.mobile.changePage("#login");
	}
	else
	{	
	logout();
	}
}


function listArticles(){
	url = baseurl + '/phonegap/display_view';
	$username = '';
	$("#latestlist").html("retrieving data. you must <br/><br/>enable the view in drupal <br/><br/>set the mobile settings page (below)<br/><br/>enable the default views frontage is good starting point ");
	$.post(url, {
		username : $username,
		view : localStorage.view,
		display : localStorage.display
	}, function(data) {
		if (data =='') {data = "you must <br/><br/>enable the view in drupal <br/><br/>set the mobile settings page (below)<br/><br/>enable the default views frontage is good starting point "};
		$("#latestlist").html(data);

	});
	$.mobile.changePage("#stories");
}



function saveLogin() {
	username = $("#username").val();
	password = $("#password").val();
	var sayhi = function(data) {
		$("#logmsg").html(
				"server result <br />" + data.result + " status: " + data.status);
		localStorage.localLogin = 5;
		if (data.status == "ok"){
			localStorage.localLogin = 3;
			localStorage.hash = data.hash;
			$.mobile.changePage(nextpage);
		};
	};
	var saybi = function(data) {
		$("#logmsg").html("data connect error ");
	};
	if (username) {
		localStorage.phonegapName = username;
		if (password) {
			localStorage.phonegapPass = password;
			$("#logmsg").html(
					"setting locally saved for " + username
							+ "trying to contact server ...");
			purl = baseurl + '/phonegap/login';
			$.ajax( {
				type : 'POST',
				url : purl,
				dataType : 'json',
				success : sayhi,
				error : saybi,
				data : {
					username : username,
					password : password
				}
			});
			return false;
		}
	}
};

function sendStory() {
	$.mobile.changePage("#sending");
	title = $("#storytitle").val();
	story = $("#story").val();
	localStorage.phonegapTitle = title;
	localStorage.phonegapStory = story;
	uname = localStorage.phonegapName;
	hash = localStorage.hash;
	url = baseurl + '/phonegap/post';
	$("#sentmessage").html('<img id="sending" title="sending" alt="sending" src="images/loadingt.gif" /><br /> Your Message is being sent. If this message does not change after two minutes, please check your network connectivity.')
	$.post(url, {
		username : uname,
		password : hash,
		title : title,
		body : story
	}, function(data) {
		var content = $(data).find('#main');
		if (isNumeric(data) ) 
		{
			localStorage.phonegapPosted = 3;
			$("#sentmessage").html('your story has been uploaded with id: '+ data + '<br /> please go to my stories to check your story, before clearing it ready for your next report.<br /> <br /> <a class="ui-btn ui-btn-icon-right ui-li ui-corner-top ui-corner-bottom ui-btn-up-c ui-btn-active" onclick="listArticles();" ><p> &nbsp;Show articles</p></a><br /> <br />');
		}
		else
		{
			$("#sentmessage").html('There has been a problem uplaoding your story: '+ data + '<br /> please check your settings and connectivty and try again.<br /> <a onclick="listStories();" ><img src="images/my-stories.png" /></a>');	
		}
	});
};

function logout()
{
	localStorage.phonegapName = "";
	localStorage.phonegapPass = "";
	localStorage.localLogin = 5;
	$("#username").val("");
	$("#password").val("");
	$("#logoutli").hide();
	$("#loginli").show();
	$("#footout").fadeOut();	
}

function how()
{
	$.mobile.changePage("#howitworks");
}

function clearData() {

	localStorage.phonegapName = "";
	localStorage.phonegapPass = "";
	localStorage.localLogin = 5;
	$("#username").val("");
	$("#password").val("");
	$("#logoutlia").val("Login");
	clearStoryData();
}

function addStory()
{
	if (localStorage.localLogin != 3){
		nextpage = "#addstory";
		$.mobile.changePage("#login");
		}
	else
	{
		$.mobile.changePage("#addstory");
	};
}



function onBodyLoad() {
	document.addEventListener("deviceready", onDeviceReady, false);
}

function isNumeric(input) {
	return (input - 0) == input && input > 0;
}
