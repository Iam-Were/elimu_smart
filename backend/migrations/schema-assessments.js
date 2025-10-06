/**
 * Parse Database Schema for Assessments
 * Defines the structure for assessment questions and results
 */

const assessmentSchema = {
  // RIASEC Career Assessment Questions
  RiasecQuestion: {
    className: 'RiasecQuestion',
    fields: {
      questionId: { type: 'Number', required: true },
      category: { type: 'String', required: true }, // 'activities' or 'occupations'
      statement: { type: 'String', required: true },
      riasecType: { type: 'String', required: true }, // 'R', 'I', 'A', 'S', 'E', 'C'
      kenyaContext: { type: 'String', required: false },
      isActive: { type: 'Boolean', default: true }
    },
    classLevelPermissions: {
      find: { '*': true },
      get: { '*': true },
      create: { requiresAuthentication: true },
      update: { requiresAuthentication: true },
      delete: { requiresAuthentication: true }
    },
    indexes: {
      questionId: { questionId: 1 },
      riasecType: { riasecType: 1 },
      category: { category: 1 }
    }
  },

  // Skills Assessment Questions
  SkillQuestion: {
    className: 'SkillQuestion',
    fields: {
      questionId: { type: 'Number', required: true },
      text: { type: 'String', required: true },
      category: { type: 'String', required: true }, // 'Critical Thinking', 'Communication', etc.
      isActive: { type: 'Boolean', default: true }
    },
    classLevelPermissions: {
      find: { '*': true },
      get: { '*': true },
      create: { requiresAuthentication: true },
      update: { requiresAuthentication: true },
      delete: { requiresAuthentication: true }
    },
    indexes: {
      questionId: { questionId: 1 },
      category: { category: 1 }
    }
  },

  // Assessment Results (for storing user responses)
  AssessmentResult: {
    className: 'AssessmentResult',
    fields: {
      user: { type: 'Pointer', targetClass: '_User', required: true },
      assessmentType: { type: 'String', required: true }, // 'riasec', 'skills', 'university', etc.
      responses: { type: 'Object', required: true }, // JSON of question IDs and answers
      scores: { type: 'Object', required: true }, // Calculated scores
      results: { type: 'Object', required: true }, // Full results object
      completedAt: { type: 'Date', required: true },
      isActive: { type: 'Boolean', default: true }
    },
    classLevelPermissions: {
      find: { requiresAuthentication: true },
      get: { requiresAuthentication: true },
      create: { requiresAuthentication: true },
      update: { requiresAuthentication: true },
      delete: { requiresAuthentication: true }
    },
    indexes: {
      user: { user: 1 },
      assessmentType: { assessmentType: 1 },
      completedAt: { completedAt: -1 }
    }
  }
};

module.exports = assessmentSchema;
