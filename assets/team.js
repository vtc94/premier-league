var teamList = [];
var matches = [];
var rankingList = {};

//getLeague.then(function (){
	getMatches(leagueId);
	getTeam(leagueId);
//});

/*---------------------------------Sort team standings after each matchday-----------------------------------*/
function Team(){
	this.played 
	= this.wins 
	= this.draws 
	= this.losses 
	= this.goalsFor 
	= this.goalsAgainst
	= this.goalsDifference
	= this.points
	= this.streak
	= 0;
} 

function calculateScore(){
	var fix = matches.matches;

	rankingList[0] = {};

	for(var i = 0; i < teamList.length; i++){
		rankingList[0][teamList[i].id] = new Team();
	}
	
	var count = 1;
	
	while(true){
		var stop = false;
		
		rankingList[count] = {};
		
		for(var i = 0; i < teamList.length; i++){
			rankingList[count][teamList[i].id] = Object.assign({}, rankingList[count-1][teamList[i].id]);
		}
		
		for(let i = 0; i < matches.count; i++){
			if(count > fix[i].season.currentMatchday){
				stop = true;
				break;
			}else if(fix[i].status == "FINISHED" && fix[i].matchday == count){
				var ht = fix[i].homeTeam;
				var at = fix[i].awayTeam;
				
				rankingList[count][ht.id].played++;
				rankingList[fix[i].matchday][ht.id].goalsFor += fix[i].score.fullTime.homeTeam;
				rankingList[fix[i].matchday][ht.id].goalsAgainst += fix[i].score.fullTime.awayTeam;
				rankingList[fix[i].matchday][ht.id].goalsDifference += fix[i].score.fullTime.homeTeam - fix[i].score.fullTime.awayTeam;
				
				rankingList[count][at.id].played++;
				rankingList[fix[i].matchday][at.id].goalsFor += fix[i].score.fullTime.awayTeam;
				rankingList[fix[i].matchday][at.id].goalsAgainst += fix[i].score.fullTime.homeTeam;
				rankingList[fix[i].matchday][at.id].goalsDifference += fix[i].score.fullTime.awayTeam - fix[i].score.fullTime.homeTeam;
				
				if(fix[i].score.fullTime.homeTeam > fix[i].score.fullTime.awayTeam){
					
					rankingList[fix[i].matchday][ht.id].wins += 1;
					rankingList[fix[i].matchday][ht.id].points += 3;
					rankingList[fix[i].matchday][ht.id].streak++;
					
					rankingList[fix[i].matchday][at.id].losses += 1;
					rankingList[fix[i].matchday][at.id].streak--;
				}
				else if(fix[i].score.fullTime.homeTeam < fix[i].score.fullTime.awayTeam){
					rankingList[fix[i].matchday][ht.id].losses += 1;
					rankingList[fix[i].matchday][ht.id].streak--;					
					
					rankingList[fix[i].matchday][at.id].wins += 1;
					rankingList[fix[i].matchday][at.id].points += 3;
					rankingList[fix[i].matchday][at.id].streak++;
				}
				else{
					rankingList[fix[i].matchday][ht.id].draws += 1;
					rankingList[fix[i].matchday][ht.id].points += 1;					
					
					rankingList[fix[i].matchday][at.id].draws += 1;
					rankingList[fix[i].matchday][at.id].points += 1;
				}
			}
		}
		
		
		if(stop){
			break;
		}
		
		Object.keys(rankingList).forEach(key => {
			var matchday = rankingList[key];
			var points = [];
			
			for(var i = 0; i < teamList.length; i++){
				points[i] = matchday[teamList[i].id].points + parseFloat("0.0" + matchday[teamList[i].id].goalsDifference) ;
			}
			
			points.sort(function(a,b){
				return b - a;
			});

			for(var i = 0; i < points.length; i++){
				for(var j = 0; j < teamList.length; j++){
					if(matchday[teamList[j].id].points == Math.floor(points[i])){
						matchday[teamList[j].id].position = i + 1;
					}
				}
			}
			
		});
		
		count++;
	}
}

/*------------------------------------Team List-----------------------------*/
function getTeam(leagueId){
	$.ajax({
		headers: { 'X-Auth-Token': 'a6d185568af249c09ac753acf3edd83e' },
		url: 'https://api.football-data.org/v2/competitions/PL/teams/?season=' + year,
		dataType: 'json',
		type: 'GET',
	}).done(function(response) {
		var l = teamList = response.teams;
		var img="";
		var c =response.count-1;
		
		for(var i=0; i <= c; i++){
			var name = "'"+l[i].name+"'";
			var teamId = l[i].id;
			
			if(l[i].crestUrl != null){
				var crestUrl = l[i].crestUrl.substring(0,5) == "https"? l[i].crestUrl: "https"+l[i].crestUrl.substring(4);
			}
			
			img += '<td><img class="list" src="' + crestUrl
				+ '" width=30px height=30px onclick="show('+teamId+','+i+','+name+')"></td>';
		}
		
		document.getElementById("teamList").innerHTML = "<table align='center'><tr>"+img+"</tr></table>";
	});
}

/*----------------------------------Match list---------------------------------*/
function getMatches(leagueId){
	$.ajax({
		headers: { 'X-Auth-Token': 'a6d185568af249c09ac753acf3edd83e' },
		url: 'https://api.football-data.org/v2/competitions/PL/matches',
		dataType: 'json',
		type: 'GET',
	}).done(function(res){
		matches = res;
		calculateScore();
	});
}

function getLogo(teamId,id,name){
	
	for(var i = 0; i < teamList.length; i++){
		if(teamList[i].id == teamId){
			var crestUrl = teamList[i].crestUrl.substring(0,5) == "https"? teamList[i].crestUrl: "https" + teamList[i].crestUrl.substring(4);
			var img = '<img src="'+crestUrl+'" width=50px height=50px>';
			var code = teamList[i].shortName.substring(0,3).toUpperCase();
			document.getElementById(id).innerHTML = img;
			document.getElementById(name).innerHTML = code;
		}
	}
	
}

function show(teamId,a,n){
	var image = document.getElementsByClassName("list");
	image[a].style.width = "45px";
	image[a].style.height = "45px";
	for(var i=0; i < teamList.length; i++){
		if(i != (a)){
			image[i].style.width="30px";
			image[i].style.height="30px";
		}
	}
	
	document.getElementById("in").style.display="block";
	document.getElementById("rap").className="rap2";
	document.getElementById("outer").className="outer2";
	document.getElementById("lcaption").className="lcaption2";
	
	lastGame(n);
	allGames(n);
	performance(n);
	drawChart(teamId);
}

/*---------------------------------Last Game----------------------------------*/	
function lastGame(n){
	var lr = '<table id="lR" align="center" width="100%">'
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
						+ '<td id="awayPic" align="left"></td>'
						+ '<td id="awayName" align="left"></td>'
					+ '</tr>'
					+ '<tr>'
						+ '<td id="lHalf" colspan="5" align="center"></td>'
					+ '</tr>'
				+ '</table>';
	document.getElementById("lastGame").innerHTML =lr;

	var fix = matches.matches;
	
	for(var i = matches.count-1; i>=0; i--){
		if(fix[i].status == "FINISHED" && (fix[i].awayTeam.name == n || fix[i].homeTeam.name == n)){
			var date = 'Date: '+fix[i].utcDate.substring(0,10)
					+ '<br><span style="margin-left:15px;color:black;background:rgba(240,240,240,0.5)">'
					+fix[i].utcDate.substring(11,19)+'</span>';
			document.getElementById("time").innerHTML = date;
			
			var result = fix[i].score.fullTime.homeTeam + ' - '
					+ fix[i].score.fullTime.awayTeam;
			document.getElementById("lResult").innerHTML = result;
			
			if(fix[i].score.halfTime != null){
				var half = 'Half Time: ' + fix[i].score.halfTime.homeTeam
								+ ' - ' + fix[i].score.halfTime.awayTeam;
				document.getElementById("lHalf").innerHTML = half;
			}
			
			var homeTeamId = fix[i].homeTeam.id;
			getLogo(homeTeamId,"homePic","homeName");
			
			var awayTeamId = fix[i].awayTeam.id;;
			getLogo(awayTeamId,"awayPic","awayName");
			
			i=-1;
		}			
	}
}

/*---------------------------------------All games--------------------------------*/
function allGames(n){
	var ar = "";
	
	var fix = matches.matches;
	
	for(var i = matches.count-1; i>=0; i--){
		if(fix[i].awayTeam.name == n || fix[i].homeTeam.name == n){
			var lk = "1";
			var hn = "'"+fix[i].homeTeam.name+"'";
			var an = "'"+fix[i].awayTeam.name+"'";
			var id = "'"+"hToh"+i+"'";
			ar += 	'<tr>'
						+'<td colspan="3" style="font-size:12px;padding-top:15px;text-align:center">'
							+ '<span style="padding:3px 3px 1px 3px;color:rgb(255,100,20)">'
								+fix[i].utcDate.substring(0,10)
							+'</span>'
						+'</td>'
					+ '</tr>'
					+ '<tr id="all" class="hide" onmouseover="hoh('+lk+','+hn+','+an+','+id+')" onmouseout="none()">'
						+ '<td align="right" style="background:rgba(5,5,5,0.5);color:rgba(250,250,250,0.5);font-weight:900;font-size:12px;height:40px">'
							+fix[i].homeTeam.name
						+'</td>'
						+ '<td align="center" width="80px" style="padding:10px;background:rgba(5,5,5,0.5);font-weight:600;height:60px;font-size:13px;">';
						if(fix[i].status == "TIMED" || fix[i].status == "SCHEDULED"){
							ar += 'Start Time<br>'+fix[i].utcDate.substring(11,19); 
						} 
						else if(fix[i].status == "FINISHED"){
							ar += fix[i].score.fullTime.homeTeam + ' - '
								+ fix[i].score.fullTime.awayTeam;
						} else {
							ar += "0 - 0<br>Postponed";
						}
					ar +='</td>'
						+ '<td align="left" style="background:rgba(5,5,5,0.5);color:rgba(250,250,250,0.5);font-weight:900;font-size:12px;height:40px">'
							+fix[i].awayTeam.name
						+'</td>'
				+ '</tr>';
		}
	}
	document.getElementById("allGame").innerHTML = '<table id="aR" align="center" width="100%">'+ar+ '</table>';
}
/*-------------------------------------Performance--------------------------------*/
		/*--------------------------Summary----------------------------*/
function performance(n){
	var win = 0;
	var loss = 0;
	var draw = 0;
	var gf = 0;
	var ga = 0;
	var score = 0;
	var streak = 0;		
	var j = 0;
	
	var day = '';
	var cn = "";
	var list = "";
	
	var fix = matches.matches;
		
	for(var i = matches.count-1; i >= 0; i--){
		if(fix[i].status == "FINISHED" && (fix[i].awayTeam.name == n || fix[i].homeTeam.name == n)){
			if(n == fix[i].homeTeam.name){
				if(fix[i].score.fullTime.homeTeam > fix[i].score.fullTime.awayTeam){
					win++;
					score += 3;
					gf += fix[i].score.fullTime.homeTeam;
					ga += fix[i].score.fullTime.awayTeam;
					if(streak > 0){
						streak++;
					}
					else{
						streak=1;
					}
				}
				else if(fix[i].score.fullTime.homeTeam < fix[i].score.fullTime.awayTeam){
					loss++;
					gf += fix[i].score.fullTime.homeTeam;
					ga += fix[i].score.fullTime.awayTeam;
					if(streak < 0){
						streak--;
					}
					else{
						streak = -1;
					}
				}
				else{
					draw++;
					score += 1;
					gf += fix[i].score.fullTime.homeTeam;
					ga += fix[i].score.fullTime.awayTeam;
				}
			}
			else{
				if(fix[i].score.fullTime.homeTeam < fix[i].score.fullTime.awayTeam){
					win++;
					score += 3;
					ga += fix[i].score.fullTime.homeTeam;
					gf += fix[i].score.fullTime.awayTeam;
					if(streak > 0){
						streak++;
					}
					else{
						streak=1;
					}
				}
				else if(fix[i].score.fullTime.homeTeam > fix[i].score.fullTime.awayTeam){
					loss++;
					ga += fix[i].score.fullTime.homeTeam;
					gf += fix[i].score.fullTime.awayTeam;
					if(streak < 0){
						streak--;
					}
					else{
						streak = -1;
					}
				}
				else{
					draw++;
					score += 1;
					ga += fix[i].score.fullTime.homeTeam;
					gf += fix[i].score.fullTime.awayTeam;
				}
			}
			
			j++;
			if(j == 5)
			{
				i = -1;
			}
		}
	}
	
	var sum = 'W-L-D: '+win+'-'+loss+'-'+draw
			 +'&#160; &#160; &#160; &#160; &#160; &#160;'
			 +'Goals For: '+gf
			 +'&#160; &#160; &#160; &#160; &#160; &#160;'
			 +'Goals Against: '+ga
			 +'<br>'
			 +'Points: '+Math.round(score)
			 +'&#160; &#160; &#160; &#160; &#160; &#160;'
			 +'Win percentage: '+(win/5*100)+'%'
			 +'&#160; &#160; &#160; &#160; &#160; &#160;'
			 +'Streak: '+streak;
	document.getElementById("sum").innerHTML = sum;
}

/*----------------------------Chart----------------------------------*/	
function drawChart(teamId){
	var cn = list = '';
	var matchdays = Object.keys(rankingList).length;
	for(let i = matchdays - 1; i > matchdays - 6; i--){
		list += i + ' ';
		cn += rankingList[i][teamId].position + ' ';
	}
	
	var p = cn.split(" ");
	var m = list.split(" ");
	
	var chart = new CanvasJS.Chart("chart",
	{
		backgroundColor:"rgba(10,10,10,0.5)",
		title:{
			text: "Last 5 Matches Performance",
			fontSize: 18,
			fontColor:"rgba(240,240,240,0.7)",
			padding:10,
		},
		axisY: {
			title: "Position",
		},
		axisX: {
			title: "Matchdays"
		},
		data: [
		{
			color:"yellow",
			lineColor:"grey",
			cursor:"pointer",
			borderColor:"green",
			type: "line",
			toolTipContent:"Position:{y}",
			dataPoints: [
			{ label: "Day "+parseInt(m[4]), y: parseInt(p[4])},
			{ label: "Day "+parseInt(m[3]), y: parseInt(p[3])},
			{ label: "Day "+parseInt(m[2]), y: parseInt(p[2])},
			{ label: "Day "+parseInt(m[1]), y: parseInt(p[1])},
			{ label: "Day "+parseInt(m[0]), y: parseInt(p[0])}
			]
		}
		]
	});

	chart.render();
}

/*-------------------------------------Head to Head-------------------------------*/
function hoh(lk,hn,an,id){
	var fix = matches.matches;
	var h2h = "";
	for(var i = matches.count-1; i >= 0; i--){
		var ht = fix[i].homeTeam.name;
		var at = fix[i].awayTeam.name;
		
		var filter = ((hn == ht || hn == at) && (an == ht || an == at));
		if(fix[i].status == "FINISHED" && filter){	
			if((hn == ht && an == at)||(hn == at && an == ht)){
				h2h += '<tr>'
						+'<td colspan="3" style="padding:10px 5px 5px 5px;font-size:10px;">'
							+ fix[i].utcDate.substring(0,10)
						+'</td>'
					+ '</tr>'
					+ '<tr id="all">'
						+ '<td align="center" style="border-right:3px solid blue;font-weight:600">'
							+ht
						+'</td>'
						+ '<td align="center" width="50px" style="padding:3px;font-size:14px;">'
							+ fix[i].score.fullTime.homeTeam + ' - '
							+ fix[i].score.fullTime.awayTeam
						+'</td>'
						+ '<td align="center" style="border-left:3px solid red;font-weight:600">'
							+at
						+'</td>'
					+ '</tr>';			
			}
		}
	}
	document.getElementById("hToh").innerHTML = '<div class="back"><table id="h2h" align="center" width="100%">'
												+'<caption>Head to Head</caption>'
												+h2h
												+'</table><div>';

	document.getElementById("hToh").style.display ="block";
}

function none(){
	document.getElementById("hToh").style.display ="none";
}