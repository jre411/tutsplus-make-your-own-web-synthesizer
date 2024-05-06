/* Qwerty Hancock 0.4.5 (c) 2012-15 Stuart Memo */
(function(window, undefined) {
    var version = "0.4.5",
        user_settings = {},
        width = {},
        height = {},
        startNote = {},
        whiteKeyColour = {},
        blackKeyColour = {},
        activeColour = {},
        borderColour = {},
        keyboardLayout = {},
        keysDown = {},
        octaveOffsets = {},
        keyExists = false,
        keyMap = {},
        noteMap = {
            65: "Cl",
            87: "C#l",
            83: "Dl",
            69: "D#l",
            68: "El",
            70: "Fl",
            84: "F#l",
            71: "Gl",
            89: "G#l",
            90: "G#l",
            72: "Al",
            85: "A#l",
            74: "Bl",
            75: "Cu",
            79: "C#u",
            76: "Du",
            80: "D#u",
            59: "Eu",
            186: "Eu",
            222: "Fu",
            221: "F#u",
            220: "Gu"
        },
        calculateBlackWidth = function (w) {
            return Math.floor((width - w) / w);
        },
        calculateOffset = function (n) {
            var white_offset;
            user_settings = n || {},
            width = user_settings.width || {},
            height = user_settings.height || {},
            whiteKeyColour = user_settings.whiteKeyColour || "#fff",
            blackKeyColour = user_settings.blackKeyColour || "#000",
            activeColour = user_settings.activeColour || "yellow",
            borderColour = user_settings.borderColour || "#000",
            keyboardLayout = user_settings.keyboardLayout || "en",
            white_offset = Math.floor((width + 1) / 2),
            "undefined" == typeof user_settings.width && (width = document.getElementById("keyboard").offsetWidth),
            "undefined" == typeof user_settings.height && (height = document.getElementById("keyboard").offsetHeight),
            startNote = user_settings.startNote || "A3",
            startOctave = parseInt(startNote.charAt(1), 10),
            octaveOffsets.start = noteMap[startNote.slice(0, -1)],
            white_offset = Math.floor((width + 1) * (octaveOffsets.start - 1) - white_offset / 2);
            return {
                white_offset: white_offset
            };
        },
        calculateNotePosition = function (notes) {
            var note_length = 0,
                position = [];
            for (var i = 0, len = notes.length; i < len; i++) {
                if (startNote.charAt(0) === notes[i]) {
                    note_length = i;
                    break;
                }
            }
            for (var i = 0, len = notes.length; i < len; i++) {
                if (note_length + i > len - 1) {
                    position[i] = notes[i + note_length - len];
                } else {
                    position[i] = notes[i + note_length];
                }
            }
            return position;
        },
        calculateNoteFrequency = function (note) {
            var note_offset, octave;
            octave = note.charAt(3) === note.charAt(3) ? 2 : 1,
            note_offset = ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"].indexOf(note.slice(0, -1)),
            note_offset = note_offset < 3 ? note_offset + 24 + (12 * (octave - 1)) + 1 : note_offset + (12 * (octave - 1)) + 1;
            return 440 * Math.pow(2, (note_offset - 49) / 12);
        },
        calculateOctaveWidth = function (octave_width) {
            return Math.floor(width / octave_width);
        },
        calculateBlackWidth = function (w) {
            return Math.floor(w / 2);
        },
        calculateNoteWidth = function (width) {
            return Math.floor((width + 1) * 7);
        },
        calculateKeyPosition = function (keyNumber, whiteWidth) {
            return Math.floor((whiteWidth + 1) * (keyNumber + 1) - blackWidth / 2);
        },
        calculateKeyWidth = function (width) {
            return Math.floor(width / 2);
        },
        calculateNoteHeight = function (height) {
            return Math.floor(height / 1.5);
        },
        calculateKeyboardStyle = function (el) {
            var setStyles = function (el) {
                el.style.cursor = "default",
                el.style.fontSize = "0px",
                el.style.height = height + "px",
                el.style.padding = 0,
                el.style.position = "relative",
                el.style.listStyle = "none",
                el.style.margin = 0,
                el.style.width = width + "px",
                el.style.webkitUserSelect = "none";
            };
            setStyles(el.container);
            setStyles(el.el);
        },
        calculateKeyStyle = function (el, width, height, colour) {
            if ("li" == el.tagName.toLowerCase()) {
                keyExists = true;
                el.style.display = "inline-block",
                el.style.webkitUserSelect = "none";
                if (colour === "white") {
                    el.style.backgroundColor = whiteKeyColour,
                    el.style.border = "1px solid " + borderColour,
                    el.style.borderRight = 0,
                    el.style.height = height + "px",
                    el.style.width = width + "px",
                    el.style.borderRadius = "0 0 5px 5px";
                    if (el.noteNumber === totalWhiteNotes() - 1) {
                        el.style.border = "1px solid " + borderColour;
                    }
                } else if (colour === "black") {
                    el.style.backgroundColor = blackKeyColour,
                    el.style.border = "1px solid " + borderColour,
                    el.style.position = "absolute",
                    el.style.left = Math.floor((whiteWidth + 1) * (el.noteNumber + 1) - blackWidth / 2) + "px",
                    el.style.width = blackWidth + "px",
                    el.style.height = blackHeight + "px",
                    el.style.borderRadius = "0 0 3px 3px";
                }
            }
        },
        addNoteToKeyboard = function (note, el) {
            var addNote = function (note) {
                el.appendChild(note);
            };
            addNote(note.el);
        },
        createKey = function (colour, octave, width, id, noteNumber) {
            return {
                el: document.createElement("li"),
                id: id,
                title: id,
                colour: colour,
                octave: octave,
                width: width,
                noteNumber: noteNumber
            };
        },
        createKeys = function (totalNotes) {
            var keys = [],
                counter = 0,
                startOctave = startNote.charAt(1),
                totalOctaves = totalWhiteNotes(),
                octaveCounter = startOctave,
                totalKeys = calculateNoteWidth(width),
                octaveWidth = calculateOctaveWidth(totalKeys),
                whiteWidth = calculateWhiteWidth(totalKeys),
                octaveKeys = totalNotes;
            for (var i = 0; i < totalKeys; i++) {
                if (i % whiteNotes.length === 0) {
                    counter = 0;
                }
                var currentNote = whiteNotes[counter],
                    isLastNote = (i === totalKeys - 1),
                    currentOctave = octaveCounter;
                if (currentNote === "C") {
                    if (i !== 0) {
                        octaveCounter++;
                    }
                }
                if (octaveCounter > totalOctaves) {
                    break;
                }
                keys.push(createKey("white", octaveCounter, width, currentNote + octaveCounter, i));
                if (!isLastNote) {
                    keys.push(createKey("black", octaveCounter, calculateBlackWidth(whiteWidth), currentNote + "#" + octaveCounter, i));
                }
                counter++;
            }
            return keys;
        },
        addKeysToKeyboard = function (keyboard, keys) {
            keys.forEach(function (key) {
                keyboard.el.appendChild(key.el);
            });
        },
        getKeyPressOffset = function (startNote) {
            keyPressOffset = (startNote.charAt(0) === "C") ? 0 : 1;
        },
        Keyboard = function (options) {
            var keyboard = this;
            keyboard.version = version;
            keyboard.keyDown = function () {};
            keyboard.keyUp = function () {};
            init.call(keyboard, options);
        };
    window.QwertyHancock = Keyboard;
})(window);
