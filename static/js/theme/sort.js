function sortTable(no) {
  var table, rows, switching, i, x, y, shouldSwitch;
  table = document.getElementById("myTable");
  switching = true;

  while (switching) {
    switching = false;
    rows = table.rows;
    for (i = 1; i < (rows.length - 1); i++) {
      shouldSwitch = false;

      x = rows[i].getElementsByTagName("TD")[no];
      y = rows[i + 1].getElementsByTagName("TD")[no];


        try {
            var xValue = $(x).find('a').html().toLowerCase();
            var yValue = $(y).find('a').html().toLowerCase();
        }
        catch(e) {
            var xValue = x.innerHTML.toLowerCase();
            var yValue = y.innerHTML.toLowerCase();
        }
      if (xValue > yValue) {
        shouldSwitch = true;
        break;
      }
    }
    if (shouldSwitch) {
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
    }
  }
}


function geturl(ele) {
  var url = new URL(window.location.href);
  var search_params = url.searchParams;
  search_params.set('ordering', ele);
  url.search = search_params.toString();
  var new_url = url.toString();
  return new_url
}

function getpage(ele) {
  var url = new URL(window.location.href);
  var search_params = url.searchParams;
  search_params.set('page', ele);
  url.search = search_params.toString();
  var new_url = url.toString();
  return new_url
}