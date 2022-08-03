#start, set up mysql database
#create user 'sqli-user' with permissions on
#DATABASE: SqliDB;
service mysql start
FLAG="${FLAG:-test}"
mysql -u root -e "CREATE USER 'sqli-user'@'localhost' IDENTIFIED BY 'sKLngsJkZjy&rFHUzFATDJsCFx~e5QucuTde3Rkcextw&Ahg92t9QW^aZDdNuL4y%rzPs'"
#echo "User Created"
mysql -u root -e "GRANT SELECT, SHOW VIEW ON SqliDB.* TO 'sqli-user'@localhost IDENTIFIED BY 'sKLngsJkZjy&rFHUzFATDJsCFx~e5QucuTde3Rkcextw&Ahg92t9QW^aZDdNuL4y%rzPs'"
#echo "Privileges got"
mysql -u root -e "CREATE DATABASE SqliDB"
#echo "Database created"
mysql -u root -e "USE SqliDB"
#echo "Using database"
mysql -u root -D 'SqliDB' -e "CREATE TABLE users (User LONGTEXT, Details LONGTEXT)"
#echo "Table created"
mysql -u root -D 'SqliDB' -e "INSERT INTO users (User,Details) VALUES ('Hege Refsnes', 'I work for Melisa Case'), ('Melisa Case', 'My manager is Catrina Rowland'), ('Catrina Rowland', 'Ali Barlow works under me'), ('Ali Barlow', 'Always a pleasure working with Noah Bim'), ('Noah Bim','Gotta patch up those SQLi vulnerabilities!'), ('2JZmyhw*zFW+]F$!%^Y#9Pw-yxF[TPr7[CAh9@VWJ^&pxvv(&3A+sdVW+MWF!}JmY#2_>J}~J(_m%?ucHXL$Qz}jY>W$kFj7nfxV*D)ce@Tq/*(?4%@\iLVSy5a-DN{7 FLAG', '${FLAG}' )"
#echo "Data inserted"
mysql -u root -e "SET PASSWORD FOR root@'localhost' = PASSWORD('^wn=GBr^92@&wf+Ebq3w!CsTP4%Mr6+_')"
#echo "Database up"
#run in background
node /www/index.js