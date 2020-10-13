import * as core from "@actions/core";
import * as github from "@actions/github";
import nodeFetch from "node-fetch";
import * as AdmZip from "adm-zip";
import { Dropbox } from "dropbox";
// const AdmZip = require("adm-zip");
// const nodeFetch = require("node-fetch");
// const core = require("@actions/core");
// const github = require("@actions/github");
// const Dropbox = require("dropbox");

const main = async () => {
  const myToken = core.getInput('githubToken');
  const octokit = github.getOctokit(myToken);
  const fileUrl = await octokit.repos.downloadArchive({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    archive_format: "zipball",
    ref: github.context.ref,
  });
  
  const response = await nodeFetch(fileUrl.url);
  const buffer = await response.buffer();


  const dbx = new Dropbox({
    accessToken: core.getInput("dropboxToken"),
  });

  const zip = new AdmZip(buffer);
  const zipEntries = zip.getEntries();
  console.log("zip entries", zipEntries);
  for (const entry of zipEntries) {
    const path = entry.entryName.split("/").slice(1).join("/");
    const response = await dbx.filesUpload({
      path: `/${github.context.repo.repo}/${path}`,
      contents: entry.getData(),
    });

    console.log("dbx response", response);
  }
  // fo  zipEntries.forEach((entry) => {
  //   console.log(entry.toString());
  // });

  
}

try {
  main();
} catch (error) {
  console.error(error);
}
