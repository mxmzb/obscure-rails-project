source "https://rubygems.org"
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby "3.0.2"

gem "rails", "7.0.0.alpha2"

# Use local checkout of Rails, just `git clone https://github.com/rails/rails`
# into a directory and specify the path here
# gem "rails", path: "/Volumes/Projects/rails"

# Use mysql as the database for Active Record
gem "mysql2", "~> 0.5"

# Use the Puma web server [https://github.com/puma/puma]
gem "puma", "~> 5.0"

# Bundle and transpile JavaScript [https://github.com/rails/jsbundling-rails]
gem "jsbundling-rails", "~> 0.1.0"

# Hotwire's SPA-like page accelerator [https://turbo.hotwired.dev]
gem "turbo-rails", ">= 0.7.11"

# Hotwire's modest JavaScript framework [https://stimulus.hotwired.dev]
gem "stimulus-rails", ">= 0.4.0"

# Bundle and process CSS [https://github.com/rails/cssbundling-rails]
gem "cssbundling-rails", ">= 0.1.0"

# Build JSON APIs with ease [https://github.com/rails/jbuilder]
gem "jbuilder", "~> 2.7"

# Use Redis adapter to run Action Cable in production
# gem "redis", "~> 4.0"

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem "tzinfo-data", platforms: %i[ mingw mswin x64_mingw jruby ]

# Use Active Model has_secure_password [https://guides.rubyonrails.org/active_model_basics.html#securepassword]
# gem "bcrypt", "~> 3.1.7"

# Use Sass to process CSS
# gem "sassc-rails", "~> 2.1"

# Use Active Storage variants [https://guides.rubyonrails.org/active_storage_overview.html#transforming-images]
# gem "image_processing", "~> 1.2"


gem 'rexml', '~> 3.2'

group :development, :test do
  # Start debugger with binding.b [https://github.com/ruby/debug]
  gem "debug", ">= 1.0.0", platforms: %i[ mri mingw x64_mingw ]

  gem "rspec-rails"
  gem "guard-livereload", '~> 2.5', require: false
  gem "rack-livereload"
  gem "guard-rspec", require: false
end

group :development do
  # Use console on exceptions pages [https://github.com/rails/web-console]
  gem "web-console", ">= 4.1.0"

  # Add speed badges [https://github.com/MiniProfiler/rack-mini-profiler]
  # gem "rack-mini-profiler", ">= 2.3.3"

  # Speed up commands on slow machines / big apps [https://github.com/rails/spring]
  # gem "spring"
end

group :test do
  # Use system testing [https://guides.rubyonrails.org/testing.html#system-testing]
  gem "capybara", ">= 3.26"
  gem "selenium-webdriver"
  gem "webdrivers"
end
