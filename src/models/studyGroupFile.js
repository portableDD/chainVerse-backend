const mongoose = require("mongoose")
const Schema = mongoose.Schema

const studyGroupFileSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    size: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    key: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    studyGroupId: {
      type: Schema.Types.ObjectId,
      ref: "StudyGroup",
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
)

module.exports = mongoose.model("StudyGroupFile", studyGroupFileSchema)

