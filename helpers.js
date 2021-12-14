

function getUserByEmail(userEmail, users) {
  for(const user in users) {
    if(users[user].email == userEmail) return users[user]
  }
  return undefined
}

module.exports = { getUserByEmail }