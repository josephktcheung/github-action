const AdmZip = require("adm-zip");
const fetch = require("node-fetch");
const core = require("@actions/core");
const github = require("@actions/github");

const main = async () => {
  const myToken = core.getInput('githubToken');
  const octokit = github.getOctokit(myToken);
  const fileUrl = await octokit.repos.downloadArchive({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    archive_format: "zipball",
    ref: github.context.ref,
  });
  
  const response = await fetch(fileUrl.url);
  const buffer = await response.buffer();

  const zip = new AdmZip(buffer);
  const zipEntries = zip.getEntries();
  console.log("zip entries", zipEntries);
  zipEntries.forEach((entry) => {
    console.log(entry.toString());
  });
}

main();
