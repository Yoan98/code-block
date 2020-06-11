const regExp = {
	chinese: "/^[\u4e00-\u9fa5\w]{2,18}$/",
	password: "/^[\w~!@#$%^\[\]]{6,16}$/",
	email: "/(?:\w+\.)*\w+@(?:\w+\.)+[a-z]/i",
	url: "/^([a-z0-9]\.|[a-z0-9][-a-z0-9]*[a-z0-9]\.)*([a-z]+)$/i",
	trim(str){
		return str.replace(/^\s+/, '').replace(/\s+$/, '')
	},
	toCamelCase(str) {
		return str.replace(pattern, function (all, letter) {
			return letter.toUpperCase();
		})
	}
}

export {regExp};
