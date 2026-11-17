# Terminal Journal

Terminal-style journal and portfolio by [Ezekiel Obeisun Jr](https://github.com/NerdPioneer), a cybersecurity professional. The working piece is a static web terminal for notes, project summaries, and contact details. A Lambda function that would index Markdown logs in S3 is in the repository and is not deployed.

## What works today

The interface in `frontend/` is HTML, CSS, and JavaScript. Open `frontend/index.html` in a browser. There is no install or build step.

- A command line with history (up/down arrows) and Tab completion
- Commands that answer from the page itself: `help`, `logs`, `cat <filename>`, `projects`, `contact`, `status`, `tree`, `theme`, `clear`, `date`, `pwd`, `who`, `uname`, `echo`, `version`, `uptime`, `history`, `neofetch`, `matrix`, `weather`, `joke`, and `rss`. `help` lists aliases (`ls`, `cls`, `proj`, and others). None of these call AWS
- A desktop sidebar and a shorter mobile list of sample entries, both hardcoded in `frontend/script.js`
- Light and dark themes, a fullscreen toggle, and layouts for desktop and narrow screens

`cat` only recognizes three hardcoded names: `vpc-setup.md`, `lambda-deployment.md`, and `amplify-setup.md`. Those names differ from the files in `logs/` and from the titles in the sidebar.

`logs/` holds three sample Markdown entries. They stay in the repository. The page does not read them.

`lambda/generateMetadata.js` is a Node.js 18 handler. With `LOGS_BUCKET_NAME` set, it lists the `logs/` prefix, keeps `.md` objects, and writes `metadata/metadata.json` to the same bucket. The handler ignores its invocation event. It does not issue signed URLs, and the frontend does not call it. This repository does not deploy the function.

The root `package.json` still lists `react-scripts`. There is no React application here. The site that runs is `frontend/`.

## What is still planned

These pieces are described in the repo and are not running anywhere from this code:

- An S3 bucket for journal files, a deployed Lambda, an EventBridge rule, IAM roles, CloudFront, and an Amplify app
- `amplify.yml`, a static-site build spec that publishes the `frontend/` directory once an Amplify app is connected
- A real deploy step in `.github/workflows/deploy.yml`. The job is written to install Lambda dependencies with `npm ci`, zip the function, upload that zip as a workflow artifact, and then "deploy." The step named "Deploy to AWS" only prints a message and does not call AWS. `lambda/` has no lockfile, so `npm ci` cannot succeed as written and the job does not publish anything
- Loading `logs/` or `metadata.json` in the browser. New Markdown files do not appear in the terminal until the UI is changed to read them
- Private-object access through S3 signed URLs, encryption and backup configuration, and a CDN

The intended flow, after that work lands: store journal Markdown in S3, invoke the metadata Lambda from EventBridge, have the function refresh `metadata/metadata.json`, and have the terminal read that index. Hosting would serve `frontend/` (Amplify is the host named in `amplify.yml`). The handler would also need to honor the event instead of scanning the whole prefix. None of that is wired up.

The sample entries under `logs/` are written in the voice of completed setup notes (VPC, Lambda, Amplify). Treat them as sample journal copy. They are not a record of resources this repository deploys.

## Layout

```
terminal-amplify/
├── frontend/                      # Static terminal UI
│   ├── index.html
│   ├── styles.css
│   └── script.js
├── logs/                          # Sample journal Markdown (not loaded by the UI)
│   ├── 2025-09-01-vpc.md
│   ├── 2025-09-02-lambda-deployment.md
│   └── 2025-09-03-amplify-setup.md
├── lambda/                        # Metadata generator (source only)
│   ├── generateMetadata.js
│   └── package.json
├── .github/workflows/deploy.yml   # CI skeleton; AWS deploy step is a placeholder
├── amplify.yml                    # Static hosting build spec
├── package.json                   # Unused React script entries
└── README.md
```

## Run it locally

1. Clone the repository.
2. Open `frontend/index.html` in a browser.
3. Type `help`, or use the buttons under the prompt.

The Lambda is separate from the local site. Invoking it takes an S3 bucket, `LOGS_BUCKET_NAME`, and AWS credentials, which are outside this repository.

## Journal files

Files in `logs/` are named `YYYY-MM-DD-topic.md`. Each sample includes the topic, what was done, notes, and follow-ups. That is the shape the indexer is written to scan once a bucket exists.

## Contact

- **Website**: [1percentnerd.com](https://1percentnerd.com)
- **LinkedIn**: [linkedin.com/in/ezekiel-obeisun](https://linkedin.com/in/ezekiel-obeisun)
- **GitHub**: [github.com/NerdPioneer](https://github.com/NerdPioneer)

The `contact` command inside the terminal still shows `linkedin.com/in/nerdpioneer`. The current profile is the link above.

## License

MIT. See [LICENSE](LICENSE).

---

*"Every log is a step forward. 1% better each day."*
