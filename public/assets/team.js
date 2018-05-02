/*------------------------------------Team List-----------------------------*/
function getTeam(leagueId){
	//console.log(leagueId);
	$.ajax({
		headers: { 'X-Auth-Token': 'a6d185568af249c09ac753acf3edd83e' },
		url: 'https://api.football-data.org/v1/competitions/'+leagueId+'/teams',
		dataType: 'json',
		type: 'GET',
	}).done(function(response) {
		//console.log(response);
		var l = response.teams;
		var img="";
		var c =response.count-1;
		for(var i=response.count-1;i>=0;i--){
			var name = "'"+l[i].name+"'";
			var result = "'https"+l[i]._links.self.href.substring(4)+"'";
			var crestUrl = l[i].crestUrl.substring(0,5) == "https"? l[i].crestUrl: "https"+l[i].crestUrl.substring(4);
			img += '<td><img class="list" src="' + crestUrl
				+ '" width=30px height=30px onclick="show('+result+','+i+','+c+','+name+')"></td>';
		}
		document.getElementById("teamList").innerHTML = "<table align='center'><tr>"+img+"</tr></table>";
	});
}

function getLogo(urlLink,id,name){
	//console.log(urlLink);
	$.ajax({
		headers: { 'X-Auth-Token': 'a6d185568af249c09ac753acf3edd83e' },
		url: urlLink,
		dataType: 'json',
		type: 'GET',
	}).done(function(response) {
		var crestUrl = response.crestUrl.substring(0,5) == "https"? response.crestUrl: "https"+response.crestUrl.substring(4);
		var img = '<img src="'+crestUrl+'" width=50px height=50px>';
		var code = response.code;
		document.getElementById(id).innerHTML = img;
		document.getElementById(name).innerHTML = code;
	});
}

function show(r,a,d,n){
	var image = document.getElementsByClassName("list");
	image[d-a].style.width="45px";
	image[d-a].style.height="45px";
	for(var i=0; i<=d;i++){
		if(i != (d-a)){
			image[i].style.width="30px";
			image[i].style.height="30px";
		}
	}
/*---------------------------------Last Game----------------------------------*/	
	function lastGame(){
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
	}
	lastGame();
	
	$.ajax({
		headers: { 'X-Auth-Token': 'a6d185568af249c09ac753acf3edd83e' },
		url: r+"/fixtures",
		dataType: 'json',
		type: 'GET',
	}).done(function(last){
		//console.log(last);
		var fix = last.fixtures;
		for(var i=last.count-1;i>=0;i--){
			
			if(fix[i].status == "FINISHED"){
				
				var date = 'Date: '+fix[i].date.substring(0,10)
						+ '<br><span style="margin-left:15px;color:black;background:rgba(240,240,240,0.5)">'
						+fix[i].date.substring(11,19)+'</span>';
				document.getElementById("time").innerHTML = date;
				
				var result = fix[i].result.goalsHomeTeam + ' - '
						+ fix[i].result.goalsAwayTeam;
				document.getElementById("lResult").innerHTML = result;
				
				var half = 'Half Time:' + fix[i].result.halfTime.goalsHomeTeam
								+ ' - ' + fix[i].result.halfTime.goalsAwayTeam;
				document.getElementById("lHalf").innerHTML = half;
				
				var homeLink = 'https' + fix[i]._links.homeTeam.href.substring(4);
				getLogo(homeLink,"homePic","homeName");
				
				var awayLink = 'https' + fix[i]._links.awayTeam.href.substring(4);
				getLogo(awayLink,"awayPic","awayName");
				
				i=-1;
			}			
		}
/*---------------------------------------All games--------------------------------*/		
		var ar = "";
		for(var i=last.count-1;i>=0;i--){
			//console.log(fix[i]);
			var lk = "'"+r+"/fixtures'";
			var hn = "'"+fix[i].homeTeamName+"'";
			var an = "'"+fix[i].awayTeamName+"'";
			var id = "'"+"hToh"+i+"'";
			ar += 	'<tr>'
						+'<td colspan="3" style="font-size:12px;padding-top:15px;text-align:center">'
							+ '<span style="padding:3px 3px 1px 3px;color:rgb(255,100,20)">'
								+fix[i].date.substring(0,10)
							+'</span>'
						+'</td>'
					+ '</tr>'
					+ '<tr id="all" class="hide" onmouseover="hoh('+lk+','+hn+','+an+','+id+')" onmouseout="none()">'
						+ '<td align="right" style="background:rgba(5,5,5,0.5);color:rgba(250,250,250,0.5);font-weight:900;font-size:12px;height:40px">'
							+fix[i].homeTeamName
						+'</td>'
						+ '<td align="center" width="80px" style="padding:10px;background:rgba(5,5,5,0.5);font-weight:600;height:60px;font-size:13px;">';
						if(fix[i].status == "TIMED" || fix[i].status == "SCHEDULED"){
							ar += 'Start Time<br>'+fix[i].date.substring(11,19); 
						} 
						else if(fix[i].status == "FINISHED"){
							ar += fix[i].result.goalsHomeTeam + ' - '
								+ fix[i].result.goalsAwayTeam;
						} else {
							ar += "0 - 0<br>Postponed";
						}
					ar +='</td>'
						+ '<td align="left" style="background:rgba(5,5,5,0.5);color:rgba(250,250,250,0.5);font-weight:900;font-size:12px;height:40px">'
							+fix[i].awayTeamName
						+'</td>'
			+ '</tr>';
		}
		document.getElementById("allGame").innerHTML = '<table id="aR" align="center" width="100%">'+ar+ '</table>';
		
/*-------------------------------------Performance--------------------------------*/
		/*--------------------------Summary----------------------------*/
		var win = 0;
		var loss = 0;
		var draw = 0;
		var gf = 0;
		var ga = 0;
		var score = 0;
		var streak = 0;		
		var j = 0;
		for(var i=last.count-1;i>=0;i--){
			if(fix[i].status == "FINISHED"){
				if(n == fix[i].homeTeamName){
					if(fix[i].result.goalsHomeTeam > fix[i].result.goalsAwayTeam){
						win++;
						score += 1.75;
						gf += fix[i].result.goalsHomeTeam;
						ga += fix[i].result.goalsAwayTeam;
						if(streak > 0){
							streak++;
						}
						else{
							streak=1;
						}
					}
					else if(fix[i].result.goalsHomeTeam < fix[i].result.goalsAwayTeam){
						loss++;
						gf += fix[i].result.goalsHomeTeam;
						ga += fix[i].result.goalsAwayTeam;
						if(streak < 0){
							streak--;
						}
						else{
							streak = -1;
						}
					}
					else{
						draw++;
						score += 3.5;
						gf += fix[i].result.goalsHomeTeam;
						ga += fix[i].result.goalsAwayTeam;
					}
				}
				else{
					if(fix[i].result.goalsHomeTeam < fix[i].result.goalsAwayTeam){
						win++;
						score += 4.8;
						ga += fix[i].result.goalsHomeTeam;
						gf += fix[i].result.goalsAwayTeam;
						if(streak > 0){
							streak++;
						}
						else{
							streak=1;
						}
					}
					else if(fix[i].result.goalsHomeTeam > fix[i].result.goalsAwayTeam){
						loss++;
						ga += fix[i].result.goalsHomeTeam;
						gf += fix[i].result.goalsAwayTeam;
						if(streak < 0){
							streak--;
						}
						else{
							streak = -1;
						}
					}
					else{
						draw++;
						score += 3.5;
						ga += fix[i].result.goalsHomeTeam;
						gf += fix[i].result.goalsAwayTeam;
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
		/*----------------------------Chart----------------------------------*/
		var j = 0;
		var day = '';
		var cn = "";
		var list = "";
		function pos(){
			if(j<5){
				$.ajax({
				headers: { 'X-Auth-Token': 'a6d185568af249c09ac753acf3edd83e' },
				url: 'https://api.football-data.org/v1/competitions/'+leagueId+'/leagueTable/?matchday='+day,
				dataType: 'json',
				type: 'GET',
				}).done(function(r) {
					//console.log(r);
					var st = r.standing;
					for(var i = 0; i < 20; i++){
						if(n == st[i].teamName){
							cn += st[i].position+" ";
						}
					}
					list += r.matchday + " ";
					day = r.matchday -1;
					if(j==4)
					{
						function drawChart(){
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
									title: "Matches Played"
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
									{ label: "Day "+parseInt(m[0]), y: parseInt(p[0])},
									{ label: "Day "+parseInt(m[1]), y: parseInt(p[1])},
									{ label: "Day "+parseInt(m[2]), y: parseInt(p[2])},
									{ label: "Day "+parseInt(m[3]), y: parseInt(p[3])},
									{ label: "Day "+parseInt(m[4]), y: parseInt(p[4])}
									]
								}
								]
							});

							chart.render();
						}
						drawChart();
					}
					j++;
					pos();				
				});
			}
		}
		pos();
	});
		document.getElementById("in").style.display="block";
		document.getElementById("rap").className="rap2";
		document.getElementById("outer").className="outer2";
		document.getElementById("lcaption").className="lcaption2";
}
/*-------------------------------------Head to Head-------------------------------*/
	function hoh(lk,hn,an,id){
		$.ajax({
		headers: { 'X-Auth-Token': 'a6d185568af249c09ac753acf3edd83e' },
		url: lk,
		dataType: 'json',
		type: 'GET',
		}).done(function(rival) {
			//console.log(rival);
			var fix = rival.fixtures;
			var h2h = "";
			for(var i=rival.count-1;i>=0;i--){
				if(fix[i].status == "FINISHED"){
					var ht = fix[i].homeTeamName;
					var at = fix[i].awayTeamName;
						
					if((hn == ht && an == at)||(hn == at && an == ht)){
						h2h += '<tr>'
								+'<td colspan="3" style="padding:10px 5px 5px 5px;font-size:10px;">'
									+ fix[i].date.substring(0,10)
								+'</td>'
							+ '</tr>'
							+ '<tr id="all">'
								+ '<td align="center" style="border-right:3px solid blue;font-weight:600">'
									+ht
								+'</td>'
								+ '<td align="center" width="50px" style="padding:3px;font-size:14px;">'
									+ fix[i].result.goalsHomeTeam + ' - '
									+ fix[i].result.goalsAwayTeam
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
		});
		document.getElementById("hToh").style.display ="block";
	}
function none(){
	document.getElementById("hToh").style.display ="none";
}