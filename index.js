const fs = require("fs");
const parse = require("csv-parse");
const Student = require("./student");

/* -----Globals----- */
const courses = {};
const tests = {};
const students = [];

/* -----Initializing steams----- */

const createTests = fs
  .createReadStream("assets/tests.csv")
  .pipe(parse({ delimiter: "," }));

const createAllStudents = fs
  .createReadStream("assets/students.csv")
  .pipe(parse({ delimiter: "," }));

const createMarks = fs
  .createReadStream("assets/marks.csv")
  .pipe(parse({ delimiter: "," }));

const createCourses = fs
  .createReadStream("assets/courses.csv")
  .pipe(parse({ delimiter: "," }))
  .on("data", function(csvrow) {
    const id = Number(csvrow[0]);
    const name = csvrow[1];
    const teacher = csvrow[2];
    if (!Number.isNaN(id)) {
      courses[id] = { name, teacher };
    }
  });

// Once our global course object has been populated, we can populate our test object
createCourses.on("end", function() {
  createTests.on("data", function(csvrow) {
    const id = Number(csvrow[0]);
    const course = csvrow[1];
    const weight = csvrow[2];
    if (!Number.isNaN(id)) {
      tests[id] = { course, weight };
    }
  });
});

// Once our global test object has been populated, we can populate our student instances
createTests.on("end", function() {
  createAllStudents.on("data", function(csvrow) {
    const id = Number(csvrow[0]);
    const name = csvrow[1];
    if (!Number.isNaN(id)) {
      students[id] = new Student(name, id);
    }
  });
});

// Once all students have been populated, we can start adding their marks
createAllStudents.on("end", function() {
  createMarks.on("data", function(csvrow) {
    const testid = Number(csvrow[0]);
    const studentid = csvrow[1];
    const grade = csvrow[2];

    if (!Number.isNaN(testid)) {
      students[studentid].addMark(testid, grade, tests);
    }
  });
});

// Once all marks have been inputted, we can then generate the report card
createMarks.on("end", function() {
  let reportCard = "";
  for (let i = 0; i < students.length; i++) {
    if (students[i]) {
      if (i === students.length - 1) {
        reportCard += students[i].generateReportCard(courses);
      } else {
        reportCard += students[i].generateReportCard(courses) + "\n\n";
      }
    }
  }
  fs.writeFileSync("ReportCards.txt", reportCard);
});
