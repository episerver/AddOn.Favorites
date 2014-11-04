using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using AddOn.Favorites.Models;
using EPiServer.Core;
using EPiServer.Data.Dynamic;
using EPiServer.Framework.Serialization;
using EPiServer.Shell;
using EPiServer.Shell.Services.Rest;

namespace AddOn.Favorites.Controllers
{
    /// <summary>
    /// A REST store for managing user favorites.
    /// </summary>
    [RestStore("favorites")]
    public class FavoritesStore : RestControllerBase
    {
        private readonly DynamicDataStoreFactory _dynamicDataStoreFactory;

        /// <summary>
        /// Initializes a new instance of the <see cref="FavoritesStore"/> class.
        /// </summary>
        public FavoritesStore(IEnumerable<IRestControllerValueProvider> valueProviders,
                              IObjectSerializerFactory objectSerializerFactory,
                              DynamicDataStoreFactory dynamicDataStoreFactory)
            : base(valueProviders, objectSerializerFactory)
        {
            Validate.RequiredParameter("dynamicDataStoreFactory", dynamicDataStoreFactory);
            _dynamicDataStoreFactory = dynamicDataStoreFactory;
        }

        private DynamicDataStore DataStore
        {
            get
            {
                return _dynamicDataStoreFactory.GetStore(typeof(FavoriteModel));
            }
        }

        [HttpGet]
        public ActionResult Get()
        {
            var items = DataStore.Items<FavoriteModel>()
                                 .Where(model => model.UserName == User.Identity.Name)
                                 .ToArray();

            return Rest(items);
        }

        [HttpPost]
        public ActionResult Post(ContentReference reference)
        {
            string username = User.Identity.Name;
            string contentLink = reference.CreateReferenceWithoutVersion().ToString();

            var item = DataStore.Items<FavoriteModel>()
                                .FirstOrDefault(model => model.UserName == username && model.ContentLink == contentLink);

            // Check to see if the requested contentLink already exists in the store.
            if (item != null)
            {
                return Rest(item);
            }

            // Add the new favorite to the store.
            item = new FavoriteModel
            {
                Id = Guid.NewGuid(),
                UserName = username,
                ContentLink = contentLink
            };

            DataStore.Save(item);

            // Return the model for the new favorite.
            return Rest(item);
        }

        public ActionResult Delete(Guid id)
        {
            DataStore.Delete(id);

            return new EmptyResult();
        }
    }
}
