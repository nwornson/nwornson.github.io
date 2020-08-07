

for (var i = 0; i < 32; i++){
    var src = "Images/MPLS_DESTRUCTION/" + 'MPLS_DESTRUCTION' + (i+1) + '.jpg';
    var img = new Image(); 
    img.src = src;

  
  
    console.log("Image ready to append");
    
    document.getElementById("mpls_dest").appendChild(img);
    
  }
  
  
  for (var i = 0; i < 72; i++){
    var src = "Images/MPLS_ART/" + 'MPLS_ART' + (i+1) + '.jpg';
    var img = new Image(); 
    img.src = src;
    img.data-highres = src

  
    console.log("Image ready to append");
    
    document.getElementById("mpls_art").appendChild(img);
    
  }
  
  for (var i = 0; i < 7; i++){
    var src = "Images/STP_DESTRUCTION/" + 'STP_DESTRUCTION' + (i+1) + '.jpg';
    var img = new Image(); 
    img.src = src;

  
    console.log("Image ready to append");
    
    document.getElementById("stp_dest").appendChild(img);
    
  }
  
  for (var i = 0; i < 32; i++){
    var src = "Images/STP_ART/" + 'STP_ART' + (i+1) + '.jpg';
    var img = new Image(); 
    img.src = src;


    console.log("Image ready to append");
    
    document.getElementById("stp_art").appendChild(img);
    
  }
  