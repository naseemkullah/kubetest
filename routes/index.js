const express = require('express');
const os = require('os');
const datasource = require('../datasource');

const router = express.Router();
const ip = getIpAddress();

/* GET home page. */
router.get('/', async function (req, res) {
  const from = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const access = await datasource.getLastAccess();

  res.render('index', { title: 'DevOps Test', access, ip });

  datasource.recordAccess(from);
});

module.exports = router;

function getIpAddress() {
  const interfaces = os.networkInterfaces();
  let ip;

  Object.keys(interfaces).forEach((key) => {
    const inter = interfaces[key];

    for (let i = 0; i < inter.length; i++) {
      if (inter[i].family === 'IPv4' && !inter[i].internal) {
        ip = inter[i].address;
        break;
      }
    }
  });

  if (!ip) {
    ip = os.hostname();
  }

  return ip;
}