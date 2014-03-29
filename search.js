// how to declare array? 
var courseData = new Array();

load = function () {
      $.getJSON("https://api.uwaterloo.ca/v2/terms/1139/examschedule.json?key=211902c1630ca71d306f1b40daa5de90",
        function (d) {
		alert("running function :)");
          if (d.meta.status === 200) {
            var data = d.data;
            alert(data.length);
            for(var i=0; i<data.length;i++) {
            	courseData[i].course=data[i].course;
            	courseData[i].date=data[i].sections.date;
            	courseData[i].start_time=data[i].sections.start_time;
            	courseData[i].end_time=data[i].sections.end_time;
            	courseData[i].location=data[i].sections.location;
            	alert(courseData[i].course);
            }
          } else {
            console.log("Failed to read course data." + JSON.stringify(d.meta));
          }
        });
    }