const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
    const TENOR_TOKEN = core.getInput('TENOR_TOKEN');
    const GITHUB_TOKEN = core.getInput('GITHUB_TOKEN');
    const octokit = github.getOctokit(GITHUB_TOKEN);

    const url = `https://tenor.googleapis.com/v2/search?q=thank%20you&key=${TENOR_TOKEN}&limit=1&media_filter=gif,tinygif&random=true`;
    const response = await fetch(url);
    const { results } = await response.json();
    const gifUrl = results?.[0]?.media_formats?.tinygif?.url;


    const { context = {} } = github;
    const { pull_request } = context.payload;

    await octokit.rest.issues.createComment({
      ...context.repo,
      issue_number: pull_request.number,
      body: `Thank you for submitting a pull request! We will try to review this as soon as we can.\n\n<img src="${gifUrl}" alt="thank you" />`,
    });

}

run();