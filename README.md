# betareg

Interview Coding Assignment – Backend

Assignment Description: Design a REST API that allows developers to sign up for the beta test programs of your 
company products.

Proposed Full AWS Architecture approach:

![AWS Full Architecture](https://d2908q01vomqb2.cloudfront.net/ca3512f4dfa95a03169c5a670a4c91a19b3077b4/2019/10/11/main_architecture_diagram.png)

With the time limit, we are only focused on the "Users" portion of the API architecture, this is what I implemented:

![Implemented Architecture](https://github.com/tkuehnl/betareg/blob/main/images/implemented.png?raw=true)

Here is the implemented json data structure for a developer:
```json
{
	"id":"pXhwzzlJtQU",
	"registered_at": "2021-03-08T13:32:09.325519",
	"first_name": "Todd",
	"last_name": "Kuehnl",
	"operating_system":"Windows",
	"programming_language":"Javascript",
	"programming_ide":"Visual Studio Code",
	"city":"Troy",
	"state":"MI",
	"country":"USA",
	"email":"todd@rapidtd.com",
	"linkedin":"https://www.linkedin.com/in/todd-kuehnl-3734911b/",
	"twitter_username":"toddkuehnl",
	"instagram_username":"toddkuehnl"
}
```
I added a health check end point here ( should just return a 200):
https://kky3vgml56.execute-api.us-east-1.amazonaws.com/prod/health

Here is an end-point for fetching all developers:
https://kky3vgml56.execute-api.us-east-1.amazonaws.com/prod/developers

REST endpoint:
https://kky3vgml56.execute-api.us-east-1.amazonaws.com/prod/developer

With more time, I would also implement a proper CI/CD pipeline such as the following:

![Proposed AWS CI/CD](https://github.com/tkuehnl/betareg/blob/main/images/ci_cd.png?raw=true)