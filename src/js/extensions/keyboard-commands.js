(function () {
    'use strict';

    var KeyboardCommands = MediumEditor.Extension.extend({
        name: 'keyboard-commands',

        /* KeyboardCommands Options */

        /* commands: [Array]
         * Array of objects describing each command and the combination of keys that will trigger it
         * Required for each object:
         *   command [String] (argument passed to editor.execAction())
         *   key [String] (keyboard character that triggers this command)
         *   meta [boolean] (whether the ctrl/meta key has to be active or inactive)
         *   shift [boolean] (whether the shift key has to be active or inactive)
         *   alt [boolean] (whether the alt key has to be active or inactive)
         */
        commands: [
            {
                command: 'bold',
                key: 'B',
                meta: true,
                shift: false,
                alt: false
            },
            {
                command: 'italic',
                key: 'I',
                meta: true,
                shift: false,
                alt: false
            },
            {
                command: 'underline',
                key: 'U',
                meta: true,
                shift: false,
                alt: false
            }
        ],

        init: function () {
            MediumEditor.Extension.prototype.init.apply(this, arguments);

            this.subscribe('editableKeydown', this.handleKeydown.bind(this));
            this.keys = {};
            this.commands.forEach(function (command) {
                var keyCode = command.key.charCodeAt(0);
                if (!this.keys[keyCode]) {
                    this.keys[keyCode] = [];
                }
                this.keys[keyCode].push(command);
            }, this);
        },

        handleKeydown: function (event) {
            var keyCode = MediumEditor.util.getKeyCode(event);
            if (keyCode === MediumEditor.util.keyCode.DELETE) {
                let selection = document.getSelection(),
                element = selection.anchorNode,
                rootNode = element.parentNode,
                parentNode = element.parentNode;
                while (rootNode.nodeName !== 'DIV') {
                    rootNode = rootNode.parentNode;
                }
                if (MediumEditor.util.isElementWhitespaceStyle(rootNode, ['pre-line'])) {
                    if (element.parentNode.nodeName === 'DIV') {
                        if (element.nodeValue.length > selection.anchorOffset) {
                            let checkValue = element.nodeValue.substring(selection.anchorOffset > 0 ? selection.anchorOffset - 1 : 0, element.nodeValue.length > selection.anchorOffset + 2 ? selection.anchorOffset + 2 : element.nodeValue.length);
                            //console.log('"', document.getSelection().anchorNode.nodeValue.substring(document.getSelection().anchorOffset, document.getSelection().anchorOffset + 1).charCodeAt(0), '"');
                            if (checkValue.match(/\n/)) {
                                let partOne = document.createTextNode(element.nodeValue.substring(0, selection.anchorOffset)),
                                partTwo = document.createTextNode(element.nodeValue.substring(selection.anchorOffset + 1));
                                element.parentNode.replaceChild(partTwo, element);
                                parentNode.insertBefore(partOne, partTwo);
                                MediumEditor.selection.moveCursor(this.base.options.ownerDocument, partTwo, 0);
                                event.preventDefault();
                                let eventInput = new Event('input', {
                                    bubbles: true,
                                    cancelable: true
                                });

                                rootNode.dispatchEvent(eventInput);// run event for the element events handling
                                return;
                            }
                        }
                    } else if (element.parentNode.nodeName === 'W') {
                        if ((!element.nodeValue || element.nodeValue.length === selection.anchorOffset) && element.parentNode.nextSibling && element.parentNode.nextSibling.nodeValue && element.parentNode.nextSibling.nodeValue.charCodeAt(0) === 10) {
                            element.parentNode.nextSibling.nodeValue = element.parentNode.nextSibling.nodeValue.substring(1);
                            event.preventDefault();
                            let eventInput = new Event('input', {
                                bubbles: true,
                                cancelable: true
                            });

                            rootNode.dispatchEvent(eventInput);// run event for the element events handling
                            return;
                        } else if (element.nodeValue && element.nodeValue.length > selection.anchorOffset) {
                            let checkValue = element.nodeValue.substring(selection.anchorOffset > 0 ? selection.anchorOffset - 1 : 0, element.nodeValue.length > selection.anchorOffset ? selection.anchorOffset + 1 : selection.anchorOffset);
                            if (checkValue.match(/\n/)) {
                                /*let partOne = document.createTextNode(element.nodeValue.substring(0, selection.anchorOffset)),
                                partTwo = document.createTextNode(element.nodeValue.substring(selection.anchorOffset + 1));
                                element.parentNode.replaceChild(partTwo, element);
                                parentNode.insertBefore(partOne, partTwo);
                                MediumEditor.selection.moveCursor(this.base.options.ownerDocument, partTwo, 0);*/
                                let moveTo = selection.anchorOffset;
                                element.nodeValue = MediumEditor.util.replaceStringAt(element.nodeValue, selection.anchorOffset, '');
                                MediumEditor.selection.moveCursor(this.base.options.ownerDocument, element, moveTo);
                                event.preventDefault();
                                let eventInput = new Event('input', {
                                    bubbles: true,
                                    cancelable: true
                                });

                                rootNode.dispatchEvent(eventInput);// run event for the element events handling
                                return;
                            }
                        }
                    }
                }
            } else if (keyCode === MediumEditor.util.keyCode.BACKSPACE) {
                let selection = document.getSelection(),
                element = selection.anchorNode,
                rootNode = element.parentNode,
                parentNode = element.parentNode;
                while (rootNode.nodeName !== 'DIV') {
                    rootNode = rootNode.parentNode;
                }
                if (MediumEditor.util.isElementWhitespaceStyle(rootNode, ['pre-line'])) {
                    if (element.parentNode.nodeName === 'DIV') {
                        if (element.nodeValue.length > selection.anchorOffset && selection.anchorOffset > 0) {
                            let checkValue = element.nodeValue.substring(selection.anchorOffset > 1 ? selection.anchorOffset - 2 : 0, element.nodeValue.length > selection.anchorOffset ? selection.anchorOffset + 1 : selection.anchorOffset);
                            //console.log('"', document.getSelection().anchorNode.nodeValue.substring(document.getSelection().anchorOffset, document.getSelection().anchorOffset + 1).charCodeAt(0), '"');
                            if (checkValue.match(/\n/)) {
                                let partOne = document.createTextNode(element.nodeValue.substring(0, selection.anchorOffset - 1)),
                                partTwo = document.createTextNode(element.nodeValue.substring(selection.anchorOffset));
                                element.parentNode.replaceChild(partTwo, element);
                                parentNode.insertBefore(partOne, partTwo);
                                MediumEditor.selection.moveCursor(this.base.options.ownerDocument, partTwo, 0);
                                event.preventDefault();
                                let eventInput = new Event('input', {
                                    bubbles: true,
                                    cancelable: true
                                });

                                rootNode.dispatchEvent(eventInput);// run event for the element events handling
                                return;
                            }
                        }
                    } else if (element.parentNode.nodeName === 'W') {
                        /*let previous = element.parentNode.previousSibling;
                        if ((!element.nodeValue || element.nodeValue.length === selection.anchorOffset) && element.parentNode.nextSibling && element.parentNode.nextSibling.nodeValue && element.parentNode.nextSibling.nodeValue.charCodeAt(0) === 10) {
                            element.parentNode.nextSibling.nodeValue = element.parentNode.nextSibling.nodeValue.substring(1);
                            event.preventDefault();
                            let eventInput = new Event('input', {
                                bubbles: true,
                                cancelable: true
                            });

                            rootNode.dispatchEvent(eventInput);// run event for the element events handling
                            return;
                        } else */if (element.nodeValue && element.nodeValue.length > selection.anchorOffset) {
                            let checkValue = element.nodeValue.substring(selection.anchorOffset > 1 ? selection.anchorOffset - 2 : 0, element.nodeValue.length > selection.anchorOffset ? selection.anchorOffset + 1 : selection.anchorOffset);
                            if (checkValue.match(/\n/)) {
                                let moveTo = selection.anchorOffset > 0 ? selection.anchorOffset - 1 : selection.anchorOffset;
                                element.nodeValue = MediumEditor.util.replaceStringAt(element.nodeValue, selection.anchorOffset - 1, '');
                                MediumEditor.selection.moveCursor(this.base.options.ownerDocument, element, moveTo);
                                event.preventDefault();
                                let eventInput = new Event('input', {
                                    bubbles: true,
                                    cancelable: true
                                });

                                rootNode.dispatchEvent(eventInput);// run event for the element events handling
                                return;
                            }
                        }
                    }
                }
            }
            if (!this.keys[keyCode]) {
                return;
            }

            var isMeta = MediumEditor.util.isMetaCtrlKey(event),
                isShift = !!event.shiftKey,
                isAlt = !!event.altKey;

            this.keys[keyCode].forEach(function (data) {
                if (data.meta === isMeta &&
                    data.shift === isShift &&
                    (data.alt === isAlt ||
                     undefined === data.alt)) { // TODO deprecated: remove check for undefined === data.alt when jumping to 6.0.0
                    event.preventDefault();
                    event.stopPropagation();

                    // command can be a function to execute
                    if (typeof data.command === 'function') {
                        data.command.apply(this);
                    }
                    // command can be false so the shortcut is just disabled
                    else if (false !== data.command) {
                        this.execAction(data.command);
                    }
                }
            }, this);
        }
    });

    MediumEditor.extensions.keyboardCommands = KeyboardCommands;
}());
