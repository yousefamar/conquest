Number.prototype.clamp = function (min, max) {
    return this<min?min:this>max?max:this;
};

loadSync = function (url) {
	var xhr = new XMLHttpRequest();
	xhr.open("GET", url, false);
	xhr.send();
	return xhr.responseText;
};

loadAsync = function (url, callback) {
	var xhr = new XMLHttpRequest();
	xhr.onload =  function () {
		callback(this.responseText);
	};
	xhr.open("GET", url);
	xhr.send();
};


List = function () {
	this.size = 0;
};

// TODO: Consider implementing multiple parameter functionality or an array of elements as a parameter.
List.prototype.add = function (element) {
	if (element) {
		this.tail = this.tail ? this.tail.next = {e: element} : this.head = {e: element};
		this.size++;
	}
	return this;
};

List.prototype.remove = function (element) {
	if (element && this.head) {
		if (this.head === element) {
			this.head = this.head === this.tail ? this.tail = undefined : this.head.next;
			this.size--;
			return true;
		}
		var current = this.head;
		while (current.next) {
			if (current.next === element) {
				if (current.next === this.tail)
					this.tail = current;
				current.next = current.next.next;
				this.size--;
				return true;
			}
			current = current.next;
		}
	}
	return false;
};

List.prototype.poll = function () {
	var element = this.head ? this.head.e : undefined;
	if (element) {
		this.head = this.head === this.tail ? this.tail = undefined : this.head.next;
		this.size--;
	}
	return element;
};