
$.ajax({
 headers: { 'X-Auth-Token': 'a6d185568af249c09ac753acf3edd83e' },
 url: 'http://api.football-data.org/v1/competitions/426/leagueTable/',
 dataType: 'json',
 type: 'GET',
}).done(function(response) {
	console.log(response);
var change = function change(){
	var head = "";
	var w = parseInt(window.innerWidth);
	if(w< 769){
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
	var t = response.standing;
	for(var i=0;i<t.length;i++){
		body += "<tr><td>" + t[i].position + 
			'.</td><td><img src="'+t[i].crestURI + '" width=30px height=30px></td><td>';
		var name = "";
		var w = parseInt(window.innerWidth);
		if(w< 769){
			name = t[i].teamName.substring(0,3).toUpperCase();
		}
		else{
			name = t[i].teamName;
		}
		body += name + 
			"</td><td>" + t[i].playedGames +
			"</td><td>" + t[i].wins +
			"</td><td>" + t[i].draws +
			"</td><td>" + t[i].losses +
			"</td><td>" + t[i].goals + 
			"</td><td>" + t[i].goalsAgainst + 
			"</td><td>" + t[i].goalDifference + 
			"</td><td>" + t[i].points +
			"</td></tr>";
	}
document.getElementById("lcaption").innerHTML=response.leagueCaption;
document.getElementById("lbody").innerHTML=body;
}
window.onload = change();
window.onresize = change;

});