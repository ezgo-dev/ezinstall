#!/usr/bin/python
import BaseHTTPServer
#import SimpleHTTPServer
import CGIHTTPServer

PORT = 8000
# SimpleHTTPServer
# Handler = SimpleHTTPServer.SimpleHTTPRequestHandler

# CGIHTTPSERVER
Handler = CGIHTTPServer.CGIHTTPRequestHandler

server_address = ('127.0.0.1', PORT) # 127.0.0.1 for localhost connection only
httpd = BaseHTTPServer.HTTPServer(server_address, Handler)

print httpd.socket.getsockname()

httpd.serve_forever()
