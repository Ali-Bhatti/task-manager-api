# task-manager-api
This is puerly a backend project, it does not have a GUI. <br/>
Inorder to test it you can use POSTMAN, by doing following steps:<br/>
- let BaseUrl = https://b-task-manager.herokuapp.com
- First **create a user** you, use following URL:
  - POST BaseUrl/users and in body type { email: "YOUR_EMAIL", password:"YOUR_PASSWORD" , name:"YOUR_NAME"}
- Then **Login** using the following URL:
  - POST BaseUrl/users/login and in body type { email: "YOUR_EMAIL", password:"YOUR_PASSWORD"}
- To **see your Profile** use the following URL:
  - GET BaseUrl/users/me 
- To **Logout** using the following URL:
  - POST BaseUrl/users/logout
- To **Create a Task** use the following URL:
  - POST BaseUrl/tasks and in body type { description: "DESCRIPTION_OF_YOUR_TASK", completed:"TRUE/FASLE"}
- To **See all Tasks of a User** use the following URL:
  - GET BaseUrl/tasks
- To **Delete your Profile** use the following URL:
  - DELETE BaseUrl/users/login/me
