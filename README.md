## Spotify Clone

This is a Spotify Clone modeled after Spotify. It supports authentication functionalities such as logging in and subscribing to a Spotify premium plan. It handles user authentication using Supabase and subscription via Stripe. Users are allowed access to the app
only after completing authentication.

This project mainly uses Typescript as the logical component to integrate song fetching and playing as well as to facilitate user subscription and signup. Hooks and actions are used in conjunction to provide the desired functionality of the components listed in the libraries above.

## Test User Details

A test user account has been provided for use.

Email:
```
tornadosharkpacific@gmail.com
```
Password:
```
spotify
```

## How to use
Website: https://spotify-clone-sand-gamma.vercel.app/

You can click 'Log in' on the upper right corner and enter the test user details or create your own account with a valid email address (A verification link will be sent to that email).

Upon validation, the test user may play any song by clicking on it. 

For those who created their own account, they will be prompted to subscribe and upon clicking the 'Subscribe' button, they will be brought to a Stripe payment page. Enter '4242424242424242' for the credit card and random values for the other details. Then click Pay (no real money will be charged). Then they can play songs.

Users can like songs to add them to a 'Liked Songs' playlist located on the home page. They can also search for songs on the left hand navigation bar. Users can also upload songs to the library (only in mp3 format) with a relevant title and image. Please refrain from uploading copyrighted songs!! 



