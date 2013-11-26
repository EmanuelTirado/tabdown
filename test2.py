import os
import tabdown
import json
if __name__ == "__main__":
    path = "s"
    file = open(os.environ['HOME'] + '/' + path)
    lines = file.readlines()

    tree = tabdown.parse2(lines)
    print(json.dumps(tree, indent=4))
    tabdown.reprint2(tree)
