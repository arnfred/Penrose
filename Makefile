.PHONY: penrose

SHELL := /bin/bash

penrose: venv/bin/activate
	. venv/bin/activate && python server.py 8088

venv/bin/activate:
	python3 -m venv venv
	. venv/bin/activate && pip install -r requirements.txt

