exports.parse = function(lines, marker) {
	var populatefn = populatefn || function(obj) { return obj;};
	var marker = marker || '\t';

	var TreeNode = function(data, depth) {
		this.data = data;
		this.depth = depth;
		this.parent = null;
		this.children = [];
	}
	var tree = new TreeNode(null, -1);

	var levels = [tree];

	function countTabs(line) {
		count = -1; // no content
		for (var i = 0; i < line.length; i++) {
			var ch = line[j];
			if ((ch == '\t')) {
				count += 1;
			}else if (/[^\s]/.test(ch)){
				return 0;
			}
		}
		return count;
	}

	for (var i = 0; i < lines.length; i++) {
		var line = lines[i];

		var tabcount = countTabs(line);

		if (tabcount >= 0) { //then add node to tree

			function topnode() {
		       		return levels[levels.length - 1];
			}
			while(tabcount - topnode().tabcount <= 0) {
				levels.pop();
			}
			var depth = levels.length - 1;
			var node = new TreeNode(line.substring(tabcount), depth);
			node.tabcount = tabcount;
			node.parent = topnode();
			node.parent.children.push(node);
			levels.push(node);
		}
	}
	return tree;
}

exports.traverse = function (tree, cb){
	function _traverse(node) {
		cb(node);
		for (var i = 0; i < node.children.length; i++) {
			_traverse(node.children[i]);
		}
	}

	for (var i = 0; i < tree.children.length; i++) {
		_traverse(tree.children[i]);
	}
}

exports.print = function(tree) {
	exports.traverse(tree, function(node) {
		var string = "";
		for (var i = 0; i < node.depth; i++) {
			string += "\t";
		}
		string += node.data;
		console.log(string);
	});
}
