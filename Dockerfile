FROM ubuntu:14.04
#also works with 16.04 & 18.04
#sets cmdline interface as noninteractive for installing packages below
env DEBIAN_FRONTEND="noninteractive"
RUN printf '#!/bin/sh\nexit 0' > /usr/sbin/policy-rc.d
#set up mysql and node
RUN apt-get -y update && apt-get install -y mysql-server nodejs npm wget

RUN npm cache clean -f
RUN npm config set strict-ssl false
RUN npm install -g n
RUN n stable
RUN npm install --global yarn

#set up files

WORKDIR /www
RUN mkdir views
COPY user-list.ejs /www/views
COPY package.json /www
COPY yarn.lock /www
COPY index.js /www
COPY db_gen.sh /db_gen.sh
COPY my.cnf /etc/mysql/my.cnf

RUN yarn install


EXPOSE 3306

#allows running of file via changing permissions
RUN chmod +x /db_gen.sh

#runs on boot of container
ENTRYPOINT ["sh","/db_gen.sh"]
