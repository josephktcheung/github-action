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
  console.log("fileUrl", fileUrl);
  
  const response = await fetch(fileUrl);

  const zip = new AdmZip(response.buffer());
  const zipEntries = zip.getEntries();
  zipEntries.forEach((entry) => console.log(entry.toString()));
}

main();
