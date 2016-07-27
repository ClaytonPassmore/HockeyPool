export PYTHONPATH := $(shell pwd)
SEASON1 = 2015
SEASON2 = 2016
PLAYOFFS = 1

depends:
	pip install --user -r requirements.txt

run:
	python Web/server.py

init: initdb populatedb updatedb

updatedb:
	python Scraper/update.py

populatedb:
	python Scraper/populate.py $(SEASON1) $(SEASON2) $(PLAYOFFS)

initdb:
	python SQL/create.py

ubuntu:
	sudo apt-get install mysql-server python-pip build-essential python-dev libmysqlclient-dev python-mysqldb

.PHONY: depends run init updatedb populatedb initdb ubuntu
