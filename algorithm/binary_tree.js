class TreeNode {
    constructor(rootNode, leftNode, rightNode) {
        this.rootNode = rootNode || null;
        this.rightNode = rightNode || null;
        this.leftNode = leftNode || null;
    }
}

/**
 *  任意节点的左子树不空，则左子树上所有结点的值均小于它的根结点的值；
    任意节点的右子树不空，则右子树上所有结点的值均大于它的根结点的值；
    任意节点的左、右子树也分别为二叉查找树；
    没有键值相等的节点。二叉查找树相比于其他数据结构的优势在于查找、插入的时间复杂度较低。为O(log n)。
    二叉查找树是基础性数据结构，用于构建更为抽象的数据结构，如集合、multiset、关联数组等。
 */
class BinaryTree {
    constructor(root) {
        this.root = root || null;
    }

    /**
     * 新增加一个节点
     * @param {any} nodeData 待插入的节点
     * @param {any} parentNode 为待插入的节点选择父节点
     */
    addNode(nodeData, parentNode) {
        let node = nodeData instanceof TreeNode ? nodeData : new TreeNode(nodeData);
        if (!this.root) {
            return this.root = node;
        }

        let currentNode = this.root;
        parentNode = parentNode instanceof TreeNode ? parentNode.rootNode : parentNode || null;
        while (true) {
            if (parentNode && currentNode.rootNode === parentNode) {
                if (node.rootNode < currentNode.rootNode) {
                    currentNode.leftNode = node;
                    break;
                } else {
                    currentNode.rightNode = node;
                    break;
                }
            }
            if (node.rootNode < currentNode.rootNode && !currentNode.leftNode) {
                currentNode.leftNode = node;
                break;
            } else if (node.rootNode < currentNode.rootNode && currentNode.leftNode) {
                currentNode = currentNode.leftNode;
                continue;
            } else if (!currentNode.rightNode) {
                currentNode.rightNode = node
                break;
            } else {
                currentNode = currentNode.rightNode;
            }
        }
    }

    /**
     * 测试找到的节点是否正确
     * @param {any} nodeData 
     */
    getNodeValue(nodeData) {
        let node = this.findNode(nodeData);
        return node ? node.rootNode : node;
    }

    /**
     * 找到某个节点
     * @param {TreeNode|any} nodeData 节点
     * @return {TreeNode}
     */
    findNode(nodeData) {
        nodeData = nodeData instanceof TreeNode ? nodeData.rootNode : nodeData || null;
        if (!nodeData || this.root.rootNode === nodeData) {
            return this.root;
        }
        return this._findNode(this.root, nodeData);
    }

    /**
     * 删除某个节点
     * @param {any} nodeData 待删除的节点
     * @return {TreeNode} 删除的节点（可以考虑把此父节点一起返回）
     */
    deleteNode(nodeData) {
        nodeData = nodeData instanceof TreeNode ? nodeData.rootNode : nodeData || null;
        let deleteNode = null;
        if (!nodeData || this.root.rootNode === nodeData) {
            deleteNode = this.root;
            this.root = null;
            return deleteNode;
        }

        // 递归找到父节点，并删除相应的子节点
        let deleteFn = function(root, nodeData) {
            if (root.leftNode && root.leftNode.rootNode === nodeData) {
                deleteNode = root.leftNode;
                root.leftNode = null;
                return true;
            }
            if (root.rightNode && root.rightNode.rootNode === nodeData) {
                deleteNode = root.rightNode;
                root.rightNode = null;
                return true;
            }
            let isOk = false;
            if (root.leftNode) {
                isOk = deleteFn(root.leftNode, nodeData);
            }
            if (isOk) {
                return isOk;
            }
            if (root.rightNode) {
                isOk = deleteFn(root.rightNode, nodeData);
            }
            return isOk;
        };

        deleteFn(this.root, nodeData);
        return deleteNode;
    }

    /**
     * 找到某个节点的父节点
     * @param {TreeNode} root 开始查找的根节点
     * @param {any} nodeData 需要查找父节点的节点
     * @return {TreeNode} 父节点
     */
    findParentNode(root, nodeData) {
        nodeData = nodeData instanceof TreeNode ? nodeData.rootNode : nodeData || null;
        if (root.leftNode && root.leftNode.rootNode === nodeData) {
            return root;
        }
        if (root.rightNode && root.rightNode.rootNode === nodeData) {
            return root;
        }
        let parent = null;
        if (root.leftNode) {
            parent = this._findNode(root.leftNode, nodeData);
        }
        if (parent) {
            return parent;
        }
        if (root.rightNode) {
            parent = this._findNode(root.rightNode, nodeData);
        }
        return parent;
    }

    /**
     * 以递归方式找到某个节点，优点是任何二叉树都能找到第一个符合节点的值
     * 缺点是递归越多越耗时和内存
     * @param {*} root 
     * @param {*} nodeData 
     */
    _findNode(root, nodeData) {
        if (root.rootNode === nodeData) {
            return root;
        }
        let node = null;
        if (root.leftNode) {
            node = this._findNode(root.leftNode, nodeData);
        }
        if (node) {
            return node;
        }
        if (root.rightNode) {
            node = this._findNode(root.rightNode, nodeData);
        }
        return node;
    }

    /**
     * 找到最大节点值（递归）
     * @return {number} 返回最大节点的值
     */
    findMaxNodeWithRecursion() {
        let findMaxNode = function(root, maxNode) {
            if (!root.rootNode) {
                return maxNode;
            }
            if (root.rootNode > maxNode) {
                maxNode = root.rootNode;
            }
            if (root.leftNode) {
                maxNode = findMaxNode(root.leftNode, maxNode)
            }
            if (root.rightNode) {
                maxNode = findMaxNode(root.rightNode, maxNode)
            }
            return maxNode;
        }
        return findMaxNode(this.root, this.root.rootNode);
    }

    /**
     * 找到最大节点值（循环）
     * @return {number} 返回最大节点的值
     */
    findMaxNodeWithLoop() {
        let maxNode = this.root.rootNode;
        let currentNode = this.root;
        while(true) {
            if (currentNode.rootNode > maxNode) {
                maxNode = currentNode.rootNode;
            }
            // 由于假定大数值在右子树，小的在左字树，
            // 所以最大值只会在右子树，就不用考虑左子树的情况（无论当前节点比maxNode大还是小）

            currentNode = currentNode.rightNode;
            if (!currentNode) {
                return maxNode;
            }
        }
    }

    /**
     * 找到最小节点值（递归）
     * @return {number} 返回最小节点的值
     */
    findMinNodeWithRecursion() {
        let findMinNode = function(root, minNode) {
            if (!root.rootNode) {
                return minNode;
            }
            if (root.rootNode < minNode) {
                minNode = root.rootNode;
            }
            if (root.leftNode) {
                minNode = findMinNode(root.leftNode, minNode)
            }
            if (root.rightNode) {
                minNode = findMinNode(root.rightNode, minNode)
            }
            return minNode;
        }
        return findMinNode(this.root, this.root.rootNode);
    }

    /**
     * 找到最小节点值（循环）
     * @return {number} 返回最小节点的值
     */
    findMinNodeWithLoop() {
        let minNode = this.root.rootNode;
        let currentNode = this.root;
        while(true) {
            if (currentNode.rootNode < minNode) {
                minNode = currentNode.rootNode;
            }
            // 由于假定大数值在右子树，小的在左字树，
            // 所以最小值只会在左子树，就不用考虑又子树的情况（无论当前节点比minNode大还是小）

            currentNode = currentNode.leftNode;
            if (!currentNode) {
                return minNode;
            }
        }
    }

    /**
     * 先序遍历
     * @param {TreeNode|any} nodeData 开始先序遍历的某个节点
     * @return {Array}
     */
    preOrder(nodeData) {
        nodeData = nodeData instanceof TreeNode ? nodeData.rootNode : nodeData || null;
        let root = this.findNode(nodeData);
        return this._preOrder(root);
    }

    _preOrder(root) {
        if (!root) {
            return [];
        }
        let data = [];
        data.push(root.rootNode);
        return [].concat(data, this._preOrder(root.leftNode), this._preOrder(root.rightNode));
    }

    /**
     * 中序遍历
     * @param {*} nodeData 开始先序遍历的某个节点
     *  @return {Array}
     */
    inOrder(nodeData) {
        nodeData = nodeData instanceof TreeNode ? nodeData.rootNode : nodeData || null;
        let specifyRoot = this.findNode(nodeData);
        let inOrderTree = function(root) {
            // 写递归时从最后一层考虑（到数一二两层就能写出正确的），数值存储方式，不要从第一层考虑到最后一层
            // 每次递归其实就不存在左又节点，就一个父节点
            if (!root) {
                return [];
            }
            let data = [];
            // 每个节点递归到本身时，其本身就是这里存储的父节点，而不是存储其父节点，所有不会重复存储
            data.push(root.rootNode);
            // 按照中序规则存储就行了，就相当于一次concat连接一个A（左父右），多个A连接就是完整数据了
            return [].concat(inOrderTree(root.leftNode), data, inOrderTree(root.rightNode));
        }
        return inOrderTree(specifyRoot);
    }

    /**
     * 后序遍历
     * @param {*} nodeData 开始先序遍历的某个节点
     * @return {Array}
     */
    postOrder(nodeData) {
        nodeData = nodeData instanceof TreeNode ? nodeData.rootNode : nodeData || null;
        let specifyRoot = this.findNode(nodeData);
        let postOrderTree = function (root) {
            if (!root) {
                return [];
            }
            let data = []
            data.push(root.rootNode);
            return [].concat(postOrderTree(root.leftNode), postOrderTree(root.rightNode), data);
        }
        return postOrderTree(specifyRoot);
    }

    /**
     * 层次遍历所有节点
     * @param {*} nodeData 开始先序遍历的某个节点
     *  @return {Array}
     */
    levelTraverseTree(nodeData) {
        nodeData = nodeData instanceof TreeNode ? nodeData.rootNode : nodeData || null;
        let specifyRoot = this.findNode(nodeData);
        // 利用广度优先搜索算法
        // 实质是将根节点压入队列，遍历队列，
        // （1）取出队列第一个节点，存储该节点的数据，将其不为null的左右节点压入队列
        // 重复（1），知道队列为空
        // 核心是用队列已有节点，得到新节点并存回队列，保证了相关的数据连接在了一起
        let nodes = [specifyRoot];
        let datas = [];
        while(nodes.length > 0) {
            let currentNode = nodes.shift(); // nodes[0]
            datas.push(currentNode.rootNode);
            if (currentNode.leftNode) {
                nodes.push(currentNode.leftNode);
            }
            if (currentNode.rightNode) {
                nodes.push(currentNode.rightNode);
            }
        }
        return datas;
    }

    /**
     * 求从某一节点开始的深度，默认为二叉树的深度
     * @param {*} nodeData 开始先序遍历的某个节点
     *  @return {Number}
     */
    depthOfTree(nodeData) {
        nodeData = nodeData instanceof TreeNode ? nodeData.rootNode : nodeData || null;
        let specifyRoot = this.findNode(nodeData);
        let getDepthOfTree = function(root, maxDepth) {
            if (!root || !root.rootNode) {
                return maxDepth;
            }
            maxDepth++;
            return Math.max(getDepthOfTree(root.leftNode, maxDepth), getDepthOfTree(root.rightNode, maxDepth));
        }
        return getDepthOfTree(specifyRoot, 0);
    }

    /**
     * 求数的最大宽度（两个队列的方式，一个广度变量节点，一个记录下一层节点，得出没层节点数）
     * @param {*} nodeData 开始先序遍历的某个节点
     * @return {Number}
     */
    widthOfTreeWithTwoQ(nodeData) {
        nodeData = nodeData instanceof TreeNode ? nodeData.rootNode : nodeData || null;
        let specifyRoot = this.findNode(nodeData);
        let queueOne = [specifyRoot];
        let queueTwo = [];
        if(!specifyRoot || !specifyRoot.rootNode) {
            return 0;
        }
        let max = 1;
        while(queueOne.length > 0) {
            let currentNode = queueOne.shift();
            if (currentNode.leftNode) {
                queueTwo.push(currentNode.leftNode);
            }
            if (currentNode.rightNode) {
                queueTwo.push(currentNode.rightNode);
            }
            if (!queueOne.length) {
                if (queueTwo.length > max) {
                    max = queueTwo.length;
                }
                queueOne = queueOne.concat(queueTwo);
                queueTwo = [];
            }
        }
        return max;
    }

    /**
     * 求数的最大宽度广度优先搜索方式，通过flag区分不同的层
     * @param {*} nodeData 开始先序遍历的某个节点
     * @return {Number}
     */
    widthOfTreeWithFlag(nodeData) {
        nodeData = nodeData instanceof TreeNode ? nodeData.rootNode : nodeData || null;
        let specifyRoot = this.findNode(nodeData);
        if (!specifyRoot || !specifyRoot.rootNode) {
            return 0;
        }
        let queue = [specifyRoot, false];
        let max = 1;
        let count = 0;
        while(queue.length > 0) {
            let currentNode = queue.shift();
            if (!currentNode) {
                max = count > max ? count : max;
                count = 0;
                if (!queue.length) {
                    return max;
                }
                queue.push(false);
                continue;
            } else {
                if (currentNode.leftNode) {
                    queue.push(currentNode.leftNode);
                }
                if (currentNode.rightNode) {
                    queue.push(currentNode.rightNode);
                }
                count++;
            }
        }
    }

    /**
     * 得到数的节点总数
     * @param {*} nodeData 开始先序遍历的某个节点
     *  @return {Number}
     */
    getAllNodesInTree(nodeData) {
        nodeData = nodeData instanceof TreeNode ? nodeData.rootNode : nodeData || null;
        let specifyRoot = this.findNode(nodeData);
        let nodes = [specifyRoot];
        let sum = 0;
        while(nodes.length > 0) {
            let currentNode = nodes.shift(); // nodes[0]
            sum++;
            if (currentNode.leftNode) {
                nodes.push(currentNode.leftNode);
            }
            if (currentNode.rightNode) {
                nodes.push(currentNode.rightNode);
            }
        }
        return sum;
    }

    /**
     * 得到指定层的节点数
     * @param {Number} level 第几层
     * @param {*} nodeData 开始先序遍历的某个节点
     * @return {Number}
     */
    numberOfNodesOnLevel(level, nodeData) {
        level = Number.isInteger(level) ? level : 1;
        nodeData = nodeData instanceof TreeNode ? nodeData.rootNode : nodeData || null;
        let specifyRoot = this.findNode(nodeData);
        if (level > this.depthOfTree(specifyRoot)) {
            return 0;
        }
        if (!specifyRoot || !specifyRoot.rootNode) {
            return 0;
        }
        let queueOne = [specifyRoot];
        let queueTwo = [];
        let levels = 0;
        let count = 0;
        while(queueOne.length > 0) {
            let currentNode = queueOne.shift();
            count++;
            if (currentNode.leftNode) {
                queueTwo.push(currentNode.leftNode);
            }
            if (currentNode.rightNode) {
                queueTwo.push(currentNode.rightNode);
            }
            if (!queueOne.length) {
                levels++;
                if (levels === level) {
                    return count;
                }
                count = 0;
                queueOne = queueTwo;
                queueTwo = [];
            }
        }
    }

    /**
     * 指定某层为根节点，并计算所有叶子节点数（某人二叉树原始根节点为根节点）
     * @param {*} nodeData 开始先序遍历的某个节点
     * @return {Number}
     */
    numberOfLeafsInTree(nodeData) {
        nodeData = nodeData instanceof TreeNode ? nodeData.rootNode : nodeData || null;
        let specifyRoot = this.findNode(nodeData);
        let queue = [specifyRoot];
        let leafs = 0;
        while(queue.length > 0) {
            let currentNode = queue.shift();
            if (!currentNode.leftNode && !currentNode.rightNode) {
                leafs++;
                continue;
            }
            if (currentNode.leftNode) {
                queue.push(currentNode.leftNode);
            }
            if (currentNode.rightNode) {
                queue.push(currentNode.rightNode);
            }
        }
        return leafs;
    }

    /**
     * 求出某个节点到根节点的路径
     * @param {*} specifyNode 待求路径的节点
     * @param {*} nodeData 指定为根节点的节点
     * @return {Number[]}
     */
    pathOfTreeNode(specifyNode, nodeData) {
        specifyNode = specifyNode instanceof TreeNode ? specifyNode.rootNode : specifyNode || null;
        nodeData = nodeData instanceof TreeNode ? nodeData.rootNode : nodeData || null;
        let specifyRoot = this.findNode(nodeData);
        let getPath = function(root, node) {
            if (!root) {
                return [];
            }
            if (root.rootNode === node) {
                return [root.rootNode];
            }
            let nodes = [].concat(getPath(root.leftNode, node), getPath(root.rightNode, node));
            if (nodes.length) {
                nodes.push(root.rootNode);
            }
            return nodes;
        }
        return getPath(specifyRoot, specifyNode).reverse();
    }

    /**
     * 求任意两个节点的最近公共父节点
     * 注意：二叉树最近公共节点有且只有一个
     * 其它树就算有多个公共节点，最近的一个所在层数肯定是最高的一个
     * 这里，代码里，肯定是第一个存进数组的
     * @param {*} nodeOne 第一个节点
     * @param {*} nodeTwo 第二个节点
     * @param {*} nodeData 指定为根节点的节点
     * @return {Number}
     */
    parentOfNodes(nodeOne, nodeTwo, nodeData) {
        nodeOne = nodeOne instanceof TreeNode ? nodeOne.rootNode : nodeOne || null;
        nodeTwo = nodeTwo instanceof TreeNode ? nodeTwo.rootNode : nodeTwo || null;
        nodeData = nodeData instanceof TreeNode ? nodeData.rootNode : nodeData || null;
        let specifyRoot = this.findNode(nodeData);
        let parents = [];
        let getParent = function (root, nodeOne, nodeTwo) {
            if (!root) {
                return false;
            }
            if (root.rootNode === nodeOne || root.rootNode === nodeTwo) {
                return true;
            }
            let leftPath = getParent(root.leftNode, nodeOne, nodeTwo);
            let rightPath = getParent(root.rightNode, nodeOne, nodeTwo);
            if (leftPath && rightPath) {
                parents.push(root.rootNode);
            }
            return leftPath || rightPath ? true : false;
        }
        getParent(specifyRoot, nodeOne, nodeTwo);
        return parents.length ? parents[0] : null;
    }

    /**
     * 获取翻转二叉树（这个方式改变实例本身，可以新建一个实例，返回新实例不该本实例）
     * @param {*} nodeData 指定为根节点的节点
     * return {TreeNode}
     */
    invertBinaryTree(nodeData) {
        nodeData = nodeData instanceof TreeNode ? nodeData.rootNode : nodeData || null;
        let specifyRoot = this.findNode(nodeData);
        if (!specifyRoot || !specifyRoot.rootNode) {
            return this;
        }
        let newTreeRoot = new TreeNode(specifyRoot.rootNode);
        let oldQueue = [specifyRoot];
        let newQueue = [newTreeRoot];
        while(oldQueue.length > 0) {
            let oldTree = oldQueue.shift();
            let newTree = newQueue.shift();
            if (oldTree.rightNode) {
                let newNode = new TreeNode(oldTree.rightNode.rootNode);
                newTree.leftNode = newNode;
                oldQueue.push(oldTree.rightNode);
                newQueue.push(newTree.leftNode);
            }
            if (oldTree.leftNode) {
                let newNode = new TreeNode(oldTree.leftNode.rootNode);
                newTree.rightNode = newNode;
                oldQueue.push(oldTree.leftNode);
                newQueue.push(newTree.rightNode);
            }
        }
        this.root = newTreeRoot;
        return this;
    }

    /**
     * 判断是否为完满二叉树（full binary tree）
     * @param {*} nodeData 指定为根节点的节点
     */
    isFullBinaryTree(nodeData) {
        nodeData = nodeData instanceof TreeNode ? nodeData.rootNode : nodeData || null;
        let specifyRoot = this.findNode(nodeData);
        if (!specifyRoot || !specifyRoot.rootNode) {
            return false;
        }
        let fullBinaryTree = function(root) {
            if (!root.leftNode && !root.rightNode) {
                return true;
            }
            if (root.leftNode && root.rightNode) {
                return fullBinaryTree(root.leftNode) && fullBinaryTree(root.rightNode);
            } else {
                return false;
            }
        }
        return fullBinaryTree(specifyRoot);
    }

    /**
     * 判断是否为完全二叉树（compelete binary tree）
     * @param {*} nodeData 指定为根节点的节点
     */
    isCompeleteBinaryTree(nodeData) {
        nodeData = nodeData instanceof TreeNode ? nodeData.rootNode : nodeData || null;
        let specifyRoot = this.findNode(nodeData);
        if (!specifyRoot || !specifyRoot.rootNode) {
            return false;
        }
        let levelNodes = 1;
        let queueOne = [specifyRoot];
        let queueTwo = [];
        let isCompleteTree = false;
        while(queueOne.length > 0) {
            let currentNode = queueOne.shift();
            if (currentNode.leftNode) {
                queueTwo.push(currentNode.leftNode); 
            }
            if (currentNode.rightNode) {
                queueTwo.push(currentNode.rightNode);
            }
            if (currentNode.leftNode && !currentNode.rightNode && isCompleteTree) {
                return false;
            } else if (!currentNode.leftNode && currentNode.rightNode) {
                return false;
            } else if (currentNode.leftNode && !currentNode.rightNode) {
                isCompleteTree = true;
            }
            if (!queueOne.length) {
                // 判断是否为完美二叉树（perfect binary tree）
                if (!queueTwo.length) {
                    return true;
                }
                // 判断是否满足完成二叉树(compelete binary tree)
                if (queueTwo.length === levelNodes * 2) {
                    levelNodes = queueTwo.length;
                } else if (queueTwo.length < levelNodes * 2) {
                    for (const item of queueTwo) {
                        if (item.leftNode || item.rightNode) {
                            return false;
                        }
                    }
                    return true;
                }else {
                    return false;
                }
                queueOne = queueTwo;
                queueTwo = [];
            }
        }
    }

    /**
     * 判断是否为完美二叉树（perfect binary tree）
     * @param {*} nodeData 指定为根节点的节点
     */
    isPerfectBinaryTree(nodeData) {
        nodeData = nodeData instanceof TreeNode ? nodeData.rootNode : nodeData || null;
        let specifyRoot = this.findNode(nodeData);
        if (!specifyRoot || !specifyRoot.rootNode) {
            return false;
        }
        let levelNodes = 1;
        let queueOne = [specifyRoot];
        let queueTwo = [];
        while(queueOne.length > 0) {
            let currentNode = queueOne.shift();
            if (currentNode.leftNode) {
                queueTwo.push(currentNode.leftNode); 
            }
            if (currentNode.rightNode) {
                queueTwo.push(currentNode.rightNode);
            }
            if (!queueOne.length) {
                // 判断是否为完美二叉树（perfect binary tree）
                if (!queueTwo.length) {
                    return true;
                }
                if (queueTwo.length === levelNodes * 2) {
                    levelNodes = queueTwo.length;
                } else {
                    return false;
                }
                queueOne = queueTwo;
                queueTwo = [];
            }
        }
    }
}


const arr = [45, 22, 69, 66, 5, 7, 9, 89, 23, 49, 67];
const binaryTree = new BinaryTree();
arr.forEach(value => binaryTree.addNode(value));

// 测试指定某个父节点插入新节点 ok
// binaryTree.addNode(6, new TreeNode(22));
// console.log(binaryTree);

// 测试得到某个节点 ok
// console.log(binaryTree.getNodeValue(5));

// 测试删除某个节点 ok
// console.log(binaryTree.deleteNode(66));
// console.log(binaryTree);

// 测试找到最大节点 ok
// console.log(binaryTree.findMaxNodeWithRecursion());
// console.log(binaryTree.findMaxNodeWithLoop());

// 测试找到最小节点 ok
// console.log(binaryTree.findMinNodeWithRecursion());
// console.log(binaryTree.findMinNodeWithLoop());


// 测试先序遍历 ok
// console.log(binaryTree.preOrder());
// console.log(binaryTree.preOrder(69));

// 测试中序遍历 ok
// console.log(binaryTree.inOrder());
// console.log(binaryTree.inOrder(69));

// 测试后序遍历 ok
// console.log(binaryTree.postOrder());
// console.log(binaryTree.postOrder(69));


// 测试层次遍历 ok
// console.log(binaryTree.levelTraverseTree());
// console.log(binaryTree.levelTraverseTree(69));

// 测试深度 ok
// console.log(binaryTree.depthOfTree());
// console.log(binaryTree.depthOfTree(22));

// 测试树的宽度 ok
// console.log(binaryTree.widthOfTreeWithTwoQ());
// console.log(binaryTree.widthOfTreeWithTwoQ(66));
// console.log(binaryTree.widthOfTreeWithFlag());
// console.log(binaryTree.widthOfTreeWithFlag(66));

// 测试得到树的总节点个数 ok
// console.log(binaryTree.getAllNodesInTree());
// console.log(binaryTree.getAllNodesInTree(66));

// 测试得到某层节点个数 ok
// console.log(binaryTree.numberOfNodesOnLevel(3));
// console.log(binaryTree.numberOfNodesOnLevel(3, 7));


// 测试得到所有叶子节点个数 ok
// console.log(binaryTree.numberOfLeafsInTree());
// console.log(binaryTree.numberOfLeafsInTree(7));

// 测试，求出某个节点到根节点的路径 ok
// console.log(binaryTree.pathOfTreeNode(9));
// console.log(binaryTree.pathOfTreeNode(67, 69));

// 测试： 求出两个节点最近的公共父节点 ok
// console.log(binaryTree.parentOfNodes(49, 89));
// console.log(binaryTree.parentOfNodes(9, 23, 22));


// 测试，翻转二叉树 ok
// let newTree1 = binaryTree.invertBinaryTree(); // 一次翻转
// console.log(newTree1.preOrder());
// let newTree = binaryTree.invertBinaryTree(69); // 二次翻转
// console.log(newTree.preOrder());


// 测试，是否为full binary tree（完满） ok
// console.log(binaryTree.isFullBinaryTree());
// console.log(binaryTree.isFullBinaryTree(69));

// 测试，是否为complete binary tree（完全） ok
// console.log(binaryTree.isCompeleteBinaryTree());
// console.log(binaryTree.isCompeleteBinaryTree(69));

// const arr1 = [69, 66, 49, 67, 89, 88, 90, 48, 87];
// const binaryTree1 = new BinaryTree();
// arr1.forEach(value => binaryTree1.addNode(value));
// console.log(binaryTree1.isCompeleteBinaryTree());
// const arr1 = [69, 66, 49, 67, 89, 88, 90];
// const binaryTree1 = new BinaryTree();
// arr1.forEach(value => binaryTree1.addNode(value));
// console.log(binaryTree1.isCompeleteBinaryTree());


// 测试，是否为perfectl binary tree（完美） ok
// console.log(binaryTree.isPerfectBinaryTree());
// console.log(binaryTree.isPerfectBinaryTree(69));
// const arr1 = [69, 66, 49, 67, 89, 88, 90];
// const binaryTree1 = new BinaryTree();
// arr1.forEach(value => binaryTree1.addNode(value));
// console.log(binaryTree1.isPerfectBinaryTree());



// TODO: 翻转二叉树丶堆排、nodejs的timer使用技巧（三个看完，可以看看其它排序）