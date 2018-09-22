var player = {};
var songs = {};
var url = "";
var count = 0;
var newHtml = "";
var playerName = "Player 1";
var needPlayer = true;
var count = 0;

$(document).ready(function() {
  $("#loading").hide();
  $.ajax({
    type: "GET",
    url: "songs.csv",
    dataType: "text",
    success: function(data) {console.log("TEST!");}
  });

  $.ajaxPrefilter(function(options) {
    if (options.crossDomain && jQuery.support.cors) {
      var http = (window.location.protocol === 'http:' ? 'http:' : 'https:');
      options.url = http + '//cors-anywhere.herokuapp.com/' + options.url;
    }
  });
});

function getData() {
  player = {};
  union = [];
  finalUnion = [];
  count = 0;
  needPlayer1 = true;
  needPlayer2 = true;
  $("#loading").show();
  getSongs(organize);
}

function getSongs(callback) {
  for (let i = 1; i < 11; i++) {
    var url = $('form input.playerForm').val() + '&page=' + i.toString() + '&sort=1';

    $.get(url, function(data) {
      var html = $(data);
      if (needPlayer) {
        var playerNameWithSpace = html.find("h5.title.is-5 a").html();
        playerName = $.trim(playerNameWithSpace);
        needPlayer = false;
      }
      var table = html.find("table");
      var tbody = table.find("tbody");
      tbody.children().each(function() {
        var song = $(this).find("th.song div div a span.songTop.pp").text();
        var pp = parseFloat($(this).find("th.score span.scoreTop.ppValue").text());

        player[song] = pp;
      });
      count++;
      if (count > 9) {
        callback();
      }
    });
  }
}

function organize() {
  console.log(player);
  count++;
  if (count > 1) {
    $("#playerName").html(playerName);
    calculate();
  }
}

function calculate() {
  console.log("CALCULATE");
}
