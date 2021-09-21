$.ajaxSetup({
    beforeSend: function beforeSend(xhr, settings) {
        function getCookie(name) {
            let cookieValue = null;

            if (document.cookie && document.cookie !== '') {
                const cookies = document.cookie.split(';');

                for (let i = 0; i < cookies.length; i += 1) {
                    const cookie = jQuery.trim(cookies[i]);

                    // Does this cookie string begin with the name we want?
                    if (cookie.substring(0, name.length + 1) === (`${name}=`)) {
                        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                        break;
                    }
                }
            }

            return cookieValue;
        }

        if (!(/^http:.*/.test(settings.url) || /^https:.*/.test(settings.url))) {
            // Only send the token to relative URLs i.e. locally.
            xhr.setRequestHeader('X-CSRFToken', getCookie('csrftoken'));
        }
    },
});

$(document).on("click", ".js-toggle-modal", function(e){
    e.preventDefault();
    console.log("i am clicked");
    $(".js-modal").toggleClass("hidden");
})
.on("click", ".js-submit", function(e){
    e.preventDefault();
    console.log("submit me");    
    const $btn = $(this);
    const $textarea = $(".js-post-text");
    const text = $textarea.val();

    if(!text.length){
        false;
    }
    
    $(".js-modal").addClass("hidden");
    $(".js-post-text").val("");
    
    $btn.prop("disabled", true).text("Posting!");
    $.ajax({
        type: "POST",
        url: $textarea.data("post-url"),
        data: {
            text: text,
        },
        success: (dataHtml) => {
            $(".js-modal").addClass("hidden");
            $("#posts-container").prepend(dataHtml);
            $btn.prop("disabled", false).text("New Post");
            $(".js-post-text").val("");
        },
        error: (error) => {
            console.warn(error);
            $btn.prop("disabled", true).text("Error");
        }


    });
})
.on("click", ".js-follow", function(e) {
    e.preventDefault();
    const action = $(this).attr("data-action")

    $.ajax({
        type: 'POST',
        url: $(this).data("url"),
        data: {
            action: action,
            username: $(this).data("username"),
        },
        success: (data) => {
            console.log(data);
            $(".js-follow-text").text(data.wording)
            if(action == "follow") {
                // Change wording to unfollow
                console.log("DEBUG", "unfollow")
                $(this).attr("data-action", "unfollow")
            } else {
                // The opposite
                console.log("DEBUG", "follow")
                $(this).attr("data-action", "follow")
            }
            $(".js-total-followers").text(data.follower_count)
        },
        error: (error) => {
            console.warn(error)
        }
    });
})