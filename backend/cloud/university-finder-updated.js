/**
 * Updated University Course Finder Cloud Function
 *
 * Queries from Parse Classes instead of hardcoded data
 * Ready to replace lines 3360-3518 in main.js
 */

// University Course Finder Cloud Function (Parse Class version)
Parse.Cloud.define('findUniversityCourses', async (request) => {
  const { user } = request;
  if (!user) {
    throw new Error('User must be authenticated');
  }

  const {
    studentProfile,
    academicPreferences,
    financialConstraints,
    locationPreferences
  } = request.params;

  console.log('🎓 Processing University Course Finder request (Parse Class version):', {
    studentProfile: studentProfile ? 'provided' : 'missing',
    academicPreferences: academicPreferences ? 'provided' : 'missing',
    financialConstraints: financialConstraints ? 'provided' : 'missing',
    locationPreferences: locationPreferences ? 'provided' : 'missing'
  });

  // Generate cache key based on request parameters
  const cacheKey = `university_finder:${JSON.stringify({
    subjects: studentProfile?.subjects?.sort(),
    grades: studentProfile?.grades,
    careers: academicPreferences?.careerInterests?.sort(),
    maxFees: financialConstraints?.maxAnnualFees,
    locations: locationPreferences?.sort()
  })}`;

  try {
    // Check cache first (10 minute TTL)
    const cachedResult = await cache.get(cacheKey);
    if (cachedResult) {
      console.log('✅ Cache HIT - Returning cached university results');
      return { ...cachedResult, fromCache: true };
    }

    console.log('❌ Cache MISS - Computing university matches from Parse Classes');

    // Calculate student's cluster points based on grades
    const clusterPoints = calculateClusterPoints(studentProfile.grades);

    // Query Universities from Parse Class
    const UniversityClass = Parse.Object.extend('University');
    const universityQuery = new Parse.Query(UniversityClass);
    universityQuery.equalTo('active', true);

    // Apply location filter if specified
    if (locationPreferences && locationPreferences.length > 0) {
      universityQuery.containedIn('location', locationPreferences);
    }

    const universities = await universityQuery.find({ useMasterKey: true });
    console.log(`📚 Found ${universities.length} active universities`);

    // Find matching programs
    const matchingPrograms = [];

    for (const university of universities) {
      // Query courses for this university
      const CourseClass = Parse.Object.extend('Course');
      const courseQuery = new Parse.Query(CourseClass);
      courseQuery.equalTo('university', university);
      courseQuery.equalTo('active', true);

      const courses = await courseQuery.find({ useMasterKey: true });

      for (const course of courses) {
        // Extract course data
        const program = {
          id: course.get('courseId'),
          name: course.get('name'),
          kuccpsCode: course.get('kuccpsCode'),
          cutoffPoints: course.get('cutoffPoints'),
          duration: course.get('duration'),
          subjects: course.get('subjects') || [],
          careerOutcomes: course.get('careerOutcomes') || [],
          averageSalary: course.get('averageSalary'),
          employmentRate: course.get('employmentRate'),
          annualFees: course.get('annualFees'),
          scholarships: course.get('scholarships') || []
        };

        // Check academic eligibility
        const eligible = clusterPoints >= program.cutoffPoints;
        const pointsGap = program.cutoffPoints - clusterPoints;

        // Check subject requirements
        const hasRequiredSubjects = checkSubjectRequirements(
          studentProfile.subjects,
          program.subjects
        );

        // Check financial constraints
        const financiallyViable = !financialConstraints ||
          program.annualFees <= (financialConstraints.maxAnnualFees || 200000);

        // Calculate match score (0-100)
        const matchScore = calculateUniversityMatchScore({
          clusterPoints,
          program,
          studentProfile,
          academicPreferences,
          hasRequiredSubjects,
          financiallyViable
        });

        // Add to results if meets minimum criteria
        if (matchScore >= 30) {
          matchingPrograms.push({
            universityId: university.get('universityId'),
            universityName: university.get('name'),
            universityType: university.get('type'),
            location: university.get('location'),
            kuccpsCode: university.get('kuccpsCode'),
            program: {
              ...program,
              eligible,
              pointsGap: Math.max(0, pointsGap),
              matchScore,
              hasRequiredSubjects,
              financiallyViable,
              affordabilityLevel: getAffordabilityLevel(program.annualFees, financialConstraints),
              careerOutlook: getCareerOutlook(program),
              recommendationReason: getRecommendationReason({
                matchScore,
                eligible,
                hasRequiredSubjects,
                financiallyViable,
                academicPreferences
              })
            }
          });
        }
      }
    }

    // Sort by match score (highest first)
    matchingPrograms.sort((a, b) => b.program.matchScore - a.program.matchScore);

    // Generate personalized recommendations
    const recommendations = generateUniversityRecommendations({
      matchingPrograms,
      studentProfile,
      clusterPoints,
      academicPreferences,
      financialConstraints
    });

    // Log activity
    await Parse.Cloud.run('logUserActivity', {
      userId: user.id,
      activityType: 'university_finder',
      details: {
        clusterPoints,
        programsFound: matchingPrograms.length,
        preferences: {
          academic: !!academicPreferences,
          financial: !!financialConstraints,
          location: !!locationPreferences
        },
        dataSource: 'parse_class' // Track that we're using Parse Classes now
      }
    });

    const result = {
      success: true,
      clusterPoints,
      matchingPrograms: matchingPrograms.slice(0, 15), // Top 15 matches
      recommendations,
      summary: {
        totalMatches: matchingPrograms.length,
        eligiblePrograms: matchingPrograms.filter(p => p.program.eligible).length,
        averageMatchScore: matchingPrograms.length > 0
          ? matchingPrograms.reduce((sum, p) => sum + p.program.matchScore, 0) / matchingPrograms.length
          : 0
      },
      dataSource: 'parse_class' // Indicate data comes from Parse Classes
    };

    // Cache the result for 10 minutes (600 seconds)
    await cache.set(cacheKey, result, 600);
    console.log('💾 Cached university finder results');

    return result;

  } catch (error) {
    console.error('❌ University Course Finder error:', error);
    throw new Error(`Failed to find university courses: ${error.message}`);
  }
});
