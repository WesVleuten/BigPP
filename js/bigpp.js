var player = {};
var playerList = [];
var songs = {};
var songList = [];
var url = "";
var count = 0;
var newHtml = "";
var playerName = "Player 1";
var needPlayer = true;
var count = 0;

$(document).ready(function() {
  $("#loading").hide();
  $("#playerscores").hide();

  $.ajax({
    type: "GET",
    url: "https://raw.githubusercontent.com/DuoVR/BigPP/master/js/songs.csv",
    dataType: "text",
    success: function(data) {
      readData(data);
    }
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
  playerList = [];
  count = 0;
  needPlayer = true;
  $("#loading").show();
  getSongs(organize);
  var tableHtml = $("table.playerdata tbody");
  tableHtml.html("");
}

function getSongs(callback) {
  for (let i = 1; i < 13; i++) {
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
        song = $.trim(song);
        var pp = parseFloat($(this).find("th.score span.scoreTop.ppValue").text());

        player[song] = pp;
      });
    }).done(function() {
      count++;
      if (count == 12) {
        callback();
      }
    });
  }
}

function organize() {
  var keys = Object.keys(player);
  var illness = "";
  var heaven = "";
  var ultimate = "";
  var happy = "";
  for (let r = 0; r < keys.length; r++) {
    key = keys[r];
    if (key.indexOf("HE4VEN") != -1) {
      heaven = key;
    }
    if (key.indexOf("iLLness") != -1) {
      illness = key;
    }
    if (key.indexOf("Mystikmol - Ultimate Ascension") != -1) {
      ultimate = key;
    }
    if (key.indexOf("Mystikmol - Happy Synthesizer") != -1) {
      happy = key;
    }
  }

  $("#playerName").html(playerName);

  for (let i = 0; i < songList.length; i++) {
    var song = songList[i];

    var maxPP = songs[song];
    var pp = player[song];
    var diff = maxPP;

    if (song.indexOf("HE4VEN") != -1) {
      song = heaven;
      pp = player[song];
    }
    if (song.indexOf("iLLness") != -1) {
      song = illness;
      pp = player[song];
    }
    if (song.indexOf("Mystikmol - Ultimate Ascension") != -1) {
      song = ultimate;
      pp = player[song];
    }
    if (song.indexOf("Mystikmol - Happy Synthesizer") != -1) {
      song = happy;
      pp = player[song];
    }

    if (pp) {
      diff = maxPP - pp;
    } else {
      pp = 0;
    }

    var songObj = {
      "song": song,
      "playerPP": pp.toFixed(2),
      "maxPP": maxPP.toFixed(2),
      "pp": diff.toFixed(2)
    }

    playerList.push(songObj);
  }

  playerList.sort(function(a, b) {
    return b.pp - a.pp
  });

  var tableHtml = $("table.playerdata tbody");
  tableHtml.html("<tr><th style='width:55%'>Song Title</th><th style='width:15%'>Your PP</th><th style='width:15%'>Biggest PP</th><th style='width:15%'>+ PP</th>");

  for (let x = 0; x < playerList.length; x++) {
    var obj = playerList[x];
    var newHtml = "<tr><th>";
    newHtml += obj.song;
    newHtml += "</th><th>";
    newHtml += obj.playerPP.toString();
    newHtml += "</th><th>";
    newHtml += obj.maxPP.toString();
    newHtml += "</th><th>";
    newHtml += "+ " + obj.pp.toString();
    newHtml += "</th></tr>"
    tableHtml.append(newHtml);
  }

  $("#loading").hide();
  $("#playerscores").show();
}

function readData(allText) {
  var rows = allText.split(/\r\n|\n/);
  for (let i = 0; i < 100; i++) {
    rows[i] = rows[i].split(",");
    var song = rows[i][0];
    for (let j = 1; j < rows[i].length - 2; j++) {
      song += "," + rows[i][j];
    }
    var songParts = song.split("-");
    finalSong = songParts[songParts.length - 1] + " ";
    for (let q = 0; q < songParts.length - 1; q++) {
      finalSong += "-" + songParts[q];
    }
    song = $.trim(finalSong);
    if (song.indexOf("Ange") != -1) {
      song = "ke-ji feat. Nanahira - Ange du Blanc Pur";
    }
    song += " " + rows[i][rows[i].length - 1];
    songs[song] = parseFloat(rows[i][rows[i].length - 2]);
    songList.push(song);
  }
}
