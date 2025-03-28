const mongoose = require("mongoose")
const Schema = mongoose.Schema

const studyGroupMemberSchema = new Schema(
  {
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
    role: {
      type: String,
      enum: ["ADMIN", "MEMBER"],
      default: "MEMBER",
      required: true,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "PENDING"],
      default: "PENDING",
      required: true,
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
)

// Ensure a user can only have one membership record per study group
studyGroupMemberSchema.index({ userId: 1, studyGroupId: 1 }, { unique: true })

module.exports = mongoose.model("StudyGroupMember", studyGroupMemberSchema)

