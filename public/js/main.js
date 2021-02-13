$(document).ready(function () {
    $('.delete-article').on('click', function (e) {
        $target = $(e.target)
        const id = $target.attr('data-id')
        $.ajax({
            type: 'DELETE',
            url: '/article/' + id,
            success: function (response) {
                alert('Article supprimé')
                window.location.href = '/'
            },
            error: function (error) {
                console.log(err)
            }
        })
    })
})