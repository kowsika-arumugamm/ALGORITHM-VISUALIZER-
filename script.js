let bars = [];
let swaps = 0;


const complexities = {
    "bubble": { best: "O(n)", avg: "O(n²)", worst: "O(n²)", space: "O(1)" },
    "selection": { best: "O(n²)", avg: "O(n²)", worst: "O(n²)", space: "O(1)" },
    "insertion": { best: "O(n)", avg: "O(n²)", worst: "O(n²)", space: "O(1)" },
    "quick": { best: "O(n log n)", avg: "O(n log n)", worst: "O(n²)", space: "O(log n)" },
    "merge": { best: "O(n log n)", avg: "O(n log n)", worst: "O(n log n)", space: "O(n)" },
    "heap": { best: "O(n log n)", avg: "O(n log n)", worst: "O(n log n)", space: "O(1)" }
};


function changeAlgorithm() {
    let container = document.getElementById("bars-container");
    container.className = "";
    container.classList.add(document.getElementById("sort-select").value + "-sort");
}


function generateArray() {
    bars = [];
    swaps = 0;
    updateSwaps();

    let input = document.getElementById("array-input").value.trim();
    const container = document.getElementById("bars-container");
    container.innerHTML = "";

    if (input) {
        bars = input.split(",").map(num => parseInt(num.trim())).filter(num => !isNaN(num));
    } else {
        for (let i = 0; i < 20; i++) {
            bars.push(Math.floor(Math.random() * 100) + 10);
        }
    }

    let maxVal = Math.max(...bars);
    let barWidth = 100 / bars.length + "%";

    for (let i = 0; i < bars.length; i++) {
        let bar = document.createElement("div");
        bar.classList.add("bar");
        bar.style.height = (bars[i] / maxVal) * 100 + "%";
        bar.style.left = (i * (100 / bars.length)) + "%";
        bar.style.width = barWidth;
        container.appendChild(bar);
    }
}

async function swap(el1, el2) {
    return new Promise(resolve => {
        setTimeout(() => {
            // Highlight swapping elements
            el1.classList.add("swap");
            el2.classList.add("swap");

            setTimeout(() => {
                let tempHeight = el1.style.height;
                el1.style.height = el2.style.height;
                el2.style.height = tempHeight;

                el1.classList.remove("swap");
                el2.classList.remove("swap");

                swaps++;
                updateSwaps();
                resolve();
            }, 200);
        }, 100);
    });
}


// Bubble Sort
async function bubbleSort() {
    let barsElements = document.querySelectorAll(".bar");
    for (let i = 0; i < bars.length - 1; i++) {
        for (let j = 0; j < bars.length - i - 1; j++) {
            if (bars[j] > bars[j + 1]) {
                await swap(barsElements[j], barsElements[j + 1]);
                [bars[j], bars[j + 1]] = [bars[j + 1], bars[j]];
            }
        }
    }
}

// Selection Sort
async function selectionSort() {
    let barsElements = document.querySelectorAll(".bar");
    for (let i = 0; i < bars.length - 1; i++) {
        let minIndex = i;
        for (let j = i + 1; j < bars.length; j++) {
            if (bars[j] < bars[minIndex]) minIndex = j;
        }
        if (minIndex !== i) {
            await swap(barsElements[i], barsElements[minIndex]);
            [bars[i], bars[minIndex]] = [bars[minIndex], bars[i]];
        }
    }
}


async function insertionSort() {
    let barsElements = document.querySelectorAll(".bar");
    for (let i = 1; i < bars.length; i++) {
        let key = bars[i];
        let j = i - 1;
        while (j >= 0 && bars[j] > key) {
            await swap(barsElements[j], barsElements[j + 1]);
            bars[j + 1] = bars[j];
            j--;
        }
        bars[j + 1] = key;
    }
}

// Quick Sort
async function quickSort(low = 0, high = bars.length - 1) {
    if (low < high) {
        let pivotIndex = await partition(low, high);
        await quickSort(low, pivotIndex - 1);
        await quickSort(pivotIndex + 1, high);
    }
}

async function partition(low, high) {
    let barsElements = document.querySelectorAll(".bar");
    let pivot = bars[high];
    let i = low - 1;
    for (let j = low; j < high; j++) {
        if (bars[j] < pivot) {
            i++;
            await swap(barsElements[i], barsElements[j]);
            [bars[i], bars[j]] = [bars[j], bars[i]];
        }
    }
    await swap(barsElements[i + 1], barsElements[high]);
    [bars[i + 1], bars[high]] = [bars[high], bars[i + 1]];
    return i + 1;
}

// Merge Sort
async function mergeSort(left = 0, right = bars.length - 1) {
    if (left < right) {
        let mid = Math.floor((left + right) / 2);
        await mergeSort(left, mid);
        await mergeSort(mid + 1, right);
        await merge(left, mid, right);
    }
}

async function merge(left, mid, right) {
    let barsElements = document.querySelectorAll(".bar");
    let leftArr = bars.slice(left, mid + 1);
    let rightArr = bars.slice(mid + 1, right + 1);
    let i = 0, j = 0, k = left;
    while (i < leftArr.length && j < rightArr.length) {
        if (leftArr[i] < rightArr[j]) {
            bars[k] = leftArr[i++];
        } else {
            bars[k] = rightArr[j++];
        }
        barsElements[k].style.height = (bars[k] / Math.max(...bars)) * 100 + "%";
        k++;
    }
    while (i < leftArr.length) {
        bars[k] = leftArr[i++];
        barsElements[k].style.height = (bars[k] / Math.max(...bars)) * 100 + "%";
        k++;
    }
    while (j < rightArr.length) {
        bars[k] = rightArr[j++];
        barsElements[k].style.height = (bars[k] / Math.max(...bars)) * 100 + "%";
        k++;
    }
}

// Heap Sort
async function heapSort() {
    let barsElements = document.querySelectorAll(".bar");
    for (let i = Math.floor(bars.length / 2) - 1; i >= 0; i--) {
        await heapify(bars.length, i);
    }
    for (let i = bars.length - 1; i > 0; i--) {
        await swap(barsElements[0], barsElements[i]);
        [bars[0], bars[i]] = [bars[i], bars[0]];
        await heapify(i, 0);
    }
}

async function heapify(n, i) {
    let largest = i;
    let left = 2 * i + 1;
    let right = 2 * i + 2;
    if (left < n && bars[left] > bars[largest]) largest = left;
    if (right < n && bars[right] > bars[largest]) largest = right;
    if (largest !== i) {
        await swap(document.querySelectorAll(".bar")[i], document.querySelectorAll(".bar")[largest]);
        [bars[i], bars[largest]] = [bars[largest], bars[i]];
        await heapify(n, largest);
    }
}

function startSorting() {
    let algorithm = document.getElementById("sort-select").value;
    updateComplexity(algorithm);  // Update complexity before sorting
    eval(algorithm + "Sort()");
}



function updateComplexity(algorithm) {
    document.getElementById("time-complexity").innerText = `Best: ${complexities[algorithm].best}, Avg: ${complexities[algorithm].avg}, Worst: ${complexities[algorithm].worst}`;
    document.getElementById("space-complexity").innerText = `Space: ${complexities[algorithm].space}`;
}


function updateSwaps() {
    document.getElementById("swap-count").innerText = swaps;
}


generateArray();
