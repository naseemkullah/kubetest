'use strict';

const mysql = require('mysql');

const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '$KUBETEST_DB_PASSWORD',
  database : 'kube_test'
});

connection.connect();

module.exports = {
  recordAccess,
  getLastAccess,
};

function recordAccess(from) {
  const values = {
    date: new Date(),
    from,
  };

  return new Promise((resolve, reject) => {
    connection.query('INSERT INTO access SET ?', values, function (err) {
      if (err) {
        return reject(err);
      }

      resolve();
    });
  });
}

function getLastAccess() {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM access ORDER BY date DESC LIMIT 1', function (err2, results) {
      if (err2) {
        return reject(err2);
      }

      if (results.length) {
        resolve(results[0]);
      } else {
        resolve();
      }
    });
  });
}