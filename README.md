# Milkshake

Website for Milkshake

## Demo

Visit the website in production here: [milkshake.tech](http:milkshake.tech)

## Tech

* Node/Express
* MongoDB
* SparkPost
* Heroku

## Getting Started

Run locally:

```
git clone https://github.com/milkshake-tech/milkshake-tech.git
cd milkshake-tech
touch .env
```

Open dotenv file, and add following values:
```
SPARKPOST_API_KEY=
MONGODB_TEST_URI=
MONGODB_DEV_URI=
```

Save the file and start the application

```
mongod (in separate tab)
npm start
```

Visit at localhost:3000.
