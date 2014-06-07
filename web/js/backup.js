var courseData = {};
var courseList = [];
var courseInfo = {};
var jsonCourses = [];
var termCode = getTerm();

function load() {
	$.getJSON("https://api.uwaterloo.ca/v2/terms/1141/examschedule.json?key=211902c1630ca71d306f1b40daa5de90",
		function (d) {
			if (d.meta.status === 200) {
				//$('#search-container :input').removeAttr('disabled');
				var k = -1;
				for(var i=0; i<d.data.length;i++) {
					k++;
					courseData[k] = {};
					courseData[k].course=d.data[i].course;
					courseData[k].section=d.data[i].sections[0].section;
					courseData[k].date=d.data[i].sections[0].date;
					courseData[k].start_time=d.data[i].sections[0].start_time;
					courseData[k].end_time=d.data[i].sections[0].end_time;
					courseData[k].location=d.data[i].sections[0].location;
					courseData[k].notes=d.data[i].sections[0].notes;
					if (d.data[i].sections[0].section == "081 Online") {
						d.data[i].sections[0].section = "081";
					}
					courseList.push({
						value: d.data[i].course + " " + d.data[i].sections[0].section, 
						label: d.data[i].course + " " + d.data[i].sections[0].section,
						date: d.data[i].sections[0].date,
						start_time: d.data[i].sections[0].start_time,
						end_time: d.data[i].sections[0].end_time
					});	
					for (var j=1; j<d.data[i].sections.length;j++){
						if (d.data[i].sections[j].location != d.data[i].sections[0].location) {
							k++;
							if (d.data[i].course =="FR 192B") {
								console.log(k);
							}
							courseData[k] = {};
							courseData[k].course=d.data[i].course;
							courseData[k].section=d.data[i].sections[j].section;
							courseData[k].date=d.data[i].sections[j].date;
							courseData[k].start_time=d.data[i].sections[j].start_time;
							courseData[k].end_time=d.data[i].sections[j].end_time;
							courseData[k].location=d.data[i].sections[j].location;
							courseData[k].notes=d.data[i].sections[j].notes;
							if (d.data[i].sections[j].section == "081 Online") {
								d.data[i].sections[j].section = "081";
							}
							courseList.push({
								value: d.data[i].course + " " + d.data[i].sections[j].section, 
								label: d.data[i].course + " " + d.data[i].sections[j].section,
								date: d.data[i].sections[j].date,
								start_time: d.data[i].sections[j].start_time,
								end_time: d.data[i].sections[j].end_time
							});	
						}
					}
				}
			} else {
				$('#search-container :input').attr('disabled', true);
				$('#search-container :input').attr('placeholder', 'Exam schedule is not currently available.');
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
	var csection = courseData[index].section;
	var date = courseData[index].date;
	var notes = courseData[index].notes;
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
    row1.innerHTML = '<tr><th><p class="cname">'+cname+" - "+csection+'</p><p class="ctitle">'+ctitle+'</p><button type="button" class="close" aria-hidden="true" onclick="removeElem(this);">&times;</button></th></tr>';

	var exam = true;
	
	if (start_time !== '') {
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
	} else if (start_time == '' && notes == ''){
		var row2 = table.insertRow(1);
		var row2col1 = row2.insertCell(0);
		row2col1.innerHTML = '<p>No exam</p>';
		exam = false;
	} else  if (notes == 'See https:\/\/uwaterloo.ca\/quest\/help\/students\/how-do-i\/online-exam-schedule') {
		var row2 = table.insertRow(1);
		var row2col1 = row2.insertCell(0);
		row2col1.innerHTML = '<p>The exam schedule is not complete for this course. Check the online exam schedule <a target="_blank" href="https:\/\/uwaterloo.ca\/quest\/help\/students\/how-do-i\/online-exam-schedule">here</a> for more information.</p>';
		exam = false;
	}
	else {
		var row2 = table.insertRow(1);
		var row2col1 = row2.insertCell(0);
		row2col1.innerHTML = '<p>The exam schedule is not complete for this course. Please contact the professor for more information.</p>';
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

	// we know we are at waterloo! daylight saving time march-november
	// so, -4 for winter/spring, -5 for winter
	var newdate = date + "T" + hour+ ":" + minute + ":00.000-04:00";
	return newdate;
}

function getTerm() {
	var d = new Date();
	var m = d.getMonth();
	var y = d.getFullYear() + '';
	var code;

	if (m<=3) {
		// winter
		code = "1" + y.slice(2, 4) + "1";
	}
	else if (7>=m>3) {
		//spring
		code = "1" + y.slice(2, 4) + "5";
	}
	else if(m>7) {
		//fall
		code = "1" + y.slice(2, 4) + "9";
	}

	return code;
}
