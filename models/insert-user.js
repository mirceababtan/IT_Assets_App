const bcrypt = require('bcrypt');
const path = require('path');

const createConnection = require(path.resolve(__dirname , '../database.js'));

const connection = createConnection();
connection.connect((err) => {
if (err) {
    console.error('error connecting: ' + err.stack);
    return;
}
console.log('connected to mySql as id ' + connection.threadId);
});

const username = '';
const password = '';
const saltRounds = 12;

const passwordSalt = bcrypt.genSaltSync(saltRounds);
const passwordHash = bcrypt.hashSync(password,passwordSalt);

console.log(passwordSalt);
console.log(passwordHash);

connection.query('INSERT INTO `centralizare_echipamente_it`.`users` (`username`,`passwordHash`,`passwordSalt`) VALUES (?,?,?)',[username,passwordHash,passwordSalt],(err,result) => {
    if(err){
        console.error('Error inserting data: ', err);
    }
    else{
        console.log('Data inserted successfully!');
    }
});