const mongoose = require('mongoose');
const ProjectType = {
  SHARED: 'shared',
  OWN: 'own',
};
const ProjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: 'Untitled project',
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    projectType: {
      type: String,
      enum: [ProjectType.SHARED, ProjectType.OWN],
      required: true,
      default: ProjectType.OWN,
    },
  },
  { timestamps: true }
);

const Project = mongoose.model('Project', ProjectSchema);

module.exports = Project;
