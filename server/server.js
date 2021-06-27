const express = require('express')
const bcrypt = require('bcrypt')
const mysql = require('mysql2')

const app = express()

app.use(express.json())

var db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'dept_counter_db',
  port: '3306'
})

db.connect((err) => {
  if (err) {
    console.log(err)
  } else
    console.log('database connected')
})


app.post('/user', (req, res) => {
  var username = req.body.username
  var sql = 'SELECT Name, DeptTopicList FROM user WHERE username = ?'
  db.execute(sql, [username], (err, result) => {
    if (err) {
      console.log(err)
    } else { 
      console.log('result = ' + result)
      res.status(200).send(result)
    }
  })
})

// USER Register
app.post('/register', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    var sql = 'INSERT INTO user VALUES (?, ?, ?, ?)'
    var values = [req.body.username, hashedPassword, req.body.name, req.body.deptTopicList]

    db.execute(sql, values, (err, results, fields) => {
      if (err) {
        console.log(err)
        res.status(500).send()

      } else {
        res.status(201).send('Success')
      }
    })
  } catch {
    res.status(500).send()
  }
})

// USER LOGIN
app.post('/login', (req, res) => {
  username = req.body.username
  password = req.body.password


  if (username == null) {
    return res.status(400).send('No user')
  }

  var sql = 'SELECT username FROM user WHERE username = ?'
  db.execute(sql, [username], (err, result) => {
    if (err) {
      console.log(err)
    } else {
      if (result == null || result == '') {
        return res.status(400).send('No user')
      }
      else {
        console.log('fetch username from db - success')
        var sql = 'SELECT password FROM user WHERE username = ?'

        db.execute(sql, [username], (err, result) => {
          if (err) {
            console.log(err)
          } else {
            console.log('fetch password from db - success')

            result = JSON.stringify(result)
            console.log('result = '+ result)
            result = result.split(':')
            result = result[1]
            result = result.substring(1, result.length - 3)
            
            hashedPasswordFromDB = result
            
            if (hashedPasswordFromDB != null) {
              if ( bcrypt.compareSync(password, hashedPasswordFromDB)) {
                console.log('success')
                res.status(200).send('Success')
              } else {
                console.log('login failed')
                res.send('Not Allowed')
              } 
            }
          }
        })
      }
    }
  })
})


app.post('/update-new-dept', (req, res) => {
  console.log('Update New Dept')

  username = req.body.username
  deptTopicList = req.body.deptTopicList

  var sql = 'UPDATE user SET deptTopicList = ? WHERE username = ?';
  db.execute(sql, [deptTopicList, username], (err, result) => {
    if (err) {
      console.log(err)
    } else {
      res.status(201).send('Success')
    }
  })
})

app.post('/update-paid-dept', (req, res) => {
  console.log('Update Paid Dept')

  username = req.body.username
  deptTopicList = req.body.deptTopicList

  var sql = 'UPDATE user SET deptTopicList = ? WHERE username = ?';
  db.execute(sql, [deptTopicList, username], (err, result) => {
    if (err) {
      console.log(err)
    } else {
      res.status(201).send('Success')
    }
  })
})
app.listen(3000)
