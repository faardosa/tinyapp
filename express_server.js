const { getUserByEmail } = require('./helpers')
const bcrypt = require('bcryptjs');
const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
const cookieSession = require('cookie-session')
app.use(cookieSession({
  name: 'session',
  keys: ['ex1', 'ex2'],

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))

 const password = "purple-monkey-dinosaur"; // found in the req.params object
 const hashedPassword = bcrypt.hashSync(password, 10);


const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: bcrypt.hashSync("purple-monkey-dinosaur", 10) 
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  },
  "user1":{
    id :"user1",
    email: "1234@hotmail.com",
    password:"1234"
  }
} 
function generateRandomString() {
  let result = "";

  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  const charactersLength = characters.length;

  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

function urlsForUser(id) {
  const userUrls = {}
  for (let shortURL in urlDatabase) {
    if (urlDatabase[shortURL].userID === id) {
      userUrls[shortURL] = urlDatabase[shortURL]
    }
  }
  return userUrls;
}

app.set("view engine", "ejs");

// const urlDatabase = {
//   "b2xVn2": "https://www.lighthouselabs.ca" ,
//   "9sm5xK": "https://www.google.com",
//   "abcde": "https://example.com"
// };

const urlDatabase = {
  b6UTxQ: {
      longURL: "https://www.tsn.ca",
      userID: "aJ48lW"
  },
  i3BoGr: {
      longURL: "https://www.google.ca",
      userID: "aJ48lW"
  }
};

// const urlDatabase = {
//   b2xVn2: {
//    longURL: "https://www.lighthouselabs.ca",
//    userID:
//   },
//   9sm5xK:  {
//     longURL: "https://www.google.com",
//     userID:
//   }
//   abcde: {
//   longURL: "https://example.com",
//   userID:
// };

// const urlDatabase = {
//   b6UTxQ: {
//       longURL: "https://www.tsn.ca",
//       userID: "aJ48lW"
//   },
//   i3BoGr: {
//       longURL: "https://www.google.ca",
//       userID: "aJ48lW"
//   }
// };






app.get("/", (req, res) => {
  res.send("Hello!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
  const userId = req.session["user_id"]
  if (!userId) {
    res.send("Error! You are not logged in! <a href = '/login' > Click here to login</a>")
    return;
  }
  const userUrls  = urlsForUser(userId)
  const templateVars = { urls: userUrls, user: users[userId] };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const userId = req.session["user_id"]
  if (!userId) {
    res.redirect("/login")
  } else {
  const templateVars = { user: userId };
  res.render("urls_new", templateVars);
  }
});

app.post("/urls", (req, res) => {
  const userId = req.session["user_id"]
  if (!!userId) {
    let shortURL = generateRandomString()
  const newUrl = {
    longURL: req.body.longURL,
    userID: userId
  }
  urlDatabase [shortURL] = newUrl
  console.log(req.body.longURL)
  res.redirect(`urls/${shortURL}`)
  } else {
    res.status(403).send("Sorry you need to be logged in"); 
  }
});
app.get ("/register",  (req, res) => {
  const userId = req.session["user_id"]
  console.log(userId)
  // if (!userId) {
  //   res.redirect("/urls") 
  // } else {
    const templateVars = { urls: urlDatabase, user: users[userId],  }
    res.render("registration", templateVars)
  //} 
}) 

app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL
  if (!urlDatabase[shortURL]) {
    res.send("Error! Short URL doesn't exist") 
    return;
  }
  const userId = req.session["user_id"];
  let longURL = urlDatabase[shortURL].longURL
  const templateVars = {
    shortURL: shortURL,
    longURL: longURL,
    user: users[userId]
  };
  res.render("urls_show", templateVars);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const userId = req.session["user_id"];
  if(userId == undefined){
    res.send("You are not authroized to delete");
  } else {
    const urlToDelete = req.params.shortURL
    delete urlDatabase[urlToDelete] 
    res.redirect("/urls")
  }
})

app.post("/urls/:shortURL/edit", (req, res) => {
  const userId = req.session["user_id"];
  if(userId == undefined){
    res.send("You are not authroized to edit");
  } else {
    const shortURL = req.params.shortURL;
    const newLongUrl = req.body.longURL;
    console.log("NEW LONG ",newLongUrl)
    urlDatabase[shortURL].longURL = newLongUrl;
    res.redirect("/urls")
  }
})

app.post("/urls/:shortURL", (req, res) => {
  const userId = req.session["user_id"]
  if (!userId) {
    let shortURL = req.params.shortURL
  const newUrl = {
    longURL: req.body.longURL,
    userID: userId
  }
  urlDatabase [shortURL] = newUrl
  console.log(req.body.longURL)
  res.redirect(`urls/${shortURL}`)
  } else {
    res.status(403).send("Sorry you need to be logged in"); 
  }
});



app.post("/login", (req, res) => {
  const password = req.body.password
  const email = req.body.email
  if(!password || !email) return res.status(403).send('Please put valid email and password');

  const userObject = getUserByEmail(email, users)
  if(!userObject || userObject.email !== email || bcrypt.compareSync(password, userObject.password)) {
    return res.status(403).send('Wrong credentials')
  }
  req.session.user_id = userObject.id;
  res.redirect("/urls")
})

app.post ("/logout", (req, res) => {
  req.session = null
  res.redirect("/urls")
})

app.post ("/register", (req, res) => { // make a post for the registration, this is creating a new user
  const userEmail = req.body.email
  const password = req.body.password
  if (!userEmail || !password) {
    res.status(403).send("Sorry cannot be empty"); 
  } 
  const userFound = getUserByEmail(userEmail, users)
  console.log('USERFOUND---->',userFound)
  if(userFound) return res.status(403).send('Email is taken')

  const newUserId = generateRandomString()
  const newUser = {       //  holds the new user info
    id: newUserId, 
    email: userEmail,
    password: bcrypt.hashSync(password, 10)
  } 

  users[newUserId] = newUser

  req.session.user_id = newUserId;
  res.redirect("/urls")
})

app.get ("/login", (req, res) => {
  const userId = req.session["user_id"]
  //console.log(users[userId])
  if (userId != undefined) {
    res.redirect("/urls")
  } else {
    const templateVars = { urls: urlDatabase, user: users[userId], }
    res.render("login", templateVars)
 }
})

//   }
//   users[newUser.id] = newUser // stores the new user info in the user database
//   res.cookie("user_id", newUser.id) // saves the new used id in the browser cookie
//   console.log(users) // prints out all the users info
//   res.redirect("/urls") // redirects it to the url page, (makes a get request to /urls)
// })






// const emailHasUser = function(email){
//   console.log(Object.keys(users));
//   for (const user of Object.keys(users)) 
//   {console.log(users[user]);
//     console.log(email);
//     if (users[user].email === email) {
//       return true;
//     }
//   }
//   return false;
// };


// app.post("/register", (req, res) => {
//   const id = generateRandomString()
//   const email = req.body.email;
//   const password = req.body.password;

//   if (email === "" || password === "") {
//     res.status(400).send("Please include both a valid email and password");
//   } else if (emailHasUser(email)) {
//     res.status(400).send("An account already exists for this email address");
//   } else {
  
//   users[id] = {
//   id,
//   email, 
//   password
//   }
//   console.log(users);
// }
// res.cookie('user_id',id); 
// console.log(users[id]);
//   res.redirect(`/urls/`)
// });

// app.get ("/hello_world", (req, res) => {

//   res.send("I rendered")
// })



// app.post(" /urls/:id"), (req, res) => {
  
