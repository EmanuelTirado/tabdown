exports.parse = function(lines, marker) {
	var populatefn = populatefn || function(obj) { return obj;};
	var marker = marker || '\t';

	var tree = [];

	tree.toString = function(){
		JSON.stringify(tree);
	}

	function countTabs(line) {
		var count = 0; 
		for (var i = 0; i < line.length; i++) {
			var ch = line[i];
			if ((ch == '\t')) {
				count += 1;
			}else if (/[^\s]/.test(ch)){
				return count;
			}
		}
		return -1; // no content
	}

	var lindex = 0;

	function parseChildren(level) {
		var children = [];
		do {
			var line = lines[lindex],
				tabcount = countTabs(line),
				data = line.substring(tabcount);
			//console.log(level, tabcount, data);
			
			if (tabcount == level || tabcount < 0){
				lindex++;
				if (lindex==lines.length) return children;
				
				var grandchildren = parseChildren(level+1),
					child = {};
				child[data] = grandchildren;
				Object.defineProperty(child, "data", {
					enumerable: false,
					value: data
				});
				Object.defineProperty(child, "depth", {
					enumerable: false,
					value: tabcount
				});
				children.push(child);
			} 								
		} while (tabcount >= level);
		return children;
	}
	
	tree = parseChildren(0);
	
	return tree;
}

exports.traverse = function (tree, cb){
	function _traverse(node) {
		var children = Object.keys(node)[0];
		cb(node);
		for (var i = 0; i < node[children].length; i++) {
			_traverse(node[children][i]);
		}
	}
	for (var i = 0; i < tree.length; i++) {
		_traverse(tree[i]);		
	}
}

exports.print = function(tree) {
	exports.traverse(tree, function(node) {
		var string = "";
		for (var i = 0; i < node.depth; i++) {
			string += "\t";
		}
		string += Object.keys(node)[0];
		console.log(string);
	});
}
