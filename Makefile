NODE=NODE_PATH=.:./lib:/opt/local/lib/node /opt/local/bin/node

all:

run:
	$(NODE) eg/server.js 

test: all
	for t in `ls test/*.js`; do \
		$(NODE) $${t}; \
	done
