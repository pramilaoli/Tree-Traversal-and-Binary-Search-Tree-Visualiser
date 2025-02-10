class Node {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
    }
}

class BST {
    constructor() {
        this.root = null;
    }

    insert(value) {
        const newNode = new Node(value);
        if (!this.root) {
            this.root = newNode;
            return;
        }
        let current = this.root;
        while (true) {
            if (value < current.value) {
                if (!current.left) {
                    current.left = newNode;
                    break;
                }
                current = current.left;
            } else if (value > current.value) {
                if (!current.right) {
                    current.right = newNode;
                    break;
                }
                current = current.right;
            } else {
                break;
            }
        }
    }

    delete(value) {
        const deleteNode = (node, value) => {
            if (!node) return null;
            if (value === node.value) {
                if (!node.left && !node.right) return null;
                if (!node.left) return node.right;
                if (!node.right) return node.left;
                
                let temp = node.right;
                while (temp.left) temp = temp.left;
                node.value = temp.value;
                node.right = deleteNode(node.right, temp.value);
                return node;
            } else if (value < node.value) {
                node.left = deleteNode(node.left, value);
                return node;
            } else {
                node.right = deleteNode(node.right, value);
                return node;
            }
        };
        this.root = deleteNode(this.root, value);
    }

    getInOrder() {
        const result = [];
        const traverse = (node) => {
            if (!node) return;
            traverse(node.left);
            result.push(node);
            traverse(node.right);
        };
        traverse(this.root);
        return result;
    }

    getPreOrder() {
        const result = [];
        const traverse = (node) => {
            if (!node) return;
            result.push(node);
            traverse(node.left);
            traverse(node.right);
        };
        traverse(this.root);
        return result;
    }

    getPostOrder() {
        const result = [];
        const traverse = (node) => {
            if (!node) return;
            traverse(node.left);
            traverse(node.right);
            result.push(node);
        };
        traverse(this.root);
        return result;
    }
}

const bst = new BST();
const canvas = document.getElementById('tree-canvas');
const nodesContainer = document.getElementById('nodes-container');

function visualizeTree() {
    // Clear previous elements
    nodesContainer.innerHTML = '';
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!bst.root) return;

    const queue = [];
    const lines = [];
    const nodes = [];
    const startX = canvas.width / 2;
    const startY = 50;
    const verticalSpacing = 80;

    queue.push({ node: bst.root, x: startX, y: startY, level: 0 });

    while (queue.length > 0) {
        const { node, x, y, level } = queue.shift();
        nodes.push({ value: node.value, x, y });

        if (node.left) {
            const childX = x - (canvas.width / Math.pow(2, level + 2));
            const childY = y + verticalSpacing;
            lines.push({ startX: x, startY: y, endX: childX, endY: childY });
            queue.push({ node: node.left, x: childX, y: childY, level: level + 1 });
        }

        if (node.right) {
            const childX = x + (canvas.width / Math.pow(2, level + 2));
            const childY = y + verticalSpacing;
            lines.push({ startX: x, startY: y, endX: childX, endY: childY });
            queue.push({ node: node.right, x: childX, y: childY, level: level + 1 });
        }
    }

    // Draw lines
    lines.forEach(line => {
        ctx.beginPath();
        ctx.moveTo(line.startX, line.startY);
        ctx.lineTo(line.endX, line.endY);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.stroke();
    });

    // Create nodes
    nodes.forEach(node => {
        const element = document.createElement('div');
        element.className = 'node';
        element.textContent = node.value;
        element.dataset.value = node.value;
        element.style.left = `${node.x - 20}px`;
        element.style.top = `${node.y - 20}px`;
        nodesContainer.appendChild(element);
    });
}

async function animateTraversal(nodes) {
    for (const node of nodes) {
        const element = document.querySelector(`.node[data-value="${node.value}"]`);
        if (element) {
            element.style.backgroundColor = '#ff0000';
            await new Promise(resolve => setTimeout(resolve, 1000));
            element.style.backgroundColor = '#4CAF50';
        }
    }
}

// Event Listeners
document.getElementById('insert-btn').addEventListener('click', () => {
    const value = parseInt(document.getElementById('node-value').value);
    if (!isNaN(value)) {
        bst.insert(value);
        visualizeTree();
    }
});

document.getElementById('delete-btn').addEventListener('click', () => {
    const value = parseInt(document.getElementById('node-value').value);
    if (!isNaN(value)) {
        bst.delete(value);
        visualizeTree();
    }
});

document.getElementById('preorder').addEventListener('click', () => {
    animateTraversal(bst.getPreOrder());
});

document.getElementById('inorder').addEventListener('click', () => {
    animateTraversal(bst.getInOrder());
});

document.getElementById('postorder').addEventListener('click', () => {
    animateTraversal(bst.getPostOrder());
});

document.getElementById('clear-btn').addEventListener('click', () => {
    bst.root = null;
    visualizeTree();
});