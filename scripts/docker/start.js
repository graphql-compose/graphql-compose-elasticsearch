/* eslint-disable no-console */

const cp = require('child_process');
const path = require('path');

const dockerImageName = 'elasticsearch-nodkz';
const version = process.argv[2] || 5;

function isDockerImageExists(imageNameWithTag) {
  const imageId = cp
    .execSync(`docker images -q ${imageNameWithTag}`, { cwd: '.' })
    .toString();
  return imageId && imageId.length > 0;
}

function buildDockerContainer(v) {
  const imageNameWithTag = `${dockerImageName}:${v}`;
  const dockerContextFolder = path.resolve(__dirname, `./es${v}`);
  console.log(
    `Building docker container ${imageNameWithTag} from ${dockerContextFolder}/Dockerfile ...`
  );
  cp.execSync(
    `docker build \
    -t ${imageNameWithTag} \
    ${dockerContextFolder}`,
    {
      cwd: dockerContextFolder,
      stdio: [0, 1, 2],
    }
  );
}

function runDockerContainer(v) {
  const imageNameWithTag = `${dockerImageName}:${v}`;
  if (!isDockerImageExists(imageNameWithTag)) {
    buildDockerContainer(v);
  }

  console.log(`Starting docker container ${imageNameWithTag} ...`);
  cp.execSync(`docker run -i --rm -p 9200:9200 ${imageNameWithTag}`, {
    stdio: [0, 1, 2],
  });
}

function removeDockerContainer(v) {
  const imageNameWithTag = `${dockerImageName}:${v}`;
  console.log(`Removing docker image ${imageNameWithTag} ...`);
  cp.execSync(`docker rmi  ${imageNameWithTag}`, { stdio: [0, 1, 2] });
}

function onExit() {
  removeDockerContainer(version);
  process.exit(0);
}
process.on('SIGINT', onExit); // catch ctrl-c
process.on('SIGTERM', onExit); // catch kill
runDockerContainer(version);
