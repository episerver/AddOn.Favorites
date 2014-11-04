define([
    // General application modules
    'dojo/_base/declare', 'epi/dependency',
    // Parent class
    'epi/shell/command/_Command',
    // Resources
    'epi/i18n!epi/nls/addon.favorites.commands'
], function(declare, dependency, _Command, resources) {

    return declare([_Command], {

        // label: [public] String
        //      The action text of the command to be used in visual elements.
        label: resources.remove.label,

        // tooltip: [public] String
        //      The description text of the command to be used in visual elements.
        tooltip: resources.remove.tooltip,

        // iconClass: [readonly] String
        //      The icon class of the command to be used in visual elements.
        iconClass: 'epi-iconTrash',

        constructor: function() {
            this.store = dependency.resolve('epi.storeregistry').get('addon.favorites');
        },

        _execute: function() {
            // summary:
            //      Removes the favorite from the favorites store.
            // tags:
            //      protected
            this.store.remove(this.model.id);
        },

        _onModelChange: function() {
            // summary:
            //      Updates canExecute after the model has been updated.
            // tags:
            //      protected
            this.set('canExecute', !!this.model);
        }
    });
});