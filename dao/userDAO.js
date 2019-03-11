const bcrypt = require('bcrypt-nodejs');

class userDAO {
  constructor(connection) {
    this.connection = connection;
  }

  saveUser(email, password) {
    return new Promise((resolve, reject) => {
      this.connection.query('SELECT email FROM `users` WHERE email = ?', email,
      (err, result) => {

        const emailNotExist = Object.entries(result).length === 0;

        if (emailNotExist) {
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

  login(email, password) {
    return new Promise((resolve, reject) => {
      this.connection.query('SELECT * FROM `users` WHERE email = ?', email, (err, result) => {
        if (Object.entries(result).length > 0) {
          const isPasswordCorrect = bcrypt.compareSync(password, result[0].passw);
          if (isPasswordCorrect) return resolve('Welcome to Shopping Cart!');
          else return reject('Password is incorrect');
        }
        else if (err) return reject(err);
        else return reject('Email is not in system, please Sign Up.');
      })
    })
  }


}

module.exports = () => userDAO;
