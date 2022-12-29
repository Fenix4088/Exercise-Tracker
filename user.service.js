const {User} = require('./user.model.js');
const mongoose = require('mongoose');
const {roundTimestamp} = require("./helpers.js");
const ObjectId = mongoose.Types.ObjectId;

class UserService {
  createNewUser = ({username}) => User.create({username});

  getAllUsers = (filters = "") => User.find({}, filters);

  findUserById = (id) => User.findById(id);

  addExcerciseToUserList = ({userId, date, duration, description, timestamp}) => {
    return User.findOneAndUpdate(
      {_id: userId}, 
      {$push: {log: {duration, description, date, timestamp}}, $inc: {count: 1}}, 
      {new: true}
    );
  }

  getUserLogs = async (userId, {limit, from, to}) => {
    const fromTmst = roundTimestamp(from);
    const toTmst = roundTimestamp(to);
    
    const user = await User.aggregate([
      { $match : { _id : ObjectId(userId) } },
      {
        $project: {
          username: "$username",
          log: {
            $filter: {
              input: "$log",
              as: "logItem",
              cond: {$and: [
                {$gte: ["$$logItem.timestamp", fromTmst]},
                {$lte: ["$$logItem.timestamp", toTmst]}
              ]}
            }
          }
        }
      },
      {
        $project: {
          username: "$username",
          log: {$slice: ["$log", +limit]},
        }
      },
      {$unset: "log._id"},
      {$unset: "log.timestamp"},
      {
          $project: {
          _id: "$_id",
          username: "$username",
          count: {$size: "$log"},
          log: "$log"
        }
      }
    ]);
    
    return user[0]
  };
}

module.exports = {
  userService: new UserService()
}