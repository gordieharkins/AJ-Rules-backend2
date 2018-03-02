// $(document).ready(function () {
//     $('label.tree-toggler').click(function () {
//         $(this).parent().children('ul.tree').toggle(500);
//     });
// });

// <<<<<<< HEAD


// $(document).ready(function () {
//     var ckbox = $('#checkbox');
//     //this will hold reference to the tr we have dragged and its helper
    

// });
// =======
// $(document).ready(function () {
//     var ckbox = $('#checkbox');
//     //this will hold reference to the tr we have dragged and its helper
// });

// var dt_from = "01/01/2017 ";
// var dt_to = "12/29/2017 ";

// $('.slider-time').html(dt_from);
// $('.slider-time2').html(dt_to);
// var min_val = Date.parse(dt_from)/1000;
// var max_val = Date.parse(dt_to)/1000;
// >>>>>>> 54db7cfea4a04acee502f9e24a8afc8bf3b8bbce


// <<<<<<< HEAD

// =======
// $("#slider-range").slider({
//     range: true,
//     min: min_val,
//     max: max_val,
//     step: 10,
//     values: [min_val, max_val],
//     slide: function (e, ui) {
//         var dt_cur_from = new Date(ui.values[0]*1000); //.format("yyyy-mm-dd hh:ii:ss");
//         $('.slider-time').html(formatDT(dt_cur_from));
// >>>>>>> 54db7cfea4a04acee502f9e24a8afc8bf3b8bbce

// var dt_from = "01/01/2017 ";
// var dt_to = "12/29/2017 ";

// $('.slider-time').html(dt_from);
// $('.slider-time2').html(dt_to);
// var min_val = Date.parse(dt_from)/1000;
// var max_val = Date.parse(dt_to)/1000;

// function zeroPad(num, places) {
//   var zero = places - num.toString().length + 1;
//   return Array(+(zero > 0 && zero)).join("0") + num;
// }
// function formatDT(__dt) {
//     var year = __dt.getFullYear();
//     var month = zeroPad(__dt.getMonth()+1, 2);
//     var date = zeroPad(__dt.getDate(), 2);
//     var hours = zeroPad(__dt.getHours(), 2);
//     var minutes = zeroPad(__dt.getMinutes(), 2);
//     var seconds = zeroPad(__dt.getSeconds(), 2);
//     return date + '-' + month + '-' + year ;
// };


// $("#slider-range").slider({
//     range: true,
//     min: min_val,
//     max: max_val,
//     step: 10,
//     values: [min_val, max_val],
//     slide: function (e, ui) {
//         var dt_cur_from = new Date(ui.values[0]*1000); //.format("yyyy-mm-dd hh:ii:ss");
//         $('.slider-time').html(formatDT(dt_cur_from));

//         var dt_cur_to = new Date(ui.values[1]*1000); //.format("yyyy-mm-dd hh:ii:ss");                
//         $('.slider-time2').html(formatDT(dt_cur_to));
//     }
// });

//$('#clickme').click(function() {
//    var $slider = $('.mydiv');
//    $slider.animate({
//      right: parseInt($slider.css('right'),10) == -200 ?
//       0 : -200
//    });
//  });

// <<<<<<< HEAD





// // $(document).ready(function () {
// //     var expanded = false;
// //     $("#drawer-handle").click(function () {
// //         if (expanded = !expanded) {
// //             $("#drawer-content").animate({ "margin-right": 0 },    "slow");
// //         } else {
// //             $("#drawer-content").animate({ "margin-right": -700 }, "slow");
// //         }
// //     });
// // });
// =======
// $(document).ready(function () {
//     var expanded = false;
//     $("#drawer-handle").click(function () {
//         if (expanded = !expanded) {
//             $("#drawer-content").animate({ "margin-right": 0 },    "slow");
//         } else {
//             $("#drawer-content").animate({ "margin-right": -700 }, "slow");
//         }
//     });
// });
// >>>>>>> 54db7cfea4a04acee502f9e24a8afc8bf3b8bbce

// $(document).mouseup(function (e) {
//     var popup = $(".box-one");
//     if (!$('.box-one').is(e.target) && !popup.is(e.target) && popup.has(e.target).length == 0) {
//         popup.hide(200);
//     }
// });

//  $(document).mouseup(function (e) {
//     var popup = $(".box-two");
//     if (!$('.box-two').is(e.target) && !popup.is(e.target) && popup.has(e.target).length == 0) {
//         popup.hide(200);
//     }
// });

// <<<<<<< HEAD
// $(document).on('click', '.dropdown-menu', function (e) {
//                                 if ($(this).hasClass('keep-open-on-click')) {
//                                     e.stopPropagation();
//                                 }
//                             });
 
//  $(document).ready(function () {
//             $("#myModal").modal('show');
// });
// =======
// $(document).on('click', '.dropdown-menu', function (e) {
//     if ($(this).hasClass('keep-open-on-click')) {
//         e.stopPropagation();
//     }
// });
 
// $(document).ready(function () {
//     $("#myModal").modal('show');
// });
// >>>>>>> 54db7cfea4a04acee502f9e24a8afc8bf3b8bbce
