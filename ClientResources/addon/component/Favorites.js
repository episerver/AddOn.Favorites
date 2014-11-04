define([
    // General application modules
    'dojo/_base/array', 'dojo/_base/declare', 'epi/dependency', 'dojo/dom-class', 'dojo/dom-construct', 'dojo/dom-style', 'dojo/keys', 'dojo/_base/lang', 'dgrid/util/mouse', 'dojo/topic', 'dojo/when',
    // Parent classes
    'dijit/layout/_LayoutWidget', 'epi/shell/command/_WidgetCommandProviderMixin',
    // Other classes
    'dgrid/OnDemandList', 'dgrid/Keyboard', 'dgrid/Selection', 'addon/command/RemoveFavorite'
], function(array, declare, dependency, domClass, domConstruct, domStyle, keys, lang, mouseUtil, topic, when, _LayoutWidget, _WidgetCommandProviderMixin, OnDemandList, Keyboard, Selection, RemoveFavorite) {

    // module:
    //      addon/component/Favorites
    // summary:
    //      Displays a list of content that the current editor has marked as a favorite.
    return declare([_LayoutWidget, _WidgetCommandProviderMixin], {

        postMixInProperties: function() {
            // summary:
            //      Called after the parameters to the widget have been read-in,
            //      but before the widget template is instantiated.
            // tags:
            //      protected
            var registry = dependency.resolve('epi.storeregistry');

            this.inherited(arguments);

            this.store = registry.get('addon.favorites');
            this.contentRepository = registry.get('epi.cms.content.light');

            this.commands.push(new RemoveFavorite({
                category: 'setting'
            }));
        },

        buildRendering: function() {
            // summary:
            //      Construct the favorites list and add it to the DOM.
            // tags:
            //      protected
            this.inherited(arguments);

            domClass.add(this.domNode, 'fav-container');

            this.list = new(declare([OnDemandList, Keyboard, Selection]))({
                selectionMode: 'single',
                store: this.store,
                renderRow: lang.hitch(this, '_renderRow')
            });

            // Add the list as a child of this widget.
            this.addChild(this.list);
        },

        startup: function() {
            // summary:
            //      Startup the widget by hooking into events on the list and then trigger the list to query the store.
            // tags:
            //      protected
            if (this._started) {
                return;
            }

            this.inherited(arguments);

            this._setupEventHandlers();

            this.list.set('query', {});
        },

        layout: function() {
            // summary:
            //      Explicity set the height of the list and then tell it to resize itself.
            // tags:
            //      protected
            domStyle.set(this.list.domNode, 'height', this._contentBox.h + 'px');
            this.list.resize();
        },

        _setupEventHandlers: function() {
            // summary:
            //      Connects the necessary event handles for the grid.
            // tags:
            //      private
            var list  = this.list,
                store = this.store,

                getSelected = function() {
                    // Get the first and only property on the selection, this is the ID of the selected row.
                    var id = Object.keys(list.selection)[0];

                    return store.get(id);
                },

                changeContext = function() {
                    var item = getSelected();

                    topic.publish('/epi/shell/context/request', {
                        uri: 'epi.cms.contentdata:///' + item.contentLink
                    });
                };

            // Change context to selected item on ENTER key press or double click.
            list.on(mouseUtil.createDelegatingHandler('.dgrid-content .dgrid-row', 'keydown'), function(e) {
                if(e.metaKey || e.altKey || e.keyCode !== keys.ENTER) {
                    return;
                }
                changeContext.call(list, e);
            });
            list.on(mouseUtil.createDelegatingHandler('.dgrid-content .dgrid-row', 'dblclick'), changeContext);

            // Update the model for the commands on select.
            list.on('dgrid-select', lang.hitch(this, function() {
                var item = getSelected();

                array.forEach(this.commands, function(command) {
                    command.set('model', item);
                });
            }));

            // Update the model for the commands on deselect.
            list.on('dgrid-deselect', lang.hitch(this, function() {
                array.forEach(this.commands, function(command) {
                    command.set('model', null);
                });
            }));
        },

        _renderRow: function(object) {
            // summary:
            //      Responsible for returning the DOM for a single row in the grid.
            // tags:
            //      private
            var row = domConstruct.create('div');
            when(this.contentRepository.get(object.contentLink), function(result) {
                row.textContent = result.name;
            });
            return row;
        }
    });
});