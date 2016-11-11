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

ubuntu:
	sudo apt-get install mysql-server python-pip build-essential python-dev libmysqlclient-dev npm nodejs

.PHONY: depends run init updatedb initdb ubuntu
