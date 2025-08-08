export interface KuccpsPlacementData {
  similar_code: string;
  uni_code: string;
  prog_code: string;
  course_name: string;
  cut_off_2016?: number;
  cut_off_2015?: number;
  cut_off_2014?: number;
}

export interface UniversityData {
  uni_code: string;
  university_name: string;
  location?: string;
}

export interface CourseGuideData {
  course_code: string;
  course_name: string;
  category: string;
  requirements: string[];
}

class KuccpsService {
  private baseUrl = 'https://raw.githubusercontent.com/princelySid/kuccps_placement_api/main';
  
  async fetchSimilarCourses(): Promise<KuccpsPlacementData[]> {
    try {
      const response = await fetch(`${this.baseUrl}/similar_courses.csv`);
      const csvText = await response.text();
      return this.parseCsvToJson(csvText);
    } catch (error) {
      console.error('Error fetching similar courses:', error);
      return this.getMockSimilarCourses();
    }
  }

  async fetchInstitutions(): Promise<UniversityData[]> {
    try {
      const response = await fetch(`${this.baseUrl}/institutions.csv`);
      const csvText = await response.text();
      return this.parseInstitutionsCsv(csvText);
    } catch (error) {
      console.error('Error fetching institutions:', error);
      return this.getMockInstitutions();
    }
  }

  async fetchCourseGuide(): Promise<CourseGuideData[]> {
    try {
      const response = await fetch(`${this.baseUrl}/course_guide.csv`);
      const csvText = await response.text();
      return this.parseCourseGuideCsv(csvText);
    } catch (error) {
      console.error('Error fetching course guide:', error);
      return this.getMockCourseGuide();
    }
  }

  private parseCsvToJson(csvText: string): KuccpsPlacementData[] {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    
    return lines.slice(1).filter(line => line.trim()).map(line => {
      const values = line.split(',').map(v => v.trim());
      const obj: any = {};
      
      headers.forEach((header, index) => {
        if (header.includes('cut_off')) {
          obj[header] = values[index] ? parseFloat(values[index]) : undefined;
        } else {
          obj[header] = values[index] || '';
        }
      });
      
      return obj as KuccpsPlacementData;
    });
  }

  private parseInstitutionsCsv(csvText: string): UniversityData[] {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    
    return lines.slice(1).filter(line => line.trim()).map(line => {
      const values = line.split(',').map(v => v.trim());
      const obj: any = {};
      
      headers.forEach((header, index) => {
        obj[header] = values[index] || '';
      });
      
      return obj as UniversityData;
    });
  }

  private parseCourseGuideCsv(csvText: string): CourseGuideData[] {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    
    return lines.slice(1).filter(line => line.trim()).map(line => {
      const values = line.split(',').map(v => v.trim());
      const obj: any = {};
      
      headers.forEach((header, index) => {
        if (header === 'requirements') {
          obj[header] = values[index] ? values[index].split(';') : [];
        } else {
          obj[header] = values[index] || '';
        }
      });
      
      return obj as CourseGuideData;
    });
  }

  private getMockSimilarCourses(): KuccpsPlacementData[] {
    return [
      {
        similar_code: 'CS001',
        uni_code: 'UON',
        prog_code: 'BSCS',
        course_name: 'Bachelor of Science in Computer Science',
        cut_off_2016: 78.5,
        cut_off_2015: 76.2,
        cut_off_2014: 74.8
      },
      {
        similar_code: 'ENG001',
        uni_code: 'JKUAT',
        prog_code: 'BENG',
        course_name: 'Bachelor of Engineering',
        cut_off_2016: 75.2,
        cut_off_2015: 73.5,
        cut_off_2014: 71.8
      },
      {
        similar_code: 'MED001',
        uni_code: 'UON',
        prog_code: 'MBCHB',
        course_name: 'Bachelor of Medicine and Surgery',
        cut_off_2016: 84.5,
        cut_off_2015: 83.2,
        cut_off_2014: 82.1
      },
      {
        similar_code: 'BUS001',
        uni_code: 'USIU',
        prog_code: 'BBA',
        course_name: 'Bachelor of Business Administration',
        cut_off_2016: 68.5,
        cut_off_2015: 66.8,
        cut_off_2014: 65.2
      }
    ];
  }

  private getMockInstitutions(): UniversityData[] {
    return [
      { uni_code: 'UON', university_name: 'University of Nairobi', location: 'Nairobi' },
      { uni_code: 'JKUAT', university_name: 'Jomo Kenyatta University of Agriculture and Technology', location: 'Kiambu' },
      { uni_code: 'USIU', university_name: 'United States International University', location: 'Nairobi' },
      { uni_code: 'KU', university_name: 'Kenyatta University', location: 'Kiambu' },
      { uni_code: 'MOI', university_name: 'Moi University', location: 'Eldoret' }
    ];
  }

  private getMockCourseGuide(): CourseGuideData[] {
    return [
      {
        course_code: 'BSCS',
        course_name: 'Bachelor of Science in Computer Science',
        category: 'Technology',
        requirements: ['Mathematics', 'Physics', 'Chemistry', 'English']
      },
      {
        course_code: 'BENG',
        course_name: 'Bachelor of Engineering',
        category: 'Engineering',
        requirements: ['Mathematics', 'Physics', 'Chemistry', 'English']
      },
      {
        course_code: 'MBCHB',
        course_name: 'Bachelor of Medicine and Surgery',
        category: 'Medicine',
        requirements: ['Biology', 'Chemistry', 'Physics', 'Mathematics', 'English']
      }
    ];
  }

  async getRecommendedCourses(studentGrade: number = 82.3): Promise<KuccpsPlacementData[]> {
    const courses = await this.fetchSimilarCourses();
    return courses.filter(course => {
      const latestCutoff = course.cut_off_2016 || course.cut_off_2015 || course.cut_off_2014;
      return latestCutoff && studentGrade >= latestCutoff - 5; // 5 point buffer
    }).slice(0, 10);
  }

  async getUniversityName(uniCode: string): Promise<string> {
    const institutions = await this.fetchInstitutions();
    const university = institutions.find(inst => inst.uni_code === uniCode);
    return university?.university_name || uniCode;
  }

  calculateMatchPercentage(studentGrade: number, cutoffGrade: number): number {
    if (studentGrade >= cutoffGrade) {
      return Math.min(100, Math.round((studentGrade / cutoffGrade) * 100));
    }
    return Math.round((studentGrade / cutoffGrade) * 100);
  }

  getMatchLevel(percentage: number): 'High Match' | 'Good Match' | 'Reach' | 'Safety' {
    if (percentage >= 110) return 'Safety';
    if (percentage >= 100) return 'High Match';
    if (percentage >= 85) return 'Good Match';
    return 'Reach';
  }
}

export const kuccpsService = new KuccpsService();
