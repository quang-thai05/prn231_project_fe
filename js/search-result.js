$(document).ready(() => {
    var page = 1;
    var pageSize = 10;

	var urlParam = new URLSearchParams(window.location.search);
	var attributeValue = urlParam.get("title");
    
	$("#search-result-for").append(`Kết Quả Tìm kiếm: ${attributeValue}`);

	function loadSearchResult() {
        $.ajax({
            url: "https://localhost:7065/api/Post/SearchPostByName?title=" + attributeValue + "&page=" + page + "&pageSize=" + pageSize,
            type: "GET",
            contentType: "application/json",
            success: function (response) {
                var data = response.posts;
                var totalPages = response.totalPages;
                var postList = $("#post-list");
                postList.empty();
                if (response.totalPosts == 0) {
                    postList.append(
                        `<div class="blog-box row">
                            Không có bài viết nào được tìm thấy!
                        </div>`
                    )
                } else {
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
                }
                
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
    
                    loadSearchResult();
                });
            },
            error: function (xhr, status, error) {
                SlimNotifierJs.notification(
                    "info",
                    "Infomation",
                    xhr.responseText,
                    3000
                );
            },
        });
    }

    loadSearchResult()
});
