## SETUP
1. clone the repository to your local machine
2. cd into the directory
3. download the dependencies by running `npm install`
```bash
npm install
``` 
4. create a file called **.env** in the root directory
5. add new key in the **.env** file
```
DATABASE_URL=mysql://username:password@localhost:3306/database_name
```
6. create a database in your local machine with the name you specified in the **.env** file
7. run the migration by running `npm run prisma-migrate`
```bash
npm run prisma-migrate
```
