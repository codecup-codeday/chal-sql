#start, set up mysql database
#create user 'sqli-user' with permissions on
#DATABASE: SqliDB;
service mysql start
mysql -u root -e "CREATE USER 'sqli-user'@'localhost' IDENTIFIED BY 'AxU3a9w-azMC7LKzxrVJ^tu5qnM_98Eb'"
#echo "User Created"
mysql -u root -e "GRANT ALL PRIVILEGES ON SqliDB.* TO 'sqli-user'@localhost IDENTIFIED BY 'AxU3a9w-azMC7LKzxrVJ^tu5qnM_98Eb' WITH GRANT OPTION"
#echo "Privileges got"
mysql -u root -e "CREATE DATABASE SqliDB"
#echo "Database created"
mysql -u root -e "USE SqliDB"
#echo "Using database"
mysql -u root -D 'SqliDB' -e "CREATE TABLE users (User LONGTEXT, Details LONGTEXT)"
#echo "Table created"
mysql -u root -D 'SqliDB' -e "INSERT INTO users (User,Details) VALUES ('Hege Refsnes', 'I work for Noah Bim'), ('Noah Bim','Hm ... SQL?')"
#echo "Data inserted"
#echo "Database up"
#run in background
node /www/index.js