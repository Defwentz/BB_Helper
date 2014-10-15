var posparams = new Array();
posparams[0] = new Array(1.02, 1.041, 1.071, 1.078, 1.034, 1.154, 1.003, 1, 1.03, 1, 1.004, 1 ,1 ,300);
posparams[1] = new Array(1.12, 1.121, 1.114, 1.005, 1.01, 1.001, 1, 1.001, 1.05, 1, 1.008, 1.005, 1.003, 295);
posparams[2] = new Array(1.165, 1.07, 1.068, 1.002, 1.002, 1, 1, 1.058, 1.088, 1.001, 1.001, 1 ,1.006 ,295);
posparams[3] = new Array(1.071, 1, 1.008, 1, 1.001, 1.007, 1.114, 1.116, 1.11, 1.062, 1.008, 1 ,1.008 ,277);
posparams[4] = new Array(1.001, 1, 1.008, 1.001, 1.002, 1, 1.128, 1.13, 1.121, 1.051, 1, 1.003, 1, 293);
/*
 * there are three kinds: playerlists(repeater), transferlists(rptListedPlayers), oneplayer(skillTable).
 * oneplayer(skillTable) is 0, don't have player is -1, transferlists(rptListedPlayers) is 1, playerlists(repeater) is 2.
 */
function whichKind() {
	var oneplayer = document.getElementById("ctl00_cphContent_skillTable_sdJumpShot_linkDen");
	var transfplayer = document.getElementById("ctl00_cphContent_rptListedPlayers_ctl00_skillPanel_sdJumpShot_linkDen");
	var psplayer = document.getElementById("ctl00_cphContent_Repeater1_ctl00_Panel1");
	if(oneplayer != null)
		return 0;
	else if (transfplayer != null)
		return 1;
	else if (psplayer != null)
		return 2;
	return -1;
}

function getPosition() {
	var divNodes = document.body.getElementsByTagName("div");
	var pos = new Array();
	var n = 0;
	for(i = 0; i < divNodes.length; i++) {
		// 没有考虑其他语言的情况
		if(divNodes[i].innerText == "中锋 (C)")
			pos.push(4);
		else if(divNodes[i].innerText == "大前锋 (PF)")
			pos.push(3);
		else if(divNodes[i].innerText == "小前锋 (SF)")
			pos.push(2);
		else if(divNodes[i].innerText == "得分后卫 (SG)")
			pos.push(1);
		else if(divNodes[i].innerText == "控球后卫 (PG)")
			pos.push(0);
		else ;
	}
	return pos;
}

function getNeedId(kind, pn, ability) {
	var abi;
	switch(ability) {
	case 0:
		abi = "_sdJumpShot_linkDen";
		break;
	case 1:
		abi = "_sdJumpRange_linkDen";
	  break;
	case 2:
		abi = "_sdperimDef_linkDen";
		break;
	case 3:
		abi = "_sdhandling_linkDen";
		break;
	case 4:
		abi = "_sddriving_linkDen";
		break;
	case 5:
		abi = "_sdpassing_linkDen";
		break;
	case 6:
		abi = "_sdinsideShot_linkDen";
		break;
	case 7:
		abi = "_sdinsideDef_linkDen";
		break;
	case 8:
		abi = "_sdrebound_linkDen";
		break;
	case 9:
		abi = "_sdshotBlock_linkDen";
		break;
	case 10:
		abi = "_sdstamina_linkDen";
		break;
	case 11:
		abi = "_sdfreeThrow_linkDen";
		break;
	case 12:
		abi = "_sdexperience_linkDen";
		break;
	default:
		break;
	}
	/*
	ctl00_cphContent_Repeater1_ctl01_skillPanel_sdJumpShot_linkDen
	ctl00_cphContent_rptListedPlayers_ctl00_skillPanel_sdJumpShot_linkDen
	ctl00_cphContent_skillTable_sdJumpShot_linkDen
	ctl00_cphContent_rptListedPlayers_ctl09_skillPanel_sdinsideShot_linkDen
	*/
	if(kind == 0)
		return "ctl00_cphContent_skillTable" + abi;
	else if (kind == 1)
		return "ctl00_cphContent_rptListedPlayers_ctl0" + pn + "_skillPanel" + abi;
	else if (kind == 2) {
		var numstr = pn.toString();
		if(pn < 10)
			numstr = "0" + numstr;
		return "ctl00_cphContent_Repeater1_ctl" + numstr + "_skillPanel" + abi;
	}
	return "null";
}

function getAbilities(kind, pn) {
	var abi = new Array();
	for(var j = 0; j < 13; j++) {
		var tmp = document.getElementById(getNeedId(kind, pn, j));
		if(tmp != null)
			abi.push(tmp.title);
		else {
			abi.push("-1");
			return abi;
		}
	}
	return abi;
}

function doMath(pos, abi) {
	if(abi[0] == "-1")
		return 0;
	var estimateSalary = 0.79 * posparams[pos][13];
	for(var k = 0; k < 13; k++)
		estimateSalary *= Math.pow(posparams[pos][k], abi[k]);
		return Math.floor(estimateSalary);
}
/*
function injectInTable(estimateSalary) {
	var divs = document.body.getElementsByTagName("div");
	for(i = 0; i < divs.length; i++) {
		if(divs[i].id == "playerbox") {
			var tbs = divs[i].getElementsByTagName("tbody");
			var ests_tr = document.createElement("tr");
			tbs[0].appendChild(ests_tr);
			var ests_td = document.createElement("td");
			ests_td = ests_tr.appendChild(document.createTextNode("预期薪水: " + estimateSalary));
			ests_tr.appendChild(ests_td);
			
		}
	}
}
*/
function injectInTable(estimateSalary) {
	var divs = document.body.getElementsByTagName("div");
	var num = estimateSalary.length;
	var n = 0;
	for(i = 0; i < divs.length; i++) {
		if(divs[i].id == "playerbox") {
			if(estimateSalary[n] == 0) {
				n++;
				continue;
			}
			var tbs = divs[i].getElementsByTagName("tbody");
			var ests_tr = document.createElement("tr");
			tbs[0].appendChild(ests_tr);
			var ests_td = document.createElement("td");
			ests_td = ests_tr.appendChild(document.createTextNode("预期薪水: " + estimateSalary[n]));
			ests_tr.appendChild(ests_td);
			n++;
			if(n == num)
				return;
		}
	}
}
//var nodes = document.body.getElementsByTagName("table");
//alert(nodes.length);

var kind = whichKind();
var estimateSalary = new Array();
if(kind != -1) {
	var pos = getPosition();
	var num = pos.length;
	for(i = 0; i < num; i++) {
		var abi = getAbilities(kind, i);
		var est = doMath(pos[i], abi);
		estimateSalary.push(est);
	}
	injectInTable(estimateSalary);
}
/*
var newElement = document.createElement("p");
newElement.textContent = "New Element!";
newElement.style.color = "red";
newElement.style.float = "right";
document.body.insertBefore(newElement, document.body.firstChild);
*/
