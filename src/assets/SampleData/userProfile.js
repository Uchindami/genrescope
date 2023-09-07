export const sampleUserProfile = {
    "data": {
        "display_name": "John Doe",
        "email": "johndoe@email.com",
        "external_urls": {
            "spotify": "https://open.spotify.com/user/spotifyuser"
        },
        "followers": {
            "total": 12345
        },
        "href": "https://api.spotify.com/v1/users/spotifyuser",
        "id": "spotifyuser",
        "images": [
            {
                "height": null,
                "url": "https://profile-images.spotify.com/user/johndoe.jpg",
                "width": null
            }
        ],
        "product": "premium",
        "type": "user",
        "uri": "spotify:user:spotifyuser"
    }
}

export const sampleDiscription = "Please note that the actual response may contain" +
    " more or slightly different fields, and the data will be specific to the authenticated" +
    " user's account. You should parse this JSON response in your code to access and" +
    " display the information you need for your application. Additionally, always ensure" +
    " you have proper authentication" +
    " and authorization in place when making requests to Spotify's API."

export const sampleTopGenres = {
    "rap": 12,
    "pop": 12,
    "rock": 12,
    "indie": 12,
    "afro": 12,
}