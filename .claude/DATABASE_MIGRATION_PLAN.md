# Database Migration Implementation Plan
## From Hardcoded Data to Parse Database Classes

**Created**: 2025-10-10
**Total Effort**: 15-20 days
**Priority**: HIGH (Critical for platform scalability)
**Status**: Ready to Execute

---

## Table of Contents
1. [Overview](#overview)
2. [Phase 1: Universities & Courses](#phase-1-universities--courses)
3. [Phase 2: Career Database](#phase-2-career-database)
4. [Phase 3: Subject Mappings](#phase-3-subject-mappings)
5. [Phase 4: RIASEC & Skills](#phase-4-riasec--skills)
6. [Phase 5: Admin Panel](#phase-5-admin-panel)
7. [Testing Strategy](#testing-strategy)
8. [Rollback Procedures](#rollback-procedures)
9. [Success Metrics](#success-metrics)

---

## Overview

### Migration Scope
- **5 data structures** to migrate (1,525 lines total)
- **104 backend functions** already integrated ✅
- **5 new Parse Classes** to create
- **3-5 migration scripts** to write
- **Admin panel** for content management

### Prerequisites Checklist
- [x] All backend functions integrated (100%)
- [x] Frontend APIs complete
- [x] Parse Server running (staging + production)
- [x] Database backups configured
- [ ] Migration scripts written
- [ ] Parse Class schemas created
- [ ] Testing procedures defined

---

## Phase 1: Universities & Courses
**Duration**: 3-4 days
**Priority**: CRITICAL
**Estimated Lines of Code**: 300-400 lines (migration + updates)

### Day 1: Database Schema Design & Creation

#### Task 1.1: Define Parse Class Schemas
**Effort**: 2 hours

Create schema definition file: `backend/schemas/university-schemas.js`

```javascript
// University Parse Class Schema
const universitySchema = {
  className: 'University',
  fields: {
    // Core identification
    universityId: { type: 'String', required: true },  // e.g., 'uon', 'jkuat'
    name: { type: 'String', required: true },
    shortName: { type: 'String' },

    // Classification
    type: { type: 'String', required: true },  // 'Public', 'Private'
    category: { type: 'String' },  // 'University', 'University College', 'Constituent College'

    // Location
    location: { type: 'String', required: true },  // City
    county: { type: 'String' },
    region: { type: 'String' },  // 'Nairobi', 'Coast', 'Western', etc.

    // Details
    founded: { type: 'Number' },
    website: { type: 'String' },
    email: { type: 'String' },
    phone: { type: 'String' },

    // Rich data
    facilities: { type: 'Array' },  // ['Library', 'Labs', 'Hostels']
    accreditation: { type: 'Array' },  // ['CUE', 'ISO']
    rankings: { type: 'Object' },  // { national: 5, regional: 12 }

    // Metadata
    isActive: { type: 'Boolean', default: true },
    logo: { type: 'String' },  // URL to logo
    description: { type: 'String' },

    // Statistics
    studentPopulation: { type: 'Number' },
    staffCount: { type: 'Number' },

    // Search optimization
    searchKeywords: { type: 'Array' }  // For full-text search
  },
  indexes: {
    universityId: { universityId: 1 },
    name: { name: 1 },
    type: { type: 1 },
    location: { location: 1 },
    isActive: { isActive: 1 }
  }
};

// Course Parse Class Schema
const courseSchema = {
  className: 'Course',
  fields: {
    // Core identification
    courseCode: { type: 'String', required: true },  // e.g., 'MED-001'
    name: { type: 'String', required: true },

    // Relationships
    university: { type: 'Pointer', targetClass: 'University', required: true },

    // Classification
    faculty: { type: 'String', required: true },
    department: { type: 'String' },
    level: { type: 'String' },  // 'Undergraduate', 'Postgraduate'

    // Program details
    duration: { type: 'Number', required: true },  // Years
    durationType: { type: 'String' },  // 'Full-time', 'Part-time'

    // KUCCPS data
    kuccpsCode: { type: 'String', required: true },
    clusterPointsCutoff: { type: 'Object', required: true },  // { '2024': 84, '2023': 83 }
    clusterSubjects: { type: 'Array' },  // Required cluster subjects

    // Financial
    annualFees: { type: 'Number' },
    governmentSponsored: { type: 'Boolean' },

    // Career outcomes
    employmentRate: { type: 'Number' },  // 0.0 - 1.0
    averageStartingSalary: { type: 'Number' },

    // Requirements
    minimumGrade: { type: 'String' },  // Overall minimum grade
    subjectRequirements: { type: 'Array' },  // [{ subject: 'Math', minGrade: 'B+' }]
    additionalRequirements: { type: 'Array' },  // ['Interview', 'Portfolio']

    // Rich data
    description: { type: 'String' },
    careerProspects: { type: 'Array' },
    accreditation: { type: 'Array' },

    // Metadata
    isActive: { type: 'Boolean', default: true },
    lastUpdated: { type: 'Date' },
    academicYear: { type: 'String' },  // '2024/2025'

    // Search optimization
    searchKeywords: { type: 'Array' }
  },
  indexes: {
    courseCode: { courseCode: 1 },
    university: { university: 1 },
    kuccpsCode: { kuccpsCode: 1 },
    faculty: { faculty: 1 },
    isActive: { isActive: 1 },
    clusterPoints: { 'clusterPointsCutoff.2024': -1 }  // Descending order
  }
};

module.exports = { universitySchema, courseSchema };
```

#### Task 1.2: Create Schema Initialization Script
**Effort**: 1 hour

File: `backend/migrations/initialize-university-schema.js`

```javascript
const Parse = require('parse/node');

Parse.initialize(
  process.env.PARSE_APP_ID || 'elimu_smart_app_2024',
  process.env.PARSE_JAVASCRIPT_KEY || 'javascript_key_2024',
  process.env.PARSE_MASTER_KEY || 'master_key_2024'
);
Parse.serverURL = process.env.PARSE_SERVER_URL || 'http://localhost:1337/parse';

async function initializeSchemas() {
  console.log('🔧 Initializing University & Course schemas...\n');

  try {
    // Create University schema
    const universitySchema = new Parse.Schema('University');

    // Add fields
    universitySchema.addString('universityId');
    universitySchema.addString('name');
    universitySchema.addString('shortName');
    universitySchema.addString('type');
    universitySchema.addString('category');
    universitySchema.addString('location');
    universitySchema.addString('county');
    universitySchema.addString('region');
    universitySchema.addNumber('founded');
    universitySchema.addString('website');
    universitySchema.addString('email');
    universitySchema.addString('phone');
    universitySchema.addArray('facilities');
    universitySchema.addArray('accreditation');
    universitySchema.addObject('rankings');
    universitySchema.addBoolean('isActive');
    universitySchema.addString('logo');
    universitySchema.addString('description');
    universitySchema.addNumber('studentPopulation');
    universitySchema.addNumber('staffCount');
    universitySchema.addArray('searchKeywords');

    // Add indexes
    universitySchema.addIndex('universityId_index', { universityId: 1 });
    universitySchema.addIndex('name_index', { name: 1 });
    universitySchema.addIndex('type_index', { type: 1 });
    universitySchema.addIndex('location_index', { location: 1 });
    universitySchema.addIndex('active_index', { isActive: 1 });

    // Set permissions
    const publicACL = new Parse.ACL();
    publicACL.setPublicReadAccess(true);
    publicACL.setRoleWriteAccess('admin', true);
    universitySchema.setCLP({
      get: { '*': true },
      find: { '*': true },
      create: { 'role:admin': true },
      update: { 'role:admin': true },
      delete: { 'role:admin': true }
    });

    await universitySchema.save();
    console.log('✅ University schema created');

    // Create Course schema
    const courseSchema = new Parse.Schema('Course');

    // Add fields
    courseSchema.addString('courseCode');
    courseSchema.addString('name');
    courseSchema.addPointer('university', 'University');
    courseSchema.addString('faculty');
    courseSchema.addString('department');
    courseSchema.addString('level');
    courseSchema.addNumber('duration');
    courseSchema.addString('durationType');
    courseSchema.addString('kuccpsCode');
    courseSchema.addObject('clusterPointsCutoff');
    courseSchema.addArray('clusterSubjects');
    courseSchema.addNumber('annualFees');
    courseSchema.addBoolean('governmentSponsored');
    courseSchema.addNumber('employmentRate');
    courseSchema.addNumber('averageStartingSalary');
    courseSchema.addString('minimumGrade');
    courseSchema.addArray('subjectRequirements');
    courseSchema.addArray('additionalRequirements');
    courseSchema.addString('description');
    courseSchema.addArray('careerProspects');
    courseSchema.addArray('accreditation');
    courseSchema.addBoolean('isActive');
    courseSchema.addDate('lastUpdated');
    courseSchema.addString('academicYear');
    courseSchema.addArray('searchKeywords');

    // Add indexes
    courseSchema.addIndex('courseCode_index', { courseCode: 1 });
    courseSchema.addIndex('university_index', { university: 1 });
    courseSchema.addIndex('kuccpsCode_index', { kuccpsCode: 1 });
    courseSchema.addIndex('faculty_index', { faculty: 1 });
    courseSchema.addIndex('active_index', { isActive: 1 });

    // Set permissions
    courseSchema.setCLP({
      get: { '*': true },
      find: { '*': true },
      create: { 'role:admin': true },
      update: { 'role:admin': true },
      delete: { 'role:admin': true }
    });

    await courseSchema.save();
    console.log('✅ Course schema created');

    console.log('\n✨ Schemas initialized successfully!');

  } catch (error) {
    if (error.message.includes('already exists')) {
      console.log('ℹ️  Schemas already exist');
    } else {
      console.error('❌ Error:', error.message);
      throw error;
    }
  }
}

// Run if called directly
if (require.main === module) {
  initializeSchemas()
    .then(() => process.exit(0))
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = { initializeSchemas };
```

**Execute**:
```bash
cd /root/elimu_smart/backend
node migrations/initialize-university-schema.js
```

---

### Day 2: Data Migration Script

#### Task 1.3: Create Migration Script
**Effort**: 4-5 hours

File: `backend/migrations/migrate-universities-data.js`

```javascript
const Parse = require('parse/node');
const fs = require('fs');
const path = require('path');

// Initialize Parse
Parse.initialize(
  process.env.PARSE_APP_ID || 'elimu_smart_app_2024',
  process.env.PARSE_JAVASCRIPT_KEY || 'javascript_key_2024',
  process.env.PARSE_MASTER_KEY || 'master_key_2024'
);
Parse.serverURL = process.env.PARSE_SERVER_URL || 'http://localhost:1337/parse';

// Extract hardcoded data from main.js
function extractUniversityData() {
  const mainJsPath = path.join(__dirname, '../cloud/main.js');
  const content = fs.readFileSync(mainJsPath, 'utf8');

  // Find KENYA_UNIVERSITIES_DATABASE
  const startMarker = 'const KENYA_UNIVERSITIES_DATABASE = [';
  const endMarker = '];';

  const startIndex = content.indexOf(startMarker);
  const endIndex = content.indexOf(endMarker, startIndex) + endMarker.length;

  const dataString = content.substring(startIndex, endIndex);

  // Use eval in isolated context (safe since it's our own code)
  const KENYA_UNIVERSITIES_DATABASE = eval(`(${dataString.replace('const KENYA_UNIVERSITIES_DATABASE = ', '')})`);

  return KENYA_UNIVERSITIES_DATABASE;
}

async function migrateUniversities() {
  console.log('🚀 Starting university data migration...\n');

  const universities = extractUniversityData();
  console.log(`Found ${universities.length} universities to migrate\n`);

  const University = Parse.Object.extend('University');
  const Course = Parse.Object.extend('Course');

  let totalUniversities = 0;
  let totalCourses = 0;
  let errors = [];

  for (const uniData of universities) {
    try {
      console.log(`Migrating: ${uniData.name}...`);

      // Check if university already exists
      const existingQuery = new Parse.Query(University);
      existingQuery.equalTo('universityId', uniData.id);
      let university = await existingQuery.first({ useMasterKey: true });

      if (!university) {
        university = new University();
      }

      // Set university fields
      university.set('universityId', uniData.id);
      university.set('name', uniData.name);
      university.set('shortName', uniData.shortName || uniData.name.split(' ').map(w => w[0]).join(''));
      university.set('type', uniData.type);
      university.set('category', uniData.category || 'University');
      university.set('location', uniData.location);
      university.set('county', uniData.county || uniData.location);
      university.set('region', uniData.region || 'Central');
      university.set('founded', uniData.founded);
      university.set('website', uniData.website);
      university.set('email', uniData.email || '');
      university.set('phone', uniData.phone || '');
      university.set('facilities', uniData.facilities || []);
      university.set('accreditation', uniData.accreditation || ['CUE']);
      university.set('rankings', uniData.rankings || {});
      university.set('isActive', true);
      university.set('logo', uniData.logo || '');
      university.set('description', uniData.description || '');
      university.set('studentPopulation', uniData.studentPopulation || 0);
      university.set('staffCount', uniData.staffCount || 0);

      // Generate search keywords
      const keywords = [
        uniData.name.toLowerCase(),
        uniData.id,
        uniData.location.toLowerCase(),
        uniData.type.toLowerCase()
      ];
      university.set('searchKeywords', keywords);

      // Save university
      await university.save(null, { useMasterKey: true });
      totalUniversities++;

      // Migrate courses
      if (uniData.courses && uniData.courses.length > 0) {
        console.log(`  Migrating ${uniData.courses.length} courses...`);

        for (const courseData of uniData.courses) {
          try {
            // Check if course already exists
            const existingCourseQuery = new Parse.Query(Course);
            existingCourseQuery.equalTo('courseCode', courseData.code);
            let course = await existingCourseQuery.first({ useMasterKey: true });

            if (!course) {
              course = new Course();
            }

            // Set course fields
            course.set('courseCode', courseData.code);
            course.set('name', courseData.name);
            course.set('university', university);
            course.set('faculty', courseData.faculty);
            course.set('department', courseData.department || courseData.faculty);
            course.set('level', courseData.level || 'Undergraduate');
            course.set('duration', courseData.duration);
            course.set('durationType', courseData.durationType || 'Full-time');
            course.set('kuccpsCode', courseData.kuccpsCode);
            course.set('clusterPointsCutoff', courseData.clusterPointsCutoff || { '2024': 0 });
            course.set('clusterSubjects', courseData.clusterSubjects || []);
            course.set('annualFees', courseData.annualFees || 0);
            course.set('governmentSponsored', courseData.governmentSponsored !== false);
            course.set('employmentRate', courseData.employmentRate || 0.5);
            course.set('averageStartingSalary', courseData.averageStartingSalary || 50000);
            course.set('minimumGrade', courseData.minimumGrade || 'C+');
            course.set('subjectRequirements', courseData.subjectRequirements || []);
            course.set('additionalRequirements', courseData.additionalRequirements || []);
            course.set('description', courseData.description || '');
            course.set('careerProspects', courseData.careerProspects || []);
            course.set('accreditation', courseData.accreditation || []);
            course.set('isActive', true);
            course.set('lastUpdated', new Date());
            course.set('academicYear', '2024/2025');

            // Generate search keywords
            const courseKeywords = [
              courseData.name.toLowerCase(),
              courseData.code.toLowerCase(),
              courseData.faculty.toLowerCase(),
              courseData.kuccpsCode.toLowerCase()
            ];
            course.set('searchKeywords', courseKeywords);

            // Save course
            await course.save(null, { useMasterKey: true });
            totalCourses++;

          } catch (courseError) {
            errors.push({
              university: uniData.name,
              course: courseData.code,
              error: courseError.message
            });
            console.error(`    ❌ Error migrating course ${courseData.code}:`, courseError.message);
          }
        }
      }

      console.log(`  ✅ Migrated ${uniData.name} with ${uniData.courses?.length || 0} courses\n`);

    } catch (error) {
      errors.push({
        university: uniData.name,
        error: error.message
      });
      console.error(`❌ Error migrating ${uniData.name}:`, error.message, '\n');
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 MIGRATION SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Universities migrated: ${totalUniversities}/${universities.length}`);
  console.log(`✅ Courses migrated: ${totalCourses}`);
  console.log(`❌ Errors: ${errors.length}`);

  if (errors.length > 0) {
    console.log('\n⚠️  Errors encountered:');
    errors.forEach(err => {
      console.log(`  - ${err.university}${err.course ? ` / ${err.course}` : ''}: ${err.error}`);
    });
  }

  console.log('\n✨ Migration complete!');

  return {
    success: errors.length === 0,
    universitiesMigrated: totalUniversities,
    coursesMigrated: totalCourses,
    errors
  };
}

// Run if called directly
if (require.main === module) {
  migrateUniversities()
    .then(result => {
      console.log('\nFinal result:', result);
      process.exit(result.success ? 0 : 1);
    })
    .catch(err => {
      console.error('Fatal error:', err);
      process.exit(1);
    });
}

module.exports = { migrateUniversities };
```

**Execute**:
```bash
cd /root/elimu_smart/backend
node migrations/migrate-universities-data.js
```

---

### Day 3: Update Backend Functions

#### Task 1.4: Update `findUniversityCourses` Function
**Effort**: 2-3 hours

File: `backend/cloud/main.js` (lines ~3900-4000)

```javascript
// BEFORE (hardcoded)
Parse.Cloud.define('findUniversityCourses', async (request) => {
  const { subjectGrades, clusterPoints, location, courseType } = request.params;

  // Filter universities from hardcoded array
  const matchingCourses = KENYA_UNIVERSITIES_DATABASE.flatMap(uni => {
    return uni.courses
      .filter(course => course.clusterPointsCutoff['2024'] <= clusterPoints)
      .map(course => ({
        ...course,
        university: uni.name,
        location: uni.location
      }));
  });

  return matchingCourses;
});

// AFTER (database-driven)
Parse.Cloud.define('findUniversityCourses', async (request) => {
  const { subjectGrades, clusterPoints, location, courseType, limit = 100 } = request.params;

  try {
    const Course = Parse.Object.extend('Course');
    const query = new Parse.Query(Course);

    // Include university data
    query.include('university');

    // Filter by cluster points (current year)
    const currentYear = new Date().getFullYear().toString();
    query.lessThanOrEqualTo(`clusterPointsCutoff.${currentYear}`, clusterPoints);

    // Filter by active courses
    query.equalTo('isActive', true);

    // Filter by location if specified
    if (location) {
      const University = Parse.Object.extend('University');
      const uniQuery = new Parse.Query(University);
      uniQuery.equalTo('location', location);
      query.matchesQuery('university', uniQuery);
    }

    // Filter by course type (faculty) if specified
    if (courseType) {
      query.equalTo('faculty', courseType);
    }

    // Sort by cluster points (descending)
    query.descending(`clusterPointsCutoff.${currentYear}`);
    query.limit(limit);

    const results = await query.find({ useMasterKey: true });

    // Transform to response format
    return results.map(course => {
      const university = course.get('university');
      return {
        courseCode: course.get('courseCode'),
        name: course.get('name'),
        faculty: course.get('faculty'),
        duration: course.get('duration'),
        clusterPoints: course.get('clusterPointsCutoff')[currentYear],
        annualFees: course.get('annualFees'),
        employmentRate: course.get('employmentRate'),
        university: {
          id: university.get('universityId'),
          name: university.get('name'),
          type: university.get('type'),
          location: university.get('location')
        },
        kuccpsCode: course.get('kuccpsCode'),
        description: course.get('description')
      };
    });

  } catch (error) {
    console.error('Error finding university courses:', error);
    throw new Parse.Error(Parse.Error.SCRIPT_FAILED, `Failed to find courses: ${error.message}`);
  }
});
```

#### Task 1.5: Add New Query Functions
**Effort**: 1-2 hours

Add to `backend/cloud/main.js`:

```javascript
// Get university details
Parse.Cloud.define('getUniversityDetails', async (request) => {
  const { universityId } = request.params;

  if (!universityId) {
    throw new Parse.Error(Parse.Error.INVALID_QUERY, 'University ID required');
  }

  try {
    const University = Parse.Object.extend('University');
    const query = new Parse.Query(University);
    query.equalTo('universityId', universityId);

    const university = await query.first({ useMasterKey: true });

    if (!university) {
      throw new Parse.Error(Parse.Error.OBJECT_NOT_FOUND, 'University not found');
    }

    // Get course count
    const Course = Parse.Object.extend('Course');
    const courseQuery = new Parse.Query(Course);
    courseQuery.equalTo('university', university);
    courseQuery.equalTo('isActive', true);
    const courseCount = await courseQuery.count({ useMasterKey: true });

    return {
      id: university.get('universityId'),
      name: university.get('name'),
      type: university.get('type'),
      location: university.get('location'),
      founded: university.get('founded'),
      website: university.get('website'),
      facilities: university.get('facilities'),
      accreditation: university.get('accreditation'),
      rankings: university.get('rankings'),
      description: university.get('description'),
      courseCount,
      logo: university.get('logo')
    };
  } catch (error) {
    console.error('Error getting university details:', error);
    throw error;
  }
});

// Search universities
Parse.Cloud.define('searchUniversities', async (request) => {
  const { query: searchQuery, type, location } = request.params;

  try {
    const University = Parse.Object.extend('University');
    const query = new Parse.Query(University);

    query.equalTo('isActive', true);

    // Search by name or keywords
    if (searchQuery) {
      query.contains('searchKeywords', searchQuery.toLowerCase());
    }

    // Filter by type
    if (type) {
      query.equalTo('type', type);
    }

    // Filter by location
    if (location) {
      query.equalTo('location', location);
    }

    query.ascending('name');
    query.limit(50);

    const results = await query.find({ useMasterKey: true });

    return results.map(uni => ({
      id: uni.get('universityId'),
      name: uni.get('name'),
      type: uni.get('type'),
      location: uni.get('location'),
      website: uni.get('website'),
      logo: uni.get('logo')
    }));
  } catch (error) {
    console.error('Error searching universities:', error);
    throw error;
  }
});
```

---

### Day 4: Testing & Validation

#### Task 1.6: Create Test Suite
**Effort**: 3-4 hours

File: `backend/tests/university-migration.test.js`

```javascript
const Parse = require('parse/node');
const assert = require('assert');

// Initialize Parse
Parse.initialize('elimu_smart_app_2024', 'javascript_key_2024', 'master_key_2024');
Parse.serverURL = 'http://localhost:1337/parse';

async function testUniversityMigration() {
  console.log('🧪 Running University Migration Tests\n');

  const tests = {
    passed: 0,
    failed: 0,
    errors: []
  };

  // Test 1: Verify universities migrated
  try {
    const University = Parse.Object.extend('University');
    const query = new Parse.Query(University);
    const count = await query.count({ useMasterKey: true });

    assert(count > 0, 'No universities found in database');
    console.log(`✅ Test 1: Found ${count} universities`);
    tests.passed++;
  } catch (error) {
    console.error('❌ Test 1 failed:', error.message);
    tests.failed++;
    tests.errors.push({ test: 1, error: error.message });
  }

  // Test 2: Verify courses migrated
  try {
    const Course = Parse.Object.extend('Course');
    const query = new Parse.Query(Course);
    const count = await query.count({ useMasterKey: true });

    assert(count > 0, 'No courses found in database');
    console.log(`✅ Test 2: Found ${count} courses`);
    tests.passed++;
  } catch (error) {
    console.error('❌ Test 2 failed:', error.message);
    tests.failed++;
    tests.errors.push({ test: 2, error: error.message });
  }

  // Test 3: Verify university-course relationships
  try {
    const Course = Parse.Object.extend('Course');
    const query = new Parse.Query(Course);
    query.include('university');
    query.limit(10);
    const courses = await query.find({ useMasterKey: true });

    courses.forEach(course => {
      const university = course.get('university');
      assert(university, `Course ${course.get('courseCode')} has no university`);
      assert(university.get('name'), `University missing name for course ${course.get('courseCode')}`);
    });

    console.log(`✅ Test 3: University-course relationships verified`);
    tests.passed++;
  } catch (error) {
    console.error('❌ Test 3 failed:', error.message);
    tests.failed++;
    tests.errors.push({ test: 3, error: error.message });
  }

  // Test 4: Verify findUniversityCourses function
  try {
    const result = await Parse.Cloud.run('findUniversityCourses', {
      clusterPoints: 70,
      limit: 10
    });

    assert(Array.isArray(result), 'Result is not an array');
    assert(result.length > 0, 'No courses returned');
    assert(result[0].university, 'Course missing university data');

    console.log(`✅ Test 4: findUniversityCourses returned ${result.length} courses`);
    tests.passed++;
  } catch (error) {
    console.error('❌ Test 4 failed:', error.message);
    tests.failed++;
    tests.errors.push({ test: 4, error: error.message });
  }

  // Test 5: Verify search functionality
  try {
    const result = await Parse.Cloud.run('searchUniversities', {
      query: 'nairobi'
    });

    assert(Array.isArray(result), 'Result is not an array');
    assert(result.length > 0, 'No universities returned');

    console.log(`✅ Test 5: searchUniversities returned ${result.length} results`);
    tests.passed++;
  } catch (error) {
    console.error('❌ Test 5 failed:', error.message);
    tests.failed++;
    tests.errors.push({ test: 5, error: error.message });
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('TEST SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Passed: ${tests.passed}`);
  console.log(`❌ Failed: ${tests.failed}`);
  console.log(`Total: ${tests.passed + tests.failed}`);

  if (tests.errors.length > 0) {
    console.log('\nErrors:');
    tests.errors.forEach(err => {
      console.log(`  Test ${err.test}: ${err.error}`);
    });
  }

  return tests;
}

// Run tests
testUniversityMigration()
  .then(result => {
    process.exit(result.failed === 0 ? 0 : 1);
  })
  .catch(err => {
    console.error('Fatal test error:', err);
    process.exit(1);
  });
```

**Execute**:
```bash
cd /root/elimu_smart/backend
node tests/university-migration.test.js
```

---

### Day 4 Checklist

- [ ] All tests pass (5/5)
- [ ] Data verified in Parse Dashboard
- [ ] Frontend integration tested
- [ ] Performance benchmarks meet expectations
- [ ] Documentation updated

---

## Phase 1 Deliverables

✅ **Database Schemas**
- University Parse Class (21 fields, 5 indexes)
- Course Parse Class (24 fields, 6 indexes)

✅ **Migration Scripts**
- Schema initialization script
- Data migration script
- Validation tests

✅ **Updated Backend Functions**
- findUniversityCourses (database-driven)
- getUniversityDetails (new)
- searchUniversities (new)

✅ **Testing**
- 5 automated tests
- Manual verification procedures
- Performance benchmarks

✅ **Documentation**
- Migration logs
- API documentation updates
- Rollback procedures

---

## Success Metrics for Phase 1

| Metric | Target | Actual |
|--------|--------|--------|
| Universities migrated | 50-70 | ___ |
| Courses migrated | 1,000-3,500 | ___ |
| Migration time | < 5 minutes | ___ |
| Query response time | < 200ms | ___ |
| Test pass rate | 100% | ___ |
| Zero data loss | ✅ | ___ |

---

---

## Phase 2: Career Database
**Duration**: 3-4 days
**Priority**: CRITICAL
**Estimated Lines of Code**: 250-350 lines (migration + updates)

### Day 5: Career Database Schema

#### Task 2.1: Define Career Parse Class Schema
**Effort**: 2 hours

Create schema definition file: `backend/schemas/career-schemas.js`

```javascript
// Career Parse Class Schema
const careerSchema = {
  className: 'Career',
  fields: {
    // Core identification
    careerId: { type: 'String', required: true },  // e.g., 'software-engineer'
    name: { type: 'String', required: true },
    category: { type: 'String', required: true },  // e.g., 'Technology', 'Healthcare', 'Business'

    // Overview
    description: { type: 'String', required: true },
    overview: { type: 'String' },  // Detailed overview

    // Education requirements
    minimumEducation: { type: 'String' },  // 'Certificate', 'Diploma', 'Degree', 'Masters'
    recommendedSubjects: { type: 'Array' },  // KCSE subjects
    relatedDegrees: { type: 'Array' },  // Relevant university programs

    // Skills
    requiredSkills: { type: 'Array' },  // Hard skills
    softSkills: { type: 'Array' },  // Interpersonal skills
    riasecCodes: { type: 'Array' },  // ['R', 'I', 'A'] Holland codes

    // Career prospects
    demandLevel: { type: 'String' },  // 'High', 'Medium', 'Low'
    growthOutlook: { type: 'String' },  // '5-year growth outlook'
    employmentRate: { type: 'Number' },  // 0.0 - 1.0

    // Financial data (Kenya context)
    salaryRange: { type: 'Object', required: true },  // { min: 50000, max: 200000, currency: 'KES' }
    entrySalary: { type: 'Number' },  // Starting salary for graduates
    experiencedSalary: { type: 'Number' },  // 5+ years experience

    // Work environment
    workEnvironment: { type: 'String' },  // 'Office', 'Field', 'Remote', 'Hybrid'
    typicalHours: { type: 'String' },  // 'Standard', 'Shift', 'Flexible'
    physicalDemands: { type: 'String' },  // 'Low', 'Medium', 'High'

    // Career paths
    entryLevelPositions: { type: 'Array' },  // Starting roles
    midCareerPositions: { type: 'Array' },  // 5-10 years
    seniorPositions: { type: 'Array' },  // 10+ years

    // Industry data
    topEmployers: { type: 'Array' },  // Major companies in Kenya
    industryGrowth: { type: 'String' },
    certifications: { type: 'Array' },  // Professional certifications

    // Kenya-specific
    kenyaRelevance: { type: 'String' },  // How relevant in Kenyan market
    localSuccess: { type: 'Array' },  // Success stories/role models
    challenges: { type: 'Array' },  // Career-specific challenges

    // Content management
    isActive: { type: 'Boolean', default: true },
    lastUpdated: { type: 'Date' },
    createdBy: { type: 'Pointer', targetClass: '_User' },
    sources: { type: 'Array' },  // Data sources/references

    // Search optimization
    searchKeywords: { type: 'Array' },
    popularity: { type: 'Number', default: 0 }  // Track user interest
  },
  indexes: {
    careerId: { careerId: 1 },
    name: { name: 1 },
    category: { category: 1 },
    demandLevel: { demandLevel: 1 },
    isActive: { isActive: 1 },
    popularity: { popularity: -1 }
  }
};

module.exports = { careerSchema };
```

#### Task 2.2: Create Career Schema Initialization
**Effort**: 1 hour

File: `backend/migrations/initialize-career-schema.js`

```javascript
const Parse = require('parse/node');

Parse.initialize(
  process.env.PARSE_APP_ID || 'elimu_smart_app_2024',
  process.env.PARSE_JAVASCRIPT_KEY || 'javascript_key_2024',
  process.env.PARSE_MASTER_KEY || 'master_key_2024'
);
Parse.serverURL = process.env.PARSE_SERVER_URL || 'http://localhost:1337/parse';

async function initializeCareerSchema() {
  console.log('🔧 Initializing Career schema...\n');

  try {
    const careerSchema = new Parse.Schema('Career');

    // Add all fields
    careerSchema.addString('careerId');
    careerSchema.addString('name');
    careerSchema.addString('category');
    careerSchema.addString('description');
    careerSchema.addString('overview');
    careerSchema.addString('minimumEducation');
    careerSchema.addArray('recommendedSubjects');
    careerSchema.addArray('relatedDegrees');
    careerSchema.addArray('requiredSkills');
    careerSchema.addArray('softSkills');
    careerSchema.addArray('riasecCodes');
    careerSchema.addString('demandLevel');
    careerSchema.addString('growthOutlook');
    careerSchema.addNumber('employmentRate');
    careerSchema.addObject('salaryRange');
    careerSchema.addNumber('entrySalary');
    careerSchema.addNumber('experiencedSalary');
    careerSchema.addString('workEnvironment');
    careerSchema.addString('typicalHours');
    careerSchema.addString('physicalDemands');
    careerSchema.addArray('entryLevelPositions');
    careerSchema.addArray('midCareerPositions');
    careerSchema.addArray('seniorPositions');
    careerSchema.addArray('topEmployers');
    careerSchema.addString('industryGrowth');
    careerSchema.addArray('certifications');
    careerSchema.addString('kenyaRelevance');
    careerSchema.addArray('localSuccess');
    careerSchema.addArray('challenges');
    careerSchema.addBoolean('isActive');
    careerSchema.addDate('lastUpdated');
    careerSchema.addPointer('createdBy', '_User');
    careerSchema.addArray('sources');
    careerSchema.addArray('searchKeywords');
    careerSchema.addNumber('popularity');

    // Add indexes
    careerSchema.addIndex('careerId_index', { careerId: 1 });
    careerSchema.addIndex('name_index', { name: 1 });
    careerSchema.addIndex('category_index', { category: 1 });
    careerSchema.addIndex('demandLevel_index', { demandLevel: 1 });
    careerSchema.addIndex('active_index', { isActive: 1 });
    careerSchema.addIndex('popularity_index', { popularity: -1 });

    // Set permissions
    careerSchema.setCLP({
      get: { '*': true },
      find: { '*': true },
      create: { 'role:admin': true },
      update: { 'role:admin': true },
      delete: { 'role:admin': true }
    });

    await careerSchema.save();
    console.log('✅ Career schema created');

  } catch (error) {
    if (error.message.includes('already exists')) {
      console.log('ℹ️  Career schema already exists');
    } else {
      console.error('❌ Error:', error.message);
      throw error;
    }
  }
}

if (require.main === module) {
  initializeCareerSchema()
    .then(() => process.exit(0))
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = { initializeCareerSchema };
```

**Execute**:
```bash
cd /root/elimu_smart/backend
node migrations/initialize-career-schema.js
```

---

### Day 6: Career Data Migration

#### Task 2.3: Migrate Career Database
**Effort**: 4-5 hours

File: `backend/migrations/migrate-careers-data.js`

```javascript
const Parse = require('parse/node');
const fs = require('fs');
const path = require('path');

Parse.initialize(
  process.env.PARSE_APP_ID || 'elimu_smart_app_2024',
  process.env.PARSE_JAVASCRIPT_KEY || 'javascript_key_2024',
  process.env.PARSE_MASTER_KEY || 'master_key_2024'
);
Parse.serverURL = process.env.PARSE_SERVER_URL || 'http://localhost:1337/parse';

function extractCareerData() {
  const mainJsPath = path.join(__dirname, '../cloud/main.js');
  const content = fs.readFileSync(mainJsPath, 'utf8');

  const startMarker = 'const KENYA_CAREERS_DATABASE = [';
  const endMarker = '];';

  const startIndex = content.indexOf(startMarker);
  const endIndex = content.indexOf(endMarker, startIndex) + endMarker.length;

  const dataString = content.substring(startIndex, endIndex);
  const KENYA_CAREERS_DATABASE = eval(`(${dataString.replace('const KENYA_CAREERS_DATABASE = ', '')})`);

  return KENYA_CAREERS_DATABASE;
}

async function migrateCareers() {
  console.log('🚀 Starting career data migration...\n');

  const careers = extractCareerData();
  console.log(`Found ${careers.length} careers to migrate\n`);

  const Career = Parse.Object.extend('Career');

  let totalCareers = 0;
  let errors = [];

  for (const careerData of careers) {
    try {
      console.log(`Migrating: ${careerData.name}...`);

      // Check if career already exists
      const existingQuery = new Parse.Query(Career);
      existingQuery.equalTo('careerId', careerData.id);
      let career = await existingQuery.first({ useMasterKey: true });

      if (!career) {
        career = new Career();
      }

      // Set all fields
      career.set('careerId', careerData.id);
      career.set('name', careerData.name);
      career.set('category', careerData.category);
      career.set('description', careerData.description);
      career.set('overview', careerData.overview || careerData.description);
      career.set('minimumEducation', careerData.minimumEducation || 'Degree');
      career.set('recommendedSubjects', careerData.recommendedSubjects || []);
      career.set('relatedDegrees', careerData.relatedDegrees || []);
      career.set('requiredSkills', careerData.requiredSkills || []);
      career.set('softSkills', careerData.softSkills || []);
      career.set('riasecCodes', careerData.riasecCodes || []);
      career.set('demandLevel', careerData.demandLevel || 'Medium');
      career.set('growthOutlook', careerData.growthOutlook || 'Stable');
      career.set('employmentRate', careerData.employmentRate || 0.7);

      // Salary range
      career.set('salaryRange', careerData.salaryRange || {
        min: 50000,
        max: 200000,
        currency: 'KES'
      });
      career.set('entrySalary', careerData.entrySalary || careerData.salaryRange?.min || 50000);
      career.set('experiencedSalary', careerData.experiencedSalary || careerData.salaryRange?.max || 200000);

      // Work environment
      career.set('workEnvironment', careerData.workEnvironment || 'Office');
      career.set('typicalHours', careerData.typicalHours || 'Standard');
      career.set('physicalDemands', careerData.physicalDemands || 'Low');

      // Career paths
      career.set('entryLevelPositions', careerData.entryLevelPositions || []);
      career.set('midCareerPositions', careerData.midCareerPositions || []);
      career.set('seniorPositions', careerData.seniorPositions || []);

      // Industry data
      career.set('topEmployers', careerData.topEmployers || []);
      career.set('industryGrowth', careerData.industryGrowth || 'Stable');
      career.set('certifications', careerData.certifications || []);

      // Kenya-specific
      career.set('kenyaRelevance', careerData.kenyaRelevance || 'High');
      career.set('localSuccess', careerData.localSuccess || []);
      career.set('challenges', careerData.challenges || []);

      // Metadata
      career.set('isActive', true);
      career.set('lastUpdated', new Date());
      career.set('sources', careerData.sources || ['KENYA_CAREERS_DATABASE']);
      career.set('popularity', 0);

      // Generate search keywords
      const keywords = [
        careerData.name.toLowerCase(),
        careerData.id,
        careerData.category.toLowerCase(),
        ...(careerData.requiredSkills || []).map(s => s.toLowerCase()),
        ...(careerData.riasecCodes || []).map(c => c.toLowerCase())
      ];
      career.set('searchKeywords', keywords);

      await career.save(null, { useMasterKey: true });
      totalCareers++;
      console.log(`  ✅ Migrated ${careerData.name}\n`);

    } catch (error) {
      errors.push({
        career: careerData.name,
        error: error.message
      });
      console.error(`❌ Error migrating ${careerData.name}:`, error.message, '\n');
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 MIGRATION SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Careers migrated: ${totalCareers}/${careers.length}`);
  console.log(`❌ Errors: ${errors.length}`);

  if (errors.length > 0) {
    console.log('\n⚠️  Errors encountered:');
    errors.forEach(err => {
      console.log(`  - ${err.career}: ${err.error}`);
    });
  }

  console.log('\n✨ Migration complete!');

  return {
    success: errors.length === 0,
    careersMigrated: totalCareers,
    errors
  };
}

if (require.main === module) {
  migrateCareers()
    .then(result => {
      console.log('\nFinal result:', result);
      process.exit(result.success ? 0 : 1);
    })
    .catch(err => {
      console.error('Fatal error:', err);
      process.exit(1);
    });
}

module.exports = { migrateCareers };
```

**Execute**:
```bash
cd /root/elimu_smart/backend
node migrations/migrate-careers-data.js
```

---

### Day 7: Update Career Functions

#### Task 2.4: Update Career Cloud Functions
**Effort**: 3-4 hours

Update `exploreCareers`, `getCareerDetails`, `getCareerJobData` in `backend/cloud/main.js`

```javascript
// BEFORE (hardcoded)
Parse.Cloud.define('exploreCareers', async (request) => {
  const { query, category } = request.params;

  let careers = KENYA_CAREERS_DATABASE;
  if (category) {
    careers = careers.filter(c => c.category === category);
  }
  return careers;
});

// AFTER (database-driven)
Parse.Cloud.define('exploreCareers', async (request) => {
  const { query, category, demandLevel, limit = 50 } = request.params;

  try {
    const Career = Parse.Object.extend('Career');
    const careerQuery = new Parse.Query(Career);

    careerQuery.equalTo('isActive', true);

    // Search by name or keywords
    if (query) {
      careerQuery.contains('searchKeywords', query.toLowerCase());
    }

    // Filter by category
    if (category) {
      careerQuery.equalTo('category', category);
    }

    // Filter by demand level
    if (demandLevel) {
      careerQuery.equalTo('demandLevel', demandLevel);
    }

    // Sort by popularity and name
    careerQuery.descending('popularity');
    careerQuery.ascending('name');
    careerQuery.limit(limit);

    const results = await careerQuery.find({ useMasterKey: true });

    return results.map(career => ({
      id: career.get('careerId'),
      name: career.get('name'),
      category: career.get('category'),
      description: career.get('description'),
      demandLevel: career.get('demandLevel'),
      salaryRange: career.get('salaryRange'),
      requiredSkills: career.get('requiredSkills'),
      riasecCodes: career.get('riasecCodes')
    }));

  } catch (error) {
    console.error('Error exploring careers:', error);
    throw new Parse.Error(Parse.Error.SCRIPT_FAILED, `Failed to explore careers: ${error.message}`);
  }
});

// Get career details by ID
Parse.Cloud.define('getCareerDetails', async (request) => {
  const { careerId } = request.params;

  if (!careerId) {
    throw new Parse.Error(Parse.Error.INVALID_QUERY, 'Career ID required');
  }

  try {
    const Career = Parse.Object.extend('Career');
    const query = new Parse.Query(Career);
    query.equalTo('careerId', careerId);

    const career = await query.first({ useMasterKey: true });

    if (!career) {
      throw new Parse.Error(Parse.Error.OBJECT_NOT_FOUND, 'Career not found');
    }

    // Increment popularity
    career.increment('popularity');
    await career.save(null, { useMasterKey: true });

    return {
      id: career.get('careerId'),
      name: career.get('name'),
      category: career.get('category'),
      description: career.get('description'),
      overview: career.get('overview'),
      minimumEducation: career.get('minimumEducation'),
      recommendedSubjects: career.get('recommendedSubjects'),
      relatedDegrees: career.get('relatedDegrees'),
      requiredSkills: career.get('requiredSkills'),
      softSkills: career.get('softSkills'),
      riasecCodes: career.get('riasecCodes'),
      demandLevel: career.get('demandLevel'),
      growthOutlook: career.get('growthOutlook'),
      employmentRate: career.get('employmentRate'),
      salaryRange: career.get('salaryRange'),
      entrySalary: career.get('entrySalary'),
      experiencedSalary: career.get('experiencedSalary'),
      workEnvironment: career.get('workEnvironment'),
      typicalHours: career.get('typicalHours'),
      physicalDemands: career.get('physicalDemands'),
      entryLevelPositions: career.get('entryLevelPositions'),
      midCareerPositions: career.get('midCareerPositions'),
      seniorPositions: career.get('seniorPositions'),
      topEmployers: career.get('topEmployers'),
      industryGrowth: career.get('industryGrowth'),
      certifications: career.get('certifications'),
      kenyaRelevance: career.get('kenyaRelevance'),
      localSuccess: career.get('localSuccess'),
      challenges: career.get('challenges')
    };
  } catch (error) {
    console.error('Error getting career details:', error);
    throw error;
  }
});

// Get career categories
Parse.Cloud.define('getCareerCategories', async (request) => {
  try {
    const Career = Parse.Object.extend('Career');
    const query = new Parse.Query(Career);
    query.equalTo('isActive', true);
    query.select('category');

    const results = await query.find({ useMasterKey: true });
    const categories = [...new Set(results.map(c => c.get('category')))];

    return categories.sort();
  } catch (error) {
    console.error('Error getting career categories:', error);
    throw error;
  }
});
```

---

### Day 8: Testing Career Migration

#### Task 2.5: Create Career Test Suite
**Effort**: 2-3 hours

File: `backend/tests/career-migration.test.js`

```javascript
const Parse = require('parse/node');
const assert = require('assert');

Parse.initialize('elimu_smart_app_2024', 'javascript_key_2024', 'master_key_2024');
Parse.serverURL = 'http://localhost:1337/parse';

async function testCareerMigration() {
  console.log('🧪 Running Career Migration Tests\n');

  const tests = { passed: 0, failed: 0, errors: [] };

  // Test 1: Verify careers migrated
  try {
    const Career = Parse.Object.extend('Career');
    const query = new Parse.Query(Career);
    const count = await query.count({ useMasterKey: true });

    assert(count > 0, 'No careers found in database');
    console.log(`✅ Test 1: Found ${count} careers`);
    tests.passed++;
  } catch (error) {
    console.error('❌ Test 1 failed:', error.message);
    tests.failed++;
    tests.errors.push({ test: 1, error: error.message });
  }

  // Test 2: Verify exploreCareers function
  try {
    const result = await Parse.Cloud.run('exploreCareers', { limit: 10 });

    assert(Array.isArray(result), 'Result is not an array');
    assert(result.length > 0, 'No careers returned');
    assert(result[0].name, 'Career missing name');
    assert(result[0].category, 'Career missing category');

    console.log(`✅ Test 2: exploreCareers returned ${result.length} careers`);
    tests.passed++;
  } catch (error) {
    console.error('❌ Test 2 failed:', error.message);
    tests.failed++;
    tests.errors.push({ test: 2, error: error.message });
  }

  // Test 3: Verify getCareerDetails function
  try {
    const careers = await Parse.Cloud.run('exploreCareers', { limit: 1 });
    const careerId = careers[0].id;
    const details = await Parse.Cloud.run('getCareerDetails', { careerId });

    assert(details.name, 'Career details missing name');
    assert(details.description, 'Career details missing description');
    assert(details.salaryRange, 'Career details missing salary range');

    console.log(`✅ Test 3: getCareerDetails returned full data for ${details.name}`);
    tests.passed++;
  } catch (error) {
    console.error('❌ Test 3 failed:', error.message);
    tests.failed++;
    tests.errors.push({ test: 3, error: error.message });
  }

  // Test 4: Verify category filtering
  try {
    const result = await Parse.Cloud.run('exploreCareers', {
      category: 'Technology',
      limit: 10
    });

    assert(Array.isArray(result), 'Result is not an array');
    assert(result.every(c => c.category === 'Technology'), 'Non-Technology careers returned');

    console.log(`✅ Test 4: Category filtering works (${result.length} Technology careers)`);
    tests.passed++;
  } catch (error) {
    console.error('❌ Test 4 failed:', error.message);
    tests.failed++;
    tests.errors.push({ test: 4, error: error.message });
  }

  // Test 5: Verify search functionality
  try {
    const result = await Parse.Cloud.run('exploreCareers', {
      query: 'engineer',
      limit: 10
    });

    assert(Array.isArray(result), 'Result is not an array');
    assert(result.length > 0, 'No careers found for "engineer"');

    console.log(`✅ Test 5: Search works (${result.length} results for "engineer")`);
    tests.passed++;
  } catch (error) {
    console.error('❌ Test 5 failed:', error.message);
    tests.failed++;
    tests.errors.push({ test: 5, error: error.message });
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('TEST SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Passed: ${tests.passed}`);
  console.log(`❌ Failed: ${tests.failed}`);
  console.log(`Total: ${tests.passed + tests.failed}`);

  if (tests.errors.length > 0) {
    console.log('\nErrors:');
    tests.errors.forEach(err => {
      console.log(`  Test ${err.test}: ${err.error}`);
    });
  }

  return tests;
}

testCareerMigration()
  .then(result => {
    process.exit(result.failed === 0 ? 0 : 1);
  })
  .catch(err => {
    console.error('Fatal test error:', err);
    process.exit(1);
  });
```

**Execute**:
```bash
cd /root/elimu_smart/backend
node tests/career-migration.test.js
```

---

## Phase 2 Deliverables

✅ **Database Schema**
- Career Parse Class (32 fields, 6 indexes)

✅ **Migration Scripts**
- Schema initialization script
- Data migration script (50-100 careers)
- Validation tests

✅ **Updated Backend Functions**
- exploreCareers (database-driven with search)
- getCareerDetails (with popularity tracking)
- getCareerCategories (new)

✅ **Testing**
- 5 automated tests
- Category filtering
- Search functionality

---

## Success Metrics for Phase 2

| Metric | Target | Actual |
|--------|--------|--------|
| Careers migrated | 50-100 | ___ |
| Migration time | < 2 minutes | ___ |
| Query response time | < 150ms | ___ |
| Test pass rate | 100% | ___ |
| Zero data loss | ✅ | ___ |

---

## Phase 3: Subject-Career Mappings
**Duration**: 2-3 days
**Priority**: HIGH
**Estimated Lines of Code**: 200-250 lines (migration + updates)

### Day 9: Subject Mapping Schema

#### Task 3.1: Define SubjectCareerMapping Parse Class
**Effort**: 1-2 hours

Create schema definition file: `backend/schemas/subject-mapping-schemas.js`

```javascript
// SubjectCareerMapping Parse Class Schema
const subjectCareerMappingSchema = {
  className: 'SubjectCareerMapping',
  fields: {
    // Subject combination
    subjectCombination: { type: 'Array', required: true },  // ['Mathematics', 'Physics', 'Chemistry']
    mainSubject: { type: 'String', required: true },  // Primary subject

    // Career matches
    careers: { type: 'Array', required: true },  // [Pointers to Career class]
    careerNames: { type: 'Array' },  // Career names for quick display
    careerCategories: { type: 'Array' },  // Categories for filtering

    // Subject requirements
    minimumGrade: { type: 'String' },  // Overall minimum (e.g., 'B+')
    subjectGrades: { type: 'Object' },  // { 'Mathematics': 'A-', 'Physics': 'B+' }

    // University programs
    relatedPrograms: { type: 'Array' },  // University programs matching this combination
    topUniversities: { type: 'Array' },  // Universities offering these programs

    // Additional data
    industryDemand: { type: 'String' },  // 'High', 'Medium', 'Low'
    futureOutlook: { type: 'String' },
    keySkills: { type: 'Array' },

    // Metadata
    isActive: { type: 'Boolean', default: true },
    popularity: { type: 'Number', default: 0 },
    lastUpdated: { type: 'Date' }
  },
  indexes: {
    mainSubject: { mainSubject: 1 },
    subjectCombination: { subjectCombination: 1 },
    isActive: { isActive: 1 },
    popularity: { popularity: -1 }
  }
};

module.exports = { subjectCareerMappingSchema };
```

#### Task 3.2: Create Mapping Schema Initialization
**Effort**: 1 hour

File: `backend/migrations/initialize-subject-mapping-schema.js`

```javascript
const Parse = require('parse/node');

Parse.initialize(
  process.env.PARSE_APP_ID || 'elimu_smart_app_2024',
  process.env.PARSE_JAVASCRIPT_KEY || 'javascript_key_2024',
  process.env.PARSE_MASTER_KEY || 'master_key_2024'
);
Parse.serverURL = process.env.PARSE_SERVER_URL || 'http://localhost:1337/parse';

async function initializeSubjectMappingSchema() {
  console.log('🔧 Initializing SubjectCareerMapping schema...\n');

  try {
    const mappingSchema = new Parse.Schema('SubjectCareerMapping');

    // Add all fields
    mappingSchema.addArray('subjectCombination');
    mappingSchema.addString('mainSubject');
    mappingSchema.addArray('careers');
    mappingSchema.addArray('careerNames');
    mappingSchema.addArray('careerCategories');
    mappingSchema.addString('minimumGrade');
    mappingSchema.addObject('subjectGrades');
    mappingSchema.addArray('relatedPrograms');
    mappingSchema.addArray('topUniversities');
    mappingSchema.addString('industryDemand');
    mappingSchema.addString('futureOutlook');
    mappingSchema.addArray('keySkills');
    mappingSchema.addBoolean('isActive');
    mappingSchema.addNumber('popularity');
    mappingSchema.addDate('lastUpdated');

    // Add indexes
    mappingSchema.addIndex('mainSubject_index', { mainSubject: 1 });
    mappingSchema.addIndex('active_index', { isActive: 1 });
    mappingSchema.addIndex('popularity_index', { popularity: -1 });

    // Set permissions
    mappingSchema.setCLP({
      get: { '*': true },
      find: { '*': true },
      create: { 'role:admin': true },
      update: { 'role:admin': true },
      delete: { 'role:admin': true }
    });

    await mappingSchema.save();
    console.log('✅ SubjectCareerMapping schema created');

  } catch (error) {
    if (error.message.includes('already exists')) {
      console.log('ℹ️  SubjectCareerMapping schema already exists');
    } else {
      console.error('❌ Error:', error.message);
      throw error;
    }
  }
}

if (require.main === module) {
  initializeSubjectMappingSchema()
    .then(() => process.exit(0))
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = { initializeSubjectMappingSchema };
```

**Execute**:
```bash
cd /root/elimu_smart/backend
node migrations/initialize-subject-mapping-schema.js
```

---

### Day 10: Migrate Subject Mappings

#### Task 3.3: Migrate Subject-Career Data
**Effort**: 3-4 hours

File: `backend/migrations/migrate-subject-mappings-data.js`

```javascript
const Parse = require('parse/node');
const fs = require('fs');
const path = require('path');

Parse.initialize(
  process.env.PARSE_APP_ID || 'elimu_smart_app_2024',
  process.env.PARSE_JAVASCRIPT_KEY || 'javascript_key_2024',
  process.env.PARSE_MASTER_KEY || 'master_key_2024'
);
Parse.serverURL = process.env.PARSE_SERVER_URL || 'http://localhost:1337/parse';

function extractSubjectMappingData() {
  const mainJsPath = path.join(__dirname, '../cloud/main.js');
  const content = fs.readFileSync(mainJsPath, 'utf8');

  const startMarker = 'const SUBJECT_CAREER_MAPPINGS = {';
  const endMarker = '};';

  const startIndex = content.indexOf(startMarker);
  const endIndex = content.indexOf(endMarker, startIndex) + endMarker.length;

  const dataString = content.substring(startIndex, endIndex);
  const SUBJECT_CAREER_MAPPINGS = eval(`(${dataString.replace('const SUBJECT_CAREER_MAPPINGS = ', '')})`);

  return SUBJECT_CAREER_MAPPINGS;
}

async function migrateSubjectMappings() {
  console.log('🚀 Starting subject mapping migration...\n');

  const mappingsData = extractSubjectMappingData();
  const subjects = Object.keys(mappingsData);
  console.log(`Found ${subjects.length} subjects to migrate\n`);

  const SubjectCareerMapping = Parse.Object.extend('SubjectCareerMapping');
  const Career = Parse.Object.extend('Career');

  let totalMappings = 0;
  let errors = [];

  for (const subject of subjects) {
    try {
      console.log(`Migrating: ${subject}...`);

      const mappingData = mappingsData[subject];

      // Check if mapping already exists
      const existingQuery = new Parse.Query(SubjectCareerMapping);
      existingQuery.equalTo('mainSubject', subject);
      let mapping = await existingQuery.first({ useMasterKey: true });

      if (!mapping) {
        mapping = new SubjectCareerMapping();
      }

      // Resolve career pointers
      const careerPointers = [];
      const careerNames = [];
      const careerCategories = new Set();

      for (const careerName of mappingData.careers || []) {
        const careerQuery = new Parse.Query(Career);
        careerQuery.equalTo('name', careerName);
        const careerObj = await careerQuery.first({ useMasterKey: true });

        if (careerObj) {
          careerPointers.push(careerObj);
          careerNames.push(careerObj.get('name'));
          careerCategories.add(careerObj.get('category'));
        }
      }

      // Set all fields
      mapping.set('mainSubject', subject);
      mapping.set('subjectCombination', mappingData.combination || [subject]);
      mapping.set('careers', careerPointers);
      mapping.set('careerNames', careerNames);
      mapping.set('careerCategories', Array.from(careerCategories));
      mapping.set('minimumGrade', mappingData.minimumGrade || 'C+');
      mapping.set('subjectGrades', mappingData.subjectGrades || {});
      mapping.set('relatedPrograms', mappingData.relatedPrograms || []);
      mapping.set('topUniversities', mappingData.topUniversities || []);
      mapping.set('industryDemand', mappingData.industryDemand || 'Medium');
      mapping.set('futureOutlook', mappingData.futureOutlook || 'Stable');
      mapping.set('keySkills', mappingData.keySkills || []);
      mapping.set('isActive', true);
      mapping.set('popularity', 0);
      mapping.set('lastUpdated', new Date());

      await mapping.save(null, { useMasterKey: true });
      totalMappings++;
      console.log(`  ✅ Migrated ${subject} (${careerNames.length} careers)\n`);

    } catch (error) {
      errors.push({
        subject,
        error: error.message
      });
      console.error(`❌ Error migrating ${subject}:`, error.message, '\n');
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 MIGRATION SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Subject mappings migrated: ${totalMappings}/${subjects.length}`);
  console.log(`❌ Errors: ${errors.length}`);

  if (errors.length > 0) {
    console.log('\n⚠️  Errors encountered:');
    errors.forEach(err => {
      console.log(`  - ${err.subject}: ${err.error}`);
    });
  }

  console.log('\n✨ Migration complete!');

  return {
    success: errors.length === 0,
    mappingsMigrated: totalMappings,
    errors
  };
}

if (require.main === module) {
  migrateSubjectMappings()
    .then(result => {
      console.log('\nFinal result:', result);
      process.exit(result.success ? 0 : 1);
    })
    .catch(err => {
      console.error('Fatal error:', err);
      process.exit(1);
    });
}

module.exports = { migrateSubjectMappings };
```

**Execute**:
```bash
cd /root/elimu_smart/backend
node migrations/migrate-subject-mappings-data.js
```

---

### Day 10: Update Backend Functions

#### Task 3.4: Update analyzeSubjectCareerFit Function
**Effort**: 2-3 hours

Update in `backend/cloud/main.js`:

```javascript
// BEFORE (hardcoded)
Parse.Cloud.define('analyzeSubjectCareerFit', async (request) => {
  const { subjects, grades } = request.params;

  const matches = [];
  for (const subject of subjects) {
    if (SUBJECT_CAREER_MAPPINGS[subject]) {
      matches.push(...SUBJECT_CAREER_MAPPINGS[subject].careers);
    }
  }

  return matches;
});

// AFTER (database-driven)
Parse.Cloud.define('analyzeSubjectCareerFit', async (request) => {
  const { subjects, grades } = request.params;

  if (!subjects || !Array.isArray(subjects) || subjects.length === 0) {
    throw new Parse.Error(Parse.Error.INVALID_QUERY, 'Subjects array required');
  }

  try {
    const SubjectCareerMapping = Parse.Object.extend('SubjectCareerMapping');
    const query = new Parse.Query(SubjectCareerMapping);

    query.containedIn('mainSubject', subjects);
    query.equalTo('isActive', true);
    query.include('careers');
    query.limit(100);

    const mappings = await query.find({ useMasterKey: true });

    // Aggregate career matches
    const careerScores = new Map();

    mappings.forEach(mapping => {
      mapping.increment('popularity');
      mapping.save(null, { useMasterKey: true });

      const careers = mapping.get('careerNames') || [];
      const subject = mapping.get('mainSubject');
      const subjectGrade = grades?.[subject] || 'C+';

      careers.forEach(careerName => {
        if (!careerScores.has(careerName)) {
          careerScores.set(careerName, {
            name: careerName,
            matchScore: 0,
            matchingSubjects: []
          });
        }

        const score = careerScores.get(careerName);
        score.matchScore += 1;
        score.matchingSubjects.push({
          subject,
          grade: subjectGrade
        });
      });
    });

    // Convert to array and sort by match score
    const results = Array.from(careerScores.values())
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 20);

    return {
      careers: results,
      totalMatches: results.length,
      analyzedSubjects: subjects
    };

  } catch (error) {
    console.error('Error analyzing subject-career fit:', error);
    throw new Parse.Error(Parse.Error.SCRIPT_FAILED, `Failed to analyze: ${error.message}`);
  }
});

// New function: Get subject mapping details
Parse.Cloud.define('getSubjectMappingDetails', async (request) => {
  const { subject } = request.params;

  if (!subject) {
    throw new Parse.Error(Parse.Error.INVALID_QUERY, 'Subject required');
  }

  try {
    const SubjectCareerMapping = Parse.Object.extend('SubjectCareerMapping');
    const query = new Parse.Query(SubjectCareerMapping);
    query.equalTo('mainSubject', subject);
    query.include('careers');

    const mapping = await query.first({ useMasterKey: true });

    if (!mapping) {
      throw new Parse.Error(Parse.Error.OBJECT_NOT_FOUND, 'Mapping not found');
    }

    return {
      subject: mapping.get('mainSubject'),
      careers: mapping.get('careerNames'),
      relatedPrograms: mapping.get('relatedPrograms'),
      minimumGrade: mapping.get('minimumGrade'),
      industryDemand: mapping.get('industryDemand'),
      keySkills: mapping.get('keySkills')
    };
  } catch (error) {
    console.error('Error getting subject mapping:', error);
    throw error;
  }
});
```

---

## Phase 3 Deliverables

✅ **Database Schema**
- SubjectCareerMapping Parse Class (14 fields, 4 indexes)

✅ **Migration Scripts**
- Schema initialization script
- Data migration script (30-40 subjects)

✅ **Updated Backend Functions**
- analyzeSubjectCareerFit (database-driven with scoring)
- getSubjectMappingDetails (new)

✅ **Frontend Integration**
- Update SubjectCareerMapper.tsx to use new API
- Remove hardcoded SUBJECT_CAREERS constant

---

## Success Metrics for Phase 3

| Metric | Target | Actual |
|--------|--------|--------|
| Subject mappings migrated | 30-40 | ___ |
| Migration time | < 1 minute | ___ |
| Query response time | < 100ms | ___ |
| Frontend bundle reduction | ~15KB | ___ |
| Zero data loss | ✅ | ___ |

---

## Phase 4: RIASEC & Skills Framework
**Duration**: 3-4 days
**Priority**: MEDIUM
**Estimated Lines of Code**: 350-450 lines (migration + updates)

### Day 11-12: RIASEC Type Schema & Migration

#### Task 4.1: Define RIASEC Type Schema
**Effort**: 2 hours

File: `backend/schemas/riasec-schemas.js`

```javascript
// RIASECType Parse Class Schema
const riasecTypeSchema = {
  className: 'RIASECType',
  fields: {
    // Core identification
    code: { type: 'String', required: true },  // 'R', 'I', 'A', 'S', 'E', 'C'
    name: { type: 'String', required: true },  // 'Realistic', 'Investigative', etc.

    // Descriptions
    description: { type: 'String', required: true },
    detailedDescription: { type: 'String' },
    kenyaContext: { type: 'String' },  // Kenya-specific context

    // Characteristics
    traits: { type: 'Array' },  // Personality traits
    strengths: { type: 'Array' },  // Key strengths
    workPreferences: { type: 'Array' },  // Preferred work styles
    workEnvironment: { type: 'Array' },  // Preferred environments

    // Career data
    topCareers: { type: 'Array' },  // [Pointers to Career class]
    careerNames: { type: 'Array' },  // Career names for quick display
    careerExamples: { type: 'Array' },  // Example careers

    // Skills
    typicalSkills: { type: 'Array' },
    developmentAreas: { type: 'Array' },

    // Education
    recommendedSubjects: { type: 'Array' },  // KCSE subjects
    educationPathways: { type: 'Array' },

    // Success stories
    kenyaSuccessStories: { type: 'Array' },  // Local role models
    globalIcons: { type: 'Array' },

    // Metadata
    color: { type: 'String' },  // Display color (hex)
    icon: { type: 'String' },  // Icon identifier
    popularity: { type: 'Number', default: 0 },
    isActive: { type: 'Boolean', default: true }
  },
  indexes: {
    code: { code: 1 },
    name: { name: 1 },
    isActive: { isActive: 1 },
    popularity: { popularity: -1 }
  }
};

// SkillCategory Parse Class Schema
const skillCategorySchema = {
  className: 'SkillCategory',
  fields: {
    // Core identification
    categoryId: { type: 'String', required: true },
    name: { type: 'String', required: true },

    // Description
    description: { type: 'String' },
    importance: { type: 'String' },  // 'Critical', 'Important', 'Helpful'

    // Skills in this category
    skills: { type: 'Array', required: true },  // [Pointer to Skill class]
    skillNames: { type: 'Array' },

    // Career relevance
    relevantCareers: { type: 'Array' },  // Pointers to Career class
    careerCategories: { type: 'Array' },

    // Development
    howToDevelop: { type: 'Array' },
    resources: { type: 'Array' },

    // Metadata
    displayOrder: { type: 'Number', default: 0 },
    isActive: { type: 'Boolean', default: true }
  },
  indexes: {
    categoryId: { categoryId: 1 },
    name: { name: 1 },
    displayOrder: { displayOrder: 1 },
    isActive: { isActive: 1 }
  }
};

module.exports = { riasecTypeSchema, skillCategorySchema };
```

#### Task 4.2: Create RIASEC Migration Script
**Effort**: 4-5 hours

File: `backend/migrations/migrate-riasec-data.js`

```javascript
const Parse = require('parse/node');
const fs = require('fs');
const path = require('path');

Parse.initialize(
  process.env.PARSE_APP_ID || 'elimu_smart_app_2024',
  process.env.PARSE_JAVASCRIPT_KEY || 'javascript_key_2024',
  process.env.PARSE_MASTER_KEY || 'master_key_2024'
);
Parse.serverURL = process.env.PARSE_SERVER_URL || 'http://localhost:1337/parse';

function extractRiasecData() {
  const mainJsPath = path.join(__dirname, '../cloud/main.js');
  const content = fs.readFileSync(mainJsPath, 'utf8');

  const startMarker = 'const RIASEC_TYPES = {';
  const endMarker = '};';

  const startIndex = content.indexOf(startMarker);
  const endIndex = content.indexOf(endMarker, startIndex) + endMarker.length;

  const dataString = content.substring(startIndex, endIndex);
  const RIASEC_TYPES = eval(`(${dataString.replace('const RIASEC_TYPES = ', '')})`);

  return RIASEC_TYPES;
}

async function migrateRiasecTypes() {
  console.log('🚀 Starting RIASEC type migration...\n');

  const riasecData = extractRiasecData();
  const codes = Object.keys(riasecData);
  console.log(`Found ${codes.length} RIASEC types to migrate\n`);

  const RIASECType = Parse.Object.extend('RIASECType');
  const Career = Parse.Object.extend('Career');

  let totalTypes = 0;
  let errors = [];

  for (const code of codes) {
    try {
      console.log(`Migrating: ${code} (${riasecData[code].name})...`);

      const typeData = riasecData[code];

      // Check if type already exists
      const existingQuery = new Parse.Query(RIASECType);
      existingQuery.equalTo('code', code);
      let riasecType = await existingQuery.first({ useMasterKey: true });

      if (!riasecType) {
        riasecType = new RIASECType();
      }

      // Resolve career pointers
      const careerPointers = [];
      const careerNames = [];

      for (const careerName of typeData.topCareers || []) {
        const careerQuery = new Parse.Query(Career);
        careerQuery.equalTo('name', careerName);
        const careerObj = await careerQuery.first({ useMasterKey: true });

        if (careerObj) {
          careerPointers.push(careerObj);
          careerNames.push(careerObj.get('name'));
        }
      }

      // Set all fields
      riasecType.set('code', code);
      riasecType.set('name', typeData.name);
      riasecType.set('description', typeData.description);
      riasecType.set('detailedDescription', typeData.detailedDescription || typeData.description);
      riasecType.set('kenyaContext', typeData.kenyaContext || '');
      riasecType.set('traits', typeData.traits || []);
      riasecType.set('strengths', typeData.strengths || []);
      riasecType.set('workPreferences', typeData.workPreferences || []);
      riasecType.set('workEnvironment', typeData.workEnvironment || []);
      riasecType.set('topCareers', careerPointers);
      riasecType.set('careerNames', careerNames);
      riasecType.set('careerExamples', typeData.careerExamples || careerNames);
      riasecType.set('typicalSkills', typeData.typicalSkills || []);
      riasecType.set('developmentAreas', typeData.developmentAreas || []);
      riasecType.set('recommendedSubjects', typeData.recommendedSubjects || []);
      riasecType.set('educationPathways', typeData.educationPathways || []);
      riasecType.set('kenyaSuccessStories', typeData.kenyaSuccessStories || []);
      riasecType.set('globalIcons', typeData.globalIcons || []);
      riasecType.set('color', typeData.color || '#000000');
      riasecType.set('icon', typeData.icon || 'default');
      riasecType.set('popularity', 0);
      riasecType.set('isActive', true);

      await riasecType.save(null, { useMasterKey: true });
      totalTypes++;
      console.log(`  ✅ Migrated ${code} (${careerNames.length} careers)\n`);

    } catch (error) {
      errors.push({
        code,
        error: error.message
      });
      console.error(`❌ Error migrating ${code}:`, error.message, '\n');
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 MIGRATION SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ RIASEC types migrated: ${totalTypes}/${codes.length}`);
  console.log(`❌ Errors: ${errors.length}`);

  if (errors.length > 0) {
    console.log('\n⚠️  Errors encountered:');
    errors.forEach(err => {
      console.log(`  - ${err.code}: ${err.error}`);
    });
  }

  console.log('\n✨ Migration complete!');

  return {
    success: errors.length === 0,
    typesMigrated: totalTypes,
    errors
  };
}

if (require.main === module) {
  migrateRiasecTypes()
    .then(result => {
      console.log('\nFinal result:', result);
      process.exit(result.success ? 0 : 1);
    })
    .catch(err => {
      console.error('Fatal error:', err);
      process.exit(1);
    });
}

module.exports = { migrateRiasecTypes };
```

---

### Day 13: Update RIASEC Functions

#### Task 4.3: Update getRiasecCareerInfo Function
**Effort**: 2-3 hours

Update in `backend/cloud/main.js`:

```javascript
// AFTER (database-driven)
Parse.Cloud.define('getRiasecCareerInfo', async (request) => {
  const { hollandCode, careerName } = request.params;

  if (!hollandCode && !careerName) {
    throw new Parse.Error(Parse.Error.INVALID_QUERY, 'Either hollandCode or careerName required');
  }

  try {
    const RIASECType = Parse.Object.extend('RIASECType');
    const query = new Parse.Query(RIASECType);

    if (hollandCode) {
      query.equalTo('code', hollandCode);
    }

    query.equalTo('isActive', true);
    query.include('topCareers');

    const riasecType = await query.first({ useMasterKey: true });

    if (!riasecType) {
      throw new Parse.Error(Parse.Error.OBJECT_NOT_FOUND, 'RIASEC type not found');
    }

    // Increment popularity
    riasecType.increment('popularity');
    await riasecType.save(null, { useMasterKey: true });

    return {
      code: riasecType.get('code'),
      name: riasecType.get('name'),
      description: riasecType.get('description'),
      detailedDescription: riasecType.get('detailedDescription'),
      kenyaContext: riasecType.get('kenyaContext'),
      traits: riasecType.get('traits'),
      strengths: riasecType.get('strengths'),
      workPreferences: riasecType.get('workPreferences'),
      workEnvironment: riasecType.get('workEnvironment'),
      topCareers: riasecType.get('careerNames'),
      careerExamples: riasecType.get('careerExamples'),
      typicalSkills: riasecType.get('typicalSkills'),
      developmentAreas: riasecType.get('developmentAreas'),
      recommendedSubjects: riasecType.get('recommendedSubjects'),
      educationPathways: riasecType.get('educationPathways'),
      kenyaSuccessStories: riasecType.get('kenyaSuccessStories'),
      globalIcons: riasecType.get('globalIcons')
    };

  } catch (error) {
    console.error('Error getting RIASEC career info:', error);
    throw error;
  }
});
```

---

## Phase 4 Deliverables

✅ **Database Schemas**
- RIASECType Parse Class (21 fields, 4 indexes)
- SkillCategory Parse Class (12 fields, 4 indexes)

✅ **Migration Scripts**
- RIASEC types migration (6 types)
- Skills framework migration (6+ categories)

✅ **Updated Backend Functions**
- getRiasecCareerInfo (database-driven)
- startSkillsAssessment (updated to use new schema)

---

## Success Metrics for Phase 4

| Metric | Target | Actual |
|--------|--------|--------|
| RIASEC types migrated | 6 | ___ |
| Skill categories migrated | 6 | ___ |
| Migration time | < 2 minutes | ___ |
| Query response time | < 120ms | ___ |
| Zero data loss | ✅ | ___ |

---

## Phase 5: Admin Content Management Panel
**Duration**: 4-5 days
**Priority**: LOW (Can be done after migration)
**Estimated Lines of Code**: 800-1000 lines (full admin UI)

### Day 14-15: Admin CRUD Interfaces

#### Task 5.1: University/Course Management
**Effort**: 1 day

Create admin components in `frontend/src/components/admin/content/`:

1. **UniversityManager.tsx**
   - List all universities (with search/filter)
   - Create/Edit/Delete university
   - View associated courses
   - Bulk import from CSV

2. **CourseManager.tsx**
   - List all courses (by university)
   - Create/Edit/Delete course
   - Update cluster points annually
   - Bulk import from CSV

#### Task 5.2: Career Management
**Effort**: 1 day

3. **CareerManager.tsx**
   - List all careers (by category)
   - Create/Edit/Delete career
   - Link careers to RIASEC types
   - Update salary data
   - Track popularity metrics

#### Task 5.3: Subject Mapping Management
**Effort**: 1 day

4. **SubjectMappingManager.tsx**
   - List all subject mappings
   - Create/Edit/Delete mapping
   - Link subjects to careers
   - Update university programs

#### Task 5.4: RIASEC & Skills Management
**Effort**: 1 day

5. **RIASECManager.tsx**
   - Edit RIASEC type descriptions
   - Update Kenya context
   - Link to careers
   - Add success stories

6. **SkillsManager.tsx**
   - Manage skill categories
   - Update development resources
   - Link to careers

---

### Day 16-17: Bulk Operations & Data Quality

#### Task 5.5: Bulk Import/Export
**Effort**: 1 day

Features:
- CSV import for all data types
- Excel export with formatting
- Data validation before import
- Duplicate detection
- Preview before commit

#### Task 5.6: Data Quality Dashboard
**Effort**: 1 day

Metrics to track:
- Missing/incomplete records
- Outdated data (e.g., old cluster points)
- Orphaned relationships
- Popular vs. unpopular content
- Search term analytics

---

### Day 18: Version History & Audit Logs

#### Task 5.7: Content Versioning
**Effort**: 1 day

Features:
- Track all changes to content
- Who changed what and when
- Ability to rollback changes
- Diff view for changes
- Approval workflow (optional)

---

## Phase 5 Deliverables

✅ **Admin UI Components**
- 6 content management interfaces
- Bulk import/export tools
- Data quality dashboard
- Version history viewer

✅ **Backend Support**
- Cloud Functions for admin operations
- CSV parsing utilities
- Data validation functions
- Audit logging

---

## Success Metrics for Phase 5

| Metric | Target | Actual |
|--------|--------|--------|
| Admin interfaces complete | 6 | ___ |
| Bulk import tested | ✅ | ___ |
| Data validation working | ✅ | ___ |
| Audit logs functional | ✅ | ___ |

---

## Testing Strategy

### Pre-Migration Testing

**1. Database Backup** (CRITICAL)
```bash
# Backup production database
pg_dump -U postgres elimu_smart_production > backup_$(date +%Y%m%d_%H%M%S).sql

# Backup staging database
pg_dump -U postgres elimu_smart_staging > staging_backup_$(date +%Y%m%d_%H%M%S).sql
```

**2. Test Environment Setup**
- Create isolated test database
- Load production data snapshot
- Run all migrations against test database
- Verify data integrity

**3. Data Validation**
- Count records before and after migration
- Verify foreign key relationships
- Check for data type mismatches
- Validate required fields populated

---

### During Migration Testing

**Automated Test Suite** (Run after each phase)

```javascript
// backend/tests/migration-validation.test.js
const testSuite = {
  // Data integrity
  testRecordCounts: async () => {
    // Verify all records migrated
  },

  // Relationship integrity
  testForeignKeys: async () => {
    // Verify all pointers valid
  },

  // Function compatibility
  testCloudFunctions: async () => {
    // Test all updated functions
  },

  // Performance benchmarks
  testQueryPerformance: async () => {
    // Measure query response times
  }
};
```

**Manual Test Checklist**
- [ ] Search functionality works
- [ ] Filters return correct results
- [ ] Pagination works correctly
- [ ] Related data loads properly
- [ ] Admin CRUD operations functional

---

### Post-Migration Testing

**1. Frontend Integration Tests**
```bash
# Test all affected frontend components
npm run test -- --grep "migration"
```

**2. End-to-End User Flows**
- Complete RIASEC assessment → View results
- Search careers → View details → Explore universities
- Filter universities → View courses → Check cluster points
- Subject mapper → Career suggestions → University programs

**3. Performance Monitoring**
- Query response times < target benchmarks
- Database CPU usage normal
- Memory usage acceptable
- No connection pool exhaustion

**4. Data Quality Checks**
- No orphaned records
- No duplicate entries
- All required fields populated
- Relationships correctly established

---

## Rollback Procedures

### Phase-Level Rollback

Each phase can be rolled back independently if issues arise:

**Immediate Rollback** (within 24 hours)
```bash
# 1. Restore database from backup
psql -U postgres elimu_smart_production < backup_YYYYMMDD_HHMMSS.sql

# 2. Revert backend code changes
git revert <commit-hash>
git push origin main

# 3. Redeploy previous version
pm2 restart parse-server-prod
```

**Partial Rollback** (keep database, revert functions)
```javascript
// Restore old cloud function implementations
// Comment out new database-driven code
// Uncomment hardcoded array lookups
```

---

### Emergency Rollback Plan

**If Production Breaks**:

1. **Immediate Actions** (< 5 minutes)
   ```bash
   # Switch to maintenance mode
   # Restore last known good database backup
   psql -U postgres elimu_smart_production < backup_pre_migration.sql

   # Revert to previous code version
   git checkout <last-stable-commit>
   pm2 restart parse-server-prod
   ```

2. **Communication**
   - Notify all users of temporary maintenance
   - Alert team via Slack/Email
   - Document what went wrong

3. **Root Cause Analysis**
   - Review error logs
   - Identify failure point
   - Document lessons learned

4. **Fix and Retry**
   - Fix identified issues in test environment
   - Re-run full test suite
   - Schedule new migration window

---

### Rollback Success Criteria

Migration can be considered "rolled back successfully" when:
- [ ] All users can access the platform
- [ ] All core features functional
- [ ] No data loss
- [ ] Performance normal
- [ ] Error rate < 0.1%

---

## Overall Project Timeline

### Total Duration: 15-20 days

| Phase | Duration | Can Start After | Priority |
|-------|----------|-----------------|----------|
| Phase 1: Universities & Courses | 3-4 days | Immediately | CRITICAL |
| Phase 2: Career Database | 3-4 days | Phase 1 complete | CRITICAL |
| Phase 3: Subject Mappings | 2-3 days | Phase 2 complete | HIGH |
| Phase 4: RIASEC & Skills | 3-4 days | Phase 3 complete | MEDIUM |
| Phase 5: Admin Panel | 4-5 days | Any phase complete | LOW |

**Parallel Execution**:
- Phase 5 (Admin Panel) can be developed in parallel with Phases 1-4
- Testing can overlap with development
- Documentation ongoing throughout

---

## Frontend Hooks (Recommended)

While not strictly required, creating dedicated React hooks will improve code organization and UX:

### 1. useUniversity (Phase 1) - Priority: MEDIUM
**Effort**: 2-3 hours

```typescript
// frontend/src/hooks/useUniversity.ts
export const useUniversity = () => {
  const [universities, setUniversities] = useState([]);
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchUniversities = async (query, filters) => {
    // Call searchUniversities Cloud Function
  };

  const getUniversityDetails = async (universityId) => {
    // Call getUniversityDetails Cloud Function
  };

  const findCourses = async (clusterPoints, location) => {
    // Call findUniversityCourses Cloud Function
  };

  return { universities, courses, isLoading, error, searchUniversities, getUniversityDetails, findCourses };
};
```

### 2. useCareers (Phase 2) - Priority: HIGH
**Effort**: 2-3 hours

```typescript
// frontend/src/hooks/useCareers.ts
export const useCareers = () => {
  const [careers, setCareers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const exploreCareers = async (query, category, demandLevel) => {
    // Call exploreCareers Cloud Function
  };

  const getCareerDetails = async (careerId) => {
    // Call getCareerDetails Cloud Function with caching
  };

  const getTopCareers = async (limit = 10) => {
    // Call getTopCareers Cloud Function
  };

  return { careers, categories, isLoading, exploreCareers, getCareerDetails, getTopCareers };
};
```

### 3. useSubjectMapper (Phase 3) - Priority: HIGH
**Effort**: 3-4 hours

**Critical**: This hook replaces 466 lines of hardcoded data in SubjectCareerMapper.tsx

```typescript
// frontend/src/hooks/useSubjectMapper.ts
export const useSubjectMapper = () => {
  const [mappings, setMappings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const analyzeSubjects = async (subjects, grades) => {
    // Call analyzeSubjectCareerFit Cloud Function
  };

  const getCareersBySubject = async (subject) => {
    // Call getSubjectMappingDetails Cloud Function
  };

  return { mappings, isLoading, analyzeSubjects, getCareersBySubject };
};
```

### 4. useRiasecTypes (Phase 4) - Priority: LOW
**Effort**: 1-2 hours

```typescript
// frontend/src/hooks/useRiasecTypes.ts
export const useRiasecTypes = () => {
  const [riasecTypes, setRiasecTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getRiasecInfo = async (hollandCode) => {
    // Call getRiasecCareerInfo Cloud Function
  };

  const getCareerMatches = async (hollandCode) => {
    // Get matching careers for a RIASEC type
  };

  return { riasecTypes, isLoading, getRiasecInfo, getCareerMatches };
};
```

**Note**: Hooks are optional but recommended for better loading state management, centralized error handling, response caching, and consistent API across components.

---

## MCP (Model Context Protocol) Integration

MCP allows Claude to connect directly to your database and tools during migration development.

### Recommended MCP Servers

#### 1. PostgreSQL Server (HIGH PRIORITY)

**Configuration** (`~/.config/Claude/claude_desktop_config.json`):
```json
{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-postgres",
        "postgresql://postgres:password@localhost:5432/elimu_smart_production"
      ]
    }
  }
}
```

**Benefits**:
- Query database directly during migration
- Verify data counts before/after migration
- Run custom SQL for analysis
- No need to write temporary Cloud Functions
- Real-time data validation

**Example Usage**:
```sql
-- Check university count before migration
SELECT COUNT(*) FROM "University";

-- Verify all courses have valid university pointers
SELECT c.* FROM "Course" c
LEFT JOIN "University" u ON c."university" = u."objectId"
WHERE u."objectId" IS NULL;
```

#### 2. Filesystem Server (MEDIUM PRIORITY)

**Configuration**:
```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/root/elimu_smart"]
    }
  }
}
```

**Benefits**: Read backend files, generate migration scripts dynamically, update multiple files

#### 3. GitHub Server (LOW PRIORITY)

**Configuration**:
```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {"GITHUB_PERSONAL_ACCESS_TOKEN": "your_token"}
    }
  }
}
```

**Benefits**: Create feature branches, commit scripts, create PRs for review

### MCP Setup Instructions

1. Edit Claude Desktop config (Linux: `~/.config/Claude/claude_desktop_config.json`)
2. Add server configurations (see examples above)
3. Restart Claude Desktop
4. Verify `mcp__postgres__query` and other MCP tools available

### When to Use MCP

**Pre-Migration**: Query data structure, count records, analyze quality
**During Migration**: Verify in real-time, debug with custom queries, check relationships
**Post-Migration**: Performance analysis, data validation, confirm zero data loss

---

## Final Deliverables Checklist

### Code Deliverables
- [ ] 5 Parse Class schemas defined
- [ ] 5 schema initialization scripts
- [ ] 5 data migration scripts
- [ ] 15+ updated Cloud Functions
- [ ] 5+ new Cloud Functions
- [ ] 6 admin UI components
- [ ] Comprehensive test suite

### Documentation
- [ ] Migration plan document (this file)
- [ ] API documentation updates
- [ ] Admin user guide
- [ ] Troubleshooting guide
- [ ] Rollback procedures

### Database Changes
- [ ] 1,525 lines of hardcoded data migrated
- [ ] 5 new Parse Classes created
- [ ] 25+ indexes added for performance
- [ ] Relationships properly established

### Performance Improvements
- [ ] Faster query response times
- [ ] Reduced frontend bundle size (~25KB)
- [ ] Better scalability
- [ ] Dynamic content updates

---

## Success Criteria for Entire Migration

The migration is successful when:

✅ **Data Migration**
- 100% of hardcoded data migrated to database
- Zero data loss
- All relationships intact

✅ **Functionality**
- All backend functions work correctly
- All frontend components functional
- No user-facing errors

✅ **Performance**
- Query response times meet benchmarks
- No degradation in user experience
- Database performance acceptable

✅ **Maintainability**
- Content updates via admin panel
- No code changes needed for data updates
- Version history tracking functional

✅ **User Experience**
- No disruption to users
- Features work as before or better
- Faster load times

---

**Migration Plan Complete**
**Status**: Ready to Execute
**Last Updated**: 2025-10-10
**Total Estimated Effort**: 15-20 days

**Next Steps**: Review with team → Approve → Schedule → Execute Phase 1
