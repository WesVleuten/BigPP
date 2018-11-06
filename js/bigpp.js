var player = {};
var playerId = null;
var playerList = [];
var songs = {};
var songList = [];
var url = "";
var count = 0;
var newHtml = "";
var playerName = "Player 1";
var needPlayer = true;
var count = 0;

var playerIdPrefix = 'https://scoresaber.com/u/';

$(document).ready(function() {
  $("#loading").hide();
  $(".limiter").hide();

  $.ajax({
    type: "GET",
    url: "https://raw.githubusercontent.com/DuoVR/PPFarming/master/js/songlist.tsv",
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

  var search = window.location.search; // get search parameters
  if (search.length > 0) {
    var parameters = {};
    var parametersStr = search.slice(1);
    var keyvaluepairs = parametersStr.split('&');
    for (var i = 0; i < keyvaluepairs.length; i++) {
      var keyvalue = keyvaluepairs[i].split('=');
      if (keyvalue.length != 2) {
        continue;
      }
      parameters[keyvalue[0]] = keyvalue[1];
    }
    if (parameters.u) {
      playerId = parameters.u;
      $('form input.playerForm').val(playerIdPrefix + playerId);
      getData();
    }
  }

});

function gotoProfile() {
  var givenUrl = $('form input.playerForm').val();

  var testRegex = /https:\/\/scoresaber.com\/u\/([0-9]*)/g;

  if (!testRegex.test(givenUrl)) {
    alert('Invalid input');
    return;
  }

  var userId = givenUrl.replace('https://scoresaber.com/u/', '');

  var url = window.location.origin;
  url += window.location.pathname;
  url += '?u=' + userId;
  window.location.href = url;
}

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
  for (let i = 1; i < 21; i++) {
    var url = playerIdPrefix + playerId + '&page=' + i.toString() + '&sort=1';

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
        var songTitle = song;
        song = song.split(' ').join('');
        var chars = song.split("");
        chars.sort();
        songChars = chars.join();
        var pp = parseFloat($(this).find("th.score span.scoreTop.ppValue").text());

        var songObj = {
          "song": songTitle,
          "pp": pp
        }

        player[songChars] = songObj;
      });
    }).done(function() {
      count++;
      if (count == 20) {
        callback();
      }
    });
  }
}

function organize() {
  var keys = Object.keys(player);

  $("#playerName").html(playerName);

  for (let i = 0; i < songList.length; i++) {
    var song = songList[i];

    var songTitle = player[song];
    var pp = 0.00;
    if (songTitle) {
      pp = songTitle.pp;
      songTitle = songTitle.song;
    } else {
      songTitle = songs[song].song;
    }
    var maxPP = songs[song];
    if (maxPP) {
      maxPP = maxPP.pp;
    }
    var diff = maxPP;

    if (pp) {
      diff = maxPP - pp;
    } else {
      pp = "0.00";
    }

    if (diff) {
      diff = diff.toFixed(2);
    }

    var songObj = {
      "song": songTitle,
      "playerPP": pp,
      "maxPP": maxPP,
      "pp": diff
    }

    playerList.push(songObj);
  }

  playerList.sort(function(a, b) {
    return b.pp - a.pp
  });

  var tableHtml = $('tbody');
  tableHtml.html("");
  for (let x = 0; x < playerList.length; x++) {
    var obj = playerList[x];
    var newHtml = '<tr class="row100 body"><td class="cell100 column1">';
    newHtml += obj.song;
    newHtml += '</td><td class="cell100 column2">';
    newHtml += obj.playerPP.toString();
    newHtml += '</td><td class="cell100 column3">';
    newHtml += obj.maxPP.toString();
    newHtml += '</td><td class="cell100 column4">';
    newHtml += "+" + obj.pp.toString();
    newHtml += "</td></tr>"
    tableHtml.append(newHtml);
  }

  $("#loading").hide();
  $(".limiter").show();
}

function readData(allText) {
  var rows = allText.split(/\r\n|\n/);
  for (let i = 0; i < 160; i++) {
    var row = rows[i].split("\t");
    var song = row[0];
    song += " " + row[2];
    var songTitle = song;
    song = song.split(' ').join('');
    var chars = song.split("");
    chars.sort();
    song = chars.join();
    var songObject = {
      "song": songTitle,
      "pp": parseFloat(row[1])
    }
    songs[song] = songObject
    songList.push(song);
  }
}
