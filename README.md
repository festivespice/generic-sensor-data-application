# Generic sensor app info

🚩 How to setup MongoDB for the project (Windows 10)

    1)	Download the 4.4 installer for The MongoDB Community Server

    2)	Do the full install. 
    Also, install Compass if you want to use the GUI (I suggest it but you can 
    use the command line if you want which is located at 
    'C:\Program Files\MongoDB\Server\4.4\bin\mongo.exe'). 

🚩 Getting everything running locally (Windows 10)

    1)	In a project folder you’ve created, do ‘git init’. Go to the github 
    repository page and the home directory of the this repository. 
    Click on the green 'Code' dropdown and get the HTTPS link. 

    Then do 'git remote add origin <replaceWithLink>'. Then do  
    'git pull origin <replaceWithNameOfWorkingBranch>'. 
    My working branch name was 'master'. You should get this repository's files. 

    2)	Use a CMD terminal and go to the project directory ‘\<nameOfYourProjectFolder>'
     and do ‘npm install’ (if you don’t already have nodejs and npm installed, 
     do so from here https://nodejs.org/en/download/). This installs all modules from 
     the 'package.json' file that the project requires, and puts them in the 'node_modules' folder. 

    3)	Create a CMD terminal process and type in ‘mkdir \data && mkdir \data\db’ 
    to create the database folders. 

    4)	Use the same terminal and start a mongo daemon process using 
    "C:\Program Files\MongoDB\Server\4.4\bin\mongod.exe" --port=27017  --dbpath=“C:\data\db”

    5)	If you aren’t using MongoDB server version 4.4, change that version number in the 
    path that you use for the ‘monogd’ executable in step 4.     You should see an IP 
    and port from one of the messages returned for the ongoing daemon process. 

    6) After getting the Mongo daemon running, do 'npm install' in the 'webapp' 
    and 'backend' directories to create a node_modules folder and install all of the
    dependencies listed in the package.json npm files. Then, go to the 'webapp' 
    directory and do 'npm run start' to run the 'start' script from the webapp package.json file. 

    7) With the database server and the backend API running, you can now make GET requests 
    in your browser to the node server by using a path in the routes.js file by contacting either 
    localhost or the IP address of your computer, whose IPv4 address can be found by using 'ipconfig' 
    on the command line. I use Postman for making HTTP requests.

    If you followed along so far and there doesn't seem to be any errors, you'll notice that 
    you may not consistently be able to use your computer's IP to GET data from something like your
     Angular server at port 4200. You'll have to setup a static IP on your computer to do that reliably. 

🌲 Setting up a static IP (Windows 10)

    1) First, find your current IP address and default gateway using ipconfig.

    2) Then, go to control panel -> networking and sharing center -> click on connection.

    3) Go to Wifi Properties

    4) Double click on the IPv4 item.

    5) Notice that your subnet mask has 0 for a section. If so, try to set that section of your 
    IP address to a very low number like 4 or 5 (outside of DHCP). 

    6) Use the same subnet mask and gateway. Use the gateway as your preferred DNS server listed 
    when you enter 'ipconfig' on the CMD line but alternatively use Google's '8.8.8.8'.  
    For example, if my default gateway is '192.166.88.1', 
    then my preferred DNS server should be '192.166.88.1'. 




