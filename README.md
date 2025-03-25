# Installation Guide for Unity Risk Indicator

## Option 1: Preferred Method
### Using the Automatic Installation Guide
Please refer to the following link for the automatic installation guide:
[Unity Risk Indicator Setup Guide](https://github.com/Netswitch-Inc/unity/blob/master/Unity%20Risk%20Indicator%20Setup%20Guide%20Rel_0_2.pdf)

Option 2: [Unity Unity Risk Indicator Setup Guide Option 2](https://docs.google.com/document/d/1NvafrRxwTOrgk66y_Dvu2wnVp11CPyp7e2ZMHtbXR4Y/edit)

---

## Option 2: Manual Installation

Follow these steps for a manual installation:

1. **Install Nginx:**
   - Check if it's installed: `whereis nginx`
   - If not, follow the guide: [How to Install Nginx on Ubuntu 22.04](https://www.digitalocean.com/community/tutorials/how-to-install-nginx-on-ubuntu-22-04).

2. **Install Docker:**
   - Check if it's installed: `whereis docker`
   - If not, follow the guide: [How to Install and Use Docker on Ubuntu 22.04](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-20-04)

3. **Install Docker Compose:**
   - Check if it's installed: `whereis docker-compose`
   - If not, follow the guide: [How to Install and Use Docker Compose on Ubuntu 22.04](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-compose-on-ubuntu-20-04).

4. **Download and Extract the ZIP File:**
   - Ensure you have the correct file for the Unity Risk Indicator.

5. **Clone the Code Repository Using Git:**
   ```bash
   git clone https://github.com/Netswitch-Inc/unity

6. **Go inside the unity folder**
   ```bash
   cd unity
   ```

7. **Configure the Frontend .env File**    
   - Inside the unity directory, edit the frontend .env file
   ```bash
   vi frontend/.env
   ```
   - Update the REACT_APP_BACKEND_REST_API_URL in the .env file from http://localhost:3006 to http://<your_server_ip>:3006.

8. **Configure the Backend .env File**
   - Inside the unity directory, edit the backend .env file
   ```bash
   vi backend/.env
   ```
   - FRONT_WEB_URL from http://localhost:8081 to http://<your_server_ip>:8081
   - BACK_UNITY_URL from http://localhost:3006 to http://<your_server_ip>:3006
   - Ensure port 3006 is open on your server.

9. **Download the manually setup script:**
   ```bash
   wget https://raw.githubusercontent.com/Netswitch-Inc/unity/refs/heads/master/manuallysetup.sh
   ```
10. **Run the Setup Script:**
   ```bash
   sudo sh manuallysetup.sh
   ```
   - Ensure ports 3006 and 8081 are open for public access.
  
11. **Verify Docker Containers**
   - Check if containers are running:
   ```bash
   sudo docker ps -a
   ```

12. **Start the Application**
   ```bash
   sudo docker-compose up --build -d
   ```

13. **Stop the Application**
   ```bash
   sudo docker-compose down
   ```

14. **View Container Logs**
   ```bash
   sudo docker logs --follow <container_id>
   ```

15. **Update for Code Changes**
   - Pull the latest code from the repository.
   ```bash
   docker-compose up -d --no-recreate --build <service-name>
   ```
   - Use backend or frontend as <service-name> depending on where changes were made.

16. **Replace IP**
   - Browse http://<your_server_ip>:8081
   - Replace <your_server_ip> with your actual server IP address.
   - Ensure that your firewall settings allow access to the necessary ports (3006 and 8081).
