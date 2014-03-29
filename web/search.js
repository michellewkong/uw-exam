var courseData = {};

load = function () {
      $.getJSON("https://api.uwaterloo.ca/v2/terms/1139/examschedule.json?key=211902c1630ca71d306f1b40daa5de90",
        function (d) {
          if (d.meta.status === 200) {
            for(var i=0; i<d.data.length;i++) {
				courseData[i] = {};
            	courseData[i].course=d.data[i].course;
            	courseData[i].date=d.data[i].sections[0].date;
            	courseData[i].start_time=d.data[i].sections[0].start_time;
            	courseData[i].end_time=d.data[i].sections[0].end_time;
            	courseData[i].location=d.data[i].sections[0].location;
            }
			console.log(courseData);
          } else {
            console.log("Failed to read course data." + JSON.stringify(d.meta));
          }
        });
    }