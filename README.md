# Terminal Journal

Terminal-style journal by [Ezekiel Obeisun Jr](https://github.com/NerdPioneer), a cybersecurity professional. The site is the static terminal in `frontend/`. The repository also contains `lambda/generateMetadata.js`, a Node.js 18 handler that lists Markdown objects under an S3 `logs/` prefix and writes `metadata/metadata.json`. This repository does not deploy that function.

## The terminal

The interface is HTML, CSS, and JavaScript. Open `frontend/index.html` in a browser. There is no install or build step.

- A command line with history (up/down arrows) and Tab completion
- Commands that answer from the page itself: `help`, `logs`, `cat`, `projects`, `contact`, `status`, `tree`, `theme`, `clear`, `date`, `pwd`, `who`, `uname`, `echo`, `version`, `uptime`, `history`, `neofetch`, `matrix`, `weather`, `joke`, and `rss`. `help` lists aliases (`ls`, `cls`, `proj`, and others). None of these call AWS
- A desktop sidebar and a shorter mobile list of three sample entries, both hardcoded in `frontend/script.js`
- Light and dark themes, a fullscreen toggle, and layouts for desktop and narrow screens

The `logs` command lists `vpc-setup.md`, `lambda-deployment.md`, and `amplify-setup.md`. Those names differ from the sidebar titles and from the files in `logs/`.

`logs/` holds three Markdown files. The page does not read them.

The root `package.json` lists `react-scripts`. There is no React application in the repository. The site that runs is `frontend/`.

## Lambda source

`lambda/generateMetadata.js` reads `LOGS_BUCKET_NAME`, lists the `logs/` prefix, keeps `.md` objects, and writes `metadata/metadata.json` to that bucket. The handler does not read its invocation event, does not issue signed URLs, and is not called by the frontend.

## Other files

- `amplify.yml` is a static-site build spec. The build phase prints messages and publishes the `frontend/` directory.
- `.github/workflows/deploy.yml` checks out the repo, sets up Node 18, runs `npm ci` in `lambda/`, zips the function, prints a message from the step named "Deploy to AWS", and uploads `function.zip` as a workflow artifact. `lambda/` has no lockfile, so `npm ci` fails. The deploy step does not call AWS.

## Layout

```
terminal-amplify/
├── frontend/                      # Static terminal UI
│   ├── index.html
│   ├── styles.css
│   └── script.js
├── logs/                          # Markdown notes (not loaded by the UI)
│   ├── 2025-09-01-vpc.md
│   ├── 2025-09-02-lambda-deployment.md
│   └── 2025-09-03-amplify-setup.md
├── lambda/                        # Metadata generator source
│   ├── generateMetadata.js
│   └── package.json
├── .github/workflows/deploy.yml   # Packages a zip; the AWS step prints a message
├── amplify.yml                    # Static-site build spec
├── package.json                   # React script entries with no React app
└── README.md
```

## Run it locally

1. Clone the repository.
2. Open `frontend/index.html` in a browser.
3. Type `help`, or use the buttons under the prompt.

The Lambda handler is separate from the local site. It reads `LOGS_BUCKET_NAME` and uses AWS credentials for the S3 calls in `generateMetadata.js`.

## Journal files

Files in `logs/` are named `YYYY-MM-DD-topic.md`. Each file is a dated Markdown note. The terminal does not load these files.

## Contact

- **Website**: [1percentnerd.com](https://1percentnerd.com)
- **LinkedIn**: [linkedin.com/in/ezekiel-obeisun](https://linkedin.com/in/ezekiel-obeisun)
- **GitHub**: [github.com/NerdPioneer](https://github.com/NerdPioneer)

## License

MIT. See [LICENSE](LICENSE).
