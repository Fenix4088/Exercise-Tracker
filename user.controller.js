const {userService} = require("./user.service.js");
const {isValidDuration, dateToString, roundTimestamp} = require("./helpers.js");

/*
//test user
{"username":"Oleg Tarkov","_id":"63a7ff70954b8ed7a44cc2af"}
*/


class UserController {
  createUser = async (req, res) => {
      try {
        const {username} = req.body;
        const doc = await userService.createNewUser({username});
        res.status(200).json({ username, _id: doc._id  })
      } catch(e) {
        res.status(500).json({ error: e.message  })
    }
  }

  getUsersList = async  (req, res) => {
    try {
      const usersList = await userService.getAllUsers("username __v");
      res.status(200).json(usersList)
    } catch (e) {
      res.status(500).json({ error: e.message  })
    }
  }

  createExcercise = async (req, res) => {
    try {
       const {description: incomeDescription = "", duration: incomeDuration = "", date: incomeDate = ""} = req.body;
       const { userId: incomeUserId } = req.params;
      
       if(!(incomeUserId.trim())) {
         return res.status(404).json({error: "Provide user id"});
       }

       const user = await userService.findUserById(incomeUserId);

       if(!user) {
         return res.status(404).json({error: "User not found"});
       }

      if(!(incomeDescription.trim()) || !(incomeDuration.trim())) {
        return res.status(404).json({error: "Description and duration are require fields"}); 
      }

      if(!isValidDuration(incomeDuration)) {
        return res.status(404).json({error: "Ivalid duration"}); 
      }

      const {_id, username, log} = await userService.addExcerciseToUserList(
        {userId: incomeUserId,
         date: dateToString(incomeDate),
         duration: incomeDuration,
         description: incomeDescription,
         timestamp: roundTimestamp(incomeDate)
        }
      );
      const {duration, description, date} = log[log.length - 1];
      res.status(200).json({_id, username, duration, description, date})
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }

  getUserLogs = async (req, res) => {
    const {limit = 100.000, from = new Date(0), to = Date.now()} = req.query;
    try {
      const { userId } = req.params;
      if(!userId) {
        return res.status(400).json({error: "user id is undefined"})
      }

      const user = await userService.getUserLogs(userId, {limit, from, to});

      if(!user) {
        return res.status(204).json({message: "User not found"})
      }

      res.status(200).json(user)
      
    } catch (e) {
      res.status(500).json({error: e.message})
    }
  }
}

const userController = new UserController();

module.exports = {
  userController
}