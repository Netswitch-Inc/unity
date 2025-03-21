# Option 1: (Preferred)
# Using auto installaton guide
https://github.com/Netswitch-Inc/unity/blob/master/Unity%20Risk%20Indicator%20Setup%20Guide%20Rel_0_2.pdf


# Option 2: Manual Installation
1) Install Nginx: 
Check with whereis nginx; install via How to Install Nginx on Ubuntu 22.04 if needed.

2) Install Docker:
Check with whereis docker; install via How to Install and Use Docker on Ubuntu 22.04 if needed.

3) Install Docker Compose:
Check with whereis docker-compose; install via How to Install and Use Docker Compose on Ubuntu 22.04 if needed.

4) Download and extract the zip file (ensure you have the correct file for Unity Risk Indicator).

5) Clone the code repository using Git
git clone https://github.com/Netswitch-Inc/unity

6) Run sudo sh setup.sh, entering domain1 for backend and domain2 for frontend, and ensure ports 3006 and 8081 are open.

7) Configure the frontend .env file, updating REACT_APP_BACKEND_REST_API_URL to use your server IP.

8) Configure the backend .env file, updating FRONT_WEB_URL and BACK_UNITY_URL with your server IP, and ensure port 3006 is open.

9) Verify containers with sudo docker ps -a.

10) Start with sudo docker-compose up --build -d.

11) Stop with sudo docker-compose down.

12) View logs with sudo docker logs --follow <container_id>.

13) For code changes, pull updates and run docker-compose up -d --no-recreate --build <service-name> (use backend or frontend as needed).

Notes: Replace <your_server_ip> with your actual server IP and ensure firewall settings allow necessary ports.
