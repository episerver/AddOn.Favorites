define([
    // General application modules
    'dojo/_base/declare', 'epi/dependency', 'epi/routes',
    // Parent class
    'epi/_Module',
    // Other classes
    'addon/command/FavoriteCommandProvider'
], function(declare, dependency, routes, _Module, FavoriteCommandProvider) {

    return declare([_Module], {

        initialize: function() {
            // summary:
            //      Initializes the favorite module.
            // tags:
            //      public
            var storeRegistry = dependency.resolve('epi.storeregistry'),
                commandRegistry = dependency.resolve('epi.globalcommandregistry'),
                path = routes.getRestPath({
                    moduleArea: 'AddOn.Favorites',
                    storeName: 'favorites'
                });

            storeRegistry.create('addon.favorites', path);

            commandRegistry.registerProvider('epi.cms.globalToolbar', new FavoriteCommandProvider());
        }
    });
});