const {Sequelize} = require ('sequelize'); //importing library that connects databases
require('dotenv').config();//load .env file 

const sequelize = new Sequelize( 
    //connects to database with the following info 
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host:process.env.DB_HOST,
        dialect: 'mysql',
        logging: false,
    }
);

module.exports = sequelize;
//make the connection shareable to other files in the same project