// Profile Portfolio Functions
// Handles user projects, experience, and manually-added skills

Parse.Cloud.define('addUserProject', async (request) => {
  const { user } = request;
  if (!user) throw new Error('User must be authenticated');

  const { title, type, status, description, technologies, githubUrl, liveUrl, startDate, endDate } = request.params;
  if (!title || !description) throw new Parse.Error(Parse.Error.INVALID_QUERY, 'title and description are required');

  const UserProject = Parse.Object.extend('UserProject');
  const project = new UserProject();
  project.set('user', user);
  project.set('title', title);
  project.set('type', type || 'Personal Project');
  project.set('status', status || 'In Progress');
  project.set('description', description);
  project.set('technologies', technologies || []);
  if (githubUrl) project.set('repositoryUrl', githubUrl);
  if (liveUrl) project.set('url', liveUrl);
  if (startDate) project.set('startDate', startDate);
  if (endDate) project.set('endDate', endDate);

  const acl = new Parse.ACL();
  acl.setReadAccess(user.id, true);
  acl.setWriteAccess(user.id, true);
  project.setACL(acl);

  await project.save(null, { useMasterKey: true });

  return {
    success: true,
    project: {
      id: project.id,
      title: project.get('title'),
      type: project.get('type'),
      status: project.get('status'),
      description: project.get('description'),
      technologies: project.get('technologies'),
      githubUrl: project.get('repositoryUrl'),
      liveUrl: project.get('url'),
      startDate: project.get('startDate'),
      endDate: project.get('endDate'),
    }
  };
});

Parse.Cloud.define('addUserExperience', async (request) => {
  const { user } = request;
  if (!user) throw new Error('User must be authenticated');

  const { title, company, type, startDate, endDate, current, description } = request.params;
  if (!title || !company || !description) {
    throw new Parse.Error(Parse.Error.INVALID_QUERY, 'title, company and description are required');
  }

  const UserExperience = Parse.Object.extend('UserExperience');
  const exp = new UserExperience();
  exp.set('user', user);
  exp.set('title', title);
  exp.set('company', company);
  exp.set('type', type || 'Internship');
  exp.set('description', description);
  exp.set('startDate', startDate);
  exp.set('isCurrent', current || false);
  if (!current && endDate) exp.set('endDate', endDate);

  const acl = new Parse.ACL();
  acl.setReadAccess(user.id, true);
  acl.setWriteAccess(user.id, true);
  exp.setACL(acl);

  await exp.save(null, { useMasterKey: true });

  return {
    success: true,
    experience: {
      id: exp.id,
      title: exp.get('title'),
      company: exp.get('company'),
      type: exp.get('type'),
      startDate: exp.get('startDate'),
      endDate: exp.get('endDate') || null,
      current: exp.get('isCurrent'),
      description: exp.get('description'),
    }
  };
});

Parse.Cloud.define('addUserSkills', async (request) => {
  const { user } = request;
  if (!user) throw new Error('User must be authenticated');

  const { skills } = request.params;
  if (!skills || !Array.isArray(skills) || skills.length === 0) {
    throw new Parse.Error(Parse.Error.INVALID_QUERY, 'skills array is required');
  }

  const UserProfileSkill = Parse.Object.extend('UserProfileSkill');

  const saves = skills.map(skill => {
    const obj = new UserProfileSkill();
    obj.set('user', user);
    obj.set('name', skill.name);
    obj.set('category', skill.category || 'Other');
    obj.set('level', skill.level || 50);
    const acl = new Parse.ACL();
    acl.setReadAccess(user.id, true);
    acl.setWriteAccess(user.id, true);
    obj.setACL(acl);
    return obj.save(null, { useMasterKey: true });
  });

  await Promise.all(saves);

  return { success: true, count: skills.length };
});

Parse.Cloud.define('suggestSkills', async (request) => {
  const { riasecType, projectTechnologies, existingSkills } = request.params;

  const suggestions = new Set();

  // Add project technologies as suggested skills
  (projectTechnologies || []).forEach(tech => suggestions.add(tech));

  // RIASEC personality-based suggestions
  const riasecMap = {
    'R': ['Problem Solving', 'Attention to Detail', 'Technical Skills', 'Manual Dexterity', 'Engineering'],
    'I': ['Research', 'Critical Thinking', 'Data Analysis', 'Problem Solving', 'Scientific Writing'],
    'A': ['Creativity', 'Graphic Design', 'Communication', 'Innovation', 'Content Writing'],
    'S': ['Communication', 'Empathy', 'Teamwork', 'Leadership', 'Counselling', 'Teaching'],
    'E': ['Leadership', 'Public Speaking', 'Negotiation', 'Project Management', 'Entrepreneurship'],
    'C': ['Organisation', 'Attention to Detail', 'Time Management', 'Data Entry', 'Bookkeeping']
  };

  if (riasecType && riasecMap[riasecType]) {
    riasecMap[riasecType].forEach(s => suggestions.add(s));
  }

  // Universal student skills
  ['Communication', 'Teamwork', 'Time Management', 'Critical Thinking', 'Microsoft Office', 'Research']
    .forEach(s => suggestions.add(s));

  const existingLower = (existingSkills || []).map(s => s.toLowerCase());
  const filtered = Array.from(suggestions)
    .filter(s => !existingLower.includes(s.toLowerCase()))
    .slice(0, 12);

  return { success: true, suggestions: filtered };
});

Parse.Cloud.define('getUserProfileSkills', async (request) => {
  const { user } = request;
  if (!user) throw new Error('User must be authenticated');

  const query = new Parse.Query('UserProfileSkill');
  query.equalTo('user', user);
  query.ascending('category');
  query.limit(100);

  const results = await query.find({ useMasterKey: true });

  return {
    success: true,
    skills: results.map(s => ({
      id: s.id,
      name: s.get('name'),
      category: s.get('category'),
      level: s.get('level'),
    }))
  };
});
