var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var template = require('./lib/template.js');
var dbshow = require('./dbshow.js');

//몽고디비 모듈 사용
var MongoClient =require('mongodb').MongoClient;

var db;
var counterdb;
MongoClient.connect('mongodb://localhost:27017/local', function(err,client){
	if(err) {return console.log(err)}
		console.log('conncected with DB')
		db = client.db('connectdata');
		counterdb = client.db('counter');
});

var app = http.createServer(function(request,response){
	var _url = request.url;
	var queryData = url.parse(_url,true).query;
	var pathname = url.parse(_url,true).pathname;
	if(pathname === '/'){
		var nodelist = [];
		db.listCollections().toArray(function(err,collections){
			for(var i = 0;i<collections.length;i++){
				nodelist.push(collections[i].name);
			}
		if(queryData.id === undefined || nodelist.indexOf(queryData.id) === -1){
			fs.readFile(`./HOME/HOME.css`,'utf8',function(err,CSS){
				fs.readFile(`./linebook.js`,'utf8',function(err,JS){
					var HTML = template.HOME_HTML(CSS,JS,nodelist);
					response.writeHead(200);
					response.end(HTML);
				});
			});
		}else{
			fs.readFile(`./linebook.css`,'utf8',function(err,CSS){
				fs.readFile(`./CDF_E1.css`,'utf8',function(err,CDF_E1){
					fs.readFile(`./MDF.css`,'utf8',function(err,MDF){
						fs.readFile(`./linebook.js`,'utf8',function(err,JS){
							var title = queryData.id;
							var list = template.List(nodelist,title);
							var newportform = template.NEWPORTFORM(nodelist,title);
							db.collection(title).find().toArray(function(err,result){
								var porttotal = result.length;
						    var TEST = dbshow.showport(porttotal,result);
								var HTML = template.HTML(title,CSS,CDF_E1,MDF,JS,list,TEST,newportform);
								response.writeHead(200);
								response.end(HTML);
							});
						});
					});
				});
			});
		}
	});
	//새로운 노드 만들기

	}else if(pathname==='/create_newnode'){
		var body = '';
		request.on('data',function(data){
			body = body + data;
		});
		request.on('end',function(){
			var post = qs.parse(body);
			var title = post.node_name;
			//디비에 해당 노드 이름의 콜렉션 생성
			db.createCollection(title,function(err,collection){
				response.writeHead(302, {Location:encodeURI(`/?id=${title}`)})
				response.end();
			});
		});

	//노드 변경사항 저장하기 (텍스트 값의 변경사항만 적용)

	}else if(pathname==="/save"){
		var body = '';
		request.on('data',function(data){
			body = body + data;
		});
		request.on('end',function(){
			var post = qs.parse(body);
			var thisnode = post.thisnode;
			var save_content = post.save_content;
			fs.unlink(`./data/${thisnode}`,function(err){
			})
			fs.writeFile(`./data/${thisnode}`,save_content,"utf8",function(err){
			})
			response.writeHead(302,{Location:encodeURI(`/?id=${thisnode}`)});
			response.end();
		});
	//연결 정보 저장
	}else if(pathname==="/connect_save"){
		var body = '';
		request.on('data',function(data){
			body = body + data;
		});
		request.on('end',function(){
			var post = qs.parse(body);
			var str_scratch = post.save_whole;
			var center_name = post.center_name_s;
			var west_node = post.west_node_s;
			var east_node = post.east_node_s;
			var w_share = post.west_port_sharenum;
			var e_share = post.east_port_sharenum;
			var upload_log_file = post.upload_log_file;
			var str = str_scratch;

			//연결 기록 파일에 저장
			fs.unlink(`./connectdata/${center_name}`,function(err){
			});
			fs.writeFile(`./connectdata/${center_name}`,upload_log_file,'utf8',function(err){
			});
      //디비에 연결정보 저
      // var db;
      // MongoClient.connect('mongodb://localhost:27017/local', function(err,client){
      //   if(err) {return console.log(err)}
      //     console.log('conncected with DB')
      //   db = client.db('connectdata');
      //   db.collection(center_name).insertMany([{name:'James',age:20},{name:'Merry',age:19}],function(err,result){
      //     console.log('save complete')
      //   });
      // });
			//////////////////////////////////////////////////////////////////////
			//west_content 만들기
			var match1 = str.match(/<!--shar.numS/);
			var match2 = str.match(/shar.numS-->/);
			//연결관리 페이지가 빈 상태에서 하는게 아니라는 보장
			if(match1 !== null){
				var shareindex1 = str.indexOf(match1)+13;
				var shareindex2 = str.indexOf(match2);

				var west_sharenum = str.slice(shareindex1,shareindex2);

				var pattern1 = new RegExp("<!--shar.numS"+west_sharenum+"shar.numS-->");
				var pattern2 = new RegExp("<!--shar.numE"+west_sharenum+"shar.numE-->")

				var match1 = str.match(pattern1);
				var match2 = str.match(pattern2);

				var contentindex1 = str.indexOf(match1);
				var contentindex2 = str.indexOf(match2)+25+west_sharenum.toString().length;

				var west_content = str.slice(contentindex1,contentindex2);

				str = str.slice(0,contentindex1) + str.slice(contentindex2);
			}

			//east_content 만들기
			var match1 = str.match(/<!--shar.numS/);
			var match2 = str.match(/shar.numS-->/);
			if(match1 !== null){
				var shareindex1 = str.indexOf(match1)+13;
				var shareindex2 = str.indexOf(match2);

				var east_sharenum = str.slice(shareindex1,shareindex2);

				var pattern1 = new RegExp("<!--shar.numS"+east_sharenum+"shar.numS-->");
				var pattern2 = new RegExp("<!--shar.numE"+east_sharenum+"shar.numE-->")

				var match1 = str.match(pattern1);
				var match2 = str.match(pattern2);

				var contentindex1 = str.indexOf(match1);
				var contentindex2 = str.indexOf(match2)+25+east_sharenum.toString().length;

				var east_content = str.slice(contentindex1,contentindex2);
			}

			fs.readFile(`./data/${center_name}`,'utf8',function(err,data){
				//west_port 저장
				if(west_content !== undefined && west_sharenum !== undefined){
				var west_index1 = data.indexOf(`<!--sharenumS${west_sharenum}sharenumS-->`);
				var west_index2 = data.indexOf(`<!--sharenumE${west_sharenum}sharenumE-->`) +25+ west_sharenum.toString().length;

				var new_content1 = data.slice(0,west_index1);
				var new_content2 = data.slice(west_index2);

				var data = new_content1 + west_content + new_content2;
				var new_content_t = data;
				}
				//east_port 저장
				if(east_content !== undefined && east_sharenum !== undefined){
				var east_index1 = data.indexOf(`<!--sharenumS${east_sharenum}sharenumS-->`);
				var east_index2 = data.indexOf(`<!--sharenumE${east_sharenum}sharenumE-->`)+ 25 + east_sharenum.toString().length;

				var new_content1 = data.slice(0,east_index1);
				var new_content2 = data.slice(east_index2);

				var new_content_t = new_content1 + east_content + new_content2;
				}

				fs.unlink(`./data/${center_name}`,function(err){
				});

				fs.writeFile(`./data/${center_name}`,new_content_t,"utf8",function(err){
				});
			});
			response.writeHead(302,{Location:encodeURI(`/connect_control`)});
			response.end();
		});
	//새로운 포트 만들기
	}else if(pathname==="/create_newport"){
		var body = '';
		request.on('data',function(data){
			body = body + data;
		});
		request.on('end',function(){
			var post = qs.parse(body);
			var thisnode = post.thisnode;
			var port_name = post.port_name;
			var thisnode = post.thisnode;
			var oppnode = post.oppnode;
			var cable_type = post.cable_type;
			var port_type = post.port_type;
			var port_number = post.port_number;
			var port_number_selfInput = post.port_number_selfInput;
			var tr = post.TR;
			var opp_tr;
			var sharenum;
			var plus_port = "";
			var this_id;
			var opp_id;
			var latestupdate = Date();

			//포트 넘버 처리
			if(port_number==='others'){
				port_number = port_number_selfInput;
			}
			port_number = Number(port_number);

			//TX,RX 처리
			if(tr === "TX"){
				opp_tr = "RX";
			}else if(tr === "RX"){
				opp_tr = "TX";
			}else{
				opp_tr = "none";
				tr = "none"
			}

			//avaliable port,reference, usage, connectstat처리
			var available = [];
			var reference = {};
			var usage = {};
			var connectstat = {};

			for(var i = 1;i<=port_number;i++){
				available.push(i);
				reference[i] = "";
				usage[i] = "";
				connectstat[i] = [];
			}

			//_id 및 sharenum 처리
			counterdb.collection('id_counter').findOne({_id : 'id_counter'},function(err,id_result){
				counterdb.collection('sharenum_counter').findOne({_id : 'sharenum_counter'},function(err,sharenum_result){
				//DB에 해당 포트 정보 생성, id_counter에 새로운 id 나가고, sharenum_counter에도 새로운 sharenum 나가고.
						this_id = id_result.id_counter;
						opp_id = this_id + 1;
					 	sharenum = sharenum_result.sharenum_counter;

				  	db.collection(thisnode).insertOne({
							_id : this_id,
							sharenum : sharenum,
							portname : port_name,
							nodename : thisnode,
							oppnodename : oppnode,
							portnumber : port_number,
							porttype: port_type,
							rxtx : tr,
							cabletype : cable_type,
							usingport : [],
							bridgeport : [],
							disableport : [],
							availableport : available,
							reference : reference,
							usage : usage,
							connectstat : connectstat,
							latestupdate : latestupdate
						},function(err,result){
							if(err) return console.log(err);
						});

						db.collection(oppnode).insertOne({
							_id : opp_id,
							sharenum : sharenum,
							portname : port_name,
							nodename : oppnode,
							oppnodename : thisnode,
							portnumber : port_number,
							porttype: port_type,
							rxtx : opp_tr,
							cabletype : cable_type,
							usingport : [],
							bridgeport : [],
							disableport : [],
							availableport : available,
							reference : reference,
							usage : usage,
							connectstat : connectstat,
							latestupdate : latestupdate
						},function(err,result){
							if(err) return console.log(err);
						});

						if(port_type==='CDF_E1'){
							var rtx;
							if(port_number>32 && port_number <65){
									plus_port = ""
									for(var i = 1;i<=port_number;i++){
										if(tr === 'TX'){
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
											plus_port += `
					<div class="CDF_E1_32row"><div class="CDF_E1_row"><span id="nUm" class="num n${i}">${i}</span><input type="text" class="usage u${i}" style="display:none;">
					<input type="text" class="ref r${i}" style="display:none;" value="${rtx}"></div>`
										}else if(i === 32 || i === port_number){
											plus_port += `
								<div class="CDF_E1_row"><span id="nUm" class="num n${i}">${i}</span><input type="text" class="usage u${i}" style="display:none;">
								<input type="text" class="ref r${i}" style="display:none;" value="${rtx}"></div></div>`
										}else{
											plus_port += `
					<div class="CDF_E1_row"><span id="nUm" class="num n${i}">${i}</span><input type="text" class="usage u${i}" style="display:none;">
					<input type="text" class="ref r${i}" style="display:none;" value="${rtx}"></div>`
										}
									}
									var port_width = 20.8;
							}else if(port_number>64 && port_number <97){
								plus_port = ""
								for(var i = 1;i<=port_number;i++){
									if(tr === 'TX'){
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
										plus_port += `
				<div class="CDF_E1_32row"><div class="CDF_E1_row"><span id="nUm" class="num n${i}">${i}</span><input type="text" class="usage u${i}" style="display:none;">
				<input type="text" class="ref r${i}" style="display:none;" value="${rtx}"></div>`
									}else if(i === 32 || i === 64 || i === port_number){
											plus_port += `
								<div class="CDF_E1_row"><span id="nUm" class="num n${i}">${i}</span><input type="text" class="usage u${i}" style="display:none;">
								<input type="text" class="ref r${i}" style="display:none;" value="${rtx}"></div></div>`
									}else{
										plus_port += `
				<div class="CDF_E1_row"><span id="nUm" class="num n${i}">${i}</span><input type="text" class="usage u${i}" style="display:none;">
				<input type="text" class="ref r${i}" style="display:none;" value="${rtx}"></div>`
									}
								}
								var port_width = 31.2;
							}else if(port_number>97){
								plus_port = ""
								for(var i = 1;i<=port_number;i++){
									if(tr === 'TX'){
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
										plus_port += `
				<div class="CDF_E1_32row"><div class="CDF_E1_row"><span id="nUm" class="num n${i}">${i}</span><input type="text" class="usage u${i}" style="display:none;">
				<input type="text" class="ref r${i}" style="display:none;" value="${rtx}"></div>`
									}else if(i === 32 || i === 64 || i === 96 || i === port_number){
										plus_port += `
				<div class="CDF_E1_row"><span id="nUm" class="num n${i}">${i}</span><input type="text" class="usage u${i}" style="display:none;">
				<input type="text" class="ref r${i}" style="display:none;" value="${rtx}"></div></div>`
									}else{
										plus_port += `
				<div class="CDF_E1_row"><span id="nUm" class="num n${i}">${i}</span><input type="text" class="usage u${i}" style="display:none;">
				<input type="text" class="ref r${i}" style="display:none;" value="${rtx}"></div>`
									}
								}
								var port_width = 41.6;
							}else{
								plus_port = ""
								for(var i = 1;i<=port_number;i++){
									if(tr === 'TX'){
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
										plus_port += `
				<div class="CDF_E1_32row"><div class="CDF_E1_row"><span id="nUm" class="num n${i}">${i}</span><input type="text" class="usage u${i}" style="display:none;">
				<input type="text" class="ref r${i}" style="display:none;" value="${rtx}"></div>`
									}else if(i===port_number){
										plus_port += `
				<div class="CDF_E1_row"><span id="nUm" class="num n${i}">${i}</span><input type="text" class="usage u${i}" style="display:none;">
				<input type="text" class="ref r${i}" style="display:none;" value="${rtx}"></div></div>`
									}else{
										plus_port += `
				<div class="CDF_E1_row"><span id="nUm" class="num n${i}">${i}</span><input type="text" class="usage u${i}" style="display:none;">
				<input type="text" class="ref r${i}" style="display:none;" value="${rtx}"></div>`
									}
								}
								var port_width = 10.4;
							}
						}else{
							plus_port = ""
							for(var i = 1;i<=port_number;i++){
								plus_port += `
		<span id="nUm" class="num n${i}">${i}</span><input type="text" class="usage u${i}" style="display:none;">
		<input type="text" class="ref r${i}" style="display:none;">`
							}
							var port_height = 9.3 + 2.2*Math.ceil(port_number/5);
						}


					counterdb.collection('id_counter').updateOne({_id : 'id_counter'},{$inc : {id_counter : 2}},function(err,result){
					});
					counterdb.collection('sharenum_counter').updateOne({_id : 'sharenum_counter'},{$inc : {sharenum_counter : 1}},function(err,result){
					});
				});
			});

				//port_number에 맞게 포트를 만들어 준다.
				//포트별 높이도 포트수에 따라 조정해준다.(포트끼리 화면상에서 겹치는 것 방지)

				//CDF_E1 포트 만들기 높이 설정 플렉스 박스 나누기 32개 이하 일 경우, 64개 이하일 경우, 96개 이하일 경우, 128개 이하일 경우
	});

		//node 삭제 --------- 해당 노드를 삭제할 시 그 노드의 있는 포트들의 반대편 노드 단자들이 반대편 노드에 아직 남아있을 시 오류 발생
		// 노드를 삭제하면 해당 노드와 연결된 모든 포트들도 삭제되어야함. or 포트를 삭제할시 반대편 노드가 없는경우 그냥 넘어가는 프로세스 만들기

	}else if(pathname==="/delete_process"){
		var body = '';
		request.on('data',function(data){
			body = body + data;
		});
		request.on('end',function(){
			var post = qs.parse(body);
			var id = post.id;
			//DB의 해당 노드 컬렉션 삭제
			db.collection(id).drop(function(err,delok){
				response.writeHead(302, {Location:`/`});
				response.end();
			});
		});

//포트 삭제
	}else if(pathname==="/delete_port"){
		var body = '';
		request.on('data',function(data){
			body = body + data;
		});
		request.on('end',function(){
			var post = qs.parse(body);
			var thisnode = post.thisnode;
			var oppnode = post.oppnode;
			var sharenum = post.sharenum;
			numin = Number(sharenum);
			//db에서 해당 DOC삭제
			db.collection(thisnode).deleteOne({sharenum : numin},function(err,result){
				if(err) throw err;
				db.collection(oppnode).deleteOne({sharenum : numin},function(err,result){
					if(err) throw err;
					response.writeHead(302,{Location:encodeURI(`/?id=${thisnode}`)});
					response.end();
				});
			});
		});

//연결관리 connect_control

	}else if(pathname==="/connect_control"){
		var nodelist = [];
		db.listCollections().toArray(function(err,collections){
			for(var i = 0;i<collections.length;i++){
				nodelist.push(collections[i].name);
			}
			fs.readFile(`./connection/connection.css`,'utf8',function(err,CSS){
				fs.readFile(`./connection/connection.js`,'utf8',function(err,JS){
					fs.readFile(`./CDF_E1.css`,'utf8',function(err,CDF_E1){
						fs.readFile(`./MDF.css`,'utf8',function(err,MDF){
							var blank_option = '<option selected value=""></option>';
							var HTML = template.connect_control(CSS,CDF_E1,MDF,JS,nodelist,blank_option,blank_option,"","","","","");
							response.writeHead(200);
							response.end(HTML);
						});
					});
				});
			});
		});
	//연결관리 중 노드 옵션에 따른 opp노드의 옵션 자동 변화
	}else if(pathname==="/connect_search"){
		var body = '';
		request.on('data',function(data){
			body = body + data;
		});
		request.on('end',function(){
			var post = qs.parse(body);
			var center_name = post.center_name;
			var west_name = post.west_name;
			var east_name = post.east_name;
			var center_change = post.center_change;
			var west_change = post.west_change;
			var east_change = post.east_change;
			var west_specific = post.west_specific;
			var east_specific = post.east_specific;
			var west_port = "";
			var east_port = "";

			//현재노드의 파일을 불러와서 드랍리스트에 넣을 목록을 가져온다.
			db.collection(center_name).find().toArray(function(err,result){
				if(result)
				result.forEach(function(element){
					var deng = element.oppnodename;
				});
				var log_file = "";
				//해당 노드에 포트가 하나도 없으면
				// }else{
				// 	west_port = '연결관리를 하려면 먼저 해당 노드에 포트를 생성하십시오';
				// 	east_port = '연결관리를 하려면 먼저 해당 노드에 포트를 생성하십시오';
				// }
				fs.readFile(`./connection/connection.css`,'utf8',function(err,CSS){
					fs.readFile(`./connection/connection.js`,'utf8',function(err,JS){
						fs.readFile(`./CDF_E1.css`,'utf8',function(err,CDF_E1){
							fs.readFile(`./MDF.css`,'utf8',function(err,MDF){
									//파일로 기록된 연결 정보를 불러와서 선을 긋기 위한 좌표를 생성한다.
									// fs.readFile(`./connectdata/${center_name}`,'utf8',function(err,log_file){
										var HTML = template.connect_control(CSS,CDF_E1,MDF,JS,nodelist,west_opp,east_opp,center_name,west_id,east_id,west_port,east_port,log_file);
										response.writeHead(200);
										response.end(HTML);
									// });
								});
							});
						});
					});
				});
			});
	//연결 한번에 보기
	}else if(pathname==="/see_connect_all"){
		var body = '';
		request.on('data',function(data){
			body = body + data;
		});
		request.on('end',function(){
			var post = qs.parse(body);
			var node_search = post.node_search;
			var node_change = post.node_change;
			var opp_node_search = post.opp_node_search;
			var opp_node_change = post.opp_node_change;
			var id_search = post.id_search;
			var id_change = post.id_change;
			var num_search = post.num_search;
			var max_request = post.max_request;

			//node_list 전송
			fs.readdir('./data',function(error,filelist){
				if(node_search !== undefined){
					var node_list = `<option selected value="${node_search}">${node_search}</option>`
				}else{
					var node_list = `<option selected value=""></option>`
				}
				var k = 0;
				for(var i = 0;i<filelist.length;i++){
					if(k===0 && filelist[i] === node_search){
						k += 1;
						continue;
					}
					node_list += `<option value="${filelist[i]}">${filelist[i]}</option>`;
				}
				//opp_node_list 전송
				fs.readFile(`./data/${node_search}`,'utf8',function(err,nodefile_org){
					var nodefile = nodefile_org;
					//node_search 값이 있어서 nodefile을 찾았으면
					if(nodefile !== undefined){
						//만약 opp_node_search 값이 없는데 node_search 값은 있어서 nodefile은 있다면
						if(opp_node_search === undefined || opp_node_search === ""){
							var opp_node_list = `<option selected value=""></option>`;
						//만약 opp_node_search 값이 있고 node_search 값이 바뀌지 않아서 node_change가 0이라면
						}else if((opp_node_search !== "" && opp_node_search !== undefined) && node_change === "0"){
							var opp_node_list = `<option selected value="${opp_node_search}">${opp_node_search}</option>`;
						//만약 opp_node_search 값이 있고 node_search 값이 바뀌어서 node_change가 1이라면
						}else if((opp_node_search !== "" && opp_node_search !== undefined) && node_change === "1"){
							var opp_node_list = `<option selected value=""></option>`;
						}
						var port_sum = nodefile.match(/<!--sharenumS/g);
						//만약 node_search값도 있고 nodefile에 저장된 포트도 있다면
						if(port_sum !== null){
							var k =0;
							for(var i = 0;i<port_sum.length;i++){
								var index1 = nodefile.indexOf('<!--OppNodeS') + 12;
								var index2 = nodefile.indexOf('OppNodeS-->');
								var opp_node = nodefile.slice(index1,index2);
								var index3 = nodefile.indexOf('<!--sharenumS');
								var index4 = nodefile.indexOf('sharenumE-->') + 12;
								if(k===0 && opp_node === opp_node_search && node_change === '0'){
									k += 1;
									nodefile = nodefile.slice(0,index3) + nodefile.slice(index4);
									continue;
								}
								opp_node_list += `<option value="${opp_node}">${opp_node}</option>`;
								nodefile = nodefile.slice(0,index3) + nodefile.slice(index4);
							}
							//id_list 전송
							//id_list가 전송되는 경우의 수 : 1.노드가 있고 반대노드가 있을때 (노드가 변경되면 ""을 전송,반대노드가 변경되면 selected를 ""을 전송)
							if(opp_node_search !== undefined && opp_node_search !== ""){
								if(node_change==='1'){
									var id_list = `<option selected value=""></option>`;
								}else if(node_change==='0' && opp_node_change ==='1'){
									var id_list = `<option selected value=""></option>`;
								}else if(node_change==='0' && opp_node_change ==='0' && (id_search==="" || id_search === undefined)){
									var id_list = `<option selected value=""></option>`;
								}else if(node_change==='0' && opp_node_change ==='0' && (id_search!=="" && id_search !== undefined)){
									var id_list = `<option value="${id_search}">${id_search}</option>`;
								}
								if(node_change!=='1'){
									var nodefile = nodefile_org;
									var k =0;
									for(var i = 0;i<port_sum.length;i++){
										var index1 = nodefile.indexOf('<!--OppNodeS') + 12;
										var index2 = nodefile.indexOf('OppNodeS-->');
										var opp_node = nodefile.slice(index1,index2);

										var index3 = nodefile.indexOf('<!--sharenumS');
										var index4 = nodefile.indexOf('sharenumE-->') + 12;

										if(opp_node_search === opp_node){
											var index5 = nodefile.indexOf(`<!--port'sporttitleS-->`)+23;
											var index6 = nodefile.indexOf(`<!--port'sporttitleE-->`);
											var id = nodefile.slice(index5,index6);
											if(k===0 && id===id_search && opp_node_change === '0'){
												nodefile =  nodefile.slice(0,index3) + nodefile.slice(index4);
												k = 1;
												continue;
											}
											id_list += `<option value="${id}">${id}</option>`;
										}
										nodefile =  nodefile.slice(0,index3) + nodefile.slice(index4);
									}
								}
								//max_number 전송
								if(node_change==='1'){
									var max_number = "none";
								}else if(node_change==='0' && opp_node_change ==='1'){
									var max_number = "none";
								}else if(node_change==='0' && opp_node_change ==='0' && (id_search==="" || id_search === undefined)){
									var max_number = "none";
								}else if(node_change==='0' && opp_node_change ==='0' && (id_search!=="" && id_search !== undefined) && (num_search==="" || num_search=== undefined)){
									var nodefile = nodefile_org;
									for(var i = 0;i<port_sum.length;i++){
										var index1 = nodefile.indexOf('<!--OppNodeS') + 12;
										var index2 = nodefile.indexOf('OppNodeS-->');
										var opp_node = nodefile.slice(index1,index2);

										var index3 = nodefile.indexOf('<!--sharenumS');
										var index4 = nodefile.indexOf('sharenumE-->') + 12;

										if(opp_node_search === opp_node){
											var index5 = nodefile.indexOf(`<!--port'sporttitleS-->`)+23;
											var index6 = nodefile.indexOf(`<!--port'sporttitleE-->`);
											var id = nodefile.slice(index5,index6);
											if(id === id_search){
												var index7 = nodefile.indexOf(`<!--portnumberS`)+15;
												var index8 = nodefile.indexOf(`portnumberE-->`);
												var max_number = nodefile.slice(index7,index8);
												break;
											}
										}
										nodefile =  nodefile.slice(0,index3) + nodefile.slice(index4);
									}
								}else if(node_change==='0' && opp_node_change ==='0' && (id_search!=="" && id_search !== undefined) && (num_search!=="" && num_search!== undefined) && id_change === '1'){
									var nodefile = nodefile_org;
									for(var i = 0;i<port_sum.length;i++){
										var index1 = nodefile.indexOf('<!--OppNodeS') + 12;
										var index2 = nodefile.indexOf('OppNodeS-->');
										var opp_node = nodefile.slice(index1,index2);

										var index3 = nodefile.indexOf('<!--sharenumS');
										var index4 = nodefile.indexOf('sharenumE-->') + 12;

										if(opp_node_search === opp_node){
											var index5 = nodefile.indexOf(`<!--port'sporttitleS-->`)+23;
											var index6 = nodefile.indexOf(`<!--port'sporttitleE-->`);
											var id = nodefile.slice(index5,index6);
											if(id === id_search){
												var index7 = nodefile.indexOf(`<!--portnumberS`)+15;
												var index8 = nodefile.indexOf(`portnumberE-->`);
												var max_number = nodefile.slice(index7,index8);

												var index9 = nodefile.indexOf('<!--sharenumS')+13;
												var index10 = nodefile.indexOf('sharenumS-->');
												var search_sharenum = nodefile.slice(index9,index10);
												break;
											}
										}
										nodefile =  nodefile.slice(0,index3) + nodefile.slice(index4);
									}
									// 모든 값이 정해지고 난 이후!!
								}else if(node_change==='0' && opp_node_change ==='0' && (id_search!=="" && id_search !== undefined) && (num_search!=="" && num_search!== undefined) && id_change === '0'){
									var nodefile = nodefile_org;
									for(var i = 0;i<port_sum.length;i++){
										var index1 = nodefile.indexOf('<!--OppNodeS') + 12;
										var index2 = nodefile.indexOf('OppNodeS-->');
										var opp_node = nodefile.slice(index1,index2);

										var index3 = nodefile.indexOf('<!--sharenumS');
										var index4 = nodefile.indexOf('sharenumE-->') + 12;

										if(opp_node_search === opp_node){
											var index5 = nodefile.indexOf(`<!--port'sporttitleS-->`)+23;
											var index6 = nodefile.indexOf(`<!--port'sporttitleE-->`);
											var id = nodefile.slice(index5,index6);
											if(id === id_search){
												var index7 = nodefile.indexOf(`<!--portnumberS`)+15;
												var index8 = nodefile.indexOf(`portnumberE-->`);
												var max_number = nodefile.slice(index7,index8);

												var index9 = nodefile.indexOf('<!--sharenumS')+13;
												var index10 = nodefile.indexOf('sharenumS-->');
												var search_sharenum = nodefile.slice(index9,index10);
												break;
											}
										}
										nodefile =  nodefile.slice(0,index3) + nodefile.slice(index4);
									}


									var num_request = num_search;
									var max_number = max_request;

									//포트가 특정되었으니 해당 노드 부터 노드별로 특정된 포트와 연결되어 있는 모든 포트를 불러온다. 불러온 포트블럭을 더블 클릭하면 해당 노드로 이동.
									var port_data = `<div class="connected_port">
									<div class="connected_node">노드이름:${node_search}</div>
									<div class="connected_opp">반대노드:${opp_node_search}</div>
									<div class="connected_id">포트이름:${id_search}</div>
									<div class="connected_num">포트번호:${num_search}</div>
									</div>`

									var collect_opp = {};

									//<p0(num n1),p2[num n2]>;

									fs.readFile(`./connectdata/본부중대`,'utf8',function(err,connection_info_org){
										var connection_info = connection_info_org;
										var pattern_front = `<p${search_sharenum}(num n${num_search})`;
										var pattern_back = `,p${search_sharenum}[num n${num_search}]>;`;

										var matched_front = connection_info.indexOf(pattern_front);
										var matched_back = connection_info.indexOf(pattern_back);

										if(matched_front !== '-1' || matched_back !== '-1'){
											var info_length = connection_info.match(/;/g).length;
											for(var i = 0;i<info_length;i++){
												var index1 = connection_info.indexOf('<');
												var index2 = connection_info.indexOf(';')+1;
												var div_info = connection_info.slice(index1,index2);
												console.log(div_info);
											}
										}
									});


										// var connection_info = connection_info_org;
										// console.log(connection_info)
										// var pattern_front = `<p${search_sharenum}(num n${num_search})`;
										// var pattern_back = `,p${search_sharenum}[num n${num_search}]>;`;
										// var matched_front = connection_info.match(pattern_front);
										// var matched_back = connection_info.match(pattern_back);
										// console.log(matched_front)

				//먼저 해당 포트가 위치한 노드의 연결관리 파일을 읽어서 해당 포트와 연결된 포트를 하나 하나 찾는다. 하나 이상 있을경우 먼저 그 포트를 전송하고
				//, 그 포트의 반대노드를 object에 저장(처음 해당포트의 반대노드를 제일 먼저 저장). 만약 해당포트와 연결된 포트가 브릿지 되어있는 상태일 경우(연결된 포트를 전송후 그 포트와 그 노드의 연결된 포트가 있는지 확인)
				//, 그 포트들도 전부 전송하고 반대노드를 object에 저장. 해당노드가 끝났으면 object에 저잗되어있는 노드들을 하나씩 읽으면서 그 노드들에서 더이상 연결된 포트가 없어 반대노드가 안나올때까지 돌린다.
								}
							}
						//만약 node_search값이 있는데 nodefile에 저장된 포트가 없다면
						}else{
							var opp_node_list = "";
							var id_list = "";
							var max_number = "none";
							var num_request = "";

						}
					//node_search 값이 없어서 nodefile을 못찾았으면
					}else{
						var opp_node_list = "";
						var id_list = "";
						var max_number = "none";
						var num_request = "";
					}
					if(port_data===undefined){
						var port_data = "";
					}
					fs.readFile(`./see_connect_all/see_connect_all.css`,'utf8',function(err,CSS){
						fs.readFile(`./see_connect_all/see_connect_all.js`,'utf8',function(err,JS){
							var HTML = template.see_connect_all(CSS,JS,node_list,opp_node_list,id_list,max_number,num_request,port_data);
							response.writeHead(200);
							response.end(HTML);
						});
					});
				});
			});
		});
		//먼저 백에서 dir에 있는 노드리스트를 띄우고 프론트에서 노드를 선택한다. 그러면 백으로 전송되어서 해당 노드에 있는 반대 노드리스트를 전송한다.(clear)
		//다시 프론트에서 반대 노드 리스트 중 하나를 선택하면 백으로 전송되어서 해당 반대 노드에 있는 포트 이름리스트를 전송한다. 만약 이 단계에서 유저가 노드리스트를 재선택하면 그 노드에 맞는 반대노드 리스트를 띄운다.
		//다시 프론트에서 해당 노드의 반대노드의 포트이름 중 하나를 선택하면 백으로 전송되어서 특정된 포트의 단자 수를 파악해서 1에서 그 수까지 제한하는 number input으로 띄우고 디폴트는 1로 해서 바로 1의 포트의 연결 상태를 출력
		//만약 이 단계에서 노드리스트를 재선택하면 포트이름 리스트는 없어지고 반대노드리스트만 남는다. 반대노드 리스트를 재선택시 포트 이름 리스트까지만 남고 포트 번호 input은 사라진다.

	//비고나 용도를 통한 검색
	}else if(pathname==="/searching"){
		var body = '';
		request.on('data',function(data){
			body = body + data;
		});
		request.on('end',function(){
			var post = qs.parse(body);
			var search_str = post.search_str;
			//검색하고자하는 스트링을 받아온다.

			//노드별로 데이터를 잘라서 안보이게 출력한다. 검색 스트링과 겹치는 비고나 용도가 있으면 해당 데이터를 분석해서 노드이름, 반대노드이름, 포트이름, 해당 포트 번호, 용도, 비고를

			//데이터들을 하나씩
		});
	}else{
		response.writeHead(404);
		response.end('Not found');
	}
});
app.listen(3000);
