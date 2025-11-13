/**
 * Counselor Assignment Functions
 * Handles student-counselor matching and assignment
 */

// Global Parse is available from main.js - no require needed

/**
 * Manually assign a counselor to a student
 */
Parse.Cloud.define('assignCounselorToStudent', async (request) => {
  const { studentId, counselorId } = request.params;
  const requestingUser = request.user;

  // Verify user is authenticated and has permission
  if (!requestingUser) {
    throw new Parse.Error(Parse.Error.SESSION_MISSING, 'User must be authenticated');
  }

  const role = requestingUser.get('role');
  if (role !== 'admin' && role !== 'counselor') {
    throw new Parse.Error(Parse.Error.OPERATION_FORBIDDEN, 'Only admins and counselors can assign');
  }

  if (!studentId || !counselorId) {
    throw new Parse.Error(Parse.Error.INVALID_QUERY, 'Student ID and Counselor ID are required');
  }

  try {
    // Get student
    const studentQuery = new Parse.Query(Parse.User);
    const student = await studentQuery.get(studentId, { useMasterKey: true });

    if (!student) {
      throw new Parse.Error(Parse.Error.OBJECT_NOT_FOUND, 'Student not found');
    }

    if (student.get('role') !== 'student') {
      throw new Parse.Error(Parse.Error.VALIDATION_ERROR, 'User is not a student');
    }

    // Get counselor
    const counselorQuery = new Parse.Query(Parse.User);
    const counselor = await counselorQuery.get(counselorId, { useMasterKey: true });

    if (!counselor) {
      throw new Parse.Error(Parse.Error.OBJECT_NOT_FOUND, 'Counselor not found');
    }

    if (counselor.get('role') !== 'counselor') {
      throw new Parse.Error(Parse.Error.VALIDATION_ERROR, 'User is not a counselor');
    }

    // Update student's assigned counselor
    student.set('assignedCounselorId', counselor.id);
    await student.save(null, { useMasterKey: true });

    // Log activity
    await Parse.Cloud.run('logUserActivity', {
      userId: student.id,
      activityType: 'counselor_assigned',
      activityData: {
        counselorId: counselor.id,
        counselorName: `${counselor.get('firstName')} ${counselor.get('lastName')}`,
        assignedBy: requestingUser.id
      }
    }, { useMasterKey: true });

    return {
      success: true,
      studentId: student.id,
      counselorId: counselor.id,
      counselorName: `${counselor.get('firstName')} ${counselor.get('lastName')}`,
      message: 'Counselor assigned successfully'
    };

  } catch (error) {
    console.error('Error assigning counselor:', error);
    throw error;
  }
});

/**
 * Automatically assign a counselor to a student using round-robin
 * Assigns to counselor with lowest student count
 */
Parse.Cloud.define('autoAssignCounselor', async (request) => {
  const { studentId } = request.params;

  if (!studentId) {
    throw new Parse.Error(Parse.Error.INVALID_QUERY, 'Student ID is required');
  }

  try {
    // Get student
    const studentQuery = new Parse.Query(Parse.User);
    const student = await studentQuery.get(studentId, { useMasterKey: true });

    if (!student) {
      throw new Parse.Error(Parse.Error.OBJECT_NOT_FOUND, 'Student not found');
    }

    if (student.get('role') !== 'student') {
      throw new Parse.Error(Parse.Error.VALIDATION_ERROR, 'User is not a student');
    }

    // Check if already assigned
    if (student.get('assignedCounselorId')) {
      const existingCounselor = await new Parse.Query(Parse.User).get(
        student.get('assignedCounselorId'),
        { useMasterKey: true }
      );
      return {
        success: true,
        alreadyAssigned: true,
        counselorId: existingCounselor.id,
        counselorName: `${existingCounselor.get('firstName')} ${existingCounselor.get('lastName')}`,
        message: 'Student already has assigned counselor'
      };
    }

    // Get all active counselors
    const counselorsQuery = new Parse.Query(Parse.User);
    counselorsQuery.equalTo('role', 'counselor');
    counselorsQuery.notEqualTo('isDeleted', true);
    const counselors = await counselorsQuery.find({ useMasterKey: true });

    if (counselors.length === 0) {
      throw new Parse.Error(Parse.Error.OBJECT_NOT_FOUND, 'No active counselors available');
    }

    // Count students per counselor
    const counselorWorkloads = await Promise.all(
      counselors.map(async (counselor) => {
        const studentCountQuery = new Parse.Query(Parse.User);
        studentCountQuery.equalTo('role', 'student');
        studentCountQuery.equalTo('assignedCounselorId', counselor.id);
        const count = await studentCountQuery.count({ useMasterKey: true });

        return {
          counselor,
          studentCount: count
        };
      })
    );

    // Find counselor with lowest student count (round-robin)
    const selectedCounselor = counselorWorkloads.reduce((min, current) => {
      return current.studentCount < min.studentCount ? current : min;
    });

    // Assign student to counselor
    student.set('assignedCounselorId', selectedCounselor.counselor.id);
    await student.save(null, { useMasterKey: true });

    // Log activity
    await Parse.Cloud.run('logUserActivity', {
      userId: student.id,
      activityType: 'counselor_auto_assigned',
      activityData: {
        counselorId: selectedCounselor.counselor.id,
        counselorName: `${selectedCounselor.counselor.get('firstName')} ${selectedCounselor.counselor.get('lastName')}`,
        counselorStudentCount: selectedCounselor.studentCount,
        assignmentMethod: 'round_robin'
      }
    }, { useMasterKey: true });

    return {
      success: true,
      studentId: student.id,
      counselorId: selectedCounselor.counselor.id,
      counselorName: `${selectedCounselor.counselor.get('firstName')} ${selectedCounselor.counselor.get('lastName')}`,
      counselorEmail: selectedCounselor.counselor.get('email'),
      counselorStudentCount: selectedCounselor.studentCount,
      message: 'Counselor auto-assigned successfully'
    };

  } catch (error) {
    console.error('Error auto-assigning counselor:', error);
    throw error;
  }
});

/**
 * Get workload for all counselors (student counts)
 */
Parse.Cloud.define('getCounselorWorkload', async (request) => {
  const requestingUser = request.user;

  if (!requestingUser) {
    throw new Parse.Error(Parse.Error.SESSION_MISSING, 'User must be authenticated');
  }

  try {
    // Get all active counselors
    const counselorsQuery = new Parse.Query(Parse.User);
    counselorsQuery.equalTo('role', 'counselor');
    counselorsQuery.notEqualTo('isDeleted', true);
    const counselors = await counselorsQuery.find({ useMasterKey: true });

    // Count students for each counselor
    const workloads = await Promise.all(
      counselors.map(async (counselor) => {
        const studentCountQuery = new Parse.Query(Parse.User);
        studentCountQuery.equalTo('role', 'student');
        studentCountQuery.equalTo('assignedCounselorId', counselor.id);
        const count = await studentCountQuery.count({ useMasterKey: true });

        return {
          counselorId: counselor.id,
          counselorName: `${counselor.get('firstName')} ${counselor.get('lastName')}`,
          counselorEmail: counselor.get('email'),
          studentCount: count
        };
      })
    );

    // Sort by student count (descending)
    workloads.sort((a, b) => b.studentCount - a.studentCount);

    return {
      success: true,
      totalCounselors: counselors.length,
      workloads
    };

  } catch (error) {
    console.error('Error getting counselor workload:', error);
    throw error;
  }
});

/**
 * Reassign a student to a different counselor
 */
Parse.Cloud.define('reassignCounselor', async (request) => {
  const { studentId, newCounselorId } = request.params;
  const requestingUser = request.user;

  if (!requestingUser) {
    throw new Parse.Error(Parse.Error.SESSION_MISSING, 'User must be authenticated');
  }

  const role = requestingUser.get('role');
  if (role !== 'admin') {
    throw new Parse.Error(Parse.Error.OPERATION_FORBIDDEN, 'Only admins can reassign counselors');
  }

  if (!studentId || !newCounselorId) {
    throw new Parse.Error(Parse.Error.INVALID_QUERY, 'Student ID and new Counselor ID are required');
  }

  try {
    // Get student
    const studentQuery = new Parse.Query(Parse.User);
    const student = await studentQuery.get(studentId, { useMasterKey: true });

    const oldCounselorId = student.get('assignedCounselorId');

    // Get new counselor
    const counselorQuery = new Parse.Query(Parse.User);
    const newCounselor = await counselorQuery.get(newCounselorId, { useMasterKey: true });

    if (newCounselor.get('role') !== 'counselor') {
      throw new Parse.Error(Parse.Error.VALIDATION_ERROR, 'New user is not a counselor');
    }

    // Update assignment
    student.set('assignedCounselorId', newCounselor.id);
    await student.save(null, { useMasterKey: true });

    // Log activity
    await Parse.Cloud.run('logUserActivity', {
      userId: student.id,
      activityType: 'counselor_reassigned',
      activityData: {
        oldCounselorId,
        newCounselorId: newCounselor.id,
        newCounselorName: `${newCounselor.get('firstName')} ${newCounselor.get('lastName')}`,
        reassignedBy: requestingUser.id
      }
    }, { useMasterKey: true });

    return {
      success: true,
      studentId: student.id,
      newCounselorId: newCounselor.id,
      newCounselorName: `${newCounselor.get('firstName')} ${newCounselor.get('lastName')}`,
      message: 'Counselor reassigned successfully'
    };

  } catch (error) {
    console.error('Error reassigning counselor:', error);
    throw error;
  }
});

/**
 * Remove counselor assignment from a student
 */
Parse.Cloud.define('removeCounselorAssignment', async (request) => {
  const { studentId } = request.params;
  const requestingUser = request.user;

  if (!requestingUser) {
    throw new Parse.Error(Parse.Error.SESSION_MISSING, 'User must be authenticated');
  }

  const role = requestingUser.get('role');
  if (role !== 'admin') {
    throw new Parse.Error(Parse.Error.OPERATION_FORBIDDEN, 'Only admins can remove assignments');
  }

  if (!studentId) {
    throw new Parse.Error(Parse.Error.INVALID_QUERY, 'Student ID is required');
  }

  try {
    const studentQuery = new Parse.Query(Parse.User);
    const student = await studentQuery.get(studentId, { useMasterKey: true });

    const oldCounselorId = student.get('assignedCounselorId');

    student.unset('assignedCounselorId');
    await student.save(null, { useMasterKey: true });

    // Log activity
    await Parse.Cloud.run('logUserActivity', {
      userId: student.id,
      activityType: 'counselor_assignment_removed',
      activityData: {
        oldCounselorId,
        removedBy: requestingUser.id
      }
    }, { useMasterKey: true });

    return {
      success: true,
      message: 'Counselor assignment removed'
    };

  } catch (error) {
    console.error('Error removing counselor assignment:', error);
    throw error;
  }
});

module.exports = {
  // Export for testing if needed
  assignCounselorToStudent: Parse.Cloud.define,
  autoAssignCounselor: Parse.Cloud.define,
  getCounselorWorkload: Parse.Cloud.define,
  reassignCounselor: Parse.Cloud.define
};
