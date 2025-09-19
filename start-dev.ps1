Write-Host "Starting Terminal Amplify with Live Server..." -ForegroundColor Green
Set-Location frontend
Start-Process "http://localhost:5500"
npx live-server --port=5500 --open=/index.html --no-browser
