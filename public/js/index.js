
var $exampleList = $("#example-list");


  function getHighScore(id) {
    $.get("/api/scores/"+id, function(data) {
  
      console.log(data);
      var $examples = data.map(function(example) {
        var $a = $("<a>")
          .text(example.score)
          .attr("href", "/example/" + example.UserId);
  
        var $li = $("<li>")
          .attr({
            class: "list-group-item",
            "data-id": example.UserId
          })
          .append($a);
  
  
        return $li;
      });
  
      $exampleList.empty();
      $exampleList.append($examples);
      
    });
  };





