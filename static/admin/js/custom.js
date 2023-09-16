$(".cstm-toggle").click(function() {
    $(".sidebar").toggleClass("hide");
    $("header").toggleClass("show-full");
    $(".content-wrapper").toggleClass("show-full");
    $(".notification-wrap").toggleClass("show-note");
});
$(".notification-wrap").click(function() {
    $(".notification-outer-box").toggleClass("show-note");
});
$(".search-wrap").click(function() {
    $(".search-wrap").addClass("show-search");
});