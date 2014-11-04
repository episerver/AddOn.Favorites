define([
    // General application modules
    'dojo/_base/declare', 'epi/dependency', 'dojo/_base/lang', 'dojo/topic',
    // Parent class
    'epi/shell/command/_Command',
    // Resources
    'epi/i18n!epi/nls/addon.favorites.commands'
], function(declare, dependency, lang, topic, _Command, resources) {

    return declare([_Command], {

        // label: [public] String
        //      The action text of the command to be used in visual elements.
        label: resources.add.label,

        // tooltip: [public] String
        //      The description text of the command to be used in visual elements.
        tooltip: resources.add.tooltip,

        // iconClass: [readonly] String
        //      The icon class of the command to be used in visual elements.
        iconClass: 'fav-iconStar',

        constructor: function() {
            this.store = dependency.resolve('epi.storeregistry').get('addon.favorites');

            topic.subscribe('/epi/shell/context/current', lang.hitch(this, 'set', 'model'));
        },

        _execute: function() {
            // summary:
            //      Adds the favorite to the favorites store.
            // tags:
            //      protected
            this.store.put({
                reference: this.model.id
            });
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