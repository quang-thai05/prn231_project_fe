var userId, postId;
$(document).ready(() => {
    var token = localStorage.getItem("token");

    if (token != null) {
    let decoded = jwt_decode(token);
    let userRole =
        decoded[
        "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ];

    userId = decoded[
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/sid"
    ];
    }

    let urlParam = new URLSearchParams(window.location.search);
    postId = urlParam.get("id");

    loadDataComment();

})

var commentDto;

function AddComment(model) {
    var userReplyId = model.getAttribute("data-id-reply");
    var content = $("#contentComment").val();
    commentDto = {
        content: content,
        postId: postId,
        userId: userId,
        replyUserId: userReplyId
    }
    console.log(token)
    if (content != "") {
        if (token !== null) {
            $.ajax({
                url: "https://localhost:7065/api/Comment/AddComment",
                method: "POST",
                contentType: "application/json",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem('token')
                },
                data: JSON.stringify(commentDto),
                success: function (response) {
                    SlimNotifierJs.notification(
                        "success",
                        "Comment Successfully!",
                        response,
                        3000
                    );
                    $("#contentComment").val("");
                    loadDataComment();
                    refesh();
                    $("#replyComment").empty();

                },
                error: function (xhr, status, error) {
                    SlimNotifierJs.notification(
                        "error",
                        "Error",
                        xhr.response,
                        3000
                    );
                },
            });
        } else {
            SlimNotifierJs.notification(
                "error",
                "Error",
                "Please login!!",
                3000
            );
        }
    } else {
        SlimNotifierJs.notification(
            "error",
            "Error",
            "Input comment please",
            3000
        );
    }
}
function replyComment(model) {
    var userReplyId = model.getAttribute("data-user-reply-id");
    if (token !== null) {
        $.ajax({
            url: "https://localhost:7065/api/Comment/getUserReplyComment/" + userReplyId,
            method: "GET",
            contentType: "application/json",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem('token')
            },
            success: function (response) {
                $("#replyComment").empty();
                $("#replyComment").append(`<p> Reply comment:   ${response.username} </p>` );

                $("#btnUpdate").empty();
                $("#btnUpdate").append(
                    `<button class="btn btn-primary" data-id-reply=${userReplyId} onclick="AddComment(this)"  type="button">Comment</button>
                    <button style="margin-left: 5px;" class="btn btn-delete" onclick="refesh()"  type="button">Cancel</button>
                    `
                )
            },
            error: function (xhr, status, error) {
                SlimNotifierJs.notification(
                    "error",
                    "Error",
                    "Please login!!",
                    3000
                );
            },
        });
    } else {
        SlimNotifierJs.notification(
            "error",
            "Error",
            "Please login!!",
            3000
        );
    }
}

var page = 1;
var pageSize = 3;
function loadDataComment() {
    $.ajax({
        url: "https://localhost:7065/api/Comment/GetAllCommentByPostId/" + postId + "?page=" + page + "&pageSize=" + pageSize,
        method: "GET",
        contentType: "application/json",
        success: function (response) {
            var data = response.results;
            var totalPages = response.totalPage;
            let commentContent = '';
            $('#totalComment').empty();
            $('#totalComment').append(response.totalCount + " Comments");
            data.map((item, index) => {
                commentContent += `
                <div class="media">
                    <a
                        class="media-left"
                        href="../author/tech-author.html?creatorId=${item?.userId}"
                    >
                        <img
                            src="../images/${item?.imageUser}"
                            alt=""
                            style="height: 50%; width: 50%; border: solid 1px black"
                            class="rounded-circle"
                        />
                    </a>	
                    <div class="media-body">
                        <h4
                            class="media-heading user_name"
                        >
                            ${item?.userName}
                            <small>${item?.createdDate}</small>
                        </h4>
                        <p>
                            <b> ${item?.userNameReply != null ?  item?.userNameReply+" "  : ""}
                            </b>
                            ${item?.content}
                        </p>
                        <div id="btnCommentUpdate">
                        <button
                            data-user-reply-id=${item.userId}
                            onclick="replyComment(this)"
                            class="btn btn-primary btn-sm"
                        >
                            Reply
                        </button>
                        ${ item?.userId === userId ? 
                            `<button
                                class="btn btn-primary btn-sm"
                                data-comment-id=${item.id}
                                data-comment-content="${item?.content}"
                                data-reply=${item.replyUserId}
                                onclick="updateComment(this)"
                            >
                                Update
                            </button>
                            
                            <button
                                data-comment-id=${item.id}
                                onclick="deleteComment(this)"
                                class="btn btn-primary btn-sm"
                            >
                                Delete
                            </button>` : ``} 
                        </div>                
                    </div>
                </div>`

            })
            $('#idComment').html(commentContent);


            var pagination = $("#pagination");
            pagination.empty();

            var startPage = Math.max(1, page - 2);
            var endPage = Math.min(startPage + 4, totalPages);

            if (startPage > 1) {
                pagination.append(
                    `<li class="page-item"><a class="page-link">...</a></li>`
                )
            }

            for (var i = startPage; i <= endPage; i++) {
                pagination.append(
                    `<li class="page-item"><a class="page-link">${i}</a></li>`
                )
            }

            if (endPage < totalPages) {
                pagination.append(
                    `<li class="page-item"><a class="page-link">...</a></li>`
                )
            }

            pagination.on("click", "a", function () {
                var clickedPage = parseInt($(this).text());

                if (isNaN(clickedPage)) {
                    if ($(this).text() === "...") {
                        if ($(this).parent().index() === 0) {
                            page = Math.max(1, page - 5);
                        } else {
                            page = Math.min(page + 5, totalPages);
                        }
                    }
                } else {
                    page = clickedPage;
                }
                loadDataComment();
            });


        },
        error: function (xhr, status, error) {

        },
    });
}

function deleteComment(model) {
    var commentId = model.getAttribute("data-comment-id");
    if (confirm("Delete this comment??") == true) {
    $.ajax({
        url: "https://localhost:7065/api/Comment/DeleteComment/" + commentId, 
        method: "DELETE",
        contentType: "application/json",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem('token')
        },
        success: (response) => {
            SlimNotifierJs.notification(
                "success",
                "Success",
                "Delete success",
                3000
            );
            loadDataComment();
        },
        error: function (xhr, status, error) {
            SlimNotifierJs.notification(
                "error",
                "Error",
                "Failed to delete",
                3000
            );
        },
    });
    } else {
    }
}
var commentId;
function updateComment(model) {
    commentId = model.getAttribute("data-comment-id");
    var replyUserId = model.getAttribute("data-reply");
    var contentUpdate = model.getAttribute("data-comment-content");
    $("#contentComment").val(contentUpdate);

    $("#btnUpdate").empty();
    $("#btnUpdate").append(
        `<button class="btn btn-primary" data-id=${replyUserId} onclick="update(this)"  type="button">Comment</button>
        <button style="margin-left: 5px;" class="btn btn-delete" onclick="refesh()"  type="button">Cancel</button>`
    )
}

function update(model) {
    var replyUserId = model.getAttribute("data-id");
    var updateComment = {
        userId: userId,
        postId: postId,
        content: document.getElementById("contentComment").value,
        replyUserId: replyUserId
    }
    console.log(updateComment.replyUserId)
    $.ajax({
        url: "https://localhost:7065/api/Comment/UpdateComment/" + commentId, 
        method: "PUT",
        contentType: "application/json",
        data: JSON.stringify(updateComment),
        headers: {
            "Authorization": "Bearer " + localStorage.getItem('token')
        },
        success: (response) => {
            SlimNotifierJs.notification(
                "success",
                "Success",
                "Update success",
                3000
            );
            loadDataComment();
            refesh();
    
        },
        error: function (xhr, status, error) {
            SlimNotifierJs.notification(
                "error",
                "Error",
                "Failed to update",
                3000
            );
        },
    });
}

function refesh() {
    $("#contentComment").val("");
    $("#btnUpdate").empty();
    $("#btnUpdate").append(
        `<button class="btn btn-primary" onclick="AddComment(this)" id="btnComment" type="button">Comment</button>`
    )
    $("#replyComment").empty();
}
