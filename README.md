# NTUA ECE SaaS23-36 PROJECT - MyCharts

<br>

## **Overview**

The goal of the project is to provide the end user with a Web Application, in the form of **SaaS**, giving them the ability to **easily create custom charts**. 

The application utilizes **google login**, making the interaction seamless, it **stores** the user’s previous **charts** and allows them to **create and download new ones!** 

The user utilizes their **quotas**, which can be **bought** through our application, and **spends** them each time a new chart is generated.
<br>
<br>



## **Tools used:**
![Javascript](https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=000000)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Docker](https://img.shields.io/badge/docker-2496ED?style=for-the-badge&logo=docker&logoColor=FFFFFF)
![ChartJS](https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white)


<br>

## **Contributors**

| Όνομα | Α.Μ. | email |
| --- | --- | --- |
| Κάζδαγλη Αριάδνη | 03118838 | el18838@mail.ntua.gr |
| Παπαγιαννάκης Παναγιώτης | 03119055 | el19055@mail.ntua.gr |
| Παράνομος Ιωάννης | 03118021 | el18021@mail.ntua.gr |

<br>

## **Architecture**
[Link to .vpp file](https://github.com/ntua/SaaS23-36/blob/main/architecture/SaaS23-36-Final.vpp)

<br>

---
<br>

## **Description**

The Web Application has been build using the SaaS model, thus the various operations of the application are facilitated by their corresponding micro-service. That ensures, apart from code readability and good practices, that the operation of each micro-service is to some degree independent from one another, making the application more robust and trustworthy.
<br><br>

### **Let’s break down each micro-service**

**Frontend**

The Frontend micro-service, acts as the frontend server and orchestrator of the Webb Application. It is directly responsible for most interactions with the user and is also used to delegate tasks to the other micro-services used.

**User-Management**
The User-Management micro-service, is responsible, for everything related to our users database, making sure to match the google logged in user to our own database. It is important to note that our users can be stored in either a temporary-user db or in a user db, allowing as to essentially have some “guest” users, who have not completed their sign up, who upon completion will become users of the application.

**Quota-Management**

In order to keep track of the resources each user utilizes, a quota system is implemented. Each quota can “buy” the user one chart generation, and if the quotas are all spent, the user can purchase more from our application. This micro-service makes sure to check that the user has enough quotas for the necessary operation and is responsible for managing the creation, and altering of the users quota.

**Chart-Management**

In our repository, can be found as “database-ms”, it is responsible for the chart management, being the one to fetch the information on the already generated charts and to facilitate the chart-generation micro-services with the corresponding info to generate a given task.

**Charts-MicroServices**

These are 6 micro-services, dedicated to the creation of the 6 types of charts supported by our application, they are in contact with the frontend and the Chart-Management micro-services, ensuring that the user will always get the desired result.

---
<br>

## **Notes & Deployment Information**

Since the deployment of the application has been built around Docker, minimum steps are required for the application to work seamlessly.

- One issue that need to be addressed is the use of the google login authentication. Google only allows certain redirects to its login API, meaning that if the application is run on a local network, the user will not be able to login. Therefore we would **strongly suggest** that the user **updates their host file**, with the following: [***"Your IP"*** &nbsp; **[www.mycharts.gr](http://www.mycharts.gr)**] . That way the google auth will work properly
- The application assumes that 3 ports are available on the users pc:**Port 443, Port 3000 and Port 27018.** In case that these ports are already used, the user is required to update the corresponding ports in the docker-compose.yml file. We note that Port 27018 is totally optional and is used only to monitor the database.
- Lastly, we ********************strongly suggest********************  that the user enters the application by a Chromium based browser, to ensure the best experience!

<br>

### **Deployment**
- Update hosts file
- Navigate to the project root
- Run `docker-compose build`
- Run `docker-compose up`
- Open your browser and connect to: `https://www.mycharts.gr`
