//DOM
var j = document.querySelector.bind(document);
var template;
//APP
var App = {};
App.init = function () {
	//Init
	function handleFileSelect(evt) {
		var files = evt.target.files; // FileList object

                 handleUpload(files[0]);
		//files template
		 template = "" + Object.keys(files).map(function (file) {
			return "<div class=\"file file--" + file + "\">\n     <div class=\"name\"><div>" + files[file].name + "</div></div><br>\n    <div class='progress'> <div class='progress-bar progress bg-success' role='progressbar' style='width: 25%' aria-valuenow='25' aria-valuemin='0' aria-valuemax='100'></div></div>\n     <div class=\"done\">\n\t<a href=\"\" target=\"_blank\">\n      <svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" version=\"1.1\" x=\"0px\" y=\"0px\" viewBox=\"0 0 1000 1000\">\n\t\t<g><path id=\"path\" d=\"M500,10C229.4,10,10,229.4,10,500c0,270.6,219.4,490,490,490c270.6,0,490-219.4,490-490C990,229.4,770.6,10,500,10z M500,967.7C241.7,967.7,32.3,758.3,32.3,500C32.3,241.7,241.7,32.3,500,32.3c258.3,0,467.7,209.4,467.7,467.7C967.7,758.3,758.3,967.7,500,967.7z M748.4,325L448,623.1L301.6,477.9c-4.4-4.3-11.4-4.3-15.8,0c-4.4,4.3-4.4,11.3,0,15.6l151.2,150c0.5,1.3,1.4,2.6,2.5,3.7c4.4,4.3,11.4,4.3,15.8,0l308.9-306.5c4.4-4.3,4.4-11.3,0-15.6C759.8,320.7,752.7,320.7,748.4,325z\"</g>\n\t\t</svg>\n\t\t\t\t\t\t</a>\n     </div>\n    </div>";
		}).join("");

		j("#drop").classList.add("hidden");
		j("footer").classList.add("hasFiles");
		j(".importar").classList.add("active");
		

		Object.keys(files).forEach(function (file) {
			 j(".list-files").innerHTML = template;
		});
                 
	}

	// trigger input
	j("#triggerFile").addEventListener("click", function (evt) {
		evt.preventDefault();
		j("input[type=file]").click();
	});

	// drop events
	j("#drop").ondragleave = function (evt) {
		$("#drop").classList.remove("active");
		evt.preventDefault();
	};
	j("#drop").ondragover = j("#drop").ondragenter = function (evt) {
		j("#drop").classList.add("active");
		evt.preventDefault();
	};
	j("#drop").ondrop = function (evt) {
		j("input[type=file]").files = evt.dataTransfer.files;
		j("footer").classList.add("hasFiles");
		j("#drop").classList.remove("active");
		evt.preventDefault();
	};

	//upload more
	j(".importar").addEventListener("click", function () {
		j(".list-files").innerHTML = "";
		j("footer").classList.remove("hasFiles");
		j(".importar").classList.remove("active");
		setTimeout(function () {
			j("#drop").classList.remove("hidden");
		}, 500);
	});

	// input change
	j("input[type=file]").addEventListener("change", handleFileSelect);
        
         function handleUpload(file){
            
             var formData = new FormData();
             var user_id = getCookie("user_id");
             
             var path = user_id+":"+file.name;
             formData.append('uploads[]', file, path);
            
              $.ajax({
                url: '/uploads',
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function(data){
                    //files template
                    console.log('upload successful!\n' + data);
                },
                xhr: function() {
                  // create an XMLHttpRequest
                  var xhr = new XMLHttpRequest();

                  // listen to the 'progress' event
                  xhr.upload.addEventListener('progress', function(evt) {

                    if (evt.lengthComputable) {
                      // calculate the percentage of upload completed
                      var percentComplete = evt.loaded / evt.total;
                      percentComplete = parseInt(percentComplete * 100);
                      console.log(percentComplete)
                     
                      // update the Bootstrap progress bar with the new percentage
                      $('.progress').text(percentComplete + '%');
                      $('.progress').width(percentComplete + '%');

                      // once the upload reaches 100%, set the progress bar text to done
                      if (percentComplete === 100) {
                         $('.progress-bar').html('Done');
                         $("#uploadBtn").addClass("action-button");
                         $("#uploadBtn").removeAttr("disabled");
                      }

                    }

                  }, false);

                  return xhr;
                }
              });
        }
}();