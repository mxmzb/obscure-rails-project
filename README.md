# README

## Architectural decisions

#### 1. Going API-less

I didn't want to deal with writing a dedicated REST API (or any other kind of API) and generate the UI part with plain JS (whether that would mean to constructing elements in JS or coming up with some kind of template) nor did I feel the wish to inject my view partials into the js through the use of .erb.js. So the app concept is basically just sending form data, using the HTML response, cherry pick HTML elements and render them into the current page.

#### 2. Dependencies

Only Tailwind, because it seemed to be a quick solution for the little design requirements and the focus didn't seem to lay on CSS. Besides that, I took the "vanilla JS" approach in the challenge description literally. There is only dev tooling deps and setup (guard, rspec, bundling, etc.)


## What I would do differently next time

I wouldn't try to write generic / abstract version for the MVP (unless I had a really, really clear idea of all the special cases on the horizon). In particular, I had initially tried to make a generic modal and form handler, but as I ran into new exceptional behaviors (for example not closing the modal when the form submission yields errors or updating the average rating through a second request) I decided to retreat from the abstraction.

PS.: Tbh, this is not the first time I'm doing this mistake. But also I wanted to impress with my code more than usually, so I wasn't strong enough to resist.

## Testing

`bundle exec rspec`

All the useful tests are in [`spec/features/reviews_spec.rb`](spec/features/reviews_spec.rb)