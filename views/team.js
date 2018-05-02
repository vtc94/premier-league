/*------------------------------------Team List-----------------------------*/
$.ajax({
 headers: { 'X-Auth-Token': 'a6d185568af249c09ac753acf3edd83e' },
 url: 'http://api.football-data.org/v1/competitions/426/teams',
 dataType: 'json',
 type: 'GET',
}).done(function(response) {
	console.log(response);
	var l = response.teams;
	var img="";
	var c =response.count-1;
	for(var i=response.count-1;i>=0;i--){
		var result = "'"+l[i]._links.self.href+"'";
		img += '<td><img class="list" src="' + l[i].crestUrl 
			+ '" width=30px height=30px onclick="show(' + result +','+i+','+c+')"></td>';
	}
	document.getElementById("teamList").innerHTML = "<table align='center'><tr>"+img+"</tr></table>";
});

function getLogo(urlLink,id,name){
	$.ajax({
		headers: { 'X-Auth-Token': 'a6d185568af249c09ac753acf3edd83e' },
		url: urlLink,
		dataType: 'json',
		type: 'GET',
	}).done(function(response) {
		var img = '<img src="'+response.crestUrl+'" width=50px height=50px>';
		var code = response.code;
		document.getElementById(id).innerHTML = img;
		document.getElementById(name).innerHTML = code;
	});
}

function show(r,a,d){
	var image = document.getElementsByClassName("list");
	image[d-a].style.width="50px";
	image[d-a].style.height="50px";
	for(var i=0; i<=d;i++){
		if(i != (d-a)){
			image[i].style.width="30px";
			image[i].style.height="30px";
		}
	}
/*---------------------------------Last Game----------------------------------*/	
	function lastGame(){
		var lr = '<table align="center" width="100%">'
					+'<tr>'
						+'<td id="time" colspan="5"></td>'
					+ '</tr>'
					+ '<tr>'
						+ '<td colspan="2" height="15xp"></td>'
						+ '<td id="lResult" rowspan="2" align="center" width="100px"></td>'
						+ '<td colspan="2" height="15xp"></td>'
					+ '</tr>'
					+ '<tr>'
							+ '<td id="homeName" align="right"></td>'
							+ '<td id="homePic" align="right"></td>'
							+ '<td id="awayPic"></td>'
							+ '<td id="awayName" align="left"></td>'
						+ '</tr>'
						+ '<tr>'
							+ '<td id="lHalf" colspan="5" align="center"></td>'
						+ '</tr>'
					+ '</table>';
		document.getElementById("lastGame").innerHTML =lr;
	}
	lastGame();
	
	$.ajax({
		headers: { 'X-Auth-Token': 'a6d185568af249c09ac753acf3edd83e' },
		url: r+"/fixtures",
		dataType: 'json',
		type: 'GET',
	}).done(function(last){
		console.log(last);
		var fix = last.fixtures;
		for(var i=last.count-1;i>=0;i--){
			
			if(fix[i].status == "FINISHED"){
				
				var date = 'Date: '+fix[i].date.substring(0,10)
						+ '<br><span style="padding-left:15px;">'
						+fix[i].date.substring(11,19)+'</span>';
				document.getElementById("time").innerHTML = date;
				
				var result = fix[i].result.goalsHomeTeam + ' - '
						+ fix[i].result.goalsAwayTeam;
				document.getElementById("lResult").innerHTML = result;
				
				var half = 'Half Time:' + fix[i].result.halfTime.goalsHomeTeam
								+ ' - ' + fix[i].result.halfTime.goalsAwayTeam;
				document.getElementById("lHalf").innerHTML = half;
				
				var homeLink = fix[i]._links.homeTeam.href;
				getLogo(homeLink,"homePic","homeName");
				
				var awayLink = fix[i]._links.awayTeam.href;
				getLogo(awayLink,"awayPic","awayName");
				
				i=-1;
			}			
		}
/*---------------------------------------All games--------------------------------*/		
		var ar = "";
		for(var i=last.count-1;i>=0;i--){
			ar += 	'<tr>'
						+'<td colspan="5">'
							+ fix[i].date.substring(0,10)
						+'</td>'
					+ '</tr>'
					+ '<tr>'
						+ '<td align="right">'
							+fix[i].homeTeamName
						+'</td>'
						+ '<td align="center" width="80px" style="padding:10px;">';
						if(fix[i].status == "TIMED"){
							ar += 'Start Time<br>'+fix[i].date.substring(11,19); 
						} 
						else{
							ar += fix[i].result.goalsHomeTeam + ' - '
								+ fix[i].result.goalsAwayTeam;
						}
					ar +='</td>'
						+ '<td align="left">'
							+fix[i].awayTeamName
						+'</td>'
					+ '</tr>';
		}
		document.getElementById("allGame").innerHTML = '<table align="center" width="100%">'+ar+ '</table>';
	});
}
