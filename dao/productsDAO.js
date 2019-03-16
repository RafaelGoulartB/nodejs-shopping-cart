class productsDAO {
  constructor(connection) {
    this.connection = connection;
  }

  list(limmit) {
    return new Promise((resolve, reject) => {
      if(!limmit) {
        this.connection.query('select * from products', (error, result) => {
          if(error) return reject(error);
          return resolve(result);
        })
      }
      this.connection.query('select * from products limit ?', limmit, (err, result) => {
        if (err) return reject(err);
        return resolve(result);
      });
    }); // End Promise
  }; // End list

  getByIds(ids) {
    return new Promise((resolve, reject) => {
      this.connection
        .query(`SELECT * FROM products WHERE id in (${ids})` , (err, result) => {
          if (err) return reject(err);
          return resolve(result);
        });
    });
  };

}

module.exports = () => productsDAO;
