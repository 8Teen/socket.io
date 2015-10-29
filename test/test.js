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

it('should be able to set authorization and succeed', function (done) {
	var httpSrv = http();
	var srv = io(httpSrv);
	srv.set('authorization', function (o, f) {
		f(null, true);
	});

	srv.on('connection', function (s) {
		s.on('yoyo', function (data) {
			expect(data).to.be('data');
			done();
		});
	});

	var socket = client(httpSrv);
	socket.on('connect', function () {
		socket.emit('yoyo', 'data');
	});

	socket.on('error', function (err) {
		expect().fail();
	});
});
