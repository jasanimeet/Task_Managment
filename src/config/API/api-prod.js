const protocol = 'http';
const host = 'newbizstart.iptime.org';
const port = '3093';
// const host = '192.168.10.105';
// const port = '5002';
const trailUrl = 'api/v1';

const hostUrl = `${protocol}://${host}${port ? ':' + port : ''}/`;
const endpoint = `${protocol}://${host}${(port ? ':' + port : '')}/${trailUrl}`;

export default {
    protocol: protocol,
    host: host,
    port: port,
    apiUrl: trailUrl,
    endpoint: endpoint,
    hostUrl: hostUrl
};
