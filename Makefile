export PYTHONPATH := $(shell pwd)
SEASON = 2015

depends:
	pip install --user -r requirements.txt

run:
	python Web/server.py

init: initdb updatedb

updatedb:
	python Scraper/db_manager.py $(SEASON) update

initdb:
	python Scraper/db_manager.py $(SEASON) initialize

system:
	wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.32.1/install.sh | bash
	. $(HOME)/.nvm/nvm.sh && nvm install 6.9.1 && nvm use 6.9.1
	sudo apt-get install mysql-server python-pip build-essential python-dev libmysqlclient-dev nodejs

.PHONY: depends run init updatedb initdb system
