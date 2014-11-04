using EPiServer.Shell.ViewComposition;

namespace AddOn.Favorites.Components
{
    /// <summary>
    /// Component which displays content that the user has marked as a favorite.
    /// </summary>
    [Component(
        WidgetType = "addon/component/Favorites",
        PlugInAreas = "/episerver/cms/mainnavigation/defaultgroup",
        SortOrder = 500,
        LanguagePath = "/addon/favorites",
        Categories = "cms"
    )]
    public class FavoritesComponent
    {
    }
}
