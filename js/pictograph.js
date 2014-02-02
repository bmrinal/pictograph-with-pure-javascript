/**
 * The app generates a pictograph of students vs the grades they achieved.
 *
 * Plotting map:
 *  Y axis - students
 *  X axis - grades
 *
 * FEATURES:
 *
 * 1. Create pictographs
 * 2. Edit Pictographs
 * 3. New Pictographs (Multiple pictographs, advanced requirement)
 * 4. Move pictographs freely in the editor (HTML5 DND API)
 * 5. Provide custom datasets for rendering the pictographs
 * 6. Remove datasets
 * 7. Publish the editor as a image
 *
 * LACKS THE FOLLOWING:
 *
 * A placeholder " + " has been used to plot data.
 * Icons have not been used, but icons be an easy replace by using some neat SVG graphics (Don't know much about them :)
 *
 */


/**
 * Initializes app with basic event bindings for :
 * add pictograph button
 * HTML5 DND API event callbacks
 */
window.onload = function () {
    var addButton = document.getElementById('addPictograph');
    var publishButton=document.getElementById('publish');
    var canvas = document.getElementById('canvas');
    addButton.addEventListener('click', addPictograph, false);
    canvas.addEventListener('dragover', drag_over, false);
    canvas.addEventListener('dragenter', drag_over, false);
    canvas.addEventListener('drop', dropped, false);
    publishButton.addEventListener('click',publish,false);
}


var context;
var count=0;
var pictographs = []; //this stores the ids of rendered pictographs

/**
 * THIS acts as the main controller:
 * Maintains a stack of pictographs along with the count
 * Assigns proper ids to elements (mixed with graph count) to keep tight coupling of individual contexts
 * finally binds event to the addData button
 */
function addPictograph() {
    count++;
    //pushing ids of pictographs
    var actionPanel = document.getElementById('actionPanel');
    var dataPanel = document.createElement('div');
    var heading = document.createElement('h2');
    heading.innerHTML = "Pictograph " + count;
    dataPanel.appendChild(heading);
    dataPanel.setAttribute('id', 'dataset-' + count);
    var addBtn = document.createElement('button');
    addBtn.setAttribute('id', 'addBtn');
    addBtn.innerHTML = "+";
    dataPanel.appendChild(addBtn);
    addBtn.addEventListener('click', addData, false)
    actionPanel.appendChild(dataPanel);
    actionPanel.appendChild(document.createElement('hr'));
}

/**
 * This adds new rows in the dataset i.e new data in pictograph
 * and attach remove-row button for each row
 * and attach plotgraph button (along with its event listeners)
 */
function addData() {

    var wrapper = document.createElement('div');

    //name component
    var dataName = document.createElement('input');
    dataName.setAttribute('class', 'dataname-' + this.parentElement.id.split("-")[1]);
    dataName.setAttribute('placeholder', 'Student Name');
    wrapper.appendChild(dataName);

    //value component
    var dataValue = document.createElement('input');
    dataValue.setAttribute('class', 'datavalue-' + this.parentElement.id.split("-")[1]);
    dataValue.setAttribute('placeholder', 'Grades (0 - 10)');
    wrapper.appendChild(dataValue);

    //remove button
    var removeBtn = document.createElement('button');
    removeBtn.innerHTML = "x";
    wrapper.appendChild(removeBtn);
    removeBtn.addEventListener('click', function () {
        this.parentElement.remove()
    }, false)

    this.parentElement.appendChild(wrapper);

    //removing the old button
    if (document.getElementById('plotPicto-' + this.parentElement.id.split("-")[1]) != null)
        this.parentElement.removeChild(document.getElementById('plotPicto-' + this.parentElement.id.split("-")[1]));

    //creating a fresh button
    var plotBtn = document.createElement('button');
    plotBtn.innerHTML = "Plot Pictograph";
    plotBtn.setAttribute('id', 'plotPicto-' + this.parentElement.id.split("-")[1]);
    this.parentElement.appendChild(plotBtn);

    //attaching the click event listener
    plotBtn.addEventListener('click', renderPictograph, false);
}
/**
 * Creates a object pictograph with the following properties:
 * 1. data : contains the data for the graph plotting
 * 2. render: method attached to this property plots the actual pictograph
 * 3. element: this contains a ref to the element i.e the canvas
 */
function renderPictograph() {

    var pictograph = {};
    /*
    collecting data from corresponding dataset and pushing it to pictograph.data
    Also Checks if the value/name is passed empty and if it is, nothing is pushed
     */
    pictograph.data = [];
    var names = document.getElementsByClassName('dataname-' + this.id.split('-')[1]);
    var grades = document.getElementsByClassName('datavalue-' + this.id.split('-')[1]);
    for (i = 0; i < names.length; i++) {
        var obj = {};

        if (names[i].value)
            obj.name = names[i].value;
        if (grades[i].value)
            obj.grade = grades[i].value;
        if (Object.keys(obj).length)
            pictograph.data.push(obj);
    }

    var xCor, yCor;
    //removing old pictograph if exists and then render it with the fresh data!
    var previousCanvas = document.getElementById('canvas-' + this.id.split('-')[1]);
    if (previousCanvas != null) {
        //stores the orginal coordinates for restoration
        xCor = previousCanvas.offsetLeft;
        yCor = previousCanvas.offsetTop;
        previousCanvas.remove();
    }

    pictograph.render = plotData;
    pictograph.element = document.createElement('canvas');
    pictograph.element.innerHTML="This browser isn't compatible. Please consider upgrading your browser"; //fallback
    pictograph.element.setAttribute('id', 'canvas-' + this.id.split('-')[1]);
    pictograph.element.setAttribute('style', 'left:' + xCor + 'px;top:' + yCor + 'px; display:block'); //restores the original graph position
    pictograph.element.className = 'pictograph';
    pictograph.element.setAttribute('draggable', 'true');
    pictograph.element.addEventListener('dragstart', dragstart, false);


    if (pictograph.data.length) {
        pictographs.push(this.id.split('-')[1]);
        pictograph.render(pictograph.data);
        canvas.appendChild(pictograph.element);
    }
}

/**
 * This actually plots the data on HTML5 canvas element
 * consumes data passed in the params
 * Computes offsets, axes lengths and uses simple math to plot data on HTML5 canvas
 * @param students
 */
function plotData(students) {
    //Simple HTML5 CANVAS DRAWING
    //initializing the context
    var c = this.element.getContext('2d');
    c.lineWidth = 2;
    c.strokeStyle = '#333';
    c.beginPath();
    //Calculates max lenght of
    var charmax = 0;
    students.forEach(function (data) {
        if (data.name.length > charmax)
            charmax = data.name.length;
    });
    //setting the offsets for labels
    var offsety = charmax * 6 + 5;
    var offsetx = 20;

    //Maximum limit of grades (calculating the max of grades and assigning to gradelimit)
    var max = 0;
    students.forEach(function (data) {
        if (data.grade > max)
            max = data.grade;
    });
    var gradeLimit = max;

    //Calculating axes length
    var yLength = students.length * 25;
    var xLength = gradeLimit * 25;

    //Plotting x and y axis
    this.element.height = yLength + 25 + offsetx;
    this.element.width = xLength + 25 + offsety + 25;
    c.moveTo(offsety, 0);
    c.lineTo(offsety, yLength + 25);
    c.moveTo(offsety, yLength + 25);
    c.lineTo(xLength + offsety + 25, yLength + 25);
    c.stroke();
    for (var i = 25, sindex = 0; i <= yLength; i += 25, sindex++)
        c.fillText(students[sindex].name, 0, i);
    for (var i = 25, j = 1; i <= xLength; i += 25, j++)
        c.fillText(j, offsety + i, yLength + offsetx + 25);

    //Now Plotting grades
    var count = 0;
    students.forEach(function (data) {
        count++;
        var y = count * 25;
        for (var i = 25; i <= data.grade * 25; i += 25) {
            var x = i + offsety;
            c.fillText("+", x, y);
        }
    });
}

/**
 * STORES THE CURRENT OFFSET TO PREVENT THE JITTER WHILE DROPPING
 * (these offsets gets subtracted from the drop location offsets)
 *  @param e
 */
function dragstart(e) {
    e.dataTransfer.setData("Text",e.target.id);
    context = this;
    offsetx = e.clientX - this.offsetLeft;
    offsety = e.clientY - this.offsetTop;
}

/**
 * Callback fired when canvas is dropped at some location.
 * This sets the left and top position of the canvas
 * @param e
 */
function dropped(e) {
    context.style.left = e.clientX - offsetx + 'px';
    context.style.top = e.clientY - offsety + 'px';
    e.preventDefault();
}

/**
 *This prevents firing any callback on dragenter and dragover events (HTML5 DND API)
 * @param e
 * @returns {boolean}
 */

function drag_over(e) {
    e.preventDefault();
    e.stopPropagation();
    return false;
}

/**
 * Performs the following step wise:
 * 1. Merges all canvases into one main canvas
 * 2. Use HTML5 Canvas toDataURL method to export a image from that canvas
 */
function publish(){
    var canvas=document.getElementById('canvas');
    var style=getComputedStyle(canvas);
    var mergedCanvas=document.createElement('canvas');
    var ctx=mergedCanvas.getContext('2d');
    mergedCanvas.width=parseInt(style.getPropertyValue('width'));
    mergedCanvas.height=parseInt(style.getPropertyValue('height'));
    ctx.fillStyle=style.getPropertyCSSValue('background-color').cssText;
    ctx.fillRect(0,0,parseInt(style.getPropertyValue('width')),parseInt(style.getPropertyValue('height')));


    //PRINTS ALL CANVASES TO 'mergedCanvas'
    pictographs.forEach(function(id){
        var currentCanvas=document.getElementById('canvas-'+id);
        var x=currentCanvas.offsetLeft-canvas.offsetLeft;
        var y=currentCanvas.offsetTop-canvas.offsetTop;
        ctx.drawImage(currentCanvas,x,y);
    });

    window.open(mergedCanvas.toDataURL());

}