import io from 'socket.io-client';
import React from 'react';
import ReactDOM from 'react-dom';
import Hello from './hello.jsx';
import OnlineUserList from './components/onlineuserlist.jsx';
import SubMsg from './components/submsg.jsx';
import ShowMsg from './components/showmsg.jsx';

let socket = io.connect('ws://localhost:8000');
let logStateInfo = true;
let theUserName = null;
let onlineUser = null;

socket.on(`logstate`, info => {
	if (info === 'false') {
		logStateInfo = false
		alert('嘀嘀嘀，学生卡，账号或者密码不正确')
	} else if (info === 'same') {
		logStateInfo = false
		alert('报告长官，此账号已登录')
	} else {
		ReactDOM.render(<Box />, document.getElementById('chat'));
	}
	console.log('logstate: ' + info)
})

class LogIn extends React.Component {
	logIn(e) {
		e.preventDefault();
		var userName = this.refs.userName.value.trim();
		var userPassword = this.refs.userPassword.value.trim();
		theUserName = userName;
		socket.emit('login', {
			'userName': userName,
			'userPassword': userPassword,
		})
		return;
	}
	render() {
		return (
			<div>
			<h1>遇见你真好</h1>
			<form className="commentForm" onSubmit={this.logIn.bind(this)} >
        		<input type="text" placeholder="账号" ref="userName" />
        		<input type="text" placeholder="密码" ref="userPassword" />
        		<input value="发射" type="submit" />
      		</form>
      		</div>
		);
	}
}
ReactDOM.render(<LogIn />, document.getElementById('chat'));


class Box extends React.Component { 
	constructor() {
			super()
			this.state = {
				onlineuser: []
			}
		}
		// static update(onuser) {
		// 		// let self = this;
		// 		this.setState({
		// 			onlineuser: onuser
		// 		})
		// 	}
		// componentDidMount() {
		// 	setInterval(this.update.bind(this), 100);
		// }
	getUser() {
		socket.on('loginUser', onuser => {
			console.log('在线用户: ' + onuser);
			console.log('人数' + onuser.length);
			this.setState({
				onlineuser: onuser,
				onlinenum: onuser.length,
			})
		})
		socket.on(`msg`, msg => {
			console.log('online user info',msg.message,msg.userName);
			this.setState({
				msg:msg.message,
				name:msg.userName,
			})
		})
	}
	componentDidMount() {
		this.getUser();
	}
	handleMessageSubmit(message) {
		socket.emit(`msg`, {
			'message': message,
			'userName': theUserName,
		})
	}
	render() {  
		return <div>
				<Hello />
				<OnlineUserList  name="lw" userList={ this.state.onlineuser } userNum={ this.state.onlinenum} />
				<ShowMsg />
				<SubMsg onMessageSubmit={ this.handleMessageSubmit.bind(this) } />
				</div> 
	}
}

socket.emit('disconnect', theUserName)

// userList={ this.state.onUser }
// class Chat extends React.Component {
// 	constructor() {
// 		super()
// 		this.state = {
// 			router:'/log'
// 		}
// 		socket.on(`logstate`, info => {
// 			if (info === 'false') {
// 				logStateInfo = false
// 				alert('嘀嘀嘀，学生卡，账号余额不足，请充值')
// 			} else if (info === 'same') {
// 				logStateInfo = false
// 				alert('报告长官，此账号已登录')
// 			} else {
// 				ReactDOM.render(<Box />, document.getElementById('chat'));
// 			}
// 			console.log(info)
// 		})
// 	}
// 	render() {
// 		let Child
// 		switch (this.state.route) {
// 			case '/room':
// 				Child = Box;
// 				break;
// 			case '/log':
// 				Child = LogIn;
// 				break;
// 			default:
// 				Child = LogIn;
// 		}
// 		return (
// 			<div>
//       <h1>App</h1>
//       <Child/>
//     </div>
// 		)
// 	}
// }