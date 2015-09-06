'use strict';

var _ = require('lodash');
var Kefir = require('kefir');

var EventEmitter = require('../lib/safe-event-emitter');

/**
* @class
* Represents a modal dialog.
*/
function ModalView(options){
    EventEmitter.call(this);
    var self = this;
    this._driver = options.modalViewDriver;
    this._driver.getEventStream().filter(function(event){
        return event.eventName === 'closeClick';
    }).onValue(function() {
        self.close();
    });
    this._driver.getEventStream().onEnd(function() {
        self._driver = null;
        self.emit('destroy');
    });

    if(
      _.chain(options.buttons||[])
       .pluck('type')
       .filter(function(type){return type === 'PRIMARY_ACTION';})
       .value().length > 1
     ) {
       throw new Error('At most one primary button is allowed');
     }
}

ModalView.prototype = Object.create(EventEmitter.prototype);

_.extend(ModalView.prototype, /** @lends ModalView */{

    show: function(){
        if(!this._driver){
            throw new Error('Modal can not be shown after being hidden');
        }

        document.body.appendChild(this._driver.getOverlayElement());
        document.body.appendChild(this._driver.getModalContainerElement());

        this._driver.getModalContainerElement().focus();

        var self = this;

        Kefir.fromEvents(document.body, 'keydown')
            .filter(function(domEvent){
                return domEvent.keyCode === 27;
            })
            .takeUntilBy(Kefir.fromEvents(this, 'destroy'))
            .onValue(function(domEvent){
                domEvent.stopImmediatePropagation();
                domEvent.stopPropagation();
                domEvent.preventDefault();
                self.close();
            });

        //don't bubble key events to gmail
        Kefir.fromEvents(document.body, 'keydown')
            .takeUntilBy(Kefir.fromEvents(this, 'destroy'))
            .onValue(function(domEvent){
                domEvent.stopPropagation();
            });

        Kefir.fromEvents(document.body, 'keyup')
            .takeUntilBy(Kefir.fromEvents(this, 'destroy'))
            .onValue(function(domEvent){
                domEvent.stopPropagation();
            });

        Kefir.fromEvents(document.body, 'keypress')
            .takeUntilBy(Kefir.fromEvents(this, 'destroy'))
            .onValue(function(domEvent){
                domEvent.stopPropagation();
            });
    },

    setTitle: function(title){
        if(!this._driver){
            throw new Error('Modal can not be shown after being hidden');
        }

        this._driver.setTitle(title);
    },

    /**
    * This closes the modal. Does nothing if already closed.
    * @return {void}
    */
    close: function(){
        if (this._driver) {
            this._driver.destroy();
        }
    },

    addButton: function(options){
        throw new Error("not implemented");
    }

    /**
     * Fires when this ModalView instance is closed.
     * @event ModalView#destroy
     */

});

module.exports = ModalView;
