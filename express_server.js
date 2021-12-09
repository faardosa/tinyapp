const express = require("express");
const cookieParser = require('cookie-parser')
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser())

const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
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


app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "https://www.lighthouselabs.ca" ,
  "9sm5xK": "https://www.google.com",
  "abcde": "https://example.com"
};

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
  const userId = req.cookies["user_id"]
  const templateVars = { urls: urlDatabase, user: users[userId] };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.post("/urls", (req, res) => {
  let shortURL = generateRandomString()
  urlDatabase [shortURL] = req.body.longURL
  console.log(req.body.longURL)
  res.redirect(`urls/${shortURL}`)
});

app.get("/urls/:shortURL", (req, res) => {
  const userId = req.cookies["user_id"]
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    user: users[userId]
  };

  res.render("urls_show", templateVars);
});

app.get ("/register",  (req, res) => {
  const userId = req.cookies["user_id"]

  const templateVars = { urls: urlDatabase, user: users[userId],  }
  res.render("registration", templateVars)
  }) 

app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL]
  res.redirect(longURL);
});

app.post("/urls/:shortURL/delete", (req, res) => {
 const urlToDelete = req.params.shortURL
 delete urlDatabase[urlToDelete] 
 res.redirect("/urls")

})

app.post ("/login", (req, res) => {
  const username = req.body.username
    console.log(username)
  res.cookie("username", username)
  res.redirect("/urls")
})

app.post ("/logout", (req, res) => {
  res.clearCookie("user_id")
  res.redirect("/urls")
})

app.post ("/register", (req, res) => { // make a post for the registration, this is creating a new user
  
  console.log(req.body) // printing out the form input field that has email and pw (navigates to localhost:8080/register)
  const newUser = {       //  holds the new user info
    id: generateRandomString(), 
    email: req.body.email,
    password: req.body.password
  } 
  users[newUser.id] = newUser // stores the new user info in the user database
  res.cookie("user_id", newUser.id) // saves the new used id in the browser cookie
  console.log(users) // prints out all the users info
  res.redirect("/urls") // redirects it to the url page, (makes a get request to /urls)
})






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
  
