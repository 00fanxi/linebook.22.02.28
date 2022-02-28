function openConnection(){
	window.open("https://study-nodejs-admrb.run.goorm.io/connect_control", "connection","toolbar=yes,scrollbars=yes,resizable=yes,top=20,left=400,width=800,height=950")
}

//filter

//노드, 반대노드, 이름, 번호를 변할 때마다 서버로 보내서 노드는 dir에 있는 값과 비교, 
function submitting_connect_all_node(){
	document.querySelector('.node_change').value=1;
	document.querySelector('.form_connect_all').submit();
}

function submitting_connect_all_opp(){
	document.querySelector('.opp_node_change').value=1;
	document.querySelector('.form_connect_all').submit();
}

function submitting_connect_all_id(){
	document.querySelector('.id_change').value=1;
	document.querySelector('.form_connect_all').submit();
}

function submitting_connect_all_num(){
	var num_search = document.querySelector('.num_search').value;
	var max_request = document.querySelector('.max_request').value;
	
	if(Number.isInteger(Number(num_search)) && Number(num_search) <= Number(max_request)){
		document.querySelector('.form_connect_all').submit();
	}else{
		alert(`선택하신 포트에 없는 포트번호 입니다. 1에서 ${max_request}까지의 정수 중 하나를 선택하여 주십시오.`)
	}
}

function submitting_connect_all(){
	document.querySelector('.form_connect_all').submit();
}


