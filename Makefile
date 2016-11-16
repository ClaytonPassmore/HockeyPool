export PYTHONPATH := $(shell pwd)
SEASON = 2015
VENV = $(shell pwd)/venv
VPY = $(VENV)/bin/python

depends:
	pip install -r requirements.txt --target venv/lib/python2.7/site-packages/ -q

run:
	$(VPY) Web/server.py

init: initdb updatedb

updatedb:
	$(VPY) Scraper/db_manager.py $(SEASON) update

initdb:
	$(VPY) Scraper/db_manager.py $(SEASON) initialize

system:
	sudo apt-get install mysql-server python-pip build-essential python-dev libmysqlclient-dev nodejs
	wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.32.1/install.sh | bash
	. $(HOME)/.nvm/nvm.sh && nvm install 6.9.1 && nvm use 6.9.1
	pip install --user virtualenv
	python -m virtualenv $(VENV)

.PHONY: depends run init updatedb initdb system
