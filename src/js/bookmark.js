var token = localStorage.getItem("token")
if (token != null) {
    var decoded = jwt_decode(token)
    var userId = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/sid"];

    $(document).ready(() => {
        var page = 1;
        var pageSize = 10;

        function loadBookmarkList() {
            $.ajax({
                url: "https://localhost:7065/api/Bookmark/GetBookmarksByUserId?userId=" + userId + "&page=" + page + "&pageSize=" + pageSize,
                type: "GET",
                contentType: "application/json",
                headers: {
                    Authorization: "Bearer " + token
                },
                success: function (response) {
                    var data = response.posts;
                    var totalPages = response.totalPages;
                    var postList = $("#post-list");
                    postList.empty();
                    postList.append(
                        data.map(
                            (post) =>
                                `<div class="blog-box row">
                                    <div class="col-md-4">
                                        <div class="post-media">
                                            <a href="../Post/tech-single.html?id=${post.id}" title="">
                                                <img src="${post.image}" alt="${post.title}" class="img-fluid">
                                                <div class="hovereffect"></div>
                                            </a>
                                        </div>
                                    </div>
            
                                    <div class="blog-meta big-meta col-md-8">
                                        <h4><a href="../Post/tech-single.html?id=${post.id}" title="">${post.title}</a></h4>
                                        <p>${post.description}</p>
                                        <small class="firstsmall">
                                            <a class="bg-orange" href="../Category/tech-category-01.html?cateId=${post.categoryId}" title="">${post.categoryName}</a>
                                        </small>
                                        <small><a href="../Post/tech-single.html?id=${post.id}" title="">${post.createdAt}</a></small>
                                        <small>
                                            <a href="../author/tech-author.html?creatorId=${post.creatorId}" title="">by ${post.creatorName}</a>
                                        </small>
                                        <small>
                                            <a href="../Post/tech-single.html?id=${post.id}" title="">
                                                <i class="fa fa-eye"></i> ${post.viewsCount}
                                            </a>
                                        </small>
                                    </div>
                                </div>
                                <hr class="invis">`
                        )
                    )
    
                    var pagination = $("#pagination");
                    pagination.empty();
    
                    var startPage = Math.max(1, page - 2);
                    var endPage = Math.min(startPage + 4, totalPages);
    
                    if (startPage > 1) {
                        pagination.append(
                            `<li class="page-item"><a class="page-link">...</a></li>`
                        );
                    }
    
                    for (var i = startPage; i <= endPage; i++) {
                        pagination.append(
                            `<li class="page-item"><a class="page-link">${i}</a></li>`
                        );
                    }
    
                    if (endPage < totalPages) {
                        pagination.append(
                            `<li class="page-item"><a class="page-link">...</a></li>`
                        );
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
    
                        loadBookmarkList();
                    });
                },
                error: function (xhr) {
                    SlimNotifierJs.notification(
                        "error",
                        "Error",
                        xhr.responseText,
                        3000
                    );
                },
            });
        }

        loadBookmarkList()
    });
} else {
    window.location.href = "./404.html"
}
