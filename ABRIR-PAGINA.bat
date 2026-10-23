@echo off
rem Abre o funil da Black Friday Explosiva no navegador (sempre a versão mais nova, sem cache).
cd /d "%~dp0"
start "" "http://localhost:5180/"
python "..\..\scripts\servidor-funil.py" 5180
