const mongoose = require("mongoose");
const { Schema } = mongoose;

const gameDataSchema = new Schema({
  roomId: String,
  playerOne: { type: Schema.Types.ObjectId, ref: 'users' },
  playerTwo: { type: Schema.Types.ObjectId, ref: 'users' },
  playerOneScore: {
      type:Number,
      default: 0
  },
  playerTwoScore: {
    type:Number,
    default: 0
}
});

mongoose.model("game_data", gameDataSchema);