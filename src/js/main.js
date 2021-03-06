
//init
var left = document.getElementById('left'),
    right = document.getElementById('right'),
    links = document.getElementById('links'),
    mufta = document.getElementById('mufta'),
    data = {},
    sizes = {
    	width: mufta.getBoundingClientRect().width,
    	height: mufta.getBoundingClientRect().height,
    	cableWidth: mufta.getBoundingClientRect().width / 5,
    	cableHeight: 20
    },
    textareas = document.getElementsByTagName('textarea');

	//events
	for (var n = 0; textareas[n]; n++)
		textareas[n].addEventListener('keyup', update, false);


function update() {
	data = {
		left: _createDataArray('left'),
		right: _createDataArray('right'),
		links: links.value.split('\n')
	};
	while (mufta.lastChild) {
		mufta.removeChild(mufta.lastChild);
	}
	mufta.setAttribute('height', Math.max(data.left.length, data.right.length) * sizes.cableHeight + 1);
	renderCables();
	renderLinks();
}


function renderLinks() {
	var x2, y2, x1, y1, color;
	x1 = sizes.cableWidth;
	x2 = sizes.width - sizes.cableWidth;

	for (var n = 0; n < data.links.length; n++) {
		data.links[n] = data.links[n].trim();
		if (data.links[n] == "")
			continue;
		var dn = data.links[n].split('-');
		if (data.left[+dn[0]] && data.right[+dn[1]]) {
			color = data.left[+dn[0]][data.left[+dn[0]].length - 1];
			y1 = +dn[0] * sizes.cableHeight + sizes.cableHeight/2;
			y2 = +dn[1] * sizes.cableHeight + sizes.cableHeight/2;
			_addLine(x1, y1, x2, y2, color);
		}
	}
	links.value = data.links.join('\n');
}


function renderCables() {
	var node,
	    color,
	    prev = [],
	    dn,
	    y, x, width, height;

	for (var n = 0; data.left[n]; n++) {
		dn = data.left[n];
		color = dn[dn.length -1];
		node = _addConnector(color, n, 'left');

		for (var l = 0; l < dn.length - 1; l++) {
			if (!prev[l])
				prev[l] = {data: dn[l], n: n};
			else if (prev[l].data != dn[l]) {
				y = prev[l].n * sizes.cableHeight;
				width = sizes.cableWidth / dn.length;
				x = width * l;
				height = (n - prev[l].n) * sizes.cableHeight;
				node = _addRect(y, x, width, height, "#fff");
				_addText(prev[l].data, y + height/2, x + width/2, "-90");
				prev[l] = {data: dn[l], n: n};
			}
		}
	}
	for (var l = 0; l < dn.length - 1; l++) {
		y = prev[l].n * sizes.cableHeight;
		width = sizes.cableWidth / dn.length;
		x = width * l;
		height = (n - prev[l].n) * sizes.cableHeight;
		node = _addRect(y, x, width, height, "#fff");
		_addText(prev[l].data, y + height/2, x + width/2, "-90");
	}
	prev = [];

	for (var n = 0; data.right[n]; n++) {
		dn = data.right[n];
		color = dn[dn.length -1];
		node = _addConnector(color, n, 'right');

		for (var l = 0; l < dn.length - 1; l++) {
			if (!prev[l])
				prev[l] = {data: dn[l], n: n};
			else if (prev[l].data != dn[l]) {
				y = prev[l].n * sizes.cableHeight;
				width = sizes.cableWidth / dn.length;
				x = sizes.width - width * (l + 1);
				height = (n - prev[l].n) * sizes.cableHeight;
				node = _addRect(y, x, width, height, "#fff");
				_addText(prev[l].data, y + height/2, x + width/2, "90");
				prev[l] = {data: dn[l], n: n};
			}
		}
	}
	for (var l = 0; l < dn.length - 1; l++) {
		y = prev[l].n * sizes.cableHeight;
		width = sizes.cableWidth / dn.length;
		x = sizes.width - width * (l + 1);
		height = (n - prev[l].n) * sizes.cableHeight;
		node = _addRect(y, x, width, height, "#fff");
		_addText(prev[l].data, y + height/2, x + width/2, "90");
	}
}


function _addConnector(color, n, pos) {
	var y = n * sizes.cableHeight,
	    x = pos == 'left' ? 0 : sizes.width - sizes.cableWidth,
	    height = sizes.cableHeight,
	    width = sizes.cableWidth;

	_addRect(y, x, width, height, color);
}

function _addRect(y, x, width, height, color) {
	var node = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
	y += 1;
	node.setAttribute('y', y);
	node.setAttribute('x', x);
	node.setAttribute('height', height);
	node.setAttribute('width', width);
	node.setAttribute('style', "fill:" + color + "; stroke-width:1; stroke:#111");
	mufta.appendChild(node);
	return node;
}
function _addLine(x1, y1, x2, y2, color) {
	var node = document.createElementNS('http://www.w3.org/2000/svg', 'line');
	node.setAttribute('y1', y1);
	node.setAttribute('x1', x1);
	node.setAttribute('y2', y2);
	node.setAttribute('x2', x2);
	node.setAttribute('style', "stroke:" + color + "; stroke-width:2"); //; shape-rendering:crispEdges;
	mufta.appendChild(node);
	return node;
}
function _addText(text, y, x, rotate) {
	var newText = document.createElementNS('http://www.w3.org/2000/svg',"text");
	y += 1;
	newText.setAttribute("y",y);
	newText.setAttribute("x",x);
	if (rotate)
		newText.setAttribute("transform","rotate(" + rotate + ", " + x + ", " + y + ")");
	newText.setAttribute("font-family","sans-serif");
	newText.setAttribute("font-size","10px");
	newText.setAttribute("text-anchor","middle");
	newText.setAttribute("dominant-baseline","middle");
	newText.setAttribute("fill","red");
	newText.appendChild(document.createTextNode(text));
	mufta.appendChild(newText);
	return newText;
}



function _createDataArray(name) {
	if (!window[name] && !window[name].value) return;

	var rows0 = window[name].value.split('\n'),//.sort();
	    rows = [];

	for (var n = 0; rows0[n]; n++) {
		rows0[n] = rows0[n].trim();
		if (rows0[n] > "")
			rows.push(rows0[n].split(','));
	}
	window[name].value = rows0.join('\n');

	return rows;
}

