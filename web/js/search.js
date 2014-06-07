var courseData = {};
var examineSections = {};
var courseList = [];
var courseInfo = {};
var jsonCourses = [];
var termCode = getTerm();

function load() {
	$.getJSON("https://api.uwaterloo.ca/v2/terms/"+ termCode + "/examschedule.json?key=211902c1630ca71d306f1b40daa5de90",
		function (d) {
			if (d.meta.status === 200) {
				//$('#search-container :input').removeAttr('disabled');
				var k =-1;
				for(var i=0; i<d.data.length;i++) {
					k++;
					var numSections = 0;
					var firstSection = d.data[i].sections[0].section;
					examineSections[k] = {};
					examineSections[k].extraSections = {};
					examineSections[k].course=d.data[i].course;
					examineSections[k].numSections = 0;
					examineSections[k].date=d.data[i].sections[0].date;
					examineSections[k].notes=d.data[i].sections[0].notes;
					examineSections[k].start_time=d.data[i].sections[0].start_time;
					examineSections[k].end_time=d.data[i].sections[0].end_time;
					examineSections[k].location=d.data[i].sections[0].location;
					examineSections[k].section = "all";

					for (var j=1;j<d.data[i].sections.length;j++) {
						if (examineSections[k].location != d.data[i].sections[j].location) {
							examineSections[k].section = firstSection;
							examineSections[k].extraSections[numSections] = {};
							examineSections[k].extraSections[numSections].location = d.data[i].sections[j].location;
							examineSections[k].extraSections[numSections].section = d.data[i].sections[j].section;
							examineSections[k].extraSections[numSections].date = d.data[i].sections[j].date;
							examineSections[k].extraSections[numSections].start_time = d.data[i].sections[j].start_time;
							examineSections[k].extraSections[numSections].end_time = d.data[i].sections[j].end_time;
							numSections++;
							examineSections[k].numSections = numSections;
						}
						else {
							examineSections[k].section = "all";
						}
					}
				}

				var n = 0;
				for (var i=0;i<k;i++){
					if (examineSections[i].numSections == 0 ) {
						courseData[n] = {};
						courseData[n].course=examineSections[i].course;
						courseData[n].date=examineSections[i].date;
						courseData[n].notes=examineSections[i].notes;
						courseData[n].section="all";
						courseData[n].start_time=examineSections[i].start_time;
						courseData[n].end_time=examineSections[i].end_time;
						courseData[n].location=examineSections[i].location;
						courseList.push({
							value: courseData[n].course, 
							label: courseData[n].course,
							date: courseData[n].date,
							start_time: courseData[n].start_time,
							end_time: courseData[n].end_time
						});
						n++;
					} else {
						courseData[n] = {};
						courseData[n].course=examineSections[i].course;
						courseData[n].date=examineSections[i].date;
						courseData[n].section=examineSections[i].section;
						courseData[n].start_time=examineSections[i].start_time;
						courseData[n].end_time=examineSections[i].end_time;
						courseData[n].location=examineSections[i].location;
						if (courseData[n].section == "all") {
							courseList.push({
								value: courseData[n].course, 
								label: courseData[n].course,
								date: courseData[n].date,
								start_time: courseData[n].start_time,
								end_time: courseData[n].end_time
							});
						} else {
							courseList.push({
								value: courseData[n].course + " " + courseData[n].section, 
								label: courseData[n].course+ " " + courseData[n].section,
								date: courseData[n].date,
								start_time: courseData[n].start_time,
								end_time: courseData[n].end_time
							});
						}
						n++;

						for (var o=0;o<examineSections[i].numSections;o++){
							console.log("adding secondary");
							courseData[n] = {};

					if (examineSections[i].course == "FR 192B") {
						console.log(examineSections[i]);
					}
							courseData[n].course=examineSections[i].course;
							courseData[n].date=examineSections[i].extraSections[o].date;
							courseData[n].section=examineSections[i].extraSections[o].section;
							if (courseData[n].section == "081 Online") {
								courseData[n].section = "Online";
							}
							courseData[n].start_time=examineSections[i].extraSections[o].start_time;
							courseData[n].end_time=examineSections[i].extraSections[o].end_time;
							courseData[n].location=examineSections[i].extraSections[o].location;
							courseList.push({
								value: courseData[n].course + " " + courseData[n].section, 
								label: courseData[n].course+ " " + courseData[n].section,
								date: courseData[n].date,
								start_time: courseData[n].start_time,
								end_time: courseData[n].end_time
							});

							n++;
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
	if (csection == "all") {
		csection = "";
	}
	var date = courseData[index].date;
	var start_time = courseData[index].start_time;
	var end_time = courseData[index].end_time;
	var location = courseData[index].location; 
	var ctitle = courseInfo.title;
	var notes = courseData[index].notes;
	
	// Create table.
    var table = document.createElement('table');
	//table.className = 'list-element';
    // Insert New Row for table at index '0'.
    var row1 = table.insertRow(0);
    // Insert New Column for Row1 at index '0'.
    row1.innerHTML = '<tr><th><p class="cname">'+cname+' '+ csection + '</p><p class="ctitle">'+ctitle+'</p><button type="button" class="close" aria-hidden="true" onclick="removeElem(this);">&times;</button></th></tr>';

	var exam = true;
	
	if (notes == 'Exam removed from the schedule. Contact instructor for further information'){
		var row2 = table.insertRow(1);
		var row2col1 = row2.insertCell(0);
		row2col1.innerHTML = '<p>Exam not in the exam schedule. Contact instructor for further information.</p>';
		exam = false;
	} else if (date == '' || notes == 'See https:\/\/uwaterloo.ca\/quest\/help\/students\/how-do-i\/online-exam-schedule') {
		var row2 = table.insertRow(1);
		var row2col1 = row2.insertCell(0);
		row2col1.innerHTML = '<p>The exam details for this online course is not in the exam schedule. See <a href="https:\/\/uwaterloo.ca\/quest\/help\/students\/how-do-i\/online-exam-schedule" target="_blank">https:\/\/uwaterloo.ca\/quest\/help\/students\/how-do-i\/online-exam-schedule</a></p>';
		exam = false;
	} else {
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
