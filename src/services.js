export class Services {
  _csvToChartData(data) {
    return data.split(/\n/).map(item => {
      const line = item.split(',');
      return line.map(dataItem => !isNaN(dataItem) ? parseInt(dataItem) : dataItem);
    });
  }

  // assuming that all objects will have the same properties;
  _jsonToChartData(data) {
    const keys =  Object.keys(data[0]);

    return [keys].concat(data.map(item => {
      let values = [];

      keys.forEach((key) => values.push(item[key]));
      return values;
    }));
  }

  request(path, parse = false) {
    return new Promise((resolve, reject) => {
      fetch(`http://localhost:3100/${path}`, {
        method: 'get',
        mode: 'cors'
      }).then((response) => {
        if(response.ok && path.split('.')[1] === 'csv') {
          response.text().then(data => {
            try {
              resolve(this._csvToChartData(data));
            } catch (err) {
              reject(err);
            }
          });
        } else if (response.ok) {
          response.json().then(data => {
            try {
              resolve(parse ? this._jsonToChartData(data) : data);
            } catch (err) {
              reject(err);
            }
          });
        }
      }).catch((err) => {
        reject(err);
      });
    })

  }
}