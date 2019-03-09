const bcrypt = require('bcrypt-nodejs');

class userDAO {
  constructor(connection) {
    this.connection = connection;
  }

  saveUser(email, password) {
    return new Promise((resolve, reject) => {
      this.connection.query('SELECT * FROM `users` WHERE email = ?', email,
      (err, result) => {

        const isResultEmpty = Object.entries(result).length === 0;

        if (isResultEmpty) {
          const cryptedPassword = bcrypt.hashSync(password);
          this.connection.query('INSERT INTO `users` (email, passw) VALUES (?, ?)', [email, cryptedPassword],
              (errInsert, resultInsert) => {
                if (errInsert) return reject(errInsert);
                return resolve('User was created');
              }
            );
        }
        else if (err) return reject(err);
        else return reject('Email Already Exist!');

      });
    });
  }



}

module.exports = () => userDAO;
