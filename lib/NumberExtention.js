
/**
 * 判断数字是否为整数
 */
Number.prototype.isInteger = function() {
	var num = Number(this);
	return Math.floor(num) === num;
};

/**
 * 获取数字的小数部分长度，如果数字为NaN返回-1，如果数字为整数返回为0
 */
Number.prototype.getFracLength = function() {
	var num = Number(this);
	if (isNaN(num)) {
		return -1;
	}
	if (num.isInteger()) {
		return 0;
	}
	return num.toString().split(".")[1].length;
};

/**
 * 高精度相加
 * @param {number} 加数
 * @param {boolean} 是否忽略加数不为数字的错误，为true时，如果加数不为数字则返回被加数
 * @return {number} 返回相加结果数值
 */
Number.prototype.accAdd = function(anotherNum, ingnoreError) {
	if (isNaN(parseFloat(anotherNum))) {
		if (ingnoreError === true) {
			return Number(this);
		} else {
			throw new Error('加数"' + anotherNum.toString() + '"不是数字');
		}
	}
	var num = this,
		r1 = num.getFracLength(),
		r2 = anotherNum.getFracLength(),
		m = Math.pow(10, Math.max(r1, r2));
	return (parseInt(num * m) + parseInt(anotherNum * m)) / m;
};

/**
 * 高精度相减
 * @param {number} 减数
 * @param {boolean} 是否忽略减数不为数字的错误，为true时，如果减数不为数字则返回被减数
 * @return {number} 返回相减结果数值
 */
Number.prototype.accSub = function(anotherNum, ingnoreError) {
	if (isNaN(parseFloat(anotherNum))) {
		if (ingnoreError === true) {
			return Number(this);
		} else {
			throw new Error('减数"' + anotherNum.toString() + '"不是数字');
		}
	}
	var num = this,
		r1 = num.getFracLength(),
		r2 = anotherNum.getFracLength(),
		max = Math.max(r1, r2),
		m = Math.pow(10, max);
	return Number(((parseInt(num * m) - parseInt(anotherNum * m)) / m).toFixed(max));
};

/**
 * 高精度相乘
 * @param {number} 乘数
 * @param {boolean} 是否忽略乘数不为数字的错误，为true时，如果乘数不为数字则返回被乘数
 * @return {number} 返回相乘结果数值
 */
Number.prototype.accMul = function(anotherNum, ingnoreError) {
	if (isNaN(parseFloat(anotherNum))) {
		if (ingnoreError === true) {
			return Number(this);
		} else {
			throw new Error('乘数"' + anotherNum.toString() + '"不是数字');
		}
	}
	var num = this,
		r1 = num.getFracLength(),
		r2 = anotherNum.getFracLength();
	return Number((parseInt(num * Math.pow(10, r1)) * parseInt(anotherNum * Math.pow(10, r2))) /  Math.pow(10, r1 + r2));
};

/**
 * 高精度相除
 * @param {number} 除数
 * @param {boolean} 是否忽略除数不为数字的错误，为true时，如果乘数不为数字则返回被除数
 * @return {number} 返回相除结果数值
 */
Number.prototype.accDiv = function(anotherNum, ingnoreError) {
	if (isNaN(parseFloat(anotherNum))) {
		if (ingnoreError === true) {
			return Number(this);
		} else {
			throw new Error('除数"' + anotherNum.toString() + '"不是数字');
		}
	}
	var num = this,
		r1 = num.getFracLength(),
		r2 = anotherNum.getFracLength(),
		p = parseInt((anotherNum * Math.pow(10, r2))) / parseInt((num * Math.pow(10, r1)));
	return p.accMul(Math.pow(10, r1 - r2));
};

/**
 * 四舍五入保留数字小数位，如果为整数，则返回整数，如果为浮点数，则返回浮点数
 */
Number.prototype.floor = function(precision) {
	precision = precision >= 0 ? precision : 2;
	var num = Number(this);
	if (num.isInteger()) {
		return num;
	} else {
		return parseFloat(num.toFixed(precision));
	}
};

/**
 * 格式化数字为带有千位分隔符的字符串
 * @param {Number} precision 小数部分保留位数
 * @return {String} 格式化后字符串，例如："52,395.58"
 */
Number.prototype.ksFormat = function(precision) {
	var fraction = this.toString().split('.')[1];
	var b = parseInt(this).toString(), len = b.length;
	if (len <= 3) {
		return b;
	}
	var r = len % 3;
	var intPart = r > 0 ? b.slice(0, r) + "," + b.slice(r, len).match(/\d{3}/g).join(",") : b.slice(r, len).match(/\d{3}/g).join(",");
	if (!fraction) {
		return intPart;
	} else {
		precision = isNaN(parseInt(precision)) ? 2 : parseInt(precision);
		fraction = (Number('0.' + fraction)).toFixed(precision);
		return intPart + fraction.slice(1);
	}
};