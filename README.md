# CoStudy

CoStudy is a collaborative study platform that allows students to create and join **virtual study rooms** across long distances. Whether you're preparing for finals or just need accountability, CoStudy makes it easy to connect, chat, and focus together.

🌐 Website: [https://costudy.online](https://costudy.online)

---

## Features

-  **Secure Authentication** with OAuth2 + JWT tokens  
-  **Real-time Chatrooms** powered by WebSockets  
-  **Custom & Pre-Made Study Strategies** (Pomodoro, focus sessions)  
- **Collaborative Study Rooms** you can join or create instantly  
- **Persistent Data** with MySQL on AWS RDS  
- **Deployment** via AWS Amplify & Elastic Beanstalk  

---

## Stack
**Frontend**  
- [Next.js](https://nextjs.org/) – React 
- Deployed with **AWS Amplify**  

**Backend**  
- [Spring Boot](https://spring.io/projects/spring-boot) (Maven) – REST APIs, authentication 
- Authentication with **OAuth2 + JWT**  
- Real-time communication via **WebSockets**  
- Deployed with **AWS Elastic Beanstalk**  

**Database & Storage**
- **MySQL** on AWS RDS
- **AWS S3** for file storage
