 $(function(){
     
     var admin_id = getCookie("admin_id");
     if(admin_id == null){
         location.href = "/admin_login";
     }
  
     
    $.ajax({
        type: "POST",
        url: "getAllUsers",
        data: {}
    }).done(function (res) {
        if (res.success == 1) {
            loadTable(res.data);
        } else {
            alert("No data !!");
        }
    });
    var completed_r = {value:0,label:'Completed'};
    var not_completed_r = {value:0,label:'Not Completed'};
    var upload_photo_r = {value:0,label:'Uploaded Photo'};
    var setup_2fa_r = {value:0,label:'Setup 2FA'};
    var addedBank_r = {value:0,label:'Added Bank Account'};
    var verify_identity = {value:0,label:'Verify Identity'};
    var all = 0; 
    
    
    function parseData(rows){
        
       
        var all = rows["number_of_users"];
        var setup_2fa = rows["setup_2fa"];
        var add_bank_account = rows["add_bank_account"];
        var verify_identity_r =rows["verify_identity"];
        var upload_docs = rows["upload_docs"];
        var complete = rows["complete"];
        
         
          addedBank_r = {value:Math.round(add_bank_account/all * 100),label:"Added Bank Account"};
          upload_photo_r = {value:Math.round(upload_docs/all * 100),label:"Uploaded Photo"};
          setup_2fa_r = {value:Math.round(setup_2fa/all * 100),label:"Setup 2FA"};
          completed_r = {value:Math.round(complete/all * 100),label:"Completed"};
          verify_identity = {value:Math.round(verify_identity_r/all * 100),label:"Verify Identity"};
       
        
        $("#allUsers").text(all);
        $("#completed").text(completed_r.value+"%");
        var not_complete = 100 - parseInt(completed_r.value);
        $("#not_complete").text(not_complete+"%");
        $("#added_account").text(addedBank_r.value+"%");
        var data = [
            completed_r,
            not_completed_r,
            upload_photo_r,
            setup_2fa_r,
            addedBank_r,
            verify_identity
        ];
        loadData(data);
    }
    
    function loadData(allData){
        
        Morris.Donut({
            element: 'graph1',
            data: allData,
            backgroundColor: '#EDF2F4',
            labelColor: '#50514F',
            colors: [
                '#21ba45',
              '#FFE066',
              '#FF5714',
              '#50514F',
              '#247BA0',
              '#51c4d2'
            ],
         resize: true, //defaulted to true
         formatter: function (x) { return x + "%" }
    });

    }
    
    function loadTable(data){
        
        for(var i = 0; i < data.length; i++){
            
               var tr = document.createElement("tr");
               
                var rows = data[i];
                var user_id = rows["user_id"];
              //  var username = rows["username"];
                var email = rows["email"];
                var time_created = rows["time_created"];
                var number_of_users = rows["number_of_users"];
                var path = rows["path"]
                var setup_2fa = rows["setup_2fa"] == null ? "N" : "Y";
                var add_bank_account = rows["add_bank_account"]  == null ? "N" : "Y";
                var verify_identity =rows["verify_identity"]  == null ? "N" : "Y";
                var upload_docs = rows["upload_docs"]  == null ? "N" : "Y";
                var complete = rows["complete"]  == null ? "N" : "Y";
                var country = rows["country"]  == null ? " " :rows["country"];
                var state = rows["state"] == null ? " " :rows["state"];
                var fname = rows["fname"] == null ? " " :rows["fname"];
                var lname = rows["lname"]  == null ? " " :rows["lname"];
                var mname = rows["mname"]  == null ? " " :rows["mname"];
                var city = rows["city"]  == null ? " " :rows["city"];
                var dob = rows["dob"]  == null ? " " :rows["dob"];
                var zip = rows["zip"]  == null ? " " :rows["zip"];
                var id_type = rows["id_type"]  == null ? " " :rows["id_type"];
                var address = rows["address"]  == null ? " " :rows["address"];
                var occupation = rows["occupation"]  == null ? " " :rows["occupation"];
                var unit = rows["unit"]  == null ? " " :rows["unit"];
                
              //  $(tr).append("<td>"+username+"</td>");
                $(tr).append("<td>"+email+"</td>");
            
                $(tr).append("<td>"+fname+"</td>");
                $(tr).append("<td>"+mname+"</td>");
                $(tr).append("<td>"+lname+"</td>"); 
                 $(tr).append("<td>"+dob+"</td>");
                $(tr).append("<td>"+country+"</td>");
                $(tr).append("<td>"+state+"</td>");
                $(tr).append("<td>"+city+"</td>");
                $(tr).append("<td>"+zip+"</td>");
                $(tr).append("<td>"+address+"</td>");
                $(tr).append("<td>"+unit+"</td>");
                $(tr).append("<td>"+occupation+"</td>");
                $(tr).append("<td>"+id_type+"</td>");
                $(tr).append("<td>"+setup_2fa+"</td>");
                $(tr).append("<td>"+add_bank_account+"</td>");
                $(tr).append("<td>"+verify_identity+"</td>");
                $(tr).append("<td>"+upload_docs+"</td>");
                $(tr).append("<td>"+complete+"</td>");
                $(tr).append("<td>"+time_created+"</td>");
                $(tr).append("<td><a class='btn btn-sm btn-primary' href='javascript:download();'>Download Upload</a></td>");
                $("#userTBody").append($(tr));
             //   href='/photos/"+path+"'
        
    }
    }
    function download(filename) {
        if (typeof filename==='undefined') filename = ""; // default
        value = document.getElementById('textarea_area').value;

        filetype="text/*";
        extension=filename.substring(filename.lastIndexOf("."));
        for (var i = 0; i < extToMIME.length; i++) {
            if (extToMIME[i][0].localeCompare(extension)==0) {
                filetype=extToMIME[i][1];
                break;
            }
        }


        var pom = document.createElement('a');
        pom.setAttribute('href', 'data: '+filetype+';charset=utf-8,' + '\ufeff' + encodeURIComponent(value)); // Added BOM too
        pom.setAttribute('download', filename);


        if (document.createEvent) {
            if (navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') > 0) { // IE
                blobObject = new Blob(['\ufeff'+value]);
                window.navigator.msSaveBlob(blobObject, filename);
            } else { // FF, Chrome
                var event = document.createEvent('MouseEvents');
                event.initEvent('click', true, true);
                pom.dispatchEvent(event);
            }
        } else if( document.createEventObject ) { // Have No Idea
            var evObj = document.createEventObject();
            pom.fireEvent( 'onclick' , evObj );
        } else { // For Any Case
            pom.click();
        }

    }

    
  
});
