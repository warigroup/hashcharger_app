function alphaNumericCheck(inputtxt) {
	var letters = /^[0-9a-zA-Z]+$/;
	if (inputtxt.value.match(letters) && inputtxt.length < 10 && inputtxt.length > 2) {
		return true;
	} else {
		return false;
	}
}