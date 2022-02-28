var dbshow = {};

dbshow.showport = function(porttotal,result){
  var contents = "";
  for(var i = 0;i<porttotal;i++){
    var p = result[i];
    if(p.porttype === 'CDF_E1'){
      contents += dbshow.CDF_E1(p._id,p.sharenum,p.portname,p.nodename,p.oppnodename,p.portnumber,p.porttype,p.rxtx,p.cabletype,p.usingport,p.bridgeport,p.disableport,p.availableport,p.reference,p.usage,p.connectstat,p.latestupdate);
    }else{
      contents += dbshow.MDF(p._id,p.sharenum,p.portname,p.nodename,p.oppnodename,p.portnumber,p.porttype,p.rxtx,p.cabletype,p.usingport,p.bridgeport,p.disableport,p.availableport,p.reference,p.usage,p.connectstat,p.latestupdate);
    }
  }
  return contents
}

dbshow.MDF = function(_id,sharenum,portname,nodename,oppnodename,portnumber,porttype,rxtx,cabletype,usingport,bridgeport,disableport,availableport,reference,usage,connectstat,latestupdate){
	var cablecolor = 'gray';
	if(cabletype=="optical"){
		cablecolor = 'yellow';
	}
	var set_disable_list = '<option selected></option>';
	for(var i = 1;i<=portnumber;i++){
		set_disable_list += `<option class="diset${i}" value='${i}'>${i}번 포트</option>`
	}
	var remove_disable_list = '<option selected></option>';
	for(var i = 1;i<=portnumber;i++){
		remove_disable_list += `<option class="disrem${i}" value='${i}' style="display:none">${i}번 포트</option>`
	}
  var port_height = 9.3 + 2.2*Math.ceil(portnumber/5);

  var plus_ports = "";
  for(var i = 1;i<=portnumber;i++){
    
    plus_ports += `
<span id="nUm" class="num n${i}">${i}</span><input type="text" value="" class="usage u${i}" style="display:none;">
<input type="text" class="ref r${i}" style="display:none;">`
  }

	return `
	<script>

	function spread_p${sharenum}(self){
		if(self.value === '펼쳐보기'){
			if(${portnumber}<21){
				document.querySelector("#p${sharenum}").style.height = '((${portnumber} * 2) + 9.3)rem';
			}
			else if(${portnumber}>20 && ${portnumber}<41){
				document.querySelector("#p${sharenum} .portsinport").style.width = '26rem';
				document.querySelector("#p${sharenum}").style.width = '26rem';
				document.querySelector("#p${sharenum}").style.height = (parseInt(${portnumber}/2) + (${portnumber}%2)) *2.2 + 9.3 + 'rem';
			}else if(${portnumber}>40 && ${portnumber}<61){
				document.querySelector("#p${sharenum} .portsinport").style.width = '39rem';
				document.querySelector("#p${sharenum}").style.width = '39rem';
				document.querySelector("#p${sharenum}").style.height = ((parseInt(${portnumber}/3) + Math.floor(Math.sqrt(${portnumber}%3)))*2.2) + 9.3 + 'rem';
			}else if(${portnumber}>60 && ${portnumber}<81){
				document.querySelector("#p${sharenum} .portsinport").style.width = '52rem';
				document.querySelector("#p${sharenum}").style.width = '52rem';
				document.querySelector("#p${sharenum}").style.height = ((parseInt(${portnumber}/4) + Math.floor(Math.sqrt(${portnumber}%4)))*2.2) + 9.3 + 'rem';
			}else if(${portnumber}>80 && ${portnumber}<101){
				document.querySelector("#p${sharenum} .portsinport").style.width = '65rem';
				document.querySelector("#p${sharenum}").style.width = '65rem';
				document.querySelector("#p${sharenum}").style.height = ((parseInt(${portnumber}/5) + Math.floor(Math.sqrt(Math.sqrt(${portnumber}%5))))*2.2) + 9.3 + 'rem';
			}else if(${portnumber}>100 && ${portnumber}<121){
				document.querySelector("#p${sharenum} .portsinport").style.width = '78rem';
				document.querySelector("#p${sharenum}").style.width = '78rem';
				document.querySelector("#p${sharenum}").style.height = ((parseInt(${portnumber}/6) + Math.floor(Math.sqrt(Math.sqrt(${portnumber}%6))))*2.2) + 9.3 + 'rem';
			}else if(${portnumber}>120 && ${portnumber}<129){
				document.querySelector("#p${sharenum} .portsinport").style.width = '91rem';
				document.querySelector("#p${sharenum}").style.width = '91rem';
				document.querySelector("#p${sharenum}").style.height = ((parseInt(${portnumber}/7) + Math.floor(Math.sqrt(Math.sqrt(${portnumber}%7))))*2.2) + 9.3 + 'rem';
			}
			for(var i = 1;i<=${portnumber};i++){
				document.querySelector('#p${sharenum} .u'+i).style.display='inline';
				document.querySelector('#p${sharenum} .r'+i).style.display='inline';
			}
			self.value = '닫기'
		}else{
			document.querySelector("#p${sharenum}").style.height = '${port_height}rem';
			if(${portnumber}>20){
				document.querySelector("#p${sharenum} .portsinport").style.width = '13rem';
				document.querySelector("#p${sharenum}").style.width = '13rem';
			}
			for(var i = 1;i<=${portnumber};i++){
				document.querySelector('#p${sharenum} .u'+i).style.display='none';
				document.querySelector('#p${sharenum} .r'+i).style.display='none';
			}
			self.value = '펼쳐보기'
		}
	}
	</script>
<div class="mdf100 full" id="p${sharenum}" style="height:${port_height}rem;">
<div id="disable_party_none" style="display: none">
<form action="/delete_port" method="post" class="deleting_port" onsubmit="return checkDeletePort(${sharenum})">
		<input type="hidden" name="thisnode" value="${nodename}">
		<input type="hidden" name="sharenum" value="${sharenum}">
		<input type="hidden" class="Oppnode" name="oppnode" value="${oppnodename}">
		<input type="submit" class="deleteport" id="deleteport_none" title="포트 삭제" value="포트 삭제" style="display: none;">
</form>
	<select class="set_disable_select">
		${set_disable_list}
	</select>
	<input type="button" class="set_disable_button" id=${sharenum} value="불량설정" onclick="setting_disable(this)">
	<select class="remove_disable_select">
		${remove_disable_list}
	</select>
	<input type="button" class="remove_disable_button" id=${sharenum} value="불량해제" onclick="removing_disable(this)">
</div>
<input type="hidden" class="portnumber" value="${portnumber}">
<div class="port_controlers">
<span style="border-bottom:solid 0.5rem ${cablecolor}" class="nodetitle">
${oppnodename}
<input type="hidden" class="port_sharenum" value="${sharenum}">
</span>
<span class="porttitle">
<input type="hidden" class="port_Name" value="${portname}">
${portname}
</span>
<span class="label able">사용가능</span>
<span id="capable" class="display">${portnumber}</span>
<span class="label disable">불량</span>
<span id="Disable" class="display">0</span>
<span class="label ing">사용중</span>
<span id="occupying" class="display">0</span>
<span class="label bridge">브릿지</span>
<span id="Bridge" class="display">0</span>
<input type="button" class="spread" value="펼쳐보기" onclick="spread_p${sharenum}(this)">
<span class="h port">포트</span>
<span class="h use">용도</span>
<span class="h refer">비고</span>
</div>
<div class="portsinport">
${plus_ports}
</div>
</div>`
}

dbshow.CDF_E1 = function(_id,sharenum,portname,nodename,oppnodename,portnumber,porttype,rxtx,cabletype,usingport,bridgeport,disableport,availableport,reference,usage,connectstat,latestupdate){
	var cablecolor = 'gray';
	if(cabletype=="optical"){
		cablecolor = 'yellow';
	}
	var set_disable_list = '<option selected></option>';
	for(var i = 1;i<=portnumber;i++){
		set_disable_list += `<option class="diset${i}" value='${i}'>${i}번 포트</option>`
	}
	var remove_disable_list = '<option selected></option>';
	for(var i = 1;i<=portnumber;i++){
		remove_disable_list += `<option class="disrem${i}" value='${i}' style="display:none">${i}번 포트</option>`
	}

  var rtx;
  if(portnumber>32 && portnumber <65){
      plus_ports = ""
      for(var i = 1;i<=portnumber;i++){
        if(rxtx === 'TX'){
          if(i%2 != 0 && (i-1)%4 === 0){
            rtx = "TX";
          }else if(i%2 != 0 && (i-1)%4 != 0){
            rtx = "RX";
          }else{
            rtx = "";
          }
        }else{
          if(i%2 != 0 && (i-1)%4 === 0){
            rtx = "RX";
          }else if(i%2 != 0 && (i-1)%4 != 0){
            rtx = "TX";
          }else{
            rtx = "";
          }
        }
        if(i === 1 || i === 33){
          plus_ports += `
<div class="CDF_E1_32row"><div class="CDF_E1_row"><span id="nUm" class="num n${i}">${i}</span><input type="text" class="usage u${i}" style="display:none;">
<input type="text" class="ref r${i}" style="display:none;" value="${rtx}"></div>`
        }else if(i === 32 || i === portnumber){
          plus_ports += `
    <div class="CDF_E1_row"><span id="nUm" class="num n${i}">${i}</span><input type="text" class="usage u${i}" style="display:none;">
    <input type="text" class="ref r${i}" style="display:none;" value="${rtx}"></div></div>`
        }else{
          plus_ports += `
<div class="CDF_E1_row"><span id="nUm" class="num n${i}">${i}</span><input type="text" class="usage u${i}" style="display:none;">
<input type="text" class="ref r${i}" style="display:none;" value="${rtx}"></div>`
        }
      }
      var port_width = 20.8;
  }else if(portnumber>64 && portnumber <97){
    plus_ports = ""
    for(var i = 1;i<=portnumber;i++){
      if(rxtx === 'TX'){
        if(i%2 != 0 && (i-1)%4 === 0){
          rtx = "TX";
        }else if(i%2 != 0 && (i-1)%4 != 0){
          rtx = "RX";
        }else{
          rtx = "";
        }
      }else{
        if(i%2 != 0 && (i-1)%4 === 0){
          rtx = "RX";
        }else if(i%2 != 0 && (i-1)%4 != 0){
          rtx = "TX";
        }else{
          rtx = "";
        }
      }
      if(i === 1 || i === 33 || i === 65){
        plus_ports += `
<div class="CDF_E1_32row"><div class="CDF_E1_row"><span id="nUm" class="num n${i}">${i}</span><input type="text" class="usage u${i}" style="display:none;">
<input type="text" class="ref r${i}" style="display:none;" value="${rtx}"></div>`
      }else if(i === 32 || i === 64 || i === portnumber){
          plus_ports += `
    <div class="CDF_E1_row"><span id="nUm" class="num n${i}">${i}</span><input type="text" class="usage u${i}" style="display:none;">
    <input type="text" class="ref r${i}" style="display:none;" value="${rtx}"></div></div>`
      }else{
        plus_ports += `
<div class="CDF_E1_row"><span id="nUm" class="num n${i}">${i}</span><input type="text" class="usage u${i}" style="display:none;">
<input type="text" class="ref r${i}" style="display:none;" value="${rtx}"></div>`
      }
    }
    var port_width = 31.2;
  }else if(portnumber>97){
    plus_ports = ""
    for(var i = 1;i<=portnumber;i++){
      if(rxtx === 'TX'){
        if(i%2 != 0 && (i-1)%4 === 0){
          rtx = "TX";
        }else if(i%2 != 0 && (i-1)%4 != 0){
          rtx = "RX";
        }else{
          rtx = "";
        }
      }else{
        if(i%2 != 0 && (i-1)%4 === 0){
          rtx = "RX";
        }else if(i%2 != 0 && (i-1)%4 != 0){
          rtx = "TX";
        }else{
          rtx = "";
        }
      }
      if(i === 1 || i === 33 || i === 65 || i === 97){
        plus_ports += `
<div class="CDF_E1_32row"><div class="CDF_E1_row"><span id="nUm" class="num n${i}">${i}</span><input type="text" class="usage u${i}" style="display:none;">
<input type="text" class="ref r${i}" style="display:none;" value="${rtx}"></div>`
      }else if(i === 32 || i === 64 || i === 96 || i === portnumber){
        plus_ports += `
<div class="CDF_E1_row"><span id="nUm" class="num n${i}">${i}</span><input type="text" class="usage u${i}" style="display:none;">
<input type="text" class="ref r${i}" style="display:none;" value="${rtx}"></div></div>`
      }else{
        plus_ports += `
<div class="CDF_E1_row"><span id="nUm" class="num n${i}">${i}</span><input type="text" class="usage u${i}" style="display:none;">
<input type="text" class="ref r${i}" style="display:none;" value="${rtx}"></div>`
      }
    }
    var port_width = 41.6;
  }else{
    plus_ports = ""
    for(var i = 1;i<=portnumber;i++){
      if(rxtx === 'TX'){
        if(i%2 != 0 && (i-1)%4 === 0){
          rtx = "TX";
        }else if(i%2 != 0 && (i-1)%4 != 0){
          rtx = "RX";
        }else{
          rtx = "";
        }
      }else{
        if(i%2 != 0 && (i-1)%4 === 0){
          rtx = "RX";
        }else if(i%2 != 0 && (i-1)%4 != 0){
          rtx = "TX";
        }else{
          rtx = "";
        }
      }
      if(i===1){
        plus_ports += `
<div class="CDF_E1_32row"><div class="CDF_E1_row"><span id="nUm" class="num n${i}">${i}</span><input type="text" class="usage u${i}" style="display:none;">
<input type="text" class="ref r${i}" style="display:none;" value="${rtx}"></div>`
      }else if(i===portnumber){
        plus_ports += `
<div class="CDF_E1_row"><span id="nUm" class="num n${i}">${i}</span><input type="text" class="usage u${i}" style="display:none;">
<input type="text" class="ref r${i}" style="display:none;" value="${rtx}"></div></div>`
      }else{
        plus_ports += `
<div class="CDF_E1_row"><span id="nUm" class="num n${i}">${i}</span><input type="text" class="usage u${i}" style="display:none;">
<input type="text" class="ref r${i}" style="display:none;" value="${rtx}"></div>`
      }
    }
    var port_width = 10.4;
  }


	return `
	<script>
	function spread_p${sharenum}(self){
		var height_on = (Math.ceil(${portnumber}/32)*9.3) + 9.3 +'rem';
		var width_on = '102.88rem';
		if(self.value === '펼쳐보기'){
			self.value = '닫기'
			for(var i = 1;i<=${portnumber};i++){
				document.querySelector('#p${sharenum} .u'+i).style.display='inline';
				document.querySelector('#p${sharenum} .r'+i).style.display='inline';
			}
			document.querySelector("#p${sharenum} .portsinport").className = 'portsinport_on';
			document.querySelector("#p${sharenum}").style.height = height_on;
			document.querySelector("#p${sharenum}").style.width = width_on;
			for(var i = 0;i<Math.ceil(${portnumber}/32);i++){
				document.querySelector("#p${sharenum} .CDF_E1_32row").className = 'CDF_E1_32row_on';
			}
		}else{
			self.value = '펼쳐보기'
			for(var i = 1;i<=${portnumber};i++){
				document.querySelector('#p${sharenum} .u'+i).style.display='none';
				document.querySelector('#p${sharenum} .r'+i).style.display='none';
			}
			document.querySelector("#p${sharenum} .portsinport_on").className = 'portsinport';
			for(var i = 0;i<Math.ceil(${portnumber}/32);i++){
				document.querySelector("#p${sharenum} .CDF_E1_32row_on").className = 'CDF_E1_32row';
			}
			document.querySelector("#p${sharenum} .portsinport").style.width = '${port_width}rem';
			document.querySelector("#p${sharenum}").style.width = '${port_width}rem';
			document.querySelector("#p${sharenum}").style.height = '18.1rem';
		}
	}
	</script>
	<div class="CDF_E1" id="p${sharenum}">
	<div id="disable_party_none" style="display: none">
	<form action="/delete_port" method="post" class="deleting_port" onsubmit="return checkDeletePort(${sharenum})">
	    <input type="hidden" name="thisnode" value="${nodename}">
	    <input type="hidden" name="sharenum" value="${sharenum}">
	    <input type="hidden" class="Oppnode" name="oppnode" value="${oppnodename}">
	    <input type="submit" class="deleteport" id="deleteport_none" title="포트 삭제" value="포트 삭제" style="display: none;">
	</form>
	  <select class="set_disable_select">
	    ${set_disable_list}
	  </select>
	  <input type="button" class="set_disable_button" id=${sharenum} value="불량설정" onclick="setting_disable(this)">
	  <select class="remove_disable_select">
	    ${remove_disable_list}
	  </select>
	  <input type="button" class="remove_disable_button" id=${sharenum} value="불량해제" onclick="removing_disable(this)">
	</div>
	<input type="hidden" class="portnumber" value="${portnumber}">
	<div class="port_controlers">
	<span style="border-bottom:solid 0.5rem ${cablecolor}" class="nodetitle">
  ${oppnodename}
	<input type="hidden" class="port_sharenum" value="${sharenum}">
	</span>
	<span class="porttitle">
  ${portname}
	<input type="hidden" class="port_Name" value="${portname}">
	</span>
	<span class="label able">사용가능</span>
	<span id="capable" class="display">${portnumber}</span>
	<span class="label disable">불량</span>
	<span id="Disable" class="display">0</span>
	<span class="label ing">사용중</span>
	<span id="occupying" class="display">0</span>
	<span class="label bridge">브릿지</span>
	<span id="Bridge" class="display">0</span>
	<input type="button" class="spread" value="펼쳐보기" onclick="spread_p${sharenum}(this)">
	<span class="h port">포트</span>
	<span class="h use">용도</span>
	<span class="h refer">비고</span>
	</div>
	<div class="portsinport" style="width:${port_width}rem">
	${plus_ports}
	</div>
	</div>`
}

module.exports = dbshow;
