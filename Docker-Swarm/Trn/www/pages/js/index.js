$(document).on('nifty.ready', function () {
    document.querySelector('title').innerHTML = 'TRN | INDEX';
    $('#page-title > h1.page-header').text('Index');
    $('#page-navigate > .breadcrumb-level-1').remove();
    $('#page-navigate > .breadcrumb-level-2').remove();
    $('#page-navigate > .breadcrumb-level-3').remove();
});
