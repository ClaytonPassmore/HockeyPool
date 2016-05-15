depends:
	pip install --user -r requirements.txt

run:
	python Web/server.py

ubuntu:
	sudo apt-get install mysql-server python-pip build-essential python-dev libmysqlclient-dev
