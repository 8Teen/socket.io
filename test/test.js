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

it('should set the handshake BC object', function (done) {
	var httpSrv = http();
	var srv = io(httpSrv);

	srv.on('connection', function (s) {
		expect(s.handshake).to.not.be(undefined);

		// Headers set and has some valid properties
		expect(s.handshake.headers).to.be.an('object');
		expect(s.handshake.headers['user-agent']).to.be('node-XMLHttpRequest');

		// Time set and is valid looking string
		expect(s.handshake.time).to.be.a('string');
		expect(s.handshake.time.split(' ').length > 0); // Is "multipart" string representation

		// Address, xdomain, secure, issued and url set
		expect(s.handshake.address).to.contain('127.0.0.1');
		expect(s.handshake.xdomain).to.be.a('boolean');
		expect(s.handshake.secure).to.be.a('boolean');
		expect(s.handshake.issued).to.be.a('number');
		expect(s.handshake.url).to.be.a('string');

		console.log(JSON.stringify(s.handshake));

		// Query set and has some right properties
		expect(s.handshake.query).to.be.an('object');
		expect(s.handshake.query.EIO).to.not.be(undefined);
		expect(s.handshake.query.transport).to.not.be(undefined);
		expect(s.handshake.query.t).to.not.be(undefined);

		done();
	});

	var socket = client(httpSrv);
});