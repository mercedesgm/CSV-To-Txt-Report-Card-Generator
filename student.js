class Student {
  constructor(name, id) {
    this.id = id;
    this.name = name;
    this.gradeSum = 0;
    this.courses = [];
    this.numberOfEnrolledCourses = 0;
  }

  addMark(test, grade, allTests) {
    const course = allTests[test].course;
    const weight = allTests[test].weight;
    if (this.courses[course]) {
      this.courses[course] += grade * (weight / 100);
    } else {
      this.courses[course] = grade * (weight / 100);
      this.numberOfEnrolledCourses++;
    }
  }

  generateReportCard(allCourses) {
    const studentHeader = `Student Id: ${this.id}, name: ${this.name}\n`;
    const courseTexts = [];

    for (let i = 0; i < this.courses.length; i++) {
      if (this.courses[i]) {
        const courseGrade = this.courses[i];
        const name = allCourses[i].name;
        const teacher = allCourses[i].teacher;
        this.gradeSum += courseGrade;
        courseTexts.push(
          `\tCourse: ${name}, Teacher: ${teacher}\n\tFinal Grade: ${courseGrade.toFixed(
            2
          )}%\n`
        );
      }
    }

    const totalAverageHeader = `Total Average: ${(
      this.gradeSum / this.numberOfEnrolledCourses
    ).toFixed(2)}%\n`;

    return (
      studentHeader +
      totalAverageHeader +
      "\n" +
      courseTexts.reduce((acc, text) => acc + "\n" + text)
    );
  }
}

module.exports = Student;
