# Option 1: (Preferred)
# Using auto installaton guide
https://github.com/Netswitch-Inc/unity/blob/master/Unity%20Risk%20Indicator%20Setup%20Guide%20Rel_0_2.pdf

# Option 2:
# Manually Installation Guide
1). Install Nginx if not installed
Check nginx installed or not: whereis nginx (Run command - response will display installed path)
https://www.digitalocean.com/community/tutorials/how-to-install-nginx-on-ubuntu-22-04

2). First install Docker and prefer in this link
Check docker installed or not: whereis docker (Run command - response will display installed path)
https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-20-04

3). Second install Docker-composer and prefer in this link
Check docker-compose installed or not: whereis docker-compose (Run command - response will display installed path)
https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-compose-on-ubuntu-20-04

4). download zip file and extract

5). First clone code on your server

6). Run below command on root directory
domain1 is for backend.
domain2 is for frontend.
sudo sh setup.sh then wirte domain1 and domain name2
Please enable port (3006, 8081) for public access.

7). Inside unity docker go to frontend and configure .env file
Update REACT_APP_BACKEND_REST_API_URL http://localhost:3006 from to http://< ip-address >:3006

8). Inside unity docker go to backend and configure .env file
Update FRONT_WEB_URL http://localhost:8081 from to http://< ip-address >:8081
Update BACK_UNITY_URL http://localhost:3006 from to http://< ip-address >:3006

Please open 3006 || <desired port> port on server.

9). now check container is running or not in this command
sudo docker ps -a

10). open terminal and run in this commmand
sudo docker-compose up --build -d

11). Docker down or stop docker container
sudo docker-compose down

12). Docker container logs
sudo docker logs --follow <container_id>

13). In case any change on code side then pull code and run below command. So your changes is reflect on your running application.
docker-compose up -d --no-recreate --build <service-name> (service name backend and frontend in case change in API then used service name backend and in case any changes with frontend then service name frontend)
