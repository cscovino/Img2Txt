@echo off
cd ../localization
python localization.py
cd ../crop
python cropDir.py
cd ../transcript
python transcript.py
cd service
