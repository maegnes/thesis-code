Dartboard = function (htmlContainer, canvasContainer, callbackFunction) {

    /**
     * The html container of the canvas element
     */
    this.htmlContainer = htmlContainer;

    /**
     * the canvas container
     */
    this.canvasContainer = canvasContainer;

    /**
     * Callback method to provide the hit amounts to external sources
     */
    this.callback = callbackFunction;

    /**
     * The canvas element
     *
     * @type {CanvasRenderingContext2D}
     */
    this.canvas = null;

    /**
     * Distance in mm from the center position to the boards edge
     *
     * @type {number}
     */
    this.distBoardEdge = 224;

    /**
     * Distance in mm from the center position to the outer double circle
     *
     * @type {number}
     */
    this.distOuterDouble = 169;

    /**
     * Distance in mm from the center position to the inner double circle
     * @type {number}
     */
    this.distInnerDouble = 160;

    /**
     * Distance in mm from the center position to the outer triple circle
     *
     * @type {number}
     */
    this.distOuterTriple = 107;

    /**
     * Distance in mm from the center position to the inner triple circle
     * @type {number}
     */
    this.distInnerTriple = 96;

    /**
     * Distance in mm from the center position to the single bull circle
     * @type {number}
     */
    this.distSingleBull = 17;

    /**
     * Distance in mm from the center position to the bulls eye circle
     *
     * @type {number}
     */
    this.distDoubleBull = 7;

    /**
     * Increase factor to increase size of the dartboard
     *
     * @type {number}
     */
    this.increaseFactor = 2;

    /**
     * init() called?
     *
     * @type {boolean}
     */
    this.initCalled = false;

    /**
     * draw() called?
     */
    this.boardDrawn = false;

    /**
     * Width of the html container element
     *
     * @type {number}
     */
    this.width = 0;

    /**
     * Height of the html container element
     *
     * @type {number}
     */
    this.height = 0;

    /**
     * Coordinates of the dartboard center
     * @type {Array}
     */
    this.coordinatesCenter = [];

    /**
     * Default values
     */
    this.defaultHitAmounts = {
        'BULLSEYE': 0,
        'SINGLEBULL': 0,
        'INNERSINGLE': 0,
        'TRIPLE': 0,
        'OUTERSINGLE': 0,
        'DOUBLE': 0,
        'MISSEDSCORES': 0,
        'MISSEDBOARD': 0
    };

    /**
     * Hit amounts grouped by area
     */
    this.hitAmounts = {};

    /**
     * Initial calculations
     */
    this.init = function () {

        this.initCalled = true;

        // Calculate the height and width of our html container
        this.width = this.height = 2 * (this.increaseFactor * this.distBoardEdge);

        // Set the coordinates of the dartboard center point
        this.coordinatesCenter = [
            Math.round(this.width / 2), // X
            Math.round(this.width / 2) // Y
        ];

        this.canvas = this.canvasContainer.getContext("2d");

        var ref = this;

        // Handle the click event in the hit function
        this.canvasContainer.addEventListener("click", function(e) {
            ref.hit(e);
        });

        this.resetHitAmounts();

        // Site the html container and the canvas element to fit into the given dimensions
        this.sizeElements();
    };

    /**
     * Set the width properties to the html container and canvas element
     */
    this.sizeElements = function () {
        if (this.initCalled) {
            this.htmlContainer.style.width = this.width + "px";
            this.htmlContainer.style.height = this.height + "px";
            this.canvasContainer.width = this.width;
            this.canvasContainer.height = this.height;
        }
    };

    /**
     * Draws the dartboard
     */
    this.draw = function () {
        if (!this.initCalled) {
            alert('Please call the init() method before you start with the dartboard drawing!');
        } else {
            this.drawCircles();
            this.drawLines();
            this.boardDrawn = true;
        }
    };

    /**
     * Draws the circles of the dartboard
     */
    this.drawCircles = function () {
        var data = [
            [
                "#000000",
                this.distBoardEdge
            ],
            [
                "#bb0a02",
                this.distOuterDouble
            ],
            [
                "#ffffff",
                this.distInnerDouble
            ],
            [
                "#069136",
                this.distOuterTriple
            ],
            [
                "#fdf6ae",
                this.distInnerTriple
            ],
            [
                "#069136",
                this.distSingleBull
            ],
            [
                "#bb0a02",
                this.distDoubleBull
            ]
        ];
        for (var i = 0; i < data.length; i++) {
            this.canvas.beginPath();
            this.canvas.fillStyle = data[i][0];
            this.canvas.arc(this.coordinatesCenter[0], this.coordinatesCenter[1], (this.increaseFactor * data[i][1]), 0, 2 * Math.PI);
            this.canvas.fill();
            this.canvas.closePath();
        }
    };

    /**
     * Draws the lines of the dartboard
     */
    this.drawLines = function () {

        var outerDouble = this.increaseFactor * this.distBoardEdge;
        var singleBull = this.increaseFactor * this.distSingleBull;
        this.canvas.lineHeight = 1;

        // We have to draw 20 lines (10 * 2)
        for (var i = 0; i < 10; i++) {

            var th = Math.PI * 11 / 20 - i * Math.PI / 10;

            // As we have to interrupt the line to not cross the bull fields draw 2 separate lines
            for (var j = 0; j <= 1; j++) {

                // Draw the first part of the line until the single bull circle
                var startPoint = [
                    Math.round((outerDouble - 1) + (outerDouble * Math.cos((0 == j) ? th : th + Math.PI))), // X
                    Math.round((outerDouble + 1) - (outerDouble * Math.sin((0 == j) ? th : th + Math.PI))) // Y
                ];

                var endPoint = [
                    Math.round((outerDouble - 1) + singleBull * Math.cos((0 == j) ? th : th + Math.PI)), // X
                    Math.round((outerDouble + 1) - singleBull * Math.sin((0 == j) ? th : th + Math.PI)) // Y
                ];

                this.canvas.beginPath();
                this.canvas.moveTo(startPoint[0], startPoint[1]);
                this.canvas.lineTo(endPoint[0], endPoint[1]);
                this.canvas.stroke();
                this.canvas.closePath();
            }

        }
    };

    /**
     * Mark a hit on the dartboard
     * @param e
     */
    this.hit = function (e) {

        if (!this.boardDrawn) {
            return false;
        }

        this.canvas.beginPath();
        this.canvas.fillStyle = "#00ccff";
        this.canvas.arc(e.layerX, e.layerY, 2, 0, 2 * Math.PI);
        this.canvas.fill();
        this.canvas.closePath();

        // Now we calculate the distance between the center of the board and the hit
        var middle = [
            this.coordinatesCenter[0],
            this.coordinatesCenter[1]
        ];

        var hit = [
            e.layerX,
            e.layerY
        ];

        // Calculate the distance to the center position
        var d =
            Math.round(
                Math.sqrt(
                    (Math.pow(middle[0] - hit[0], 2) + Math.pow(middle[1] - hit[1], 2))
                )
            ) / this.increaseFactor;

        this.getArea(d);

    };

    /**
     * Get the area where the dart landed
     *
     * @param distance
     */
    this.getArea = function(distance) {
        if (distance < this.distDoubleBull) {
            this.hitAmounts.BULLSEYE++;
        } else if (distance < this.distSingleBull) {
            this.hitAmounts.SINGLEBULL++;
        } else if (distance < this.distInnerTriple) {
            this.hitAmounts.INNERSINGLE++;
        } else if (distance < this.distOuterTriple) {
            this.hitAmounts.TRIPLE++;
        } else if (distance < this.distInnerDouble) {
            this.hitAmounts.OUTERSINGLE++;
        } else if (distance < this.distOuterDouble) {
            this.hitAmounts.DOUBLE++;
        } else if (distance < this.distBoardEdge) {
            this.hitAmounts.MISSEDSCORES++;
        } else {
            this.hitAmounts.MISSEDBOARD++;
            this.reset();
        }
        this.notify();
    };

    /**
     * Call callback method (if given)
     */
    this.notify = function() {
        if ('function' === typeof this.callback) {
            this.callback(this.hitAmounts);
        }
    };

    /**
     * Resets the dartboard and removes the hits
     */
    this.reset = function() {
        // Remove canvas
        this.canvas.beginPath();
        this.canvas.clearRect(0, 0, this.width, this.height);
        this.canvas.closePath();

        // Redraw the dartboard!
        this.resetHitAmounts();
        this.draw();
    };

    /**
     * Method to reset the hit amounts
     */
    this.resetHitAmounts = function() {
        // Quick n dirty solution to clone an object
        this.hitAmounts = JSON.parse(JSON.stringify(this.defaultHitAmounts));
    };
};