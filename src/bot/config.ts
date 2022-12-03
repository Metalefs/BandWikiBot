export const config = {
    localTunnelDomain: 'shoppinglistchanbot',
    serverUrl: 'https://shopping-tracker-bot.herokuapp.com',
    websites: {
        metalArchives: function (query,country) {
            if(country)
                return `https://www.metal-archives.com/search/advanced/searching/bands?bandName=${query.replace(/\s/g,'+')}&genre=${country?.replace(/\s/g,'+')}&country=&yearCreationFrom=&yearCreationTo=&bandNotes=&status=&themes=&location=&bandLabelName=#bands`
            else 
                return `https://www.metal-archives.com/search?searchString=${query.replace(/\s/g,'+')}&type=band_name`
        },
        metalArchivesLyrics: function (id) {
            return `https://www.metal-archives.com/release/ajax-view-lyrics/id/${id}`
        },
        metalArchivesBands: function (name) {
            return `https://www.metal-archives.com/search/ajax-band-search/?field=name&query=${name}&sEcho=1&iColumns=3&sColumns=&iDisplayStart=0&iDisplayLength=200&mDataProp_0=0&mDataProp_1=1&mDataProp_2=2`
        },
        metalArchivesBandTabs: function (id) {
            return `https://www.metal-archives.com/band/discography/id/${id}/tab/all`
        }
    }
}