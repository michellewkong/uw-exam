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
					courseList.push({
						value: d.data[i].course, 
						label: d.data[i].course,
						date: d.data[i].sections[0].date,
						start_time: d.data[i].sections[0].start_time,
						end_time: d.data[i].sections[0].end_time
					});
			}
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

function removeElem(o) {
	var cname = o.parentNode.firstChild.innerHTML;
	var table = o.parentNode.parentNode.parentNode.parentNode;
	
	for(var i=0; i<jsonCourses.length;i++) {
		if (jsonCourses[i].summary == cname + " Exam") {
			jsonCourses.splice(i,1);
		}
	}
	
    table.parentNode.removeChild(table);
}

function addToList( index ) {
	var cname = courseData[index].course;
	var date = courseData[index].date;
	var start_time = courseData[index].start_time;
	var end_time = courseData[index].end_time;
	var location = courseData[index].location; 
	var ctitle = courseInfo.title;
	
	// Create table.
    var table = document.createElement('table');
	//table.className = 'list-element';
    // Insert New Row for table at index '0'.
    var row1 = table.insertRow(0);
    // Insert New Column for Row1 at index '0'.
    row1.innerHTML = '<tr><th><p class="cname">'+cname+'</p><p class="ctitle">'+ctitle+'</p><button type="button" class="close" aria-hidden="true" onclick="removeElem(this);">&times;</button></th></tr>';

	var exam = true;
	
	if (date !== '') {
		var row2 = table.insertRow(1);
		var row2col1 = row2.insertCell(0);
		var d = $.datepicker.parseDate("yy-mm-dd", date);
		var datestrInNewFormat = $.datepicker.formatDate( "DD, MM dd, yy", d);
		row2col1.innerHTML = '<p>'+datestrInNewFormat+'</p>';
		
		var row3 = table.insertRow(2);
		var row3col1 = row3.insertCell(0);
		row3col1.innerHTML = '<p>'+start_time+' - '+end_time+'</p>';
		
		var row4 = table.insertRow(3);
		var row4col1 = row4.insertCell(0);
		row4col1.innerHTML = '<p>'+location+'</p>';
	} else {
		var row2 = table.insertRow(1);
		var row2col1 = row2.insertCell(0);
		row2col1.innerHTML = '<p>No exam</p>';
		exam = false;
	}
	
    // Append Table into div.
    var div = document.getElementById('list');
    div.appendChild(table);

	// Create Json object for Google Calendar
	var resource = {
      "summary": cname + " Exam",
      "location": location,
      "start": {
          "dateTime": parseDate(date, start_time)
      },
      "end": {
        "dateTime": parseDate(date, end_time)
      }
    };

    if (exam ) {
    	jsonCourses.push(resource);
    }

	$('#search').val('');
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
