/**
 * Created by admin on 15/10/29.
 */
var http = require('http').Server;
var io = require('..');
var fs = require('fs');
var join = require('path').join;
	var ioc = require('socket.io-client');
var request = require('supertest');
var expect = require('expect.js');

// Creates a socket.io client for the given server
function client(srv, nsp, opts) {
	if ('object' == typeof nsp) {
		opts = nsp;
		nsp = null;
	}
	var addr = srv.address();
	if (!addr) addr = srv.listen().address();
	var url = 'ws://localhost:' + addr.port + (nsp || '');
	return ioc(url, opts);
}

var a = io('localhost:6001/user',{
	forceNew: true
});

a.on('connect', function (s) {
	console.log("connected");
});


//it('should be able to close sio sending a port', function () {
//	//for (var i = 0; i < 1001; i++) {
//	//	ioc('ws://interactnode.daily.tmall.net:6001');
//	//
//	//	if (i == 1000) done();
//	//}
//
//	//var a = ioc.connect('interactnode.daily.tmall.net:6001/user',{
//	//	forceNew: true
//	//});
//
//	var a = io('localhost:6001/user',{
//		forceNew: true
//	});
//
//	a.on('connect', function (s) {
//		done();
//	});
//
//	//if (i == 1000) done();
//});