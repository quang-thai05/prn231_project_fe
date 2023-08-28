$(document).ready(function () {
	// Tạo đối tượng XMLHttpRequest
	var xhttp = new XMLHttpRequest();
	const img =
		"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS52y5aInsxSm31CvHOFHWujqUx_wWTS9iM6s7BAm21oEN_RiGoog";
	// Thiết lập callback function
	xhttp.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			// Xử lý dữ liệu JSON nhận được
			var data = JSON.parse(this.responseText);

			// Fill dữ liệu vào HTML
			document.getElementById("userName").value = data?.username;
			document.getElementById("displayName").value = data?.displayName;
			// if (data?.avatar == null) {
			//     document.getElementById("imgAvatar").src = img;
			// } else {
			//     document.getElementById("imgAvatar").src = img;
			// }
			document.getElementById("phoneNumber").value = data?.phoneNumber;
			document.getElementById("email").value = data?.email;
			document.getElementById("displayNameTitle").innerHTML =
				data?.displayName;
			var dateValue = getFormattedDate(data?.birth);
			document.getElementById("birth").value = dateValue;

			document.getElementById("totalPost").value = data?.totalPost;
			document.getElementById("totalView").value = data?.totalView;
			document.getElementById("totalComment").value = data?.totalComment;
			document.getElementById("totalPoint").value = data?.totalPoint;
			$("#imgAvatar").attr("src", "../images/" + data?.avatar);

			const genderValue = data?.gender;
			var maleRadio = document.getElementById("gender1");
			var femaleRadio = document.getElementById("gender2");

			if (genderValue === true) {
				maleRadio.checked = true;
				femaleRadio.checked = false;
			} else {
				maleRadio.checked = false;
				femaleRadio.checked = true;
			}
		}
	};

	function getFormattedDate(dateTimeString) {
		var dateTimeObj = new Date(dateTimeString);
		var year = dateTimeObj.getFullYear();
		var month = (dateTimeObj.getMonth() + 1).toString().padStart(2, "0");
		var day = dateTimeObj.getDate().toString().padStart(2, "0");

		// Định dạng thành dạng yyyy-mm-dd
		var formattedDate = year + "-" + month + "-" + day;

		return formattedDate;
	}
	const token = localStorage.getItem("token");
	// Gửi yêu cầu tới API
	xhttp.open("GET", "https://localhost:7065/api/User/GetDetailProfile", true);
	// Thiết lập header Authorization với giá trị token
	xhttp.setRequestHeader("Authorization", "Bearer " + token);
	xhttp.send();
});
