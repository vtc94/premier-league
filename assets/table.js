var d = new Date();
var year = d.getFullYear()-1;
var leagueId;
var leagueCaption;

var getLeague = $.ajax({
 headers: { 'X-Auth-Token': 'a6d185568af249c09ac753acf3edd83e' },
 url: 'https://api.football-data.org/v2/competitions/',
 dataType: 'json',
 type: 'GET',
}).done(function(response) {
	response.competitions.forEach(league => {
		if(league.code === "PL"){
			leagueId = league.id;

			leagueCaption = league.name
								+ ' '
								+ league.currentSeason.startDate.substring(0,4)
								+ ' - '
								+ league.currentSeason.endDate.substring(0,4);
			
			document.getElementsByTagName("title")[0].innerHTML = leagueCaption;
		}
	});
});

//getLeague.then(() =>{ 
	$.ajax({
		headers: { 'X-Auth-Token': 'a6d185568af249c09ac753acf3edd83e' },
		url: 'https://api.football-data.org/v2/competitions/PL/standings/?standingType=TOTAL',
		dataType: 'json',
		type: 'GET',
	}).done(function(response) {
		var change = function change(){
			var head = "";
			var w = parseInt(window.innerWidth);
			if(w< 500){
				head+= "<tr><th>Pos.</th><th></th><th>Club</th>"+ 
					"<th>Pl</th><th>W</th>"+
					"<th>D</th><th>L</th>"+
					"<th>GF</th><th>GA</th><th>GD</th>"+
					"<th>Pts</th></tr>";
			}
			else{
				head+="<tr><th>Pos.</th><th></th><th>Club</th>"+ 
					"<th>Played</th><th>Wins</th>"+
					"<th>Draws</th><th>Losses</th>"+
					"<th>GF</th><th>GA</th><th>GD</th>"+
					"<th>Pts</th></tr>";
			}
			document.getElementById("lhead").innerHTML=head;	
	
			var body = "";
			var t = response.standings[0].table;
			for(var i=0;i<t.length;i++){
				var crestUrl = "";
				if(t[i].team.crestUrl != null && t[i].team.crestUrl.substring(0,5) != "https"){
					crestUrl = "https" + t[i].team.crestUrl.substring(4);
				} else {
					crestUrl = t[i].team.crestUrl;
				}
				body += "<tr><td>" + t[i].position + 
				'.</td><td><img src="'+ crestUrl + '" width=30px height=30px></td><td>';
				var name = "";
				var w = parseInt(window.innerWidth);
				if(w< 500){
					name = t[i].team.name.substring(0,3).toUpperCase();
				}
				else{
					name = t[i].team.name;
				}
				body += name + 
					"</td><td>" + t[i].playedGames +
					"</td><td>" + t[i].won +
					"</td><td>" + t[i].draw +
					"</td><td>" + t[i].lost +
					"</td><td>" + t[i].goalsFor + 
					"</td><td>" + t[i].goalsAgainst + 
					"</td><td>" + t[i].goalDifference + 
					"</td><td>" + t[i].points +
					"</td></tr>";
			}
			
			leagueCaption = response.competition.name
								+ ' '
								+ response.season.startDate.substring(0,4)
								+ ' - '
								+ response.season.endDate.substring(0,4);
								
			document.getElementById("lcaption").innerHTML = leagueCaption;
			
			document.getElementById("lbody").innerHTML = body;
		}
		
		window.onload = change();
		window.onresize = change;
	});
//});