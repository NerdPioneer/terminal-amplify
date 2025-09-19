@echo off
echo Starting Terminal Amplify with Live Server...
cd frontend
start http://localhost:5500
npx live-server --port=5500 --open=/index.html --no-browser
