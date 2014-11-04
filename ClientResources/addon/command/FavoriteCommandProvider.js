define([
    // General application modules
    'dojo/_base/declare',
    // Parent class
    'epi-cms/component/command/_GlobalToolbarCommandProvider',
    // Other classes
    'addon/command/AddFavorite'
], function(declare, _GlobalToolbarCommandProvider, AddFavorite) {

    // module:
    //      addon/command/FavoriteCommandProvider
    // summary:
    //      Provides the add favorite command to the global toolbar.
    return declare([_GlobalToolbarCommandProvider], {

        constructor: function() {
            this.addToLeading(new AddFavorite());
        }
    });
});