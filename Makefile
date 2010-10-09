NODE=NODE_PATH=.:./lib:/opt/local/lib/node /opt/local/bin/node

all:

run:
	$(NODE) eg/server.js 

test: all
	$(NODE) test/*.js
