# IT2Help Website

This repository contains the static files for the **IT2Help** website. The project is built with HTML5, CSS3 and vanilla JavaScript.

## Structure
- `index.html`, `services.html`, `catalogue.html`, `contact.html`, etc. – main site pages
- `css/` – stylesheets
- `js/` – JavaScript modules
- `includes/` – reusable PHP components
- `newsletter.php` – newsletter subscription page

## Running locally
Any PHP capable server can be used. A simple way is via PHP's built-in server:

```bash
php -S localhost:8000
```

Then open `http://localhost:8000/index.html` in your browser.

## Development notes
- JavaScript and CSS are split into separate files for easier maintenance.
- Newsletter subscriptions are stored in `newsletter-subscribers.txt`.

Feel free to adapt the content and styles to your needs.
