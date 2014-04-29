pictograph-with-pure-javascript
===============================

An open source sample pictograph application using HTML 5 drag and drop.
The complete code is written using pure javascript and HTML5 APIs(canvas, draganddrop etc.)

A very good exercise for someone jumping into rendering based on pure js using HTML5 Canvas features.

<h3>Features</h3>
No setup required. Just open the index.html and it should run out of the box!<br>
Pure javascript<br>
HTML5 canvas plus drag and drop API<br>
Multiple pictographs can be added<br>
The data in pictograph can be dynamically supplied through a GUI<br>
You can even publish the generated pictograph as an image!

Techniques used:

Moving freely: HTML5 DND API
Plotting Graphs: HTML5 Canvas drawing (with proper fallbacks)
Exporting to image: HTML5 toDataURL() method

<h3>Application Details</h3>

Editor
A div with id as 'canvas' declared.

Dragover,dragenter events binded to this div element and respective callbacks just do preventdefault and stopPropogation so that nothing happens while dragging the elements over the canvas.

Drop event binded to this canvas and respective callback calculates the current x and y coordinates of the mouse pointer using left and top properties and sets the same
to the dragged element.

Summary:

Application initializes by binding click event listeners to “add pictograph” and “publish as image” buttons. Binds dragover, dragenter and drop event callbacks.

User clicks on “add pictograph button”. This calls addPictograph() . This increments the pictograph counter (count++) and creates a addData - “+” button that has a click event listener to function addData();

User adds data by clicking “+” button repeatedly which calls addData() function. The function creates rows for datasets. Each row consists of two input elements (name and grade) and a remove button.

Once user is done with adding the data, renderPictograph() function is called. This function collects the data in the rows and supplies a “students” object to the plotGraph() function.

PlotGraph function then unpacks the “student” object and plots the graph by drawing the data on the HTML5 Canvas.



