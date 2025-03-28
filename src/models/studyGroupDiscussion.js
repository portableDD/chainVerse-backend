const mongoose = require("mongoose")
const Schema = mongoose.Schema

const studyGroupDiscussionSchema = new Schema(
  {
    message: {
      type: String,
      required: true,
      trim: true,
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

module.exports = mongoose.model("StudyGroupDiscussion", studyGroupDiscussionSchema)

