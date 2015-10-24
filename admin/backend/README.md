# Want to Eat Api Application

Based on [Sails.js framework](http://sailsjs.org)

## HOW TO :: Web Application ::

### Install dependencies

1. Install [NodeJS](https://nodejs.org/en/)

2. Install dependencies

```bash
npm install
```

2. Install [MongoDB](http://www.mongodb.org/)

3. Install [Redis](http://redis.io/)

Then, you need to register user in your MongoDB by executing:

```bash
mongod
```

```bash
mongo
```

```bash
use eater
```

```bash
db.createUser({user: "eater", pwd: "8v16GzICrSg8ITZRDCGC", roles: ["userAdmin"]});
```

### Start Application

#### Developer Mode

```bash
node app
```

#### Production mode

```bash
NODE_ENV=production node app
```
