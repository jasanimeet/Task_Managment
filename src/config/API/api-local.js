const protocol = 'http';
// const host = 'newbizstart.iptime.org';
// const port = '3093';
const host = '193.194.195.101';
const port = '8010';
const trailUrl = 'api/';

const hostUrl = `${protocol}://${host}${port ? ":" + port : ""}/`;
const endpoint = `${protocol}://${host}${port ? ":" + port : ""}/${trailUrl}`;

export default {
  protocol: protocol,
  host: host,
  port: port,
  apiUrl: trailUrl,
  endpoint: endpoint,
  hostUrl: hostUrl,
};
