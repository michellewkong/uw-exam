var courseData = {};
var courseList = [];
var courseInfo = {};
var jsonCourses = [];

function load() {
	$.getJSON("https://api.uwaterloo.ca/v2/terms/1141/examschedule.json?key=211902c1630ca71d306f1b40daa5de90",
		function (d) {
			if (d.meta.status === 200) {
				for(var i=0; i<d.data.length;i++) {
					courseData[i] = {};
					courseData[i].course=d.data[i].course;
					courseData[i].date=d.data[i].sections[0].date;
					courseData[i].start_time=d.data[i].sections[0].start_time;
					courseData[i].end_time=d.data[i].sections[0].end_time;
					courseData[i].location=d.data[i].sections[0].location;
					courseList.push(d.data[i].course);
			}
			console.log(courseList);
			} else {
				console.log("Failed to read course data." + JSON.stringify(d.meta));
			}
		});
}
	
function getCourseDetails( index ) {
	var thisCourse =  courseData[index].course.split(" ");
	$.getJSON("https://api.uwaterloo.ca/v2/courses/" + thisCourse[0] + "/" + thisCourse[1] + ".json?key=211902c1630ca71d306f1b40daa5de90",
        function (d) {
          if (d.meta.status === 200) {
			courseInfo = d.data;
			addToList( index );
          } else {
            console.log("Failed to read course data." + JSON.stringify(d.meta));
          }
        });
}

function addToList( index ) {
	var cname = courseData[index].course;
	var date = courseData[index].date;
	var start_time = courseData[index].start_time;
	var end_time = courseData[index].end_time;
	var location = courseData[index].location; 
	var ctitle = courseInfo.title;
	
	var msgContainer = document.createElement('div');
	msgContainer.id = 'xyz';             // No setAttribute required
	msgContainer.className = 'someClass' // No setAttribute required, note it's "className" to avoid conflict with JavaScript reserved word
	msgContainer.appendChild(document.createTextNode(cname + " " + date + " " + start_time + " " + end_time + " " + location + " " + ctitle));
	document.getElementById( "list" ).appendChild(msgContainer);
	
	// Create Json object for Google Calendar
	var resource = {
      "summary": ctitle + " Exam",
      "location": location,
      "start": {
          "dateTime": parseDate(date, start_time)
      },
      "end": {
        "dateTime": parseDate(date, end_time)
      }
    };

    jsonCourses.push(resource);
}

function parseDate(date, time) {
	var pattern = /^.?.(?=:)/;
	var hour = time.match(pattern);

	pattern = /..(?= [AP]M)/;
	var minute = time.match(pattern);
	pattern = /AM/;
	var am = time.match(pattern);
	
	if (am == null && hour != "12") {
		hour = parseInt(hour) + 12;
	}

	if (hour < 10) {
		hour = "0" + hour;
	}

	var newdate = date + "T" + hour+ ":" + minute + ":00.000-04:00";
	return newdate;
}