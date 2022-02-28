var template ={
}
// 새로운 포트 만들기 폼
template.NEWPORTFORM = function(filelist,title,num){

	var oppoption = ''
	for(var i =0;i<filelist.length;i++){
		if(title===filelist[i]){
			continue;
		}
		oppoption = oppoption + `<option value="${filelist[i]}">${filelist[i]}</option>`;
	}

	return`
	<input type="button" class="createport" title="새 포트 생성" value="포트 생성" onclick="newportform()">

	<form action="/create_newport" class="newportform" method="post" onsubmit="return check_checking_double()">
		<input type="hidden" name="thisnode" value="${title}">
		<h2>새 포트 생성</h2>
		<label>1.장비 종류
			<select name="port_type" class="port_type" onchange="CDF_TR_check()">
				<option value="IDF">IDF 단자</option>
				<option value="CDF_E1">CDF-E1</option>
				<option value="MDF">MDF 단자</option>
				<option value="patch">패치판넬</option>
				<option value="fdf">FDF</option>
				<option value="hub">허브</option>
				<option value="switch">스위치</option>
				<option value="router">라우터</option>
				<option value="cypto">암호장비</option>
				<option value="csu">CSU</option>
				<option value="dsu">DSU</option>
				<option value="div">DIV</option>
				<option value="MSPP">MSPP</option>
			</select>
		</label>
		<div class="CDF_TR" style="display:none">
			<label>
				1번이 TX
				<input type="radio" class="TR" name="TR" value="TX">
			</label>
			<label>
				1번이 RX
				<input type="radio" class="TR" name="TR" value="RX">
			</label>
		</div>
		<label>
			2.케이블 종류
			<select name="cable_type" class="cable_type">
				<option value="coaxial">Coaxial</option>
				<option value="optical">Optical</option>
			</select>
		</label>
		<label>
		3.포트 수
		<select name="port_number" class="port_number" onchange="selfInput()">
			<option value="25">25p</option>
			<option value="42">42p</option>
			<option value="50">50p</option>
			<option value="75">75p</option>
			<option value="100">100p</option>
			<option value="128">128p</option>
			<option value="others">직접입력</option>
		</select>
		</label>
		<input type="number" class="port_number_selfInput" placeholder="직접입력." name="port_number_selfInput" min="5" max="128" style="display: none">
		<label>
		4.반대편 노드 선택
		<select class="selected_oppnode" name="oppnode">
			${oppoption}
		</select>
		</label>
		<label>5.반대편 장비 종류
		<select name="port_typeopp" class="port_typeopp">
			<option value="IDF">IDF 단자</option>
			<option value="CDF">CDF 단자</option>
			<option value="block">block 단자</option>
			<option value="patch">패치판넬</option>
			<option value="fdf">FDF</option>
			<option value="hub">허브</option>
			<option value="switch">스위치</option>
			<option value="router">라우터</option>
			<option value="cypto">암호장비</option>
			<option value="csu">CSU</option>
			<option value="dsu">DSU</option>
			<option value="div">DIV</option>
		</select>
		</label>
		<label class="port_name_part">
			6.이름 :
			<input type="text" name="port_name" class="port_name" onchange="cheking_double()" placeholder="사용목적 또는 번호" required pattern="^.{1,7}$">
			<input type="button" value="중복확인" onclick="cheking_double()">
			<input type="hidden" value="0" name="double_check" class="double_check">
		</label>
		<div style="color:red; font-size:0.8rem;">*7글자 이내로 작성</div>
		<div>
			<input type="button" class="newportquit" value="취소" onclick="newportquit()">
			<input type="submit" class="newportsubmit" value="생성">
		</div>
	</form>
	`
	}
//새로운 폴더 만들기 폼

//메인화면 HTML
template.HTML = function(title,CSS,CDF_E1,MDF,JS,list,data,newportform){
	return `
	<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<link rel="stylesheet" href="linebook.css">
	<link rel="stylesheet" href="CDF_E1.css">
	<title>${title}</title>
	<style>
		${CSS}
		${MDF}
		${CDF_E1}
	</style>

</head>
<body>
	<nav>
		<form action="/" method="post">
			<input type="submit" value="홈으로">
		</form>
		<form action="/save" method="post" onsubmit="saving_content()">
			<input type="submit" value="저장하기">
			<input type="hidden" name="thisnode" value="${title}">
			<input type="hidden" class="save_content" name="save_content">
		</form>
		<input type="button" value="내보내기">
		<input type="button" class="portcontrol" value="포트관리" onclick="portcontrol(this)">
		<form action="/see_connect_all" method="post">
			<input type="submit" value="연결된 포트 전부 보기">
		</form>
		<form action="/connect_control" method="post">
			<input type="submit" value="연결관리">
		</form>
		<input type="button" value="폴더생성">

		${newportform}
		<input type="button" class="search_string_submit" value="검색" onclick="searching_in_node()">
		<input type="text" class="search_string" placeholder="현재노드에서 찾고 싶으신 포트의 용도나 비고를 입력한 후 검색을 누르세요.">
	</nav>
<h1>
	${title}
</h1>
	<div class="homebody">
		${list}

		<div class="ports">

		<!--datastart-->

		${data}

		<!--dataend-->
		</div>
	</div>

	<script>
		${JS}
	</script>
</body>
</html>
	`;
}

//홈 화면 HTML
template.HOME_HTML = function(CSS,JS,filelist){
	var list = '<ul>';
	var i = 0;
	while(i<filelist.length){

		list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;

		i = i+1;
	}
	list = list + '</ul>';
	return `
	<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<link rel="stylesheet" href="linebook.css">
	<title>HOME</title>
	<style>
		${CSS}
	</style>

</head>
<body>
	<h1>
	선번장.com
	</h1>
	<nav>
		<form action="/see_connect_all" method="post">
			<input type="submit" value="연결된 포트 전부 보기">
		</form>
		<form action="/connect_control" method="post">
			<input type="submit" value="연결관리">
		</form>
	</nav>
	<h2>
		 노드 목록
		<input type="button" title="새 노드 생성" class="createnode" value="+" onclick="newnodeform()">
		<form action="/create_newnode" class="newnodeform" onsubmit="return checking_node_double()" method="post">
			<h2>새 노드 생성</h2>
			<input type="text" class="newnodetext" name="node_name" placeholder="생성할 노드 이름 입력" autofocus" pattern="^.{1,7}$">
			<div style="color:red; font-size:0.8rem; margin-top:0.3rem;">*7글자 이내로 작성</div>
			<input type="button" value="취소" class="newnodequit" onclick="newnodequit()">
			<input type="submit" value="생성" class="newnodesubmit">
		</form>
	</h2>
	${list}

	<script>
		${JS}
	</script>
</body>
</html>
	`;
}

//연결 한번에 보기 HTML
template.see_connect_all = function(CSS,JS,node_list,opp_node_list,id_list,max_number,num_request,port_data){
	if(max_number==="none" || max_number === undefined){
		var port_number = "";
	}else{
		var port_number = `<span class="icon">포트 번호 선택</span>
			<input type="hidden" class="max_request" name="max_request" value="${max_number}">
			<input type="number" class="num_search" name="num_search" value="${num_request}" placeholder="1~${max_number}" min="1" max="${max_number}">
			<input type="button" value="검색" onclick="submitting_connect_all_num()">`
	}


	return `
	<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<link rel="stylesheet" href="linebook.css">
	<title>연결된 포트 전부 보기</title>
	<style>
		${CSS}
	</style>

</head>
<body>
	<h1>
	연결된 포트 전부 보기
	</h1>
		<nav>
		<input type="button" value="내보내기">
		<form action="/" method="post">
			<input type="submit" value="홈으로">
		</form>
		<form action="/see_connect_all" method="post">
			<input type="submit" value="연결된 포트 전부 보기">
		</form>
		<input type="button" value="연결관리" onclick="openConnection()">
	</nav>
	<div class="homebody">

		<div class="search_input">
			<form action="/see_connect_all" class="form_connect_all" method="post">
				<span class="icon">노드 선택</span>
				<input type="hidden" class="node_change" name="node_change" value=0>
				<select class="node_search" name="node_search" onchange="submitting_connect_all_node()">
					${node_list}
				</select>
				<span class="icon">반대 노드 선택</span>
				<input type="hidden" class="opp_node_change" name="opp_node_change" value=0>
				<select class="opp_node_search" name="opp_node_search" onchange="submitting_connect_all_opp()">
					${opp_node_list}
				</select>
				<span class="icon">포트 이름 선택</span>
				<input type="hidden" class="id_change" name="id_change" value=0>
				<select class="id_search" name="id_search" onchange="submitting_connect_all_id()">
					${id_list}
				</select>
				${port_number}
			</form>
		</div>

		<div class="connected_ports">
			${port_data}
		</div>
	</div>

	<script>
		${JS}
	</script>
</body>
</html>
	`;
}

//노드리스트 화면에 들어가는 HTML
template.List = function(filelist,title){
	var list = '<ul>';
	var i = 0;
	while(i<filelist.length){

		list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;

		i = i+1;
	}
	list= list + `
	<input type="button" title="새 노드 생성" class="createnode" value="+" onclick="newnodeform()">

	<form action="/create_newnode" class="newnodeform" onsubmit="return checking_node_double()" method="post">
		<h2>새 노드 생성</h2>
		<input type="text" class="newnodetext" name="node_name" placeholder="생성할 노드 이름 입력" autofocus pattern="^.{1,7}$">
		<div style="color:red; font-size:0.8rem; margin-top:0.3rem;">*7글자 이내로 작성</div>
		<input type="button" value="취소" class="newnodequit" onclick="newnodequit()">
		<input type="submit" value="생성" class="newnodesubmit">
	</form>

	<form action="/delete_process" class="deleteform" method="post" onsubmit="return check()">
		<input type="hidden" name="id" value="${title}">
		<input type="submit" class="deletenode" value="-" title="현재 노드 삭제">
	</form>

	`;
	list = list + '</ul>';
	return list;
}

//연결관리
template.connect_control = function(CSS,CDF_E1,MDF,JS,filelist,west_opp,east_opp,center_name,west_specific,east_specific,west_port,east_port,log_file){

	var center_this = `<option selected value="${center_name}">${center_name}</option>`
	var k = 0;
	for(var i = 0;i<filelist.length;i++){
		if(k===0 && filelist[i] === center_name){
			k += 1;
			continue;
		}
		center_this += `<option value="${filelist[i]}">${filelist[i]}</option>`
	}

	return`
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>연결관리</title>
	<style>
		${CSS}
		${CDF_E1}
		${MDF}
	</style>
</head>
<body>
	<nav>
		<form action="/" method="post">
			<input type="submit" value="홈으로">
		</form>
		<input type="button" class="button" value="연결" onclick="connecting()">
		<input type="button" class="button" value="연결해제" onclick="disconnecting_ports()">
		<form action="/connect_save" class="connect_saver" method="post">
			<input type="hidden" class="upload_log_file" name="upload_log_file" value="${log_file}">
			<input type="hidden" class="west_port_sharenum" name="west_port_sharenum">
			<input type="hidden" class="east_port_sharenum" name="east_port_sharenum">
			<input type="hidden" class="center_name_s" name="center_name_s">
			<input type="hidden" class="west_node_s" name="west_node_s">
			<input type="hidden" class="east_node_s" name="east_node_s">
			<input type="hidden" class="save_whole" name="save_whole">
			<input type="button" class="button" value="저장" onclick="connect_saving();connect_submit()">
		</form>
	</nav>
	<form action="/connect_search" id="header_info" method="post">
		<div class="west">
			<label class="West_opp">
				P1
				<input type="hidden" value="0" name="west_change" class="west_change">
				<select class="west_opp" name="west_name" onchange="connect_searching_west()">
					${west_opp}
				</select>
			</label>
			<label class="West_name">
				이름
				<select class="west_name" name="west_specific" onchange="connect_searching()">
					${west_specific}
				</select>
			</label>
		</div>
		<div class="center">
			<label class="Center_this">
				현재 노드
					<input type="hidden" value="0" name="center_change" class="center_change">
					<select class="center_this" name="center_name" onchange="connect_searching_center()">
						${center_this}
					</select>
			</label>
		</div>
		<div class="east">
			<label class="East_opp">
				P2
				<input type="hidden" value="0" name="east_change" class="east_change">
				<select class="east_opp" name="east_name" onchange="connect_searching_east()">
					${east_opp}
				</select>
			</label>
			<label class="East_name">
				이름
				<select class="east_name" name="east_specific" onchange="connect_searching()">
					${east_specific}
				</select>
			</label>
		</div>
	</form>
	<div class="connecting_ports">
		<div class="west_port">
		 ${west_port}
		</div>

		<div class="east_port">
		${east_port}
		</div>
	</div>

	<script>
		${JS}
	</script>
</body>
</html>
	`
}

module.exports = template;
